import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import pg from "pg";
import session from "express-session";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import flash from "connect-flash";
import cors from "cors";
import multer from "multer";

const app = express();
const port = process.env.PORT;

// connect to database
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
// Multer File Upload Storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
db.connect();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors(corsOptions));
app.use(flash());

async function getAllPosts() {
  try {
    const posts = [];
    const result = await db.query(
      "SELECT posts.id, posts.content, posts.title, posts.created_at, posts.updated_at, posts.author_username, users.profile_pic_file, users.profile_pic_url FROM posts INNER JOIN users ON posts.author_username = users.username;"
    );
    result.rows.forEach((post) => {
      posts.push(post);
    });
    return posts;
  } catch (error) {
    console.error(error);
  }
}
app.get("/current-user", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ message: "User is not authenticated" });
  }
});
app.get("/", async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

app.post("/add-post", (req, res) => {
  const { title, content } = req.body;
  try {
    db.query(
      "INSERT INTO posts (title, content, author_username) VALUES ($1, $2, $3)",
      [title, content, req.user.username]
    );
    res.status(201).json({ message: "Post saved" });
  } catch (error) {
    res.status(500).json({ message: "Error saving post" });
  }
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  console.log("Delete route getting hit");
  try {
    await db.query("DELETE FROM posts WHERE id = $1 RETURNING*", [id]);
    res.redirect("/");
  } catch (error) {
    console.log("Error deleting posts");
  }
});

app.patch("/update/:id", async (req, res) => {
  const { title, content } = req.body;
  const id = req.params.id;
  try {
    const result = await db.query("SELECT * FROM posts WHERE id = $1", [id]);
    const post = result.rows[0];
    console.log("Post data found", post);
    const newPostContent = {
      title: title || post.title,
      content: content || post.content,
    };
    try {
      await db.query(
        "UPDATE posts SET title = $1, content = $2 , updated_at = $3 WHERE id =$4",
        [
          newPostContent.title,
          newPostContent.content,
          new Date().toISOString(),
          id,
        ]
      );
      res.status(200).json({ message: "Post updated", post: newPostContent });
    } catch (error) {
      res.status(500).json({ message: "Error updating post" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error locating post" });
  }
});
app.get("/posts/:postID", async (req, res) => {
  const postID = req.params.postID;
  try {
    const result = await db.query(
      "SELECT posts.id, posts.content, posts.title, posts.created_at, posts.updated_at, posts.author_username, users.profile_pic_file, users.profile_pic_url FROM posts INNER JOIN users ON posts.author_username = users.username WHERE posts.id = $1",
      [postID]
    );
    const post = result.rows[0];
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});
app.get("/:username/posts", async (req, res) => {
  const username = decodeURIComponent(req.params.username.trim());

  try {
    const result = await db.query(
      "SELECT * FROM posts WHERE author_username = $1",
      [username]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No posts found for this user." });
    }
    const posts = result.rows;
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/add-user", upload.single("profilePicFile"), async (req, res) => {
  const { email, password, name, username } = req.body;
  const profilePic = req.file?.buffer;
  console.log(profilePic);
  const profilePicFile = req.file;
  // hash user password
  // salt rounds for layers of security
  const saltRound = 10;
  bcrypt.hash(password, saltRound, async (error, hash) => {
    if (error) {
      console.log("Error hashing", error);
      return res.status(500).json({ message: "Error encrypting password" });
    } else {
      try {
        const checkUserResult = await db.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );
        if (checkUserResult.rows.length > 0) {
          return res.status(409).json({ message: "User already exists" });
        }

        const result = await db.query(
          "INSERT INTO users (name, username, email, password, profile_pic_file) VALUES ($1, $2, $3, $4, $5) RETURNING*",
          [name, username, email, hash, profilePic]
        );
        const user = result.rows[0];

        req.logIn(user, (error) => {
          if (error) {
            console.log("Login error:", error);
            return res.status(500).json({ message: "Login Error" });
          }
          return res.status(201).json({
            message: "User created",
            user: req.user,
          });
        });
      } catch (error) {
        console.log("Error adding user", error);
        return res.status(500).json({ message: "Error adding user" });
      }
    }
  });
});
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
app.get(
  "/auth/google/googleLogIn",
  passport.authenticate("google", {
    successRedirect: process.env.FRONTEND_URL,
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  })
);
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return res
        .status(500)
        .json({ success: false, message: "Error executing database queries" });
    }
    if (!user) {
      return res.status(404).json({ success: false, message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: info.message });
      }
      return res
        .status(200)
        .json({ success: true, message: "Login successfully", user });
    });
  })(req, res, next);
});

async function getQueryForLogin(username) {
  const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
  try {
    let result;
    if (emailRegex.test(username)) {
      result = await db.query("SELECT * FROM users WHERE email = $1", [
        username,
      ]);
    } else {
      result = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);
    }
    return result;
  } catch (error) {
    console.log("Error getting query for login", error);
  }
}
app.post("/log-out", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Log Out Error" });
    }
    // Destroy the session and clear the cookie
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to destroy session" });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});
app.get("/profile", async (req, res) => {
  const authorUsername = req.user.username;
  // need to pass user posts here
  try {
    const result = await db.query(
      "SELECT * FROM posts WHERE author_username = $1",
      [authorUsername]
    );
    const posts = result.rows;
    res.render("profile.ejs", { posts: posts });
  } catch (error) {
    console.log("Error getting user posts", error);
  }
});
// trigger the local strategy to authenticate the user from local passport
passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      console.log("Username & Password: ", username, password);
      const result = await getQueryForLogin(username);

      if (result.rows.length > 0) {
        const user = result.rows[0];
        const hashPassword = user.password;
        bcrypt.compare(password, hashPassword, (error, valid) => {
          if (error) {
            console.log("Error comparing password");
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb(null, false, { message: "Invalid password" });
            }
          }
        });
      } else {
        return cb(null, false, { message: "User not found" });
      }
    } catch (error) {
      return cb(error);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log("User data from gmail: ", profile);
      try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          profile.email,
        ]);
        if (result.rows.length === 0) {
          const newUser = await db.query(
            "INSERT INTO users (email, password, username, profile_pic_url) VALUES($1, $2, $3, $4) RETURNING*",
            [profile.email, "google", profile.displayName, profile.picture]
          );
          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, result.rows[0]);
        }
      } catch (error) {
        return cb(error);
      }
    }
  )
);

// store and retrieve user data from local storage
passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Blog Web app listening at http://localhost:${port}`);
});

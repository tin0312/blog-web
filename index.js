import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import pg from "pg";
import methodOverride from "method-override";
import session from "express-session";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";

const app = express();
const port = process.env.PORT;
let posts = [];

// connect to database
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
// use middleware method override to support PUT & DELETE where client doesnt support it
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // Do not save session if unmodified
    saveUninitialized: false, // Do not create session until something is stored
    cookie: {
      secure: false,
      httpOnly: true, // Prevent client-side JS from accessing the cookie
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Middleware to make isAuthenticated available in all templates
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

async function getAllPosts() {
  try {
    const posts = [];
    const result = await db.query("SELECT * FROM posts");
    result.rows.forEach((post) => {
      posts.push(post);
    });
    return posts;
  } catch (error) {
    console.error(error);
  }
}

app.get("/", async (req, res) => {
  const posts = await getAllPosts();
  res.render("posts.ejs", { posts: posts });
});

app.get("/create-post", (req, res) => {
  res.render("create-post.ejs", { posts });
});

app.post("/add-post", async (req, res) => {
  const currentUsername = req.user.username;
  const { title, body } = req.body;
  try {
    db.query(
      "INSERT INTO posts (title, content, author_username) VALUES ($1, $2, $3)",
      [title, body, currentUsername]
    );
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await db.query("DELETE FROM posts WHERE id = $1 RETURNING*", [id]);
    res.redirect("/");
  } catch (error) {
    console.log("Error deleting posts");
  }
});

app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query("SELECT * FROM posts WHERE id = $1", [id]);
    res.render("editPost.ejs", {
      post: result.rows[0],
    });
  } catch (error) {
    console.log("Error fetching post");
  }
});
app.patch("/update/:id", async (req, res) => {
  const { title, body } = req.body;
  const id = req.params.id;
  try {
    const result = await db.query("SELECT * FROM posts WHERE id = $1", [id]);
    const post = result.rows[0];
    const newPostContent = {
      title: title || post.title,
      body: body || post.body,
    };
    try {
      await db.query("UPDATE posts SET title = $1, content = $2 , updated_at = $3 WHERE id =$4", [
        newPostContent.title,
        newPostContent.body,
        new Date().toISOString(),
        id,
      ]);
      res.redirect("/");
    } catch (error) {
      console.log("Error saving post");
    }
  } catch (error) {
    console.log("Error locating selected post");
  }
});
app.get("/posts/:postID", async (req, res) => {
  const postID = req.params.postID;
  try {
    const result = await db.query("SELECT * FROM posts WHERE id = $1", [
      postID,
    ]);
    const post = result.rows[0];
    res.render("post.ejs", { post: post, isEditable: false });
  } catch (error) {
    res.json(error);
  }
});
app.get("/posts/:username/:postID", async (req, res) => {
  console.log("username :", req.params.username);
  try {
    const result = await db.query(
      "SELECT * FROM posts WHERE id = $1 AND author_username = $2",
      [req.params.postID, req.params.username]
    );
    const post = result.rows[0];
    res.render("post.ejs", { post: post, isEditable: true });
  } catch (error) {
    res.json(error);
  }
});
app.get("/signup", (req, res) => {
  res.render("auth/signup.ejs");
});

app.post("/add-user", async (req, res) => {
  const { email, password, name, username } = req.body;
  // hash user password
  // salt rounds for layers of security
  const saltRound = 10;
  bcrypt.hash(password, saltRound, async (error, hash) => {
    if (error) {
      console.log("Error hashing", error);
    } else {
      try {
        const result = await db.query(
          "INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING*",
          [name, username, email, hash]
        );
        const user = result.rows[0];
        req.login(user, (error) => {
          console.log(error);
          res.redirect("/");
        });
      } catch (error) {
        console.log("Error adding user");
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
    successRedirect: "/",
    failureRedirect: "/login",
  })
);
app.get("/login", (req, res) => {
  res.render("auth/login.ejs");
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

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
app.get("/log-out", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
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
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (error) {
      console.log("Loggin Error", error);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "https://blog-web-ennj.onrender.com/auth/google/googleLogIn",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          profile.email,
        ]);
        if (result.rows.length === 0) {
          const newUser = await db.query(
            "INSERT INTO users (email, password, username) VALUES($1, $2, $3) RETURNING*",
            [profile.email, "google", profile.displayName]
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

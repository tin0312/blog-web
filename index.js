import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import pg from "pg";
import methodOverride from "method-override";
import session from "express-session";

const app = express();
const port = process.env.PORT || 3000;
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
    secret: process.env.SESSION_SECRET || "default_secret", // Use an environment variable for the secret
    resave: false, // Do not save session if unmodified
    saveUninitialized: false, // Do not create session until something is stored
    cookie: {
      secure: false,
      httpOnly: true, // Prevent client-side JS from accessing the cookie
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Middleware to make isAuthenticated available in all templates
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated || false;
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
  const { title, body } = req.body;
  try {
    db.query("INSERT INTO posts (title, content) VALUES ($1, $2)", [
      title,
      body,
    ]);
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

app.delete("/delete/:id", async (req, res) => {
  const posts = await getAllPosts();
  const id = req.params.id;
  try {
    const result = await db.query(
      "DELETE FROM posts WHERE id = $1 RETURNING*",
      [id]
    );
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
      const result = await db.query(
        "UPDATE posts SET title = $1, content = $2 WHERE id =$3",
        [newPostContent.title, newPostContent.body, id]
      );
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
    res.render("post.ejs", { post: post });
  } catch (error) {
    res.json(error);
  }
});

app.get("/register", (req, res) => {
  res.render("auth/emailSignup.ejs");
});

app.post("/add-user", async (req, res) => {
  const { email, password, name, username } = req.body;
  console.log(
    `Email: ${email} \n Password: ${password} \n name: ${name} \n username: ${username}`
  );
  try {
    const result = await db.query(
      "INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING*",
      [name, username, email, password]
    );
    console.log("result after inserted", result.rows[0]);
    res.redirect("/emailLogin");
  } catch (error) {
    console.log("Error adding user");
  }
});
app.get("/emailLogin", (req, res) => {
  res.render("auth/emailLogin.ejs");
});
app.post("/login", async (req, res) => {
  const posts = await getAllPosts();
  const { usernameOrEmail, password } = req.body;
  try {
    const result = await getQueryForLogin(usernameOrEmail);
    if (result.rows[0].length == 0) {
      res.json({ message: "User not found" });
    } else {
      if (password == result.rows[0].password) {
        req.session.isAuthenticated = true;
        res.redirect("/");
      } else {
        res.json({ message: "Invalid Password" });
      }
    }
  } catch (error) {
    console.log("Error loggin in", error);
  }
});

async function getQueryForLogin(usernameOrEmail) {
  const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
  try {
    let result;
    if (emailRegex.test(usernameOrEmail)) {
      result = await db.query("SELECT * FROM users WHERE email = $1", [
        usernameOrEmail,
      ]);
    } else {
      result = await db.query("SELECT * FROM users WHERE username = $1", [
        usernameOrEmail,
      ]);
    }
    return result;
  } catch (error) {
    console.log("Error getting query for login", error);
  }
}
app.get("/log-out", (req, res) => {
  req.session.destroy();
  res.redirect("/emailLogin");
});
app.listen(port, () => {
  console.log(`Blog Web app listening at http://localhost:${port}`);
});

import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import pg from "pg";
import methodOverride from "method-override";

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
  res.render("newsFeed.ejs", { posts: posts });
});

app.get("/my-posts", async (req, res) => {
  const posts = await getAllPosts();
  res.render("my-posts.ejs", { posts: posts });
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

app.get("/my-posts", (req, res) => {
  res.render("my-posts.ejs", { posts });
});

app.delete("/delete/:id", async (req, res) => {
  const posts = await getAllPosts();
  const id = req.params.id;
  console.log("hitting post delete route");
  try {
    const result = await db.query(
      "DELETE FROM posts WHERE id = $1 RETURNING*",
      [id]
    );
    res.redirect("/my-posts");
  } catch (error) {
    console.log("Error deleting posts");
  }
});

app.patch("/edit/:id", (req, res) => {
  const id = req.params.id;
  console.log("hitting post edit route");
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

app.listen(port, () => {
  console.log(`Blog Web app listening at http://localhost:${port}`);
});

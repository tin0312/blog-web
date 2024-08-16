import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import pg from "pg";

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
  } catch (error) {
    console.error(error);
  }
  res.render("my-posts.ejs", { posts });
});

app.get("/my-posts", (req, res) => {
  res.render("my-posts.ejs", { posts });
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  console.log("Delete request received for post ID:", id);
  posts = posts.filter((post) => post.id !== id);
  res.json({ success: true });
});

app.put("/update/:id", (req, res) => {
  const id = req.params.id;
  const index = posts.findIndex((post) => post.id === id);
  if (index !== -1) {
    posts[index].title = req.body.title;
    posts[index].body = req.body.body;
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.listen(port, () => {
  console.log(`Blog Web app listening at http://localhost:${port}`);
});

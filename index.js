import express from "express";
import bodyParser from "body-parser";
import { nanoid } from "nanoid";

const app = express();
const port = 3000;
let posts = [];

// Access body content of form input and JSON data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this line to parse JSON data
// Use static files
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("newsFeed.ejs", { posts });
});

app.get("/create-post", (req, res) => {
  res.render("create-post.ejs", { posts });
});

app.post("/my-posts", (req, res) => {
  posts.push({
    id: nanoid(),
    title: req.body.title,
    body: req.body.body,
  });
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

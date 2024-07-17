import express from "express";
import bodyParser from "body-parser";
import { nanoid } from "nanoid";

const app = express();
const port = 3000;
let posts = [];

//access body content of form input
app.use(bodyParser.urlencoded({ extended: true }));
// use static files
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
  res.render("my-posts.ejs", {
    posts,
  });
});

app.get("/my-posts", (req, res) => {
  res.render("my-posts.ejs", {
    posts,
  });
});
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  console.log("Delete request received for post ID:", id);
  posts = posts.filter((post) => post.id !== id);
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Blog Web app listening at http://localhost:${port}`);
});

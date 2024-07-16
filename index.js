import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const posts = [];

//access body content of form input
app.use(bodyParser.urlencoded({ extended: true }));
// use static files
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("newsFeed.ejs", { posts });
});

app.get("/create-post", (req, res) => {
  res.render("create-post.ejs", { posts: posts });
});
app.post("/my-posts", (req, res) => {
  posts.push(req.body);
  res.render("my-posts.ejs", {
    posts,
  });
});

app.get("/my-posts", (req, res) => {
  res.render("my-posts.ejs", {
    posts,
  });
});

app.listen(port, () => {
  console.log(`Blog Web app listening at http://localhost:${port}`);
});

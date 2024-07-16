import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

//access body content of form input
app.use(bodyParser.urlencoded({ extended: true }));
// use static files
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("newsFeed.ejs");
});
app.get("/create-post", (req, res) => {
  res.render("create-post.ejs");
});
app.post("/", (req, res) => {
  console.log(req.body);
  res.render("newsFeed.ejs", {
    title: req.body["title"],
    body: req.body["body"],
  });
});

app.listen(port, () => {
  console.log(`Blog Web app listening at http://localhost:${port}`);
});

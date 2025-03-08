import db from "../db.js";

async function getAllPosts(req, res) {
  const {category} = req.params;
  try {
    const result = await db.query(
      "SELECT posts.id, posts.content, posts.title, posts.created_at, posts.updated_at, posts.author_username, posts.category, users.profile_pic_file, users.profile_pic_url FROM posts INNER JOIN users ON posts.author_username = users.username WHERE category = $1", [category]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
  }
}

async function addPost(req, res) {
  const { title, content, username, category } = req.body;
  let coverImg = req.file?.buffer
  try {
    await db.query(
      "INSERT INTO posts (title, content, author_username, cover_image, category) VALUES ($1, $2, $3, $4, $5)",
      [title, content, username, coverImg, category]
    );
    res.status(201).json({ message: "Post saved" });
  } catch (error) {
    res.status(500).json({ message: "Error saving post" });
  }
}
async function updatePost(req, res) {
  const { title, content } = req.body;
  let coverImg = req.file?.buffer
  const id = req.params.id;
  try {
    const result = await db.query("SELECT * FROM posts WHERE id = $1", [id]);
    const post = result.rows[0];
    const newPostContent = {
      title: title || post.title,
      content: content || post.content,
      coverImg: coverImg || post.cover_image
    };
    try {
      await db.query(
        "UPDATE posts SET title = $1, content = $2 , cover_image = $3, updated_at = $4 WHERE id =$5",
        [
          newPostContent.title,
          newPostContent.content,
          newPostContent.coverImg,
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
}

async function deletePost(req, res) {
  const id = req.params.id;
  try {
    await db.query("DELETE FROM posts WHERE id = $1 RETURNING*", [id]);
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
}

async function getPost(req, res) {
  const postID = req.params.postID;
  try {
    const result = await db.query(
      `SELECT posts.id, posts.content, posts.title, posts.created_at, posts.updated_at, posts.author_username, 
              posts.category, posts.cover_image, users.profile_pic_file, users.profile_pic_url 
       FROM posts 
       INNER JOIN users ON posts.author_username = users.username 
       WHERE posts.id = $1`,
      [postID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = result.rows[0];
    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "An error occurred while fetching the post." });
  }
}


async function getUserPosts(req, res) {
  const username = decodeURIComponent(req.params.username.trim());
  try {
    const result = await db.query(
      "SELECT posts.id, posts.content, posts.title, posts.created_at, posts.updated_at, posts.author_username, posts.category, users.profile_pic_file, users.profile_pic_url FROM posts INNER JOIN users ON posts.author_username = users.username WHERE author_username = $1",
      [username]
    );
    if (result.rows.length === 0) {
      return res.status(204).send();
    }
    const posts = result.rows;
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export {
  getAllPosts,
  addPost,
  deletePost,
  updatePost,
  getPost,
  getUserPosts,
};

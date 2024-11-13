import db from "../db.js";

async function getAllPosts(req, res) {
  try {
    const result = await db.query(
      "SELECT posts.id, posts.content, posts.title, posts.created_at, posts.updated_at, posts.author_username, posts.likecount, posts.helpfulcount, posts.brilliantcount, users.profile_pic_file, users.profile_pic_url FROM posts INNER JOIN users ON posts.author_username = users.username;"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
  }
}

async function addPost(req, res) {
  const { title, content, username } = req.body;
  try {
    await db.query(
      "INSERT INTO posts (title, content, author_username) VALUES ($1, $2, $3)",
      [title, content, username]
    );
    res.status(201).json({ message: "Post saved" });
  } catch (error) {
    console.log("I am sending 500 status code back");
    res.status(500).json({ message: "Error saving post" });
  }
}

async function addReaction(req, res) {
  const { likeCount, helpfulCount, brilliantCount } = req.body;
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    const post = result.rows[0];
    const newReaction = {
      likeCount: likeCount ?? post.likecount,
      helpfulCount: helpfulCount ?? post.helpfulcount,
      brilliantCount: brilliantCount ?? post.brilliantcount,
    };
    try {
      await db.query(
        "UPDATE posts SET likecount = $1, helpfulcount= $2, brilliantcount= $3 WHERE id= $4",
        [
          newReaction.likeCount,
          newReaction.helpfulCount,
          newReaction.brilliantCount,
          id,
        ]
      );
      res.status(200).json({ message: "Reactions updated" });
    } catch (error) {
      res.status(500).json({ message: "Error updating reactions" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error finding post" });
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

async function updatePost(req, res) {
  const { title, content } = req.body;
  const id = req.params.id;
  try {
    const result = await db.query("SELECT * FROM posts WHERE id = $1", [id]);
    const post = result.rows[0];
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
}

async function getPost(req, res) {
  const postID = req.params.postID;
  try {
    const result = await db.query(
      "SELECT posts.id, posts.content, posts.title, posts.created_at, posts.updated_at, posts.author_username, posts.likecount, posts.helpfulcount, posts.brilliantcount, users.profile_pic_file, users.profile_pic_url FROM posts INNER JOIN users ON posts.author_username = users.username WHERE posts.id = $1",
      [postID]
    );
    const post = result.rows[0];
    res.json(post);
  } catch (error) {
    res.json(error);
  }
}

async function getUserPosts(req, res) {
  const username = decodeURIComponent(req.params.username.trim());

  try {
    const result = await db.query(
      "SELECT posts.id, posts.content, posts.title, posts.created_at, posts.updated_at, posts.author_username, posts.likecount, posts.helpfulcount, posts.brilliantcount, users.profile_pic_file, users.profile_pic_url FROM posts INNER JOIN users ON posts.author_username = users.username WHERE author_username = $1",
      [username]
    );
    if (result.rows.length === 0) {
      return res.status(204).send();
    }
    const posts = result.rows;
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export {
  getAllPosts,
  addPost,
  addReaction,
  deletePost,
  updatePost,
  getPost,
  getUserPosts,
};

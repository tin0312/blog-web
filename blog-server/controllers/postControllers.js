import db from "../db.js";

async function getAllPosts(req, res) {
  const { category } = req.params;
  try {
    const result = await db.query(
      "SELECT posts.id, posts.content, posts.title, posts.created_at, posts.updated_at, posts.author_username, posts.category, posts.author_id, users.profile_pic_file, users.profile_pic_url FROM posts INNER JOIN users ON posts.author_username = users.username WHERE category = $1", [category]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
  }
}

async function addPost(req, res) {
  const { title, content, username, category, authorId } = req.body;
  let coverImg = req.file?.buffer
  try {
    await db.query(
      "INSERT INTO posts (title, content, author_username, cover_image, category, author_id) VALUES ($1, $2, $3, $4, $5, $6)",
      [title, content, username, coverImg, category, authorId]
    );
    res.status(201).json({ message: "Post saved" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error saving post" });
  }
}
async function addReaction(req, res) {
  let existingReaction;
  const { postId, currentUserId, authorId, love, agree, mindBlown, onFire } = req.body;
  try {
    existingReaction = await db.query("SELECT * FROM reactions WHERE reaction_id = $1", [postId])
    if (existingReaction.rows.length === 0) {
      try {
        await db.query("INSERT INTO reactions (interacted_user_id, author_id, post_id, love_count, agree_count, mind_blown_count, on_fire_count, reaction_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [
          currentUserId,
          authorId,
          postId,
          love,
          agree,
          mindBlown,
          onFire,
          postId
        ])
      } catch (error) {
        console.log("Error saving reactions to posts", error)
      }
    } else {
      try {
        await db.query("UPDATE reactions SET interacted_user_id = $1, author_id = $2, love_count=$3, agree_count= $4, mind_blown_count= $5, on_fire_count= $6 WHERE reaction_id = $7", [
          currentUserId,
          authorId,
          love,
          agree,
          mindBlown,
          onFire,
          postId
        ])
      } catch (error) {
        console.log("Error updaing post reactions", error)
      }
    }
  } catch (error) {
    console.log("Error locating reacted post", error)
  }
}
async function updatePost(req, res) {
  const { title, content, category } = req.body;
  let coverImg = req.file?.buffer
  const id = req.params.id;
  try {
    const result = await db.query("SELECT * FROM posts WHERE id = $1", [id]);
    const post = result.rows[0];
    const newPostContent = {
      title: title || post.title,
      content: content || post.content,
      category: category || post.category,
      coverImg: coverImg || post.cover_image
    };
    try {
      await db.query(
        "UPDATE posts SET title = $1, content = $2 , category=$3, cover_image = $4, updated_at = $5 WHERE id =$6",
        [
          newPostContent.title,
          newPostContent.content,
          newPostContent.category,
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
              posts.category, posts.cover_image, posts.author_id, users.profile_pic_file, users.profile_pic_url,
              reactions.love_count, reactions.agree_count, reactions.mind_blown_count, reactions.on_fire_count, reactions.total_reaction_count 
       FROM posts 
       INNER JOIN users ON posts.author_id = users.id 
       LEFT JOIN reactions ON posts.id = reactions.post_id
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
  const username = Buffer.from(req.params.username, 'base64').toString('utf-8');

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
  addReaction
};

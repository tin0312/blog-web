import db from "../db.js";
import { clients } from "../setupWebSocket.js";
import { getProfile } from "./userControllers.js";


async function getAllPosts(req, res) {
  const { category } = req.params;
  try {
    const result = await db.query(
      "SELECT posts.id, posts.content, posts.title, posts.created_at, posts.updated_at, posts.author_username, posts.category, posts.author_id, users.profile_pic_file, users.profile_pic_url FROM posts INNER JOIN users ON posts.author_id = users.id WHERE category = $1", [category]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
  }
}
async function getNotificationCount(req, res) {
  const includeContent = req.query.content === "true";
  const userId = req?.user?.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    const result = await db.query(
      "SELECT * FROM notifications WHERE receiver_id = $1 AND is_read = false",
      [userId]
    );
    if(includeContent){
      res.status(200).json(result.rows);
    } else {
      res.status(200).json({ unreadCount: result.rows.length});
    }
  } catch (error) {
    console.error("Error getting notification count", error);
    res.status(500).json({ error: "An error occurred while fetching notification count" });
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
    existingReaction = await db.query("SELECT * FROM reactions WHERE post_id = $1 AND interacted_user_id = $2", [postId, currentUserId]);
    if (existingReaction.rows.length === 0) {
      // If no previous reaction, insert new reaction
      try {
        await db.query("INSERT INTO reactions (interacted_user_id, author_id, post_id, love_count, agree_count, mind_blown_count, on_fire_count) VALUES ($1, $2, $3, $4, $5, $6, $7)", [
          currentUserId,
          authorId,
          postId,
          love,
          agree,
          mindBlown,
          onFire
        ]);

        // Insert the notification into the database
        if (authorId !== currentUserId) {
          const message = await handleReactionMessage(postId, currentUserId, authorId); // Generate the message after inserting the notification
          await sendNotification(currentUserId, authorId, postId, "reaction", message); // Send the notification and message
        }

        return res.sendStatus(200);
      } catch (error) {
        console.log("Error saving reactions to posts", error);
      }
    } else {
      // Reaction exists, check if it has changed
      const prevReaction = existingReaction.rows[0];
      const reactionChanged =
        prevReaction.love_count !== love ||
        prevReaction.agree_count !== agree ||
        prevReaction.mind_blown_count !== mindBlown ||
        prevReaction.on_fire_count !== onFire;

      if (!reactionChanged) {
        return res.status(200).json({ message: "Reaction unchanged" });
      }

      try {
        // Update the reaction
        await db.query("UPDATE reactions SET love_count=$1, agree_count=$2, mind_blown_count=$3, on_fire_count=$4 WHERE interacted_user_id = $5", [
          love,
          agree,
          mindBlown,
          onFire,
          currentUserId
        ]);

        // Insert the notification into the database
        if (authorId !== currentUserId) {
          const message = await handleReactionMessage(postId, currentUserId, authorId); // Generate the message after inserting the notification
          await sendNotification(currentUserId, authorId, postId, "reaction", message); // Send the notification and message
        }

        return res.sendStatus(200);
      } catch (error) {
        console.log("Error updating post reactions", error);
      }
    }
  } catch (error) {
    console.log("Error locating reacted post", error);
  }
}

async function handleReactionMessage(postId, currentUserId, authorId) {
  // Get the username of the current user (who is reacting)
  const { username } = await getProfile(currentUserId);
  try {
    // Insert the notification first
    await db.query("INSERT INTO notifications (sender_id, receiver_id, post_id, type, message) VALUES ($1, $2, $3, $4, $5)", [
      currentUserId, authorId, postId, "reaction", `${username} reacted to your post`
    ]);

    // Now fetch the updated notifications count for the post
    const result = await db.query("SELECT * FROM notifications WHERE post_id = $1", [postId]);
    const numberOfRecords = result.rowCount;
    if (numberOfRecords > 1) {
      // Get the first sender's username
      const firstSenderId = result.rows[0]?.sender_id;
      const firstSender = await getProfile(firstSenderId);
      return `${firstSender.username} and ${numberOfRecords - 1} other people reacted to your post`;
    } else {
      return `${username} reacted to your post`;
    }
  } catch (error) {
    console.log("Error retrieving notification records", error);
  }
}

async function sendNotification(senderId, receiverId, postId, type, message) {
  try {
    const result = await db.query(
      "UPDATE notifications SET message = $1 WHERE sender_id = $2 and post_id = $3 RETURNING *",
      [message, senderId, postId]
    );

    const notification = result.rows[0];
    if (clients.has(receiverId)) {
      const receiverSocket = clients.get(receiverId);
      if (receiverSocket) {
        receiverSocket.send(JSON.stringify(notification));
      }
    }
    return notification;
  } catch (error) {
    console.error("Error saving notifications:", error);
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
  const currentUserId = req.user ? req?.user.id : null;
  try {
    const result = await db.query(
      `SELECT 
  posts.id, 
  posts.content, 
  posts.title, 
  posts.created_at, 
  posts.updated_at, 
  posts.author_username, 
  posts.category, 
  posts.cover_image, 
  posts.author_id, 
  users.profile_pic_file, 
  users.profile_pic_url,
  COALESCE(ARRAY_AGG(DISTINCT reactions.interacted_user_id) FILTER (WHERE reactions.interacted_user_id IS NOT NULL), '{}') AS interacted_users,
  COALESCE(SUM(reactions.love_count), 0)::INTEGER AS love_count, 
  COALESCE(SUM(reactions.agree_count), 0)::INTEGER AS agree_count, 
  COALESCE(SUM(reactions.mind_blown_count), 0)::INTEGER AS mind_blown_count, 
  COALESCE(SUM(reactions.on_fire_count), 0)::INTEGER AS on_fire_count, 
  COALESCE(SUM(reactions.total_reaction_count), 0)::INTEGER AS total_reaction_count 
FROM posts 
INNER JOIN users ON posts.author_id = users.id 
LEFT JOIN reactions ON posts.id = reactions.post_id
WHERE posts.id = $1
GROUP BY posts.id, users.profile_pic_file, users.profile_pic_url
`,
      [postID]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    const postData = result.rows[0];
    const { interacted_users, ...post } = postData
    const hasUserReacted = interacted_users.includes(currentUserId);
    const emotionStates = hasUserReacted ? await findCurrentUserEmotionStates(currentUserId) : {
      is_love: false,
      is_agree: false,
      is_mindblown: false,
      is_onfire: false
    }
    res.json({ ...post, emotionStates });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "An error occurred while fetching the post." });
  }
}

async function findCurrentUserEmotionStates(userId) {
  try {
    const result = await db.query("SELECT is_love, is_agree, is_mindblown, is_onfire FROM reactions WHERE interacted_user_id = $1", [userId]);
    return result.rows[0]
  } catch (error) {
    console.log("Error finding current user emotions", error)
  }
}

async function getUserPosts(req, res) {
  const username = Buffer.from(req.params.username, 'base64').toString('utf-8');

  try {
    const result = await db.query(
      "SELECT posts.id, posts.content, posts.title, posts.created_at, posts.updated_at, posts.author_username, posts.category, posts.author_id, users.profile_pic_file, users.profile_pic_url FROM posts INNER JOIN users ON posts.author_username = users.username WHERE author_username = $1",
      [username]
    );
    if (result.rows.length === 0) {
      return res.sendStatus(204);
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
  addReaction,
  getNotificationCount
};

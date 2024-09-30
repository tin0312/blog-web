import React, { useState } from "react";

function CreatePost() {
  const [post, setPost] = useState({
    title: "",
    content: "",
  });
  async function handlePost(event) {
    event.preventDefault();
    console.log("Post is being created...");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/add-post`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            title: post.title,
            content: post.content,
          }),
          credentials: "include",
        }
      );
    } catch (error) {
      console.log("Error saving post", error);
    }
  }
  return (
    <div className="form-wrapper">
      <div className="form-container">
        <div>
          <div className="form-title section-title">
            <p>New Post</p>
          </div>
        </div>
        <form className="post-edit-form" onSubmit={handlePost}>
          <label for="title" aria-placeholder="hehe">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Post title"
            onChange={(event) =>
              setPost((post) => ({ ...post, title: event.target.value }))
            }
            required
          />
          <label for="body" aria-placeholder="sads">
            Body
          </label>
          <textarea
            id="body"
            name="body"
            placeholder="Post content"
            onChange={(event) =>
              setPost((post) => ({ ...post, content: event.target.value }))
            }
          ></textarea>
          <input type="submit" value="POST" />
        </form>
      </div>
    </div>
  );
}

export default CreatePost;

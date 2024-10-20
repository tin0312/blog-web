import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function CreatePost() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { error },
  } = useForm();
  const registerOptions = {
    title: { required: "Post Title required" },
    content: { required: "Post Content required" },
  };
  async function handlePost(post) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/posts/add-post`,
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
      if (response.status === 201) {
        navigate("/");
      }
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
        <form className="post-edit-form" onSubmit={handleSubmit(handlePost)}>
          <label for="title" aria-placeholder="hehe">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Post title"
            {...register("title", registerOptions.title)}
            required
          />
          <label for="body" aria-placeholder="sads">
            Body
          </label>
          <textarea
            id="body"
            name="content"
            placeholder="Post content"
            {...register("content", registerOptions.content)}
          ></textarea>
          <input type="submit" value="POST" />
        </form>
      </div>
    </div>
  );
}

export default CreatePost;

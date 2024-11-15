import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/AuthProvider";

function CreatePost() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const registerOptions = {
    title: { required: "Post Title required" },
    content: { required: "Post Content required" },
  };
  async function handlePost(post) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/add-post`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            title: post.title,
            content: post.content,
            username: user && user.username,
          }),
          credentials: "include",
        }
      );
      if (response.status === 201) {
        navigate("/");
      } else {
        setError("serverError", {
          type: "custom",
          message: "Failed to create post",
        });
        setTimeout(() => {
          setError("serverError", null);
        }, 1000);
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
          <label htmlFor="title" aria-placeholder="hehe">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Post title"
            {...register("title", registerOptions.title)}
          />
          {errors.title && (
            <p className="error-message">{errors.title.message}</p>
          )}
          <label htmlFor="body" aria-placeholder="sads">
            Body
          </label>
          <textarea
            id="body"
            name="content"
            placeholder="Post content"
            {...register("content", registerOptions.content)}
          ></textarea>
          {errors.content && (
            <p className="error-message">{errors.content.message}</p>
          )}
          {errors.serverError && (
            <p className="error-message">{errors.serverError.message}</p>
          )}
          <input type="submit" value="POST" />
        </form>
      </div>
    </div>
  );
}

export default CreatePost;

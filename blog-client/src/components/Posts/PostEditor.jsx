import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

function PostEditor() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: state?.title || "",
    content: state?.content || "",
  });

  async function handleEdit(event) {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/update/${state.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            title: post.title,
            content: post.content,
          }),
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        navigate(`/${state.author}/posts/${state.id}`, {
          state: {
            id: state.id,
            title: data.post.title,
            content: data.post.content,
            author: state.author,
            authenticatedUser: state.authenticatedUser,
            createdAt: state.createdAt,
          },
        });
      }
      if (response.status === 500) {
        alert("Error updating post");
        setPost({
          title: state.title,
          content: state.content,
        });
      }
    } catch (error) {
      console.error("Error editting post", error);
    }
  }
  return (
    <div>
      <div className="post-wrapper">
        <div
          className="post post-edit-form"
          style={
            !state
              ? {
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }
              : {}
          }
        >
          {state ? (
            <form onSubmit={handleEdit}>
              <input
                type="text"
                id="title"
                name="title"
                value={post.title}
                onChange={(event) =>
                  setPost((post) => ({ ...post, title: event.target.value }))
                }
              />
              <textarea
                id="auto-resizing-textarea"
                name="body"
                value={post.content}
                onChange={(event) =>
                  setPost((post) => ({ ...post, content: event.target.value }))
                }
              ></textarea>
              <div className="btn-container">
                <Link
                  state={{
                    id: state.id,
                    title: state.title,
                    content: state.content,
                    author: state.author,
                    authenticatedUser: state.authenticatedUser,
                    createdAt: state.createdAt,
                  }}
                  className="cancel-btn"
                  to=".."
                  relative="path"
                >
                  Cancel
                </Link>
                <input type="submit" value="Save" />
              </div>
            </form>
          ) : (
            <>
              <h1>Unauthorized access</h1>
              <p>You do not have permission to edit this post.</p>
              <Link to="..">Go back to Home</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostEditor;

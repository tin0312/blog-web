import React from "react";
import convertTimestamp from "../../helpers/convertTimestamp";
import { useNavigate } from "react-router-dom";

function Post(props) {
  const navigate = useNavigate();
  async function hanldeDeletePost(id) {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/delete/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.log("Error deleting post");
    }
  }

  function hanldeEditPost(
    id,
    title,
    content,
    author,
    authenticatedUser,
    createdAt
  ) {
    navigate(`/${author}/posts/${id}/edit`, {
      state: {
        id,
        title,
        content,
        author,
        authenticatedUser,
        createdAt,
      },
    });
  }

  const updatedTime = convertTimestamp(props.updatedAt);
  return (
    <div className={props.className || "post-container"}>
      <div>
        <h2>{props.title}</h2>
        <p className="post-content">{props.content}</p>
      </div>
      <div className="post-metadata">
        <p>
          <strong>by: </strong>
          {props.author}
        </p>
        <p>{new Date(props.createdAt).toLocaleDateString()}</p>
        <p>{updatedTime && updatedTime}</p>
        {props.authenticatedUser && (
          <div class="btn-container">
            <button onClick={() => hanldeDeletePost(props.id)}>Delete</button>
            <button
              onClick={() =>
                hanldeEditPost(
                  props.id,
                  props.title,
                  props.content,
                  props.author,
                  props.authenticatedUser,
                  props.createdAt
                )
              }
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;

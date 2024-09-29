import React from "react";
import convertTimestamp from "../../helpers/convertTimestamp";
import { useNavigate } from "react-router-dom";

function Post(props) {
  const navigate = useNavigate();
  async function hanldeDeletePost(id) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/delete/${id}`,
        {
          method: "DELETE",
        }
      );
    } catch (error) {
      console.log("Error deleting post");
    }
  }

  function hanldeEditPost(id) {
    navigate(`/edit/${id}`);
  }

  const updatedTime = convertTimestamp(props.updated_at);
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
            <button onClick={(id) => hanldeDeletePost(id)}>Delete</button>
            <button onClick={(id) => hanldeEditPost(id)}>Edit</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;

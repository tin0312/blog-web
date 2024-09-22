import React from "react";
import convertTimestamp from "../../helpers/convertTimestamp";

function Post(props) {
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
      </div>
    </div>
  );
}

export default Post;

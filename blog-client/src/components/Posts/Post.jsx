import React from "react";
import convertTimestamp from "../../helpers/convertTimestamp";
import { useNavigate, useLocation } from "react-router-dom";
import PostReactions from "../UI/PostReactions";

function Post(props) {
  const { state } = useLocation();
  const navigate = useNavigate();

  async function hanldeDeletePost(id) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200) {
        navigate("/profile");
      }
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

  const profilePicFile = props.profileFile
    ? `data:image/png;base64,${btoa(
        String.fromCharCode(...new Uint8Array(props.profileFile.data))
      )}`
    : null;

  const updatedTime = convertTimestamp(props.updatedAt);
  return (
    <div className={props.className || "post-container"}>
      <div className="post-metadata-container">
        <img
          className="profile-pic"
          src={props.profileFile ? profilePicFile : props?.profileUrl}
          alt="profile-image"
        />
        <div className="post-metadata">
          <p>{props.author}</p>
          <p className="date">
            {new Date(props.createdAt).toLocaleDateString()}
          </p>
          <p>{props.updatedAt && updatedTime}</p>
        </div>
      </div>
      <div>
        <h3>{props.title}</h3>
        <p className="post-content">{state?.content || ""}</p>
      </div>
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
      <PostReactions
        postId={props.id}
        helpfulCount={props.helpfulCount}
        likeCount={props.likeCount}
        brilliantCount={props.brilliantCount}
      />
    </div>
  );
}

export default Post;

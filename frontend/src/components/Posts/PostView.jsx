import React, { useEffect, useState } from "react";
import Post from "./Post";
import { useLocation, useParams } from "react-router";

function PostView() {
  const [post, setPost] = useState();
  const { state } = useLocation();
  const { id } = useParams();
  console.log("Post id is ", id);
  console.log(state);

  useEffect(() => {
    if (!state) {
      const getPost = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/posts/${id}`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const postContent = await response.json();
          setPost(postContent);
          console.log("Post content is :", postContent);
        } catch (error) {
          console.log("Error getting post ", error);
        }
      };
      getPost();
    }
  }, [id, state]);

  return (
    <div className="post-wrapper">
      <Post
        id={state?.id || post?.id}
        title={state?.title || post?.title}
        content={state?.content || post?.content}
        author={state?.author || post?.author_username}
        createdAt={state?.createdAt || post?.created_at}
        authenticatedUser={state?.authenticatedUser || null}
        // updatedAt={state.updatedAt || post.updated_at}
        className="post"
      />
    </div>
  );
}

export default PostView;

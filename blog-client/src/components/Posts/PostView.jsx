import React, { useEffect, useState } from "react";
import Post from "./Post";
import { useLocation, useParams } from "react-router";

function PostView() {
  const [post, setPost] = useState();
  const { state } = useLocation();
  const { id } = useParams();

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/posts/${id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const postContent = await response.json();
        setPost(postContent);
      } catch (error) {
        console.log("Error getting post ", error);
      }
    };
    getPost();
  }, [id]);

  return (
    <div className="post-wrapper">
      <Post
        id={post?.id}
        title={post?.title}
        content={post?.content}
        author={post?.author_username}
        createdAt={post?.created_at}
        authenticatedUser={state?.authenticatedUser || null}
        updatedAt={post?.updated_at}
        profileFile={post?.profile_pic_file}
        profileUrl={post?.profile_pic_url}
        likeCount={post?.likecount}
        helpfulCount={post?.helpfulcount}
        brilliantCount={post?.brilliantcount}
        className="post"
      />
    </div>
  );
}

export default PostView;

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
          `/api/posts/${id}`
        );
        console.log("fetching")
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
    <div>
      <Post
        id={post?.id}
        title={post?.title}
        content={post?.content}
        author={post?.author_username}
        createdAt={post?.created_at}
        isCurrentUserPost={state?.isCurrentUserPost || null}
        updatedAt={post?.updated_at}
        profileFile={post?.profile_pic_file}
        profileUrl={post?.profile_pic_url}
        coverImg = {post?.cover_image}
        postCategory={post?.category}
      />
    </div>
  );
}

export default PostView;

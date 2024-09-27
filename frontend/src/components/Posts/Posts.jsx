import React from "react";
import { useState, useEffect } from "react";
import Post from "./Post";
import { Link } from "react-router-dom";
import dotenv from "dotenv";
dotenv.config();

function Posts(props) {
  if (props.user) {
    console.log(
      "Username in Posts when user available is ",
      props.user.username
    );
  }
  // console.log("User in Posts is ", props.user.username);

  const [posts, setPosts] = useState([]);
  const serverURL = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    async function fetchPosts() {
      try {
        let response;
        if (!props.user) {
          response = await fetch(serverURL);
        } else {
          response = await fetch(
            `${serverURL}/posts/${encodeURIComponent(props.user.username)}`
          );
        }
        const data = await response.json();
        setPosts(data);
        console.log("Data fetch with or without user: ", data);
      } catch (error) {
        console.log("Error fetching posts, ", error);
      }
    }
    fetchPosts();
  }, [props.user, serverURL]);
  return (
    <div className="posts-wrapper">
      <div className="posts-container">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={
              props.user
                ? `posts/${props.user.username}/${post.id}`
                : `posts/${post.id}`
            }
            state={{
              id: post.id,
              title: post.title,
              content: post.content,
              author: post.author_username,
              createdAt: post.created_at,
              updatedAt: post.updated_at,
            }}
          >
            <Post
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              author={post.author_username}
              createdAt={post.created_at}
              updatedAt={post.updated_at}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Posts;

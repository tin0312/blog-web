import React from "react";
import { useState, useEffect } from "react";
import Post from "./Post";
import { Link } from "react-router-dom";
import dotenv from "dotenv";
dotenv.config();

function Posts() {
  const [posts, setPosts] = useState([]);
  const serverURL = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(serverURL);
        const data = await response.json();
        setPosts(data);
        console.log(data);
      } catch (error) {
        console.log("Error fetching posts, ", error);
      }
    }
    fetchPosts();
  }, []);
  return (
    <div className="posts-wrapper">
      <div className="posts-container">
        {posts.map((post) => (
          <Link
            to={`/posts/${post.id}`}
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

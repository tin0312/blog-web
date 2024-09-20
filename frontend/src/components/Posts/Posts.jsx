import React from "react";
import { useState, useEffect } from "react";
import Post from "./Post";

function Posts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(" http://localhost:9000");
        const data = await response.json();
        setPosts(data);
        console.log(data);
      } catch (error) {
        console.log("Error fetching posts");
      }
    }
    fetchPosts();
  }, []);
  return (
    <div className="posts-wrapper">
      <div className="posts-container"></div>
    </div>
  );
}

export default Posts;

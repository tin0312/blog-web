import React from "react";
import { useState, useEffect } from "react";
import Post from "./Post";
import { Link } from "react-router-dom";
import dotenv from "dotenv";
dotenv.config();

function Posts(props) {
  const [posts, setPosts] = useState([]);
  const [info, setInfo] = useState("");
  const serverURL = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    async function fetchPosts() {
      try {
        let response = await fetch(
          `${serverURL}${
            props.user
              ? `/${encodeURIComponent(props.user.username)}/posts`
              : ""
          }`
        );
        const data = await response.json();
        if (response.status === 404) {
          setInfo(data.message);
        }
        setPosts(data);
      } catch (error) {
        console.log("Error fetching posts: ", error);
      }
    }

    fetchPosts();
  }, [props.user, serverURL]);

  return (
    <div className="posts-wrapper">
      <div className="posts-container">
        {info === "" ? (
          posts.map((post) => (
            <Link
              key={post.id}
              to={
                props.user
                  ? `/${props.user.username}/posts/${post.id}`
                  : `posts/${post.id}`
              }
              state={{
                authenticatedUser: props.user?.username,
                content: post.content,
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
          ))
        ) : (
          <p className="info-message">Posts not available</p>
        )}
      </div>
    </div>
  );
}

export default Posts;

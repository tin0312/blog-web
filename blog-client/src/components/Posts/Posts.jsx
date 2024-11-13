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
              ? `/posts/${encodeURIComponent(props.user.username)}/posts`
              : "/posts"
          }`
        );
        if (response.status === 204) {
          setInfo("No posts found");
        } else {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.log("Error fetching posts: ", error);
      }
    }

    fetchPosts();
  }, [props.user, serverURL]);

  return (
    <div className={props.user ? "profile-posts" : "posts-wrapper"}>
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
                profileFile={post.profile_pic_file}
                profileUrl={post.profile_pic_url}
                likeCount={post.likecount}
                helpfulCount={post.helpfulcount}
                brilliantCount={post.brilliantcount}
              />
            </Link>
          ))
        ) : (
          <p className="info-message">{info}</p>
        )}
      </div>
    </div>
  );
}

export default Posts;

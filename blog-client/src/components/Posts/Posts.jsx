import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Post from "./Post";
import { useAuth } from "../../hooks/AuthProvider";
import slugifyText from "../../helpers/slugifyTexts";



export default function Posts() {
  const { category, user, setCategory } = useAuth()
  const [posts, setPosts] = useState([]);
  const location = useLocation()
  const isCurrentUserPosts = location.pathname === "/profile";

  useEffect(() => {
    async function fetchPosts() {
      try {
        let response = await fetch(
          `/api/posts/${isCurrentUserPosts && user?.username ? `${slugifyText(user.username)}/posts/` : `type/${category}`}`
        );
        const data = await response.json();
        setPosts(data)
      } catch (error) {
        console.log("Error fetching posts: ", error);
      }
    }

    fetchPosts();
  }, [category, user]);

  return (
    <div className="posts-wrapper">
      {posts.length > 0 ?
        posts.map((post) => (
          <Link
            key={post.id}
            to={
              `posts/${post.id}`
            }
            state={{
              isCurrentUserPost: post.author_username === user?.username,
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
              postCategory={post.category}
              coverImg={post.cover_image}
            />
          </Link>
        ))
        :
        <p className="mt-5 text-center">Posts not avaible</p>
      }
    </div>
  )
}
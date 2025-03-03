import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import CreatePost from "./CreatePost";

function PostEditor() {
  const { state } = useLocation();
  const navigate = useNavigate();
  async function handleEditPost(post, postContent){
    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("content", postContent);
    formData.append("coverImg", post.coverImg[0]);
    try{
      const response = await fetch(`/api/posts/update/${state.id}`, {
        method: "PATCH",
        body: formData,
        credentials: "include"
      })
      if(response.status === 200){
        navigate(`/posts/${state.id}`)
      } else {
        alert("Error updating post")
      }
    } catch(error){
        console.log("Error updating post", error)
    }
  }
  return (
    <>
      <CreatePost 
        coverImage= {state.coverImgFile} 
        title= {state.title}
        content= {state.content}
        handleEditPost={handleEditPost}
      />
    </>
  );
}

export default PostEditor;

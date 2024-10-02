import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import Posts from "./components/Posts/Posts";
import PostView from "./components/Posts/PostView";
import PostEditor from "./components/Posts/PostEditor";
import CreatePost from "./components/Posts/CreatePost";
import LogIn from "./components/Users/Auth/LogIn";
import SignUp from "./components/Users/Auth/SignUp";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import dotenv from "dotenv";
import UserProfile from "./components/Users/UserProfile";
dotenv.config();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Posts />,
      },
      {
        path: "/create-post",
        element: <CreatePost />,
      },
      {
        path: "/login",
        element: <LogIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/posts/:id",
        element: <PostView />,
      },
      {
        path: "/profile",
        element: <UserProfile />,
      },
      {
        path: "/:username/posts/:id",
        element: <PostView />,
      },
      {
        path: "/:username/posts/:id/edit",
        element: <PostEditor />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

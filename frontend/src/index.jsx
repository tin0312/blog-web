import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import Posts from "./components/Posts/Posts";
import PostView from "./components/Posts/PostView";
import PostEditor from "./components/Posts/PostEditor";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import dotenv from "dotenv";
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
        element: <PostEditor />,
      },
      {
        path: "/posts/:id",
        element: <PostView />,
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

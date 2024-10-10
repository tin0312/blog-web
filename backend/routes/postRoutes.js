import express from "express";
import {
  getAllPosts,
  addPost,
  deletePost,
  updatePost,
  getPost,
  getUserPosts,
} from "../controllers/postControllers.js";

const router = express.Router();

router.get("/", getAllPosts);

router.post("/add-post", addPost);

router.delete("/delete/:id", deletePost);

router.patch("/update/:id", updatePost);

router.get("/:postID", getPost);

router.get("/:username/posts", getUserPosts);

export default router;

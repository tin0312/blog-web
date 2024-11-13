import express from "express";
import {
  getAllPosts,
  addPost,
  deletePost,
  updatePost,
  getPost,
  getUserPosts,
  addReaction,
} from "../controllers/postControllers.js";

const router = express.Router();

router.get("/", getAllPosts);

router.post("/add-post", addPost);

router.patch("/:id/add-reaction", addReaction);

router.delete("/delete/:id", deletePost);

router.patch("/update/:id", updatePost);

router.get("/:postID", getPost);

router.get("/:username/posts", getUserPosts);

export default router;

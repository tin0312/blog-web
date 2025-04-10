import express from "express";
import {
  getAllPosts,
  addPost,
  addReaction,
  deletePost,
  updatePost,
  getPost,
  getUserPosts,
  getNotifications,
  updateReadMessages
} from "../controllers/postControllers.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get("/type/:category", getAllPosts);
router.get("/notifications", getNotifications);
router.patch("/notifications/:notificationId", updateReadMessages)
router.post("/add-post", upload.single("coverImg"), addPost);
router.post("/add-reaction", addReaction)
router.patch("/update/:id", upload.single("coverImg"), updatePost);
router.delete("/delete/:id", deletePost);
router.get("/:postID", getPost);
router.get("/:username/posts", getUserPosts);

export default router;

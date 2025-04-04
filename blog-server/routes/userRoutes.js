import express from "express";
import {
  addUser,
  logIn,
  logOut,
  editUserProfile,
} from "../controllers/userControllers.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
import isAuthenticated from "../middleware/authMiddleware.js";
import passport from "../config/passportConfig.js";

const router = express.Router();

router.post("/add-user", upload.single("profilePicFile"), addUser);

router.post("/login", logIn);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/googleLogIn",
  passport.authenticate("google", {
    successRedirect: process.env.FRONTEND_URL,
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  })
);

router.post("/log-out", logOut);

router.get("/current-user", isAuthenticated, (req, res) =>
  res.json({
    userId: req.user.id,
    name: req.user.name,
    username: req.user.username,
    join_date: req.user.join_date, 
    profile_pic_file: req.user.profile_pic_file
      ? `data:image/png;base64,${Buffer.from(
          req.user.profile_pic_file.data
        ).toString("base64")}`
      : req.user.profile_pic_url,
      email: req.user.email,
      join_date: req.user.join_date,
      bio: req.user.bio,
      profile_url: req.user.profile_url,
      location: req.user.location
  })
);

router.patch("/profile/edit", upload.single("profilePicFile"), editUserProfile);

export default router;

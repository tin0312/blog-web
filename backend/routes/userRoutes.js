import express from "express";
import {
  getProfile,
  addUser,
  logIn,
  logOut,
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

router.get("/current-user", isAuthenticated, (req, res) => res.json(req.user));

router.get("/profile", getProfile);

export default router;

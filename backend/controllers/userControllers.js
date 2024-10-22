import db from "../db.js";
import bcrypt from "bcrypt";
import passport from "passport";

async function getProfile(req, res) {
  const authorUsername = req.user.username;
  try {
    const result = await db.query(
      "SELECT * FROM posts WHERE author_username = $1",
      [authorUsername]
    );
    const posts = result.rows;
    res.render("profile.ejs", { posts: posts });
  } catch (error) {
    console.log("Error getting user posts", error);
  }
}

async function addUser(req, res) {
  const { email, password, name, username } = req.body;
  const profilePic = req.file?.buffer;
  // hash user password
  // salt rounds for layers of security
  const saltRound = 10;
  bcrypt.hash(password, saltRound, async (error, hash) => {
    if (error) {
      return res.status(500).json({ message: "Error encrypting password" });
    } else {
      try {
        const checkUserResult = await db.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );
        if (checkUserResult.rows.length > 0) {
          return res.status(409).json({ message: "User already exists" });
        }

        const result = await db.query(
          "INSERT INTO users (name, username, email, password, profile_pic_file) VALUES ($1, $2, $3, $4, $5) RETURNING*",
          [name, username, email, hash, profilePic]
        );
        const user = result.rows[0];

        req.logIn(user, (error) => {
          if (error) {
            return res.status(500).json({ message: "Login Error" });
          }
          return res.status(201).json({
            message: "User created",
            user: req.user,
          });
        });
      } catch (error) {
        console.log("Error adding user", error);
        return res.status(500).json({ message: "Error adding user" });
      }
    }
  });
}

async function getQueryForLogin(username) {
  const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
  try {
    let result;
    if (emailRegex.test(username)) {
      result = await db.query("SELECT * FROM users WHERE email = $1", [
        username,
      ]);
    } else {
      result = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);
    }
    return result;
  } catch (error) {
    console.log("Error getting query for login", error);
  }
}

function logIn(req, res, next) {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return res
        .status(500)
        .json({ success: false, message: "Error executing database queries" });
    }
    if (!user) {
      return res.status(404).json({ success: false, message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(401).json({ success: false, message: info.message });
      }
      return res
        .status(200)
        .json({ success: true, message: "Login successfully", user });
    });
  })(req, res, next);
}

async function logOut(req, res) {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Log Out Error" });
    }
    // Destroy the session and clear the cookie
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to destroy session" });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
}

export { getProfile, addUser, logIn, getQueryForLogin, logOut };

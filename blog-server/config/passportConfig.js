import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import db from "../db.js";
import bcrypt from "bcrypt";
import { getQueryForLogin } from "../controllers/userControllers.js";

passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await getQueryForLogin(username);

      if (result.rows.length > 0) {
        const user = result.rows[0];
        const hashPassword = user.password;
        bcrypt.compare(password, hashPassword, (error, valid) => {
          if (error) {
            console.log("Error comparing password");
            return cb(error);
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb(null, false, { message: "Invalid password" });
            }
          }
        });
      } else {
        return cb(null, false, { message: "User not found" });
      }
    } catch (error) {
      return cb(error);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          profile.email,
        ]);
        if (result.rows.length === 0) {
          const newUser = await db.query(
            "INSERT INTO users (email, password, username, profile_pic_url) VALUES($1, $2, $3, $4) RETURNING*",
            [profile.email, "google", profile.displayName, profile.picture]
          );
          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, result.rows[0]);
        }
      } catch (error) {
        return cb(error);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

export default passport;

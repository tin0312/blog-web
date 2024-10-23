import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import "dotenv/config";
import session from "express-session";
import flash from "connect-flash";
import cors from "cors";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import redis from "redis";
import RedisStore from "connect-redis";

const app = express();
const port = process.env.PORT;
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));

// Initialize redis client.
let redisClient = redis.createClient();
redisClient.connect().catch(console.error);

// Initialize redis store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "userauthentication:",
});

// Use session with Redis store
app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());

app.use("/posts", postRoutes);
app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`Blog Web server listening at http://localhost:${port}`);
});

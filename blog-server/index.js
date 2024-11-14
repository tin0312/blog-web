import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import "dotenv/config";
import session from "express-session";
import flash from "connect-flash";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import Redis from "ioredis";
import RedisStore from "connect-redis";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
// Convert `import.meta.url` to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "clientbuild")));
const port = process.env.PORT;
// Initialize Redis client.
const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "userauthentication",
});

app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
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
app.get("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "clientbuild", "index.html"));
});

app.listen(port, () => {
  console.log(`Blog Web server listening at http://localhost:${port}`);
});

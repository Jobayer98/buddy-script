import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { connectDB } from "./config/db";
import authRouter from "./routes/auth";
import postsRouter from "./routes/posts";
import commentsRouter from "./routes/comments";
import likesRouter from "./routes/likes";

import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});
app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/likes", likesRouter);

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

export default app;

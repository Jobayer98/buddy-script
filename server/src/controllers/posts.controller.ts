import { Response } from "express";
import { validationResult } from "express-validator";
import { Types } from "mongoose";
import Post from "../models/Post";
import Comment from "../models/Comment";
import Like from "../models/Like";
import { AuthRequest } from "../middleware/auth";

export const getFeed = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;

  const posts = await Post.find({
    $or: [
      { visibility: "public" },
      { visibility: "private", userId: new Types.ObjectId(userId) },
    ],
  })
    .sort({ createdAt: -1 })
    .populate("userId", "firstName lastName");

  res.json(posts);
};

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Validation failed", errors: errors.array() });
    return;
  }

  const { content, visibility = "public" } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  const post = await Post.create({
    userId: req.user!.id,
    content,
    visibility,
    ...(imageUrl && { imageUrl }),
  });

  await post.populate("userId", "firstName lastName");
  res.status(201).json(post);
};

export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Validation failed", errors: errors.array() });
    return;
  }

  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  if (post.userId.toString() !== req.user!.id) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const { content, visibility } = req.body;
  if (content !== undefined) post.content = content;
  if (visibility !== undefined) post.visibility = visibility;

  await post.save();
  await post.populate("userId", "firstName lastName");

  res.json(post);
};

export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  if (post.userId.toString() !== req.user!.id) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  await Promise.all([
    post.deleteOne(),
    Comment.deleteMany({ postId: post._id }),
    Like.deleteMany({ postId: post._id }),
  ]);

  res.json({ message: "Post deleted" });
};

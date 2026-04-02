import { Response } from "express";
import { validationResult } from "express-validator";
import { Types } from "mongoose";
import Post from "../models/Post";
import Comment from "../models/Comment";
import Like from "../models/Like";
import { AuthRequest } from "../middleware/auth";

export const getFeed = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const filter = {
    $or: [
      { visibility: "public" },
      { visibility: "private", userId: new Types.ObjectId(userId) },
    ],
  };

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "firstName lastName")
      .lean(),
    Post.countDocuments(filter),
  ]);

  // Get user's reactions for all posts
  const postIds = posts.map((p: any) => p._id);
  const userReactions = await Like.find({
    userId: new Types.ObjectId(userId),
    postId: { $in: postIds },
  }).lean();

  // Create a map of postId -> reactionType
  const reactionMap = new Map(
    userReactions.map((r: any) => [r.postId.toString(), r.reactionType])
  );

  // Add userReaction to each post
  const postsWithReactions = posts.map((post: any) => ({
    ...post,
    userReaction: reactionMap.get(post._id.toString()) || null,
  }));

  res.json({
    posts: postsWithReactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page < Math.ceil(total / limit),
    },
  });
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

  // Add userReaction field (null for newly created post)
  const postWithReaction = {
    ...post.toObject(),
    userReaction: null,
  };

  res.status(201).json(postWithReaction);
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

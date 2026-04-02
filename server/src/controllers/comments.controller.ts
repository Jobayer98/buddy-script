import { Response } from "express";
import { validationResult } from "express-validator";
import { Types } from "mongoose";
import Comment from "../models/Comment";
import Post from "../models/Post";
import Like from "../models/Like";
import { AuthRequest } from "../middleware/auth";

export const getComments = async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Validation failed", errors: errors.array() });
    return;
  }

  const comments = await Comment.find({
    postId: new Types.ObjectId(req.query.postId as string),
  })
    .sort({ createdAt: 1 })
    .populate("userId", "firstName lastName");

  res.json(comments);
};

export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Validation failed", errors: errors.array() });
    return;
  }

  const { postId, content, parentId = null } = req.body;

  const post = await Post.findById(postId);
  if (!post) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  if (parentId) {
    const parent = await Comment.findOne({ _id: parentId, postId });
    if (!parent) {
      res.status(404).json({ message: "Parent comment not found" });
      return;
    }
  }

  const comment = await Comment.create({ postId, userId: req.user!.id, content, parentId });
  await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
  await comment.populate("userId", "firstName lastName");

  res.status(201).json(comment);
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404).json({ message: "Comment not found" });
    return;
  }

  if (comment.userId.toString() !== req.user!.id) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const isParent = comment.parentId === null;

  if (isParent) {
    const replies = await Comment.find({ parentId: comment._id });
    const replyIds = replies.map((r) => r._id);
    await Promise.all([
      Comment.deleteMany({ parentId: comment._id }),
      Like.deleteMany({ commentId: { $in: replyIds } }),
      Like.deleteMany({ commentId: comment._id }),
      Post.findByIdAndUpdate(comment.postId, { $inc: { commentCount: -(1 + replies.length) } }),
    ]);
  } else {
    await Promise.all([
      Like.deleteMany({ commentId: comment._id }),
      Post.findByIdAndUpdate(comment.postId, { $inc: { commentCount: -1 } }),
    ]);
  }

  await comment.deleteOne();
  res.json({ message: "Comment deleted" });
};

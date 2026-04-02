import { Response } from "express";
import { validationResult } from "express-validator";
import { Types } from "mongoose";
import Post from "../models/Post";
import Comment from "../models/Comment";
import Like, { ReactionType } from "../models/Like";
import { AuthRequest } from "../middleware/auth";

export const toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Validation failed", errors: errors.array() });
    return;
  }

  const { postId, commentId, reactionType = "like" } = req.body;
  const userId = req.user!.id;

  if (!postId && !commentId) {
    res.status(400).json({ message: "postId or commentId is required" });
    return;
  }

  if (postId && commentId) {
    res.status(400).json({ message: "Provide only one of postId or commentId" });
    return;
  }

  const isPost = !!postId;
  const targetId = isPost ? postId : commentId;
  const filter = isPost ? { userId, postId } : { userId, commentId };
  const existing = await Like.findOne(filter);

  let delta = 0;
  let liked = false;
  let currentReactionType: ReactionType | null = null;

  if (existing) {
    // If same reaction type, remove it (unlike)
    if (existing.reactionType === reactionType) {
      await existing.deleteOne();
      delta = -1;
      liked = false;
    } else {
      // Different reaction type, update it (no count change)
      existing.reactionType = reactionType as ReactionType;
      await existing.save();
      delta = 0;
      liked = true;
      currentReactionType = reactionType as ReactionType;
    }
  } else {
    // Create new reaction
    await Like.create({ ...filter, reactionType });
    delta = 1;
    liked = true;
    currentReactionType = reactionType as ReactionType;
  }

  if (isPost) {
    const post = await Post.findByIdAndUpdate(targetId, { $inc: { likeCount: delta } }, { new: true });
    res.json({ liked, likeCount: post?.likeCount ?? 0, reactionType: currentReactionType });
  } else {
    const comment = await Comment.findByIdAndUpdate(targetId, { $inc: { likeCount: delta } }, { new: true });
    res.json({ liked, likeCount: comment?.likeCount ?? 0, reactionType: currentReactionType });
  }
};

export const getReactions = async (req: AuthRequest, res: Response): Promise<void> => {
  const { postId, commentId } = req.query;

  if (!postId && !commentId) {
    res.status(400).json({ message: "postId or commentId is required" });
    return;
  }

  const filter = postId ? { postId: new Types.ObjectId(postId as string) } : { commentId: new Types.ObjectId(commentId as string) };

  // Get all reactions with user details
  const reactions = await Like.find(filter)
    .populate("userId", "firstName lastName")
    .sort({ createdAt: -1 })
    .lean();

  // Group by reaction type and count
  const summary: Record<string, { count: number; users: any[] }> = {};

  reactions.forEach((reaction: any) => {
    const type = reaction.reactionType;
    if (!summary[type]) {
      summary[type] = { count: 0, users: [] };
    }
    summary[type].count++;
    if (summary[type].users.length < 5) {
      summary[type].users.push({
        _id: reaction.userId._id,
        firstName: reaction.userId.firstName,
        lastName: reaction.userId.lastName,
      });
    }
  });

  // Get top 5 reaction types by count
  const topReactions = Object.entries(summary)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5)
    .map(([type, data]) => ({
      type,
      count: data.count,
      users: data.users,
    }));

  // Check if current user reacted
  const userReaction = reactions.find((r: any) => r.userId._id.toString() === req.user!.id);

  res.json({
    total: reactions.length,
    topReactions,
    userReaction: userReaction ? userReaction.reactionType : null,
    allReactions: reactions.map((r: any) => ({
      userId: r.userId._id,
      firstName: r.userId.firstName,
      lastName: r.userId.lastName,
      reactionType: r.reactionType,
      createdAt: r.createdAt,
    })),
  });
};

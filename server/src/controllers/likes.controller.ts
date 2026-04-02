import { Response } from "express";
import { validationResult } from "express-validator";
import Post from "../models/Post";
import Comment from "../models/Comment";
import Like from "../models/Like";
import { AuthRequest } from "../middleware/auth";

export const toggleLike = async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Validation failed", errors: errors.array() });
    return;
  }

  const { postId, commentId } = req.body;
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
  const delta = existing ? -1 : 1;
  const liked = !existing;

  if (existing) {
    await existing.deleteOne();
  } else {
    await Like.create(filter);
  }

  if (isPost) {
    const post = await Post.findByIdAndUpdate(targetId, { $inc: { likeCount: delta } }, { new: true });
    res.json({ liked, likeCount: post?.likeCount ?? 0 });
  } else {
    const comment = await Comment.findByIdAndUpdate(targetId, { $inc: { likeCount: delta } }, { new: true });
    res.json({ liked, likeCount: comment?.likeCount ?? 0 });
  }
};

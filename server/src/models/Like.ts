import { Schema, model, Document, Types } from "mongoose";

export type ReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry";

export interface ILike extends Document {
  userId: Types.ObjectId;
  postId: Types.ObjectId | null;
  commentId: Types.ObjectId | null;
  reactionType: ReactionType;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    userId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId:    { type: Schema.Types.ObjectId, ref: "Post",    default: null },
    commentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    reactionType: {
      type: String,
      enum: ["like", "love", "haha", "wow", "sad", "angry"],
      default: "like"
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Compound indexes to prevent duplicate reactions
// One user can only have one reaction per specific post
likeSchema.index({ userId: 1, postId: 1 }, {
  unique: true,
  partialFilterExpression: { postId: { $type: "objectId" } }
});

// One user can only have one reaction per specific comment
likeSchema.index({ userId: 1, commentId: 1 }, {
  unique: true,
  partialFilterExpression: { commentId: { $type: "objectId" } }
});

export default model<ILike>("Like", likeSchema);

import { Schema, model, Document, Types } from "mongoose";

export interface ILike extends Document {
  userId: Types.ObjectId;
  postId: Types.ObjectId | null;
  commentId: Types.ObjectId | null;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    userId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId:    { type: Schema.Types.ObjectId, ref: "Post",    default: null },
    commentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Prevent duplicate likes
likeSchema.index({ userId: 1, postId: 1 },    { unique: true, sparse: true });
likeSchema.index({ userId: 1, commentId: 1 }, { unique: true, sparse: true });

export default model<ILike>("Like", likeSchema);

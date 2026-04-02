import { Schema, model, Document, Types } from "mongoose";

export interface IComment extends Document {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  parentId: Types.ObjectId | null;
  likeCount: number;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    postId:    { type: Schema.Types.ObjectId, ref: "Post", required: true },
    userId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
    content:   { type: String, required: true, trim: true },
    parentId:  { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    likeCount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

commentSchema.index({ postId: 1 });

export default model<IComment>("Comment", commentSchema);

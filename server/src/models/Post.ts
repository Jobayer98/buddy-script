import { Schema, model, Document, Types } from "mongoose";

export interface IPost extends Document {
  userId: Types.ObjectId;
  content: string;
  imageUrl?: string;
  visibility: "public" | "private";
  likeCount: number;
  commentCount: number;
  createdAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    userId:       { type: Schema.Types.ObjectId, ref: "User", required: true },
    content:      { type: String, required: true, trim: true },
    imageUrl:     { type: String, default: null },
    visibility:   { type: String, enum: ["public", "private"], default: "public" },
    likeCount:    { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

postSchema.index({ createdAt: -1 });

export default model<IPost>("Post", postSchema);

export interface ApiUser {
  _id: string;
  firstName: string;
  lastName: string;
}

export type ReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry";

export interface ReactionSummary {
  type: ReactionType;
  count: number;
  users: ApiUser[];
}

export interface ApiPost {
  _id: string;
  userId: ApiUser;
  content: string;
  imageUrl?: string;
  visibility: "public" | "private";
  likeCount: number;
  commentCount: number;
  createdAt: string;
  userReaction?: ReactionType | null;
}

export interface ApiComment {
  _id: string;
  postId: string;
  userId: ApiUser;
  content: string;
  parentId: string | null;
  likeCount: number;
  createdAt: string;
}

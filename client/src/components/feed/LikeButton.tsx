"use client";

import { useState } from "react";
import { createApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Props {
  initialCount: number;
  postId?: string;
  commentId?: string;
}

export default function LikeButton({ initialCount, postId, commentId }: Props) {
  const { accessToken } = useAuth();
  const api = createApi(accessToken);
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (loading) return;
    // Optimistic update
    setLiked((prev) => !prev);
    setCount((prev) => (liked ? prev - 1 : prev + 1));
    setLoading(true);
    try {
      const body = postId
        ? { postId, reactionType: "like" }
        : { commentId, reactionType: "like" };
      const res = await api.post<{ liked: boolean; likeCount: number }>(
        "/likes/toggle",
        body,
      );
      setLiked(res.liked);
      setCount(res.likeCount);
    } catch {
      // Revert on failure
      setLiked((prev) => !prev);
      setCount((prev) => (liked ? prev + 1 : prev - 1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1 text-[14px] font-medium transition-colors ${
        liked ? "text-primary" : "text-foreground hover:text-primary"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>
      {count > 0 && <span>{count}</span>}
    </button>
  );
}

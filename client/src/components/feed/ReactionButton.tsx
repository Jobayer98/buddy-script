"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { createApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { ReactionType } from "@/lib/types";
import ReactionPicker from "./ReactionPicker";

interface Props {
  initialCount: number;
  postId?: string;
  commentId?: string;
  initialReaction?: ReactionType | null;
  onCountChange?: (newCount: number) => void;
}

const reactionEmojis: Record<ReactionType, string> = {
  like: "👍",
  love: "❤️",
  haha: "😂",
  wow: "😮",
  sad: "😢",
  angry: "😠",
};

export default function ReactionButton({
  initialCount,
  postId,
  commentId,
  initialReaction,
  onCountChange,
}: Props) {
  const { accessToken } = useAuth();
  const api = useMemo(() => createApi(accessToken), [accessToken]);
  const [reaction, setReaction] = useState<ReactionType | null>(
    initialReaction || null,
  );
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleReaction = async (type: ReactionType) => {
    if (loading) return;

    const wasReacted = !!reaction;
    const isSameReaction = reaction === type;
    const oldReaction = reaction;
    const oldCount = count;

    // Optimistic update
    if (isSameReaction) {
      setReaction(null);
      setCount((prev) => prev - 1);
    } else if (wasReacted) {
      setReaction(type);
      // Count stays same when switching reactions
    } else {
      setReaction(type);
      setCount((prev) => prev + 1);
    }

    setShowPicker(false);
    setLoading(true);

    try {
      const body = postId
        ? { postId, reactionType: type }
        : { commentId, reactionType: type };
      const res = await api.post<{
        liked: boolean;
        likeCount: number;
        reactionType: ReactionType | null;
      }>("/likes/toggle", body);
      setReaction(res.reactionType);
      setCount(res.likeCount);
      onCountChange?.(res.likeCount);
    } catch {
      // Revert on failure
      setReaction(oldReaction);
      setCount(oldCount);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLike = () => {
    if (reaction) {
      // If already reacted, remove it
      handleReaction(reaction);
    } else {
      // Quick like
      handleReaction("like");
    }
  };

  return (
    <div ref={pickerRef} className="relative">
      <button
        ref={buttonRef}
        onMouseEnter={() => setShowPicker(true)}
        onClick={handleQuickLike}
        className={`flex items-center gap-1.5 text-[14px] font-medium transition-colors px-2 py-1 rounded ${
          reaction ? "text-primary" : "text-muted-foreground hover:text-primary"
        }`}
      >
        {reaction ? (
          <span className="text-xl">{reactionEmojis[reaction]}</span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
        )}
        {reaction ? (
          <span className="capitalize">{reaction}</span>
        ) : (
          <span>Like</span>
        )}
      </button>

      {showPicker && (
        <ReactionPicker onSelect={handleReaction} currentReaction={reaction} />
      )}
    </div>
  );
}

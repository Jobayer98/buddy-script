"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ApiComment } from "@/lib/types";
import { createApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { MicIcon, ImageAttachIcon } from "../layout/ReferenceIcons";
import CommentItem from "./CommentItem";

interface Props {
  postId: string;
  onCommentAdded?: () => void;
}

export default function CommentSection({ postId, onCommentAdded }: Props) {
  const { accessToken } = useAuth();
  const api = createApi(accessToken);
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get<ApiComment[]>(`/comments?postId=${postId}`)
      .then(setComments)
      .finally(() => setLoading(false));
  }, [postId]);

  const submitComment = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      const comment = await api.post<ApiComment>("/comments", {
        postId,
        content: text.trim(),
      });
      setComments((prev) => [...prev, comment]);
      setText("");
      onCommentAdded?.();
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplyAdded = (reply: ApiComment) => {
    setComments((prev) => [...prev, reply]);
  };

  const topLevel = comments.filter((c) => c.parentId === null);
  const repliesFor = (id: string) => comments.filter((c) => c.parentId === id);

  return (
    <div className="px-6 pt-4 pb-2 border-t border-border mt-1">
      {/* Comment input */}
      <div className="flex items-center gap-3 mb-4 bg-muted/30 rounded-full px-4 py-2.5">
        <div className="shrink-0 w-6 h-6 rounded-full overflow-hidden bg-primary/20">
          <Image
            src="/images/comment_img.png"
            alt="avatar"
            width={30}
            height={30}
            className="object-cover w-full h-full"
          />
        </div>
        <input
          type="text"
          className="flex-1 bg-transparent text-sm outline-none border-none placeholder:text-muted-foreground"
          placeholder="Write a comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            !e.shiftKey &&
            (e.preventDefault(), submitComment())
          }
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <MicIcon />
          </button>
          <button
            type="button"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ImageAttachIcon />
          </button>
        </div>
      </div>

      {/* Comments list */}
      {loading ? (
        <p className="text-sm text-muted-foreground animate-pulse py-2">
          Loading comments...
        </p>
      ) : (
        <div className="space-y-1">
          {topLevel.length === 0 && (
            <p className="text-sm text-muted-foreground py-2">
              No comments yet. Be the first!
            </p>
          )}
          {topLevel.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              replies={repliesFor(comment._id)}
              postId={postId}
              onReplyAdded={handleReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

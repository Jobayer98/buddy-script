"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ApiComment } from "@/lib/types";
import { createApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { timeAgo } from "@/lib/utils";
import { ThumbUpIcon, HeartIcon } from "../layout/ReferenceIcons";
import LikeButton from "./LikeButton";
import { useMemo } from "react";

interface Props {
  comment: ApiComment;
  replies: ApiComment[];
  postId: string;
  onReplyAdded: (reply: ApiComment) => void;
}

export default function CommentItem({
  comment,
  replies,
  postId,
  onReplyAdded,
}: Props) {
  const { accessToken } = useAuth();
  const api = useMemo(() => createApi(accessToken), [accessToken]);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const authorName = `${comment.userId.firstName} ${comment.userId.lastName}`;

  const submitReply = async () => {
    if (!replyText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const reply = await api.post<ApiComment>("/comments", {
        postId,
        content: replyText.trim(),
        parentId: comment._id,
      });
      onReplyAdded(reply);
      setReplyText("");
      setShowReplyInput(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex gap-3">
        <a href="#" className="shrink-0">
          <div className="w-6 h-6 rounded-full overflow-hidden bg-primary/20">
            <Image
              src="/images/txt_img.png"
              alt={authorName}
              width={36}
              height={36}
              className="object-cover w-full h-full"
            />
          </div>
        </a>

        <div className="flex-1">
          {/* Comment bubble */}
          <div className="bg-muted/40 rounded-[6px] px-3 py-2 inline-block max-w-full">
            <a href="#">
              <h4 className="text-[13px] font-semibold text-foreground leading-tight mb-0.5">
                {authorName}
              </h4>
            </a>
            <p className="text-[13px] text-muted-foreground leading-snug">
              {comment.content}
            </p>
          </div>

          {/* Reaction badges */}
          <div className="flex items-center gap-2 mt-1 ml-1">
            <div className="flex items-center gap-1">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary">
                <ThumbUpIcon />
              </span>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-500">
                <HeartIcon />
              </span>
            </div>
            <span className="text-[12px] text-muted-foreground">
              {comment.likeCount}
            </span>
          </div>

          {/* Like / Reply / Share / time */}
          <div className="flex items-center gap-1 mt-1 ml-1">
            <LikeButton initialCount={0} commentId={comment._id} />
            <span className="text-muted-foreground text-[12px]">·</span>
            <button
              onClick={() => setShowReplyInput((v) => !v)}
              className="text-[13px] font-medium text-foreground hover:text-primary transition-colors"
            >
              Reply
            </button>
            <span className="text-muted-foreground text-[12px]">·</span>
            <button className="text-[13px] font-medium text-foreground hover:text-primary transition-colors">
              Share
            </button>
            <span className="text-muted-foreground text-[12px]">·</span>
            <span className="text-[12px] text-muted-foreground">
              {timeAgo(comment.createdAt)}
            </span>
          </div>

          {/* Reply input */}
          {showReplyInput && (
            <div className="flex gap-2 mt-2">
              <div className="shrink-0 w-6 h-6 rounded-full overflow-hidden bg-primary/20">
                <Image
                  src="/images/comment_img.png"
                  alt=""
                  width={28}
                  height={28}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  className="flex-1 bg-muted/40 rounded-full px-3 py-1.5 text-sm outline-none border border-border focus:border-primary"
                  placeholder={`Reply to ${authorName}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitReply()}
                  autoFocus
                />
                <button
                  onClick={submitReply}
                  disabled={submitting}
                  className="text-sm text-primary font-medium hover:underline disabled:opacity-50 shrink-0"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {/* Nested replies */}
          {replies.length > 0 && (
            <div className="mt-3 ml-2 space-y-3 border-l-2 border-border pl-3">
              {replies.map((reply) => (
                <div key={reply._id} className="flex gap-2">
                  <div className="shrink-0 w-7 h-7 rounded-full overflow-hidden bg-primary/20">
                    <Image
                      src="/images/txt_img.png"
                      alt=""
                      width={28}
                      height={28}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="bg-muted/40 rounded-[6px] px-3 py-2 inline-block max-w-full">
                      <p className="text-[12px] font-semibold text-foreground leading-tight mb-0.5">
                        {reply.userId.firstName} {reply.userId.lastName}
                      </p>
                      <p className="text-[12px] text-muted-foreground">
                        {reply.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 ml-1">
                      <LikeButton
                        initialCount={reply.likeCount}
                        commentId={reply._id}
                      />
                      <span className="text-muted-foreground text-[12px]">
                        ·
                      </span>
                      <span className="text-[12px] text-muted-foreground">
                        {timeAgo(reply.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

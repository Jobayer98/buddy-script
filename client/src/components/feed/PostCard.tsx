"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ApiPost } from "@/lib/types";
import { createApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { timeAgo } from "@/lib/utils";
import {
  MoreVerticalIcon,
  HahaIcon,
  CommentIcon,
  ShareIcon,
} from "../layout/ReferenceIcons";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";
import ReactionButton from "./ReactionButton";
import ReactionDisplay from "./ReactionDisplay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Props {
  post: ApiPost;
  onDeleted: (id: string) => void;
}

export default function PostCard({ post, onDeleted }: Props) {
  const { accessToken, user } = useAuth();
  const api = createApi(accessToken);
  const isOwner = user?.id === post.userId._id;
  const [showDropdown, setShowDropdown] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [visibility, setVisibility] = useState(post.visibility);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editVisibility, setEditVisibility] = useState(post.visibility);
  const [saving, setSaving] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleHide = async () => {
    try {
      await api.patch(`/posts/${post._id}`, { visibility: "private" });
      setVisibility("private");
      setShowDropdown(false);
    } catch {}
  };

  const handleEdit = () => {
    setEditContent(post.content);
    setEditVisibility(visibility);
    setShowEditModal(true);
    setShowDropdown(false);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim() || saving) return;
    setSaving(true);
    try {
      await api.patch(`/posts/${post._id}`, {
        content: editContent.trim(),
        visibility: editVisibility,
      });
      post.content = editContent.trim();
      setVisibility(editVisibility);
      setShowEditModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    await api.delete(`/posts/${post._id}`);
    onDeleted(post._id);
  };

  const authorName = `${post.userId.firstName} ${post.userId.lastName}`;
  const imageUrl = post.imageUrl ? `${BASE_URL}${post.imageUrl}` : null;

  return (
    <div className="bg-card rounded-[6px] pt-6 pb-6 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-6 mb-4">
        <div className="flex items-center gap-4 cursor-pointer">
          <div className="shrink-0 w-11 h-11 rounded-full bg-primary/20 overflow-hidden">
            <Image
              src="/images/post_img.png"
              alt={authorName}
              width={44}
              height={44}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h4 className="text-base font-normal text-foreground leading-tight">
              {authorName}
            </h4>
            <p className="text-[14px] font-normal leading-tight text-muted-foreground">
              {timeAgo(post.createdAt)} ·{" "}
              <a href="#" className="hover:underline capitalize">
                {visibility}
              </a>
            </p>
          </div>
        </div>

        {/* 3-dot dropdown */}
        <div ref={dropRef} className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-1 border-none bg-transparent outline-none cursor-pointer"
          >
            <MoreVerticalIcon />
          </button>

          {showDropdown && (
            <div
              className="absolute right-0 top-8 min-w-[200px] bg-card rounded-[6px] z-20 py-2"
              style={{ boxShadow: "0px 10px 20px rgba(0,0,0,0.08)" }}
            >
              <ul>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="none"
                        viewBox="0 0 18 18"
                      >
                        <path
                          stroke="#1890FF"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.2"
                          d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z"
                        />
                      </svg>
                    </span>
                    Save Post
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="22"
                        fill="none"
                        viewBox="0 0 20 22"
                      >
                        <path
                          fill="#377DFF"
                          fillRule="evenodd"
                          d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    Turn On Notification
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (isOwner) handleHide();
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors ${isOwner ? "text-foreground" : "text-muted-foreground pointer-events-none opacity-40"}`}
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="none"
                        viewBox="0 0 18 18"
                      >
                        <path
                          stroke="#1890FF"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.2"
                          d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5"
                        />
                      </svg>
                    </span>
                    {visibility === "private" ? "Already Hidden" : "Hide"}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (isOwner) handleEdit();
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors ${isOwner ? "text-foreground" : "text-muted-foreground pointer-events-none opacity-40"}`}
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="none"
                        viewBox="0 0 18 18"
                      >
                        <path
                          stroke="#1890FF"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.2"
                          d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75"
                        />
                        <path
                          stroke="#1890FF"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.2"
                          d="M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z"
                        />
                      </svg>
                    </span>
                    Edit Post
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (isOwner) handleDelete();
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors ${isOwner ? "text-foreground" : "text-muted-foreground pointer-events-none opacity-40"}`}
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="none"
                        viewBox="0 0 18 18"
                      >
                        <path
                          stroke="#1890FF"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.2"
                          d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5"
                        />
                      </svg>
                    </span>
                    Delete Post
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6">
        <p className="text-[14px] font-normal text-foreground leading-[21px] mb-4">
          {post.content}
        </p>
        {imageUrl && (
          <div className="relative w-full rounded-[6px] overflow-hidden">
            <Image
              src={imageUrl}
              alt="Post"
              width={800}
              height={450}
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </div>

      {/* Reactions count row */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border">
        <ReactionDisplay postId={post._id} totalCount={post.likeCount} />
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowComments((v) => !v)}
            className="text-[14px] text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-foreground font-medium">{commentCount}</span>{" "}
            Comment
          </button>
          <p className="text-[14px] text-muted-foreground">
            <span className="text-foreground font-medium">122</span> Share
          </p>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center px-6 pt-1">
        <ReactionButton
          initialCount={post.likeCount}
          postId={post._id}
          initialReaction={post.userReaction}
        />
        <button
          onClick={() => setShowComments((v) => !v)}
          className="flex-1 flex items-center justify-center gap-2 h-10 text-[14px] font-normal text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-[6px] transition-colors"
        >
          <CommentIcon /> Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 h-10 text-[14px] font-normal text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-[6px] transition-colors">
          <ShareIcon /> Share
        </button>
      </div>

      {showComments && (
        <CommentSection
          postId={post._id}
          onCommentAdded={() => setCommentCount((c) => c + 1)}
        />
      )}

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <textarea
              className="w-full min-h-[120px] p-3 border border-border rounded-md bg-background text-foreground text-sm resize-none outline-none focus:ring-2 focus:ring-primary"
              placeholder="What's on your mind?"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />

            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">
                Visibility:
              </label>
              <select
                value={editVisibility}
                onChange={(e) =>
                  setEditVisibility(e.target.value as "public" | "private")
                }
                className="px-3 py-1.5 border border-border rounded-md bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={saving || !editContent.trim()}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

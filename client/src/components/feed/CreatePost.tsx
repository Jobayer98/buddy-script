"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ApiPost } from "@/lib/types";
import { createApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  WriteIcon,
  PostSendIcon,
  PhotoIcon,
  VideoIcon,
  EventIcon,
  ArticleIcon,
} from "../layout/ReferenceIcons";

interface Props {
  onPostCreated: (post: ApiPost) => void;
}

export default function CreatePost({ onPostCreated }: Props) {
  const { accessToken } = useAuth();
  const api = createApi(accessToken);
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (file: File | null) => {
    setImage(file);

    // Create preview URL
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() || loading) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append("content", content.trim());
      form.append("visibility", visibility);
      if (image) form.append("image", image);
      const post = await api.post<ApiPost>("/posts", form);
      onPostCreated(post);
      setContent("");
      setImage(null);
      setImagePreview(null);
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-[6px] pt-6 pr-6 pb-6 pl-6 mb-4">
      {/* Textarea row */}
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
          <Image
            src="/images/txt_img.png"
            alt="avatar"
            width={40}
            height={40}
            className="object-cover rounded-full"
          />
        </div>

        <div className="relative flex-1">
          <textarea
            id="post-textarea"
            className="w-full min-h-[88px] border-none outline-none resize-none bg-transparent text-foreground text-sm leading-relaxed pt-2 peer"
            placeholder=""
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {!content && (
            <label
              htmlFor="post-textarea"
              className="absolute top-2 left-0 flex items-center gap-2 text-base font-normal text-[#666] pointer-events-none select-none"
            >
              Write something...
              <WriteIcon className="shrink-0" />
            </label>
          )}
        </div>
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="mt-4 ml-[52px] relative rounded-lg overflow-hidden border border-border">
          <Image
            src={imagePreview}
            alt="Preview"
            width={600}
            height={400}
            className="w-full h-auto max-h-[400px] object-cover"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
            title="Remove image"
          >
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      {/* Desktop toolbar */}
      <div
        className="hidden md:flex items-center justify-between mt-3 px-4 rounded-b-[6px] h-16"
        style={{ background: "rgba(24,144,255,0.05)" }}
      >
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-normal text-[#666] hover:text-primary transition-colors rounded"
          >
            <PhotoIcon />
            Photo
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
          />

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-normal text-[#666] hover:text-primary transition-colors rounded"
          >
            <VideoIcon />
            Video
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-normal text-[#666] hover:text-primary transition-colors rounded"
          >
            <EventIcon />
            Event
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-normal text-[#666] hover:text-primary transition-colors rounded"
          >
            <ArticleIcon />
            Article
          </button>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 transition-colors text-white text-sm font-medium rounded-[6px] px-5 py-2.5"
        >
          <PostSendIcon />
          <span>{loading ? "Posting..." : "Post"}</span>
        </button>
      </div>

      {/* Mobile toolbar */}
      <div className="md:hidden mt-3">
        <div
          className="flex items-center justify-between px-2 py-2 rounded-b-[6px]"
          style={{ background: "rgba(24,144,255,0.05)" }}
        >
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="p-2 text-[#666] hover:text-primary transition-colors"
            >
              <PhotoIcon />
            </button>
            <button
              type="button"
              className="p-2 text-[#666] hover:text-primary transition-colors"
            >
              <VideoIcon />
            </button>
            <button
              type="button"
              className="p-2 text-[#666] hover:text-primary transition-colors"
            >
              <EventIcon />
            </button>
            <button
              type="button"
              className="p-2 text-[#666] hover:text-primary transition-colors"
            >
              <ArticleIcon />
            </button>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 disabled:opacity-50 transition-colors text-white text-sm font-medium rounded-[6px] px-4 py-2"
          >
            <PostSendIcon />
            <span>{loading ? "Posting..." : "Post"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

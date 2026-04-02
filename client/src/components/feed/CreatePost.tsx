"use client";

import { useState } from "react";
import Image from "next/image";
import { currentUser } from "@/lib/demo-data";
import {
  PhotoIcon,
  VideoIcon,
  EventIcon,
  ArticleIcon,
  PostSendIcon,
  WriteIcon,
} from "../layout/ReferenceIcons";

export default function CreatePost() {
  const [content, setContent] = useState("");

  return (
    <div className="bg-card rounded-[6px] pt-6 pr-6 pb-6 pl-6 mb-4">
      {/* Top: avatar + textarea */}
      <div className="flex items-start">
        <div className="shrink-0 cursor-pointer">
          <Image
            src={currentUser.avatar}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full object-cover max-w-[40px] p-[1px]"
          />
        </div>

        {/* Floating label textarea */}
        <div className="relative flex-1 ml-3">
          <textarea
            className="w-full h-[88px] border-none outline-none resize-none bg-transparent text-foreground text-sm leading-relaxed pt-2 peer"
            placeholder=""
            value={content}
            onChange={(e) => setContent(e.target.value)}
            id="post-textarea"
          />
          {/* Floating label — hides when typing */}
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

      {/* Bottom action bar */}
      <div
        className="flex items-center justify-between mt-[10px] px-[15px] rounded-b-[6px] h-16"
        style={{ background: "rgba(24, 144, 255, 0.05)" }}
      >
        {/* Action buttons */}
        <div className="flex items-center">
          {[
            { icon: PhotoIcon, label: "Photo" },
            { icon: VideoIcon, label: "Video" },
            { icon: EventIcon, label: "Event" },
            { icon: ArticleIcon, label: "Article" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              className="flex items-center px-[10px] text-base font-normal text-[#666] transition-colors duration-200 hover:text-primary group"
            >
              <span className="mr-2 [&_path]:transition-colors [&_path]:duration-200 group-hover:[&_path]:fill-primary">
                <Icon />
              </span>
              {label}
            </button>
          ))}
        </div>

        {/* Post button */}
        <button
          type="button"
          className="flex items-center justify-center gap-2 bg-primary hover:bg-[#377DFF] transition-colors duration-200 text-white text-base font-medium rounded-[6px] px-[22px] py-3 border border-transparent"
        >
          <PostSendIcon />
          <span>Post</span>
        </button>
      </div>
    </div>
  );
}

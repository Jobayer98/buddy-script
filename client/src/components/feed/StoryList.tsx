"use client";

import Image from "next/image";
import { StoryPlusIcon, StoryArrowIcon } from "../layout/ReferenceIcons";
import { demoStories } from "@/lib/demo-data";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function StoryList() {
  return (
    <div className="relative mb-4">
      {/* Desktop Story Layout */}
      <div className="hidden md:block relative group">
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 z-10">
          <button
            type="button"
            className="w-7 h-7 bg-primary flex items-center justify-center rounded-[100] shadow-md hover:bg-primary/90 transition-all"
          >
            <StoryArrowIcon className="h-2 w-auto" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {/* Create Story */}
          <div className="relative h-[180px] rounded-md overflow-hidden cursor-pointer group/story">
            <Image
              src="/images/card_ppl1.png"
              alt="My Story"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/5" />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 gap-2 bg-gradient-to-t from-black/40 to-transparent">
              <div className="w-[30px] h-[30px] bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <StoryPlusIcon className="h-2.5 w-2.5" />
              </div>
              <span className="text-[13px] text-white font-medium">
                Your Story
              </span>
            </div>
          </div>

          {/* Public Stories */}
          {demoStories.slice(1, 4).map((story, idx) => (
            <div
              key={story.id}
              className="relative h-[180px] rounded-md overflow-hidden cursor-pointer group/story"
            >
              <Image
                src={`/images/card_ppl${idx + 2}.png`}
                alt={story.user.name}
                fill
                className="object-cover transition-transform duration-500 group-hover/story:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[13px] text-white font-medium truncate block">
                  {story.user.name}
                </span>
              </div>

              <div className="absolute bottom-10 left-4">
                <div className="w-[30px] h-[30px] rounded-full border-2 border-white overflow-hidden shadow-lg">
                  <Image
                    src="/images/mini_pic.png"
                    alt=""
                    width={30}
                    height={30}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Story Layout (Keep current implementation but update icons/styles if needed) */}
      <div className="md:hidden">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3 px-1">
            {/* Create Story Mobile */}
            <div className="flex flex-col items-center gap-2 shrink-0 cursor-pointer">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-primary/30" />
                <div className="absolute inset-1.5 rounded-xl overflow-hidden">
                  <Image
                    src="/images/mobile_story_img.png"
                    alt=""
                    fill
                    className="object-cover opacity-60"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-primary p-1 rounded-lg border-2 border-white shadow-lg">
                  <StoryPlusIcon className="h-2.5 w-2.5" />
                </div>
              </div>
              <span className="text-[10px] font-medium text-[#767676]">
                Your Story
              </span>
            </div>

            {/* Public Stories Mobile */}
            {demoStories.slice(1).map((story, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 shrink-0 cursor-pointer"
              >
                <div
                  className={`relative h-16 w-16 p-1 rounded-2xl border-2 transition-all ${idx % 2 === 0 ? "border-primary" : "border-[#edeff1]"}`}
                >
                  <div className="relative h-full w-full rounded-xl overflow-hidden">
                    <Image
                      src={story.image}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <span className="text-[10px] font-medium text-[#767676] truncate w-16 text-center">
                  {story.user.name.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { StoryPlusIcon, StoryArrowIcon } from "../layout/ReferenceIcons";
import { demoStories } from "@/lib/demo-data";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function StoryList() {
  return (
    <div className="relative mb-4">
      {/* Desktop Story Layout */}
      <div className="hidden md:block relative">
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10">
          <button
            type="button"
            className="w-7 h-7 bg-primary flex items-center justify-center rounded-full shadow-md hover:bg-primary/90 transition-all"
          >
            <StoryArrowIcon className="h-2 w-auto" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {/* Create Story Card */}
          <div className="relative h-[180px] rounded-md overflow-hidden cursor-pointer">
            <Image src="/images/card_ppl1.png" alt="My Story" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-4 gap-2">
              <button className="w-[30px] h-[30px] bg-primary rounded-full flex items-center justify-center border-2 border-white shadow">
                <StoryPlusIcon className="h-2.5 w-2.5" />
              </button>
              <span className="text-[13px] text-white font-medium">Your Story</span>
            </div>
          </div>

          {/* Public Story Cards */}
          {demoStories.slice(1, 4).map((story, idx) => (
            <div key={story.id} className="relative h-[180px] rounded-md overflow-hidden cursor-pointer group">
              <Image
                src={`/images/card_ppl${idx + 2}.png`}
                alt={story.user.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-10 left-3">
                <div className="w-[30px] h-[30px] rounded-full border-2 border-white overflow-hidden shadow">
                  <Image src="/images/mini_pic.png" alt="" width={30} height={30} className="object-cover" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-[13px] text-white font-medium truncate block">{story.user.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Story Layout */}
      <div className="md:hidden">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3 px-1">
            {/* Create Story */}
            <a href="#" className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="relative h-[72px] w-[60px] rounded-xl overflow-hidden">
                <Image src="/images/mobile_story_img.png" alt="" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow">
                    <StoryPlusIcon className="h-2 w-2" />
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-medium text-[#767676]">Your Story</span>
            </a>

            {/* Other Stories */}
            {demoStories.slice(1).map((story, idx) => (
              <a key={story.id} href="#" className="flex flex-col items-center gap-1.5 shrink-0">
                <div
                  className={`relative h-[72px] w-[60px] rounded-xl overflow-hidden border-2 ${
                    idx % 2 === 0 ? "border-primary" : "border-[#edeff1]"
                  }`}
                >
                  <Image src={story.image} alt={story.user.name} fill className="object-cover" />
                </div>
                <span className="text-[10px] font-medium text-[#767676] truncate w-[60px] text-center">
                  {story.user.name.split(" ")[0]}...
                </span>
              </a>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { SearchIcon, OnlineBadgeIcon } from "./ReferenceIcons";

const yourFriends = [
  {
    name: "Steve Jobs",
    title: "CEO of Apple",
    img: "/images/people1.png",
    lastActive: "5 minute ago",
  },
  {
    name: "Ryan Roslansky",
    title: "CEO of Linkedin",
    img: "/images/people2.png",
    online: true,
  },
  {
    name: "Dylan Field",
    title: "CEO of Figma",
    img: "/images/people3.png",
    online: true,
  },
  {
    name: "Steve Jobs",
    title: "CEO of Apple",
    img: "/images/people1.png",
    lastActive: "5 minute ago",
  },
  {
    name: "Ryan Roslansky",
    title: "CEO of Linkedin",
    img: "/images/people2.png",
    online: true,
  },
  {
    name: "Dylan Field",
    title: "CEO of Figma",
    img: "/images/people3.png",
    online: true,
  },
  {
    name: "Dylan Field",
    title: "CEO of Figma",
    img: "/images/people3.png",
    online: true,
  },
];

export default function RightSidebar() {
  return (
    <aside className="w-[280px] hidden xl:flex flex-col h-[calc(100vh-70px)] sticky top-[70px] overflow-y-auto no-scrollbar py-[18px] pl-4 gap-4">
      {/* You Might Like */}
      <div className="bg-card rounded-[6px] pt-6 pb-6 px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-[16px] font-medium text-foreground">
            You Might Like
          </h4>
          <Link
            href="#"
            className="text-[12px] font-medium text-primary leading-[18px]"
          >
            See All
          </Link>
        </div>

        {/* Divider */}
        <hr className="border-t border-[var(--divider)] mb-6" />

        {/* Person */}
        <div className="flex items-center mb-6">
          <div className="mr-5 shrink-0">
            <Link href="/profile">
              <Image
                src="/images/Avatar.png"
                alt="Radovan SkillArena"
                width={50}
                height={50}
                className="rounded-full object-cover w-[50px] h-[50px]"
              />
            </Link>
          </div>
          <div className="flex-1 min-w-0">
            <Link href="/profile">
              <h4 className="text-base font-medium text-foreground leading-[24px] truncate">
                Radovan SkillArena
              </h4>
            </Link>
            <p className="text-[12px] font-normal text-muted-foreground leading-[18px] truncate">
              Founder &amp; CEO at Trophy
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-1">
          <button className="flex-1 border border-[var(--divider)] bg-transparent text-muted-foreground font-medium text-[14px] leading-[22px] rounded-[6px] py-[9px] px-8 transition-colors hover:bg-[#377DFF] hover:text-white hover:border-[#377DFF]">
            Ignore
          </button>
          <button className="flex-1 bg-[#377DFF] text-white font-medium text-[14px] leading-[22px] rounded-[6px] py-2 px-8 transition-colors hover:bg-primary">
            Follow
          </button>
        </div>
      </div>

      {/* Your Friends */}
      <div className="bg-card rounded-[6px] pt-6 pb-[6px] px-6 flex-1">
        {/* Header + search */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[16px] font-medium text-foreground">
              Your Friends
            </h4>
            <Link
              href="#"
              className="text-[12px] font-medium text-primary leading-[18px]"
            >
              See All
            </Link>
          </div>

          {/* Search input — matches ._feed_right_inner_area_card_form */}
          <div className="relative mb-6">
            <SearchIcon className="absolute left-[18px] top-1/2 -translate-y-1/2 h-[17px] w-[17px] text-[#666]" />
            <input
              type="search"
              placeholder="input search text"
              className="w-full h-10 bg-muted border border-muted rounded-[32px] pl-[47px] pr-3 text-sm text-foreground placeholder:text-[rgba(0,0,0,0.25)] outline-none transition-colors hover:border-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Friend list */}
        <div>
          {yourFriends.map((friend, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between mb-6 px-[6px] py-[6px] rounded-[8px] cursor-pointer transition-colors hover:bg-[var(--hover-item)]"
            >
              {/* Avatar + info */}
              <div className="flex items-center flex-1 min-w-0">
                <div className="mr-4 shrink-0">
                  <Link href="/profile">
                    <Image
                      src={friend.img}
                      alt={friend.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover w-10 h-10"
                    />
                  </Link>
                </div>
                <div className="flex-1 min-w-0">
                  <Link href="/profile">
                    <h4 className="text-[14px] font-medium text-foreground leading-tight truncate">
                      {friend.name}
                    </h4>
                  </Link>
                  <p className="text-[11px] font-light text-foreground leading-tight truncate">
                    {friend.title}
                  </p>
                </div>
              </div>

              {/* Online badge or last active */}
              <div className="shrink-0 ml-2">
                {friend.online ? (
                  <OnlineBadgeIcon className="w-[14px] h-[14px]" />
                ) : (
                  <span className="text-[11px] font-normal leading-[21px] whitespace-nowrap text-muted-foreground">
                    {friend.lastActive}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

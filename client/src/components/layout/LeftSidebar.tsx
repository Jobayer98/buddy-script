"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LearningIcon,
  InsightsIcon,
  FindFriendsIcon,
  BookmarksIcon,
  GroupIcon,
  GamingIcon,
  SettingsSidebarIcon,
  SavePostIcon,
} from "./ReferenceIcons";
import { demoEvents } from "@/lib/demo-data";

const exploreItems = [
  { icon: LearningIcon, label: "Learning", href: "#", badge: "New" },
  { icon: InsightsIcon, label: "Insights", href: "#" },
  { icon: FindFriendsIcon, label: "Find friends", href: "/find-friends" },
  { icon: BookmarksIcon, label: "Bookmarks", href: "#" },
  { icon: GroupIcon, label: "Group", href: "/groups" },
  { icon: GamingIcon, label: "Gaming", href: "#", badge: "New" },
  { icon: SettingsSidebarIcon, label: "Settings", href: "#" },
  { icon: SavePostIcon, label: "Save post", href: "#" },
];

const suggestedPeople = [
  { name: "Steve Jobs", title: "CEO of Apple", img: "/images/people1.png" },
  {
    name: "Ryan Roslansky",
    title: "CEO of Linkedin",
    img: "/images/people2.png",
  },
  { name: "Dylan Field", title: "CEO of Figma", img: "/images/people3.png" },
];

export default function LeftSidebar() {
  return (
    <aside className="w-[280px] hidden xl:flex flex-col h-[calc(100vh-70px)] sticky top-[70px] overflow-y-auto no-scrollbar py-[18px] pr-4 gap-4">
      {/* Explore */}
      <div className="bg-card rounded-[6px] pt-6 pb-[6px] px-6 mb-0">
        <h4 className="text-[16px] font-medium text-foreground mb-6">
          Explore
        </h4>
        <ul className="space-y-6">
          {exploreItems.map((item) => (
            <li key={item.label} className="flex items-center justify-between">
              <Link
                href={item.href}
                className="flex items-center text-base font-medium text-foreground hover:text-primary transition-colors w-full"
              >
                <item.icon className="shrink-0 mr-[14px]" />
                {item.label}
              </Link>
              {item.badge && (
                <span className="bg-[#1ec577] text-white text-[13px] leading-tight w-9 h-6 flex items-center justify-center rounded-xl border-2 border-card shrink-0">
                  {item.badge}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Suggested People */}
      <div className="bg-card rounded-[6px] pt-6 pb-[6px] px-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-[16px] font-medium text-foreground">
            Suggested People
          </h4>
          <Link
            href="#"
            className="text-[12px] font-medium text-primary leading-[18px]"
          >
            See All
          </Link>
        </div>
        {suggestedPeople.map((person) => (
          <div
            key={person.name}
            className="flex items-center justify-between flex-wrap mb-6"
          >
            <div className="flex items-center flex-1">
              <div className="mr-4 shrink-0">
                <Link href="/profile">
                  <Image
                    src={person.img}
                    alt={person.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover h-10 w-10"
                  />
                </Link>
              </div>
              <div className="flex-1 min-w-0">
                <Link href="/profile">
                  <h4 className="text-[14px] font-medium text-foreground leading-tight truncate">
                    {person.name}
                  </h4>
                </Link>
                <p className="text-[11px] font-light text-foreground leading-tight truncate">
                  {person.title}
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <Link
                href="#"
                className="border border-[var(--divider)] rounded-sm text-[12px] font-medium text-muted-foreground px-[7px] py-[7px] leading-tight block transition-colors hover:text-white hover:bg-primary hover:border-primary"
              >
                Connect
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Events */}
      <div className="bg-card rounded-[6px] pt-6 pb-[6px] px-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-[16px] font-medium text-foreground">Events</h4>
          <Link
            href="#"
            className="text-[12px] font-medium text-primary leading-[18px]"
          >
            See all
          </Link>
        </div>
        {demoEvents.map((event) => (
          <Link key={event.id} href="#" className="block mb-4">
            <div className="bg-card shadow-[0px_4px_8px_rgba(0,0,0,0.08)] rounded-[6px] overflow-hidden">
              <div className="relative w-full h-[120px]">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center px-4 pt-5 pb-[14px]">
                <div className="bg-[#0ACF83] rounded-sm px-2 py-2 text-center shrink-0">
                  <p className="text-[18px] font-bold text-white leading-tight">
                    {event.date.day}
                  </p>
                  <p className="text-[18px] font-normal text-white leading-tight">
                    {event.date.month}
                  </p>
                </div>
                <div className="pl-2 flex-1 min-w-0">
                  <h4 className="text-base font-medium text-foreground leading-tight line-clamp-2">
                    {event.title}
                  </h4>
                </div>
              </div>
              <hr className="border-t border-[var(--divider)] mx-0 my-1" />
              <div className="flex items-center justify-between px-4 pb-3 pt-[2px]">
                <p className="text-[12px] font-medium text-muted-foreground opacity-70 leading-[18px]">
                  17 People Going
                </p>
                <Link
                  href="#"
                  className="text-[12px] font-medium text-primary leading-[18px] bg-accent border border-primary rounded-sm px-[14px] py-[3px] transition-colors hover:text-white hover:bg-primary"
                >
                  Going
                </Link>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}

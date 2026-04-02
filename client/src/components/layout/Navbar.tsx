"use client";

import Image from "next/image";
import Link from "next/link";
import {
  HomeIcon,
  UsersIcon,
  BellIcon,
  ChatIcon,
  SearchIcon,
  ChevronDownIcon,
  SettingsIcon,
  HelpIcon,
  LogOutIcon,
  MoreVerticalIcon,
} from "./ReferenceIcons";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 h-15 md:h-17.5 bg-card border-b border-border z-100 px-4 md:px-20">
      <div className="max-w-350 mx-auto h-full flex items-center justify-between">
        {/* Desktop & Mobile Left */}
        <div className="flex items-center gap-4 md:gap-8 flex-1 md:flex-none">
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo.svg"
              alt="Buddy Script"
              width={169}
              height={32}
              className="h-7 md:h-8 w-auto"
            />
          </Link>

          <div className="relative hidden xl:block">
            <SearchIcon className="absolute left-4.5 top-1/2 -translate-y-1/2 h-4.25 w-4.25 text-muted-foreground" />
            <Input
              placeholder="input search text"
              className="w-106 h-10 pl-11.75 bg-muted rounded-[32px] pr-3 text-sm text-foreground placeholder:text-[rgba(0,0,0,0.25)] transition-colors focus:bg-white"
            />
          </div>
        </div>

        {/* Mobile Search Toggle */}
        <div className="xl:hidden flex items-center gap-2">
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="p-2.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            <SearchIcon className="h-5.5 w-5.5" />
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden xl:flex items-center gap-4 md:gap-8">
          <ul className="flex items-center gap-1 md:gap-4">
            <li>
              <Link
                href="/"
                className={`relative block px-4 pt-5.5 pb-6.5 transition-colors group ${
                  pathname === "/"
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#00ACFF]"
                    : "text-foreground hover:text-primary hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-[#00ACFF] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0"
                }`}
              >
                <HomeIcon className="h-5.25 w-4.5" active={pathname === "/"} />
              </Link>
            </li>
            <li>
              <Link
                href="/friends"
                className={`relative block px-4 pt-5.5 pb-6.5 transition-colors ${
                  pathname === "/friends"
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#00ACFF]"
                    : "text-foreground hover:text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0 hover:after:h-0.5 hover:after:bg-[#00ACFF]"
                }`}
              >
                <UsersIcon
                  className="h-5 w-6.5"
                  active={pathname === "/friends"}
                />
              </Link>
            </li>

            <li>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={`relative block px-4 pt-5.5 pb-6.5 transition-colors outline-none ${
                    pathname === "/notifications"
                      ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#00ACFF]"
                      : "text-foreground hover:text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0 hover:after:h-0.5 hover:after:bg-[#00ACFF]"
                  }`}
                >
                  <BellIcon
                    className="h-5.5 w-5"
                    active={pathname === "/notifications"}
                  />
                  <span className="absolute top-4 right-2.5 min-w-4.25 h-4.25 bg-primary text-[11px] text-white flex items-center justify-center rounded-full border border-card font-normal p-0.75">
                    6
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-90 p-0 overflow-hidden shadow-none border-none animate-in slide-in-from-top-2 duration-200"
                >
                  <div className="p-4 border-b border-border flex items-center justify-between bg-card">
                    <h4 className="font-bold text-lg">Notifications</h4>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 hover:bg-muted rounded-full">
                        <MoreVerticalIcon className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="text-xs">
                          Mark as all read
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs">
                          Notifications settings
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="px-4 py-2 border-b border-border">
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="bg-muted/50 p-1 h-9">
                        <TabsTrigger value="all" className="flex-1 text-xs">
                          All
                        </TabsTrigger>
                        <TabsTrigger value="unread" className="flex-1 text-xs">
                          Unread
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <ScrollArea className="h-100 no-scrollbar">
                    <div className="divide-y divide-border/50">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="flex gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                        >
                          <div className="relative shrink-0">
                            <Avatar className="h-12 w-12 border border-border">
                              <AvatarImage
                                src={`/images/f${(i % 5) + 1}.png`}
                              />
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 bg-primary p-1 rounded-full border-2 border-card">
                              <BellIcon className="h-2 w-2 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm leading-tight text-foreground">
                              <span className="font-bold hover:text-primary transition-colors">
                                Steve Jobs
                              </span>{" "}
                              posted a link in your timeline.
                            </p>
                            <p className="text-[11px] text-muted-foreground font-medium">
                              42 minutes ago
                            </p>
                          </div>
                          {i < 3 && (
                            <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-3 border-t border-border bg-muted/20 text-center">
                    <button className="text-primary text-xs font-bold hover:underline">
                      View All Notifications
                    </button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>

            <li>
              <Link
                href="/chat"
                className={`relative block px-4 pt-5.5 pb-6.5 transition-colors ${
                  pathname === "/chat"
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#00ACFF]"
                    : "text-foreground hover:text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0 hover:after:h-0.5 hover:after:bg-[#00ACFF]"
                }`}
              >
                <ChatIcon
                  className="h-5.5 w-5.75"
                  active={pathname === "/chat"}
                />
                <span className="absolute top-4 right-2.5 min-w-4.25 h-4.25 bg-primary text-[11px] text-white flex items-center justify-center rounded-full border border-card font-normal p-0.75">
                  2
                </span>
              </Link>
            </li>
          </ul>

          <div className="h-8 w-px bg-border mx-2" />

          {/* Profile Dropdown - exact match to feed.html */}
          <div ref={profileRef} className="relative flex items-center gap-2">
            <div className="w-6 h-6 shrink-0">
              <Image
                src="/images/profile.png"
                alt="Profile"
                width={24}
                height={24}
                className="rounded-full w-6 h-6 object-cover"
              />
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <p className="text-base font-normal text-foreground leading-6">
                Dylan Field
              </p>
              <button className="border-0 bg-transparent ml-2 mt-[-3px] outline-none">
                <ChevronDownIcon className="h-[6px] w-[10px] text-foreground" />
              </button>
            </div>

            {/* Dropdown */}
            {isProfileOpen && (
              <div className="absolute top-[40px] right-0 w-[312px] bg-card rounded-[6px] shadow-[0px_10px_20px_rgba(0,0,0,0.08)] p-4 z-50">
                {/* Profile info */}
                <div className="flex items-center mb-4">
                  <div className="pr-2">
                    <Image
                      src="/images/profile.png"
                      alt="Profile"
                      width={54}
                      height={54}
                      className="w-[54px] h-[54px] rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-foreground leading-tight mb-1">
                      Dylan Field
                    </h4>
                    <Link href="/profile" className="text-sm text-[#377DFF]">
                      View Profile
                    </Link>
                  </div>
                </div>

                <hr className="border-t border-[#c4c8cc] border mb-4" />

                <ul className="space-y-4">
                  <li>
                    <Link
                      href="#"
                      className="flex items-center justify-between text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="bg-[#ebf2ff] p-[11px] rounded-full inline-flex">
                          <SettingsIcon className="w-[18px] h-[19px]" />
                        </span>
                        Settings
                      </div>
                      <button className="border-0 bg-transparent outline-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="6"
                          height="10"
                          fill="none"
                          viewBox="0 0 6 10"
                        >
                          <path
                            fill="#112032"
                            d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z"
                            opacity=".5"
                          />
                        </svg>
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center justify-between text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="bg-[#ebf2ff] p-[11px] rounded-full inline-flex">
                          <HelpIcon className="w-5 h-5" />
                        </span>
                        Help &amp; Support
                      </div>
                      <button className="border-0 bg-transparent outline-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="6"
                          height="10"
                          fill="none"
                          viewBox="0 0 6 10"
                        >
                          <path
                            fill="#112032"
                            d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z"
                            opacity=".5"
                          />
                        </svg>
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center justify-between text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="bg-[#ebf2ff] p-[11px] rounded-full inline-flex">
                          <LogOutIcon className="w-[19px] h-[19px]" />
                        </span>
                        Log Out
                      </div>
                      <button className="border-0 bg-transparent outline-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="6"
                          height="10"
                          fill="none"
                          viewBox="0 0 6 10"
                        >
                          <path
                            fill="#112032"
                            d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z"
                            opacity=".5"
                          />
                        </svg>
                      </button>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="xl:hidden absolute top-0 left-0 w-full h-[60px] bg-card flex items-center px-4 z-[110] animate-in fade-in duration-200">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5" />
            <Input
              autoFocus
              placeholder="Search..."
              className="w-full h-11 pl-11 pr-12 rounded-full bg-muted border-none text-[15px]"
            />
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-black text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

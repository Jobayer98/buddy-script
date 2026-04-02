"use client";

import Navbar from "./Navbar";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import MobileBottomNav from "./MobileBottomNav";
import ThemeToggler from "../ThemeToggler";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-[1400px] mx-auto flex pt-[60px] md:pt-[70px] px-3 xl:px-20">
        <LeftSidebar />
        <main className="flex-1 w-full max-w-[780px] min-h-[calc(100vh-70px)] py-4 md:py-6 px-3 md:px-4 mb-[66px] xl:mb-0">
          {children}
        </main>
        <RightSidebar />
      </div>
      <MobileBottomNav />
      <ThemeToggler />
    </div>
  );
}

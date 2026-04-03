"use client";

import { useState, useEffect } from "react";
import {
  ModeSwitchIconLight,
  ModeSwitchIconDark,
} from "./layout/ReferenceIcons";

export default function ThemeToggler() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: light)",
    ).matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 w-8 h-16 rounded-full shadow-lg transition-all duration-500 ${
        isDark
          ? "bg-gray-900 border-1 border-primary"
          : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {/* Knob — top in light mode, bottom in dark mode */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full shadow-md transition-all duration-700 ease-in-out ${
          isDark ? "top-[calc(100%-1.75rem)] bg-blue-600" : "top-1.5  bg-white"
        }`}
      />

      {/* Icon — bottom in light mode (moon), top in dark mode (sun) */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 flex items-center justify-center transition-all duration-700 ease-in-out ${
          isDark ? "top-1.5" : "top-[calc(100%-1.75rem)]"
        }`}
      >
        {isDark ? (
          <ModeSwitchIconDark className="w-4 h-4" />
        ) : (
          <ModeSwitchIconLight className="w-3 h-auto" />
        )}
      </div>
    </button>
  );
}

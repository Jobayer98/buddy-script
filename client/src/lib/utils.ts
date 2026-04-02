import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  const mins = Math.floor(diff / 60);
  if (diff < 3600) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.floor(diff / 3600);
  if (diff < 86400) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(diff / 86400);
  if (diff < 604800) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(dateStr).toLocaleDateString();
}

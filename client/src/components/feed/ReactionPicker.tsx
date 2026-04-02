"use client";

import { ReactionType } from "@/lib/types";

interface Props {
  onSelect: (type: ReactionType) => void;
  currentReaction?: ReactionType | null;
}

const reactions: { type: ReactionType; emoji: string; label: string }[] = [
  { type: "like", emoji: "👍", label: "Like" },
  { type: "love", emoji: "❤️", label: "Love" },
  { type: "haha", emoji: "😂", label: "Haha" },
  { type: "wow", emoji: "😮", label: "Wow" },
  { type: "sad", emoji: "😢", label: "Sad" },
  { type: "angry", emoji: "😠", label: "Angry" },
];

export default function ReactionPicker({ onSelect, currentReaction }: Props) {
  return (
    <div className="absolute bottom-full left-0 mb-2 flex items-center gap-1 bg-card rounded-full px-2 py-2 z-30 shadow-lg border border-border">
      {reactions.map(({ type, emoji, label }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-all hover:scale-125 ${
            currentReaction === type ? "bg-primary/10 scale-110" : ""
          }`}
          title={label}
        >
          <span className="text-2xl">{emoji}</span>
        </button>
      ))}
    </div>
  );
}

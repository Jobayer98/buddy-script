"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { ApiUser, ReactionType } from "@/lib/types";

interface Props {
  postId?: string;
  commentId?: string;
  totalCount: number;
}

export default function ReactionDisplay({
  postId,
  commentId,
  totalCount,
}: Props) {
  const { accessToken } = useAuth();
  const api = createApi(accessToken);
  const [allUsers, setAllUsers] = useState<
    Array<{ user: ApiUser; reactionType: ReactionType }>
  >([]);

  useEffect(() => {
    if (totalCount === 0) return;

    const fetchReactions = async () => {
      try {
        const query = postId ? `postId=${postId}` : `commentId=${commentId}`;
        const data = await api.get<{
          allReactions: Array<{
            userId: string;
            firstName: string;
            lastName: string;
            reactionType: ReactionType;
          }>;
        }>(`/likes?${query}`);

        // Convert to user objects with reaction type
        const users = data.allReactions.map((r) => ({
          user: { _id: r.userId, firstName: r.firstName, lastName: r.lastName },
          reactionType: r.reactionType,
        }));
        setAllUsers(users);
      } catch {}
    };

    fetchReactions();
  }, [totalCount, postId, commentId, accessToken]);

  if (totalCount === 0) return null;

  // Get first 5 users for display
  const displayUsers = allUsers.slice(0, 5);
  const remainingCount = totalCount - 5;

  return (
    <div className="flex items-center gap-2">
      {/* Stacked user profile images */}
      <div className="flex items-center -space-x-2">
        {displayUsers.map(
          (
            {
              user,
              reactionType,
            }: { user: ApiUser; reactionType: ReactionType },
            idx: number,
          ) => (
            <div
              key={`${user._id}-${idx}`}
              className="relative w-8 h-8 rounded-full border-2 border-card overflow-hidden bg-primary/20"
              style={{ zIndex: idx + 1 }}
              title={`${user.firstName} ${user.lastName}`}
            >
              <Image
                src="/images/post_img.png"
                alt={`${user.firstName} ${user.lastName}`}
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            </div>
          ),
        )}

        {/* Show +X if more than 5 reactions */}
        {remainingCount > 0 && (
          <div
            className="w-8 h-8 rounded-full bg-primary border-2 border-card flex items-center justify-center"
            style={{ zIndex: 0 }}
          >
            <span className="text-xs font-semibold text-white">
              {remainingCount}+
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

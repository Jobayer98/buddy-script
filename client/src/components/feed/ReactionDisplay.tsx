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

  // Get first 3 users for image stack
  const displayUsers = allUsers.slice(0, 3);
  const remainingCount = totalCount - displayUsers.length;

  return (
    <div className="flex items-center gap-2">
      {/* Stacked user profile images */}
      <div className="flex items-center -space-x-4">
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

        {/* Show +X alongside image stack when there are more */}
        {remainingCount > 0 && (
          <span className=" text-sm font-bold text-white bg-primary rounded-full w-8 h-8 z-20 flex items-center justify-center border-2 border-card">
            {remainingCount}+
          </span>
        )}
      </div>
    </div>
  );
}

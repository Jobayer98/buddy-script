"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import AppLayout from "@/components/layout/AppLayout";
import StoryList from "@/components/feed/StoryList";
import CreatePost from "@/components/feed/CreatePost";
import PostCard from "@/components/feed/PostCard";
import { createApi } from "@/lib/api";
import { ApiPost } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

interface FeedResponse {
  posts: ApiPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export default function Home() {
  const { accessToken } = useAuth();
  const api = createApi(accessToken);

  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observerTarget = useRef<HTMLDivElement>(null);

  // Initial load
  useEffect(() => {
    if (!accessToken) return;

    const fetchInitialPosts = async () => {
      try {
        const data = await api.get<FeedResponse>("/posts?page=1&limit=10");
        setPosts(data.posts);
        setHasMore(data.pagination.hasMore);
        setPage(1);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialPosts();
  }, [accessToken]);

  // Load more posts
  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await api.get<FeedResponse>(
        `/posts?page=${nextPage}&limit=10`,
      );
      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.pagination.hasMore);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [page, hasMore, loadingMore, api]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loadMorePosts]);

  const handlePostCreated = (post: ApiPost) =>
    setPosts((prev) => [post, ...prev]);
  const handlePostDeleted = (id: string) =>
    setPosts((prev) => prev.filter((p) => p._id !== id));

  return (
    <AppLayout>
      <div className="space-y-6">
        <StoryList />

        <CreatePost onPostCreated={handlePostCreated} />

        {loading ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground animate-pulse">
              Loading posts...
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No posts yet. Be the first to post!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onDeleted={handlePostDeleted}
                />
              ))}
            </div>

            {/* Intersection observer target */}
            <div ref={observerTarget} className="py-4">
              {loadingMore && (
                <div className="flex items-center justify-center gap-2">
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              )}
              {!hasMore && posts.length > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  You've reached the end
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}

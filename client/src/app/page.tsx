"use client"

import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import StoryList from "@/components/feed/StoryList"
import CreatePost from "@/components/feed/CreatePost"
import PostCard from "@/components/feed/PostCard"
import { createApi } from "@/lib/api"
import { ApiPost } from "@/lib/types"
import { useAuth } from "@/context/AuthContext"

export default function Home() {
  const { accessToken } = useAuth()
  const api = createApi(accessToken)

  const [posts, setPosts] = useState<ApiPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accessToken) return;
    api.get<ApiPost[]>("/posts")
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [accessToken])

  const handlePostCreated = (post: ApiPost) => setPosts((prev) => [post, ...prev])
  const handlePostDeleted = (id: string) => setPosts((prev) => prev.filter((p) => p._id !== id))

  return (
    <AppLayout>
      <div className="space-y-6">
        <StoryList />

        <CreatePost onPostCreated={handlePostCreated} />

        {loading ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground animate-pulse">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">No posts yet. Be the first to post!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onDeleted={handlePostDeleted} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

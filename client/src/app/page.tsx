"use client"

import AppLayout from "@/components/layout/AppLayout"
import StoryList from "@/components/feed/StoryList"
import CreatePost from "@/components/feed/CreatePost"
import PostCard from "@/components/feed/PostCard"
import { demoPosts } from "@/lib/demo-data"

export default function Home() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Stories Section */}
        <StoryList />

        {/* Create Post Section */}
        <CreatePost />

        {/* Posts Feed Section */}
        <div className="space-y-6">
          {demoPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Load More Trigger (Demo) */}
        <div className="py-10 text-center">
          <p className="text-sm text-muted-foreground animate-pulse">Loading more posts...</p>
        </div>
      </div>
    </AppLayout>
  )
}

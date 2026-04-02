export interface User {
  id: string
  name: string
  avatar: string
  handle: string
  status?: string
}

export interface Post {
  id: string
  user: User
  content: string
  image?: string
  timestamp: string
  likes: number
  comments: number
  shares: number
}

export interface Story {
  id: string
  user: User
  image: string
  isMe?: boolean
}

export interface Suggestion {
  id: string
  name: string
  avatar: string
  mutualFriends: number
}

export interface Event {
  id: string
  title: string
  date: {
    day: string
    month: string
  }
  image: string
  location: string
}

export const currentUser: User = {
  id: "me",
  name: "Me",
  avatar: "/images/txt_img.png",
  handle: "@me"
}

export const demoUsers: User[] = [
  { id: "1", name: "Ahmed", avatar: "/images/f1.png", handle: "@ahmed", status: "Active" },
  { id: "2", name: "Sara", avatar: "/images/f2.png", handle: "@sara", status: "Active" },
  { id: "3", name: "John", avatar: "/images/f3.png", handle: "@john", status: "Away" },
  { id: "4", name: "Doe", avatar: "/images/f4.png", handle: "@doe", status: "Active" },
]

export const demoStories: Story[] = [
  { id: "me-story", user: currentUser, image: "/images/mobile_story_img.png", isMe: true },
  { id: "s1", user: demoUsers[0], image: "/images/mobile_story_img1.png" },
  { id: "s2", user: demoUsers[1], image: "/images/mobile_story_img2.png" },
  { id: "s3", user: demoUsers[2], image: "/images/mobile_story_img1.png" },
]

export const demoPosts: Post[] = [
  {
    id: "p1",
    user: demoUsers[0],
    content: "Just started a new project with Buddy Script! Loving the experience so far. #nextjs #webdev",
    image: "/images/timeline_img.png",
    timestamp: "2 hours ago",
    likes: 124,
    comments: 12,
    shares: 5
  },
  {
    id: "p2",
    user: demoUsers[1],
    content: "Beautiful sunset today at the beach. Nature is amazing! 🌅",
    image: "/images/timeline_img.png",
    timestamp: "5 hours ago",
    likes: 89,
    comments: 8,
    shares: 2
  }
]

export const demoSuggestions: Suggestion[] = [
  { id: "sug1", name: "Jane Smith", avatar: "/images/f5.png", mutualFriends: 12 },
  { id: "sug2", name: "Mark Wilson", avatar: "/images/f6.png", mutualFriends: 5 },
  { id: "sug3", name: "Alice Brown", avatar: "/images/f7.png", mutualFriends: 8 },
]

export const demoEvents: Event[] = [
  {
    id: "e1",
    title: "Buddy Script Workshop",
    date: { day: "12", month: "APR" },
    image: "/images/feed_event1.png",
    location: "Online"
  }
]

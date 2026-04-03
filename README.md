# Buddy Script

A full-stack social feed application built with Next.js, Express, and MongoDB.

---

## Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Frontend | Next.js 15 (App Router), React 19, TypeScript   |
| Styling  | Tailwind CSS 4, shadcn/ui                        |
| Backend  | Node.js, Express.js, TypeScript                 |
| Database | MongoDB Atlas, Mongoose ODM                     |
| Auth     | JWT (access + refresh token), bcrypt            |
| Upload   | Multer + Cloudinary                             |

---

## Features

- **Authentication** — Register and login with JWT-based auth (access + refresh token strategy)
- **Feed** — Global post feed sorted by newest first, accessible to authenticated users only
- **Posts** — Create posts with optional image upload and public/private visibility
- **Likes** — Toggle like/unlike on posts, comments, and replies
- **Comments & Replies** — Threaded comments using a flat model with `parentId`
- **Ownership** — Edit/delete restricted to resource owner
- **Image hosting** — Post images uploaded to Cloudinary with automatic resizing and quality optimization

---

## Project Structure

```
buddy-script/
├── client/          # Next.js frontend
│   └── src/
│       ├── app/     # Routes: /, /login, /registration
│       ├── components/
│       ├── context/
│       └── lib/     # API client, auth helpers
├── server/          # Express REST API
│   └── src/
│       ├── models/       # User, Post, Comment, Like
│       ├── routes/       # auth, posts, comments, likes
│       ├── controllers/
│       └── middleware/   # JWT verification
└── docs/            # Architecture, Requirements, Implementation
```

---

## Image Upload

Post images are handled by Multer (memory storage) and streamed directly to Cloudinary. On upload, images are automatically resized to a 1200×1200 limit and compressed with `quality: auto:good`. The returned `secure_url` and `public_id` are stored on the post document. On post deletion, the image is removed from Cloudinary via `publicId`.

Required env vars: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

---

## Auth Design

The auth flow uses a dual-token strategy:

- **Access token** — 5-minute expiry, stored in React state only (never localStorage or cookies) to prevent XSS exposure
- **Refresh token** — 7-day expiry, stored in an `httpOnly` + `SameSite=Strict` cookie to mitigate CSRF
- On page refresh, the app calls `POST /auth/refresh` on mount to silently restore the session
- A silent refresh fires 30 seconds before the access token expires to keep the session alive

---

## Database Diagram

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    User     │──1:N──│      Post       │──1:N──│     Comment     │
│─────────────│       │─────────────────│       │─────────────────│
│ _id         │       │ _id             │       │ _id             │
│ firstName   │       │ userId (FK)     │       │ postId (FK)     │
│ lastName    │       │ content         │       │ userId (FK)     │
│ email       │       │ imageUrl        │       │ parentId (FK)   │
│ password    │       │ imagePublicId   │       │ content         │
│ createdAt   │       │ visibility      │       │ likeCount       │
└─────────────┘       │ likeCount       │       │ createdAt       │
       │              │ commentCount    │       └─────────────────┘
       │              │ createdAt       │                │
       │              └─────────────────┘                │ (self-ref)
       │                      │                          │
       └──────────1:N─────────┤──────────1:N─────────────┤
                              ▼                          ▼
                       ┌─────────────────┐
                       │      Like       │
                       │─────────────────│
                       │ _id             │
                       │ userId (FK)     │
                       │ postId (FK)     │
                       │ commentId (FK)  │
                       │ reactionType    │
                       │ createdAt       │
                       └─────────────────┘
```

---

## Key Design Decisions

**Flat comment model with `parentId`**
Comments and replies share the same collection. A `null` `parentId` indicates a top-level comment; a populated `parentId` indicates a reply. This keeps queries simple and avoids deeply nested documents.

**Like counts as counters, not arrays**
`likeCount` is stored as an integer on the post/comment document and incremented/decremented on toggle. This avoids unbounded array growth and keeps read performance predictable.

**Compound unique indexes on likes**
`{ userId, postId }` and `{ userId, commentId }` indexes at the database level enforce the one-like-per-user rule, making duplicate-like prevention reliable regardless of application logic.

**No global state library**
The scope of the app doesn't justify Redux or Zustand. State is managed with React `useState`/`useEffect` and a few custom hooks (`useAuth`, `usePosts`, `useComments`).

---

## API Overview

```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout

GET    /posts                  # Feed (public + own private)
POST   /posts                  # Create post (multipart/form-data)
DELETE /posts/:id              # Owner only

GET    /comments?postId=<id>
POST   /comments               # Comment or reply (parentId optional)

POST   /likes/toggle           # Toggle like on post or comment
```

---

## Getting Started

### Server

```bash
cd server
npm install
# configure .env (see .env.example)
npm run dev
```

### Client

```bash
cd client
npm install
# configure .env (see .env.example)
npm run dev
```

### Environment Variables

**server/.env**
```
PORT=3001
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_access_secret>
JWT_REFRESH_SECRET=<your_refresh_secret>
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
```

**client/.env**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

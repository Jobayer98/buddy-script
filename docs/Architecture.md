# 🏗️ Buddy Script — Architecture Document

## 1. System Overview

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│         Next.js 16 (App Router) + React 19              │
│         TypeScript · Tailwind CSS 4 · shadcn/ui         │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP (REST / JSON)
                       │ Authorization: Bearer <JWT>
┌──────────────────────▼──────────────────────────────────┐
│                        SERVER                           │
│              Node.js + Express.js (REST API)            │
│              JWT Auth · bcrypt · Multer (images)        │
└──────────────────────┬──────────────────────────────────┘
                       │ Mongoose ODM
┌──────────────────────▼──────────────────────────────────┐
│                      DATABASE                           │
│                    MongoDB Atlas                        │
│         users · posts · comments · likes                │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Project Structure

```
buddy-script/
├── client/                        # Next.js frontend
│   └── src/
│       ├── app/
│       │   ├── (auth)/
│       │   │   ├── login/page.tsx
│       │   │   └── registration/page.tsx
│       │   ├── layout.tsx
│       │   └── page.tsx           # Feed page (protected)
│       ├── components/
│       │   ├── feed/              # CreatePost, PostCard, StoryList
│       │   ├── layout/            # AppLayout, Navbar, Sidebars
│       │   └── ui/                # shadcn primitives
│       └── lib/
│           ├── api.ts             # Axios/fetch API client
│           ├── auth.ts            # JWT helpers (store/read token)
│           └── utils.ts
│
├── server/                        # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts              # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Post.ts
│   │   │   ├── Comment.ts
│   │   │   └── Like.ts
│   │   ├── middleware/
│   │   │   └── auth.ts            # JWT verify middleware
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── posts.ts
│   │   │   ├── comments.ts
│   │   │   └── likes.ts
│   │   ├── controllers/           # Business logic per route
│   │   └── index.ts               # Express app entry
│   ├── uploads/                   # Local image storage
│   ├── package.json
│   └── tsconfig.json
│
└── docs/
    ├── Requirements.md
    └── Architecture.md
```

---

## 3. Frontend Architecture

### Routing (Next.js App Router)

| Route           | Access    | Component                      |
| --------------- | --------- | ------------------------------ |
| `/login`        | Public    | `(auth)/login/page.tsx`        |
| `/registration` | Public    | `(auth)/registration/page.tsx` |
| `/`             | Protected | `page.tsx` (Feed)              |

### Auth Flow (Client)

1. User logs in → server returns `{ accessToken, user }` + sets `refreshToken` httpOnly cookie
2. Access token stored in **React context state only** (never localStorage, never cookie)
3. All API requests attach `Authorization: Bearer <accessToken>`
4. A `useEffect` interval fires 30 seconds before access token expiry → calls `POST /auth/refresh` silently
5. On page refresh → access token is lost from state → app calls `POST /auth/refresh` on mount to restore session using the httpOnly cookie
6. Next.js middleware reads a `session` cookie (non-sensitive flag set by server) to protect routes server-side

### State Management

- No global state library needed (scope is small)
- React `useState` / `useEffect` per component
- Custom hooks: `useAuth`, `usePosts`, `useComments`

### Key Components

```
AppLayout
├── Navbar
├── LeftSidebar
├── <children> (Feed)
│   ├── StoryList
│   ├── CreatePost
│   └── PostCard (× N)
│       ├── LikeButton
│       ├── CommentSection
│       │   └── CommentItem (× N)
│       │       └── ReplyItem (× N)
│       └── PostMenu (edit/delete — owner only)
└── RightSidebar
```

---

## 4. Backend Architecture

### Express App Structure

```
index.ts
  └── app.use('/auth',     authRouter)
  └── app.use('/posts',    postsRouter)    ← protected
  └── app.use('/comments', commentsRouter) ← protected
  └── app.use('/likes',    likesRouter)    ← protected
```

### Auth Middleware

```
Request → verifyJWT middleware → Controller
           ↓ invalid token
          401 Unauthorized
```

### Image Upload

- Multer middleware on `POST /posts`
- Saved to `server/uploads/`
- `imageUrl` stored as `/uploads/<filename>` in Post document
- Served via `express.static('uploads')`

---

## 5. Database Design

### users

```
{
  _id, firstName, lastName,
  email (unique, indexed),
  password (bcrypt hash),
  createdAt
}
```

### posts

```
{
  _id, userId (ref: User),
  content, imageUrl,
  visibility: 'public' | 'private',
  likeCount, commentCount,
  createdAt (indexed DESC)
}
```

### comments

```
{
  _id, postId (ref: Post, indexed),
  userId (ref: User),
  content,
  parentId (null = comment, ObjectId = reply),
  likeCount,
  createdAt
}
```

### likes

```
{
  _id, userId (ref: User),
  postId (ref: Post, nullable),
  commentId (ref: Comment, nullable),
  createdAt
}
Compound unique index: { userId, postId }
Compound unique index: { userId, commentId }
```

---

## 6. API Design

### Auth

```
POST /auth/register   → { firstName, lastName, email, password } → { accessToken, user } + sets refreshToken cookie
POST /auth/login      → { email, password } → { accessToken, user } + sets refreshToken cookie
POST /auth/refresh    → (reads refreshToken cookie) → { accessToken, user }
POST /auth/logout     → clears refreshToken cookie
```

### Feed / Posts

```
GET  /posts           → sorted by createdAt DESC, public + own private
POST /posts           → multipart/form-data { content, visibility, image? }
DELETE /posts/:id     → owner only
```

### Comments

```
GET  /comments?postId=<id>   → flat list (comments + replies)
POST /comments               → { postId, content, parentId? }
```

### Likes

```
POST /likes/toggle    → { postId? | commentId? } → toggle like/unlike
```

---

## 7. Security

| Concern          | Solution                                                                      |
| ---------------- | ----------------------------------------------------------------------------- |
| Password storage | bcrypt (salt rounds: 10)                                                      |
| Auth             | Access token: JWT HS256, **5 min expiry**, React state only                   |
|                  | Refresh token: JWT HS256, **7 day expiry**, httpOnly + SameSite=Strict cookie |
| Route protection | `verifyJWT` middleware reads `Authorization: Bearer` header                   |
| Duplicate likes  | Compound unique index on likes collection                                     |
| Input validation | express-validator on all POST routes                                          |
| Ownership checks | Compare `req.user.id` vs resource `userId`                                    |

---

## 8. Performance

| Concern               | Solution                                   |
| --------------------- | ------------------------------------------ |
| Feed query speed      | Index on `posts.createdAt`                 |
| Comment fetch speed   | Index on `comments.postId`                 |
| Like uniqueness check | Compound index on `likes`                  |
| No large arrays       | Like counts stored as counters, not arrays |

---

## 9. Environment Variables

### Server `.env`

```
PORT=3001
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### Client `.env`

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

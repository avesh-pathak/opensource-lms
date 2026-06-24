# Babua DSA — The Engineering Mastery Protocol

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

A full-stack Learning Management System built with Next.js 16, designed for modern developers to master DSA and System Design through gamified learning, mentorship, and community.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Admin Panel](#admin-panel)
- [Database Models](#database-models)
- [Security](#security)
- [Author](#author)

---

## Features

### Student Experience

| Feature | Description |
|---------|-------------|
| **Dashboard** | Gamified overview with XP, streaks, daily goals, and global leaderboards |
| **DSA Problems** | Full problem-solving engine with starter code in JS, Python, C++, Java |
| **Algorithm Visualizer** | 19 algorithm categories with step-by-step playback and time-travel debugging |
| **Custom Sheets** | Create personalized problem lists with progress tracking |
| **Hackathons** | Real-time competitive coding events with live submissions |
| **Squads** | Category-based study groups (DSA, System Design, Frontend, Backend, AI/ML) |
| **Mentorship** | Book 1:1 sessions — SOS, Mock Interview, Roast, Consult |
| **Community** | Topic-based discussions, Q&A, resume sharing, likes, pinning |
| **Analytics** | Toggle between DSA and System Design stats with charts |
| **Quiz** | Assessment module for self-evaluation |
| **Revision** | Spaced-repetition-style revision queue |
| **Projects** | Student project showcase |
| **Public Profiles** | Shareable user profiles at `/u/[username]` |

### Admin Command Center

A full 20-section admin dashboard at `/admin`:

- Overview dashboard with stats and charts
- User management with detail views
- Problem CRUD (create, edit, list)
- Pattern and subject management
- Hackathon and submission management
- Squad management
- Mentorship and booking management
- Community moderation
- Content moderation queue
- Earnings and financial tracking
- Analytics (engagement + web traffic)
- Announcement management
- Support ticket system
- Project management
- Data export engine (CSV, Excel, PDF)
- Platform settings

---

## Tech Stack

### Frontend

| Library | Purpose |
|---------|---------|
| Next.js 16 (App Router) | Full-stack React framework |
| React 19 | UI components |
| TypeScript 5 | Type safety |
| Tailwind CSS 4 | Utility-first styling |
| ShadCN/UI + Radix UI | Accessible component primitives |
| Zustand | State management |
| Recharts | Data visualization |
| React Flow | Algorithm/graph visualization |
| Monaco Editor | In-browser code editing |
| GSAP | Scroll animations |
| React Hook Form + Zod | Forms and validation |
| Sonner | Toast notifications |
| next-themes | Dark/light mode |

### Backend

| Library | Purpose |
|---------|---------|
| Next.js API Routes | Server endpoints |
| MongoDB Atlas + Mongoose | Database and ODM |
| jose | JWT authentication |
| bcryptjs | Password hashing |
| Zod | Request validation |

### Services

| Service | Purpose |
|---------|---------|
| Firebase (FCM) | Push notifications |
| Razorpay | Payment processing (HMAC verified) |
| Cloudinary | Image upload and optimization |
| Vercel Analytics | Performance monitoring |

---

## Getting Started

### Prerequisites

- **Node.js 18+**
- **npm / yarn / pnpm**
- A **MongoDB Atlas** account (free tier works)
- Optional: Firebase, Razorpay, Cloudinary accounts for full functionality

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/lms.git
cd lms

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Fill in your .env values (see Environment Variables below)

# 5. Start the development server
npm run dev
```

> **Note:** The Firebase service worker (`public/firebase-messaging-sw.js`) is auto-generated at build time from your `.env` variables. If push notifications aren't working, run `npm run generate-sw` manually.

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Minimal Setup (Database Only)

For local development, you only need MongoDB running. Everything else is optional.

```bash
# Minimum required .env
MONGODB_URI=mongodb://localhost:27017/babua-dsa
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

### Required

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for JWT token signing (min 32 chars) |
| `ADMIN_EMAIL` | Master admin login email |
| `ADMIN_PASSWORD` | Master admin login password |

### Optional (for full features)

| Variable | Description |
|----------|-------------|
| `DEMO_ADMIN_EMAIL` | Demo admin email for testing |
| `DEMO_ADMIN_PASSWORD` | Demo admin password |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase client config (push notifications) |
| `FIREBASE_ADMIN_*` | Firebase admin SDK (server-side notifications) |
| `RAZORPAY_KEY_ID` | Razorpay test/live key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client-side Razorpay key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `GITHUB_CLIENT_ID` | GitHub OAuth app ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run typecheck` | TypeScript type checking |
| `npm run format` | Format code with Prettier |
| `npm run validate` | Full pipeline: format + typecheck + build |
| `npm run dump` | Generate codebase dump |

---

## Project Structure

```
lms/
├── app/
│   ├── (admin)/admin/          # Admin dashboard (20 sections)
│   ├── (public)/               # Landing, auth, search, about
│   ├── (student)/dashboard/    # Student routes
│   │   ├── analytics/
│   │   ├── announcements/
│   │   ├── community/
│   │   ├── custom-sheet/
│   │   ├── groups/
│   │   ├── hackathons/
│   │   ├── leaderboard/
│   │   ├── mentorship/
│   │   ├── projects/
│   │   ├── quiz/
│   │   ├── revision/
│   │   ├── sessions/
│   │   └── topic/
│   ├── (student)/visualizer/   # Algorithm visualizer (19 categories)
│   ├── api/                    # API routes (27 route groups)
│   └── layout.tsx              # Root layout with providers
├── components/
│   ├── admin/                  # Admin-specific components
│   ├── student/                # Student-specific components
│   ├── mentor/                 # Mentor components
│   ├── shared/                 # Cross-role shared components
│   ├── ui/                     # ShadCN/UI base primitives
│   └── landing/                # Landing page sections
├── lib/
│   ├── algorithms/             # DSA implementations + visualizer logic
│   ├── guards/                 # Route and action guards
│   ├── services/               # Business logic services
│   ├── store/                  # Zustand stores (16+ stores)
│   ├── firebase/               # Firebase client + admin config
│   ├── dbConnect.ts            # Mongoose connection
│   ├── auth.ts                 # Authentication helper
│   ├── jwt.ts                  # JWT management
│   ├── rate-limit.ts           # Token bucket rate limiter
│   └── export-engine.ts       # CSV/Excel/PDF export
├── models/                     # Mongoose schemas (30 models)
├── hooks/                      # Custom React hooks
├── public/                     # Static assets
├── scripts/                    # Build and maintenance scripts
├── proxy.ts                    # Middleware (rate limiting + admin auth)
├── .env.example                # Environment variable template
└── package.json
```

---

## Routes

### Public Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, FAQ, CTA |
| `/about` | About page |
| `/privacy` | Privacy policy |
| `/search` | Search page |
| `/auth/admin-login` | Admin login page |

### Student Routes

| Route | Description |
|-------|-------------|
| `/dashboard` | Main student dashboard |
| `/dashboard/analytics` | DSA and System Design analytics |
| `/dashboard/announcements` | Platform announcements |
| `/dashboard/community` | Community discussions |
| `/dashboard/custom-sheet` | Custom problem sheets |
| `/dashboard/groups/[id]` | Study group details |
| `/dashboard/hackathons` | Hackathon listing and participation |
| `/dashboard/leaderboard` | Global rankings |
| `/dashboard/mentorship` | Mentorship hub |
| `/dashboard/profile` | User profile |
| `/dashboard/projects` | Projects showcase |
| `/dashboard/quiz` | Quiz module |
| `/dashboard/revision` | Revision queue |
| `/dashboard/roast` | AI roast feature |
| `/dashboard/sessions` | Booked sessions |
| `/dashboard/topic` | DSA topics |
| `/visualizer/[category]` | Algorithm visualizer |
| `/u/[username]` | Public user profile |

### Admin Routes

| Route | Description |
|-------|-------------|
| `/admin` | Admin overview dashboard |
| `/admin/core-engineering` | Core engineering content |
| `/admin/hackathons` | Hackathon management |
| `/admin/squads` | Squad management |
| `/admin/mentorship` | Mentorship management |
| `/admin/community` | Community moderation |
| `/admin/earnings` | Financial tracking |
| `/admin/analytics` | Engagement analytics |
| `/admin/web-analytics` | Website traffic |
| `/admin/moderation` | Content moderation |
| `/admin/problems` | Problem CRUD |
| `/admin/patterns` | Pattern management |
| `/admin/users` | User management |
| `/admin/support` | Support tickets |
| `/admin/projects` | Project management |
| `/admin/announcements` | Announcement management |
| `/admin/bookings` | Booking management |
| `/admin/settings` | Platform settings |

---

## Admin Panel

The admin panel at `/admin` is protected by JWT-based authentication. Access requires valid admin credentials set in your `.env` file.

### Admin Access

1. Navigate to `/auth/admin-login`
2. Enter admin credentials from your `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`)
3. You'll be redirected to the admin dashboard

### Admin Features

- **Overview Dashboard** — Stats cards, analytics charts, moderation queue, platform status
- **20 Management Sections** — Full CRUD for all entities
- **Export Engine** — Generate CSV, Excel, and PDF reports
- **Notification System** — Bell notifications for admin alerts
- **Collapsible Sidebar** — Theme toggle, logout, demo mode indicator

---

## Database Models

30 Mongoose models powering the platform:

| Model | Purpose |
|-------|---------|
| User | Users with XP, streaks, solved problems, resume |
| Problem | DSA problems with examples, constraints, starter code |
| Pattern | DSA patterns (Sliding Window, DP, Graphs, etc.) |
| Submission | Problem submissions with status and metrics |
| Hackathon | Competitive events with difficulty levels |
| HackathonSubmission | Submissions to hackathons |
| Booking | Mentorship session bookings |
| Mentor | Mentor profiles with availability |
| Squad | Study groups with categories |
| Community | Community categories |
| CommunityPost | Posts, likes, pinning, locking |
| Comment | Comments on posts |
| CustomSheet | User-created problem sheets |
| Announcement | Platform announcements |
| Notification | User notifications |
| Transaction | Payment transactions |
| ActivityLog | User activity audit trail |
| Project | Student projects |
| Roast | AI roast content |
| Ticket | Support tickets |
| PageView | Web analytics |
| + 9 more | Device tokens, availability, read receipts, etc. |

---

## Security

- **RBAC** — Role-Based Access Control (Student / Mentor / Admin) with middleware isolation
- **JWT Auth** — Token-based authentication via `jose` library
- **Rate Limiting** — Token bucket algorithm (10/10s auth, 20/1m payments, 200/1m API)
- **HMAC Payments** — Razorpay signature verification with idempotency
- **Zod Validation** — Runtime schema validation on all inputs
- **Audit Logging** — All admin actions tracked
- **Security Headers** — CSP, HSTS, X-Frame-Options via Next.js middleware

---

## License

This project is proprietary software. All rights reserved.

---

## Author

Built by **Avesh Pathak**

> Excellence through execution.

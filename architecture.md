# Architecture — Babua DSA LMS

High-level system design and architectural decisions for the Babua DSA Learning Management System.

---

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Request Flow](#request-flow)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Data Layer](#data-layer)
- [Authentication & Authorization](#authentication--authorization)
- [Payment Flow](#payment-flow)
- [Push Notifications](#push-notifications)
- [Algorithm Visualizer](#algorithm-visualizer)
- [Admin Panel](#admin-panel)
- [Export Engine](#export-engine)
- [Security](#security)
- [Deployment](#deployment)

---

## System Overview

Babua DSA is a full-stack Next.js 16 application using the App Router pattern. It follows a monolithic architecture where frontend, backend API routes, and middleware coexist in a single deployable unit.

**Core design principles:**
- **Domain-driven route organization** — routes grouped by user role (public, student, admin)
- **Dual database client strategy** — Mongoose for schema-validated models, native MongoDB driver for direct access
- **Frame-based visualization** — algorithms generate arrays of state frames played back by Zustand stores
- **Adapter pattern for exports** — data adapters decouple from format engines (CSV/Excel/PDF)
- **DB-first, push-bonus for notifications** — database records are the source of truth; push notifications are best-effort

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                           │
│                                                                     │
│  ┌──────────┐  ┌──────────────┐  ┌────────────┐  ┌──────────────┐  │
│  │  Landing  │  │   Student    │  │   Admin    │  │  Algorithm   │  │
│  │   Page    │  │  Dashboard   │  │  Command   │  │  Visualizer  │  │
│  │           │  │              │  │   Center   │  │  (19 algos)  │  │
│  └─────┬─────┘  └──────┬───────┘  └─────┬──────┘  └──────┬───────┘  │
│        │               │                │                 │          │
│        └───────────────┴────────┬───────┴─────────────────┘          │
│                                 │                                    │
│                    ┌────────────▼────────────┐                       │
│                    │   React Context (Auth)   │                       │
│                    │   Zustand Stores (16)    │                       │
│                    │   next-themes            │                       │
│                    └────────────┬────────────┘                       │
└─────────────────────────────────┼────────────────────────────────────┘
                                  │ HTTP/HTTPS
                                  │
┌─────────────────────────────────┼────────────────────────────────────┐
│                    NEXT.JS SERVER (Vercel / Node)                    │
│                                 │                                    │
│  ┌──────────────────────────────▼───────────────────────────────┐    │
│  │                    proxy.ts (Middleware)                      │    │
│  │                                                               │    │
│  │  1. IP Extraction (x-real-ip / x-forwarded-for)              │    │
│  │  2. Rate Limiting (3 tiers: auth/payment/api)                │    │
│  │  3. Admin JWT Verification (/admin/* routes)                  │    │
│  └──────────────────────────────┬───────────────────────────────┘    │
│                                 │                                    │
│  ┌──────────────────────────────▼───────────────────────────────┐    │
│  │                    API Routes (app/api/)                      │    │
│  │                                                               │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐    │    │
│  │  │  Auth    │ │ Payments │ │ Problems │ │  Mentorship  │    │    │
│  │  │ (Google) │ │(Razorpay)│ │  (CRUD)  │ │  (Booking)   │    │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘    │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐    │    │
│  │  │  Admin   │ │ Hackath. │ │Community │ │ Notifications│    │    │
│  │  │  (20)    │ │  (CRUD)  │ │ (Posts)  │ │   (FCM)      │    │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘    │    │
│  │                                                               │    │
│  │  Guards: requireAuth() / requireAdmin() / requireOwnership() │    │
│  │  Validation: Zod schemas (lib/validators.ts)                 │    │
│  │  Errors: handleApiError() (lib/api-utils.ts)                 │    │
│  └──────────────────────────────┬───────────────────────────────┘    │
│                                 │                                    │
│  ┌──────────────────────────────▼───────────────────────────────┐    │
│  │                      Service Layer                           │    │
│  │                                                               │    │
│  │  lib/firebase/push.ts     — Push notification dispatch       │    │
│  │  lib/notification-service.ts — DB + Push orchestration       │    │
│  │  lib/export-engine.ts     — CSV/Excel/PDF generation         │    │
│  │  lib/rate-limit.ts        — Sliding window rate limiter      │    │
│  │  lib/jwt.ts               — JWT sign/verify (jose)           │    │
│  │  lib/auth.ts              — Server-side session resolver     │    │
│  └──────────────────────────────┬───────────────────────────────┘    │
│                                 │                                    │
└─────────────────────────────────┼────────────────────────────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
┌─────────▼─────────┐  ┌─────────▼─────────┐  ┌─────────▼─────────┐
│   MongoDB Atlas    │  │   External APIs   │  │   Cloudinary      │
│                    │  │                    │  │                    │
│  30 Mongoose       │  │  Razorpay (Pay)   │  │  Image upload &    │
│  Models            │  │  Firebase (Push)   │  │  optimization      │
│                    │  │  Google OAuth      │  │                    │
│  Native driver     │  │  GitHub OAuth      │  │                    │
│  for direct access │  │                    │  │                    │
└────────────────────┘  └────────────────────┘  └────────────────────┘
```

---

## Request Flow

Every HTTP request follows this pipeline:

```
Browser
  → proxy.ts (middleware)
    → Rate limit check (3 tiers)
    → Admin JWT check (for /admin/*)
  → Next.js Router
    → Layout (providers, theme, auth context)
    → Page Component (server or client)
  → API Route (if data needed)
    → Guard checks (requireAuth / requireAdmin / requireOwnership)
    → Zod validation (input)
    → Business logic
    → Database query (Mongoose or native driver)
    → Response (JSON or error)
  → Client (state update via Zustand / SWR)
```

---

## Frontend Architecture

### Routing (App Router)

```
app/
├── (public)/           # No auth required
│   ├── page.tsx        # Landing page
│   ├── about/          # About page
│   ├── privacy/        # Privacy policy
│   ├── search/         # Search
│   └── auth/           # Login pages (admin-login)
│
├── (student)/          # Auth required (student role)
│   ├── dashboard/      # Main student dashboard
│   │   ├── analytics/
│   │   ├── community/
│   │   ├── hackathons/
│   │   ├── mentorship/
│   │   └── ...
│   ├── visualizer/     # Algorithm visualizer (19 categories)
│   └── u/[username]/   # Public profiles
│
├── (admin)/            # Admin auth required
│   └── admin/          # 20-section admin dashboard
│
└── api/                # API routes (27 route groups)
```

**Route groups** `(public)`, `(student)`, `(admin)` are Next.js layout groups — they don't affect the URL. They exist to apply different layout wrappers (auth checks, sidebars) to each role.

### State Management

**16 domain-separated Zustand stores** in `lib/store/`:

Each store manages one algorithm category's visualization state:
- Algorithm selection
- Playback state (current frame, speed, playing/paused)
- Frame array (generated by algorithm functions)
- Domain-specific data (array, graph nodes, tree data, etc.)

**Pattern:** Each store follows an identical interface — `setAlgorithm()`, `togglePlay()`, `nextStep()`, `prevStep()`, `reset()`, `generateInput()`.

**Data fetching:** SWR for server state (problems, user data, leaderboard).

### Component Hierarchy

```
components/
├── ui/                 # ShadCN/UI base primitives (button, dialog, etc.)
├── shared/             # Cross-role reusable (like-button, search, cards)
├── landing/            # Landing page sections
├── student/            # Student dashboard components
│   └── visualizer/     # 19 algorithm-specific visualizer components
├── admin/              # Admin panel widgets (sidebar, charts, export modal)
├── mentor/             # Mentor profiles and booking
├── payments/           # Razorpay checkout UI
├── providers/          # React context providers (auth, theme)
├── sidebar/            # Navigation sidebar
├── skeletons/          # Loading placeholder UIs
└── notifications/      # Notification bell and list
```

---

## Backend Architecture

### Dual Database Client Strategy

| Client | Used For | File |
|--------|----------|------|
| **Mongoose** | Schema-validated models (30 models) | `lib/dbConnect.ts` |
| **Native MongoDB Driver** | Direct collection access, auth, notifications | `lib/mongodb.ts` |

**Why two clients?**
- Mongoose provides schema validation, middleware hooks, and query building — ideal for business models.
- The native driver avoids Mongoose overhead for simple queries (auth lookups, device token operations, notification reads).

**Connection pooling:**
- Mongoose: Global cached connection via `(global as any).mongoose` (survives HMR in dev).
- Native driver: `maxPoolSize: 10`, module-level singleton in production, global cache in dev.

### API Route Pattern

Every API route follows this structure:

```typescript
// app/api/[domain]/route.ts
import { auth } from '@/lib/auth'
import { requireAuth, requireAdmin } from '@/lib/guards/auth-guard'
import { handleApiError } from '@/lib/api-utils'
import { z } from 'zod'

const schema = z.object({ ... })

export async function GET(request: NextRequest) {
  try {
    // 1. Auth guard
    const session = await requireAuth()

    // 2. Input validation
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return handleApiError(new ValidationError(parsed.error))
    }

    // 3. Business logic + DB query
    const data = await Model.find({ ... })

    // 4. Response
    return NextResponse.json({ data })
  } catch (error) {
    return handleApiError(error)
  }
}
```

### Guards

| Guard | Purpose | Error |
|-------|---------|-------|
| `requireAuth()` | Ensures valid session | 401 Unauthorized |
| `requireAdmin()` | Ensures admin role | 403 Forbidden |
| `requireOwnership(resourceUserId)` | Ensures user owns resource OR is admin | 403 Forbidden |
| `validateDemoAccess(session, method)` | Blocks write operations for demo admins | 403 Forbidden |

### Error Handling

Centralized in `lib/api-utils.ts`:
- `ApiError` — typed errors with status codes
- `ValidationError` — Zod validation failures (400)
- `handleApiError(error)` — catches, logs, and returns safe error responses

---

## Data Layer

### Core Models (30 Mongoose Schemas)

```
┌─────────────────────────────────────────────────────────────┐
│                      User Domain                             │
│                                                               │
│  User ──┬── Submission (problems solved)                     │
│         ├── ActivityLog (audit trail)                        │
│         ├── CustomSheet (personal problem lists)             │
│         ├── DeviceToken (FCM push tokens)                    │
│         └── Transaction (payments)                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Content Domain                            │
│                                                               │
│  Problem ─── Submission (test results)                       │
│  Pattern ─── Problem (many-to-many)                          │
│  Project ─── User (owner)                                    │
│  Story ──── User (author)                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  Community Domain                            │
│                                                               │
│  Community ─── CommunityPost ─── Comment                      │
│  Announcement ─── AnnouncementRead                           │
│  Notification                                                 │
│  AdminNotification                                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  Mentorship Domain                           │
│                                                               │
│  Mentor ──── MentorAvailability (time slots)                 │
│  Booking ──── Transaction (payment)                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  Social Domain                               │
│                                                               │
│  Squad (study groups) ─── User (members)                     │
│  Hackathon ──── HackathonSubmission                          │
│  Roast (AI-generated)                                        │
│  Ticket (support)                                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  Analytics Domain                            │
│                                                               │
│  PageView (web analytics)                                    │
│  Utilities (shared data)                                     │
└─────────────────────────────────────────────────────────────┘
```

### Key Relationships

| Relationship | Type | Description |
|-------------|------|-------------|
| User → Problem | Many-to-Many | Via Submission model |
| Problem → Pattern | Many-to-Many | Problems belong to patterns |
| Mentor → Availability | One-to-Many | Time slots |
| Booking → Mentor + User | Many-to-One | Scheduled sessions |
| Squad → User | Many-to-Many | Members with roles |
| CommunityPost → Community | Many-to-One | Posts within communities |
| CustomSheet → User | Many-to-One | Personal problem lists |

---

## Authentication & Authorization

### JWT Token System

- **Library:** `jose` (Edge-compatible, not `jsonwebtoken`)
- **Algorithm:** HS256
- **Expiry:** 7 days
- **Storage:** httpOnly, secure, sameSite=lax cookie named `session`

### Auth Flows

**Google OAuth (Students):**
```
1. GET /api/auth/google → Redirect to Google consent screen
2. Google callback → Exchange code for tokens
3. Fetch user info from Google
4. Upsert user in MongoDB
5. Create JWT with user profile
6. Set httpOnly cookie → Redirect to /dashboard
```

**Admin Login:**
```
1. POST /api/admin/auth { email, password }
2. Compare against ADMIN_EMAIL/ADMIN_PASSWORD (bcrypt)
   or DEMO_ADMIN_EMAIL/DEMO_ADMIN_PASSWORD (plaintext)
3. Create JWT with role: 'admin', isDemo: true/false
4. Set httpOnly cookie → Redirect to /admin
```

### Role Hierarchy

```
Admin (Master)  ─── Full access, can modify everything
Admin (Demo)    ─── Read-only access, writes blocked by demo guard
Student         ─── Standard user, can solve problems, book mentors
```

---

## Payment Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Student  │     │ Frontend │     │  Server  │     │ Razorpay │
│          │     │          │     │          │     │          │
│ clicks   │────▶│ POST     │────▶│ Create   │────▶│ Order    │
│ "Pay"    │     │ /order   │     │ Order    │     │ Created  │
│          │     │          │     │          │     │          │
│          │     │ Razorpay │◀────│ Return   │◀────│          │
│          │     │ Checkout │     │ order_id │     │          │
│          │     │ opens    │     │          │     │          │
│ pays     │────▶│ receives │────▶│ POST     │────▶│ Verify   │
│          │     │ signature│     │ /verify  │     │ HMAC sig │
│          │     │          │     │          │     │          │
│          │     │ Success! │◀────│ Verify   │◀────│ Valid    │
│          │     │          │     │ + Save   │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

**Security measures:**
- **HMAC signature verification** — server recomputes SHA-256 and compares with Razorpay's signature
- **Amount verification** — server checks payment amount matches expected amount
- **Idempotency** — duplicate verify requests return cached success (prevents double charges)
- **MongoDB transactions** — atomic slot booking prevents race conditions on mentor availability

---

## Push Notifications

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Server Side                           │
│                                                          │
│  API Route / Service                                     │
│       │                                                  │
│       ▼                                                  │
│  notifyAdmins() / notifyAllStudents()                    │
│       │                                                  │
│       ├──▶ DB Record (adminNotifications / notifications)│
│       │                                                  │
│       └──▶ sendPushToAdmins() / sendPushToAllUsers()     │
│                │                                         │
│                ├── Query deviceTokens collection         │
│                ├── Chunk tokens (batch of 500)           │
│                ├── Firebase Admin SDK multicast          │
│                └── Cleanup invalid tokens                │
│                                                          │
└─────────────────────────────────────────────────────────┘
                         │
                    FCM (Firebase Cloud Messaging)
                         │
┌────────────────────────▼────────────────────────────────┐
│                    Client Side                           │
│                                                          │
│  firebase-messaging-sw.js (Service Worker)               │
│       │                                                  │
│       ├── Background: showNotification()                 │
│       └── Foreground: onForegroundMessage() callback     │
│                                                          │
│  lib/firebase/client.ts                                  │
│       ├── getFCMToken() → register SW + get token        │
│       └── onForegroundMessage(callback)                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Design decision:** DB is the guarantee, push is the bonus. Every notification creates a DB record first. Push is best-effort — failures are logged but don't block the flow.

---

## Algorithm Visualizer

### Frame-Based Engine

The visualizer works by pre-generating an array of **state frames** for each algorithm. The frontend plays back these frames like a video.

```
Algorithm Function          Zustand Store           React Component
┌──────────────┐          ┌──────────────┐        ┌──────────────┐
│ generateXxx  │──frames──▶│  frames[]    │──play──▶│  Canvas /    │
│ Frames()     │          │  currentFrame │        │  React Flow  │
│              │          │  isPlaying    │        │              │
│ Returns:     │          │  playbackSpeed│        │ Renders:     │
│ Visualizer   │          │              │        │ - Array bars  │
│ Frame[]      │          │ nextStep()   │        │ - Graph nodes│
└──────────────┘          │ prevStep()   │        │ - Tree edges  │
                          │ togglePlay() │        │ - Code lines  │
                          └──────────────┘        └──────────────┘
```

### VisualizerFrame Structure

Each frame captures the complete state of the algorithm at one step:

```typescript
{
  array: number[]              // Current data state
  highlights: number[]         // Primary indices (active elements)
  secondaryHighlights: number[] // Secondary indices (comparison)
  visited: number[]            // Already processed
  pointers: Record<string, number> // Named pointers (i, j, pivot)
  explanation: string          // "Comparing 3 vs 5..."
  activeLine: number           // Which pseudocode line is highlighted
  variables: Record<string, any> // Current variable values
  comparisons: number          // Running counter
  phase: string                // 'search' | 'compare' | 'found' | ...
  ranges?: Range[]             // Divide & conquer ranges
  sortedIndices?: number[]     // Confirmed sorted positions
  nodes?: Node[]               // React Flow nodes (graph/tree)
  edges?: Edge[]               // React Flow edges (graph/tree)
}
```

### 19 Algorithm Categories

| Category | Data Structure | Visualization |
|----------|---------------|---------------|
| Arrays | Array bars | Bar chart with highlights |
| Sorting | Array bars | Bar chart with swaps |
| Strings | Character array | Character highlights |
| Searching | Array bars | Pointer movement |
| Linked List | Nodes + pointers | Node diagram |
| Stack | Stack visual | Push/pop animation |
| Queue | Queue visual | Enqueue/dequeue |
| Hashing | Hash table | Bucket visualization |
| Recursion | Call stack | Stack frame tree |
| Trees | Binary tree | Tree diagram (React Flow) |
| Heaps | Heap array | Tree + array dual view |
| Tries | Trie nodes | Trie diagram (React Flow) |
| Graphs | Nodes + edges | Graph diagram (React Flow) |
| Greedy | Array + choices | Decision highlights |
| Dynamic Programming | 2D grid | DP table fill |
| Backtracking | Decision tree | Tree with pruning |
| Bit Manipulation | Binary values | Bit visualization |
| Sliding Window | Array + window | Window bounds |
| Two Pointers | Array + pointers | Dual pointer movement |

---

## Admin Panel

### 20-Section Dashboard

```
/admin
├── Overview          # Stats cards, charts, moderation queue
├── Core Engineering  # Content management
├── Hackathons        # Event management + submissions
├── Squads            # Study group management
├── Mentorship        # Mentor + calendar management
├── Community         # Community moderation
├── Earnings          # Financial tracking + revenue charts
├── Analytics         # Engagement charts (user growth, content, submissions)
├── Web Analytics     # Page views, traffic sources
├── Moderation        # Content moderation queue
├── Problems          # CRUD (list, create, edit [id])
├── Patterns          # Pattern/subject management
├── Users             # User management + detail views [id]
├── Support           # Support ticket system
├── Projects          # Project management
├── Announcements     # Platform announcements
├── Bookings          # Mentorship booking management
├── Settings          # Platform settings
├── Export System     # CSV/Excel/PDF data export (modal)
└── Notifications     # Bell notification system
```

### Admin Sidebar Features
- Collapsible sidebar with icon-only mode
- Theme toggle (dark/light)
- Notification bell with unread count
- Demo mode indicator
- Export system button
- "Back to Dashboard" link
- Logout

---

## Export Engine

### Two-Layer Adapter Pattern

```
POST /api/admin/export
  │
  ├──▶ ExportAdapters[type](filters)    ── Data Layer
  │       │
  │       ├── students()    → { filename, title, columns, data, summary }
  │       ├── results()     → { filename, title, columns, data, summary }
  │       └── auditLogs()   → { filename, title, columns, data, summary }
  │
  └──▶ ExportEngine.to[Format](config)  ── Format Layer
          │
          ├── toCSV()    → csv-stringify/sync
          ├── toExcel()  → ExcelJS (styled workbook)
          └── toPDF()    → jsPDF + jspdf-autotable
```

**Key design:** Data adapters are decoupled from format engines. The same `students()` data can produce CSV, Excel, or PDF output. Adding a new format (e.g., JSON) only requires adding a new `ExportEngine.toJSON()` method.

---

## Security

### Defense Layers

| Layer | Implementation |
|-------|---------------|
| **Transport** | HTTPS enforced via HSTS headers |
| **Middleware** | Rate limiting (3 tiers) + admin JWT check |
| **Guards** | `requireAuth()`, `requireAdmin()`, `requireOwnership()` |
| **Validation** | Zod schemas on all inputs |
| **Passwords** | bcrypt hashing (admin passwords) |
| **Payments** | HMAC-SHA256 signature verification |
| **Session** | httpOnly, secure, sameSite cookies |
| **Headers** | CSP, HSTS, X-Frame-Options, X-Content-Type-Options |
| **RBAC** | Role-based access (Student / Mentor / Admin) |
| **Audit** | Activity logging for all admin actions |

### Rate Limiting Tiers

| Tier | Limit | Scope |
|------|-------|-------|
| Auth | 10 req / 10s | `/api/auth/*`, token registration |
| Payments | 20 req / 60s | `/api/payments/*` |
| General | 200 req / 60s | All other API routes |

**Note:** Rate limiting is in-memory (sliding window log). Works per-serverless-instance on Vercel. For distributed rate limiting, a Redis/Upstash integration would be needed.

---

## Deployment

### Vercel (Primary Target)

```
GitHub Repo → Vercel Build → Edge Functions (middleware)
                           → Serverless Functions (API routes)
                           → Static Assets (public/)
                           → ISR/PPR (pages)
```

### Environment Setup

1. MongoDB Atlas cluster (M0 free tier minimum)
2. Firebase project (for FCM push notifications)
3. Razorpay account (for payments)
4. Cloudinary account (for image uploads)
5. Vercel project linked to GitHub repo

### Build Pipeline

```
npm install
  → prebuild: node scripts/generate-firebase-sw.js
  → next build
  → Deploy to Vercel
```

### Key Vercel Config

- **Edge Runtime:** Middleware (`proxy.ts`) runs at the edge for low-latency rate limiting
- **Serverless:** API routes run as serverless functions with cold start optimization
- **Analytics:** `@vercel/analytics` and `@vercel/speed-insights` for monitoring
- **Image Optimization:** Automatic WebP/AVIF via `next/image`

---

## Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Next.js App Router** | Server components, streaming, layouts, route groups for role-based UX |
| **Dual MongoDB clients** | Mongoose for complex models, native driver for simple queries (perf) |
| **Frame-based visualizer** | Pre-computed states enable smooth playback, time-travel, and step-by-step debugging |
| **Adapter pattern exports** | Decouples data from format — add new formats without touching data logic |
| **DB-first notifications** | Guarantees delivery even if push fails; push is best-effort |
| **In-memory rate limiting** | Simple, no external deps; acceptable for single-instance/serverless |
| **jose over jsonwebtoken** | Edge Runtime compatibility for middleware |
| **Zustand over Redux** | Lightweight, no boilerplate, perfect for domain-separated stores |
| **Guards in API routes** | Composable, explicit auth checks rather than hidden middleware |
| **Demo admin mode** | Allows full exploration without risk of data modification |

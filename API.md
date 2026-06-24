# API Reference

Complete documentation for all Babua DSA LMS API endpoints.

**Base URL:** `https://your-domain.com/api` (production) or `http://localhost:3000/api` (development)

**Authentication:** Most endpoints require a valid JWT session cookie. Admin endpoints require `role: 'admin'`.

---

## Table of Contents

- [Authentication](#authentication)
- [User Profile](#user-profile)
- [Problems & Topics](#problems--topics)
- [Community](#community)
- [Hackathons](#hackathons)
- [Squads](#squads)
- [Mentorship](#mentorship)
- [Payments](#payments)
- [Notifications](#notifications)
- [Projects](#projects)
- [Custom Sheet](#custom-sheet)
- [Leaderboard](#leaderboard)
- [Admin](#admin)
- [Public](#public)
- [Analytics](#analytics)

---

## Authentication

### `GET /api/auth/session`

Get the current logged-in user from the session cookie.

| | |
|---|---|
| **Auth** | Optional |
| **Response** | `{ user: { id, email, name, image, role, ... } }` or `null` |

### `POST /api/auth/signout`

Clear the session cookie (logout).

| | |
|---|---|
| **Auth** | None |
| **Response** | `{ success: true }` |

### `GET /api/auth/google`

Initiate Google OAuth login flow. Redirects to Google consent screen, then back to `/dashboard`.

| | |
|---|---|
| **Auth** | None |
| **Query** | `?code=<oauth_code>` (on callback) |
| **Response** | Redirect (302) |

### `GET /api/auth/callback/github`

Initiate GitHub OAuth login flow. Same pattern as Google.

| | |
|---|---|
| **Auth** | None |
| **Query** | `?code=<oauth_code>` (on callback) |
| **Response** | Redirect (302) |

---

## User Profile

### `POST /api/user/profile`

Update the current user's profile.

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ name?, gender?, username?, college?, image?, linkedIn?, leetCode?, bio?, isProfilePublic?, isResumePublic? }` |
| **Response** | `{ success: true }` |

### `GET /api/user/progress`

Get solved problems, XP, and streak.

| | |
|---|---|
| **Auth** | Student |
| **Response** | `{ solvedProblems, experiencePoints, currentStreak, lastActivityDate }` |

### `POST /api/user/progress`

Mark a problem as solved. Awards XP (Easy: 10, Medium: 25, Hard: 50).

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ problemId: string }` |
| **Response** | `{ success, solved, xpGained, totalXP, solvedCount }` |

### `GET /api/user/state`

Get user state (problem tracker).

| | |
|---|---|
| **Auth** | Student |
| **Response** | `{ data: { problems: { [id]: { status, ... } } } }` |

### `POST /api/user/state`

Save user state and recalculate XP.

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ data: { problems: { [id]: { status, ... } } } }` |
| **Response** | `{ success: true, points, problemsSolved }` |

### `GET /api/user/sync`

Get synced data from cloud (progress, mentorship sessions, user goal).

| | |
|---|---|
| **Auth** | Student |
| **Response** | `{ progress, mentorshipSessions, userGoal }` |

### `POST /api/user/sync`

Merge progress data (conflict resolution by timestamp).

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ progress?, mentorshipSessions?, userGoal? }` |
| **Response** | `{ progress, mentorshipSessions, userGoal, success: true }` |

### `GET /api/user/check-username`

Check if a username is available.

| | |
|---|---|
| **Auth** | Student |
| **Query** | `?username=<value>` |
| **Response** | `{ available: boolean, username: string }` |

### `GET /api/user/generate-username`

Generate a unique username based on name/email.

| | |
|---|---|
| **Auth** | Student |
| **Response** | `{ username: string }` |

### `POST /api/user/upload-signature`

Get a Cloudinary upload signature for avatar or resume.

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ type: "avatar" | "resume" }` |
| **Response** | `{ signature, timestamp, cloudName, apiKey, folder }` |

### `POST /api/user/upload-resume`

Upload a resume (PDF/DOC/DOCX, max 5MB) to Cloudinary.

| | |
|---|---|
| **Auth** | Student |
| **Body** | `FormData { file: File }` |
| **Response** | `{ success, url, publicId, fileName, postId }` |

### `POST /api/user/save-resume`

Save a previously uploaded resume URL to profile.

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ resumeUrl, resumePublicId, fileName }` |
| **Response** | `{ success, message, postId }` |

### `POST /api/user/delete-resume`

Remove resume from profile.

| | |
|---|---|
| **Auth** | Student |
| **Response** | `{ success, message }` |

### `GET /api/user/resume/[username]`

Fetch a user's public resume (binary stream).

| | |
|---|---|
| **Auth** | None (user must have `isResumePublic: true`) |
| **Response** | Binary file stream (PDF/DOC) |

---

## Problems & Topics

### `GET /api/problems`

List all DSA problems (cached, lightweight).

| | |
|---|---|
| **Auth** | None |
| **Response** | `{ problems: [{ _id, title, slug, difficulty, topic, order, videoId, status, starred }] }` |

### `GET /api/topics`

Aggregate topics from problems with domain classification.

| | |
|---|---|
| **Auth** | None |
| **Query** | `?domain=dsa` (optional) |
| **Response** | `[{ name, id, total, solved, inProgress, problems, domain }]` |

### `GET /api/patterns`

List all DSA patterns with problem counts (cached).

| | |
|---|---|
| **Auth** | None |
| **Response** | `[{ name, domain, subject, total, solved }]` |

### `GET /api/theory`

List all theory articles.

| | |
|---|---|
| **Auth** | Student |
| **Response** | `[TheoryArticle, ...]` |

### `GET /api/theory/[slug]`

Get a specific theory article by slug.

| | |
|---|---|
| **Auth** | Student |
| **Response** | `TheoryArticle` |

### `GET /api/quiz`

Fetch all quiz topics.

| | |
|---|---|
| **Auth** | None |
| **Response** | `{ topics: [...] }` |

---

## Community

### `GET /api/communities`

List active communities (auto-seeds defaults if empty).

| | |
|---|---|
| **Auth** | None |
| **Query** | `?slug=<slug>` (optional) |
| **Response** | `[{ _id, name, slug, description, icon, themeColor }]` |

### `GET /api/community/posts`

List published posts (pinned first).

| | |
|---|---|
| **Auth** | None |
| **Query** | `?slug=<community_slug>` or `?communityId=<id>` |
| **Response** | `[{ _id, title, content, author, community, likes, ... }]` |

### `POST /api/community/posts`

Create a new post.

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ communitySlug?, communityId?, title, content, type?: "standard"|"question"|"discussion" }` |
| **Response** | `{ success: true, post }` |

### `POST /api/community/likes`

Toggle like/unlike on a post.

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ postId: string }` |
| **Response** | `{ liked: boolean, likesCount: number }` |

### `GET /api/community/comments`

Fetch comments for a post.

| | |
|---|---|
| **Auth** | None |
| **Query** | `?postId=<id>` |
| **Response** | `[{ _id, content, author, createdAt }]` |

### `POST /api/community/comments`

Add a comment.

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ postId, content }` |
| **Response** | `{ success: true, comment }` |

### `DELETE /api/community/comments?id=<id>`

Delete a comment (author or admin only).

| | |
|---|---|
| **Auth** | Student (owner) or Admin |
| **Response** | `{ success: true }` |

---

## Hackathons

### `GET /api/hackathons`

List all published hackathons (cached).

| | |
|---|---|
| **Auth** | None |
| **Response** | `[Hackathon, ...]` |

### `GET /api/hackathons/[id]`

Get a single hackathon by ID.

| | |
|---|---|
| **Auth** | None |
| **Response** | `Hackathon` |

### `POST /api/hackathons/[id]/waitlist`

Join a hackathon waitlist (idempotent).

| | |
|---|---|
| **Auth** | Student |
| **Response** | `{ success: true, message: "Added to waitlist" | "Already on waitlist" }` |

---

## Squads

### `GET /api/squads`

List all active squads with enrollment status.

| | |
|---|---|
| **Auth** | Optional (adds `isJoined` field) |
| **Response** | `[{ ...squad, isJoined: boolean }]` |

### `GET /api/squads/[id]`

Get squad details.

| | |
|---|---|
| **Auth** | None |
| **Response** | `Squad` |

### `POST /api/squads/enroll`

Create a Razorpay order for squad enrollment.

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ amount: number }` |
| **Response** | Razorpay order object |

### `POST /api/squads/verify`

Verify squad enrollment payment.

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, squadId, amount }` |
| **Response** | `{ success: true, enrollmentId }` |

### `POST /api/squads/[id]/join`

Join a squad (after payment).

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ razorpayOrderId, razorpayPaymentId }` |
| **Response** | `{ success, message, squad }` |

### `GET /api/squads/[id]/members`

List squad members.

| | |
|---|---|
| **Auth** | Admin or Mentor |
| **Response** | `[{ studentName, studentEmail, enrolledAt }]` |

---

## Mentorship

### `GET /api/mentors`

List active mentors.

| | |
|---|---|
| **Auth** | None |
| **Response** | `[Mentor, ...]` |

### `GET /api/mentors/[id]`

Get mentor details.

| | |
|---|---|
| **Auth** | None |
| **Response** | `Mentor` |

### `GET /api/mentors/[id]/availability`

Get available slots for a mentor.

| | |
|---|---|
| **Auth** | None |
| **Response** | `[{ date, startTime, endTime, isBooked }]` |

### `POST /api/mentorship/book`

Book a mentorship session (with MongoDB transaction for double-booking prevention).

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ mentorId, sessionType, price, razorpayOrderId?, razorpayPaymentId?, date, dateString, startTime }` |
| **Response** | `{ success: true, booking: { id, meetingLink, date, time } }` |

### `GET /api/mentorship/my-sessions`

Get current user's upcoming sessions.

| | |
|---|---|
| **Auth** | Student |
| **Response** | `[{ id, mentorName, mentorTitle, date, time, meetingLink, sessionType }]` |

### `DELETE /api/mentorship/cancel?id=<id>`

Cancel a booking (owner only).

| | |
|---|---|
| **Auth** | Student (owner) |
| **Response** | `{ success, message, booking }` |

---

## Payments

### `POST /api/payments/order`

Create a Razorpay payment order.

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ amount: number, currency?: "INR" }` |
| **Response** | `{ id, amount, currency, ... }` |

### `POST /api/payments/verify`

Verify Razorpay payment (HMAC signature + amount check).

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, currency, expectedAmount? }` |
| **Response** | `{ success: true, message: "Payment Verified & Recorded" }` |

---

## Notifications

### `GET /api/notifications`

Get combined announcements + personal notifications.

| | |
|---|---|
| **Auth** | Student |
| **Response** | `{ notifications: [...], unreadCount }` |

### `POST /api/notifications/register-token`

Register a Firebase push notification device token.

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ token: string, platform?: "web"|"android"|"ios", userAgent?: string }` |
| **Response** | `{ success: true }` |

### `POST /api/notifications/mark-read`

Mark announcements as read.

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ announcementId: string }` or `{ type: "all" }` |
| **Response** | `{ success: true, unreadCount }` |

### `GET /api/announcements`

List published announcements (public).

| | |
|---|---|
| **Auth** | None |
| **Response** | `[Announcement, ...]` |

---

## Projects

### `GET /api/projects`

List projects (filterable).

| | |
|---|---|
| **Auth** | Optional |
| **Query** | `?filter=official|mine|all` |
| **Response** | `[Project, ...]` |

### `POST /api/projects`

Create a student project (notifies admins).

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ title, description, difficulty?, requirements?, tags?, techStack?, githubUrl?, demoUrl? }` |
| **Response** | `{ success: true, project }` |

### `PATCH /api/projects`

Update a project (owner only).

| | |
|---|---|
| **Auth** | Student (owner) |
| **Body** | `{ id, ...updates }` |
| **Response** | `{ success: true }` |

### `DELETE /api/projects?id=<id>`

Delete a project (owner only).

| | |
|---|---|
| **Auth** | Student (owner) |
| **Response** | `{ success: true }` |

---

## Custom Sheet

### `GET /api/custom-sheet/sheets`

List user's custom sheets.

| | |
|---|---|
| **Auth** | Student |
| **Response** | `[{ _id, name, isDefault, createdAt }]` |

### `POST /api/custom-sheet/sheets`

Create a custom sheet.

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ name: string, isDefault?: boolean }` |
| **Response** | `{ success: true, sheet }` |

### `PATCH /api/custom-sheet/sheets`

Rename a sheet.

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ sheetId, name }` |
| **Response** | `{ success: true }` |

### `DELETE /api/custom-sheet/sheets?sheetId=<id>`

Delete a sheet and all its data.

| | |
|---|---|
| **Auth** | Student |
| **Response** | `{ success, sheetId, message, meta: { problemsDeleted, patternsDeleted } }` |

### `GET /api/custom-sheet/patterns?sheetId=<id>`

List patterns in a sheet.

| | |
|---|---|
| **Auth** | Student |
| **Response** | `[{ id, name, slug, total, solved, domain }]` |

### `GET /api/custom-sheet/patterns/[id]/problems`

List problems under a pattern.

| | |
|---|---|
| **Auth** | Student (owner) |
| **Response** | `{ patternName, problems: [...] }` |

### `DELETE /api/custom-sheet/patterns/[id]`

Delete a pattern and its problems.

| | |
|---|---|
| **Auth** | Student (owner) |
| **Response** | `{ success, message, deletedProblems }` |

### `POST /api/custom-sheet/problems/[id]/toggle`

Toggle problem status (TODO ↔ DONE).

| | |
|---|---|
| **Auth** | Student (owner) |
| **Response** | `{ success, status: "TODO"|"DONE", completedAt }` |

### `POST /api/custom-sheet/problems/[id]/update`

Update problem notes, solution, approach, or tags.

| | |
|---|---|
| **Auth** | Student (owner) |
| **Body** | `{ notes?, solution?, approach?, tags? }` |
| **Response** | `{ success, data: problem }` |

### `POST /api/custom-sheet/import`

Import problems from Excel/CSV.

| | |
|---|---|
| **Auth** | Student |
| **Body** | `FormData { file: File, sheetId?, isNewSheet?: "true", mode?: "replace"|"append" }` |
| **Response** | `{ success, sheetId, mode, meta: { patternsCreated, problemsCreated } }` |

### `GET /api/custom-sheet/analytics?sheetId=<id>`

Get analytics for a sheet.

| | |
|---|---|
| **Auth** | Student |
| **Response** | `{ stats, trendData, activityData, topicChartData, totalPatterns }` |

---

## Leaderboard

### `GET /api/leaderboard`

Get the global leaderboard (cached 5 minutes).

| | |
|---|---|
| **Auth** | None |
| **Response** | `{ leaderboard: [{ rank, name, username, image, xp, solved, streak }] }` |

### `GET /api/hall-of-fame`

Top 10 hackathon winners.

| | |
|---|---|
| **Auth** | None |
| **Response** | `[{ id, title, hackathonTitle, builder, description, techStack, githubUrl, demoUrl }]` |

---

## Roasts

### `GET /api/roast`

Get current user's roast requests.

| | |
|---|---|
| **Auth** | Student |
| **Response** | `[{ id, title, builder, resumeUrl, status, comments }]` |

### `POST /api/roasts`

Submit a new roast request.

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ mentorId?, resumeUrl, notes?, type? }` |
| **Response** | `{ success: true, id }` |

---

## Support

### `POST /api/support/tickets`

Create a support ticket.

| | |
|---|---|
| **Auth** | Student |
| **Body** | `{ type: "bug"|"feature"|"question"|"other", title, description, priority: "low"|"medium"|"high"|"urgent", screenshot? }` |
| **Response** | `{ success: true, ticketId }` |

---

## Public

### `GET /api/public/search?q=<query>`

Search public user profiles (min 3 chars, rate-limited).

| | |
|---|---|
| **Auth** | None |
| **Rate Limit** | 20 req / 60s per IP |
| **Response** | `{ results: [{ username, name, image, totalSolved }] }` |

### `GET /api/public/user/[username]`

Get a user's full public profile.

| | |
|---|---|
| **Auth** | None |
| **Rate Limit** | 30 req / 60s per IP |
| **Response** | `{ username, name, image, bio, linkedIn, leetCode, stats, activityData }` |

---

## Analytics

### `POST /api/analytics/track`

Track a page view (non-blocking).

| | |
|---|---|
| **Auth** | None |
| **Body** | `{ path, referrer?, sessionId, userId?, isNewSession? }` |
| **Response** | `{ success: true }` |

---

## Admin Endpoints

All admin endpoints require `role: 'admin'` in the session JWT.

### `POST /api/admin/auth`

Admin login.

| | |
|---|---|
| **Auth** | None |
| **Body** | `{ email, password }` |
| **Response** | `{ success: true, message: "Login successful" }` |

### `DELETE /api/admin/auth`

Admin logout.

| | |
|---|---|
| **Auth** | None |
| **Response** | `{ success: true, message: "Logged out" }` |

### `GET /api/admin/stats`

Dashboard overview stats.

| | |
|---|---|
| **Auth** | Admin |
| **Response** | `{ totalStudents, totalPending, activeHackathons, dailyActivity, userGrowth, contentActivity, revenue, submissionActivity }` |

### `GET /api/admin/users?page=<n>&limit=<n>&q=<search>`

Paginated user list with search.

| | |
|---|---|
| **Auth** | Admin |
| **Response** | `{ users: [...], pagination: { total, page, limit, totalPages } }` |

### `GET /api/admin/users/[id]`

Single user with stats.

| | |
|---|---|
| **Auth** | Admin |
| **Response** | `{ user: {...}, stats: { roastCount, storyCount, easyCount, mediumCount, hardCount } }` |

### `PATCH /api/admin/users/[id]`

Update user fields.

| | |
|---|---|
| **Auth** | Admin |
| **Body** | `{ displayName?, image?, bio?, isBanned?, role?, preferences?, socialLinks? }` |
| **Response** | `{ success: true }` |

### `GET /api/admin/users/[id]/activity`

User's last 50 activity logs.

| | |
|---|---|
| **Auth** | Admin |
| **Response** | `[{ userId, action, details, createdAt }]` |

### Admin Content Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET/POST/PUT/DELETE` | `/api/admin/problems` | Full CRUD for DSA problems |
| `GET/POST/PUT/DELETE` | `/api/admin/patterns` | Full CRUD for patterns |
| `GET/POST` | `/api/admin/patterns/[id]/problems` | Link/unlink problems to patterns |
| `GET/PUT/DELETE` | `/api/admin/topics` | Manage topics |
| `GET/POST/PATCH/DELETE` | `/api/admin/projects` | Manage official projects |
| `GET/POST` | `/api/admin/announcements` | Create announcements (triggers push) |
| `DELETE` | `/api/admin/announcements/[id]` | Delete announcement |
| `GET/POST/PATCH/DELETE` | `/api/admin/community` | Manage community posts |

### Admin Moderation

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/moderation/stories` | List pending stories |
| `PATCH` | `/api/admin/moderation/stories/[id]` | Approve/reject story |
| `GET` | `/api/admin/moderation/roasts` | List pending roasts |
| `PATCH` | `/api/admin/moderation/roasts/[id]` | Approve/reject roast |

### Admin Hackathons

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET/POST` | `/api/admin/hackathons` | List/create hackathons |
| `GET/PATCH/DELETE` | `/api/admin/hackathons/[id]` | Manage single hackathon |
| `GET` | `/api/admin/hackathons/submissions` | All submissions |

### Admin Mentorship

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET/POST` | `/api/admin/mentors` | List/create mentors |
| `GET/PATCH/DELETE` | `/api/admin/mentors/[id]` | Manage mentor |
| `GET/PUT` | `/api/admin/mentors/[id]/availability` | Manage availability |
| `GET` | `/api/admin/bookings` | All bookings with filters |
| `GET/POST/DELETE` | `/api/admin/mentorship/availability` | Manage slots |

### Admin Squads

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET/POST` | `/api/admin/squads` | List/create squads |
| `PATCH/DELETE` | `/api/admin/squads/[id]` | Update/delete squad |

### Admin Analytics & Export

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/analytics/engagement` | Problem-solving analytics |
| `GET` | `/api/admin/analytics/web` | Web traffic analytics |
| `GET` | `/api/admin/earnings` | Financial overview |
| `POST` | `/api/admin/export` | Export data (CSV/Excel/PDF) |
| `GET/POST` | `/api/admin/notes` | Admin personal notes |

---

## Error Responses

All endpoints return errors in a consistent format:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes:

| Code | Meaning |
|------|---------|
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (wrong role) |
| 404 | Resource Not Found |
| 429 | Rate Limit Exceeded |
| 500 | Internal Server Error |

---

## Rate Limits

| Tier | Limit | Scope |
|------|-------|-------|
| Auth | 10 requests / 10 seconds | `/api/auth/*`, token registration |
| Payments | 20 requests / 60 seconds | `/api/payments/*` |
| General | 200 requests / 60 seconds | All other endpoints |
| Search | 20 requests / 60 seconds | `/api/public/search` |
| Profile | 30 requests / 60 seconds | `/api/public/user/[username]` |

Rate limits are IP-based and reset per window. Rate limiting is in-memory and works per-serverless-instance on Vercel.

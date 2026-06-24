# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, email: **iamaveshpathak@gmail.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

You should receive a response within 48 hours.

---

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | Yes       |
| < Latest | No       |

Always run the latest version for security patches.

---

## Security Measures

### Authentication

- **JWT tokens** stored in httpOnly, secure, sameSite=lax cookies (not accessible via JavaScript)
- **HS256 signing** with a server-side secret (minimum 32 characters)
- **Token expiry** of 7 days with automatic refresh on session check
- **Google/GitHub OAuth** for passwordless authentication

### Authorization

- **Role-Based Access Control (RBAC):** Student, Mentor, Admin
- **Middleware isolation** between routes (`proxy.ts` enforces admin checks)
- **Guard functions** (`requireAuth`, `requireAdmin`, `requireOwnership`) block unauthorized access at the API level
- **Demo admin mode** — read-only access for demo accounts (writes blocked)

### Input Validation

- **Zod schemas** validate all API request bodies and query parameters
- **Type checking** enforced via TypeScript
- **ObjectId validation** on all MongoDB queries using resource IDs

### Password Security

- Admin passwords hashed with **bcrypt** (cost factor 10)
- Demo admin passwords stored in environment variables (not in code)

### Payment Security

- **HMAC-SHA256 signature verification** on Razorpay payments
- **Amount verification** — server checks payment amount matches expected amount
- **Idempotent processing** — duplicate payments are rejected
- **MongoDB transactions** — atomic operations prevent double-booking race conditions

### Rate Limiting

| Tier | Limit | Scope |
|------|-------|-------|
| Auth | 10 requests / 10 seconds | Login, token registration |
| Payments | 20 requests / 60 seconds | Payment endpoints |
| General | 200 requests / 60 seconds | All other API routes |

Rate limiting is IP-based using a sliding window log.

### Security Headers

Set via Next.js middleware:

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Force HTTPS |
| `X-Frame-Options` | `SAMEORIGIN` | Prevent clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer data |
| `Content-Security-Policy` | Restrictive policy | Prevent XSS, code injection |

### Database Security

- **MongoDB Atlas** with IP whitelisting
- **Connection pooling** with max pool size limits
- **Write concern majority** in production
- **Schema validation** via Mongoose schemas

### API Security

- **Error messages** sanitized — no stack traces or internal details leaked to clients
- **Audit logging** — all admin actions tracked in `ActivityLog` model
- **Activity logging** for user actions (problem solves, logins)

### File Upload Security

- **Cloudinary** for image hosting (not local storage)
- **File type validation** — only PDF/DOC/DOCX for resumes
- **File size limit** — 5MB max for resume uploads
- **Upload signatures** — server-generated Cloudinary signatures prevent unauthorized uploads

---

## Environment Variables

**Never commit `.env` files.** The `.gitignore` blocks all `.env*` files except `.env.example`.

Required secrets that must be kept confidential:

| Variable | Risk if Exposed |
|----------|----------------|
| `JWT_SECRET` | Token forgery — full account takeover |
| `MONGODB_URI` | Database access — data theft/modification |
| `RAZORPAY_KEY_SECRET` | Payment tampering |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Unauthorized push notifications |
| `CLOUDINARY_API_SECRET` | Unauthorized image management |
| `ADMIN_PASSWORD` | Admin account compromise |
| `GITHUB_CLIENT_SECRET` | OAuth token theft |
| `GOOGLE_CLIENT_SECRET` | OAuth token theft |

### If a Secret is Exposed

1. **Rotate immediately** — generate new credentials from the service provider
2. **Update `.env`** with new values
3. **Redeploy** the application
4. **Check logs** for unauthorized access
5. **Notify affected users** if data was compromised

---

## Best Practices for Contributors

1. **Never hardcode secrets** — always use environment variables
2. **Never commit `.env` files** — the `.gitignore` blocks them, but double-check
3. **Use `.env.example`** with placeholder values for documentation
4. **Validate all inputs** — use Zod schemas for API request validation
5. **Use guard functions** — protect API routes with `requireAuth()` / `requireAdmin()`
6. **Sanitize error messages** — use `handleApiError()` to return safe errors
7. **Verify payments server-side** — never trust client-side payment confirmation
8. **Use parameterized queries** — Mongoose handles this, but be careful with raw MongoDB queries

---

## Checklist Before Deploying

- [ ] All secrets in environment variables (not in code)
- [ ] `.env` is in `.gitignore`
- [ ] `JWT_SECRET` is at least 32 characters
- [ ] MongoDB IP whitelist is configured
- [ ] Razorpay is in live mode with correct keys
- [ ] Firebase project has Cloud Messaging enabled
- [ ] HTTPS is enforced (HSTS header)
- [ ] Admin passwords are strong (not defaults)
- [ ] Demo admin mode is disabled in production (if not needed)

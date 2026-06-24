# Deployment Guide

Step-by-step deployment instructions for Babua DSA LMS.

---

## Vercel (Recommended)

### Prerequisites

- GitHub account with the repo pushed
- [Vercel account](https://vercel.com) (free tier works)
- MongoDB Atlas cluster
- Firebase project (for push notifications)
- Razorpay account (for payments)
- Cloudinary account (for image uploads)

### Step 1: Connect Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository: `avesh-pathak/opensource-lms`
3. Vercel auto-detects Next.js — click **Deploy** (it will fail first time, that's fine)

### Step 2: Configure Environment Variables

Go to **Project Settings → Environment Variables** and add every variable from `.env.example`:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=<generate-a-strong-random-string>
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-strong-password
DEMO_ADMIN_EMAIL=demo@email.com
DEMO_ADMIN_PASSWORD=your-demo-password
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_VAPID_KEY=...
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY=...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

> **Tip:** Generate a strong JWT secret:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### Step 3: Deploy

Click **Deploy**. Vercel will:
1. Run `npm install`
2. Run `prebuild` → generates `firebase-messaging-sw.js` from env vars
3. Run `next build`
4. Deploy to edge network

### Step 4: Custom Domain (Optional)

1. Go to **Project Settings → Domains**
2. Add your custom domain
3. Update DNS records as instructed by Vercel

### Step 5: Post-Deploy Checklist

- [ ] Visit `/auth/admin-login` and test admin login
- [ ] Visit `/dashboard` as a student (via Google OAuth)
- [ ] Test a payment flow (use Razorpay test mode)
- [ ] Verify push notification registration
- [ ] Check admin export (CSV/Excel/PDF)

---

## Self-Hosted (Docker / VPS)

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- PM2 or systemd for process management
- Nginx or Caddy for reverse proxy

### Step 1: Clone and Install

```bash
git clone https://github.com/avesh-pathak/opensource-lms.git
cd opensource-lms
npm install
```

### Step 2: Set Up Environment

```bash
cp .env.example .env
# Edit .env with your values
nano .env
```

### Step 3: Generate Firebase Service Worker

```bash
npm run generate-sw
```

### Step 4: Build

```bash
npm run build
```

### Step 5: Start Production Server

```bash
npm run start
```

The server runs on `http://localhost:3000` by default.

### Process Manager (PM2)

```bash
# Install PM2 globally
npm install -g pm2

# Start the app
pm2 start npm --name "lms" -- run start

# Save process list and auto-restart on boot
pm2 save
pm2 startup

# Monitor
pm2 status
pm2 logs lms
```

### Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

For HTTPS, use Certbot:
```bash
sudo certbot --nginx -d yourdomain.com
```

---

## Docker

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run generate-sw
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

### Build and Run

```bash
docker build -t lms .
docker run -p 3000:3000 --env-file .env lms
```

---

## MongoDB Setup

### Atlas (Cloud)

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user (Database Access → Add New Database User)
3. Whitelist your IP (Network Access → Add IP Address → `0.0.0.0/0` for all)
4. Get the connection string: **Database → Connect → Connect your application**
5. Copy the URI and replace `<password>` with your user's password

### Local Development

```bash
# Install MongoDB Community Edition
# https://www.mongodb.com/docs/manual/installation/

# Start the service
mongod --dbpath /data/db

# Connection string for .env
MONGODB_URI=mongodb://localhost:27017/babua-dsa
```

---

## Firebase Setup (Push Notifications)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a project or select existing
3. **Web app:** Project Settings → General → Add web app
4. Copy the config values for `NEXT_PUBLIC_FIREBASE_*` env vars
5. **Service account:** Project Settings → Service Accounts → Generate new private key
6. Copy `project_id`, `client_email`, `private_key` for `FIREBASE_ADMIN_*` env vars
7. **Cloud Messaging:** Project Settings → Cloud Messaging → Enable
8. **VAPID key:** Project Settings → Cloud Messaging → Web push certificates → Generate key pair

---

## Razorpay Setup (Payments)

1. Create an account at [razorpay.com](https://razorpay.com)
2. Get test mode API keys from **Settings → API Keys**
3. For production: complete KYC verification and get live keys
4. Set webhook URL (optional): **Settings → Webhooks**

---

## Cloudinary Setup (Image Uploads)

1. Create an account at [cloudinary.com](https://cloudinary.com)
2. Go to **Dashboard** and copy:
   - Cloud Name
   - API Key
   - API Secret
3. Create an upload preset: **Settings → Upload → Add upload preset**
   - Set it to **Unsigned** (for client-side uploads)

---

## OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials (APIs & Services → Credentials → Create Credentials → OAuth client ID)
3. Add authorized redirect URI: `https://yourdomain.com/api/auth/google`
4. Copy Client ID and Client Secret

### GitHub OAuth

1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. New OAuth App
3. Authorization callback URL: `https://yourdomain.com/api/auth/callback/github`
4. Copy Client ID and Client Secret

---

## Troubleshooting

### Build fails with missing env vars

```bash
# Generate Firebase service worker first
npm run generate-sw

# Then build
npm run build
```

### JWT errors in production

Ensure `JWT_SECRET` is set and is at least 32 characters long.

### MongoDB connection refused

- Check `MONGODB_URI` is correct
- Ensure IP whitelist includes your server's IP (Atlas)
- Check if MongoDB service is running (local)

### Push notifications not working

- Ensure service worker is generated (`npm run generate-sw`)
- Check Firebase config values match your project
- Verify VAPID key is set
- Test with browser DevTools → Application → Service Workers

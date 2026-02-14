# Taakra – Deployment Guide

This document covers deploying the **Next.js frontend** and **Express backend** for production.

## Architecture

- **Frontend**: Next.js (React) – deploy to **Vercel** (recommended) or any Node host.
- **Backend**: Express + Socket.io – deploy to **Render**, Railway, or any Node host.
- **Database**: MongoDB Atlas (use your existing `MONGODB_URI`).
- **Auth**: Firebase (configure authorized domains in Firebase Console for your production URL).

---

## 1. Frontend (Vercel)

### Setup

1. Push your repo to GitHub and import the project in [Vercel](https://vercel.com).
2. Set **Root Directory** to the repo root (where `package.json` and `next.config.mjs` live).
3. Configure **Environment Variables** in Vercel:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Full backend URL, e.g. `https://your-api.onrender.com` (no trailing slash) |
| `NEXT_PUBLIC_FIREBASE_*` | All Firebase config keys (same as `.env.local`) |

4. Add your production domain to **Firebase Console** → Authentication → Settings → Authorized domains.

5. Deploy. Vercel will run `npm run build` and serve the app.

### Optional: `vercel.json`

You can add a `vercel.json` at the repo root to force HTTPS or set headers; the default Next.js config is usually enough.

---

## 2. Backend (Render)

### Option A: Web Service (recommended)

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repo and set:
   - **Root Directory**: `backend` (or leave blank if backend is at repo root).
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start` (runs `node dist/server.js`)
   - **Runtime**: Node (e.g. 20).

3. Add **Environment Variables** in Render:

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `production` |
| `PORT` | Set by Render (usually 10000); do not override unless needed |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_PRIVATE_KEY` | Service account private key (full multi-line string) |
| `FIREBASE_CLIENT_EMAIL` | Service account client email |
| `GEMINI_API_KEY` | For AI Assistant |
| `GEMINI_MODEL` | Optional, e.g. `gemini-2.0-flash` |

4. After deploy, note the service URL (e.g. `https://taakra-api.onrender.com`) and use it as `NEXT_PUBLIC_API_URL` in the frontend.

### Option B: Render Blueprint (`render.yaml`)

You can define the backend service in `render.yaml` at the repo root for infrastructure-as-code. Example:

```yaml
services:
  - type: web
    name: taakra-backend
    runtime: node
    rootDir: backend
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: FIREBASE_PROJECT_ID
        sync: false
      - key: FIREBASE_PRIVATE_KEY
        sync: false
      - key: FIREBASE_CLIENT_EMAIL
        sync: false
      - key: GEMINI_API_KEY
        sync: false
```

Then add the secret values in the Render dashboard.

---

## 3. CORS

The backend uses `cors()` with no origin restriction by default, so your production frontend origin (e.g. `https://your-app.vercel.app`) will work. For stricter security, set `CORS_ORIGIN` in the backend and configure `cors({ origin: process.env.CORS_ORIGIN })`.

---

## 4. Security Checklist (already in app)

- **Helmet**: Enabled on the backend for secure HTTP headers.
- **Rate limiting**: 100 requests per 15 minutes per IP on `/api`.
- **Firebase Auth**: Tokens validated on the backend; keep `FIREBASE_PRIVATE_KEY` and `GEMINI_API_KEY` only in server env.

---

## 5. Post-deploy

1. **Health check**: `GET https://your-api.onrender.com/api/health` should return 200.
2. **Frontend**: Open your Vercel URL, sign in, and test Browse, Discover, Register, and AI Assistant.
3. **Webhooks / cron**: If you add scheduled jobs later, use Render cron or an external service that calls your API.

# Quran Web App

Production-ready Quran reader monorepo with a Next.js frontend and a Hono backend.

## Overview

The frontend lives in [frontend/](frontend) and is deployed independently on Vercel. The backend lives in [backend/](backend) and is ready for Render or any Node host that provides `PORT` and `CORS_ORIGIN`.

## Features

- Read all 114 surahs with Arabic text and English translation
- Search across Quran text with debounced lookup
- Play ayah audio from the Islamic Network CDN
- Persist reader settings in `localStorage`
- Responsive layout for mobile, tablet, and desktop
- Standardized API responses for health and sample-data checks
- Backend health endpoint and sample-data endpoint for deploy monitoring

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Backend: Hono, Node server runtime, TypeScript
- Data: Quran JSON dataset
- Deployment: Vercel for frontend, Render for backend

## Project Structure

```text
.
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── types/
│   └── .env.example
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── config/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── lib/
│   │   └── types/
│   └── .env.example
└── README.md
```

## Setup

### Frontend

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` to your backend URL. For local development, use `http://localhost:3001`.

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Set `PORT` and `CORS_ORIGIN` for your deployment target. `CORS_ORIGIN` should include your Vercel frontend URL or URLs.

## Environment Variables

Frontend:

- `NEXT_PUBLIC_API_URL`

Backend:

- `PORT`
- `NODE_ENV`
- `CORS_ORIGIN`

## Deployment Guide

### Deploy Frontend to Vercel

#### Step 1: Connect Repository

1. Go to [vercel.com](https://vercel.com) and sign in or create an account
2. Click **"Add New..."** → **"Project"**
3. Select your GitHub/GitLab/Bitbucket repository
4. Click **"Import"**

#### Step 2: Configure Project Settings

1. **Project Name**: Enter a project name (e.g., `quran-reader-frontend`)
2. **Root Directory**: Set to `frontend` (Vercel should auto-detect)
   - If not auto-detected, click **"Edit"** next to root directory and set to `frontend`
3. **Framework**: Should auto-detect as "Next.js" ✓
4. Click **"Continue"**

#### Step 3: Environment Variables

1. In the **Environment Variables** section, add:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend.onrender.com` (use your actual Render backend URL)
   - **Environments**: Select all (Production, Preview, Development)
2. Click **"Add"**
3. Click **"Deploy"**

#### Step 4: Deployment Complete

- Vercel will automatically build and deploy your frontend
- You'll receive a deployment URL like `https://quran-reader-frontend-abc123.vercel.app`
- Set this URL as your frontend production URL

#### Auto-Deploy on Git Push

- Any push to the default branch automatically triggers a new deployment
- Preview deployments are created for pull requests

---

### Deploy Backend to Render

#### Step 1: Connect Repository

1. Go to [render.com](https://render.com) and sign in or create an account
2. Click **"New +"** → **"Web Service"**
3. Select **"Connect a repository"** or paste your GitHub URL
4. Authorize Render to access your repository
5. Select your repository from the list

#### Step 2: Configure Build & Deploy Settings

1. **Name**: Enter a name (e.g., `quran-reader-backend`)
2. **Environment**: Select "Node"
3. **Region**: Choose your preferred region (e.g., US or EU)
4. **Branch**: Verify it's set to your default branch (e.g., `main`)
5. **Root Directory**: Set to `backend`
   - In the settings, find "Root Directory" field and enter `backend`
6. **Build Command**: Enter `npm run build`
7. **Start Command**: Enter `npm start`

#### Step 3: Environment Variables

Before deploying, scroll down to **Environment** section and add:

1. **PORT**: (Render assigns this automatically, but ensure your app reads `process.env.PORT`)
2. **NODE_ENV**: `production`
3. **CORS_ORIGIN**: `https://your-frontend.vercel.app` (use your actual Vercel frontend URL)
   - If you have multiple frontend URLs or preview deployments, use comma-separated values:
   - Example: `https://your-frontend.vercel.app,https://your-frontend-preview-abc.vercel.app`

#### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will start building your backend
3. Monitor the build logs (should take 1-2 minutes)
4. Once deployed, you'll receive a URL like `https://quran-reader-backend-abc123.onrender.com`

#### Step 5: Update Frontend Environment Variable

Now that your backend is deployed, return to Vercel:

1. Go to your Vercel project settings
2. Navigate to **Settings** → **Environment Variables**
3. Edit the `NEXT_PUBLIC_API_URL` variable
4. Update the value to your Render backend URL: `https://quran-reader-backend-abc123.onrender.com`
5. Save and trigger a redeployment:
   - Either push a new commit to trigger auto-deploy
   - Or click **"Redeploy"** in the Deployments tab

---

### Verify Deployment

#### Check Backend Health

```bash
curl https://your-backend.onrender.com/api/health
```

Expected response:

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "message": "Server is running"
}
```

#### Check CORS

If the frontend can't reach the backend, verify CORS:

```bash
curl -H "Origin: https://your-frontend.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  https://your-backend.onrender.com/api/health
```

You should see `Access-Control-Allow-Origin` header in the response.

#### Test API Endpoints

- **Health**: `GET https://your-backend.onrender.com/api/health`
- **Sample Data**: `GET https://your-backend.onrender.com/api/data`
- **Search**: `GET https://your-backend.onrender.com/api/search?q=allah`

---

### Production API Routes

Once deployed, the backend exposes:

- `/api/health` — Health check endpoint
- `/api/data` — Sample data endpoint
- `/api/search` — Quran search endpoint

---

### Troubleshooting

#### "NEXT_PUBLIC_API_URL is not configured"

- **Cause**: Environment variable not set in Vercel
- **Fix**: Add `NEXT_PUBLIC_API_URL` in Vercel project settings and redeploy

#### "Failed to fetch" in browser console

- **Cause**: CORS not configured or backend URL incorrect
- **Fix**:
  1. Verify `CORS_ORIGIN` in Render backend includes your Vercel frontend URL
  2. Verify `NEXT_PUBLIC_API_URL` in Vercel frontend points to correct Render backend URL
  3. Test with `curl` to confirm backend is responding

#### Backend cold start delays

- **Cause**: Render spins down free tier services after inactivity
- **Fix**: Use Render's paid tier for always-on deployments, or add a health check to wake the service

#### Build fails on Vercel

- **Cause**: Missing dependencies or TypeScript errors
- **Fix**:
  1. Check Vercel build logs for error details
  2. Run `npm run build` locally in `frontend/` directory to replicate
  3. Fix errors and push to trigger rebuild

#### Render build fails

- **Cause**: Root directory not set correctly, or missing dependencies
- **Fix**:
  1. Verify root directory is set to `backend` in Render settings
  2. Run `npm run build` locally in `backend/` directory
  3. Check Render build logs and push fixes

---

## Live Demo

Once deployed, your application will be available at:

- **Frontend**: `https://your-frontend.vercel.app` (replace with your actual Vercel URL)
- **Backend**: `https://your-backend.onrender.com` (replace with your actual Render URL)

## Commit Strategy

Use small, meaningful commits such as:

- `feat: add typed api service and env config`
- `refactor: split backend controllers and middleware`
- `fix: remove localhost fallback from frontend api layer`
- `chore: update deployment docs and env examples`

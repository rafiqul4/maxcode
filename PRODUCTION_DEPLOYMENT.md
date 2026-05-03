# Production Deployment Guide

## Overview

This guide helps you deploy the Quran Web App to **Vercel (Frontend)** and a backend service. The repository is a monorepo with separate frontend and backend folders.

**Current Status:**
- ✅ GitHub: https://github.com/rafiqul4/maxcode (PUBLIC)
- 📦 Frontend: Ready for Vercel
- 🚀 Backend: Ready for Render/Railway

---

## Frontend Deployment to Vercel

### Method 1: Via Vercel Dashboard (Recommended for First-Time Users)

1. **Go to Vercel:**
   - Visit https://vercel.com/dashboard
   - Sign in or create an account (use GitHub for easier setup)

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Search for and select `rafiqul4/maxcode`

3. **Configure Project:**
   - **Project Name:** `quran-web-app` (or your choice)
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** Set to `frontend`
   - Leave Build settings as default

4. **Environment Variables:**
   - Click "Environment Variables" or wait until after first deploy
   - Add new variable:
     - **Key:** `NEXT_PUBLIC_API_BASE_URL`
     - **Value:** `http://localhost:3001` (for now - update after backend deployment)
   - Click "Save"

5. **Deploy:**
   - Click "Deploy" button
   - Wait for build to complete (typically 2-3 minutes)
   - You'll get a unique URL: `https://quran-web-app-xxxx.vercel.app`

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Follow prompts and select "frontend" as root directory
```

---

## Backend Deployment to Render (Free Tier)

### Step 1: Prepare Backend

Ensure `backend/package.json` has proper start script:

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "build": "tsc"
  }
}
```

### Step 2: Deploy to Render

1. **Go to Render:**
   - Visit https://render.com
   - Sign in or create account with GitHub

2. **Create Web Service:**
   - Click "New+" button → "Web Service"
   - Select "Deploy existing repository"
   - Connect/select `rafiqul4/maxcode`

3. **Configure Service:**
   - **Service Name:** `quran-backend`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Region:** Choose closest to you
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

4. **Environment Variables:**
   - **Key:** `PORT`
   - **Value:** `3001` (Render assigns its own port, but this helps locally)
   - Add any other needed env vars

5. **Deploy:**
   - Click "Create Web Service"
   - Render builds and deploys (takes 2-3 minutes)
   - Copy the service URL (e.g., `https://quran-backend.onrender.com`)

### Step 3: Connect Frontend to Backend

1. **Update Vercel Environment Variables:**
   - Go back to Vercel project settings
   - Find Environment Variables section
   - Update `NEXT_PUBLIC_API_BASE_URL` to your Render URL: `https://quran-backend.onrender.com`
   - Click "Save"

2. **Trigger Redeploy:**
   - Go to Deployments tab
   - Click three dots on latest deployment → "Redeploy"
   - Vercel rebuilds with new API URL

---

## Verification Checklist

- [ ] GitHub repo is public
- [ ] Frontend deployed to Vercel URL works
- [ ] Can read surahs and see Arabic text
- [ ] Search feature works (connects to backend API)
- [ ] Audio playback works
- [ ] Settings (fonts, sizes) persist
- [ ] Responsive on mobile (test in incognito)
- [ ] No TypeScript errors in build

---

## Testing Live

### Test in Incognito Mode:

1. Open incognito window (Ctrl+Shift+N or Cmd+Shift+N)
2. Visit your Vercel URL: `https://quran-web-app-xxxx.vercel.app`
3. Try:
   - Clicking on different surahs
   - Searching for an ayah (e.g., "almighty")
   - Playing audio
   - Changing font settings
   - Refreshing page and checking settings persist

---

## Environment Variables Summary

### Frontend (Vercel)
- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL (e.g., `https://quran-backend.onrender.com`)

### Backend (Render)
- `PORT`: 3001 (optional, Render assigns automatically)
- `NODE_ENV`: production (Render sets by default)

---

## Troubleshooting

### Frontend Build Fails
- Check: Does `frontend/package.json` exist?
- Check: Is root directory set to `frontend`?
- View logs in Vercel dashboard for details

### Search/API Not Working
- Verify backend URL in Vercel environment variables
- Check: Is backend deployed and running on Render?
- Test API directly: `https://quran-backend.onrender.com/search?q=test`

### Static Pages Not Pre-generated
- Next.js 16 uses SSG with `generateStaticParams`
- All 114 surahs should pre-generate during build
- Check Vercel build logs for generation status

---

## Performance Tips

- Frontend is fully static (pre-rendered HTML) - very fast
- Backend search endpoint is in-memory (no database) - instant results
- Audio streams from Islamic Network CDN - reliable
- Vercel edge caching makes pages ultra-fast

---

## Next Steps

1. Complete the deployment steps above
2. Test thoroughly in incognito mode
3. Share your live URLs:
   - Frontend: `https://quran-web-app-xxxx.vercel.app`
   - GitHub: `https://github.com/rafiqul4/maxcode`

---

## Live Demo Example

- **Frontend:** https://quran-web-app-demo.vercel.app
- **GitHub:** https://github.com/rafiqul4/maxcode
- **Backend:** https://quran-backend-demo.onrender.com

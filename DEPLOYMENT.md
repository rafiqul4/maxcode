# Deployment Guide

## Submission Checklist

- [ ] GitHub repo public and accessible
- [ ] Code pushed to `main` branch
- [ ] Vercel deployment live for frontend
- [ ] Backend deployed (Render/Railway/Fly.io)
- [ ] Environment variables set correctly
- [ ] Search API working end-to-end
- [ ] Tested in incognito window
- [ ] Screenshot recording of features (max 5 min)

## Step 1: Verify Code Quality

```bash
# Frontend TypeScript check
cd frontend
npm run build

# Backend TypeScript check
cd backend
npm run build
```

## Step 2: GitHub Setup

1. Ensure repo is public: `https://github.com/rafiqul4/maxcode`
2. Verify commit history: `git log --oneline`
3. Push latest: `git push origin main`

## Step 3: Deploy Frontend (Vercel)

### Option A: Vercel CLI
```bash
npm install -g vercel
cd frontend
vercel
```

### Option B: Vercel Dashboard
1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repo
4. **Root Directory:** `frontend`
5. **Environment Variables:**
   - Key: `NEXT_PUBLIC_API_BASE_URL`
   - Value: `https://your-backend-url.com` (get from step 4)
6. Click "Deploy"

## Step 4: Deploy Backend

### Option A: Render (Recommended - Free tier)

1. Go to [https://render.com](https://render.com)
2. Click "New+" → "Web Service"
3. Connect GitHub account
4. Select `rafiqul4/maxcode` repo
5. Configure:
   - **Name:** `quran-backend`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm run start`
   - **Environment:** Add any needed env vars
6. Click "Create Web Service"
7. Copy the deployed URL (e.g., `https://quran-backend.onrender.com`)

### Option B: Railway

1. Go to [https://railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select `rafiqul4/maxcode`
4. Set **Root Directory:** `backend`
5. Railway auto-detects Node and deploys
6. Copy the generated URL

### Option C: Fly.io

```bash
npm install -g flyctl
cd backend
fly launch
fly deploy
```

## Step 5: Link Frontend to Backend

1. Get backend URL from deployment (e.g., `https://quran-backend.onrender.com`)
2. Go to Vercel dashboard → Project → Settings → Environment Variables
3. Update `NEXT_PUBLIC_API_BASE_URL` to your backend URL
4. Redeploy frontend
5. Test: Open frontend → search for an ayah → verify results appear

## Step 6: Test in Incognito

1. Open Vercel frontend URL in incognito window
2. Verify:
   - [ ] Page loads
   - [ ] Surah list visible
   - [ ] Search works
   - [ ] Audio plays
   - [ ] Font settings save after refresh
   - [ ] Responsive on mobile (F12 → device mode)

## Step 7: Share Links

Provide these 3 links in your submission:

1. **GitHub Repo:** `https://github.com/rafiqul4/maxcode`
2. **Live Demo (Frontend):** `https://your-vercel-url.vercel.app`
3. **Backend API:** `https://your-backend-url.com/search?q=test`

## Troubleshooting

### Backend returns 500 error
- Check backend logs: `render.com/dashboard` or `railway.app/dashboard`
- Verify Quran data file exists in `backend/data/quran_en.json`

### Search returns empty
- Test backend directly: `https://your-backend/search?q=light`
- Check CORS: Backend should allow requests from Vercel frontend

### Frontend shows "API connection error"
- Open browser DevTools (F12)
- Check Network tab → `/search` requests
- Verify `NEXT_PUBLIC_API_BASE_URL` is correct in Vercel settings

### Fonts not loading
- Check browser Network tab for font files
- Verify `globals.css` CSS variables are applied

## Performance Notes

- Frontend: SSG = 114 pages pre-built, instant load
- Backend: Node.js + Hono = lightweight, fast search
- Database: In-memory JSON = < 1ms search (not SQLite)

## Commit History

Good commit messages for evaluation:
```
✅ feat: add Quran reader UI with surah sidebar
✅ feat: implement search API with Hono backend
✅ feat: add font settings with localStorage persistence
✅ feat: add responsive mobile drawer
✅ refactor: split into frontend/backend monorepo
```

Check yours: `git log --oneline`

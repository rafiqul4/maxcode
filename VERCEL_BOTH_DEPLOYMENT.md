# Deploying Both Frontend & Backend to Vercel

This guide walks through deploying the entire Quran Web App stack to Vercel - both the Next.js frontend and Hono backend as separate Vercel projects.

## Why Two Vercel Projects?

Vercel supports both frontend and backend deployment, but they need to be separate projects that communicate via HTTP. This gives you:

- ✅ Both frontend and backend on Vercel's global network
- ✅ Automatic deployments on git push
- ✅ Independent scaling for frontend and backend
- ✅ Same provider dashboard for managing both
- ✅ Environment variable management for both

## Architecture

```
Your GitHub Repo (rafiqul4/maxcode)
├── frontend/          → Vercel Project #1 (Next.js)
└── backend/           → Vercel Project #2 (Node.js)
                          ↓
Both communicate via HTTP (API_BASE_URL env var)
```

---

## Deployment Steps

### Part 1: Deploy Backend to Vercel (5 minutes)

#### 1a. Create Backend Vercel Project

1. Go to **https://vercel.com/dashboard**
2. Click **"Add New..." → "Project"**
3. Click **"Import Git Repository"**
4. Search and select **`rafiqul4/maxcode`**

#### 1b. Configure Backend Project

In the project import screen:

- **Project Name:** `quran-backend`
- **Framework Preset:** Node.js (or leave as "Other")
- **Root Directory:** Click "Edit" and set to **`backend`** ⭐ (CRITICAL)
- **Build Command:** Leave as default or set to `npm run build`
- **Output Directory:** Leave empty (Node.js doesn't use this)
- **Install Command:** Leave as default (`npm install`)

#### 1c. Environment Variables (Backend)

No environment variables needed for basic deployment. Vercel auto-sets:
- `NODE_ENV=production`
- `PORT=<auto-assigned>`

(Optional: Keep as is for now)

#### 1d. Deploy

- Click **"Deploy"** button
- Wait 2-3 minutes for build to complete
- ✅ You'll get backend URL: `https://quran-backend.vercel.app` (or similar)

**Save this URL!** You'll use it in the frontend.

---

### Part 2: Deploy Frontend to Vercel (5 minutes)

#### 2a. Create Frontend Vercel Project

1. Go back to **https://vercel.com/dashboard**
2. Click **"Add New..." → "Project"**
3. Click **"Import Git Repository"**
4. Search and select **`rafiqul4/maxcode`** (same repo, different root)

#### 2b. Configure Frontend Project

In the project import screen:

- **Project Name:** `quran-app` (or similar - must differ from backend name)
- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** Click "Edit" and set to **`frontend`** ⭐ (CRITICAL)
- **Build Settings:** Leave as default

#### 2c. Environment Variables (Frontend)

This is the critical step to connect frontend to backend:

- **Environment Variable Name:** `NEXT_PUBLIC_API_BASE_URL`
- **Value:** `https://quran-backend.vercel.app` (your backend URL from Part 1)
- **Environment:** Select "Production"

#### 2d. Deploy

- Click **"Deploy"** button
- Wait 3-5 minutes for build (Next.js pre-renders 118 pages)
- ✅ You'll get frontend URL: `https://quran-app.vercel.app` (or similar)

**This is your live demo link!**

---

## Verification

### Test Backend Health Check

Open in browser:
```
https://quran-backend.vercel.app/health
```

Should return:
```json
{
  "status": "ok",
  "uptime": 123.456,
  "timestamp": "2025-05-03T12:34:56.789Z",
  "environment": "production"
}
```

### Test Backend Search

```
https://quran-backend.vercel.app/search?q=almighty
```

Should return search results.

### Test Frontend + Backend Integration

1. Open frontend: `https://quran-app.vercel.app`
2. Try search feature - should get results from backend
3. Click play audio - should work
4. Change fonts in settings - should persist
5. Refresh page - settings still there

---

## Your Live URLs (After Deployment)

| Service | URL |
|---------|-----|
| **Frontend (Web App)** | `https://quran-app.vercel.app` |
| **Backend (API)** | `https://quran-backend.vercel.app` |
| **GitHub** | `https://github.com/rafiqul4/maxcode` |

---

## How It Works

### When you push to GitHub `main` branch:

1. **Vercel watches** the `main` branch
2. **Both projects** automatically rebuild
3. **Backend** rebuilds and deploys to its URL
4. **Frontend** rebuilds with the new backend URL (from env var)
5. Both live in ~3-5 minutes

### Frontend → Backend Communication:

```
Browser
  ↓
Frontend (Vercel) - receives API_BASE_URL env var
  ↓
Makes HTTP request to Backend API
  ↓
Backend (Vercel) - returns JSON response
  ↓
Frontend displays results
```

All requests use CORS, which the backend handles via:
```typescript
c.header("Access-Control-Allow-Origin", "*");
```

---

## Project Settings in Vercel

Once deployed, you can manage each project:

### Backend Project Settings

1. Go to **Deployments**
   - See all backend deployments
   - Rollback if needed

2. Go to **Settings → Environment Variables**
   - Add `PORT=3001` if needed (Vercel ignores this, but helpful for documentation)

3. Go to **Settings → Git**
   - Verify GitHub integration
   - Change which branch to deploy (default: `main`)

### Frontend Project Settings

1. Go to **Settings → Environment Variables**
   - Update `NEXT_PUBLIC_API_BASE_URL` if backend URL changes
   - This will trigger automatic redeploy

2. Go to **Domains**
   - Add custom domain (optional)
   - Manage SSL certificates

3. Go to **Analytics**
   - View performance metrics
   - Monitor page load times

---

## Troubleshooting

### "Root Directory Not Found"

**Problem:** Vercel says root directory doesn't exist

**Solution:** 
- Make sure you set `backend` (not `backend/src`)
- Make sure you set `frontend` (not `frontend/src`)
- Verify your git repo structure

### Backend Returns 404

**Problem:** `/search` endpoint returns 404

**Cause:** Backend didn't build correctly

**Solution:**
1. Check Vercel build logs (go to project → Deployments → click deployment → Logs)
2. Verify `backend/package.json` exists
3. Verify `backend/src/index.ts` exists

### Frontend Can't Connect to Backend

**Problem:** Search doesn't work, no API results

**Solution:**
1. Check frontend env var is set correctly:
   - Go to Frontend project → Settings → Environment Variables
   - Verify `NEXT_PUBLIC_API_BASE_URL` = backend URL (exactly)
2. Frontend must redeploy after env var change:
   - Go to Deployments → click latest → "..." → "Redeploy"
3. Test backend directly in browser to verify it's working

### Frontend Takes Too Long to Build

**Note:** First build takes 3-5 minutes (pre-rendering 118 pages)

This is normal. Subsequent deployments are faster (~1-2 minutes).

### "Port already in use" Error

**Note:** On Vercel, port number is ignored - Vercel assigns ports automatically

The `PORT=3001` in `backend/vercel.json` is for local development reference.

---

## Cost

**Vercel Pricing (as of 2025):**

- **Frontend:** Free tier includes generous limits
- **Backend:** Free tier includes generous limits (up to 1GB traffic)
- **Cost for this project:** $0/month (free tier)
- **Upgrade when needed:** Pay-as-you-go if traffic increases

---

## Advanced: Custom Domain

Once deployed, add a custom domain:

1. **Frontend domain:** e.g., `quran.example.com`
   - Go to Frontend project → Settings → Domains
   - Add domain, follow DNS instructions

2. **Backend domain:** e.g., `api.quran.example.com`
   - Go to Backend project → Settings → Domains
   - Add domain, follow DNS instructions

3. **Update frontend env var:**
   - Set `NEXT_PUBLIC_API_BASE_URL = https://api.quran.example.com`
   - Redeploy frontend

---

## Next Steps

1. ✅ Deploy backend first (get backend URL)
2. ✅ Deploy frontend with backend URL in env var
3. ✅ Test both URLs in browser
4. ✅ Share your live links

---

## Quick Reference

**Frontend Deployment Checklist:**
- [ ] Set root directory to `frontend`
- [ ] Add env var: `NEXT_PUBLIC_API_BASE_URL = <backend URL>`
- [ ] Click Deploy
- [ ] Wait 3-5 minutes
- [ ] Frontend URL: ✅

**Backend Deployment Checklist:**
- [ ] Set root directory to `backend`
- [ ] No env vars needed
- [ ] Click Deploy
- [ ] Wait 2-3 minutes
- [ ] Backend URL: ✅

**After Both Deployed:**
- [ ] Test backend: `<backend>/health`
- [ ] Test frontend: `<frontend>/`
- [ ] Test search in frontend
- [ ] Verify settings persist

---

## Support

If anything fails:

1. **Check Vercel Build Logs:**
   - Go to project → Deployments → click deployment → Logs
   - Look for TypeScript errors or build issues

2. **Verify Git Structure:**
   - `backend/` folder exists with `package.json`
   - `frontend/` folder exists with `package.json`
   - Both have proper file structure

3. **Re-read Root Directory Step:**
   - Many issues come from incorrect root directory
   - Must be exactly: `backend` and `frontend` (no slashes, no `/src`)

---

## Final Submission

Once both are live:

```markdown
# Quran Web App - Production Deployment

**Live URLs:**
- Frontend: https://quran-app.vercel.app
- Backend: https://quran-backend.vercel.app
- GitHub: https://github.com/rafiqul4/maxcode

**Stack:**
- Frontend: Next.js 16 (118 pre-built pages)
- Backend: Hono + Node.js
- Both: TypeScript strict mode, zero errors
- Hosting: Vercel (both frontend and backend)

**Features:**
✅ Read 114 surahs instantly
✅ Full-text search via production API
✅ Audio playback for each ayah
✅ Persistent settings
✅ Responsive mobile/tablet/desktop
✅ Production-ready code quality
```

---

Estimated total time: **10 minutes**

Ready to deploy? Start with Part 1 above!

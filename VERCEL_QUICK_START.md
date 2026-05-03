# ⚡ Quick Start: Deploy Both to Vercel (10 Minutes)

## Before You Start

- [ ] GitHub repo public: https://github.com/rafiqul4/maxcode
- [ ] All code pushed to `main` branch
- [ ] Both builds pass locally:
  ```bash
  npm run build  # frontend
  npm run build  # backend (in backend folder)
  ```

---

## Deployment Summary

| Project | Service | Time | Cost |
|---------|---------|------|------|
| Frontend | Vercel (Next.js) | 3-5 min | Free |
| Backend | Vercel (Node.js) | 2-3 min | Free |
| **Total** | **Both on Vercel** | **~10 min** | **$0** |

---

## Step 1: Deploy Backend (2-3 minutes)

### 1.1 Create Backend Project on Vercel

```
1. Go to: https://vercel.com/dashboard
2. Click: "Add New..." → "Project"
3. Click: "Import Git Repository"
4. Search: "rafiqul4/maxcode"
5. Select the repository
```

### 1.2 Configure Backend

```
Project Name:      quran-backend
Framework:         Node.js (or leave as "Other")
Root Directory:    backend  ← CRITICAL: Click "Edit" if needed
Build Command:     npm run build
Output Directory:  (leave empty)
Install Command:   npm install
```

### 1.3 Deploy

```
Click: "Deploy" button
Wait: 2-3 minutes

✅ You get: https://quran-backend.vercel.app (or similar)
```

**Save this URL!** You'll need it for frontend.

---

## Step 2: Deploy Frontend (3-5 minutes)

### 2.1 Create Frontend Project on Vercel

```
1. Go to: https://vercel.com/dashboard
2. Click: "Add New..." → "Project"
3. Click: "Import Git Repository"
4. Search: "rafiqul4/maxcode"
5. Select the same repository
```

### 2.2 Configure Frontend

```
Project Name:      quran-app  (must be different from backend!)
Framework:         Next.js (auto-detected)
Root Directory:    frontend  ← CRITICAL: Click "Edit" if needed
Build Command:     next build
```

### 2.3 Add Environment Variables

```
Name:    NEXT_PUBLIC_API_BASE_URL
Value:   https://quran-backend.vercel.app  (from Step 1)
Env:     Production

Click: "Add"
```

### 2.4 Deploy

```
Click: "Deploy" button
Wait: 3-5 minutes (pre-renders 118 pages)

✅ You get: https://quran-app.vercel.app (or similar)
```

**This is your live demo!**

---

## Step 3: Verify It Works (5 minutes)

### 3.1 Test Backend

Open in browser:
```
https://quran-backend.vercel.app/health
```

Should show JSON with status "ok"

### 3.2 Test Frontend

Open in browser:
```
https://quran-app.vercel.app
```

✅ Try:
- Click different surahs (instant loading)
- Search for "almighty" (should get results)
- Click play on an ayah (audio plays)
- Change font settings (opens panel)
- Refresh page (settings persist!)

---

## Your Live URLs

```markdown
Frontend:  https://quran-app.vercel.app
Backend:   https://quran-backend.vercel.app
GitHub:    https://github.com/rafiqul4/maxcode
```

---

## What Happens Next

When you push to GitHub `main`:
1. Vercel detects changes
2. Both projects rebuild automatically
3. Frontend gets updated env var
4. Both live in ~5 minutes

---

## If Something Fails

### Backend won't build?
- Check: `backend/package.json` exists
- Check: Root directory is exactly `backend` (not `backend/src`)
- View logs: Project → Deployments → click build → Logs tab

### Frontend shows "Cannot find module"?
- Check: `frontend/package.json` exists
- Check: Root directory is exactly `frontend`
- Redeploy: Deployments → "..." → "Redeploy"

### Search doesn't work?
- Check: Backend URL in environment variable is correct
- Frontend must redeploy after env change
- Deployments → "..." → "Redeploy"

---

## Full Documentation

For more details, see: **[VERCEL_BOTH_DEPLOYMENT.md](./VERCEL_BOTH_DEPLOYMENT.md)**

---

**Ready? Start with Step 1 above!** 🚀

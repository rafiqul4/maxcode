# 🚀 Vercel Deployment Checklist

## Pre-Deployment Verification ✅

- [x] GitHub repo public and pushed to `main`
- [x] Frontend build passes
- [x] Backend build passes
- [x] Backend API route exists under `backend/api/[...route].ts`
- [x] Frontend and backend both use Node `24.x`

## Deploy Frontend

1. Import `rafiqul4/maxcode` into Vercel.
2. Set the **Root Directory** to `frontend`.
3. Add `NEXT_PUBLIC_API_BASE_URL=https://your-backend-project.vercel.app/api`.
4. Deploy.

## Deploy Backend

1. Import the same repository as a second Vercel project.
2. Set the **Root Directory** to `backend`.
3. Vercel will serve the Hono API from `backend/api/[...route].ts`.
4. Deploy.

## Verify

- [ ] `https://your-backend-project.vercel.app/api/health`
- [ ] `https://your-backend-project.vercel.app/api/search?q=light`
- [ ] Surah sidebar loads
- [ ] Ayah audio plays
- [ ] Search works for Arabic and English
- [ ] Font settings persist

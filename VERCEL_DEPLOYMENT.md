# Vercel Deployment Guide

This repository is a split deployment:

- Frontend: `frontend/` on Vercel
- Backend: `backend/` on Vercel

## 1. Deploy the Frontend

1. Open Vercel and import `rafiqul4/maxcode`.
2. Set the **Root Directory** to `frontend`.
3. Keep the default Next.js build settings.
4. Set `NEXT_PUBLIC_API_URL` to your backend Vercel URL with the `/api` prefix.

Example:

```text
https://your-backend-project.vercel.app/api
```

## 2. Deploy the Backend

1. Import the same repository as a second Vercel project.
2. Set the **Root Directory** to `backend`.
3. Vercel will use the `api/[...route].ts` function entry.
4. The backend endpoints will be available under:

- `/api/search`
- `/api/health`

## 3. Environment Variables

Frontend:

- `NEXT_PUBLIC_API_URL=https://your-backend-project.vercel.app/api`

Backend:

- No required environment variables for production.

## 4. Verify

Test these URLs after deployment:

```text
https://your-backend-project.vercel.app/api/health
https://your-backend-project.vercel.app/api/search?q=light
```

Then open the frontend and confirm:

- Surah sidebar loads all 114 surahs
- Ayah pages render Arabic and English text
- Audio playback works
- Search returns Arabic and English matches
- Font settings persist after refresh

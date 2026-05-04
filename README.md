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

## Deployment Notes

- Frontend root directory for Vercel: `frontend`
- Backend root directory for Render: `backend`
- No production code should depend on localhost URLs
- The backend uses `process.env.PORT` and dotenv-based config loading
- Production API routes are exposed at `/api/health`, `/api/data`, and `/api/search`

## Live Demo

Replace these with your actual deployment URLs:

- Frontend: `https://your-frontend.vercel.app`
- Backend: `https://your-backend.onrender.com`

## Commit Strategy

Use small, meaningful commits such as:

- `feat: add typed api service and env config`
- `refactor: split backend controllers and middleware`
- `fix: remove localhost fallback from frontend api layer`
- `chore: update deployment docs and env examples`

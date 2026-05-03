# Quran Web App (Monorepo)

This repo contains two apps:

- frontend/ - Next.js (SSG) UI
- backend/ - Hono API for search

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

```bash
cd backend
npm install
npm run dev
```

The frontend expects the backend at http://localhost:3001 by default.
You can override it via:

```bash
setx NEXT_PUBLIC_API_BASE_URL http://localhost:3001
```

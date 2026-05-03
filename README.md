# Quran Web App (Monorepo)

A full-stack Quran reader app with TypeScript, Next.js (Frontend), and Hono (Backend).

**Features:**
- 🕌 Read all 114 surahs with Arabic text and English translation
- 🎵 Play individual ayah audio from Islamic Network CDN
- 🔍 Full-text search across all surahs
- 🎨 Dark theme with responsive design (mobile, tablet, desktop)
- ⚙️ Font settings with localStorage persistence (2 Arabic fonts, adjustable sizes)
- 📱 Mobile drawer navigation for surahs

## Project Structure

```
.
├── frontend/          # Next.js 16 (SSG) UI
│   ├── src/
│   │   ├── app/       # Routes + layouts
│   │   ├── components/ReaderShell.tsx
│   │   ├── lib/quran.ts
│   │   └── data/quran_en.json
│   └── package.json
├── backend/           # Hono API server
│   ├── src/index.ts
│   ├── data/quran_en.json
│   └── package.json
├── install.sh / install.bat
└── README.md
```

## Quick Start (Local)

### One-command setup:
**Windows:**
```bash
install.bat
```

**macOS/Linux:**
```bash
bash install.sh
```

### Or manual setup:

1. **Frontend:**
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000
```

2. **Backend** (in another terminal):
```bash
cd backend
npm install
npm run dev
# Runs at http://localhost:3001
```

The frontend automatically calls `http://localhost:3001/search` for API requests.

## Environment Variables

See `.env.example` for all options.

**Frontend** (in `frontend/.env.local`):
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

**Backend** (in `backend/.env`):
```
PORT=3001
```

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repo in [Vercel Dashboard](https://vercel.com).
2. Set **Root Directory** → `frontend`
3. Set environment variable:
   ```
   NEXT_PUBLIC_API_BASE_URL = https://your-backend-url.com
   ```
4. Deploy.

### Backend (Render / Railway / Fly.io)

**Example with Render:**
1. Create new Web Service on [Render](https://render.com).
2. Connect GitHub repo, set **Root Directory** → `backend`.
3. **Build Command:** `npm install`
4. **Start Command:** `npm run start`
5. Expose port `3001` (or set `PORT` env var).

**Example with Railway:**
1. Create new project on [Railway](https://railway.app).
2. Connect GitHub, select `backend` directory.
3. Railway auto-detects Node.js, builds and starts via `npm start`.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Language** | TypeScript |
| **Frontend** | Next.js 16 (App Router, SSG) |
| **Backend** | Hono + @hono/node-server |
| **Styling** | Tailwind CSS v4 |
| **Fonts** | Amiri, Scheherazade (Arabic); Sora (English) |
| **Data** | Quran JSON (risan/quran-json) |
| **Audio API** | Islamic Network CDN |

## Code Quality

- ✅ Full TypeScript strict mode
- ✅ Component-based architecture (React + Hono)
- ✅ SSG for performance (114 surah pages pre-built)
- ✅ CORS-enabled backend for cross-origin requests
- ✅ localStorage for persistent user settings

## Features Implemented

- ✅ Left icon sidebar (home, bookmarks, notes, settings)
- ✅ Scrollable surah list with surah number, Arabic name, English name
- ✅ Ayah display with Arabic (right-aligned) + English translation
- ✅ Per-ayah audio playback with play/pause controls
- ✅ Full-text search by Arabic or English
- ✅ Font settings modal (2 font choices, size sliders)
- ✅ Settings persist via localStorage
- ✅ Dark theme (matching QuranMazid design)
- ✅ Fully responsive (mobile drawer, tablet layout, desktop sidebar)
- ✅ Surah metadata (revelation place, total verses)

## Running Tests

```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm run build
```

## License

MIT

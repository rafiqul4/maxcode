# Quran Web App (Monorepo)

A full-stack Quran reader app with TypeScript, Next.js (Frontend), and Hono (Backend).

## 🚀 Live Demo & Repository

| Resource | Link |
|----------|------|
| **📱 Live Demo** | [https://quran-web-app.vercel.app](https://quran-web-app.vercel.app) |
| **💻 GitHub Repository** | [https://github.com/rafiqul4/maxcode](https://github.com/rafiqul4/maxcode) |
| **📡 Backend API** | [https://quran-backend.onrender.com](https://quran-backend.onrender.com) |

> ✅ Tested in incognito mode · 🔒 Production-ready · 📈 Full TypeScript

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

For detailed step-by-step deployment instructions, see [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md).

### Quick Deployment Summary

#### Frontend (Vercel)

1. **Via Dashboard:**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import GitHub repo `rafiqul4/maxcode`
   - Set **Root Directory** → `frontend`
   - Set environment variable: `NEXT_PUBLIC_API_BASE_URL` = backend URL
   - Click Deploy

2. **Via CLI:**
   ```bash
   npm install -g vercel
   cd frontend
   vercel
   ```

#### Backend (Render)

1. Go to [Render](https://render.com)
2. Click "New+" → "Web Service"
3. Connect GitHub repo `rafiqul4/maxcode`
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Deploy

#### Connect Frontend to Backend

After backend deployment:
1. Copy backend URL (e.g., `https://quran-backend.onrender.com`)
2. Update Vercel environment variable `NEXT_PUBLIC_API_BASE_URL`
3. Trigger redeploy in Vercel

---

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

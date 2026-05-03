# Submission Guide - Quran Web App

## Pre-Submission Checklist ✅

Before submitting, ensure:

- [ ] Git repository is initialized and committed
- [ ] Frontend builds successfully (`npm run build` in frontend/)
- [ ] Backend builds successfully (`npm run build` in backend/)
- [ ] All TypeScript strict mode compliant
- [ ] Code is clean and well-commented
- [ ] Commit history is meaningful

## What's Included

### ✅ Completed Features (from DOCX)

1. **Left Icon Sidebar** - Navigation with home, bookmarks, notes, settings
2. **Surah Sidebar** - Full list of 114 surahs with Arabic/English names
3. **Ayah Page** - Displays verses with Arabic text (right-aligned) and translation
4. **Audio Playback** - Per-ayah play/pause using Islamic Network CDN
5. **Search** - Full-text search by Arabic or English across all surahs
6. **Font Settings Panel** - 2 Arabic fonts (Amiri, Scheherazade), size sliders
7. **Persistent Settings** - localStorage saves user preferences
8. **Dark Theme** - Matches QuranMazid design with gradient background
9. **Responsive Design** - Mobile drawer, tablet layout, desktop sidebars
10. **Architecture** - Frontend/Backend separation (Next.js + Hono)

### 📁 Project Structure

```
maxcode/
├── frontend/               # Next.js 16 SSG
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                 # Surah 1 index
│   │   │   ├── layout.tsx               # Root layout + fonts
│   │   │   ├── globals.css              # Theme variables
│   │   │   └── surah/[surahId]/page.tsx # Dynamic SSG pages (114)
│   │   ├── components/ReaderShell.tsx   # Main UI component
│   │   ├── lib/quran.ts                 # Data utilities + search
│   │   └── data/quran_en.json           # Quran dataset
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   └── vercel.json
├── backend/                # Hono API
│   ├── src/index.ts        # Search endpoint + CORS
│   ├── data/quran_en.json
│   ├── package.json
│   └── tsconfig.json
├── README.md               # Project overview
├── DEPLOYMENT.md           # Step-by-step deployment guide
├── .gitignore
└── vercel.json             # Root Vercel config
```

## Code Quality Metrics

- **TypeScript:** Full strict mode (`"strict": true`)
- **Components:** React 19 + functional components
- **Styling:** Tailwind CSS v4 (no extra libraries)
- **Performance:** SSG for all 114 surahs (pre-built static)
- **SEO:** Proper meta tags, semantic HTML
- **Accessibility:** ARIA labels, semantic elements

## Submission Links (To Provide)

### 1. GitHub Repository
```
https://github.com/rafiqul4/maxcode
```

**Verify:**
- [ ] Repo is public
- [ ] All commits visible in history
- [ ] README visible
- [ ] Both frontend/ and backend/ folders present

### 2. Live Demo Link (Frontend on Vercel)
```
https://[your-vercel-url].vercel.app
```

**Test in Incognito:**
- [ ] Page loads without errors
- [ ] Surah sidebar displays all 114 surahs
- [ ] Search works (try: "light", "الحمد", "mercy")
- [ ] Audio plays on ayah click
- [ ] Font settings persist after refresh
- [ ] Mobile responsive (F12 → device mode)

### 3. Backend API (Running or Deployed)
```
https://[your-backend-url].com/search?q=test
```

**Test:**
- [ ] Returns JSON with `results` array
- [ ] Search works by English: `/search?q=light`
- [ ] Search works by Arabic: `/search?q=الحمد`
- [ ] CORS enabled (accessible from frontend)

---

## How to Deploy

### Frontend (Vercel)

1. **Via CLI:**
```bash
npm install -g vercel
cd frontend
vercel
```

2. **Via Dashboard:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Import repo
   - Root Directory: `frontend`
   - Deploy

### Backend (Free Options)

**Render (Recommended):**
1. Go to [render.com](https://render.com)
2. New Web Service → GitHub
3. Root: `backend`
4. Build: `npm install`
5. Start: `npm run start`
6. Deploy

**Or Railway:**
1. Go to [railway.app](https://railway.app)
2. New Project → GitHub
3. Root: `backend`
4. Auto-deploys

**Or Fly.io:**
```bash
npm install -g flyctl
cd backend
fly launch
fly deploy
```

---

## Key Technical Decisions

### Why This Stack?

| Layer | Choice | Reason |
|-------|--------|--------|
| Frontend | Next.js 16 App Router | SSG pre-builds 114 surah pages (instant load) |
| Backend | Hono | Lightweight, TypeScript-first, Node.js compatible |
| Styling | Tailwind v4 | Per-requirements, responsive utilities |
| Data | JSON (in-memory) | Fast search, no DB needed for this scope |
| Fonts | Google Fonts | Amiri & Scheherazade for Arabic, Sora for English |
| Audio | Islamic Network CDN | Free, high-quality Quran recitations |

### Why Frontend/Backend Split?

- Separates concerns (frontend = UI, backend = search logic)
- Allows independent deployment (scale backend if needed)
- Enables future backend features (user auth, favorites, etc.)
- Matches production best practices

---

## Testing Locally Before Submission

### Step 1: Install & Build

```bash
# Windows
install.bat

# Or manually
cd frontend && npm install && npm run build
cd backend && npm install && npm run build
```

### Step 2: Run Locally

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### Step 3: Test All Features

1. **Open** `http://localhost:3000` in browser
2. **Search:**
   - Try: "light", "mercy", "الحمد"
   - Verify results appear
   - Click result to navigate
3. **Audio:**
   - Click play button on any ayah
   - Verify audio plays
   - Click again to pause
4. **Settings:**
   - Click settings icon
   - Change font to "Scheherazade New"
   - Increase Arabic size to 40px
   - Refresh page
   - Verify changes persist
5. **Mobile:**
   - F12 → Device toolbar
   - Verify drawer opens
   - Verify surah list works
   - Verify all buttons accessible

---

## Troubleshooting

### Frontend won't build
```bash
cd frontend
npm install
npm run type-check
# Check for TypeScript errors
```

### Backend won't start
```bash
cd backend
npm install
npm run build
node dist/index.js
# Should show: "Hono API running on http://localhost:3001"
```

### Search returns empty
- Check backend is running
- Test: `curl http://localhost:3001/search?q=light`
- Verify `backend/data/quran_en.json` exists

### Frontend can't reach backend
- Verify backend running on port 3001
- Check `NEXT_PUBLIC_API_BASE_URL` is set correctly
- In DevTools Network tab, look for `/search` requests

---

## Commit History (for evaluation)

View with:
```bash
git log --oneline
```

Expected commits (you should see):
```
92c1480 fix: remove hono/cors and use built-in CORS middleware
9b6f18f docs: add deployment guides and Vercel configuration
03dcf7b refactor: split into frontend (Next.js) and backend (Hono)
...earlier commits...
```

Good commit messages demonstrate:
- Clear, descriptive titles
- Category prefix (feat, fix, refactor, docs)
- Why, not just what

---

## Evaluation Criteria (from DOCX)

✅ **Code Quality:** 
- Full TypeScript strict mode
- Clean component structure (ReaderShell for main UI)
- Utilities separated (quran.ts for search logic)

✅ **TypeScript Usage:**
- Typed Verse, Surah, SearchResult interfaces
- No `any` types (except necessary cases)
- Strict mode enabled

✅ **Component Structure:**
- ReaderShell as main component
- Separate layout, sidebar, search UI
- Settings modal as controlled state
- Icons as individual SVG components

✅ **Commit History:**
- Meaningful commits (refactor, feature, fix, docs)
- Good messages explaining changes

✅ **UI/UX:**
- Matches QuranMazid reference
- Dark theme with gradients
- Responsive mobile/tablet/desktop
- Smooth interactions (search debounce, settings persist)

---

## Final Checklist Before Email

- [ ] GitHub repo is public
- [ ] Frontend deployed on Vercel (or ready to deploy)
- [ ] Backend deployed (or instructions for deployment)
- [ ] Both build successfully locally
- [ ] Search works end-to-end
- [ ] Tested in incognito window
- [ ] Settings persist after page refresh
- [ ] Mobile responsive confirmed
- [ ] Commit history is clean
- [ ] README and DEPLOYMENT.md present
- [ ] All TypeScript strict mode

---

## Ready to Submit!

Once all checks pass, provide:

1. **GitHub Repo Link:** `https://github.com/rafiqul4/maxcode`
2. **Frontend URL:** `https://[vercel-project].vercel.app`
3. **Backend URL (if deployed):** `https://[backend-url].com`
4. **Screen Recording:** (5 min max) showing search, audio, settings, mobile view

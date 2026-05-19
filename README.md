# RoadmapAI

An AI-powered educational platform that generates personalized, structured learning roadmaps tailored to your goals, skill level, and available study time — powered by Google Gemini.

## Features

### Core

- **AI Roadmap Generator** — Describe your learning goal, pick your skill level, set daily study time and a target timeline. Gemini generates a multi-phase, structured roadmap with chapters, lessons, resources, and practice exercises. Falls back to curated template roadmaps when offline.
- **Interactive Learning View** — Navigate through phases → chapters → lessons. Expand/collapse sections, mark lessons complete, and watch your progress update in real-time.
- **Curated Resources** — Each lesson links to documentation, videos, articles, courses, GitHub repos, and hands-on exercises.
- **AI Mentor Chat** — Context-aware assistant that understands your roadmap and current progress. Ask follow-up questions, request simpler explanations, or get practice exercises.
- **Persistent Progress Tracking** — Progress is saved server-side per roadmap and synced on every page load. Optimistic UI with rollback on failure.
- **User Authentication** — JWT-based registration and login with bcrypt password hashing.

### Example Roadmap Topics

Full Stack Development · DSA for Placements · AI / Machine Learning · Cybersecurity · React · GATE CSE · Data Science · Python

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, TypeScript (strict mode), TailwindCSS, Framer Motion, Zustand, Axios, Lucide React |
| **Backend** | FastAPI, Pydantic v2, SlowAPI (rate limiting), Firebase Admin SDK |
| **AI** | Google Gemini 2.0 Flash (via `google-generativeai` SDK, async) |
| **Auth & Database** | Firebase Authentication & Cloud Firestore (Serverless) |

---

## Getting Started

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18+ |
| Python | 3.9+ |
| Firebase | Firebase project with Firestore and Authentication enabled |
| Gemini API key | Optional — get one free at [aistudio.google.com](https://aistudio.google.com/app/apikey) |

### Quick Start (Windows)

```powershell
# Clone and enter the project
git clone https://github.com/yourusername/roadmapai.git
cd roadmapai

# One-command setup — installs everything, generates secrets, starts servers
.\run.ps1
```

Or use `.\setup.ps1` for a step-by-step guided setup, or `setup.bat` for CMD.

### Manual Setup

#### 1. Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Configure GOOGLE_APPLICATION_CREDENTIALS for Firebase Admin if necessary
```

#### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local if your backend is on a different host/port
```

#### 3. Run

```bash
# Terminal 1 — Backend (port 8000)
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2 — Frontend (port 3000)
cd frontend
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | No | — | Google Gemini API key. Without it, roadmaps use built-in templates |
| `CORS_ORIGINS` | No | `http://localhost:3000,http://127.0.0.1:3000` | Comma-separated list of allowed frontend origins |
| `GOOGLE_APPLICATION_CREDENTIALS` | No | — | Path to Firebase Admin service account JSON |

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API base URL |

> **Security note:** `.env` and `.env.local` are git-ignored. Only `.env.example` files are tracked. Never commit real secrets.

---

## API Reference

All endpoints are also browsable at **http://localhost:8000/docs** (Swagger UI).

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | No | API info + version |
| `GET` | `/health` | No | Health check |

### Roadmaps (AI Microservice)

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|------|------------|-------------|
| `POST` | `/api/roadmaps/generate` | Optional | 5/min | Generate a new AI roadmap |

### AI Chat

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|------|------------|-------------|
| `POST` | `/api/chat` | Optional | 20/min | Send message to AI mentor |

---

## Project Structure

```
roadmapai/
├── backend/
│   ├── main.py                 # FastAPI app (AI microservice)
│   ├── schemas.py              # Pydantic v2 request/response models
│   ├── services/
│   │   ├── ai_service.py       # Gemini integration + fallback roadmaps
│   │   └── auth.py             # Firebase Admin Token verification
│   ├── tests/
│   │   └── test_api.py         # pytest suite (auth, IDOR, validation)
│   ├── pytest.ini              # Test configuration
│   ├── requirements.txt
│   ├── .env.example
│   └── .env                    # ← git-ignored, your local secrets
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (fonts, metadata)
│   │   ├── page.tsx            # Landing page
│   │   ├── globals.css         # Tailwind base + design system components
│   │   ├── error.tsx           # Global error boundary
│   │   ├── loading.tsx         # Global loading state
│   │   ├── generate/page.tsx   # Roadmap generator form
│   │   ├── roadmap/[id]/page.tsx  # Interactive roadmap view
│   │   ├── dashboard/page.tsx  # User's saved roadmaps
│   │   └── login/page.tsx      # Login / Register
│   ├── components/
│   │   ├── ui/                 # Button, Card, Input, Select, ProgressBar
│   │   ├── Navbar.tsx          # Navigation with mobile menu
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx, Features.tsx, HowItWorks.tsx
│   │   ├── ChapterList.tsx, ResourcePanel.tsx
│   │   └── AIMentor.tsx        # Chat interface
│   ├── lib/
│   │   ├── api.ts              # Axios instance + 401 interceptor
│   │   └── utils.ts            # Formatting helpers
│   ├── store/index.ts          # Zustand state management
│   ├── types/index.ts          # TypeScript interfaces
│   └── .env.example
│
├── run.ps1                     # One-command start (PowerShell)
├── setup.ps1                   # Guided setup (PowerShell)
├── setup.bat                   # Setup (CMD)
├── SPEC.md                     # Design specification
├── .gitignore
└── README.md                   # ← You are here
```

---

## Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `paper-50` | `#FAF9F7` | Page background |
| `paper-100` | `#F5F3EF` | Card/section backgrounds |
| `paper-200` | `#EEEBE4` | Hover / tertiary backgrounds |
| `ink-900` | `#1A1A1A` | Primary text |
| `ink-500` | `#5C5C5C` | Secondary text |
| `accent` | `#3B5BDB` | Primary actions, links |
| `accent-light` | `#5C7CFA` | Hover states |

### Typography

| Role | Font | Source |
|------|------|--------|
| Headings | Merriweather (serif) | Google Fonts via `next/font` |
| Body | Inter (sans-serif) | Google Fonts via `next/font` |
| Code | JetBrains Mono | Google Fonts via `next/font` |

---

## Security

The following security measures are implemented:

- **Firebase Authentication** — Secure user identity management and Token verification.
- **Firestore Security Rules** — Robust per-user data isolation.
- **Rate Limiting** — SlowAPI limits on generation (5/min) and chat (20/min).
- **CORS** — Configurable allowed origins via `CORS_ORIGINS` env var
- **Security Headers** — `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`
- **No secrets in git** — `.env` files are git-ignored; `.env.example` files use placeholders

---

## Testing

### Backend

```bash
cd backend
pip install pytest pytest-asyncio httpx
pytest -v
```

The test suite covers:
- Input validation (empty goal)
- Authentication
- Health endpoint response

---

## Deployment

### Backend (Railway / Render)

1. Create a new project and connect the GitHub repository
2. Set root directory to `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Set environment variables: `GEMINI_API_KEY`, `CORS_ORIGINS`, `GOOGLE_APPLICATION_CREDENTIALS` (optional JSON string)

### Frontend (Firebase Hosting / Vercel)

1. Create a new project and connect the repository
2. Set root directory to `frontend`
3. Set environment variables: `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_FIREBASE_*` variables

### Database (Firebase)

1. Setup Firebase Project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Enable Cloud Firestore
4. Deploy rules: `firebase deploy --only firestore:rules`

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

Built with care for learners everywhere.

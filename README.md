<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Gemini_2.0-Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Firebase-Auth_+_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

# RoadmapAI

> An AI-powered educational platform that transforms ambitious learning goals into structured, personalized roadmaps — complete with lessons, resources, coding sandboxes, mock interviews, progress analytics, and an AI mentor. Powered by **Google Gemini 2.0 Flash**.

---

## ✨ Features at a Glance

### 🧠 AI-Powered Core

| Feature | Description |
|---|---|
| **Roadmap Generator** | Describe your goal, pick a skill level, set daily study hours and a target timeline. Gemini generates a multi-phase roadmap with chapters, lessons, curated resources, and exercises. Falls back to built-in templates when offline. |
| **Multi-Step Generation Wizard** | Polished 4-step wizard (Goal → Profile → Commitment → Review) with Framer Motion slide animations, card-based selectors, and confetti celebration on success. |
| **AI Mentor Chat** | Context-aware assistant that understands your roadmap, current progress, and lesson content. Ask follow-ups, request simpler explanations, or get practice problems. Available as a floating FAB on every page. |
| **AI Mock Interviews** | Simulated technical interviews tailored to your roadmap topic. Receive scoring feedback and targeted improvement suggestions. |
| **Skill Assessment** | Pre-roadmap MCQ quiz powered by Gemini to gauge your current level and calibrate the generated content. |

### 📚 Learning Experience

| Feature | Description |
|---|---|
| **Interactive Lesson View** | Navigate Phases → Chapters → Lessons. Expand/collapse sections, mark lessons complete, and track progress in real-time. |
| **Lesson Workspace** | Tabbed environment with **Content** (resources, key concepts), **Monaco Code Playground** (full syntax highlighting, autocomplete), **AI Mock Interview**, and **TipTap Rich Text Notes** (auto-saved with formatting toolbar). |
| **Curated Resources** | Each lesson links to docs, videos, articles, courses, GitHub repos, and exercises — categorized with type badges. |
| **Bookmarking** | Pin important lessons for quick access from the dashboard. |

### 📊 Progress & Analytics

| Feature | Description |
|---|---|
| **Dashboard** | Central hub showing active roadmaps, total lessons completed, current day streak, and quick-access cards. |
| **Progress Calendar** | GitHub-style heatmap showing daily lesson completion activity over the past year. |
| **Streak Tracking** | Consecutive-day streak counter with visual indicators to build consistency habits. |
| **Skills Radar** | Recharts-powered radar chart visualizing mastery across roadmap phases — integrated on the dashboard. |
| **Weekly Velocity** | Bar chart tracking lessons completed per week with accent glow on the current week. |
| **Completion Forecast** | Smart velocity-based projections showing estimated completion date and on-track / behind status. |
| **Time Invested** | Cumulative hours invested across all completed lessons. |

### 🎨 Premium Dark-Mode UI

| Feature | Description |
|---|---|
| **Glassmorphic Navbar** | Permanently floating pill-shaped navbar with frosted glass blur and ambient glow effects. |
| **Mobile-First Design** | Staggered sidebar menu, bottom tab bar, horizontal swipe carousels, and tap-to-expand accordions on mobile. |
| **Full-Viewport Sections** | Every landing page section fills the screen (`min-h-[100dvh]`) with smooth scroll and subtle border separators. |
| **Amber/Zinc Theme** | Deep zinc backgrounds with warm amber accents, gradient highlights, and ambient glow effects. |

### 🔐 Infrastructure

| Feature | Description |
|---|---|
| **Firebase Auth** | Email/Password + Google SSO authentication with secure session management via `onAuthStateChanged`. |
| **Route Protection** | Unauthenticated users are redirected to login for private routes. |
| **Cloud Firestore** | Server-side progress persistence, note storage, and roadmap data — synced on every load. |
| **Guest Mode** | Full functionality without login using `localStorage`. Progress preserved across sessions. |
| **Optimistic UI** | Instant feedback on actions with server-side rollback on failure. |
| **Offline Templates** | When Gemini is unavailable, the generator serves pre-built roadmaps for popular topics. |

### 📝 Example Roadmap Topics

`Full Stack Development` · `DSA for Placements` · `AI / Machine Learning` · `Cybersecurity` · `React` · `GATE CSE` · `Data Science` · `Python` · `DevOps` · `System Design`

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, TypeScript (strict), TailwindCSS, Framer Motion, Zustand, Recharts, Monaco Editor, TipTap, Axios, Lucide React |
| **Backend** | FastAPI, Pydantic v2, SlowAPI (rate limiting), Firebase Admin SDK |
| **AI** | Google Gemini 2.0 Flash (via `google-generativeai` SDK, async) |
| **Auth & Database** | Firebase Authentication (Email/Password + Google SSO) + Cloud Firestore |
| **Fonts** | Merriweather (headings), Inter (body), JetBrains Mono (code) — via `next/font` |

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | 18+ | For the Next.js frontend |
| Python | 3.9+ | For the FastAPI backend |
| Firebase Project | — | Firestore + Authentication enabled |
| Gemini API Key | — | *Optional* — get one free at [aistudio.google.com](https://aistudio.google.com/app/apikey) |

### Quick Start (Windows)

```powershell
# Clone and enter the project
git clone https://github.com/Cyberclutch146/Career-Roadmap.git
cd Career-Roadmap

# One-command setup — installs everything, generates configs, starts both servers
.\roadmap
```

> **Tip:** Use `.\setup.ps1` for a step-by-step guided setup with prompts.

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
# Edit .env with your GEMINI_API_KEY (optional)
```

#### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your Firebase config + backend URL
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

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | No | — | Google Gemini API key. Without it, roadmaps use built-in templates |
| `CORS_ORIGINS` | No | `http://localhost:3000,http://127.0.0.1:3000` | Comma-separated allowed frontend origins |
| `GOOGLE_APPLICATION_CREDENTIALS` | No | — | Path to Firebase Admin service account JSON |

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API base URL |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | — | Firebase project API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | — | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | — | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | — | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | — | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | — | Firebase app ID |

> **Security:** `.env` and `.env.local` are git-ignored. Only `.env.example` files are tracked. Never commit real secrets.

---

## 📡 API Reference

All endpoints are browsable at **http://localhost:8000/docs** (Swagger UI).

### Core

| Method | Endpoint | Auth | Rate Limit | Description |
|---|---|---|---|---|
| `GET` | `/` | No | — | API info + version |
| `GET` | `/health` | No | — | Health check |

### Roadmaps

| Method | Endpoint | Auth | Rate Limit | Description |
|---|---|---|---|---|
| `POST` | `/api/roadmaps/generate` | Optional | 5/min | Generate a new AI roadmap |

### AI Services

| Method | Endpoint | Auth | Rate Limit | Description |
|---|---|---|---|---|
| `POST` | `/api/chat` | Optional | 20/min | Send message to AI mentor |
| `POST` | `/api/assessment/generate` | Optional | 10/min | Generate skill assessment quiz |
| `POST` | `/api/interview/chat` | Optional | 20/min | AI mock interview conversation |

---

## 📁 Project Structure

```
Career-Roadmap/
├── backend/
│   ├── main.py                    # FastAPI app — routes, CORS, rate limiting
│   ├── schemas.py                 # Pydantic v2 request/response models
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ai_service.py          # Gemini integration + fallback templates
│   │   └── auth.py                # Firebase Admin token verification
│   ├── tests/
│   │   └── test_api.py            # pytest suite
│   ├── firebase.json              # Firebase project config
│   ├── firestore.rules            # Firestore security rules
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx             # Root layout (fonts, metadata, AuthProvider, ChatWidget)
│   │   ├── page.tsx               # Landing page (full-viewport sections)
│   │   ├── globals.css            # Tailwind dark theme + design tokens
│   │   ├── error.tsx              # Global error boundary
│   │   ├── loading.tsx            # Animated loading skeleton
│   │   ├── generate/
│   │   │   ├── page.tsx           # Multi-step generation wizard orchestrator
│   │   │   └── _components/
│   │   │       ├── WizardProgress.tsx   # Desktop progress bar + mobile step track
│   │   │       ├── StepGoal.tsx         # Step 1 — Goal input + AI suggestions
│   │   │       ├── StepProfile.tsx      # Step 2 — Skill level + learning style
│   │   │       ├── StepCommitment.tsx   # Step 3 — Study hours + target duration
│   │   │       ├── StepReview.tsx       # Step 4 — Summary + assessment + generate
│   │   │       └── ConfettiBurst.tsx    # Success celebration animation
│   │   ├── roadmap/[id]/page.tsx  # Interactive roadmap workspace
│   │   ├── dashboard/page.tsx     # User dashboard + analytics
│   │   ├── gallery/page.tsx       # Public roadmap gallery
│   │   ├── login/page.tsx         # Auth (Email/Password + Google SSO)
│   │   └── api/auth/             # Next.js API routes (OTP send/verify)
│   │
│   ├── components/
│   │   ├── ui/                    # Button, Card, Input, Select, ProgressBar
│   │   ├── Navbar.tsx             # Floating glassmorphic pill + mobile sidebar
│   │   ├── MobileNav.tsx          # Bottom tab bar for mobile
│   │   ├── MobileSidebar.tsx      # Framer Motion slide-out drawer
│   │   ├── Footer.tsx             # Site footer
│   │   ├── Hero.tsx               # Landing hero section
│   │   ├── Features.tsx           # Feature grid (desktop) / accordion (mobile)
│   │   ├── HowItWorks.tsx         # Step grid (desktop) / carousel (mobile)
│   │   ├── ExampleRoadmap.tsx     # Interactive demo on landing
│   │   ├── Testimonials.tsx       # Testimonials grid / carousel
│   │   ├── ChapterList.tsx        # Roadmap phase/chapter renderer
│   │   ├── ResourcePanel.tsx      # Resource cards by type
│   │   ├── LessonWorkspace.tsx    # Tabbed workspace (Content, Code, Interview, Notes)
│   │   ├── AIMentor.tsx           # AI mentor chat interface + global FAB widget
│   │   ├── RichTextEditor.tsx     # TipTap editor wrapper
│   │   ├── ProgressCalendar.tsx   # GitHub-style heatmap + streak
│   │   ├── SkillsRadar.tsx        # Recharts radar chart
│   │   ├── WeeklyVelocity.tsx     # Recharts weekly lesson velocity chart
│   │   └── AuthProvider.tsx       # Firebase auth + route protection
│   │
│   ├── lib/
│   │   ├── api.ts                 # Axios instance + 401 interceptor
│   │   ├── firebase.ts            # Firebase client initialization
│   │   ├── firebase-admin.ts      # Firebase Admin SDK (server-side)
│   │   ├── sampleRoadmaps.ts     # Pre-built fallback roadmap data
│   │   └── utils.ts               # Formatting helpers
│   │
│   ├── store/index.ts             # Zustand state management
│   ├── types/index.ts             # TypeScript interfaces
│   └── .env.example
│
├── docs/
│   ├── SPEC.md                    # Design specification & visual system
│   ├── PROJECT_STATUS.md          # Current project state & feature breakdown
│   ├── TODO.md                    # Development task tracker (all sprints)
│   ├── FEATURE_ROADMAP.md         # Core 10 feature specifications
│   ├── FUTURE_FEATURES.md         # 50 AI/ML future features strategy
│   ├── IMPLEMENTATION_PLAN.md     # Sprint execution guide
│   ├── UI_OVERHAUL_PLAN.md        # UI/UX improvement strategy
│   ├── IMPL_P0_CRITICAL.md       # P0 implementation plan (~120h)
│   ├── IMPL_P1_HIGH.md           # P1 implementation plan (~180h)
│   ├── IMPL_P2_MEDIUM.md         # P2 implementation plan (~200h)
│   ├── IMPL_P3_EXPLORATORY.md    # P3 implementation plan (~160h)
│   ├── IMPL_ROADMAP_WIZARD.md    # Multi-step wizard implementation plan
│   └── IMPL_AGENTIC_CHATBOT.md   # Agentic RAG chatbot implementation plan
│
├── roadmap.ps1 / roadmap.bat     # One-command start scripts
├── setup.ps1                      # Guided setup wizard
├── .gitignore
└── README.md                      # ← You are here
```

---

## 🎨 Design System

### Color Palette (Dark Theme)

| Token | Hex | Usage |
|---|---|---|
| `background` | `#0a0a0b` | Page background |
| `surface` | `#18181b` | Card / section backgrounds |
| `surface-container` | `#27272a` | Elevated containers |
| `on-surface` | `#fafafa` | Primary text |
| `on-surface-variant` | `#a1a1aa` | Secondary text |
| `primary` | `#f59e0b` | Primary actions, links, active states |
| `secondary` | `#f97316` | Gradient accents |
| `outline` | `#52525b` | Borders, dividers |

### Typography

| Role | Font | Source |
|---|---|---|
| Headings | Merriweather (serif) | Google Fonts via `next/font` |
| Body | Inter (sans-serif) | Google Fonts via `next/font` |
| Code | JetBrains Mono (mono) | Google Fonts via `next/font` |

### Motion

| Element | Animation | Duration |
|---|---|---|
| Page transitions | Fade + upward slide | 300ms ease-out |
| Section reveal | `whileInView` fade+slide | 600ms |
| Hover states | Border glow + shadow | 300–500ms |
| Accordion expand | Height auto + opacity | 300ms |
| Mobile sidebar | Spring slide from right | spring(300, 30) |
| Wizard steps | Horizontal slide (left/right) | AnimatePresence |
| Confetti burst | Canvas particle explosion | 2000ms |

> **Philosophy:** Subtle, purposeful animations. The experience should feel premium, fluid, and alive.

---

## 🗄️ Data Model (Firestore)

```
users/{userId}/
├── roadmaps/{roadmapId}
│   ├── goal, skill_level, daily_hours, learning_style, target_months
│   ├── generated_roadmap (full JSON)
│   ├── created_at, updated_at
│   ├── progress/{lessonId}
│   │   └── completed, completed_at
│   └── notes/{lessonId}
│       └── content, updated_at
```

**Guest users:** Progress stored in `localStorage` with keys `progress_dates_{roadmapId}`, `roadmap_{id}`, `note_{roadmapId}_{lessonId}`. Dual-path read/write logic in all data-fetching components.

---

## 🔒 Security

| Measure | Details |
|---|---|
| **Firebase Authentication** | Email/Password + Google SSO with `onAuthStateChanged` session management |
| **Route Protection** | `AuthProvider.tsx` redirects unauthenticated users on private routes |
| **Firestore Security Rules** | Per-user data isolation — users can only read/write their own documents |
| **Rate Limiting** | SlowAPI: 5/min on generation, 10/min on assessment, 20/min on chat endpoints |
| **CORS** | Configurable allowed origins via `CORS_ORIGINS` environment variable |
| **Security Headers** | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` |
| **No secrets in git** | `.env` files git-ignored; `.env.example` uses placeholders |

---

## 🧪 Testing

### Backend

```bash
cd backend
pip install pytest pytest-asyncio httpx
pytest -v
```

The test suite covers:
- Input validation (empty goal, invalid skill levels)
- Authentication token verification
- Health endpoint responses
- Rate limiting behavior

### Frontend

```bash
cd frontend
npm run typecheck  # TypeScript strict mode check
npm run lint       # ESLint (strict config)
```

---

## 🚢 Deployment

### Backend (Railway / Render)

1. Create a new project and connect the GitHub repository
2. Set root directory to `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Set environment variables: `GEMINI_API_KEY`, `CORS_ORIGINS`, `GOOGLE_APPLICATION_CREDENTIALS`

### Frontend (Vercel / Firebase Hosting)

1. Create a new project and connect the repository
2. Set root directory to `frontend`
3. Framework preset: **Next.js**
4. Set environment variables: `NEXT_PUBLIC_API_URL` and all `NEXT_PUBLIC_FIREBASE_*` variables

### Database (Firebase)

1. Create a Firebase Project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password + Google providers)
3. Enable **Cloud Firestore**
4. Deploy security rules: `firebase deploy --only firestore:rules`

---

## 📄 Project Documentation

All documentation lives in the [`docs/`](docs/) directory:

| Document | Description |
|---|---|
| **[Design Specification](docs/SPEC.md)** | Complete design language, color tokens, typography, motion system, and component inventory. |
| **[Project Status](docs/PROJECT_STATUS.md)** | Comprehensive diagnostic of current state, architecture, and feature breakdown. |
| **[Development Tasks](docs/TODO.md)** | Checkable task tracker across all sprints with acceptance criteria. |
| **[Core Feature Roadmap](docs/FEATURE_ROADMAP.md)** | Strategic plan for the core 10 features across 4 sprints. |
| **[50 AI/ML Future Features](docs/FUTURE_FEATURES.md)** | Detailed descriptions, ML models, use cases, and impact for 50 AI-powered features. |
| **[Implementation Plan](docs/IMPLEMENTATION_PLAN.md)** | Execution steps, dependencies, and file change maps. |
| **[UI Overhaul Plan](docs/UI_OVERHAUL_PLAN.md)** | UI/UX improvement strategy and design decisions. |
| **[P0 Critical Features](docs/IMPL_P0_CRITICAL.md)** | Implementation plan for 8 critical features (~120h). |
| **[P1 High Priority](docs/IMPL_P1_HIGH.md)** | Implementation plan for 14 high-priority features (~180h). |
| **[P2 Medium Priority](docs/IMPL_P2_MEDIUM.md)** | Implementation plan for 16 medium-priority features (~200h). |
| **[P3 Exploratory](docs/IMPL_P3_EXPLORATORY.md)** | Implementation plan for 12 exploratory features (~160h). |
| **[Roadmap Wizard](docs/IMPL_ROADMAP_WIZARD.md)** | Multi-step generation wizard implementation plan. |
| **[Agentic Chatbot](docs/IMPL_AGENTIC_CHATBOT.md)** | Agentic RAG chatbot with ReAct loop and function calling. |

---

## 🗺️ Roadmap

Development is organized into **4 sprints** covering 10 planned core features, followed by a **Future Expansion Phase** focusing on 50 AI/ML-powered learning systems.

| Sprint / Phase | Theme | Key Features | Effort | Status |
|---|---|---|---|---|
| **Sprint 0** | UI/UX & Auth Overhaul | Glassmorphic navbar, mobile layouts, Firebase Auth, Monaco/TipTap, Generation Wizard | ~40h | ✅ Complete |
| **Sprint 1** | Dashboard Glow-Up | Skills Radar, Weekly Velocity, Completion Forecast, Time Invested | 6–8h | ✅ Complete |
| **Sprint 2** | Active Learning | AI Chapter Quizzes, Achievement Badge System | 14–18h | ⏳ Pending |
| **Sprint 3** | Power Tools | PDF Export, Offline-to-Cloud Sync | 8–10h | ⏳ Pending |
| **Sprint 4** | Polish | Resource Bookmarking, Calendar Sync, Light Mode | 8–11h | ⏳ Pending |
| **Phase 5** | AI-First Expansion | 50 AI/ML Features (see [FUTURE_FEATURES.md](docs/FUTURE_FEATURES.md)) | Long-term | 🧠 Planning |

### Current Development Status

- [x] AI Roadmap Generation (Gemini 2.0 Flash)
- [x] Multi-Step Generation Wizard (4-step with AnimatePresence + Confetti)
- [x] Interactive Lesson Workspace (4-tab view with Monaco + TipTap)
- [x] AI Mentor Chat + Global ChatWidget FAB
- [x] AI Mock Interviews
- [x] Skill Assessment Quizzes
- [x] Firebase Auth (Email/Password + Google SSO) + Route Protection
- [x] Cloud Firestore Persistence
- [x] Guest Mode (localStorage fallback)
- [x] Progress Calendar Heatmap + Streak Tracking
- [x] Premium Dark-Mode UI (glassmorphic navbar, mobile carousels, accordions)
- [x] Skills Radar Dashboard Integration *(Sprint 1)*
- [x] Weekly Velocity Chart *(Sprint 1)*
- [x] Completion Forecast *(Sprint 1)*
- [x] Time Invested Estimator *(Sprint 1)*
- [ ] AI Chapter Quizzes *(Sprint 2)*
- [ ] Achievement Badge System *(Sprint 2)*
- [ ] PDF Export *(Sprint 3)*
- [ ] Offline-to-Cloud Sync *(Sprint 3)*
- [ ] Resource Bookmarking *(Sprint 4)*
- [ ] Calendar Sync (iCal) *(Sprint 4)*
- [ ] Light Mode *(Sprint 4)*
- [ ] 50 AI/ML Future Features *(Phase 5 — see [FUTURE_FEATURES.md](docs/FUTURE_FEATURES.md))*

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

> Please reference the relevant feature ID (e.g., `A1`, `B2`) from `docs/FEATURE_ROADMAP.md` or the feature number from `docs/FUTURE_FEATURES.md` in your PR description.

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with care for learners everywhere. 📖
</p>

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
| **AI Mentor Chat** | Context-aware assistant that understands your roadmap, current progress, and lesson content. Ask follow-ups, request simpler explanations, or get practice problems. |
| **AI Mock Interviews** | Simulated technical interviews tailored to your roadmap topic. Receive scoring feedback and targeted improvement suggestions. |
| **Skill Assessment** | Pre-roadmap MCQ quiz powered by Gemini to gauge your current level and calibrate the generated content. |

### 📚 Learning Experience

| Feature | Description |
|---|---|
| **Interactive Lesson View** | Navigate Phases → Chapters → Lessons. Expand/collapse sections, mark lessons complete, and track progress in real-time. |
| **Lesson Workspace** | Tabbed environment with **Content** (resources, key concepts), **Code Playground** (live sandbox), **AI Mock Interview**, and **Notes** (auto-saved). |
| **Curated Resources** | Each lesson links to docs, videos, articles, courses, GitHub repos, and exercises — categorized with type badges. |
| **Bookmarking** | Pin important lessons for quick access from the dashboard. |

### 📊 Progress & Analytics

| Feature | Description |
|---|---|
| **Dashboard** | Central hub showing active roadmaps, total lessons completed, current day streak, and quick-access cards. |
| **Progress Calendar** | GitHub-style heatmap showing daily lesson completion activity over the past year. |
| **Streak Tracking** | Consecutive-day streak counter with visual indicators to build consistency habits. |
| **Skills Radar** | Recharts-powered radar chart visualizing mastery across roadmap phases *(built, pending dashboard integration)*. |

### 🔐 Infrastructure

| Feature | Description |
|---|---|
| **Firebase Auth** | Email/password authentication with secure session management. |
| **Cloud Firestore** | Server-side progress persistence, note storage, and roadmap data — synced on every load. |
| **Guest Mode** | Full functionality without login using `localStorage`. Progress is preserved across sessions. |
| **Optimistic UI** | Instant feedback on actions with server-side rollback on failure. |
| **Offline Templates** | When Gemini is unavailable, the generator serves pre-built roadmaps for popular topics. |

### 📝 Example Roadmap Topics

`Full Stack Development` · `DSA for Placements` · `AI / Machine Learning` · `Cybersecurity` · `React` · `GATE CSE` · `Data Science` · `Python` · `DevOps` · `System Design`

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, TypeScript (strict), TailwindCSS, Framer Motion, Zustand, Recharts, Axios, Lucide React, react-markdown |
| **Backend** | FastAPI, Pydantic v2, SlowAPI (rate limiting), Firebase Admin SDK |
| **AI** | Google Gemini 2.0 Flash (via `google-generativeai` SDK, async) |
| **Auth & Database** | Firebase Authentication + Cloud Firestore (Serverless) |
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
git clone https://github.com/yourusername/roadmapai.git
cd roadmapai

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
| `POST` | `/api/assessment/generate` | Optional | 5/min | Generate skill assessment quiz |
| `POST` | `/api/interview/chat` | Optional | 20/min | AI mock interview conversation |

---

## 📁 Project Structure

```
roadmapai/
├── backend/
│   ├── main.py                    # FastAPI app — routes, CORS, rate limiting
│   ├── schemas.py                 # Pydantic v2 request/response models
│   ├── services/
│   │   ├── ai_service.py          # Gemini integration + fallback templates
│   │   └── auth.py                # Firebase Admin token verification
│   ├── tests/
│   │   └── test_api.py            # pytest suite
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx             # Root layout (fonts, metadata, providers)
│   │   ├── page.tsx               # Landing page
│   │   ├── globals.css            # Tailwind base + design system tokens
│   │   ├── error.tsx              # Global error boundary
│   │   ├── loading.tsx            # Global loading skeleton
│   │   ├── generate/page.tsx      # Roadmap generator form + assessment
│   │   ├── roadmap/[id]/page.tsx  # Interactive roadmap viewer
│   │   ├── dashboard/page.tsx     # User dashboard + analytics
│   │   ├── gallery/page.tsx       # Public roadmap gallery (stub)
│   │   └── login/page.tsx         # Login / Register
│   ├── components/
│   │   ├── ui/                    # Button, Card, Input, Select, ProgressBar
│   │   ├── Navbar.tsx             # Navigation with mobile menu
│   │   ├── MobileNav.tsx          # Bottom tab bar (mobile)
│   │   ├── Footer.tsx             # Site footer
│   │   ├── Hero.tsx               # Landing hero section
│   │   ├── Features.tsx           # Feature showcase cards
│   │   ├── HowItWorks.tsx         # Step-by-step guide
│   │   ├── ExampleRoadmap.tsx     # Interactive demo on landing
│   │   ├── Testimonials.tsx       # User testimonials carousel
│   │   ├── ChapterList.tsx        # Roadmap phase/chapter renderer
│   │   ├── ResourcePanel.tsx      # Resource cards by type
│   │   ├── LessonWorkspace.tsx    # Tabbed workspace (Content, Code, Interview, Notes)
│   │   ├── AIMentor.tsx           # Chat interface for AI mentor
│   │   ├── ProgressCalendar.tsx   # GitHub-style heatmap + streak
│   │   ├── SkillsRadar.tsx        # Recharts radar chart (ready for integration)
│   │   └── AuthProvider.tsx       # Firebase auth context provider
│   ├── lib/
│   │   ├── api.ts                 # Axios instance + 401 interceptor
│   │   ├── firebase.ts            # Firebase client initialization
│   │   └── utils.ts               # Formatting helpers
│   ├── store/index.ts             # Zustand state management
│   ├── types/index.ts             # TypeScript interfaces
│   └── .env.example
│
├── docs/
│   └── FEATURE_ROADMAP.md         # Detailed feature expansion plan
│
├── roadmap.ps1                    # One-command start (PowerShell)
├── roadmap.bat                    # One-command start (CMD)
├── setup.ps1                      # Guided setup (PowerShell)
├── firebase.json                  # Firebase project config
├── firestore.rules                # Firestore security rules
├── SPEC.md                        # Design specification document
├── .gitignore
└── README.md                      # ← You are here
```

---

## 🎨 Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `paper-50` | `#FAF9F7` | Page background |
| `paper-100` | `#F5F3EF` | Card / section backgrounds |
| `paper-200` | `#EEEBE4` | Hover / tertiary backgrounds |
| `ink-900` | `#1A1A1A` | Primary text |
| `ink-500` | `#5C5C5C` | Secondary text |
| `ink-300` | `#8B8680` | Muted / placeholder text |
| `accent` | `#3B5BDB` | Primary actions, links, active states |
| `accent-light` | `#5C7CFA` | Hover states |
| `success` | `#2F9E44` | Completion, positive feedback |
| `warning` | `#E67700` | Caution indicators |
| `error` | `#C92A2A` | Errors, destructive actions |

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
| Hover states | Scale 1.02 + soft shadow | 200ms |
| Progress updates | Smooth number transition | 500ms |
| Chapter accordion | Expand/collapse | 250ms ease |

> **Philosophy:** Subtle, purposeful animations. Nothing jarring. The experience should feel calm and scholarly.

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
| **Firebase Authentication** | Secure identity management and token verification |
| **Firestore Security Rules** | Per-user data isolation — users can only read/write their own documents |
| **Rate Limiting** | SlowAPI: 5/min on generation, 20/min on chat endpoints |
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
2. Enable **Authentication** (Email/Password provider)
3. Enable **Cloud Firestore**
4. Deploy security rules: `firebase deploy --only firestore:rules`

---

## 📄 Project Documentation

Explore the detailed architecture, guides, status reports, and task lists:

- **[Project Status Document](docs/PROJECT_STATUS.md)**: A complete diagnostic summary of the current project state, built/pending features, and tech stack mapping.
- **[Detailed Development Task List (TODO.md)](docs/TODO.md)**: A checkable development tracker mapping out direct tasks, sub-tasks, and acceptance criteria across all sprints.
- **[Future AI Feature Strategy (40 New Features)](docs/FUTURE_FEATURES.md)**: Comprehensive descriptions, use cases, and educational impacts for 40 new AI features focused on intelligent learning.
- **[Design Specification (SPEC.md)](SPEC.md)**: Design language, typographic scales, spatial systems, and UX flows.
- **[Core Feature Roadmap](docs/FEATURE_ROADMAP.md)**: Strategic plan outlining the specifications and rationale for the core 10 features.
- **[Step-by-Step Implementation Plan](docs/IMPLEMENTATION_PLAN.md)**: Execution steps, dependencies, and file change maps for the sprint roadmap.

---

## 🗺️ Roadmap

Development is organized into **4 sprints** covering 10 planned core features, followed by a **Future Expansion Phase** focusing on 40 new AI-powered learning systems.

| Sprint / Phase | Theme | Key Features | Effort | Status |
|---|---|---|---|---|
| **Sprint 1** | Dashboard Glow-Up | Skills Radar Integration, Progress Analytics | 6–8h | ⏳ Pending |
| **Sprint 2** | Active Learning | AI Chapter Quizzes, Achievement Badge System | 14–18h | ⏳ Pending |
| **Sprint 3** | Power Tools | Rich Markdown Notes, PDF Export, Offline-to-Cloud Sync | 12–15h | ⏳ Pending |
| **Sprint 4** | Polish | Resource Bookmarking, Calendar Sync, Dark Mode | 8–11h | ⏳ Pending |
| **Phase 5** | AI-First Expansion | 40 AI Personalization, Sandbox, & Career Features | Long-term | 🧠 Planning |

### Current Development Status

- [x] AI Roadmap Generation (Gemini 2.0 Flash)
- [x] Interactive Lesson Workspace (4-tab view)
- [x] AI Mentor Chat
- [x] AI Mock Interviews
- [x] Skill Assessment Quizzes
- [x] Firebase Auth + Firestore Persistence
- [x] Guest Mode (localStorage fallback)
- [x] Progress Calendar Heatmap
- [x] Streak Tracking
- [x] Skills Radar Component (built, not yet integrated)
- [ ] Skills Radar Dashboard Integration *(Sprint 1)*
- [ ] Progress Analytics Widgets *(Sprint 1)*
- [ ] AI Chapter Quizzes *(Sprint 2)*
- [ ] Achievement Badge System *(Sprint 2)*
- [ ] Rich Markdown Notes *(Sprint 3)*
- [ ] PDF Export *(Sprint 3)*
- [ ] Offline-to-Cloud Sync *(Sprint 3)*
- [ ] Resource Bookmarking *(Sprint 4)*
- [ ] Calendar Sync (iCal) *(Sprint 4)*
- [ ] Dark Mode *(Sprint 4)*
- [ ] 40 AI-First Future Features *(Phase 5 - see [FUTURE_FEATURES.md](docs/FUTURE_FEATURES.md))*

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

> Please reference the relevant feature ID (e.g., `A1`, `B2`) from `docs/FEATURE_ROADMAP.md` in your PR description.

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with care for learners everywhere. 📖
</p>

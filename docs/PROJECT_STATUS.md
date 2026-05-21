# Project Status: RoadmapAI

> A comprehensive diagnostic of the current project state, architecture, implemented features, and recent overhauls.
> Last updated: **May 2026**

---

## 📅 Project Overview

RoadmapAI is an AI-powered educational platform that transforms career and learning goals into structured, personalized roadmaps. The system provides phased lesson plans, curated learning resources, a Monaco-powered code playground, AI chat mentoring via Google Gemini, simulated technical mock interviews, progress analytics, and a premium dark-mode glassmorphic UI.

---

## 🛠️ Tech Stack Status

| Component | Technology | Version / Status | Notes |
|---|---|---|---|
| **Frontend Framework** | Next.js | 14.x (App Router) | Fully functional with `'use client'` directives and SSR-safe patterns. |
| **Language** | TypeScript | Strict mode | All components and stores are strictly typed. |
| **Styling** | TailwindCSS | v3.x | Dark-mode amber/zinc design system with custom tokens in `globals.css`. |
| **State Management** | Zustand | Stable | Handles user state, roadmap selection, progress tracking, and settings. |
| **Charts** | Recharts | v3.8+ | Used in Progress Heatmap and Skills Radar components. |
| **Animations** | Framer Motion | v11+ | Employed for page transitions, card hovers, accordion expand/collapse, mobile sidebar, and navbar animations. |
| **Rich Text Editor** | TipTap | v3.23+ | Used in the Notes Workspace for rich text editing with formatting toolbar. |
| **Code Editor** | Monaco Editor | v4.7+ | Replaced basic textarea in Code Playground with full syntax highlighting, autocomplete, and line numbers. |
| **Authentication** | Firebase Auth | Web Client SDK v12 | Email/Password + Google SSO via `signInWithPopup`. Route protection via `onAuthStateChanged`. |
| **Database** | Cloud Firestore | Web Client SDK v12 | Persists roadmaps, lesson completion states, and user notes. |
| **Backend API** | FastAPI | 0.100+ | Async routes for AI services and Firebase Admin token validation. |
| **AI Engine** | Google Gemini | 2.0 Flash | Generates roadmaps, assessments, mentor responses, and mock interviews. |
| **Rate Limiting** | SlowAPI | Stable | IP/Token-based rate limiting (5/min generate, 20/min chat). |

---

## 📁 Codebase Architecture

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
│   │   ├── page.tsx               # Landing page (snap sections, accordions, carousels)
│   │   ├── globals.css            # Tailwind dark theme tokens + glassmorphism utilities
│   │   ├── error.tsx              # Global error boundary
│   │   ├── loading.tsx            # Global animated loading skeleton
│   │   ├── generate/page.tsx      # Roadmap generator form + skill assessment
│   │   ├── roadmap/[id]/page.tsx  # Interactive roadmap workspace viewer
│   │   ├── dashboard/page.tsx     # User dashboard + analytics
│   │   ├── gallery/page.tsx       # Public roadmap gallery (stub)
│   │   └── login/page.tsx         # Firebase Auth (Email/Password + Google SSO)
│   ├── components/
│   │   ├── ui/                    # Button, Card, Input, Select, ProgressBar
│   │   ├── Navbar.tsx             # Floating glassmorphic pill navbar + mobile sidebar
│   │   ├── MobileNav.tsx          # Bottom tab bar (mobile)
│   │   ├── Footer.tsx             # Site footer
│   │   ├── Hero.tsx               # Landing hero (min-h-[100dvh], centered, animated)
│   │   ├── Features.tsx           # Desktop grid + mobile accordion (AnimatePresence)
│   │   ├── HowItWorks.tsx         # Desktop grid + mobile horizontal carousel
│   │   ├── ExampleRoadmap.tsx     # Interactive demo roadmap on landing
│   │   ├── Testimonials.tsx       # Desktop grid + mobile horizontal carousel
│   │   ├── ChapterList.tsx        # Roadmap phase/chapter renderer
│   │   ├── ResourcePanel.tsx      # Resource cards by type
│   │   ├── LessonWorkspace.tsx    # Tabbed workspace (Content, Code, Interview, Notes)
│   │   ├── AIMentor.tsx           # Chat interface for AI mentor
│   │   ├── ProgressCalendar.tsx   # GitHub-style heatmap + streak
│   │   ├── SkillsRadar.tsx        # Recharts radar chart
│   │   └── AuthProvider.tsx       # Firebase auth context + route protection
│   ├── lib/
│   │   ├── api.ts                 # Axios instance + 401 interceptor
│   │   ├── firebase.ts            # Firebase client initialization
│   │   └── utils.ts               # Formatting helpers
│   ├── store/index.ts             # Zustand state management
│   ├── types/index.ts             # TypeScript interfaces
│   └── .env.example
│
├── docs/
│   ├── SPEC.md                    # Design specification document
│   ├── PROJECT_STATUS.md          # ← You are here
│   ├── TODO.md                    # Development task tracker
│   ├── FEATURE_ROADMAP.md         # Core 10 feature specs
│   ├── FUTURE_FEATURES.md         # 50 AI/ML future features
│   ├── IMPLEMENTATION_PLAN.md     # Sprint execution guide
│   └── UI_OVERHAUL_PLAN.md        # UI/UX improvement strategy
│
└── config / scripts
    ├── roadmap.ps1 / roadmap.bat  # One-command start scripts
    ├── setup.ps1                  # Guided setup wizard
    ├── firebase.json              # Firebase project config
    ├── firestore.rules            # Firestore security rules
    └── .gitignore
```

---

## 🚦 Feature Implementation Breakdown

### ✅ Completed Features

#### AI Core
- [x] **Goal-Oriented Roadmap Generation**: Gemini 2.0 Flash generates structured multi-phase paths (Phase → Chapter → Lesson) with timelines, study hours, and curated resources.
- [x] **Fallback Generation System**: Offline pre-built templates serve popular topics when the Gemini API is unavailable.
- [x] **Interactive Pre-Assessment Quiz**: 5-question MCQ generator evaluating initial skill level.
- [x] **AI Mentor Chat**: Context-aware assistant that understands roadmap, progress, and lesson content.
- [x] **AI Mock Technical Interviews**: Simulated interviews with scoring feedback and improvement suggestions.

#### Learning Experience
- [x] **Tabbed Lesson Workspace**: 4-tab interface (Content, Code Playground, Mock Interview, Notes).
- [x] **Monaco Code Playground**: Full syntax highlighting, autocomplete, line numbers, and live rendering. Replaced basic textarea.
- [x] **TipTap Rich Text Notes**: Formatting toolbar with bold, italic, lists, and code blocks. Auto-save with animated toast feedback.
- [x] **Resource Indexing**: Categorized guides, docs, code references, and videos under lesson sheets.
- [x] **Mobile Sidebar (Swappable)**: Framer Motion drawer/bottom-sheet with "Swap Mode" toggle for testing.

#### Analytics & Progress
- [x] **GitHub-Style Progress Heatmap**: Daily lesson completion history in a grid calendar.
- [x] **Streak Tracking**: Consecutive-day counter with fire flame animations.
- [x] **Basic Stats Cards**: Total lessons completed, active roadmaps, streak size.
- [x] **Skills Radar Chart**: Phase-by-phase mastery visualization (built, pending dashboard integration).

#### Authentication & Infrastructure
- [x] **Firebase Auth (Email/Password + Google SSO)**: Secure session management via `onAuthStateChanged`.
- [x] **Route Protection**: Unauthenticated users redirected to `/login` for private routes.
- [x] **Cloud Firestore Persistence**: Server-side progress, notes, and roadmap data synced on every load.
- [x] **Guest Mode**: Full functionality using `localStorage` without login.
- [x] **Optimistic UI**: Instant feedback with server-side rollback on failure.

#### UI/UX Overhaul (Recently Completed)
- [x] **Floating Glassmorphic Navbar**: Permanently floating pill shape with blur/saturation backdrop.
- [x] **Staggered Mobile Sidebar Menu**: Framer Motion powered side panel with staggered link animations.
- [x] **Dark Theme Redesign**: Amber/zinc color palette with `bg-gradient-to-r from-amber-400 to-orange-500` accents.
- [x] **Section Separation**: Full-viewport-height sections with `border-white/5` dividers.
- [x] **Mobile Accordion (Features)**: Tap-to-expand accordion on mobile using `AnimatePresence`.
- [x] **Mobile Carousels (HowItWorks, Testimonials)**: Horizontal swipeable carousels with minute scrollbar indicators.
- [x] **Badge Removal**: Removed AI Powered, 10,000+ Roadmaps, and other promotional badges from hero.

### ⏳ Pending Features

| Feature | Sprint | Effort |
|---|---|---|
| Skills Radar Dashboard Integration | Sprint 1 | 3–4h |
| Weekly Velocity Chart | Sprint 1 | 2–3h |
| Time Invested Estimator | Sprint 1 | 1–2h |
| Completion Forecast | Sprint 1 | 2–3h |
| AI Chapter Quizzes (Backend + Frontend) | Sprint 2 | 8–10h |
| Achievement Badge System | Sprint 2 | 6–8h |
| PDF Export | Sprint 3 | 4–5h |
| Offline-to-Cloud Sync | Sprint 3 | 4–5h |
| Resource Bookmarking | Sprint 4 | 3–4h |
| Calendar Sync (iCal) | Sprint 4 | 3–4h |
| Light Mode / Theme Toggle | Sprint 4 | 4–6h |
| 50 AI-First Future Features | Phase 5 | Long-term |

---

## 📈 Recent Changes Timeline

| Date | Change | Files Affected |
|---|---|---|
| May 2026 | Firebase Auth (Google SSO + Email/Password) | `AuthProvider.tsx`, `login/page.tsx`, `Navbar.tsx` |
| May 2026 | Floating glassmorphic navbar rewrite | `Navbar.tsx` |
| May 2026 | Mobile staggered sidebar menu | `Navbar.tsx` |
| May 2026 | Hero badge removal | `Hero.tsx` |
| May 2026 | Full-viewport sections with borders | `Hero.tsx`, `Features.tsx`, `HowItWorks.tsx`, `ExampleRoadmap.tsx`, `Testimonials.tsx` |
| May 2026 | Mobile accordion for Features | `Features.tsx` |
| May 2026 | Mobile carousels for HowItWorks & Testimonials | `HowItWorks.tsx`, `Testimonials.tsx` |
| May 2026 | Monaco Editor integration | `LessonWorkspace.tsx` |
| May 2026 | TipTap Rich Text Notes | `LessonWorkspace.tsx` |
| May 2026 | Documentation overhaul (50 AI features) | `docs/FUTURE_FEATURES.md`, all docs |

---

## 📊 Codebase Metrics

| Metric | Value |
|---|---|
| **Frontend Components** | ~20 |
| **Pages / Routes** | 6 (Landing, Generate, Roadmap, Dashboard, Gallery, Login) |
| **Backend Endpoints** | 5 (Health, Generate, Chat, Assessment, Interview) |
| **TypeScript Strict** | ✅ Enabled |
| **ESLint** | ✅ Configured (Strict) |
| **Dependencies (Frontend)** | ~15 production |
| **Dependencies (Backend)** | ~8 production |

---

## 🎯 Next Immediate Goals

1. **Sprint 1 (Dashboard Glow-Up)**: Mount `SkillsRadar` on dashboard, add weekly velocity chart, calculate time invested, and show completion forecast.
2. **Sprint 2 (Active Learning)**: Implement `/api/quiz/chapter` backend endpoint and build the quiz modal UI. Establish badge catalog and unlock triggers.
3. **Phase 5 Planning**: Begin architecture design for the first batch of AI/ML features (Spaced Repetition, Flashcards, Voice Interviews).

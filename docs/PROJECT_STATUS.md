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
| **Styling** | TailwindCSS | v3.x | Strict 100% Dark-mode (amber/zinc) design system. Universal Light Mode was explored but reverted for aesthetic consistency. |
| **Background** | WebGL / Three.js | Custom | `Galaxy.tsx` dynamic particle background powering the global application aesthetic. |
| **State Management** | Zustand | Stable | Handles user state, roadmap selection, progress tracking, and settings. |
| **Charts** | Recharts | v3.8+ | Used in Progress Heatmap, Weekly Velocity, and Skills Radar components. |
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
Career-Roadmap/
├── README.md
│
├── backend/
│   ├── main.py                    # FastAPI app — routes, CORS, rate limiting
│   ├── schemas.py                 # Pydantic v2 request/response models
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ai_service.py          # Gemini integration + fallback templates (65KB)
│   │   └── auth.py                # Firebase Admin token verification
│   ├── tests/
│   │   └── test_api.py            # pytest suite
│   ├── roadmap.ps1                # One-command start script (PowerShell)
│   ├── roadmap.bat                # One-command start script (Batch)
│   ├── setup.ps1                  # Guided setup wizard
│   ├── firebase.json              # Firebase project config
│   ├── firestore.rules            # Firestore security rules
│   ├── requirements.txt
│   ├── .env / .env.example
│   └── .gitignore
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx             # Root layout (fonts, metadata, AuthProvider, ChatWidget)
│   │   ├── page.tsx               # Landing page (snap sections, accordions, carousels)
│   │   ├── globals.css            # Tailwind dark theme tokens + glassmorphism utilities
│   │   ├── error.tsx              # Global error boundary
│   │   ├── loading.tsx            # Global animated loading skeleton
│   │   ├── generate/
│   │   │   └── page.tsx           # Roadmap generator form + skill assessment
│   │   ├── roadmap/
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Interactive roadmap workspace viewer
│   │   ├── dashboard/
│   │   │   └── page.tsx           # User dashboard + analytics
│   │   ├── gallery/
│   │   │   └── page.tsx           # Public roadmap gallery
│   │   ├── login/
│   │   │   └── page.tsx           # Firebase Auth (Email/Password + Google SSO)
│   │   └── api/                   # Next.js API routes (if any)
│   │
│   ├── components/
│   │   ├── ui/                    # Primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── Navbar.tsx             # Floating glassmorphic pill navbar + mobile sidebar
│   │   ├── MobileNav.tsx          # Bottom tab bar (mobile)
│   │   ├── MobileSidebar.tsx      # Framer Motion slide-out drawer
│   │   ├── Footer.tsx             # Site footer
│   │   ├── Hero.tsx               # Landing hero (min-h-[100dvh], centered, animated)
│   │   ├── Features.tsx           # Desktop grid + mobile accordion (AnimatePresence)
│   │   ├── HowItWorks.tsx         # Desktop grid + mobile horizontal carousel
│   │   ├── ExampleRoadmap.tsx     # Interactive demo roadmap on landing
│   │   ├── Testimonials.tsx       # Desktop grid + mobile horizontal carousel
│   │   ├── ChapterList.tsx        # Roadmap phase/chapter renderer (dark theme)
│   │   ├── ResourcePanel.tsx      # Resource cards by type
│   │   ├── LessonWorkspace.tsx    # Tabbed workspace (Content, Code, Interview, Notes)
│   │   ├── AIMentor.tsx           # Chat interface + global ChatWidget FAB
│   │   ├── RichTextEditor.tsx     # TipTap editor wrapper
│   │   ├── AppBackground.tsx      # Global background wrapper for Galaxy component
│   │   ├── Galaxy.tsx             # 3D interactive WebGL background component
│   │   ├── ProgressCalendar.tsx   # GitHub-style heatmap + streak
│   │   ├── SkillsRadar.tsx        # Recharts radar chart
│   │   ├── WeeklyVelocity.tsx     # Recharts weekly lesson velocity chart
│   │   └── AuthProvider.tsx       # Firebase auth context + route protection
│   │
│   ├── lib/
│   │   ├── api.ts                 # Axios instance + 401 interceptor
│   │   ├── firebase.ts            # Firebase client initialization
│   │   ├── firebase-admin.ts      # Firebase Admin SDK (server-side)
│   │   ├── sampleRoadmaps.ts     # Pre-built fallback roadmap data (35KB)
│   │   └── utils.ts               # Formatting helpers
│   │
│   ├── store/
│   │   └── index.ts               # Zustand state management
│   │
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces (Roadmap, Phase, Chapter, Lesson, etc.)
│   │
│   ├── tailwind.config.ts         # Custom theme tokens (zinc, amber, glassmorphism)
│   ├── postcss.config.js
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.local / .env.example
│
└── docs/
    ├── SPEC.md                    # Design specification (colors, typography, motion, APIs)
    ├── PROJECT_STATUS.md          # ← You are here
    ├── TODO.md                    # Development task tracker
    ├── FEATURE_ROADMAP.md         # Core 10 feature specs
    ├── FUTURE_FEATURES.md         # 50 AI/ML future features
    ├── IMPLEMENTATION_PLAN.md     # Sprint execution guide
    ├── UI_OVERHAUL_PLAN.md        # UI/UX improvement strategy
    ├── IMPL_P0_CRITICAL.md        # P0 implementation plan (8 features, ~120h)
    ├── IMPL_P1_HIGH.md            # P1 implementation plan (14 features, ~180h)
    ├── IMPL_P2_MEDIUM.md          # P2 implementation plan (16 features, ~200h)
    ├── IMPL_P3_EXPLORATORY.md     # P3 implementation plan (12 features, ~160h)
    ├── IMPL_ROADMAP_WIZARD.md     # Implementation plan for the multi-step generate wizard
    └── IMPL_AGENTIC_CHATBOT.md    # Implementation plan for the agentic RAG chatbot
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

#### UI / UX
- [x] **Dark-Mode Glassmorphism**: Complete stylistic overhaul using pure dark-mode CSS tokens, ambient glow effects, and responsive mobile layouts.
- [x] **3D Generative Background**: Implemented a stunning `Galaxy` WebGL particle simulation for the global application background.
- [x] **Dashboard Analytics Overhaul**: Built comprehensive user dashboard featuring Recharts-powered `SkillsRadar`, `WeeklyVelocity`, and GitHub-style `ProgressCalendar`. Mobile layouts optimized with native-feeling custom dropdowns.
- [x] **Tabbed Lesson Workspace**: Seamless switching between Lesson Content, Code Playground (Monaco), Technical Mock Interview (AI Chat), and Rich Text Notes (TipTap).
- [x] **Landing Page & Gallery**: Fully responsive landing page with animated sections and a public roadmap gallery with community sorting.
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
| May 2026 | ChapterList dark theme overhaul | `ChapterList.tsx` |
| May 2026 | Roadmap detail page UI redesign | `roadmap/[id]/page.tsx` |
| May 2026 | Gallery page dark theme rewrite | `gallery/page.tsx` |
| May 2026 | Dashboard redesign (stats strip, row-based roadmaps, SVG progress rings) | `dashboard/page.tsx` |
| May 2026 | Global AI Mentor ChatWidget (FAB on every page) | `AIMentor.tsx`, `layout.tsx`, `roadmap/[id]/page.tsx` |
| May 2026 | P0–P3 implementation plan documents | `IMPL_P0_CRITICAL.md`, `IMPL_P1_HIGH.md`, `IMPL_P2_MEDIUM.md`, `IMPL_P3_EXPLORATORY.md` |
| May 2026 | PROJECT_STATUS.md folder structure audit + update | `PROJECT_STATUS.md` |

---

## 📊 Codebase Metrics

| Metric | Value |
|---|---|
| **Frontend Components** | 20 (5 UI primitives + 15 feature components) |
| **Pages / Routes** | 6 (Landing, Generate, Roadmap, Dashboard, Gallery, Login) |
| **Backend Endpoints** | 5 (Health, Generate, Chat, Assessment, Interview) |
| **TypeScript Strict** | ✅ Enabled |
| **ESLint** | ✅ Configured (Strict) |
| **Dependencies (Frontend)** | ~15 production |
| **Dependencies (Backend)** | ~8 production |
| **Documentation Files** | 11 (in `/docs`) |

---

## 🎯 Next Immediate Goals

1. **Sprint 1 (Dashboard Glow-Up)**: ~~Mount `SkillsRadar` on dashboard~~ ✅, ~~add weekly velocity chart~~ ✅, ~~show completion forecast~~ ✅.
2. **Sprint 2 (Active Learning)**: Implement `/api/quiz/chapter` backend endpoint and build the quiz modal UI. Establish badge catalog and unlock triggers.
3. **Phase 5 Planning**: ✅ Detailed P0–P3 implementation plans created (see `IMPL_P0_CRITICAL.md` through `IMPL_P3_EXPLORATORY.md`).

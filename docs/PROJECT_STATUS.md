# Project Status: RoadmapAI

This document provides a comprehensive overview of the current status of **RoadmapAI** (Career-Roadmap), mapping out implemented features, system architecture, codebase layout, and remaining items from the feature roadmap.

---

## 📅 Project Overview

RoadmapAI is an AI-powered educational application designed to convert personalized career or learning goals into interactive, structured roadmaps. The system provides lesson plans, curated learning resources, a coding playground, AI chat mentoring, simulated technical mock interviews, and dashboard analytics.

---

## 🛠️ Tech Stack Status

The core technology stack is fully established and operational across both frontend and backend directories:

| Component | Technology | Version / Status | Notes |
|---|---|---|---|
| **Frontend Framework** | Next.js | 14.x (App Router) | Fully functional, handles client state and page routing. |
| **Styling** | TailwindCSS | v3.x | Design tokens for paper-white theme mapped in `globals.css`. |
| **State Management** | Zustand | Stable | Handles roadmap selection, local settings, and dashboard metrics. |
| **Charts** | Recharts | Stable | Used in Progress Heatmap and Skills Radar components. |
| **Animations** | Framer Motion | Stable | Employed for smooth page transitions and card hover animations. |
| **Authentication** | Firebase Auth | Web Client SDK | Email/Password login configured, session tracking complete. |
| **Database** | Cloud Firestore | Web Client SDK | Persists roadmaps, lesson completion states, and user notes. |
| **Backend API** | FastAPI | 0.100+ | Asynchronous routes, handles AI service calls and Firebase Admin token validation. |
| **AI Engine** | Google Gemini | 2.0 Flash (`google-generativeai`) | Generates roadmaps, assessments, mentor responses, and mock interviews. |
| **Backend Security** | SlowAPI | Stable | Implements IP/Token-based rate limiting (5/min generate, 20/min chat). |

---

## 📁 Codebase Architecture & File Mapping

Below is the directory map of the codebase as it stands:

```
roadmapai/
├── backend/
│   ├── main.py                    # API entry point, routing, middleware, CORS, rate limiting
│   ├── schemas.py                 # Pydantic v2 schemas for request and response validation
│   ├── services/
│   │   ├── ai_service.py          # Gemini integrations & offline fallback templates
│   │   └── auth.py                # Firebase Admin Token verification helper
│   ├── tests/
│   │   └── test_api.py            # Pytest suite for backend endpoints
│   ├── requirements.txt           # Python dependencies (fastapi, pydantic, slowapi, etc.)
│   └── .env.example               # Template for environment variables (API keys, etc.)
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx             # Root layout (Merriweather/Inter fonts, AuthProvider)
│   │   ├── page.tsx               # Marketing Landing Page with hero and examples
│   │   ├── globals.css            # Tailwind custom colors (paper-50, ink-900, accent)
│   │   ├── error.tsx              # Application error boundary
│   │   ├── loading.tsx            # Global skeleton loader
│   │   ├── generate/page.tsx      # Roadmap form generator + skill assessment quiz flow
│   │   ├── roadmap/[id]/page.tsx  # Dynamic interactive roadmap workspace viewer
│   │   ├── dashboard/page.tsx     # User learning dashboard, calendar, and analytics
│   │   ├── gallery/page.tsx       # Public/Shared roadmaps gallery (stub page)
│   │   └── login/page.tsx         # User authentication form
│   ├── components/
│   │   ├── ui/                    # Base UI buttons, inputs, cards, progress bars
│   │   ├── Navbar.tsx             # Main site header with responsiveness
│   │   ├── MobileNav.tsx          # Mobile bottom navigation bar
│   │   ├── Footer.tsx             # Standard desktop footer
│   │   ├── Hero.tsx               # Main hero section for landing
│   │   ├── Features.tsx           # Feature cards displaying core concepts
│   │   ├── HowItWorks.tsx         # Step-by-step roadmap generation flow guide
│   │   ├── ExampleRoadmap.tsx     # Live interactive roadmap example on landing
│   │   ├── Testimonials.tsx       # User quotes carousel
│   │   ├── ChapterList.tsx        # Roadmap chapters and nested lesson cards
│   │   ├── ResourcePanel.tsx      # Curated resources categorized with badges
│   │   ├── LessonWorkspace.tsx    # 4-tab Workspace (Content, Code Playground, Mock Interview, Notes)
│   │   ├── AIMentor.tsx           # Chat window to communicate with Gemini about lessons
│   │   ├── ProgressCalendar.tsx   # Github-style daily contribution heatmap
│   │   ├── SkillsRadar.tsx        # Mastery percentage radar (built, pending integration)
│   │   └── AuthProvider.tsx       # Context wrapper handling Firebase Auth state
│   ├── lib/
│   │   ├── api.ts                 # Axios client with interceptors for auth headers
│   │   ├── firebase.ts            # Client-side Firebase configuration hook
│   │   └── utils.ts               # Basic helper functions (e.g. cn class merger)
│   ├── store/
│   │   └── index.ts               # Zustand store for state management
│   ├── types/
│   │   └── index.ts               # Unified TypeScript interfaces
│   └── .env.example               # Template for Firebase credentials & backend API URL
│
├── docs/
│   ├── FEATURE_ROADMAP.md         # 10 primary planned features across 4 Sprints
│   └── IMPLEMENTATION_PLAN.md     # Task-by-task execution guide for primary features
│
└── config files / scripts         # setup.ps1, roadmap.ps1/bat, firestore.rules, firebase.json
```

---

## 🚦 Feature Implementation Breakdown

Here is a checklist showing what features are fully completed, partially built, or currently pending:

### 1. AI Core Features
- [x] **Goal-Oriented Roadmap Generation**: Gemini 2.0 Flash generates structured multi-phase paths (Phase -> Chapter -> Lesson) with timelines, hours per day, and customized resources.
- [x] **Fallback Generation System**: Offline pre-built templates serve as backups for popular topics (Full-stack, DSA, AI/ML, Python, System Design) when the Gemini API is offline.
- [x] **Interactive Pre-assessment Quiz**: A 5-question MCQ generator evaluating the user's initial skill level and updating form inputs accordingly.
- [x] **AI Mentor Chat**: Sub-window in the Lesson Workspace. Answers follow-up queries, provides code explanations, and references roadmap lesson contexts.
- [x] **AI Mock Technical Interviews**: Real-time simulated interviews focused on specific lesson topics. Provides score reviews and development suggestions.
- [ ] **AI Chapter Quizzes**: Generate chapter-level test questions (Planned for Sprint 2).

### 2. Learning Workspace & Experience
- [x] **Tabbed Lesson Workspace**: Unified interface allowing users to switch between Lesson Content, Code Playground, Mock Interview, and Notes.
- [x] **Code Playground**: HTML/JS/CSS code editor sandbox with live rendering, allowing quick experimentation without external IDE dependencies.
- [x] **Resource Indexing**: Automatically lists categorized guides, documentations, code references, and videos under lesson sheets.
- [x] **Lesson Notes**: A rich textbox in the workspace that auto-saves student notes to the active database.
- [ ] **Rich Notes Editor Upgrade**: Replace standard textarea with Markdown preview + editing toolbar (Planned for Sprint 3).
- [ ] **Resource Bookmarking**: Add bookmark lists and resource star ratings (Planned for Sprint 4).

### 3. User Analytics & Retention
- [x] **Github-style Progress Heatmap**: Shows daily completion history of lessons in a grid calendar.
- [x] **Habit Tracker Streak**: Tracks consecutive daily check-ins with fire flame animations.
- [x] **Basic Stats Cards**: Displays total lessons completed, active roadmaps, and streak sizes.
- [x] **Skills Radar Chart**: Visualizes phase-by-phase concept mastery (Component built but not yet integrated into dashboard).
- [ ] **Advanced Analytics Widgets**: Add weekly velocity charts, total hours invested estimation, and completion forecast timers (Planned for Sprint 1).
- [ ] **Achievement Badges**: Lock/Unlock notification triggers for milestones (Planned for Sprint 2).

### 4. Integration & Export Features
- [x] **Firebase Cloud Syncing**: Progress, roadmap models, and note files synchronize instantly with Cloud Firestore when authenticated.
- [x] **Guest Local Mode**: Full local functionality. Preserves progress, roadmaps, and notes inside `localStorage` for users without accounts.
- [ ] **Offline-to-Cloud Account Migration**: Migrates local guest progress to authenticated Firestore accounts upon sign-up (Planned for Sprint 3).
- [ ] **PDF Roadmap Exporter**: Client-side document compiler converting roadmaps to detailed printable summaries (Planned for Sprint 3).
- [ ] **iCal Calendar Syncer**: Downloads timeline calendars as `.ics` files for calendar syncs (Planned for Sprint 4).

---

## 📈 Next Steps & Immediate Goals

As outlined in `IMPLEMENTATION_PLAN.md`, the next phase of development centers on completing the following milestones:
1. **Sprint 1 (Dashboard Glow-Up)**: Mount the `SkillsRadar` component onto the dashboard page, add Select dropdowns to toggle between roadmaps, write the weekly velocity chart using Recharts, and calculate total hours/estimated completion times.
2. **Sprint 2 (Active Learning)**: Implement `/api/quiz/chapter` on the backend and build the quiz modal in the lesson workspace. Establish the badge catalog and unlock trigger listeners on the frontend.

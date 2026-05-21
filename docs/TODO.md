# Task List: RoadmapAI Development

> Comprehensive development tracker organized by sprint with acceptance criteria.
> Last updated: **May 2026**

---

## ✅ Completed Work

### UI/UX Overhaul (Done)
- [x] Replace `<textarea>` with Monaco Editor in Code Playground
- [x] Replace basic Notes textarea with TipTap Rich Text Editor
- [x] Add formatting toolbar (Bold, Italic, Lists, Code blocks)
- [x] Implement animated auto-save toast feedback
- [x] Constrain long-form text with `max-w-prose` for readability
- [x] Increase `LessonWorkspace` internal spacing
- [x] Build swappable `MobileSidebar` component (Drawer vs Bottom Sheet)
- [x] Rewrite `Navbar.tsx` as floating glassmorphic pill
- [x] Add Framer Motion profile dropdown menu
- [x] Map all colors to amber/zinc design tokens
- [x] Implement staggered mobile sidebar menu
- [x] Remove hero promotional badges
- [x] Add `border-white/5` section dividers across landing page
- [x] Make all sections `min-h-[100dvh]` for full-viewport experience
- [x] Build mobile accordion for Features section
- [x] Build mobile horizontal carousels for HowItWorks & Testimonials
- [x] Style minute scrollbar indicators on mobile carousels

### Authentication Overhaul (Done)
- [x] Wire Firebase `onAuthStateChanged` in `AuthProvider.tsx`
- [x] Implement route protection (redirect unauthenticated users)
- [x] Connect Google SSO via `signInWithPopup`
- [x] Wire Email/Password sign-up via `createUserWithEmailAndPassword`
- [x] Wire Email/Password sign-in via `signInWithEmailAndPassword`
- [x] Implement secure logout with `signOut(auth)` in Navbar
- [x] Remove legacy mock OTP flow

---

## 🏃 Sprint 1: Dashboard Glow-Up
*Goal: Transform the user dashboard into a rich visual analytics workspace.*

- [ ] **Task 1.1: Skills Radar Integration `[A1]`**
  - [ ] Import `SkillsRadar` component in `dashboard/page.tsx`
  - [ ] Add `selectedRadarRoadmap` state with dropdown toggle
  - [ ] Fetch completed lessons list, convert to `Set<string>` for `SkillsRadar` props
  - [ ] Design 2-column layout section below statistics
  - [ ] Refactor `SkillsRadar.tsx` fill colors to CSS custom properties
  - [ ] Implement empty-state UI for 0 active roadmaps
- [ ] **Task 1.2: Weekly Velocity Chart `[A3a]`**
  - [ ] Create `WeeklyVelocity.tsx` using Recharts `BarChart`
  - [ ] Map ISO week dates from completed lessons, group counts by week
  - [ ] Style current week with accent glow
  - [ ] Mount chart in card container under Skills Radar
- [ ] **Task 1.3: Time Invested Estimator `[A3b]`**
  - [ ] Calculate sum of `duration_minutes` for all completed lessons
  - [ ] Add "Hours Invested" card to dashboard stats
  - [ ] Implement Framer Motion number-counting animation on load
- [ ] **Task 1.4: Completion Forecast `[A3c]`**
  - [ ] Calculate running completion averages over active weeks
  - [ ] Divide remaining lessons by velocity for estimated completion date
  - [ ] Create forecast message panel ("Finish in ~X weeks")
  - [ ] Handle empty states for zero-activity roadmaps

---

## 📘 Sprint 2: Active Learning
*Goal: Build chapter testing and motivational achievement layers.*

- [ ] **Task 2.1: Chapter Quiz Backend `[B1-backend]`**
  - [ ] Define `ChapterQuizRequest` / `ChapterQuizResponse` / `QuizQuestion` in `schemas.py`
  - [ ] Implement async `generate_chapter_quiz` in `ai_service.py`
  - [ ] Add prompt template extracting 5 MCQs from chapter content
  - [ ] Create `/api/quiz/chapter` route with 5/min rate limiting
  - [ ] Build safety fallback mock response
  - [ ] Write integration tests in `test_api.py`
- [ ] **Task 2.2: Chapter Quiz Frontend `[B1-frontend]`**
  - [ ] Create `ChapterQuiz.tsx` with states: `idle`, `loading`, `active`, `results`
  - [ ] Implement quiz-triggering Axios POST call
  - [ ] Design question layout (radio buttons, validation, explanation modals)
  - [ ] Build scoring results board (≥80% pass baseline)
  - [ ] Add 5th "Chapter Quiz" tab in `LessonWorkspace.tsx`
  - [ ] Sync scores to Firestore `users/{uid}/roadmaps/{rid}/quizzes/{chapterId}`
  - [ ] Auto-complete chapter lessons upon quiz pass
- [ ] **Task 2.3: Badge Schema `[A2a]`**
  - [ ] Create `types/badges.ts` with `Badge` interface and 8-badge catalog
  - [ ] Define Firestore schema for earned badges
- [ ] **Task 2.4: Badge Unlock Engine `[A2b]`**
  - [ ] Create `lib/badges.ts` matching stats against badge criteria
  - [ ] Write Firestore fetchers/writers for badge state
  - [ ] Bind listeners on lesson completion to check badge status
- [ ] **Task 2.5: Badge Showcase `[A2c]`**
  - [ ] Build `BadgeShowcase.tsx` (unlocked vs locked display)
  - [ ] Build `BadgeUnlockToast.tsx` (floating achievement card)
  - [ ] Mount on dashboard page

---

## 🔧 Sprint 3: Power Tools
*Goal: PDF export, offline-to-cloud sync, and advanced notes.*

- [ ] **Task 3.1: PDF Export `[C1]`**
  - [ ] Install `jspdf` + `jspdf-autotable`
  - [ ] Build `lib/exportPdf.ts` mapping phases, chapters, and completion checklists
  - [ ] Include curated resources appendix sorted by type
  - [ ] Add "Export PDF" button to `/roadmap/[id]` page header
- [ ] **Task 3.2: Offline-to-Cloud Sync `[C3]`**
  - [ ] Create `lib/syncDetector.ts` scanning `localStorage` for guest sessions
  - [ ] Build `SyncBanner.tsx` prompting logged-in users to import guest data
  - [ ] Add integration hooks in `AuthProvider.tsx` for sync check
  - [ ] Write Firestore merging algorithms preserving progress sets

---

## 💅 Sprint 4: Polish
*Goal: Bookmarks, calendar sync, and light mode.*

- [ ] **Task 4.1: Resource Bookmarking `[B3]`**
  - [ ] Add bookmark toggle + 5-star ratings on `ResourcePanel.tsx`
  - [ ] Sync bookmarks to Firestore `users/{uid}/bookmarked_resources`
  - [ ] Build "Bookmarked Resources" filter on dashboard
- [ ] **Task 4.2: iCal Schedule Export `[C2]`**
  - [ ] Create `lib/exportCalendar.ts` converting study hours to `.ics` events
  - [ ] Map calendar blocks by week lengths
  - [ ] Add "Sync to Calendar" button in roadmap actions
- [ ] **Task 4.3: Light Mode / Theme Toggle `[C4]`**
  - [ ] Write light-mode CSS overrides in `globals.css`
  - [ ] Build functional Sun/Moon toggle in Navbar
  - [ ] Audit all components for dynamic theme support
  - [ ] Persist preference in localStorage

---

## 🔮 Phase 5: AI-First Expansion (50 Features)
*Goal: Integrate advanced AI/ML features. See [FUTURE_FEATURES.md](FUTURE_FEATURES.md) for full details.*

### Phase A — Core Intelligence (Months 1–3)
- [ ] AI Adaptive Spaced Repetition Engine (1)
- [ ] AI Learning Style Calibrator (2)
- [ ] AI Prerequisite Auditor & Gap-Filler (3)
- [ ] AI Goal Refiner & Scope Advisor (6)
- [ ] AI Lesson Summarizer & Cheat-Sheet Generator (10)
- [ ] AI Inline Code Debugger (13)
- [ ] AI Voice-Enabled Mock Interviews (23)
- [ ] AI Flashcard Generator (33)
- [ ] AI Study Planner & Calendar Optimizer (43)

### Phase B — Developer Power Tools (Months 3–6)
- [ ] AI Code Explainer (14)
- [ ] AI Code Challenge Grader (15)
- [ ] AI API Sandbox Generator (19)
- [ ] AI Resume Auditor (24)
- [ ] AI Behavioral Interview Coach (26)
- [ ] AI Portfolio Project Advisor (27)
- [ ] AI Video Content Summarizer (35)
- [ ] AI Resource Relevance Scorer (38)
- [ ] AI Smart Search & Semantic Finder (39)
- [ ] AI Daily Micro-Quiz Recall (45)
- [ ] AI Weekly Progress Review (47)

### Phase C — Advanced Personalization (Months 6–9)
- [ ] AI Cognitive Load Monitor (4)
- [ ] AI Socratic Method Toggle (5)
- [ ] AI Study Mood Assistant (7)
- [ ] AI Translation & Localization (9)
- [ ] AI Difficulty Auto-Scaler (12)
- [ ] AI Refactoring Coach (16)
- [ ] AI Complexity Analyzer (22)
- [ ] AI Technical Writing Assistant (29)
- [ ] AI Interactive Case Study Simulator (37)
- [ ] AI Diagram & Visual Explanation Generator (41)
- [ ] AI Note Enhancer & Auto-Linker (42)
- [ ] AI Trend Analyzer & Roadmap Updater (48)

### Phase D — Career & Social (Months 9–12)
- [ ] AI Career Path Navigator (25)
- [ ] AI Salary Negotiation Simulator (28)
- [ ] AI LinkedIn Optimizer (30)
- [ ] AI Interview Question Predictor (31)
- [ ] AI Certification Path Advisor (32)
- [ ] AI Gamified Quest & Lore Generator (44)
- [ ] AI Peer Study Circle Matchmaker (46)
- [ ] AI Learning Burndown Chart (49)
- [ ] AI Collaborative Roadmap Builder (50)

### Phase E — Frontier Innovation (Months 12–18)
- [ ] AI Knowledge Map Graph Generator (8)
- [ ] AI Multi-Roadmap Cross-Pollination (11)
- [ ] AI System Architecture Designer (17)
- [ ] AI Mock Peer Review Simulator (18)
- [ ] AI Syntax Auto-Complete & Copilot (20)
- [ ] AI Commit Message Writer (21)
- [ ] AI Real-World Analogy Generator (34)
- [ ] AI Audio Lesson Podcast Generator (36)
- [ ] AI Dynamic Custom Textbook Compiler (40)

# Task List: RoadmapAI Development

This file tracks the immediate, mid-term, and future tasks required to complete and expand the **RoadmapAI** platform.

---

## 🏃 Sprint 1: Dashboard Glow-Up
*Goal: Transform the user dashboard into a rich visual analytics workspace.*

- [ ] **Task 1.1: Skills Radar Integration `[A1]`**
  - [ ] Add imports for `SkillsRadar` component in `frontend/app/dashboard/page.tsx`
  - [ ] Initialize `selectedRadarRoadmap` state to track selected roadmap in dropdown.
  - [ ] Fetch the completed lessons list and convert it to a `Set<string>` matching `SkillsRadar` props.
  - [ ] Design and render the 2-column container section below standard statistics.
  - [ ] Import and format the dropdown toggle using the custom UI `Select` component.
  - [ ] Refactor `frontend/components/SkillsRadar.tsx` hardcoded fill colors to use CSS custom properties.
  - [ ] Implement empty-state UI for users with 0 active roadmaps.
- [ ] **Task 1.2: Weekly Velocity Chart `[A3a]`**
  - [ ] Create `frontend/components/WeeklyVelocity.tsx` using Recharts `BarChart`.
  - [ ] Map ISO week dates from completed lessons list, grouping counts by week.
  - [ ] Style the active/current week differently (accent glow).
  - [ ] Mount the chart inside a card container under the Skills Radar.
- [ ] **Task 1.3: Time Invested Estimator `[A3b]`**
  - [ ] Calculate summation of `duration_minutes` for all finished lessons.
  - [ ] Add "Hours Invested" card to dashboard stats.
  - [ ] Implement Framer Motion number-counting transition on dashboard loading.
- [ ] **Task 1.4: Completion Forecast `[A3c]`**
  - [ ] Calculate running completion averages over active weeks.
  - [ ] Divide remaining lesson counts by velocity to estimate completion timelines.
  - [ ] Create forecast message panel (e.g., "Finish in ~X weeks").
  - [ ] Add empty states for zero-activity roadmaps.

---

## 📘 Sprint 2: Active Learning
*Goal: Build chapter testing mechanisms and motivational achievement layers.*

- [ ] **Task 2.1: Chapter Quiz Backend Endpoint `[B1-backend]`**
  - [ ] Define `ChapterQuizRequest` validation model in `backend/schemas.py`.
  - [ ] Define `ChapterQuizResponse` and `QuizQuestion` schemas in `backend/schemas.py`.
  - [ ] Implement async handler `generate_chapter_quiz` in `backend/services/ai_service.py`.
  - [ ] Add prompt template inside `ai_service.py` to extract 5 MCQs covering chapter details.
  - [ ] Create `/api/quiz/chapter` route in `backend/main.py` with 5/min SlowAPI rate limiting.
  - [ ] Build safety fallback mock response for network connection issues.
  - [ ] Write integration test cases in `backend/tests/test_api.py`.
- [ ] **Task 2.2: Chapter Quiz Frontend UI `[B1-frontend]`**
  - [ ] Create `frontend/components/ChapterQuiz.tsx` with states: `idle`, `loading`, `active`, `results`.
  - [ ] Implement quiz-triggering Axios POST call fetching details from backend endpoint.
  - [ ] Design question-answering layout (Radio buttons, choice validation, explanation modals).
  - [ ] Build scoring results board showing pass/fail status (>=80% baseline).
  - [ ] Create 5th workspace tab ("Chapter Quiz") in `frontend/components/LessonWorkspace.tsx`.
  - [ ] Integrate Firestore transaction syncing scores to sub-collection `users/{uid}/roadmaps/{rid}/quizzes/{chapterId}`.
  - [ ] Write auto-completion triggers marking all chapter lessons complete upon quiz pass.
- [ ] **Task 2.3: Badge Schema and Definitions `[A2a]`**
  - [ ] Create `frontend/types/badges.ts` defining `Badge` interface & list catalog of 8 main badges.
  - [ ] Set up Firestore type representations for earned badges.
- [ ] **Task 2.4: Badge Unlock Engine `[A2b]`**
  - [ ] Create helper `frontend/lib/badges.ts` matching user statistics against badge criteria.
  - [ ] Write Firestore fetchers pulling completed badges list and writers inserting unlocked items.
  - [ ] Bind listeners inside lesson completion state changes to check badge status.
- [ ] **Task 2.5: Badge Showcase Component `[A2c]`**
  - [ ] Build `frontend/components/BadgeShowcase.tsx` rendering unlocked vs locked badges.
  - [ ] Build `frontend/components/BadgeUnlockToast.tsx` displaying floating achievement cards.
  - [ ] Mount Showcase component on the dashboard page.

---

## 🔧 Sprint 3: Power Tools
*Goal: Enable notes editing enhancements, local storage migration, and PDF compiler tools.*

- [ ] **Task 3.1: Rich Markdown Notes Editor `[B2]`**
  - [ ] Install package `react-textarea-autosize`.
  - [ ] Create `frontend/components/NotesToolbar.tsx` with Markdown hotkeys (Bold, Italic, Header, Links).
  - [ ] Integrate split-pane layout (Markdown textarea left, `ReactMarkdown` compiler preview right) inside workspace notes tab.
  - [ ] Implement search field scanning text patterns across all notes of active roadmaps.
  - [ ] Write export utility downloading notes as `.md` file buffers.
- [ ] **Task 3.2: PDF Export utility `[C1]`**
  - [ ] Install packages `jspdf` and `jspdf-autotable`.
  - [ ] Build client generator `frontend/lib/exportPdf.ts` mapping roadmap phases, chapters, and completion checklists.
  - [ ] Include curated resources appendix sorted by media type.
  - [ ] Add "Export PDF" CTA buttons to the main header of the `/roadmap/[id]` page.
- [ ] **Task 3.3: Offline-to-Cloud Sync `[C3]`**
  - [ ] Create `frontend/lib/syncDetector.ts` scanning `localStorage` keys for guest sessions.
  - [ ] Build `frontend/components/SyncBanner.tsx` prompting logged-in users to import guest details.
  - [ ] Add integration hooks inside `AuthProvider.tsx` to toggle sync check flags.
  - [ ] Write Firestore merging algorithms preserving and grouping progress sets.

---

## 💅 Sprint 4: Polish
*Goal: Implement bookmarks, calendar syncing, and full dark-theme settings.*

- [ ] **Task 4.1: Resource Bookmarking & Rating `[B3]`**
  - [ ] Add 5-star ranking buttons and bookmark tags on elements in `ResourcePanel.tsx`.
  - [ ] Sync bookmark indices to Firestore sub-collection `users/{uid}/bookmarked_resources`.
  - [ ] Design "Bookmarked Resources" list filter component in the dashboard layout.
- [ ] **Task 4.2: iCal Schedule Export `[C2]`**
  - [ ] Create calendar compiler `frontend/lib/exportCalendar.ts` converting study hours to `.ics` events.
  - [ ] Write iCal task mapper offsetting calendar blocks by week lengths.
  - [ ] Add "Sync to Calendar" CTA buttons in `/roadmap/[id]` actions header.
- [ ] **Task 4.3: Dark Mode Accessibility `[C4]`**
  - [ ] Write `.dark` class overrides in `frontend/app/globals.css` with appropriate palettes.
  - [ ] Build Navbar Sun/Moon toggle buttons modifying HTML document node classes.
  - [ ] Audit all components (Progress Calendar, Skills Radar, Lesson Workspace) to support dynamic themes.

---

## 🔮 Phase 5: Future AI features (Expansion)
*Goal: Integrate advanced AI features to enhance personalization, coding support, and career preparation.*

### AI Personalization & Tutoring
- [ ] Implement **AI Lesson Summarizer & Cheat-Sheet Generator** (1)
- [ ] Build **AI Adaptive Spaced Repetition Scheduler** (2)
- [ ] Add **AI Learning Style Calibrator** (3)
- [ ] Create **AI Prerequisite Auditor & Gap-Filler** (4)
- [ ] Implement **AI Cognitive Load Monitor** (5)
- [ ] Add **AI Socratic Method Toggle** in chat settings (6)
- [ ] Set up **AI Translation & Cultural Localization Tutor** (7)
- [ ] Integrate **AI Goal Refiner & Scope Advisor** (8)
- [ ] Implement **AI Study Mood Assistant** (9)
- [ ] Create **AI Knowledge Map Graph Generator** (10)

### AI Code Playground & Technical Enhancements
- [ ] Build **AI Inline Code Sandbox Assistant & Debugger** in editor (11)
- [ ] Integrate **AI Code Explainer & Code-to-English Translator** (12)
- [ ] Add **AI Automated Code Challenge Grader** (13)
- [ ] Integrate **AI Syntax Auto-Complete & Copilot** (14)
- [ ] Implement **AI Refactoring Coach** (15)
- [ ] Build **AI System Architecture Designer** (16)
- [ ] Add **AI Mock Peer Review Simulator** (17)
- [ ] Set up **AI API Sandbox Generator** (18)

### AI Mock Interviews & Career Advising
- [ ] Implement **AI Voice-Enabled Mock Interviews** (19)
- [ ] Build **AI Resume Auditor & Roadmap Matcher** (20)
- [ ] Integrate **AI Career Path Navigator & Salary Advisor** (21)
- [ ] Create **AI Behavioral Interview Coach (STAR Method)** (22)
- [ ] Design **AI Portfolio Project Advisor** (23)
- [ ] Add **AI Salary Negotiation Simulator** (24)
- [ ] Set up **AI Technical Writing Assistant** (25)
- [ ] Integrate **AI LinkedIn Profile Optimizer** (26)

### AI-Enhanced Content & Study Materials
- [ ] Build **AI Flashcard Generator (Anki-style)** (27)
- [ ] Add **AI Real-World Analogy Generator** (28)
- [ ] Implement **AI Subtitle & Video Content Summarizer** (29)
- [ ] Set up **AI Audio Lesson Podcast Generator** (30)
- [ ] Create **AI Interactive Case Study Simulator** (31)
- [ ] Integrate **AI Resource Relevance Scorer** (32)
- [ ] Build **AI Smart Search & Semantic Finder** (33)
- [ ] Add **AI Dynamic Custom Textbooks** compiler (34)

### Gamification & Intelligent Scheduling
- [ ] Implement **AI Study Planner Scheduler & Optimizer** (35)
- [ ] Create **AI Gamified Quest & Lore Generator** (36)
- [ ] Add **AI Daily Micro-Quiz Recall Test** (37)
- [ ] Build **AI Peer Study Circle Matchmaker** (38)
- [ ] Implement **AI Weekly Goal Progress Reviews** (39)
- [ ] Set up **AI Trend Analyzer & Roadmap Updater** (40)

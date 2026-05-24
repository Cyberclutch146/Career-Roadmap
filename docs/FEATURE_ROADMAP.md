# Career Roadmap — Feature Expansion Plan

> Detailed feature specifications and implementation plan, grounded in actual codebase analysis.  
> Social/community features excluded per project scope.

---

## Table of Contents

- [Feature Inventory](#feature-inventory)
  - [Category A — Gamification & Progress Visualization](#-category-a--gamification--progress-visualization)
  - [Category B — Enhanced Learning Experience](#-category-b--enhanced-learning-experience)
  - [Category C — Infrastructure & Export](#-category-c--infrastructure--export)
- [Implementation Priority Matrix](#implementation-priority-matrix)
- [Recommended Implementation Order](#recommended-implementation-order)
- [File Change Map](#file-change-map)

---

## Feature Inventory

### 🟢 Category A — Gamification & Progress Visualization

#### A1. Skills Radar Dashboard Integration

**What exists:** `SkillsRadar.tsx` (91 lines) — a complete Recharts radar chart that accepts a `Roadmap` + `completedLessons: Set<string>` and renders per-phase mastery percentages. It is **not imported anywhere**. It uses the `Card` UI component and `truncateText` utility.

**What to build:**

- Import `SkillsRadar` into `/dashboard/page.tsx` and render it in a new 2-column grid below the stat cards
- Fetch `completedLessons` per roadmap (already fetched as `progressSnapshot` in the dashboard `useEffect`) and pass it down
- Add a roadmap selector dropdown so the user can toggle which roadmap's radar is displayed
- Add dark-mode-aware colors (currently hardcoded `#6366f1`, `#e2e8f0`, `#64748b`)

**Estimated effort:** Small (2–3 hours)

---

#### A2. Achievement / Badge System

**What exists:** Nothing. No badge schema, no unlock logic, no UI.

**What to build:**

| Badge             | Unlock Condition                        | Icon              |
| ----------------- | --------------------------------------- | ----------------- |
| 🔥 Streak Starter | 7-day streak                            | `Flame`           |
| 🔥 Streak Master  | 30-day streak                           | `Flame` (gold)    |
| 📘 First Steps    | Complete 1 lesson                       | `BookOpen`        |
| 🏆 Roadmap Complete | Finish all lessons in a roadmap       | `Trophy`          |
| 🎯 Phase Conqueror | Complete an entire phase               | `Target`          |
| 🧠 Quiz Ace       | Score 90%+ on assessment                | `Brain`           |
| 💡 Interview Pro   | Score 90/100 on mock interview         | `Sparkles`        |
| 📝 Note Taker     | Write 10+ notes                         | `FileText`        |

**Implementation:**

- **Backend:** New endpoint `POST /api/badges/check` that receives user stats and returns newly unlocked badges
- **Frontend:**
  - New `types/badges.ts` — `Badge` interface with `id`, `title`, `description`, `icon`, `unlockedAt`, `tier`
  - New component `BadgeShowcase.tsx` — grid of earned badges with locked/unlocked states and unlock animation
  - New Firestore sub-collection: `users/{uid}/badges/{badgeId}`
  - Badge unlock check runs client-side after every lesson completion, streak update, or assessment result
  - Toast notification (via a small `BadgeUnlockToast.tsx`) on first unlock with confetti animation

**Estimated effort:** Medium (6–8 hours)

---

#### A3. Enhanced Progress Analytics Dashboard Widget

**What exists:** Dashboard shows 3 stat cards (Active Roadmaps, Lessons Completed, Day Streak) + ProgressCalendar heatmap.

**What to build:**

- **Weekly Velocity Chart:** A small sparkline or bar chart showing lessons completed per week (last 8 weeks). Data is already available in `completions[]` — just group by ISO week.
- **Time Invested Estimator:** Sum `duration_minutes` of all completed lessons → display as "X hours invested" card
- **Completion Forecast:** Based on current weekly velocity, estimate when the user will finish their active roadmap. Display as "At your current pace, you'll finish in ~Y weeks"

**Estimated effort:** Medium (4–5 hours)

---

### 🔵 Category B — Enhanced Learning Experience

#### B1. AI-Powered End-of-Chapter Quizzes

**What exists:**

- Backend has `POST /api/assessment/generate` (in `main.py:115-125`) — calls `ai_service.generate_assessment_quiz(goal, skill_level)` which returns 5 MCQ questions with `question`, `options`, `answer_index`, `explanation`
- Frontend has an assessment flow in the `/generate` page (pre-roadmap skill check), but **no quiz inside the lesson/chapter flow**
- `LessonWorkspace.tsx` has 4 tabs: Content, Playground, AI Mock Interview, Notes

**What to build:**

- **New tab in LessonWorkspace:** "Chapter Quiz" (5th tab, icon: `ClipboardCheck`)
- The quiz generates when the user opens the tab, scoped to the **current chapter** (not the whole roadmap)
- New backend endpoint: `POST /api/quiz/chapter` accepting `{ goal, chapter_title, chapter_description, lessons: string[] }` → returns 5 MCQs specific to that chapter's content
- Frontend quiz UI:
  - Progress indicator (Question 1/5)
  - Radio-button options with instant feedback on selection (green/red highlight + explanation)
  - Running score tracker
  - Final results card with score, pass/fail status, and a "Retry" button
  - If score ≥ 80%: auto-mark chapter as complete + trigger badge check
- **Persist quiz results** to Firestore: `users/{uid}/roadmaps/{rid}/quizzes/{chapterId}` with `{ score, attempts, lastAttempt }`

**Estimated effort:** Large (8–10 hours)

---

#### B2. Rich Notes Workspace Upgrade

**What exists:** `LessonWorkspace.tsx` lines 668-708 — a plain `<textarea>` with auto-save to Firestore (`users/{uid}/roadmaps/{rid}/notes/{lessonId}`). Shows saving/saved/error status. Purely plaintext.

**What to build:**

- Replace the `<textarea>` with a lightweight Markdown editor (use `react-markdown` which is already installed for the AI Mentor component, + add `react-textarea-autosize` for the editor)
- **Split-pane layout:** Left = Markdown editor, Right = live preview (rendered via `ReactMarkdown`)
- **Toolbar:** Bold, Italic, Code, Heading, List, Link buttons that insert Markdown syntax at cursor
- **Note search:** Add a search bar in the Notes tab header that filters across all notes for the current roadmap (fetch all notes from the `notes` sub-collection)
- **Export notes:** "Download as .md" button that creates a downloadable file
- **Note count on dashboard:** Show total notes count in the dashboard analytics section

**Estimated effort:** Medium (5–6 hours)

---

#### B3. Resource Bookmarking & Rating

**What exists:** `ResourcePanel.tsx` (109 lines) — renders resources by type with title, description, and type badge. `LessonWorkspace.tsx` has a bookmark toggle for **lessons** (line 293-307), stored as a boolean. Resources themselves have no bookmark/rating mechanism.

**What to build:**

- Add a ⭐ rating widget (1–5 stars) next to each resource link in the Content tab
- Add a 🔖 bookmark icon per resource
- **Persist:** Firestore sub-collection `users/{uid}/bookmarked_resources/{resourceUrl_hash}` with `{ url, title, type, rating, bookmarkedAt, roadmapId, lessonId }`
- **New dashboard section:** "Bookmarked Resources" — a filterable list of all saved resources across all roadmaps, sortable by rating, type, or date
- **Duplicate detection:** When rendering resources, check if the user has already bookmarked the URL and show the filled bookmark icon

**Estimated effort:** Medium (5–6 hours)

---

### 🟡 Category C — Infrastructure & Export

#### C1. Roadmap Export to PDF

**What exists:** No export functionality. Roadmap data lives in Firestore and is rendered in the `/roadmap/[id]` page.

**What to build:**

- **Client-side PDF generation** using `jspdf` + `jspdf-autotable` (no server needed)
- Export button on the `/roadmap/[id]` page header
- PDF contents:
  - Title page with roadmap goal, skill level, timeline, creation date
  - Table of Contents listing all phases → chapters → lessons
  - Per-phase section with chapter titles, lesson names, completion status (✅/⬜), duration
  - Resources appendix: all unique resources grouped by type
  - Progress summary: X/Y lessons completed, estimated hours remaining
- **Styling:** Clean, professional layout with the app's accent color for headers

**Estimated effort:** Medium (5–6 hours)

---

#### C2. Calendar Sync (iCal Export)

**What exists:** `timeline_weeks` array in the generated roadmap with `week`, `focus`, `tasks[]`. Not currently rendered anywhere useful for scheduling.

**What to build:**

- "Sync to Calendar" button on the roadmap page
- Generate a `.ics` file with:
  - One event per week spanning the roadmap timeline
  - Event title: week focus area
  - Event description: tasks list + relevant lesson titles
  - Duration: based on `daily_hours` config
- Start date = roadmap `created_at`, then each week's event is offset accordingly
- Browser triggers a download of the `.ics` file (works with Google Calendar, Apple Calendar, Outlook)

**Estimated effort:** Small (2–3 hours)

---

#### C3. Offline-to-Cloud Sync Banner

**What exists:** Guest users store progress in `localStorage` with keys like `progress_dates_{roadmapId}`, `roadmap_{id}`. The dashboard reads both Firestore and localStorage. There is **no migration path** — if a guest signs up, their localStorage progress is lost.

**What to build:**

- **Sync detection:** On login, check if `localStorage` contains `progress_dates_*` or `roadmap_*` keys
- **Sync banner UI:** If guest data is found post-login, show a persistent banner: "We found X roadmaps and Y completed lessons from your guest session. Import them?"
- **Import logic:** On "Yes, import":
  1. Read all `roadmap_*` entries from localStorage
  2. Write each to Firestore under `users/{uid}/roadmaps/{id}`
  3. Read all `progress_dates_*` entries and write to Firestore progress sub-collections
  4. Read all `note_*` entries and write to Firestore notes sub-collections
  5. Clear localStorage keys after successful sync
  6. Show success toast with count of imported items
- **Edge case:** If a roadmap with the same ID already exists in Firestore, merge progress (union of completed lessons)

**Estimated effort:** Medium (4–5 hours)

---

#### C4. Dark Mode Polish

**What exists:** The app has CSS custom properties in `globals.css` and uses Tailwind with custom colors (`paper-*`, `ink-*`, `accent`). No explicit dark mode toggle or `dark:` variants are systematically applied.

**What to build:**

- Add a dark mode toggle in the Navbar (sun/moon icon)
- Store preference in localStorage + respect `prefers-color-scheme` system setting
- Audit and add `dark:` class variants to:
  - `ProgressCalendar.tsx` — heatmap cells already have a `dark:bg-paper-800` class (line 70), but other elements don't
  - `SkillsRadar.tsx` — hardcoded colors need CSS variable equivalents
  - `LessonWorkspace.tsx` — white backgrounds, paper borders
  - All `Card` components, form inputs, and modal overlays
- Update `globals.css` with a `[data-theme="dark"]` or `.dark` root class that remaps the custom properties

**Estimated effort:** Medium-Large (6–8 hours)

---

## Implementation Priority Matrix

| Priority | Feature                     | Impact                | Effort          | Dependencies              |
| -------- | --------------------------- | --------------------- | --------------- | ------------------------- |
| **P0**   | A1. Skills Radar Integration | High visual wow      | Small (2–3h)    | None — component exists   |
| **P0**   | A3. Progress Analytics       | High dashboard value | Medium (4–5h)   | Uses existing completion data |
| **P1**   | B1. Chapter Quizzes          | High learning retention | Large (8–10h) | New backend endpoint      |
| **P1**   | A2. Badge System             | High engagement/retention | Medium (6–8h) | Needs quiz + streak data |
| **P2**   | B2. Rich Notes Upgrade       | Medium learning value | Medium (5–6h)  | react-markdown already installed |
| **P2**   | C1. PDF Export               | Medium utility        | Medium (5–6h)   | New dependency: jspdf     |
| **P2**   | C3. Offline Sync             | Medium trust/retention | Medium (4–5h)  | Auth system               |
| **P3**   | B3. Resource Bookmarking     | Nice to have          | Medium (5–6h)   | Firestore schema          |
| **P3**   | C2. Calendar Sync            | Nice to have          | Small (2–3h)    | None                      |
| **P3**   | C4. Dark Mode                | Polish                | Medium-Large (6–8h) | All other features first |

---

## Recommended Implementation Order

### Sprint 1 — "Dashboard Glow-Up" ✅ [COMPLETED]

```
A1  →  Skills Radar Integration (Completed)
A3  →  Progress Analytics (velocity chart + time invested + forecast - Completed)
```

**Why first:** Instant visual upgrade, zero new dependencies, uses existing data. Makes the dashboard feel premium.

### Sprint 2 — "Active Learning" (14–18 hours)

```
B1  →  Chapter Quizzes (new backend endpoint + quiz UI in LessonWorkspace)
A2  →  Badge System (depends on quiz scores + streak data)
```

**Why second:** The biggest user engagement win. Quizzes validate learning, badges reward consistency. Both create feedback loops.

### Sprint 3 — "Power Tools" (12–15 hours)

```
B2  →  Rich Notes Upgrade (Markdown editor + search + export)
C1  →  PDF Export (client-side generation)
C3  →  Offline-to-Cloud Sync (guest → authenticated migration)
```

**Why third:** Quality-of-life features that increase stickiness and reduce churn.

### Sprint 4 — "Polish" (8–11 hours)

```
B3  →  Resource Bookmarking
C2  →  Calendar Sync
C4  →  Dark Mode (✅ Partially Completed - LessonWorkspace & UI converted)
```

**Why last:** These are polish features. Important, but the app is already strong without them.

---

## File Change Map

| Feature | Frontend Files                                            | Backend Files                        | New Dependencies         |
| ------- | --------------------------------------------------------- | ------------------------------------ | ------------------------ |
| A1      | `dashboard/page.tsx`                                      | —                                    | —                        |
| A2      | `BadgeShowcase.tsx`, `BadgeUnlockToast.tsx`, `types/badges.ts` | `main.py`, `schemas.py`        | —                        |
| A3      | `dashboard/page.tsx`, `WeeklyVelocity.tsx`                | —                                    | `recharts` (already installed) |
| B1      | `LessonWorkspace.tsx`, `ChapterQuiz.tsx`                  | `main.py`, `ai_service.py`, `schemas.py` | —                  |
| B2      | `LessonWorkspace.tsx`                                     | —                                    | `react-textarea-autosize` |
| B3      | `LessonWorkspace.tsx`, `ResourcePanel.tsx`, `dashboard/page.tsx` | —                             | —                        |
| C1      | `roadmap/[id]/page.tsx`                                   | —                                    | `jspdf`, `jspdf-autotable` |
| C2      | `roadmap/[id]/page.tsx`                                   | —                                    | —                        |
| C3      | `AuthProvider.tsx`, `SyncBanner.tsx`                       | —                                    | —                        |
| C4      | `globals.css`, `Navbar.tsx`, all components               | —                                    | —                        |

---

> **Total estimated effort across all sprints: ~40–52 hours**
>
> Ready to start? Begin with **Sprint 1 (A1 + A3)** — it's the fastest path to a noticeably better product.

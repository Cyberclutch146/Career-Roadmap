# RoadmapAI — Implementation Plan

> Step-by-step execution guide for the Feature Roadmap.  
> Each task has file-level targets, code-level instructions, acceptance criteria, and dependency notes.  
> Reference: [`FEATURE_ROADMAP.md`](FEATURE_ROADMAP.md) for full feature specs.

---

## Sprint 1 — "Dashboard Glow-Up"

**Goal:** Transform the dashboard from a basic stats page into a visually rich analytics hub.  
**Estimated effort:** 6–8 hours  
**Dependencies:** None — all data sources already exist.

---

### Task 1.1 · Skills Radar Dashboard Integration `[A1]`

**Priority:** P0 · **Effort:** 2–3 hours · **Risk:** Low

#### Context

`SkillsRadar.tsx` is a **complete, working component** (91 lines) that renders a Recharts `RadarChart` showing per-phase mastery. It accepts `roadmap: Roadmap` and `completedLessons: Set<string>` props. It is **not imported anywhere** in the app.

#### Steps

| # | Action | File | Details |
|---|---|---|---|
| 1 | Import `SkillsRadar` | `frontend/app/dashboard/page.tsx` | Add import at top of file |
| 2 | Add roadmap selector state | `frontend/app/dashboard/page.tsx` | `const [selectedRadarRoadmap, setSelectedRadarRoadmap] = useState<Roadmap \| null>(null)` — default to first roadmap in `roadmaps[]` |
| 3 | Build `completedLessons` set | `frontend/app/dashboard/page.tsx` | Already available as part of the progress snapshot logic. Map the `progressSnapshot` for the selected roadmap into a `Set<string>` |
| 4 | Render radar section | `frontend/app/dashboard/page.tsx` | Add below the stat cards grid. Use a 2-column layout: left = radar chart, right = roadmap selector dropdown + legend |
| 5 | Add dropdown UI | `frontend/app/dashboard/page.tsx` | Use existing `Select` component from `components/ui/` to let users toggle between roadmaps |
| 6 | Dark mode colors | `frontend/components/SkillsRadar.tsx` | Replace hardcoded `#6366f1`, `#e2e8f0`, `#64748b` with CSS custom properties or conditionally switch based on theme |
| 7 | Empty state | `frontend/app/dashboard/page.tsx` | If user has 0 roadmaps, show a "Generate your first roadmap to see your skills radar" message with a CTA button |

#### Acceptance Criteria

- [ ] Radar chart renders on dashboard with real completion data
- [ ] Dropdown switches between roadmaps and radar updates
- [ ] Empty state shows when no roadmaps exist
- [ ] Chart is responsive on mobile (stacks vertically)

---

### Task 1.2 · Weekly Velocity Chart `[A3a]`

**Priority:** P0 · **Effort:** 1.5–2 hours · **Risk:** Low

#### Context

The dashboard already fetches `completions[]` — an array of date strings when lessons were completed. This data just needs to be grouped by ISO week and rendered.

#### Steps

| # | Action | File | Details |
|---|---|---|---|
| 1 | Create `WeeklyVelocity.tsx` | `frontend/components/WeeklyVelocity.tsx` | New component. Accept `completions: string[]` prop |
| 2 | Group by ISO week | `WeeklyVelocity.tsx` | Parse dates, group into last 8 weeks. Use `Intl.DateTimeFormat` or simple date math. Output: `{ week: string, count: number }[]` |
| 3 | Render bar chart | `WeeklyVelocity.tsx` | Use Recharts `BarChart` (already installed). Bars = lessons/week. X-axis = week labels. Accent color fill |
| 4 | Import and render | `frontend/app/dashboard/page.tsx` | Place below the Skills Radar section in a `Card` wrapper |
| 5 | Responsive sizing | `WeeklyVelocity.tsx` | Use `ResponsiveContainer` from Recharts for fluid width |

#### Acceptance Criteria

- [ ] Bar chart shows 8 weeks of lesson velocity
- [ ] Current week is highlighted differently
- [ ] Shows "No activity yet" if completions array is empty

---

### Task 1.3 · Time Invested Estimator `[A3b]`

**Priority:** P0 · **Effort:** 1 hour · **Risk:** Low

#### Steps

| # | Action | File | Details |
|---|---|---|---|
| 1 | Calculate total time | `frontend/app/dashboard/page.tsx` | Iterate all completed lessons across all roadmaps. Sum `duration_minutes` field from each lesson. Convert to hours |
| 2 | Add stat card | `frontend/app/dashboard/page.tsx` | Add a 4th stat card: "Hours Invested" with a `Clock` icon. Display as `Xh Ym` format |
| 3 | Animate number | `frontend/app/dashboard/page.tsx` | Use Framer Motion `useMotionValue` + `useTransform` for a smooth count-up animation on load |

#### Acceptance Criteria

- [ ] New stat card shows total hours invested
- [ ] Number animates on page load
- [ ] Shows "0h" gracefully when no lessons completed

---

### Task 1.4 · Completion Forecast `[A3c]`

**Priority:** P0 · **Effort:** 1 hour · **Risk:** Low

#### Steps

| # | Action | File | Details |
|---|---|---|---|
| 1 | Calculate weekly average | `frontend/app/dashboard/page.tsx` | Use the same weekly velocity data from Task 1.2. Average lessons/week over last 4 active weeks |
| 2 | Calculate remaining | `frontend/app/dashboard/page.tsx` | For the selected roadmap: `totalLessons - completedLessons = remaining` |
| 3 | Estimate weeks | `frontend/app/dashboard/page.tsx` | `remaining / avgPerWeek = estimatedWeeks`. Round up |
| 4 | Render forecast card | `frontend/app/dashboard/page.tsx` | Display as: "At your current pace, you'll finish in **~X weeks**". Use `CalendarDays` icon. Show "Keep going!" if < 2 weeks |
| 5 | Edge cases | `frontend/app/dashboard/page.tsx` | If velocity = 0: "Start completing lessons to see your forecast". If roadmap complete: "🎉 You've completed this roadmap!" |

#### Acceptance Criteria

- [ ] Forecast card shows estimated completion date
- [ ] Handles zero-velocity and completed-roadmap edge cases
- [ ] Updates when roadmap selector changes

---

## Sprint 2 — "Active Learning"

**Goal:** Add knowledge validation and reward loops to drive engagement.  
**Estimated effort:** 14–18 hours  
**Dependencies:** Sprint 1 should be complete (badge system references dashboard analytics).

---

### Task 2.1 · Chapter Quiz Backend Endpoint `[B1-backend]`

**Priority:** P1 · **Effort:** 3–4 hours · **Risk:** Medium (AI prompt engineering)

#### Context

The existing `ai_service.py` has `generate_assessment_quiz()` which generates 5 MCQs for a goal + skill level. We need a **chapter-scoped** variant.

#### Steps

| # | Action | File | Details |
|---|---|---|---|
| 1 | Add request schema | `backend/schemas.py` | New `ChapterQuizRequest(BaseModel)`: `goal: str`, `chapter_title: str`, `chapter_description: str`, `lesson_titles: list[str]`, `skill_level: str` |
| 2 | Add response schema | `backend/schemas.py` | New `ChapterQuizResponse(BaseModel)`: `questions: list[QuizQuestion]`. Reuse existing `QuizQuestion` model or create: `question: str`, `options: list[str]`, `answer_index: int`, `explanation: str` |
| 3 | Add AI method | `backend/services/ai_service.py` | New method `generate_chapter_quiz(goal, chapter_title, chapter_description, lesson_titles, skill_level)`. Prompt: "Generate 5 MCQ questions about {chapter_title} covering these lessons: {lessons}. The student's goal is {goal} at {skill_level} level." |
| 4 | Add endpoint | `backend/main.py` | `POST /api/quiz/chapter` with rate limit 5/min. Call `ai_service.generate_chapter_quiz()` |
| 5 | Add fallback | `backend/services/ai_service.py` | If Gemini fails, return generic questions like "Which of these is related to {chapter_title}?" with lesson titles as options |
| 6 | Test | `backend/tests/test_api.py` | Add test for `/api/quiz/chapter` — validate response structure, 422 on bad input |

#### Acceptance Criteria

- [ ] Endpoint returns 5 MCQ questions with options, answer_index, explanation
- [ ] Questions are contextual to the chapter content
- [ ] Fallback works when Gemini is unavailable
- [ ] Rate limited to 5/min

---

### Task 2.2 · Chapter Quiz Frontend UI `[B1-frontend]`

**Priority:** P1 · **Effort:** 5–6 hours · **Risk:** Medium

#### Steps

| # | Action | File | Details |
|---|---|---|---|
| 1 | Create `ChapterQuiz.tsx` | `frontend/components/ChapterQuiz.tsx` | New component. Props: `roadmap: Roadmap`, `chapter: Chapter`, `onComplete: (score: number) => void` |
| 2 | States | `ChapterQuiz.tsx` | `idle` → `loading` → `active` → `results`. Track `currentQuestion`, `selectedAnswer`, `score`, `answers[]` |
| 3 | Quiz generation | `ChapterQuiz.tsx` | On mount or "Start Quiz" click: `POST /api/quiz/chapter` with chapter data. Show loading spinner with "Generating questions..." |
| 4 | Question UI | `ChapterQuiz.tsx` | Progress bar (1/5), question text, 4 radio-button options in `Card` containers. On select: highlight green (correct) or red (incorrect) + show explanation. "Next" button appears |
| 5 | Results screen | `ChapterQuiz.tsx` | Final card: score as fraction + percentage, pass/fail badge (≥80% = pass), individual question review, "Retry" button |
| 6 | Add 5th tab | `frontend/components/LessonWorkspace.tsx` | Add "Chapter Quiz" tab with `ClipboardCheck` icon. Render `<ChapterQuiz />` inside |
| 7 | Persist results | `ChapterQuiz.tsx` | On quiz complete, save to Firestore `users/{uid}/roadmaps/{rid}/quizzes/{chapterId}`: `{ score, totalQuestions, attempts, lastAttemptAt }`. Merge on retry (increment attempts, update score if higher) |
| 8 | Auto-complete chapter | `ChapterQuiz.tsx` | If score ≥ 80%, call the existing `markLessonComplete` for all lessons in the chapter |

#### Acceptance Criteria

- [ ] Quiz tab appears in LessonWorkspace
- [ ] 5 questions render with radio options
- [ ] Instant feedback (green/red) on answer selection
- [ ] Results screen shows score + pass/fail
- [ ] Quiz results persist to Firestore
- [ ] Retry increments attempt count
- [ ] ≥80% auto-completes chapter lessons

---

### Task 2.3 · Badge Type Definitions `[A2a]`

**Priority:** P1 · **Effort:** 1 hour · **Risk:** Low

#### Steps

| # | Action | File | Details |
|---|---|---|---|
| 1 | Create types file | `frontend/types/badges.ts` | Define `Badge` interface: `id: string`, `title: string`, `description: string`, `icon: string`, `tier: 'bronze' \| 'silver' \| 'gold'`, `unlockedAt: string \| null`, `category: 'streak' \| 'learning' \| 'assessment' \| 'mastery'` |
| 2 | Define badge catalog | `frontend/types/badges.ts` | Export `BADGE_CATALOG: Badge[]` — all 8 badges from the feature roadmap with their unlock conditions as a `condition` field |
| 3 | Add Firestore types | `frontend/types/badges.ts` | `UserBadge` interface for Firestore: `badgeId: string`, `unlockedAt: Timestamp`, `metadata: Record<string, any>` (e.g., streak count, quiz score) |

---

### Task 2.4 · Badge Unlock Engine `[A2b]`

**Priority:** P1 · **Effort:** 2–3 hours · **Risk:** Medium

#### Steps

| # | Action | File | Details |
|---|---|---|---|
| 1 | Create badge service | `frontend/lib/badges.ts` | New file. Export `checkBadgeUnlocks(stats: UserStats): Badge[]` — compares user stats against badge catalog conditions, returns newly unlockable badges |
| 2 | Define `UserStats` | `frontend/lib/badges.ts` | `{ totalLessonsCompleted, currentStreak, completedPhases: string[], completedRoadmaps: string[], totalNotes, highestQuizScore, highestInterviewScore }` |
| 3 | Read existing badges | `frontend/lib/badges.ts` | `getUserBadges(userId: string): Promise<Set<string>>` — reads from Firestore `users/{uid}/badges/` |
| 4 | Write new badges | `frontend/lib/badges.ts` | `unlockBadge(userId: string, badge: Badge, metadata: object): Promise<void>` — writes to Firestore |
| 5 | Integration hooks | `frontend/app/dashboard/page.tsx`, `LessonWorkspace.tsx` | After lesson completion, streak update, or quiz result: call `checkBadgeUnlocks()`, compare with existing, write new ones, trigger toast |

---

### Task 2.5 · Badge Showcase UI `[A2c]`

**Priority:** P1 · **Effort:** 2–3 hours · **Risk:** Low

#### Steps

| # | Action | File | Details |
|---|---|---|---|
| 1 | Create `BadgeShowcase.tsx` | `frontend/components/BadgeShowcase.tsx` | Grid of badge cards. Locked = grayscale + lock overlay. Unlocked = full color + glow animation + unlock date |
| 2 | Create `BadgeUnlockToast.tsx` | `frontend/components/BadgeUnlockToast.tsx` | Animated toast notification. Badge icon + title + "Achievement Unlocked!" text. Confetti particles (CSS animation, no library needed) |
| 3 | Render on dashboard | `frontend/app/dashboard/page.tsx` | Add `<BadgeShowcase />` section below the analytics widgets |
| 4 | Trigger toast | `frontend/lib/badges.ts` | Use Zustand store to queue toast notifications. `BadgeUnlockToast` reads from the queue and displays |

#### Acceptance Criteria (Full Badge System)

- [ ] All 8 badges defined with conditions
- [ ] Badges unlock correctly based on user actions
- [ ] Showcase renders on dashboard with locked/unlocked states
- [ ] Toast appears on first unlock with animation
- [ ] Badge state persists to Firestore

---

## Sprint 3 — "Power Tools"

**Goal:** Add productivity features that make the platform indispensable.  
**Estimated effort:** 12–15 hours  
**Dependencies:** None — can run in parallel with Sprint 2 if desired.

---

### Task 3.1 · Rich Markdown Notes Editor `[B2]`

**Priority:** P2 · **Effort:** 5–6 hours · **Risk:** Low

#### Steps

| # | Action | File | Details |
|---|---|---|---|
| 1 | Install dependency | Terminal | `cd frontend && npm install react-textarea-autosize` |
| 2 | Build toolbar component | `frontend/components/NotesToolbar.tsx` | New component. Buttons: Bold (`**`), Italic (`*`), Code (`` ` ``), Heading (`#`), List (`-`), Link (`[]()`). Each inserts Markdown syntax at cursor position |
| 3 | Replace textarea | `frontend/components/LessonWorkspace.tsx` | Replace plain `<textarea>` (lines ~668-708) with a split-pane layout. Left: `TextareaAutosize` with `NotesToolbar`. Right: `ReactMarkdown` preview (already installed) |
| 4 | Keyboard shortcuts | `LessonWorkspace.tsx` | `Ctrl+B` = bold, `Ctrl+I` = italic, `Ctrl+K` = link. Use `onKeyDown` handler |
| 5 | Note search | `LessonWorkspace.tsx` | Add search input in Notes tab header. Fetch all notes for the current roadmap from Firestore `users/{uid}/roadmaps/{rid}/notes/`. Filter by content match. Show matching notes in a dropdown with lesson name and snippet |
| 6 | Export button | `LessonWorkspace.tsx` | "Download as .md" button. Create a Blob with the note content + YAML front matter (lesson title, date). Trigger browser download |
| 7 | Note count | `frontend/app/dashboard/page.tsx` | Query notes sub-collection count. Add to stat cards or analytics section |

#### Acceptance Criteria

- [ ] Toolbar inserts Markdown syntax at cursor
- [ ] Live preview renders Markdown in real-time
- [ ] Auto-save still works (same debounce logic)
- [ ] Search finds notes across all lessons
- [ ] Export downloads a `.md` file
- [ ] Keyboard shortcuts work

---

### Task 3.2 · PDF Export `[C1]`

**Priority:** P2 · **Effort:** 5–6 hours · **Risk:** Medium (layout tuning)

#### Steps

| # | Action | File | Details |
|---|---|---|---|
| 1 | Install dependencies | Terminal | `cd frontend && npm install jspdf jspdf-autotable` |
| 2 | Create export utility | `frontend/lib/exportPdf.ts` | New file. Export `generateRoadmapPdf(roadmap: Roadmap, completedLessons: Set<string>): void` |
| 3 | Title page | `exportPdf.ts` | Page 1: Roadmap title (goal), skill level, timeline, creation date. App logo/brand text at top |
| 4 | Table of contents | `exportPdf.ts` | Page 2: Hierarchical list — Phase → Chapter → Lesson with page numbers (or just indented list) |
| 5 | Phase sections | `exportPdf.ts` | One section per phase. Use `jspdf-autotable` to render a table: Lesson Name, Duration, Status (✅/⬜), Resources count |
| 6 | Resources appendix | `exportPdf.ts` | Final section: All unique resources grouped by type (Documentation, Video, Article, etc.) with URLs |
| 7 | Progress summary | `exportPdf.ts` | Footer or final page: X/Y lessons completed, estimated hours remaining, completion percentage |
| 8 | Add export button | `frontend/app/roadmap/[id]/page.tsx` | Add "Export PDF" button with `Download` icon in the roadmap header. On click: call `generateRoadmapPdf()` |
| 9 | Loading state | `roadmap/[id]/page.tsx` | Show "Generating PDF..." spinner on the button while PDF is being created |

#### Acceptance Criteria

- [ ] PDF downloads with correct filename (`Roadmap - {goal}.pdf`)
- [ ] Title page, TOC, phase sections, and resources appendix render correctly
- [ ] Completion status (✅/⬜) reflects actual progress
- [ ] Layout is clean and professional (no overlapping text)

---

### Task 3.3 · Offline-to-Cloud Sync `[C3]`

**Priority:** P2 · **Effort:** 4–5 hours · **Risk:** Medium (merge logic)

#### Steps

| # | Action | File | Details |
|---|---|---|---|
| 1 | Create sync detector | `frontend/lib/syncDetector.ts` | New file. Export `detectGuestData(): { roadmapCount: number, lessonCount: number, noteCount: number }`. Scans `localStorage` for `roadmap_*`, `progress_dates_*`, `note_*` keys |
| 2 | Create `SyncBanner.tsx` | `frontend/components/SyncBanner.tsx` | Persistent top banner (below Navbar). Message: "We found X roadmaps and Y completed lessons from your guest session." Buttons: "Import to Account" / "Dismiss" |
| 3 | Hook into auth flow | `frontend/components/AuthProvider.tsx` | After successful login, call `detectGuestData()`. If data found, set a Zustand store flag `showSyncBanner: true` |
| 4 | Import logic | `frontend/lib/syncDetector.ts` | `importGuestData(userId: string): Promise<ImportResult>`. Steps: (1) Read all `roadmap_*` from localStorage, (2) Write to Firestore `users/{uid}/roadmaps/{id}`, (3) Read `progress_dates_*` and write to progress sub-collections, (4) Read `note_*` and write to notes, (5) Clear localStorage keys, (6) Return counts |
| 5 | Merge handling | `syncDetector.ts` | Before writing a roadmap, check if it exists in Firestore. If yes, merge `completedLessons` (union of both sets). Don't overwrite existing Firestore data |
| 6 | Success feedback | `SyncBanner.tsx` | On import complete: replace banner text with "✅ Imported X roadmaps and Y lessons!" with checkmark animation. Auto-dismiss after 5 seconds |
| 7 | Dismiss persistence | `SyncBanner.tsx` | If user clicks "Dismiss", set `localStorage.setItem('sync_dismissed', 'true')`. Don't show again |

#### Acceptance Criteria

- [ ] Banner appears after login when guest data exists
- [ ] Import transfers all roadmaps, progress, and notes to Firestore
- [ ] Existing Firestore data is merged, not overwritten
- [ ] localStorage is cleared after successful import
- [ ] Banner doesn't reappear after dismissal

---

## Sprint 4 — "Polish"

**Goal:** Quality-of-life improvements and visual refinements.  
**Estimated effort:** 8–11 hours  
**Dependencies:** Best done after Sprints 1–3 to avoid rework.

---

### Task 4.1 · Resource Bookmarking & Rating `[B3]`

**Priority:** P3 · **Effort:** 5–6 hours · **Risk:** Low

#### Steps

| # | Action | File | Details |
|---|---|---|---|
| 1 | Add bookmark/rating UI | `frontend/components/ResourcePanel.tsx` | Add ⭐ rating (1-5 clickable stars) and 🔖 bookmark toggle icon next to each resource |
| 2 | Persist to Firestore | `ResourcePanel.tsx` | On bookmark/rate: write to `users/{uid}/bookmarked_resources/{hash(url)}` with `{ url, title, type, rating, bookmarkedAt, roadmapId, lessonId }` |
| 3 | Check existing bookmarks | `ResourcePanel.tsx` | On mount, fetch user's bookmarked URLs. Show filled bookmark icon + saved rating for already-bookmarked resources |
| 4 | Dashboard section | `frontend/app/dashboard/page.tsx` | New "Bookmarked Resources" section. Fetch all from `bookmarked_resources` collection. Render as filterable list (filter by type, sort by rating/date) |

#### Acceptance Criteria

- [ ] Stars and bookmark icons appear on each resource
- [ ] Bookmarking/rating persists to Firestore
- [ ] Dashboard shows all bookmarked resources with filters

---

### Task 4.2 · Calendar Sync (iCal Export) `[C2]`

**Priority:** P3 · **Effort:** 2–3 hours · **Risk:** Low

#### Steps

| # | Action | File | Details |
|---|---|---|---|
| 1 | Create iCal generator | `frontend/lib/exportCalendar.ts` | New file. Export `generateICalFile(roadmap: Roadmap): void`. Build `.ics` string manually (spec is simple text format) |
| 2 | Generate events | `exportCalendar.ts` | One `VEVENT` per `timeline_weeks` entry. `DTSTART` = roadmap created_at + (week * 7 days). `SUMMARY` = week focus. `DESCRIPTION` = tasks list |
| 3 | Trigger download | `exportCalendar.ts` | Create Blob with MIME type `text/calendar`, trigger browser download as `{goal}-schedule.ics` |
| 4 | Add button | `frontend/app/roadmap/[id]/page.tsx` | "Sync to Calendar" button with `Calendar` icon next to the PDF export button |

#### Acceptance Criteria

- [ ] `.ics` file downloads with correct events
- [ ] File opens correctly in Google Calendar, Apple Calendar, Outlook
- [ ] Events span the full roadmap timeline

---

### Task 4.3 · Dark Mode `[C4]`

**Priority:** P3 · **Effort:** 6–8 hours · **Risk:** Medium (broad surface area)

#### Steps

| # | Action | File | Details |
|---|---|---|---|
| 1 | Add CSS variables | `frontend/app/globals.css` | Define dark mode palette under `.dark` or `[data-theme="dark"]` root class. Remap all `paper-*`, `ink-*`, `accent` tokens |
| 2 | Dark palette | `globals.css` | `paper-50: #0F0F0F`, `paper-100: #1A1A1A`, `paper-200: #252525`, `ink-900: #F5F3EF`, `ink-500: #A0A0A0`, `accent: #7C93F5`, border: `#333` |
| 3 | Add toggle | `frontend/components/Navbar.tsx` | Sun/Moon icon button. On click: toggle `dark` class on `<html>`. Save to `localStorage('theme')` |
| 4 | System preference | `frontend/app/layout.tsx` | On mount: check `localStorage('theme')` first, then `window.matchMedia('(prefers-color-scheme: dark)')`. Apply accordingly |
| 5 | Audit components | All components | Add `dark:` Tailwind variants to: `ProgressCalendar.tsx`, `SkillsRadar.tsx`, `LessonWorkspace.tsx`, `ChapterList.tsx`, all `ui/` components, `AIMentor.tsx` |
| 6 | Chart colors | `SkillsRadar.tsx`, `WeeklyVelocity.tsx` | Use CSS custom properties instead of hardcoded hex values. Read from `getComputedStyle()` or pass as props |
| 7 | Transition | `globals.css` | Add `transition: background-color 200ms, color 200ms` to `body` and major containers for smooth toggle |

#### Acceptance Criteria

- [ ] Toggle switches between light and dark themes
- [ ] Preference persists across page reloads
- [ ] System preference is respected on first visit
- [ ] All components render correctly in dark mode
- [ ] Charts use theme-aware colors
- [ ] No FOUC (flash of unstyled content) on load

---

## Testing Checklist

After each sprint, validate:

### Sprint 1
- [ ] Dashboard loads with Skills Radar for first roadmap
- [ ] Dropdown switches radar between roadmaps
- [ ] Weekly velocity chart renders 8 weeks of data
- [ ] "Hours Invested" stat card shows accurate total
- [ ] Completion forecast shows reasonable estimate
- [ ] All widgets handle 0-data edge case gracefully
- [ ] Mobile layout stacks properly

### Sprint 2
- [ ] Quiz generates 5 context-relevant questions
- [ ] Correct/incorrect feedback is instant and clear
- [ ] Quiz results persist and show on retry
- [ ] ≥80% score auto-completes chapter
- [ ] All 8 badges unlock at correct thresholds
- [ ] Badge toast appears once per badge
- [ ] Badges persist to Firestore and reload on refresh

### Sprint 3
- [ ] Markdown toolbar inserts correct syntax
- [ ] Live preview matches expected rendering
- [ ] Note search returns relevant results across lessons
- [ ] PDF contains all roadmap sections with correct data
- [ ] Sync banner appears for guest data after login
- [ ] Import merges data without overwriting
- [ ] localStorage clears after successful import

### Sprint 4
- [ ] Resource ratings persist and display on revisit
- [ ] Bookmarked resources appear on dashboard
- [ ] `.ics` file opens in major calendar apps
- [ ] Dark mode toggle works without page reload
- [ ] All components render correctly in both themes

---

## Dependency Graph

```
Sprint 1 (independent)
  ├── A1  Skills Radar  ─── no deps
  └── A3  Analytics  ─────── no deps

Sprint 2 (sequential)
  ├── B1  Chapter Quiz Backend  ─── no deps
  ├── B1  Chapter Quiz Frontend ─── depends on B1-backend
  └── A2  Badge System  ────────── depends on B1 (quiz scores) + Sprint 1 (streak data)

Sprint 3 (independent of Sprint 2)
  ├── B2  Rich Notes  ──── no deps
  ├── C1  PDF Export  ──── no deps
  └── C3  Offline Sync ── depends on AuthProvider

Sprint 4 (after Sprint 1-3)
  ├── B3  Bookmarking  ── no deps
  ├── C2  Calendar  ───── no deps
  └── C4  Dark Mode  ──── should be last (touches all components)
```

---

## Summary

| Sprint | Tasks | New Files | Modified Files | New Dependencies |
|---|---|---|---|---|
| **1** | 4 tasks | `WeeklyVelocity.tsx` | `dashboard/page.tsx`, `SkillsRadar.tsx` | — |
| **2** | 5 tasks | `ChapterQuiz.tsx`, `BadgeShowcase.tsx`, `BadgeUnlockToast.tsx`, `types/badges.ts`, `lib/badges.ts` | `main.py`, `schemas.py`, `ai_service.py`, `LessonWorkspace.tsx`, `dashboard/page.tsx` | — |
| **3** | 3 tasks | `NotesToolbar.tsx`, `lib/exportPdf.ts`, `lib/syncDetector.ts`, `SyncBanner.tsx` | `LessonWorkspace.tsx`, `AuthProvider.tsx`, `roadmap/[id]/page.tsx`, `dashboard/page.tsx` | `react-textarea-autosize`, `jspdf`, `jspdf-autotable` |
| **4** | 3 tasks | `lib/exportCalendar.ts` | `ResourcePanel.tsx`, `Navbar.tsx`, `globals.css`, `layout.tsx`, all components | — |

**Total: 15 tasks · 12 new files · 40–52 hours estimated**

---

> **Next step:** Start Sprint 1, Task 1.1 — wire up the Skills Radar to the dashboard.

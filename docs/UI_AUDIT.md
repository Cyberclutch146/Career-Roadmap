# UI Deep-Dive Audit — Improvements & Fixes

> **Date:** June 2, 2026
> **Scope:** Visual design, interaction patterns, accessibility, responsiveness, and performance audit
> **Components Reviewed:** 22 components, 8 pages, 1 CSS theme, 1 Tailwind config

---

## Summary

| Category | Count | Description |
|---|---|---|
| 🔴 Broken / Visually Wrong | 4 | Actually renders incorrectly or is non-functional |
| 🟠 UX Pain Points | 7 | Functional but creates friction or confusion |
| 🟡 Design Inconsistencies | 6 | Deviations from the design system or best practices |
| 🔵 Enhancement Opportunities | 8 | Polish, delight, and modern design patterns |
| 🟣 Accessibility (a11y) | 5 | WCAG compliance and keyboard/screen-reader issues |
| **Total** | **30** | |

---

## 🔴 Broken / Visually Wrong

### UI-1 — Google Sign-In button has broken SVG

- **File:** `frontend/app/login/page.tsx` (lines 184-188)
- **Problem:** The Google "G" SVG only has a single red `<path>`. The standard Google icon uses 4 paths (red, blue, yellow, green). Current rendering shows a malformed red blob.
- **Fix:** Replace with the standard Google brand SVG:
```html
<svg viewBox="0 0 24 24" class="w-5 h-5">
  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
</svg>
```

---

### UI-2 — Light mode is visually broken

- **File:** `frontend/app/globals.css` (lines 8-63), `tailwind.config.ts`
- **Problem:** Light mode CSS variables exist (`:root` block) but the app is hardcoded to `defaultTheme="dark"` with `enableSystem={false}`. The Navbar uses hardcoded `rgba(10, 10, 11, ...)` glass backgrounds that are invisible on white backgrounds. Many components use raw `bg-zinc-950`, `bg-zinc-900`, `text-zinc-*` classes instead of semantic tokens.
- **Affected Components:** Navbar, Dashboard, Profile, Roadmap page, LessonWorkspace, ChapterList, Gallery — basically every page.
- **Hardcoded dark values found in:**
  - Navbar.tsx (lines 82-92): `themeVars` object with hardcoded hex values
  - Dashboard: `bg-[#0a0a0b]` hardcoded on outer div
  - Gallery: `bg-[#0a0a0b]`
  - Profile: `bg-[#0a0a0b]`
  - Roadmap page: `bg-[#0a0a0b]`, `bg-zinc-950/90`
  - ChapterList: `bg-zinc-950/50`, `bg-zinc-800/30`
  - LessonWorkspace: `bg-zinc-950/70`, `bg-[#1e1e1e]`
- **Fix:** Replace all hardcoded color values with semantic tokens (`bg-background`, `bg-surface-container`, `border-outline-variant`). If light mode isn't a priority, remove the `:root` light theme block to avoid confusion. If it is a priority, this is a ~4h migration.

---

### UI-3 — Navbar search bar is non-functional

- **File:** `frontend/components/Navbar.tsx` (lines 58-63)
- **Problem:** The `handleSearch` function fires on Enter key but does nothing — the query isn't sent anywhere. There's no search API endpoint or results UI.
- **Impact:** Users see a search icon, type a query, hit Enter, and nothing happens. The search input just closes.
- **Fix:** Either:
  - (A) Remove the search icon entirely until search is implemented
  - (B) Wire it to filter roadmaps on the gallery page via query params: `router.push(/gallery?q=${searchQuery})`

---

### UI-4 — Footer links point to non-existent anchors

- **File:** `frontend/components/Footer.tsx` (lines 13-21)
- **Problem:** "Company" links (`#about`, `#blog`, `#careers`) and "Legal" links (`#privacy`, `#terms`) point to anchors that don't exist on any page. Clicking them scrolls nowhere.
- **Also:** The GitHub link (`https://github.com/blaze/career-roadmap`) uses the wrong username — should be `Cyberclutch146/Career-Roadmap` based on the README.
- **Fix:** Remove placeholder links or replace with real destinations. Fix the GitHub URL.

---

## 🟠 UX Pain Points

### UX-1 — Quiz modal has no "go back to previous question" button

- **File:** `frontend/app/generate/page.tsx` (lines 270-354)
- **Problem:** The quiz is a one-way flow — users can't review or change previous answers before finishing.
- **Fix:** Add a "Previous" button that decrements `currentQuestionIndex` when index > 0.

---

### UX-2 — No loading state feedback during roadmap generation

- **File:** `frontend/app/generate/page.tsx` (line 131)
- **Problem:** After clicking "Generate," users see a disabled button with a spinner but no indication of what's happening. AI generation can take 5-15 seconds.
- **Fix:** Show a multi-phase loading state: "Analyzing your goals..." → "Building curriculum..." → "Curating resources..." with animated transitions.

---

### UX-3 — `alert()` used in multiple places instead of toast

- **Files:**
  - `gallery/page.tsx` (lines 116, 136, 139)
  - `roadmap/[id]/page.tsx` (lines 324, 326, 330)
  - `profile/page.tsx` (line 231)
- **Problem:** `alert()` blocks the UI thread and looks unprofessional. The app already has `sonner` Toaster configured in the layout.
- **Fix:** Replace all `alert()` calls with `toast.success()` / `toast.error()` from sonner.

---

### UX-4 — MobileNav always shows Profile/Dashboard even when logged out

- **File:** `frontend/components/MobileNav.tsx` (lines 13-18)
- **Problem:** The bottom tab bar always shows "Dashboard" and "Profile" tabs. When logged out, tapping either triggers a redirect to `/login` via AuthProvider — but the user sees a spinner flash first.
- **Fix:** Conditionally show Dashboard/Profile only when `user` is truthy. Show "Login" when not authenticated.

---

### UX-5 — Roadmap sidebar "Back to Generator" link is misleading

- **File:** `frontend/app/roadmap/[id]/page.tsx` (line 644)
- **Problem:** The sidebar shows "Back to Generator" but users likely came from the dashboard or gallery. The link always goes to `/generate`, not "back."
- **Fix:** Use `router.back()` or change the label to "Create New Roadmap" to match the actual behavior.

---

### UX-6 — No empty state for completed lessons in dashboard

- **File:** `frontend/app/dashboard/page.tsx`
- **Problem:** If a user has roadmaps but hasn't completed any lessons, the stats section shows "0 Lessons completed" and "0 Day Streak" but the analytics section still renders charts with no data (empty radar, empty velocity bars).
- **Fix:** Show a motivational empty state: "Complete your first lesson to start tracking progress!" with a CTA to their first roadmap.

---

### UX-7 — LessonWorkspace tabs overflow without scroll indicator

- **File:** `frontend/components/LessonWorkspace.tsx` (line 485)
- **Problem:** On mobile, the 5 workspace tabs ("Lesson & Resources", "Playground", "AI Mock Interview", "Notes Workspace", "Cheat Sheet") overflow horizontally. The `scrollbar-hide` class hides the scrollbar, so users don't know they can scroll to see more tabs.
- **Fix:** Add a fade gradient on the right edge to hint at scrollability, or use shorter tab labels on mobile ("Lesson", "Code", "Interview", "Notes", "Cheat").

---

## 🟡 Design Inconsistencies

### DI-1 — Inconsistent border radius scale

- **Problem:** The codebase uses `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, and `rounded-[24px]` / `rounded-[28px]` / `rounded-[22px]` / `rounded-[20px]` inconsistently. The Navbar uses `rounded-[24px]`, profile menu uses `rounded-[28px]`, cards in features use `rounded-2xl`.
- **Fix:** Standardize on the Tailwind scale: `rounded-xl` for small containers, `rounded-2xl` for cards, `rounded-3xl` for modals/sheets.

---

### DI-2 — Mixed button styling approaches

- **Problem:** The app has 3 competing button systems:
  1. `Button` component (`components/ui/Button.tsx`) — uses props for variant/size
  2. CSS classes (`.btn-primary`, `.btn-secondary`) — defined in `globals.css` but rarely used
  3. Inline Tailwind classes — many buttons are styled ad-hoc with long className strings
- **Fix:** Use the `Button` component consistently everywhere. Remove unused `.btn-*` CSS classes.

---

### DI-3 — Inconsistent page background colors

- **Problem:** Some pages use `bg-[#0a0a0b]` (dashboard, gallery, profile), others use `bg-background` (login), others use `bg-surface` (roadmap loading). These should all use the same token.
- **Fix:** Replace all `bg-[#0a0a0b]` with `bg-background`.

---

### DI-4 — Navbar logo styling differs from Footer

- **Problem:**
  - Navbar logo: `font-serif italic font-bold` → "Roadmap" + `text-amber-500 font-sans not-italic` → "AI" + amber dot
  - Footer logo: `font-headline font-bold` → "Roadmap" + `text-amber-400 font-serif italic` → "AI"
- The styles are inverted — "AI" is serif italic in footer but sans in navbar.
- **Fix:** Extract the logo into a shared `<Logo />` component.

---

### DI-5 — Typography scale not fully utilized

- **Problem:** `tailwind.config.ts` defines a custom typography scale (`text-display-lg`, `text-headline-lg`, etc.) but it's almost never used in components. Most headings use ad-hoc `text-2xl`, `text-3xl`, etc.
- **Fix:** Use the semantic scale in headings: `text-headline-lg` for page titles, `text-headline-md` for section titles.

---

### DI-6 — Success color mapped to amber instead of green

- **File:** `tailwind.config.ts` (line 95)
- **Problem:** `success: { DEFAULT: '#d97706' }` — success is mapped to amber/orange. This is semantically confusing. Completion checkmarks use `text-amber-500` or `text-success` interchangeably, but success should be green.
- **Fix:** Map success to emerald/green: `success: { DEFAULT: '#10b981', dark: '#059669' }`.

---

## 🔵 Enhancement Opportunities

### E-1 — Add skeleton loading states

- **Problem:** Pages show a single centered spinner during loading. Modern apps use skeleton/shimmer loading that mirrors the page layout.
- **Files:** `loading.tsx`, `dashboard/page.tsx`, `gallery/page.tsx`
- **Fix:** Create skeleton variants of the dashboard stat cards, roadmap cards, and gallery grid.

---

### E-2 — Add page transition animations

- **Problem:** Navigation between pages has no transition — content just snaps. This feels jarring compared to the polished in-page animations.
- **Fix:** Wrap page content in a `<motion.div>` with fade-in animation, or use Next.js `loading.tsx` with AnimatePresence.

---

### E-3 — Add keyboard shortcuts

- **Enhancement:** Power users would benefit from:
  - `/` to focus search
  - `Escape` to close modals/chat
  - `Cmd/Ctrl+Enter` to submit forms
- **Fix:** Add a `useHotkeys` hook or use native `onKeyDown` handlers.

---

### E-4 — ChatWidget FAB should show unread indicator

- **File:** `frontend/components/AIMentor.tsx`
- **Problem:** The floating chat button has no indication of state. When the AI has responded to a query, there's no visual cue.
- **Fix:** Add a pulsing dot badge when there's an unread response.

---

### E-5 — Progress celebration micro-animations

- **Problem:** Marking a lesson as complete just changes the icon from circle to checkmark. No feedback for the accomplishment.
- **Fix:** Add a brief scale bounce + green flash animation on the checkbox when completing a lesson.

---

### E-6 — Dashboard could show "next recommended lesson"

- **Problem:** Users land on the dashboard but have to navigate to a roadmap to find where they left off.
- **Fix:** Add a "Continue where you left off" card showing the first incomplete lesson of the most recently active roadmap.

---

### E-7 — Gallery cards should show a preview of the roadmap structure

- **Problem:** Gallery cards only show the goal, description, and metadata. No visual preview of the roadmap phases.
- **Fix:** Add a mini phase-progress strip showing the roadmap's structure (e.g., 3 colored blocks representing the 3 phases).

---

### E-8 — Testimonials should use real avatar images

- **Problem:** Testimonials use 2-letter initial avatars ("PS", "RV", "SC"). For a portfolio project, real profile images (or AI-generated ones) would look more professional.
- **Fix:** Generate avatar images using the `generate_image` tool or use DiceBear/Boring Avatars.

---

## 🟣 Accessibility (a11y)

### A11Y-1 — No focus-visible indicators on many interactive elements

- **Problem:** Many custom buttons (phase toggles, lesson checkboxes, tabs) lack `:focus-visible` ring styles. Keyboard users can't see which element is focused.
- **Fix:** Add `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background` to all clickable elements.

---

### A11Y-2 — Quiz modal has no focus trap

- **File:** `frontend/app/generate/page.tsx` (lines 270-354)
- **Problem:** When the quiz modal opens, keyboard focus can Tab behind the modal to the underlying page.
- **Fix:** Use `@headlessui/react` Dialog or implement a focus trap with `useRef` and `onKeyDown`.

---

### A11Y-3 — Color contrast issues with tertiary text

- **Problem:** The `tertiary` color (`#71717a` in dark mode) on `background` (`#0a0a0b`) has a contrast ratio of ~4.2:1 — below the WCAG AA minimum of 4.5:1 for normal text.
- **Fix:** Lighten tertiary to at least `#8a8a94` (~4.6:1 ratio).

---

### A11Y-4 — Images and icons lack proper alt text

- **Problem:**
  - Navbar avatar: `alt="Profile"` (generic)
  - DiceBear external images load without fallback
  - Decorative icons lack `aria-hidden="true"`
- **Fix:** Add meaningful alt text for informational images, `aria-hidden="true"` for decorative icons.

---

### A11Y-5 — No `aria-label` on icon-only buttons

- **Problem:** Multiple icon-only buttons (search, menu, close, theme toggle, bookmark) have no accessible label. Screen readers announce them as "button" with no context.
- **Fix:** Add `aria-label` to every icon-only button (e.g., `aria-label="Search"`, `aria-label="Close menu"`).

---

## Recommended Execution Order

| Phase | Items | Effort | Impact |
|---|---|---|---|
| **Phase 1 — Quick wins** | UI-1, UI-4, DI-3, UX-3, A11Y-5 | ~1.5h | Immediate visual + UX improvement |
| **Phase 2 — UX fixes** | UI-3, UX-1, UX-4, UX-7, UX-5 | ~2h | Removes user friction |
| **Phase 3 — Design system** | DI-1, DI-2, DI-4, DI-5, DI-6 | ~3h | Consistency across the app |
| **Phase 4 — Light mode** | UI-2 | ~4h | Full light mode support |
| **Phase 5 — Enhancements** | E-1 through E-8 | ~6h | Premium polish |
| **Phase 6 — Accessibility** | A11Y-1 through A11Y-4 | ~2h | WCAG AA compliance |

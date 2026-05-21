# RoadmapAI — Premium UI Overhaul Plan

This document maps out the design blueprints, styling tokens, layout adjustments, and micro-interactions required to transform **RoadmapAI** into a premium, state-of-the-art web application. 

The strategy combines:
1. **Intervue-Me's** sleek dark mode with low-contrast borders and warm accent highlights.
2. **Ankur Bag's** ultra-minimalist grid spacing, sophisticated serif/sans-serif typography, and custom rounding.
3. **CodeZen's** polished dashboard split-pane layout and rich code playground aesthetics.

---

## 🎨 Design System & Styling Foundation

### 1. Unified Dark Palette & CSS Variables
We will update `globals.css` to define a premium, deep dark background with rich surface levels and subtle glow effects.

```css
:root {
  /* Obsidian Theme */
  --bg-color: #09090b;          /* Darkest background */
  --bg-surface-lowest: #050506;
  --bg-surface-low: #0f0f10;
  --bg-surface: #141415;        /* Standard card container */
  --bg-surface-high: #1c1c1e;
  --bg-surface-highest: #222225;
  
  /* Text and Accents */
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-muted: #52525b;
  
  --accent-amber: #f59e0b;       /* Primary amber */
  --accent-orange: #f97316;      /* Secondary orange */
  --accent-glow: rgba(245, 158, 11, 0.08);
  
  /* Subtle Borders */
  --border-subtle: rgba(39, 39, 42, 0.6);   /* border-zinc-800/60 */
  --border-hover: rgba(245, 158, 11, 0.25);
}
```

### 2. Typography Strategy (Pairing displays)
We will introduce a premium typography pairing using Google Fonts loaded in `layout.tsx`:
- **Display Headings**: A combination of a clean, geometric sans-serif (e.g., `Plus Jakarta Sans` or `Outfit`) for modern, tech-focused headers, paired with a sophisticated, custom-italicized serif font (e.g., `Playfair Display` or `Merriweather`) for accent words/labels.
- **Body & Labels**: `Inter` or `Plus Jakarta Sans` for high legibility in dense lists and stats.
- **Mono Space**: `JetBrains Mono` for the code editor and mock interview panels.

---

## 🚀 Overhaul Roadmap: Sprint Breakdown

### Sprint 1: Brand & Layout Foundation
*Target: Global styling tokens, floating navbar, marketing landing pages, typography, and responsive shells.*

#### Task 1.1 · Floating Glassmorphic Navigation
- **File**: `frontend/components/Navbar.tsx`, `frontend/components/MobileNav.tsx`
- **Actions**:
  1. Transform the header into a floating pill navigation. Center it at the top with a max-width of `max-w-5xl`.
  2. Implement an ultra-thin border (`border-[0.5px] border-zinc-800/60`), glassmorphic backdrop-blur (`backdrop-blur-xl`), and dark translucent background (`bg-zinc-950/70`).
  3. Add active-tab indicator animations using Framer Motion layout animations.
  4. Design a clean user profile dropdown menu with custom options (My Roadmaps, Settings, Sign Out).

#### Task 1.2 · The "Ankur Bag Grid" Marketing Page
- **File**: `frontend/app/page.tsx`, `frontend/components/Hero.tsx`, `frontend/components/Features.tsx`
- **Actions**:
  1. Implement a delicate vertical/horizontal background line grid (`blueprint-grid` class in `globals.css`) overlayed with a soft, warm radial glow (`glow-amber` class) behind the main hero text.
  2. Replace standard landing headings with a dynamic typography mix: bold modern sans-serif with italic serif accent words (e.g., "Chart your *professional growth* with AI").
  3. Add a typewriter typing animation for the core learning titles (e.g., "Software Engineer", "Data Scientist", "UI/UX Designer").
  4. Make the card layouts use `rounded-3xl` (24px) corners and a custom soft border-glow on hover.

#### Task 1.3 · Interactive Roadmap Showcase Upgrade
- **File**: `frontend/components/ExampleRoadmap.tsx`
- **Actions**:
  1. Elevate the interactive preview on the landing page to mimic an IDE environment.
  2. Add side-by-side split screens: left side shows the interactive outline, right side shows a preview of lesson notes.
  3. Style elements with sleek dark colors, small tags, and glowing active states.

---

### Sprint 2: Generation Flow & Forms
*Target: Modernizing the roadmap custom configuration builder and pre-assessment quiz.*

#### Task 2.1 · Stepper-Based Form Workspace
- **File**: `frontend/app/generate/page.tsx`
- **Actions**:
  1. Replace the long, single-page form with a sleek stepper flow (Step 1: Goal Definition, Step 2: Custom Configurations, Step 3: Skill Pre-Assessment, Step 4: Generation).
  2. Customize selection boxes with animated focus states.
  3. Add glassmorphic input fields with floating labels that scale down nicely when inputs are active.

#### Task 2.2 · Gamified Assessment Quiz UI
- **File**: `frontend/app/generate/page.tsx`
- **Actions**:
  1. Build custom animated question cards. Options should reveal with a subtle staggered fade-in.
  2. Include a micro-interaction where selecting an option flashes green/red with sound-less haptic-style visual pulse animations.
  3. Integrate progress-dots at the bottom showing current quiz depth.

---

### Sprint 3: Interactive Learning Workspace
*Target: Implementing split-pane UI, coding playground redesign, notes, and AI mentor interfaces.*

#### Task 3.1 · CodeZen Split-Pane Core Layout
- **File**: `frontend/app/roadmap/[id]/page.tsx`, `frontend/components/LessonWorkspace.tsx`
- **Actions**:
  1. Upgrade the roadmap view into a split-pane layout: left panel contains the interactive chapter list (`ChapterList.tsx`), right panel contains the workspace context (`LessonWorkspace.tsx`).
  2. Build a draggable divider handle allowing users to resize panels dynamically.
  3. Make the Chapter/Lesson navigator look like a tree directory using file/folder icons, hover states, and clear progress checkmarks.

#### Task 3.2 · Integrated Code Playground Redesign
- **File**: `frontend/components/LessonWorkspace.tsx`
- **Actions**:
  1. Format the editor tab with a split vertical grid: top contains the code editor panel, bottom contains the output iframe terminal.
  2. Give the editor a custom dark toolbar (Clear Code, Reset, Copy Code, Expand Layout) with tiny, sleek icons.
  3. Style the terminal panel with a dark background, monospace fonts, and a flashing terminal cursor.

#### Task 3.3 · Premium AI Mentor & Mock Interview Interface
- **File**: `frontend/components/AIMentor.tsx`, `frontend/components/LessonWorkspace.tsx`
- **Actions**:
  1. Use modern circular avatars for User (glowing initials) and Mentor (colored Sparkles icon).
  2. Implement bubble layouts: assistant responses use a slightly lighter glass-card tint (`bg-zinc-800/30`), while user prompts align to the right with a warm border.
  3. Create an animated typing indicator dots bubble (`...`) that mimics actual typing while waiting for Gemini API responses.

---

### Sprint 4: Dashboard & Analytics Glow-up
*Target: Upgrading the main analytics charts, velocity trackers, and badges showcase.*

#### Task 4.1 · Glassmorphic Analytics Dashboard
- **File**: `frontend/app/dashboard/page.tsx`
- **Actions**:
  1. Redesign stat metrics cards as premium glass widgets featuring glowing card outlines.
  2. Integrate the Skills Radar chart in a two-column grid alongside a customized roadmap selector menu.
  3. Wire up the weekly velocity chart (`WeeklyVelocity.tsx`) using sleek amber-filled charts.

#### Task 4.2 · Gamified Badge Showcase UI
- **File**: `frontend/components/BadgeShowcase.tsx`
- **Actions**:
  1. Render badges in a grid. Locked achievements are rendered in grayscale with a subtle padlock.
  2. Unlocking an achievement should animate the badge with a full color reveal, a spinning gold border, and a soft background glow.

---

## 📈 Implementation Tasks Checklist

| Sprint | Task | Priority | Status | Files Impacted |
|---|---|---|---|---|
| **Sprint 1** | T1.1 Floating Nav Bar | P0 | ⬜ Pending | `Navbar.tsx`, `MobileNav.tsx` |
| **Sprint 1** | T1.2 Landing Page Grid | P0 | ⬜ Pending | `page.tsx`, `Hero.tsx`, `Features.tsx` |
| **Sprint 1** | T1.3 Demo Showcase | P1 | ⬜ Pending | `ExampleRoadmap.tsx` |
| **Sprint 2** | T2.1 Stepper Builder | P1 | ⬜ Pending | `generate/page.tsx` |
| **Sprint 2** | T2.2 Quiz UI | P1 | ⬜ Pending | `generate/page.tsx` |
| **Sprint 3** | T3.1 Split-Pane Layout | P0 | ⬜ Pending | `roadmap/[id]/page.tsx` |
| **Sprint 3** | T3.2 Code Playground | P0 | ⬜ Pending | `LessonWorkspace.tsx` |
| **Sprint 3** | T3.3 AI Mentor UI | P1 | ⬜ Pending | `AIMentor.tsx` |
| **Sprint 4** | T4.1 Glass Analytics | P0 | ⬜ Pending | `dashboard/page.tsx` |
| **Sprint 4** | T4.2 Achievement Badges | P1 | ⬜ Pending | `BadgeShowcase.tsx` |

---

## 💡 Aesthetic Polish Guidelines

1. **Glows & Radial Gradients**:
   - Use CSS gradients to add depth: `bg-[radial-gradient(ellipse_800px_600px_at_50%_-20%,rgba(245,158,11,0.12),rgba(255,255,255,0))]`.
2. **Glassmorphism Spec**:
   - Class name: `glass-card` -> `bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl shadow-inner`.
3. **Animations (Framer Motion)**:
   - Elements should slide up on page load with a staggered layout effect.
   - Hover cards should scale by `1.02` with a smooth ease curve.
   - Active outlines should slide dynamically (e.g. Nav and selectors).

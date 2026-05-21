# RoadmapAI — Design Specification

> The definitive design language, visual system, and UX specification for the RoadmapAI platform.
> Last updated: **May 2026**

---

## 1. Concept & Vision

RoadmapAI is an intelligent educational companion that transforms ambitious learning goals into structured, achievable roadmaps. The experience is premium, immersive, and deeply focused — like studying in a high-end digital workspace that adapts to your pace.

**Core feeling**: A sophisticated dark-mode academic workspace that combines the focus of a library with the intelligence of a personal tutor. Every interaction should feel deliberate, calm, and rewarding.

**Design philosophy**: Minimal chrome, maximum content. Ambient glows over hard borders. Smooth transitions over instant state changes. Dark backgrounds that let amber accents guide the eye.

---

## 2. Design Language

### Aesthetic Direction
Inspired by premium developer tools (Linear, Raycast, Arc), dark-mode SaaS dashboards, and glassmorphic UI trends. The design uses deep zinc backgrounds, warm amber accents, and frosted glass effects to create depth without visual noise.

### Color Palette

#### Core Tokens
| Token | Value | Usage |
|---|---|---|
| `background` | `#0a0a0b` | Page background |
| `surface` | `#18181b` (zinc-900) | Card backgrounds |
| `surface-container` | `#27272a` (zinc-800) | Elevated containers |
| `surface-container-high` | `#3f3f46` (zinc-700) | Hover states, active items |
| `on-surface` | `#fafafa` (zinc-50) | Primary text |
| `on-surface-variant` | `#a1a1aa` (zinc-400) | Secondary/muted text |
| `outline` | `#52525b` (zinc-600) | Borders, dividers |
| `outline-variant` | `#3f3f46` (zinc-700) | Subtle borders |

#### Accent Tokens
| Token | Value | Usage |
|---|---|---|
| `primary` | `#f59e0b` (amber-500) | Primary actions, active states, CTA |
| `primary-hover` | `#d97706` (amber-600) | Hover state for primary |
| `secondary` | `#f97316` (orange-500) | Secondary accents, gradients |
| `on-primary` | `#0a0a0b` | Text on primary buttons |
| `success` | `#d97706` (amber-600) | Completion, positive feedback (warm) |
| `error` | `#ef4444` (red-500) | Errors, destructive actions |

#### Glassmorphism Tokens
| Token | Value | Usage |
|---|---|---|
| `glassBg` | `rgba(24, 24, 27, 0.75)` | Glass panel backgrounds |
| `glassBorder` | `rgba(63, 63, 70, 0.5)` | Glass panel borders |
| `glassShadow` | `0 8px 32px rgba(0,0,0,0.4)` | Glass panel drop shadows |

#### Glow Effects
| Token | Value | Usage |
|---|---|---|
| `shadow-glow` | `0 0 20px rgba(245, 158, 11, 0.15)` | Default button glow |
| `shadow-glow-hover` | `0 0 30px rgba(245, 158, 11, 0.25)` | Hover button glow |
| `ambient-glow` | `bg-amber-500/[0.04]` | Section ambient background effects |

### Typography

| Role | Font | Weight | Source |
|---|---|---|---|
| Headlines | System serif / Merriweather | 600, 700 | Google Fonts via `next/font` |
| Body | Inter | 400, 500 | Google Fonts via `next/font` |
| Labels | Inter | 500, 600 | Same as body, smaller sizes |
| Code | JetBrains Mono | 400 | Google Fonts via `next/font` |

#### Type Scale
| Token | Size | Usage |
|---|---|---|
| `text-headline-lg` | `3.75rem` (60px) | Hero headlines (desktop) |
| `text-headline-lg-mobile` | `2.25rem` (36px) | Hero headlines (mobile) |
| `text-headline-md` | `2rem` (32px) | Section titles |
| `text-body-lg` | `1.125rem` (18px) | Lead paragraphs |
| `text-body` | `1rem` (16px) | Standard body text |
| `text-label` | `0.875rem` (14px) | UI labels, buttons |
| `text-caption` | `0.75rem` (12px) | Captions, metadata |

### Spatial System
- **Base unit**: 4px
- **Spacing scale**: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px
- **Max content width**: 720px (reading), 1200px (dashboard), 1400px (landing)
- **Section height**: `min-h-[100dvh]` (full viewport, expands for content)
- **Border radius**: `rounded-2xl` (16px) for cards, `rounded-full` for pills/buttons

### Motion Philosophy

| Element | Animation | Duration | Easing |
|---|---|---|---|
| Page entry | Fade + upward slide | 300ms | ease-out |
| Section reveal | `whileInView` fade + slide | 600ms | ease-out |
| Hover states | Border color + glow shift | 300–500ms | ease |
| Card hover | `hover:shadow-[0_0_30px]` + border glow | 500ms | ease |
| Accordion expand | Height auto + opacity | 300ms | ease |
| Mobile sidebar | Spring `x: 0` from `x: 100%` | spring(300, 30) | spring |
| Staggered items | Sequential delay per child | 70ms delay | ease |
| Progress updates | Width transition | 500ms | ease-out |
| Number counting | Framer Motion spring | spring | spring |

> **Principle**: Every animation serves a purpose — guiding attention, confirming actions, or creating spatial continuity. Nothing decorative or jarring.

---

## 3. Component Inventory

### Navigation
- **Navbar**: Floating glassmorphic pill, always visible. Logo, nav links, user avatar dropdown. Mobile: hamburger → staggered side panel.
- **MobileNav**: Bottom tab bar (5 icons) for app pages.
- **Footer**: Minimal grid with links, branding, and copyright.

### Landing Page Components
- **Hero**: Full-viewport centered section with headline, subtext, and search-style CTA input.
- **Features**: Desktop asymmetric grid (3-col) / Mobile accordion with `AnimatePresence`.
- **HowItWorks**: Desktop 4-col grid / Mobile horizontal snap-scroll carousel.
- **ExampleRoadmap**: Interactive demo with phases, progress bars, and lesson badges.
- **Testimonials**: Desktop 3-col grid / Mobile horizontal snap-scroll carousel.
- **CTA Section**: Full-viewport centered call-to-action card.

### Forms & Inputs
- **Input**: Label, field, helper text, error state. Rounded-full pill style.
- **Select**: Custom styled dropdown with chevron.
- **Button**: Primary (amber, glow), Secondary (ghost, border), sizes sm/md/lg.
- **Slider**: Track, thumb, value display.

### Cards & Content
- **Feature Card**: Icon box, title, description, ambient glow on hover.
- **Step Card**: Step number (serif italic), icon badge, title, description.
- **Testimonial Card**: Quote icon, star rating, quote text, avatar + name/role.
- **Roadmap Card**: Phase indicator, title, progress bar, lesson badges.
- **Resource Card**: Type icon, title, description, external link.

### Workspace
- **LessonWorkspace**: 4-tab interface (Content, Code, Interview, Notes).
- **Monaco Editor**: Full syntax highlighting, dark theme, language-aware.
- **TipTap Editor**: Rich text with formatting toolbar and auto-save.
- **AIMentor**: Chat interface with message history, suggestions, markdown rendering.

### Feedback & Status
- **ProgressBar**: Animated gradient fill (amber → orange), percentage label.
- **Toast**: Floating pill with icon, animated entrance/exit.
- **Skeleton**: Animated pulse loading placeholders.
- **EmptyState**: Illustration, message, and CTA.

---

## 4. Page Architecture

### Landing Page (`/`)
1. Navbar (floating pill, always visible)
2. Hero section (`min-h-[100dvh]`, centered CTA)
3. Features showcase (`min-h-[100dvh]`, grid/accordion)
4. How It Works (`min-h-[100dvh]`, grid/carousel)
5. Example Roadmap (`min-h-[100dvh]`, interactive demo)
6. Testimonials (`min-h-[100dvh]`, grid/carousel)
7. CTA section (`min-h-[100dvh]`, centered card)
8. Footer

### Login Page (`/login`)
1. Navbar
2. Centered auth card (toggle Sign In / Sign Up)
3. Email/Password form fields
4. Google SSO button
5. Footer

### Generate Page (`/generate`)
1. Navbar
2. Goal input form (goal, skill level, hours, style, timeline)
3. Skill assessment quiz flow (5 MCQs)
4. Loading state with animated progress
5. Roadmap preview with "View Full Roadmap" CTA

### Roadmap Viewer (`/roadmap/[id]`)
1. Navbar
2. Chapter sidebar (collapsible index)
3. Main content: LessonWorkspace (4 tabs)
4. AI Mentor chat (floating button → modal)

### Dashboard (`/dashboard`)
1. Navbar
2. Stats cards row (lessons, roadmaps, streak)
3. Active roadmaps grid
4. Progress calendar heatmap
5. Skills radar (pending integration)

### Responsive Strategy
| Breakpoint | Layout |
|---|---|
| Desktop (≥1024px) | Full sidebar + content + resources |
| Tablet (768–1023px) | Collapsible sidebar, full content |
| Mobile (<768px) | Bottom nav, stacked layout, slide-out panels, accordions, carousels |

---

## 5. API Design

### Endpoints

| Method | Endpoint | Auth | Rate Limit | Description |
|---|---|---|---|---|
| `GET` | `/` | No | — | API info + version |
| `GET` | `/health` | No | — | Health check |
| `POST` | `/api/roadmaps/generate` | Optional | 5/min | Generate AI roadmap |
| `POST` | `/api/chat` | Optional | 20/min | AI mentor conversation |
| `POST` | `/api/assessment/generate` | Optional | 5/min | Skill assessment quiz |
| `POST` | `/api/interview/chat` | Optional | 20/min | Mock interview conversation |

### Data Model (Firestore)

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

**Guest users**: Progress stored in `localStorage` with keys `progress_dates_{roadmapId}`, `roadmap_{id}`, `note_{roadmapId}_{lessonId}`.

### Authentication Flow
1. Firebase Auth handles client-side login (Email/Password + Google SSO).
2. `onAuthStateChanged` listener in `AuthProvider.tsx` manages session state.
3. Unauthenticated users on private routes are redirected to `/login`.
4. Firebase Admin SDK on backend verifies ID tokens for protected API calls.
5. Firestore Security Rules enforce per-user data isolation.

### Security Headers
| Header | Value |
|---|---|
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

# Implementation Plan: Roadmap Generation Wizard UI

## 1. Architectural Overview
We will refactor the current `/generate/page.tsx` from a long scrolling form into a polished, client-side **multi-step wizard** inspired by the IEMxRCC Event Creation UI.

**Key Architecture Decisions:**
- **Single Page, Client-Side:** No route changes between steps. Fast, instant transitions.
- **State Orchestrator:** The parent `GeneratePage` will hold all form state (`goal`, `skill_level`, `learning_style`, `daily_hours`, `target_months`).
- **Framer Motion `AnimatePresence`:** Horizontal slide animations (left/right) based on step direction.
- **Step-Scoped Validation:** Users cannot proceed unless the current step's requirements are met.

## 2. The Step Pipeline

We will divide the generation process into 4 logical steps:

| Step | Icon | Label | Subtitle | Contents |
|---|---|---|---|---|
| 1 | `Target` | The Goal | What to learn | Main goal input, AI auto-suggestions for goal refinement. |
| 2 | `User` | Your Profile | Skill & Style | Current skill level, preferred learning style. |
| 3 | `Clock` | Commitment | Time & Duration | Daily study hours (slider), target duration (months). |
| 4 | `Award` | Assessment & Review | Finalize | Optional Skill Assessment Quiz, review summary, "Generate" button. |

## 3. UI Components to Implement

### 3.1 Wizard Orchestrator (`app/generate/page.tsx`)
- Owns all `useState` hooks for form data.
- Owns `step` and `direction` state.
- Renders the **Desktop Progress Bar** and **Mobile Progress Track**.
- Implements `goToStep`, `handleNext`, `handleBack` with validation logic.
- Wraps the active step in `<AnimatePresence mode="wait" custom={direction}>` and `<motion.div>`.

### 3.2 Step 1: The Goal (`_components/StepGoal.tsx`)
- Minimalist, large-text input for the goal (e.g., "Become a Full Stack Developer").
- Below the input: Interactive chips for suggested goals.
- **AI Suggestion System:** If the goal is > 5 characters, show a "Refine with AI" button that calls an endpoint to suggest a more specific goal, optimal duration, and required starting skill level.

### 3.3 Step 2: Your Profile (`_components/StepProfile.tsx`)
- Two prominent selector areas for **Skill Level** and **Learning Style**.
- Instead of standard dropdowns, use 2-column grids of selectable cards with icons (e.g., `Beginner`, `Intermediate`, `Advanced`).

### 3.4 Step 3: Commitment (`_components/StepCommitment.tsx`)
- High-quality range slider for **Daily Study Time** (0.5 to 8 hours) with dynamic label updating.
- Presets for **Target Duration** (3, 6, 12, 18, 24 months) rendered as selectable pill buttons.

### 3.5 Step 4: Assessment & Review (`_components/StepReview.tsx`)
- A summary panel (label-value rows) showing the choices from Steps 1-3.
- Edit shortcuts (e.g., "Edit Goal") that jump back to specific steps.
- The **Pre-Assessment Quiz** card integrated natively into the review flow.
- A prominent "Generate My Roadmap" button with loading state.

### 3.6 Success Celebration (`ConfettiBurst`)
- Upon successful generation, trigger a confetti animation and transition into a "Roadmap Created!" success view before redirecting to `/roadmap/[id]`.

## 4. Execution Steps

1. **Scaffold Directory:** Create `app/generate/_components/` and the empty step files.
2. **State Lift:** Move the form state in `page.tsx` into the orchestrator pattern.
3. **Build Layout:** Implement the step progress bar and `AnimatePresence` wrapper.
4. **Implement Step 1-3:** Build out the individual step forms, replacing basic inputs with polished grid cards and sliders.
5. **Implement Step 4:** Build the review table and integrate the existing Quiz modal.
6. **Polish:** Add confetti, verify mobile responsiveness, test form validation.
    
# Codebase Deep-Dive Audit

> **Date:** June 2, 2026
> **Scope:** Full codebase review of the Career-Roadmap unified Next.js application
> **Auditor:** AI Assistant (post-migration from Python/Next.js split to unified Next.js)

---

## Summary

| Severity | Count | Description |
|---|---|---|
| 🔴 Critical | 3 | Breaks core functionality or is a security hole |
| 🟠 High | 5 | Significant issues affecting data integrity or UX |
| 🟡 Medium | 6 | Functional but improvable |
| 🔵 Low | 3 | Polish, documentation, and minor issues |
| **Total** | **17** | |

---

## 🔴 Critical

### C1 — `firebase-admin.ts` references deleted backend path

- **File:** `frontend/lib/firebase-admin.ts` (line 9)
- **Problem:** `require('../../backend/serviceAccountKey.json')` — the `backend/` directory was deleted during the monorepo → unified migration. This `require` throws at module load time, caught by the inner try/catch, but the pattern is fundamentally broken.
- **Impact:** Firebase Admin SDK never initializes on Vercel (no service account file exists). Any future server-side Firestore reads would crash.
- **Fix:** Remove the `require()` path entirely. Only use env-var based credential initialization. Add `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` to `.env.example`.

---

### C2 — API routes have zero authentication

- **Files:** All routes under `frontend/app/api/`
- **Problem:** Every API route (`/api/chat`, `/api/roadmaps/generate`, etc.) accepts unauthenticated requests. Anyone can POST to them directly, burning your Gemini API quota.
- **Impact:** On deployment, bots or malicious users can spam the endpoints, exhausting the free-tier Gemini quota. This is the #1 deployment vulnerability.
- **Fix:** Create a shared middleware helper `lib/apiAuth.ts` that:
  1. Reads the `Authorization: Bearer <token>` header
  2. Verifies the Firebase ID token using `firebase-admin`
  3. Returns 401 if invalid
  4. Optionally allow unauthenticated access for specific endpoints with a flag

> ⚠️ **This is the most important security fix.** Without it, the deployed app is an open Gemini API proxy.

---

### C3 — Chat history crashes on second message

- **File:** `frontend/lib/aiService.ts` — `generateChatResponse`
- **Problem:** Gemini's `startChat()` requires the history array to start with a `user` role message. The `AIMentor.tsx` sends the welcome message (which has `role: 'assistant'`) as the first history entry. After the role mapping fix, this becomes `role: 'model'` — but Gemini rejects histories that begin with `model`.
- **Impact:** First user message works (no history), but the second message (with 1 history entry from the assistant) crashes the chat.
- **Fix:** Filter out the initial welcome message (or any leading `model` entries) from the history before passing to `startChat()`. Ensure the history alternates correctly: `user → model → user → model`.

---

## 🟠 High

### H1 — Zustand persists entire `savedRoadmaps` array to localStorage

- **File:** `frontend/store/index.ts` (lines 67-70)
- **Problem:** `partialize` includes `savedRoadmaps`, which contains the full `generated_roadmap` JSON (can be 50KB+ per roadmap). After 10+ roadmaps, localStorage (~5MB limit) fills up and starts silently failing.
- **Impact:** Silent data loss when localStorage quota is exceeded.
- **Fix:** Only persist roadmap IDs and metadata (goal, id, skill_level) in the store. Load the full roadmap from `localStorage.getItem('roadmap_${id}')` on demand.

---

### H2 — `NEXT_PUBLIC_ENABLE_CLOUD_SYNC` missing from `.env.example`

- **File:** `frontend/.env.example`
- **Problem:** The `sync.ts` module gates all Firestore reads/writes behind `NEXT_PUBLIC_ENABLE_CLOUD_SYNC`. But `.env.example` doesn't mention it. Users who set up Firebase correctly will wonder why nothing syncs.
- **Impact:** Firestore sync silently disabled for all new deployments.
- **Fix:** Add `NEXT_PUBLIC_ENABLE_CLOUD_SYNC=true` to `.env.example` with a comment.

---

### H3 — `total_lessons` overview doesn't match actual lesson count

- **File:** `frontend/lib/aiService.ts` — `getFallbackRoadmap`
- **Problem:** The fallback roadmap sets `"total_lessons": 30` in the overview, but only contains 15 actual lessons. Dashboard progress bars use `overview.total_lessons` as the denominator.
- **Impact:** Progress bars show incorrect percentages. Users who complete all 15 lessons see 50% instead of 100%.
- **Fix:** Set `total_lessons` to 15 (matching actual count) and `total_chapters` to 6.

---

### H4 — Gallery page crashes when Firebase config is invalid

- **File:** `frontend/app/gallery/page.tsx` (lines 47-48)
- **Problem:** Gallery page always imports Firestore and attempts to read `public_roadmaps`. If Firebase config has placeholder values, the `getDocs()` call throws and the page stays stuck on the loading spinner forever.
- **Impact:** Gallery page is broken for all non-Firebase deployments.
- **Fix:** Check if `NEXT_PUBLIC_FIREBASE_PROJECT_ID` is a placeholder value before attempting Firestore calls.

---

### H5 — Login page Google SVG icon has wrong path

- **File:** `frontend/app/login/page.tsx` (lines 184-188)
- **Problem:** The Google logo SVG has only one `<path>` with `fill="#EA4335"` (red). The standard Google "G" logo has 4 colored paths.
- **Impact:** The Google sign-in button looks broken/unprofessional.
- **Fix:** Replace with the standard 4-path Google "G" SVG.

---

## 🟡 Medium

### M1 — `AuthProvider` stale closure on `user?.streak`

- **File:** `frontend/components/AuthProvider.tsx` (line 28)
- **Problem:** `user?.streak` references Zustand's `user` at callback time but `user` isn't in the `useEffect` deps.
- **Fix:** Set `streak: 0` in the auth callback and let the dashboard compute it.

### M2 — Profile "Member since" shows today's date

- **File:** `frontend/app/profile/page.tsx` (line 48)
- **Problem:** Uses `user.last_active` as "Member since" — this is set to today on every login.
- **Fix:** Use `auth.currentUser.metadata.creationTime` from Firebase Auth.

### M3 — Roadmap page eslint-disable hides dependency bugs

- **File:** `frontend/app/roadmap/[id]/page.tsx` (line 204)
- **Fix:** Properly list all dependencies.

### M4 — No indication when AI fallback content is served

- **Files:** All API routes
- **Fix:** Add a `source: 'fallback' | 'gemini'` field to API responses. Show a toast in the frontend.

### M5 — Password reset button is fake

- **File:** `frontend/app/profile/page.tsx` (line 231)
- **Fix:** Call `sendPasswordResetEmail(auth, user.email)` from Firebase.

### M6 — Share confirmation uses `alert()` instead of toast

- **File:** `frontend/app/roadmap/[id]/page.tsx` (line 324)
- **Fix:** Replace with `toast.success()` from `sonner`.

---

## 🔵 Low

### L1 — README says heading font is "Merriweather" but code uses Playfair Display

- **File:** `README.md` (line 83) vs `frontend/app/layout.tsx` (line 18)
- **Fix:** Update README.

### L2 — README project structure mentions `api/auth/` that doesn't exist

- **File:** `README.md` (line 195)
- **Fix:** Remove the line.

### L3 — `firebase-admin` is unused production dependency (30MB+)

- **File:** `frontend/package.json` (line 21)
- **Fix:** Implement the auth middleware (C2) that uses it, or move to `devDependencies`.

---

## Documentation Updates Needed

| File | Issue | Fix |
|---|---|---|
| `.env.example` | Missing `NEXT_PUBLIC_ENABLE_CLOUD_SYNC` | Add with default `true` |
| `.env.example` | Missing `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Add for server-side admin SDK |
| `README.md` | Font name wrong (Merriweather → Playfair Display) | Update typography table |
| `README.md` | Ghost `api/auth/` in project structure | Remove line |

---

## Recommended Execution Order

| Phase | Items | Effort |
|---|---|---|
| **Phase 1 — Ship blockers** | C1, C2, C3, H2, H3 | ~2h |
| **Phase 2 — Data integrity** | H1, H4, M4 | ~1.5h |
| **Phase 3 — UX polish** | H5, M2, M5, M6, M1 | ~1h |
| **Phase 4 — Docs** | L1, L2, L3, all doc updates | ~30min |

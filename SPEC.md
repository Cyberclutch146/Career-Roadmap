# RoadmapAI - Specification Document

## 1. Concept & Vision

RoadmapAI is an intelligent educational companion that transforms ambitious learning goals into structured, achievable roadmaps. It feels like having a wise mentor who creates personalized textbooks for your journey. The experience is calm, scholarly, and deeply focused—reminiscent of studying in a well-organized library with premium stationery.

**Core feeling**: A sophisticated digital academic journal that adapts to your learning pace, tracks your progress like a dedicated study partner, and answers questions like a knowledgeable tutor.

## 2. Design Language

### Aesthetic Direction
Inspired by premium academic publications, digital textbooks, and Notion-style productivity tools. Think: a modern university's digital learning management system meets a Moleskine notebook.

### Color Palette
- **Primary Background**: `#FAF9F7` (warm paper white)
- **Secondary Background**: `#F5F3EF` (light cream)
- **Tertiary Background**: `#EEEBE4` (soft beige)
- **Primary Text**: `#1A1A1A` (rich black)
- **Secondary Text**: `#5C5C5C` (warm gray)
- **Muted Text**: `#8B8680` (stone gray)
- **Primary Accent**: `#3B5BDB` (scholarly blue)
- **Secondary Accent**: `#5C7CFA` (light blue)
- **Success**: `#2F9E44` (sage green)
- **Warning**: `#E67700` (amber)
- **Error**: `#C92A2A` (deep red)
- **Border**: `#E5E2DC` (warm border)
- **Divider**: `#DDD9D0` (subtle divider)

### Typography
- **Headings**: "Merriweather" (serif) - scholarly, trustworthy
- **Body**: "Inter" (sans-serif) - clean, readable
- **Code/Technical**: "JetBrains Mono" - monospace for code snippets
- **Scale**: 14px base, 1.5 line-height, modular scale 1.25

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px
- Max content width: 720px (reading), 1200px (dashboard)
- Generous whitespace for readability

### Motion Philosophy
- Subtle, purposeful animations
- Page transitions: fade + slight upward slide (300ms ease-out)
- Hover states: gentle scale (1.02) with soft shadow
- Progress updates: smooth number transitions
- Chapter expansion: accordion with 250ms ease
- No jarring or playful animations—everything feels calm

### Visual Assets
- Custom SVG icons in line style (1.5px stroke)
- Abstract geometric shapes as section dividers
- Progress indicators with clean minimal design
- Subtle paper texture overlays (optional)

## 3. Layout & Structure

### Page Architecture

**Landing Page**
1. Navigation bar (minimal, sticky)
2. Hero section with headline + illustration
3. Feature showcase (3-column grid)
4. Example roadmap preview (interactive)
5. Testimonials carousel
6. CTA section
7. Footer

**Dashboard**
1. Sidebar navigation (collapsible)
2. Main content area with chapter list
3. Progress sidebar
4. Quick actions floating button

**Roadmap View**
1. Chapter sidebar (index)
2. Main reading area (chapters, lessons)
3. Resource panel (collapsible right sidebar)
4. AI Mentor chat (floating button → modal)

**Responsive Strategy**
- Desktop: Full sidebar + content + resources
- Tablet: Collapsible sidebar, full content
- Mobile: Bottom nav, stacked layout, slide-out panels

## 4. Features & Interactions

### AI Roadmap Generator
**Input Form Fields:**
- Goal (text input with suggestions)
- Current Skill Level (dropdown: Beginner/Intermediate/Advanced)
- Daily Study Time (slider: 30min - 8hrs)
- Learning Style (select: Visual/Auditory/Reading/Active)
- Target Duration (dropdown: 3/6/12/18/24 months)

**Output:** Structured roadmap with phases, chapters, timelines

**States:**
- Empty: Form with placeholders
- Loading: Animated progress indicator with tips
- Success: Roadmap preview with "View Full Roadmap" CTA
- Error: Friendly error message with retry

### Interactive Learning Chapters
- Expandable/collapsible chapters
- Lesson cards with completion checkboxes
- Progress bar per chapter
- Reading time estimates
- Bookmark functionality
- Notes section per lesson

**Interactions:**
- Click chapter → expand/collapse
- Click lesson → mark complete
- Hover lesson → show quick actions
- Long press → context menu (bookmark, notes)

### Resource Recommendations
Per topic:
- Documentation links
- YouTube video cards
- Article previews
- Course enroll buttons
- GitHub repo cards
- Practice exercise links

**Display:** Card grid with icons, ratings, difficulty badges

### AI Mentor Assistant
- Chat modal with message history
- Context-aware responses based on roadmap
- Suggested prompts
- Code snippet rendering
- Markdown support

**Interactions:**
- Type message → send with Enter
- Click suggestion → auto-fill
- Hover message → show copy button

### Study Planner
- Weekly calendar view
- Daily task list
- Streak counter
- Goal progress rings
- Revision reminders

### Progress Tracking
- Overall completion percentage
- Chapter progress bars
- Skills radar chart
- Study streaks calendar
- Time spent statistics

### Save & Export
- Save to account (requires auth)
- Export as PDF (formatted)
- Share link generation
- Resume later functionality

## 5. Component Inventory

### Navigation
- **Navbar**: Logo, nav links, user avatar, theme toggle
- **Sidebar**: Chapter index, collapse button, progress mini
- **MobileNav**: Bottom tab bar with 5 icons

### Forms
- **Input**: Label, input field, helper text, error state
- **Select**: Custom styled dropdown
- **Slider**: Track, thumb, value display
- **Button**: Primary, secondary, ghost variants; loading state

### Cards
- **ChapterCard**: Title, progress, lesson count, expand icon
- **LessonCard**: Checkbox, title, duration, resource link
- **ResourceCard**: Icon, title, description, link
- **RoadmapCard**: Phase indicator, title, timeline

### Feedback
- **ProgressBar**: Animated fill, percentage label
- **Toast**: Success/error/info variants
- **Skeleton**: Content placeholder during loading
- **EmptyState**: Illustration, message, CTA

### Chat
- **MessageBubble**: Text, timestamp, copy button
- **ChatInput**: Textarea, send button, suggestions
- **TypingIndicator**: Animated dots

## 6. Technical Approach

### Frontend (Next.js 14)
```
/frontend
├── app/
│   ├── page.tsx (landing)
│   ├── dashboard/page.tsx
│   ├── roadmap/[id]/page.tsx
│   ├── api/ (API routes if needed)
├── components/
├── lib/
├── hooks/
├── styles/
```

### Backend (FastAPI)
```
/backend
├── main.py              # Routes, CORS, rate limiting, Firebase ID token checks
├── schemas.py           # Pydantic v2 models with validation
├── services/
│   ├── ai_service.py    # Gemini async integration + fallback templates
│   └── auth.py          # Firebase Admin Token verification
├── tests/
│   └── test_api.py      # pytest suite
└── requirements.txt
```

### API Design

**POST /api/roadmaps/generate**
```json
Request: {
  "goal": "string",
  "skill_level": "beginner|intermediate|advanced",
  "daily_hours": 1.5,
  "learning_style": "visual|auditory|reading|active",
  "target_months": 6
}
Response: {
  "id": "string",
  "overview": {...},
  "phases": [...],
  "chapters": [...],
  "resources": {...}
}
```

**GET /api/roadmaps/{id}**
- Returns saved roadmap

**PUT /api/roadmaps/{id}/progress**
Progress is now managed directly on the frontend using Firebase Firestore.

**POST /api/chat**
```json
Request: {
  "roadmap_id": "string",
  "message": "string"
}
Response: {
  "reply": "string",
  "suggestions": [...]
}
```

### Data Model (Firestore)

**users/{userId}/roadmaps/{roadmapId}**
- goal, skill_level, daily_hours, learning_style, target_months
- generated_roadmap (JSON), created_at, updated_at

**users/{userId}/roadmaps/{roadmapId}/progress/{lessonId}**
- completed, completed_at

### Authentication
- Firebase Authentication for seamless client-side auth.
- Firebase Admin SDK on the backend to verify ID tokens.
- Firestore Security Rules enforce strict per-user data isolation.
- Rate limiting via SlowAPI (5/min generate, 20/min chat)

### Security Headers (Frontend)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Environment Variables
```
# Backend (backend/.env)
GEMINI_API_KEY=<optional>
CORS_ORIGINS=http://localhost:3000
GOOGLE_APPLICATION_CREDENTIALS=<optional_path_to_firebase_admin_json>

# Frontend (frontend/.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

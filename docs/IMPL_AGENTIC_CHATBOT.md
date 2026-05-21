# Implementation Plan: Agentic RAG Chatbot

## 1. Architectural Overview
We will upgrade the current `AIMentor` from a simple conversational bot into a **Server-Side Agentic RAG Chatbot** based on the NexusAid architecture. It will be capable of reasoning, executing function calls (tools), retrieving context, and returning rich UI actions.

**Key Architecture Decisions:**
- **ReAct Loop (Backend):** Python FastAPI backend using `google-generativeai` function calling. The AI will enter a Reason + Act loop (max 3 iterations) per user message.
- **RAG (Retrieval-Augmented Generation):** Injecting the user's active roadmap, progress, and relevant learning resources directly into the System Prompt.
- **Semantic Resource Search:** Using Gemini to rank and find relevant resources/lessons based on user intent, rather than basic keyword matching.
- **Rich Action Rendering (Frontend):** The React ChatWidget will render actionable cards (e.g., "Take Quiz", "Mark Complete", "View Resource") based on structured JSON returned by the backend.

## 2. Agentic Tool Arsenal (Function Calling)

The AI will be equipped with the following declared tools in `ai_service.py`:

| Tool Name | Purpose | Parameters |
|---|---|---|
| `search_resources` | Find external links, videos, or internal lessons matching a topic via Semantic Search. | `query: str` |
| `update_lesson_status` | Mark a specific lesson as completed or in-progress on behalf of the user. | `lesson_id: str, status: str` |
| `generate_mini_quiz` | Generate a quick 3-question quiz to test the user's knowledge on a specific concept. | `topic: str, difficulty: str` |
| `navigate_to_view` | Command the frontend to jump to a specific tab (Content, Code, Notes) or page (Dashboard). | `view_name: str` |

## 3. Backend Implementation (`backend/services/ai_service.py`)

### 3.1 The ReAct Loop
We will modify `generate_chat_response` to implement the execution loop:
1. Send message + RAG context to Gemini.
2. If response contains `function_call`:
   - Execute the corresponding local Python function (e.g., `handle_search_resources`).
   - Append the `function_response` to the chat history.
   - Loop back to Gemini for the final natural language answer.
3. If response is text: Return to frontend alongside any `action_metadata` for UI rendering.

### 3.2 Context Injection (RAG)
Before calling Gemini, we will build a dynamic system prompt:
- **User Profile:** Skill level, preferred learning style.
- **Roadmap Context:** Current active chapter, completed lessons, upcoming lessons.
- **System Instructions:** Directives on when to use tools (e.g., "If the user asks to mark a lesson done, use the `update_lesson_status` tool.")

## 4. Frontend Implementation (`frontend/components/AIMentor.tsx`)

### 4.1 Rich Message Rendering
Update the chat message map to render custom UI blocks based on an `action` payload from the server:
- `action.type === 'quiz_generated'` -> Render an interactive quiz card directly in the chat stream.
- `action.type === 'resource_results'` -> Render clickable resource links with icons.
- `action.type === 'navigation'` -> Render a "Take me there" button or auto-navigate via Next.js router.

### 4.2 State Synchronization
When the chatbot executes an action like `update_lesson_status`, it needs to trigger a state refresh in the Zustand store (`useStore`) so the Roadmap Viewer UI updates instantly to reflect the AI's action.

## 5. Execution Steps

1. **Backend Tools:** Define the Python tool schemas and implementation functions in `ai_service.py`.
2. **Backend Loop:** Implement the ReAct loop handling `function_call` parts in the Gemini SDK.
3. **Context Builder:** Write the RAG context assembler that formats the user's roadmap state.
4. **Frontend API:** Update the `/api/chat` Axios call to handle the new rich response format (`reply`, `action`).
5. **Frontend UI:** Build the React components for rendering rich chat actions (Quiz Card, Resource Card).
6. **Integration:** Connect the AI's backend actions to the frontend Zustand store (e.g., updating progress).

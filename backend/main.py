from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any
from datetime import datetime, timezone
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import uuid
import os

from schemas import (
    RoadmapGenerationRequest,
    GeneratedRoadmap,
    ChatRequest,
    ChatResponse,
    AssessmentRequest,
    AssessmentResponse,
    InterviewChatRequest,
    InterviewChatResponse
)
from services.ai_service import AIService
from services.auth import get_optional_user

# ---------------------------------------------------------------------------
# Rate limiter
# ---------------------------------------------------------------------------
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="RoadmapAI Microservice",
    description="AI-powered educational roadmap generator",
    version="2.0.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ---------------------------------------------------------------------------
# CORS — configurable via environment for production deployments
# ---------------------------------------------------------------------------
_raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
CORS_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ai_service = AIService()

# ---------------------------------------------------------------------------
# Info
# ---------------------------------------------------------------------------

@app.get("/")
async def root():
    return {
        "message": "Welcome to RoadmapAI Microservice",
        "version": "2.0.0",
        "docs": "/docs",
        "ai_available": ai_service.is_available()
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "ai_service": ai_service.is_available()
    }

# ---------------------------------------------------------------------------
# Roadmaps
# ---------------------------------------------------------------------------

@app.post("/api/roadmaps/generate")
@limiter.limit("5/minute")
async def generate_roadmap(
    request: Request,
    body: RoadmapGenerationRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    generated_roadmap = await ai_service.generate_roadmap(
        goal=body.goal,
        skill_level=body.skill_level.value,
        daily_hours=body.daily_hours,
        learning_style=body.learning_style.value,
        target_months=body.target_months,
        assessment_score=body.assessment_score
    )

    now = datetime.now(timezone.utc)
    roadmap_id = str(uuid.uuid4())

    return {
        "id": roadmap_id,
        "user_id": current_user["user_id"] if current_user else None,
        "goal": body.goal,
        "skill_level": body.skill_level,
        "daily_hours": body.daily_hours,
        "learning_style": body.learning_style,
        "target_months": body.target_months,
        "generated_roadmap": generated_roadmap,
        "created_at": now.isoformat(),
        "updated_at": now.isoformat()
    }

# ---------------------------------------------------------------------------
# Assessments & Interview Prep
# ---------------------------------------------------------------------------

@app.post("/api/assessment/generate", response_model=AssessmentResponse)
@limiter.limit("10/minute")
async def generate_assessment(
    request: Request,
    body: AssessmentRequest
):
    questions = await ai_service.generate_assessment_quiz(
        goal=body.goal,
        skill_level=body.skill_level
    )
    return AssessmentResponse(questions=questions)


@app.post("/api/interview/chat", response_model=InterviewChatResponse)
@limiter.limit("20/minute")
async def interview_chat(
    request: Request,
    body: InterviewChatRequest
):
    result = await ai_service.generate_interview_response(
        roadmap_goal=body.roadmap_goal,
        phase_name=body.phase_name,
        phase_description=body.phase_description,
        user_answer=body.user_answer,
        history=body.history
    )
    return InterviewChatResponse(
        next_question=result["next_question"],
        feedback=result["feedback"],
        final_evaluation=result["final_evaluation"],
        history=result["history"]
    )


# ---------------------------------------------------------------------------
# Chat / AI Mentor
# ---------------------------------------------------------------------------

@app.post("/api/chat", response_model=ChatResponse)
@limiter.limit("20/minute")
async def chat_with_mentor(
    request: Request,
    chat_request: ChatRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    user_message = chat_request.message
    roadmap_context = chat_request.roadmap_context

    response = await ai_service.generate_chat_response(
        roadmap_context=roadmap_context,
        user_message=user_message
    )

    return ChatResponse(
        reply=response["reply"],
        suggestions=response["suggestions"]
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

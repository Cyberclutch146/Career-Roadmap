from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import uuid
import os

from database import DatabaseConnection, get_database
from schemas import (
    RoadmapGenerationRequest,
    RoadmapResponse,
    RoadmapCreateResponse,
    ProgressUpdate,
    ChatRequest,
    ChatResponse,
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
    GeneratedRoadmap
)
from models import (
    UserRepository,
    RoadmapRepository,
    ProgressRepository,
    ChatHistoryRepository
)
from services.ai_service import AIService
from services.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    get_optional_user
)

# ---------------------------------------------------------------------------
# Rate limiter
# ---------------------------------------------------------------------------
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await DatabaseConnection.connect()
    yield
    await DatabaseConnection.disconnect()


app = FastAPI(
    title="RoadmapAI API",
    description="AI-powered educational roadmap generator",
    version="1.0.0",
    lifespan=lifespan
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
# Helpers
# ---------------------------------------------------------------------------

def _verify_roadmap_access(
    roadmap: Dict[str, Any],
    current_user: Optional[Dict[str, Any]]
) -> None:
    """Raise 403 if the roadmap belongs to a specific user and the caller
    is not that user. Guest-generated roadmaps (user_id=None) are public."""
    owner = roadmap.get("user_id")
    if owner is None:
        return
    if current_user is None or current_user.get("user_id") != owner:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this roadmap"
        )


# ---------------------------------------------------------------------------
# Info
# ---------------------------------------------------------------------------

@app.get("/")
async def root():
    return {
        "message": "Welcome to RoadmapAI API",
        "version": "1.0.0",
        "docs": "/docs",
        "ai_available": ai_service.is_available()
    }


@app.get("/health")
async def health_check():
    db_status = "disconnected"
    try:
        db = get_database()
        await db.command("ping")
        db_status = "connected"
    except Exception:
        pass
    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status,
        "ai_service": ai_service.is_available()
    }


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

@app.post("/api/auth/register", response_model=TokenResponse)
@limiter.limit("10/minute")
async def register(request: Request, user_data: UserCreate):
    existing_user = await UserRepository.find_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    user_id = await UserRepository.create(
        email=user_data.email,
        password=hash_password(user_data.password),
        name=user_data.name
    )

    access_token = create_access_token(user_id, user_data.email)

    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=user_id,
            email=user_data.email,
            name=user_data.name,
            created_at=datetime.now(timezone.utc)
        )
    )


@app.post("/api/auth/login", response_model=TokenResponse)
@limiter.limit("10/minute")
async def login(request: Request, login_data: UserLogin):
    user = await UserRepository.find_by_email(login_data.email)
    if not user or not verify_password(login_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(user["_id"], user["email"])

    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=user["_id"],
            email=user["email"],
            name=user["name"],
            created_at=user.get("created_at")
        )
    )


# ---------------------------------------------------------------------------
# Roadmaps
# ---------------------------------------------------------------------------

@app.post("/api/roadmaps/generate", response_model=RoadmapResponse)
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
        target_months=body.target_months
    )

    now = datetime.now(timezone.utc)
    roadmap_id = str(uuid.uuid4())
    roadmap_data = {
        "id": roadmap_id,
        "user_id": current_user["user_id"] if current_user else None,
        "goal": body.goal,
        "skill_level": body.skill_level.value,
        "daily_hours": body.daily_hours,
        "learning_style": body.learning_style.value,
        "target_months": body.target_months,
        "generated_roadmap": generated_roadmap,
        "created_at": now,
        "updated_at": now,
    }

    await RoadmapRepository.create(roadmap_data)

    return RoadmapResponse(
        id=roadmap_id,
        user_id=current_user["user_id"] if current_user else None,
        goal=body.goal,
        skill_level=body.skill_level,
        daily_hours=body.daily_hours,
        learning_style=body.learning_style,
        target_months=body.target_months,
        generated_roadmap=GeneratedRoadmap(**generated_roadmap),
        created_at=now,
        updated_at=now,
    )


@app.get("/api/roadmaps/{roadmap_id}", response_model=RoadmapResponse)
async def get_roadmap(
    roadmap_id: str,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    roadmap = await RoadmapRepository.find_by_id(roadmap_id)
    if not roadmap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Roadmap not found"
        )

    _verify_roadmap_access(roadmap, current_user)
    return roadmap


@app.get("/api/roadmaps")
async def get_user_roadmaps(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    roadmaps = await RoadmapRepository.find_by_user(current_user["user_id"])
    return roadmaps


@app.delete("/api/roadmaps/{roadmap_id}")
async def delete_roadmap(
    roadmap_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    roadmap = await RoadmapRepository.find_by_id(roadmap_id)
    if not roadmap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Roadmap not found"
        )

    _verify_roadmap_access(roadmap, current_user)
    success = await RoadmapRepository.delete(roadmap_id)
    return {"success": success}


# ---------------------------------------------------------------------------
# Progress
# ---------------------------------------------------------------------------

@app.put("/api/roadmaps/{roadmap_id}/progress")
async def update_progress(
    roadmap_id: str,
    progress_update: ProgressUpdate,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    roadmap = await RoadmapRepository.find_by_id(roadmap_id)
    if not roadmap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Roadmap not found"
        )

    _verify_roadmap_access(roadmap, current_user)

    await ProgressRepository.upsert(
        roadmap_id=roadmap_id,
        lesson_id=progress_update.lesson_id,
        completed=progress_update.completed
    )

    completed_count = await ProgressRepository.get_completed_count(roadmap_id)

    return {
        "success": True,
        "completed_lessons": completed_count
    }


@app.get("/api/roadmaps/{roadmap_id}/progress")
async def get_progress(
    roadmap_id: str,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    roadmap = await RoadmapRepository.find_by_id(roadmap_id)
    if not roadmap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Roadmap not found"
        )

    _verify_roadmap_access(roadmap, current_user)

    progress = await ProgressRepository.get_by_roadmap(roadmap_id)
    completed_count = await ProgressRepository.get_completed_count(roadmap_id)

    return {
        "progress": progress,
        "completed_count": completed_count
    }


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
    roadmap = await RoadmapRepository.find_by_id(chat_request.roadmap_id)
    if not roadmap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Roadmap not found"
        )

    _verify_roadmap_access(roadmap, current_user)

    user_message = chat_request.message
    await ChatHistoryRepository.add_message(
        roadmap_id=chat_request.roadmap_id,
        role="user",
        content=user_message
    )

    roadmap_context = {
        "goal": roadmap.get("goal"),
        "progress": "In progress",
        "phases": roadmap.get("generated_roadmap", {}).get("phases", [])
    }

    response = await ai_service.generate_chat_response(
        roadmap_context=roadmap_context,
        user_message=user_message
    )

    await ChatHistoryRepository.add_message(
        roadmap_id=chat_request.roadmap_id,
        role="assistant",
        content=response["reply"]
    )

    return ChatResponse(
        reply=response["reply"],
        suggestions=response["suggestions"]
    )


@app.get("/api/chat/{roadmap_id}/history")
async def get_chat_history(
    roadmap_id: str,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    roadmap = await RoadmapRepository.find_by_id(roadmap_id)
    if not roadmap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Roadmap not found"
        )

    _verify_roadmap_access(roadmap, current_user)

    messages = await ChatHistoryRepository.get_messages(roadmap_id)
    return {"messages": messages}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

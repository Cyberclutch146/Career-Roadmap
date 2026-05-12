from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from typing import Optional, List, Dict, Any
import uuid

from database import DatabaseConnection
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ai_service = AIService()


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
    return {
        "status": "healthy",
        "database": "connected",
        "ai_service": ai_service.is_available()
    }


@app.post("/api/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
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
            created_at=None
        )
    )


@app.post("/api/auth/login", response_model=TokenResponse)
async def login(login_data: UserLogin):
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


@app.post("/api/roadmaps/generate", response_model=RoadmapResponse)
async def generate_roadmap(
    request: RoadmapGenerationRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    generated_roadmap = await ai_service.generate_roadmap(
        goal=request.goal,
        skill_level=request.skill_level.value,
        daily_hours=request.daily_hours,
        learning_style=request.learning_style.value,
        target_months=request.target_months
    )

    roadmap_id = str(uuid.uuid4())
    roadmap_data = {
        "id": roadmap_id,
        "user_id": current_user["user_id"] if current_user else None,
        "goal": request.goal,
        "skill_level": request.skill_level.value,
        "daily_hours": request.daily_hours,
        "learning_style": request.learning_style.value,
        "target_months": request.target_months,
        "generated_roadmap": generated_roadmap
    }

    saved_id = await RoadmapRepository.create(roadmap_data)
    roadmap_data["_id"] = saved_id

    return RoadmapResponse(
        id=roadmap_id,
        user_id=current_user["user_id"] if current_user else None,
        goal=request.goal,
        skill_level=request.skill_level,
        daily_hours=request.daily_hours,
        learning_style=request.learning_style,
        target_months=request.target_months,
        generated_roadmap=GeneratedRoadmap(**generated_roadmap),
        created_at=roadmap_data.get("created_at"),
        updated_at=roadmap_data.get("updated_at")
    )


@app.get("/api/roadmaps/{roadmap_id}")
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

    return roadmap


@app.get("/api/roadmaps")
async def get_user_roadmaps(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    roadmaps = await RoadmapRepository.find_by_user(current_user["user_id"])
    return roadmaps


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
    progress = await ProgressRepository.get_by_roadmap(roadmap_id)
    completed_count = await ProgressRepository.get_completed_count(roadmap_id)

    return {
        "progress": progress,
        "completed_count": completed_count
    }


@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_mentor(
    chat_request: ChatRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    roadmap = await RoadmapRepository.find_by_id(chat_request.roadmap_id)
    if not roadmap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Roadmap not found"
        )

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
    messages = await ChatHistoryRepository.get_messages(roadmap_id)
    return {"messages": messages}


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

    if roadmap.get("user_id") != current_user["user_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this roadmap"
        )

    success = await RoadmapRepository.delete(roadmap_id)

    return {"success": success}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

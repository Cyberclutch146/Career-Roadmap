from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class SkillLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class LearningStyle(str, Enum):
    VISUAL = "visual"
    AUDITORY = "auditory"
    READING = "reading"
    ACTIVE = "active"


class RoadmapGenerationRequest(BaseModel):
    goal: str = Field(..., min_length=2, max_length=200)
    skill_level: SkillLevel
    daily_hours: float = Field(..., gt=0, le=8)
    learning_style: LearningStyle
    target_months: int = Field(..., gt=0, le=36)


class ResourceItem(BaseModel):
    type: str
    title: str
    url: str
    description: Optional[str] = None
    difficulty: Optional[str] = None
    rating: Optional[float] = None


class Lesson(BaseModel):
    id: str
    title: str
    description: str
    duration_minutes: int
    resources: List[ResourceItem] = []
    practice_exercises: List[str] = []
    completed: bool = False


class Chapter(BaseModel):
    id: str
    title: str
    description: str
    lessons: List[Lesson]
    estimated_hours: float
    completed: bool = False


class Phase(BaseModel):
    id: str
    name: str
    description: str
    chapters: List[Chapter]
    estimated_weeks: int
    completed: bool = False


class LearningObjective(BaseModel):
    id: str
    objective: str
    mastered: bool = False


class TimelineWeek(BaseModel):
    week: int
    focus: str
    tasks: List[str]


class RoadmapOverview(BaseModel):
    title: str
    description: str
    total_estimated_hours: float
    total_lessons: int
    total_chapters: int
    difficulty_start: str
    difficulty_end: str


class GeneratedRoadmap(BaseModel):
    overview: RoadmapOverview
    learning_objectives: List[LearningObjective]
    timeline_weeks: List[TimelineWeek]
    phases: List[Phase]
    resources: Dict[str, List[ResourceItem]]
    revision_strategy: str
    interview_preparation: str
    final_assessment: str


class RoadmapResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    goal: str
    skill_level: SkillLevel
    daily_hours: float
    learning_style: LearningStyle
    target_months: int
    generated_roadmap: GeneratedRoadmap
    created_at: datetime
    updated_at: datetime


class RoadmapCreateResponse(BaseModel):
    id: str
    message: str


class ProgressUpdate(BaseModel):
    lesson_id: str
    completed: bool


class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: datetime = Field(default_factory=datetime.now)


class ChatRequest(BaseModel):
    roadmap_id: str
    message: str


class ChatResponse(BaseModel):
    reply: str
    suggestions: List[str] = []


class UserCreate(BaseModel):
    email: str
    password: str
    name: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

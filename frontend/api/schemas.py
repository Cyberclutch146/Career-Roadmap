from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
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
    assessment_score: Optional[float] = None


class AssessmentRequest(BaseModel):
    goal: str
    skill_level: str


class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    answer_index: int
    explanation: str


class AssessmentResponse(BaseModel):
    questions: List[QuizQuestion]


class InterviewChatRequest(BaseModel):
    roadmap_goal: str
    phase_name: str
    phase_description: str
    user_answer: str
    history: List[Dict[str, Any]] = []


class InterviewChatResponse(BaseModel):
    next_question: Optional[str] = None
    feedback: Optional[str] = None
    final_evaluation: Optional[str] = None
    history: List[Dict[str, Any]]



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
    # Optional to avoid 500 when timestamps aren't yet persisted
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class DebugRequest(BaseModel):
    js_code: str
    html_code: str
    css_code: str
    error_message: str


class DebugResponse(BaseModel):
    explanation: str
    fixed_code: str


class SummarizeRequest(BaseModel):
    lesson_title: str
    lesson_description: str
    resources: List[ResourceItem] = []
    exercises: List[str] = []


class SummarizeResponse(BaseModel):
    markdown_summary: str


class RoadmapCreateResponse(BaseModel):
    id: str
    message: str


class ProgressUpdate(BaseModel):
    lesson_id: str
    completed: bool


class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ChatRequest(BaseModel):
    roadmap_context: Dict[str, Any]
    message: str = Field(..., min_length=1, max_length=2000)
    history: List[Dict[str, Any]] = []


class ChatResponse(BaseModel):
    reply: str
    suggestions: List[str] = []
    action: Optional[Dict[str, Any]] = None


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    name: str = Field(..., min_length=1, max_length=100)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    # Optional to avoid 500 when timestamp isn't returned from DB query
    created_at: Optional[datetime] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

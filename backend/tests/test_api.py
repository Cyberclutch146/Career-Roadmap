import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from unittest.mock import patch, AsyncMock

from main import app

@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

class TestHealth:
    @pytest.mark.asyncio
    async def test_health_endpoint_exists(self, client):
        """Health endpoint should respond with status healthy."""
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

class TestRoadmaps:
    @pytest.mark.asyncio
    async def test_generate_requires_valid_input(self, client):
        """Roadmap generation should reject empty goal."""
        response = await client.post("/api/roadmaps/generate", json={
            "goal": "",
            "skill_level": "beginner",
            "daily_hours": 2,
            "learning_style": "reading",
            "target_months": 6
        })
        assert response.status_code == 422

    @pytest.mark.asyncio
    @patch("services.ai_service.AIService.generate_roadmap", new_callable=AsyncMock)
    async def test_generate_roadmap_success(self, mock_generate, client):
        """Roadmap generation should succeed and return the generated roadmap."""
        mock_generate.return_value = {
            "overview": {
                "title": "Learn FastAPI",
                "description": "FastAPI roadmap description",
                "total_estimated_hours": 30,
                "total_lessons": 5,
                "total_chapters": 1,
                "difficulty_start": "beginner",
                "difficulty_end": "intermediate"
            },
            "learning_objectives": [],
            "timeline_weeks": [],
            "phases": [],
            "resources": {
                "documentation": [],
                "videos": [],
                "articles": [],
                "courses": [],
                "github": [],
                "practice": []
            },
            "revision_strategy": "practice",
            "interview_preparation": "prep",
            "final_assessment": "capstone"
        }

        response = await client.post("/api/roadmaps/generate", json={
            "goal": "FastAPI development",
            "skill_level": "beginner",
            "daily_hours": 2,
            "learning_style": "reading",
            "target_months": 6
        })
        assert response.status_code == 200
        data = response.json()
        assert data["goal"] == "FastAPI development"
        assert "generated_roadmap" in data
        assert data["generated_roadmap"]["overview"]["title"] == "Learn FastAPI"

class TestAssessment:
    @pytest.mark.asyncio
    @patch("services.ai_service.AIService.generate_assessment_quiz", new_callable=AsyncMock)
    async def test_generate_assessment_success(self, mock_quiz, client):
        """Assessment generation should succeed and return quiz questions."""
        mock_quiz.return_value = [
            {
                "question": "What is FastAPI?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "answer_index": 0,
                "explanation": "It is a Python web framework."
            }
        ]

        response = await client.post("/api/assessment/generate", json={
            "goal": "FastAPI",
            "skill_level": "beginner"
        })
        assert response.status_code == 200
        data = response.json()
        assert "questions" in data
        assert len(data["questions"]) == 1
        assert data["questions"][0]["question"] == "What is FastAPI?"

class TestInterviewChat:
    @pytest.mark.asyncio
    @patch("services.ai_service.AIService.generate_interview_response", new_callable=AsyncMock)
    async def test_interview_chat_success(self, mock_interview, client):
        """Interview chat endpoint should succeed and return feedback/next question."""
        mock_interview.return_value = {
            "next_question": "Explain Pydantic models.",
            "feedback": "Great overview of FastAPI.",
            "final_evaluation": None,
            "history": [{"question": "What is FastAPI?", "answer": "A web framework", "feedback": "Great overview of FastAPI."}]
        }

        response = await client.post("/api/interview/chat", json={
            "roadmap_goal": "FastAPI",
            "phase_name": "Fundamentals",
            "phase_description": "Learn the basics",
            "user_answer": "A web framework",
            "history": [{"question": "What is FastAPI?", "answer": None, "feedback": None}]
        })
        assert response.status_code == 200
        data = response.json()
        assert data["next_question"] == "Explain Pydantic models."
        assert data["feedback"] == "Great overview of FastAPI."

class TestMentorChat:
    @pytest.mark.asyncio
    @patch("services.ai_service.AIService.generate_chat_response", new_callable=AsyncMock)
    async def test_mentor_chat_success(self, mock_chat, client):
        """Mentor chat endpoint should return mentor response and suggestions."""
        mock_chat.return_value = {
            "reply": "Here is how you define a route in FastAPI.",
            "suggestions": ["Show me an example", "How about query parameters?"]
        }

        response = await client.post("/api/chat", json={
            "roadmap_context": {"goal": "FastAPI"},
            "message": "How to define a route?"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["reply"] == "Here is how you define a route in FastAPI."
        assert "suggestions" in data
        assert len(data["suggestions"]) == 2


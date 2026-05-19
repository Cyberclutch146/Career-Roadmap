import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from unittest.mock import patch, MagicMock

from main import app

@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

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

class TestHealth:
    @pytest.mark.asyncio
    async def test_health_endpoint_exists(self, client):
        """Health endpoint should respond."""
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data

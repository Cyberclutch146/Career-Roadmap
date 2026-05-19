import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, patch, MagicMock
import os

# Set required env vars BEFORE importing the app
os.environ["JWT_SECRET"] = "test-secret-key-minimum-length-32-chars-ok"
os.environ["MONGODB_URI"] = "mongodb://localhost:27017"
os.environ["DATABASE_NAME"] = "roadmapai_test"

from main import app
from services.auth import create_access_token


@pytest.fixture
def test_user():
    return {"user_id": "test-user-123", "email": "test@example.com"}


@pytest.fixture
def auth_headers(test_user):
    token = create_access_token(test_user["user_id"], test_user["email"])
    return {"Authorization": f"Bearer {token}"}


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


class TestAuth:
    @pytest.mark.asyncio
    async def test_register_invalid_email(self, client):
        """Registration should reject invalid email."""
        response = await client.post("/api/auth/register", json={
            "email": "not-an-email",
            "password": "validpassword123",
            "name": "Test User"
        })
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_register_short_password(self, client):
        """Registration should reject passwords shorter than 8 characters."""
        response = await client.post("/api/auth/register", json={
            "email": "valid@example.com",
            "password": "short",
            "name": "Test User"
        })
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_login_wrong_credentials(self, client):
        """Login with wrong credentials should return 401."""
        with patch("main.UserRepository.find_by_email", return_value=None):
            response = await client.post("/api/auth/login", json={
                "email": "noone@example.com",
                "password": "wrongpassword"
            })
        assert response.status_code == 401


class TestRoadmaps:
    @pytest.mark.asyncio
    async def test_get_nonexistent_roadmap(self, client):
        """Fetching a roadmap that doesn't exist should return 404."""
        with patch("main.RoadmapRepository.find_by_id", return_value=None):
            response = await client.get("/api/roadmaps/nonexistent-id")
        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_idor_protection(self, client, auth_headers):
        """A user should not be able to access another user's roadmap."""
        other_user_roadmap = {
            "id": "some-roadmap-id",
            "user_id": "other-user-456",
            "goal": "Learn Python",
            "skill_level": "beginner",
            "daily_hours": 2.0,
            "learning_style": "reading",
            "target_months": 6,
            "generated_roadmap": {}
        }
        with patch("main.RoadmapRepository.find_by_id", return_value=other_user_roadmap):
            response = await client.get(
                "/api/roadmaps/some-roadmap-id",
                headers=auth_headers
            )
        assert response.status_code == 403

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
        with patch("main.get_database") as mock_db:
            mock_db.return_value.command = AsyncMock(return_value={"ok": 1})
            response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "database" in data

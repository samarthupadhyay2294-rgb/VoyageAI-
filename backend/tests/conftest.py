import pytest
import asyncio
import os
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Set up test environment variables before importing app
os.environ.setdefault("SUPABASE_URL", "https://test.supabase.co")
os.environ.setdefault("SUPABASE_ANON_KEY", "test-anon-key")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "test-service-key")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key")
os.environ.setdefault("ENVIRONMENT", "test")
os.environ.setdefault("DEBUG", "true")

from app.main import app
from app.config import settings
from app.core.auth import supabase
from app.database.repository import TripRepository


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    return TestClient(app)


@pytest.fixture
def mock_supabase():
    """Mock Supabase client for testing."""
    with patch('app.core.auth.supabase') as mock:
        # Mock the table method to return a mock query builder
        mock_table = MagicMock()
        mock.table.return_value = mock_table

        # Mock common operations
        mock_table.insert.return_value = mock_table
        mock_table.select.return_value = mock_table
        mock_table.update.return_value = mock_table
        mock_table.delete.return_value = mock_table
        mock_table.eq.return_value = mock_table
        mock_table.single.return_value = mock_table
        mock_table.execute.return_value = MagicMock(data=None)
        mock_table.order.return_value = mock_table
        mock_table.range.return_value = mock_table

        yield mock


@pytest.fixture
def mock_redis():
    """Mock Redis client for testing."""
    with patch('app.core.cache.redis_client') as mock:
        mock.ping = AsyncMock(return_value=True)
        mock.get = AsyncMock(return_value=None)
        mock.set = AsyncMock(return_value=True)
        mock.delete = AsyncMock(return_value=True)
        yield mock


@pytest.fixture
def sample_trip_data():
    """Sample trip data for testing."""
    return {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "user_id": "test-user-123",
        "origin": "New York (JFK)",
        "destination": "Paris, France",
        "start_date": "2026-09-10",
        "end_date": "2026-09-17",
        "travelers": 2,
        "budget": 3400,
        "currency": "USD",
        "interests": ["museums", "historical_places"],
        "travel_style": "cultural",
        "status": "draft",
        "created_at": "2026-09-01T00:00:00Z",
        "updated_at": "2026-09-01T00:00:00Z",
    }


@pytest.fixture
def sample_trip_plan_data():
    """Sample trip plan data for testing."""
    return {
        "id": "plan-123",
        "trip_id": "123e4567-e89b-12d3-a456-426614174000",
        "location_intelligence": {"city": "Paris", "country": "France"},
        "weather": {"current": {"temp": 20}},
        "flights": {"options": [], "best_option": None},
        "hotels": {"options": [], "best_option": None},
        "places": {"attractions": [], "activities": []},
        "restaurants": {"breakfast": [], "lunch": [], "dinner": []},
        "budget_breakdown": {"total_budget": 3400},
        "hero_image": "https://example.com/image.jpg",
        "gallery": [],
        "itinerary": {"summary": "Test itinerary", "days": []},
        "ai_summary": "Test AI summary",
        "created_at": "2026-09-01T00:00:00Z",
        "updated_at": "2026-09-01T00:00:00Z",
    }


@pytest.fixture
def auth_headers():
    """Mock authentication headers."""
    return {"Authorization": "Bearer test-token"}

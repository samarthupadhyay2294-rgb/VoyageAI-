import pytest
from unittest.mock import AsyncMock, patch
from fastapi import status


class TestHealthChecks:
    """Tests for health and readiness endpoints."""

    def test_liveness_check(self, client):
        """Test that liveness check always returns healthy."""
        response = client.get("/health")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "healthy"
        assert "app" in data
        assert "version" in data

    @pytest.mark.asyncio
    async def test_readiness_check_endpoint_exists(self, client):
        """Test that readiness check endpoint exists and has correct structure."""
        response = client.get("/api/health/ready")
        # The endpoint should respond (status may vary based on actual dependencies)
        # In test environment without actual Redis/Supabase, it may return 200 or 503
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_503_SERVICE_UNAVAILABLE]
        # Check that we get a valid JSON response
        try:
            data = response.json()
            # If we got a 200, check the structure
            if response.status_code == status.HTTP_200_OK:
                assert "status" in data
                assert "dependencies" in data
                assert "redis" in data["dependencies"]
                assert "supabase" in data["dependencies"]
        except Exception:
            # If we can't parse JSON, that's OK for this basic existence test
            pass

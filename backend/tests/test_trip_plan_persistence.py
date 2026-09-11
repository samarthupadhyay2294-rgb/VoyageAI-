"""
Trip plan persistence tests.

These tests verify the database layer trip plan creation and update logic.
"""

import pytest
from unittest.mock import AsyncMock, MagicMock
from app.database.repository import TripRepository


class TestTripPlanPersistence:
    """Tests for trip plan creation and regeneration logic."""

    @pytest.mark.asyncio
    async def test_create_trip_plan_when_none_exists(self, mock_supabase, sample_trip_plan_data):
        """Test that a new trip plan is created when none exists."""
        # Setup mock to return no existing plan
        mock_supabase.table.return_value.select.return_value.eq.return_value.eq.return_value.single.return_value.execute.return_value.data = None

        # Setup mock for successful creation
        mock_supabase.table.return_value.insert.return_value.execute.return_value.data = [sample_trip_plan_data]

        repo = TripRepository(mock_supabase)
        result = await repo.create_trip_plan(sample_trip_plan_data)

        assert result is not None
        assert result["id"] == sample_trip_plan_data["id"]

    @pytest.mark.asyncio
    async def test_create_trip_plan_duplicate_prevention(self, mock_supabase, sample_trip_plan_data):
        """Test that duplicate trip plans are prevented at database level."""
        # Setup mock to simulate duplicate key error
        mock_supabase.table.return_value.insert.return_value.execute.side_effect = Exception("duplicate key value violates unique constraint")

        repo = TripRepository(mock_supabase)
        result = await repo.create_trip_plan(sample_trip_plan_data)

        assert result is None  # Should return None on duplicate

    @pytest.mark.asyncio
    async def test_update_existing_trip_plan(self, mock_supabase, sample_trip_plan_data):
        """Test that an existing trip plan can be updated."""
        # Setup mock to return existing plan
        existing_plan = {**sample_trip_plan_data, "itinerary": "old itinerary"}
        mock_supabase.table.return_value.select.return_value.eq.return_value.eq.return_value.single.return_value.execute.return_value.data = existing_plan

        # Setup mock for successful update
        updated_plan = {**sample_trip_plan_data, "itinerary": "new itinerary"}
        mock_supabase.table.return_value.update.return_value.execute.return_value.data = [updated_plan]

        repo = TripRepository(mock_supabase)
        result = await repo.update_trip_plan(sample_trip_plan_data["trip_id"], "test-user-id", {"itinerary": "new itinerary"})

        assert result is not None
        assert result["itinerary"] == "new itinerary"

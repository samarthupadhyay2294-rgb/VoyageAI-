from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from supabase import Client
from app.core.auth import supabase
from app.logging import logger


class TripRepository:
    """Repository for trip operations."""
    
    def __init__(self, db: Client = supabase):
        self.db = db
    
    async def create_trip(self, trip_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new trip."""
        try:
            response = self.db.table("trips").insert(trip_data).execute()
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Failed to create trip: {str(e)}")
            return None
    
    async def get_trip(self, trip_id: UUID, user_id: str) -> Optional[Dict[str, Any]]:
        """Get a trip by ID."""
        try:
            response = self.db.table("trips").select("*").eq("id", str(trip_id)).eq("user_id", user_id).single()
            if response.data:
                return response.data
            return None
        except Exception as e:
            logger.error(f"Failed to get trip {trip_id}: {str(e)}")
            return None
    
    async def get_trips(self, user_id: str, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        """Get all trips for a user."""
        try:
            response = self.db.table("trips").select("*").eq("user_id", user_id).order("created_at", desc=True).range(offset, offset + limit - 1).execute()
            return response.data if response.data else []
        except Exception as e:
            logger.error(f"Failed to get trips for user {user_id}: {str(e)}")
            return []
    
    async def update_trip(self, trip_id: UUID, user_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a trip."""
        try:
            response = self.db.table("trips").update(updates).eq("id", str(trip_id)).eq("user_id", user_id).execute()
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Failed to update trip {trip_id}: {str(e)}")
            return None
    
    async def delete_trip(self, trip_id: UUID, user_id: str) -> bool:
        """Delete a trip."""
        try:
            self.db.table("trips").delete().eq("id", str(trip_id)).eq("user_id", user_id).execute()
            return True
        except Exception as e:
            logger.error(f"Failed to delete trip {trip_id}: {str(e)}")
            return False
    
    async def create_trip_plan(self, plan_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a trip plan."""
        try:
            response = self.db.table("trip_plans").insert(plan_data).execute()
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Failed to create trip plan: {str(e)}")
            return None
    
    async def get_trip_plan(self, trip_id: UUID, user_id: str) -> Optional[Dict[str, Any]]:
        """Get trip plan by trip ID."""
        try:
            # First verify trip belongs to user
            trip = await self.get_trip(trip_id, user_id)
            if not trip:
                return None
            
            response = self.db.table("trip_plans").select("*").eq("trip_id", str(trip_id)).single()
            if response.data:
                return response.data
            return None
        except Exception as e:
            logger.error(f"Failed to get trip plan for trip {trip_id}: {str(e)}")
            return None
    
    async def update_trip_plan(self, trip_id: UUID, user_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a trip plan."""
        try:
            # First verify trip belongs to user
            trip = await self.get_trip(trip_id, user_id)
            if not trip:
                return None
            
            response = self.db.table("trip_plans").update(updates).eq("trip_id", str(trip_id)).execute()
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Failed to update trip plan for trip {trip_id}: {str(e)}")
            return None
    
    async def delete_trip_plan(self, trip_id: UUID, user_id: str) -> bool:
        """Delete a trip plan."""
        try:
            # First verify trip belongs to user
            trip = await self.get_trip(trip_id, user_id)
            if not trip:
                return False
            
            self.db.table("trip_plans").delete().eq("trip_id", str(trip_id)).execute()
            return True
        except Exception as e:
            logger.error(f"Failed to delete trip plan for trip {trip_id}: {str(e)}")
            return False


class ProfileRepository:
    """Repository for profile operations."""
    
    def __init__(self, db: Client = supabase):
        self.db = db
    
    async def get_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user profile."""
        try:
            response = self.db.table("profiles").select("*").eq("id", user_id).single()
            if response.data:
                return response.data
            return None
        except Exception as e:
            logger.error(f"Failed to get profile for user {user_id}: {str(e)}")
            return None
    
    async def update_profile(self, user_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update user profile."""
        try:
            response = self.db.table("profiles").update(updates).eq("id", user_id).execute()
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Failed to update profile for user {user_id}: {str(e)}")
            return None

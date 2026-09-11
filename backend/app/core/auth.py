from typing import Optional
from supabase import Client, create_client
from app.config import settings
from app.core.security import verify_token
from app.logging import logger

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)


async def verify_jwt_token(token: str) -> Optional[str]:
    """Verify JWT token with Supabase and return user ID."""
    try:
        # Verify with Supabase
        user = supabase.auth.get_user(token)
        if user and user.user:
            return user.user.id
        
        # Fallback to local verification
        payload = verify_token(token)
        if payload:
            return payload.get("sub")
        
        return None
    except Exception as e:
        logger.error(f"Token verification failed: {str(e)}")
        return None


async def get_user_profile(user_id: str) -> Optional[dict]:
    """Get user profile from Supabase."""
    try:
        response = supabase.table("profiles").select("*").eq("id", user_id).single()
        if response.data:
            return response.data
        return None
    except Exception as e:
        logger.error(f"Failed to get user profile: {str(e)}")
        return None


async def create_user_profile(user_id: str, full_name: Optional[str] = None, avatar_url: Optional[str] = None) -> Optional[dict]:
    """Create user profile in Supabase."""
    try:
        profile_data = {
            "id": user_id,
            "full_name": full_name,
            "avatar_url": avatar_url,
            "preferred_currency": "USD",
        }
        response = supabase.table("profiles").insert(profile_data).execute()
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        logger.error(f"Failed to create user profile: {str(e)}")
        return None


async def update_user_profile(user_id: str, updates: dict) -> Optional[dict]:
    """Update user profile in Supabase."""
    try:
        response = supabase.table("profiles").update(updates).eq("id", user_id).execute()
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        logger.error(f"Failed to update user profile: {str(e)}")
        return None

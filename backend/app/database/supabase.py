from supabase import create_client
from app.config import settings
from app.logging import logger

# Initialize Supabase client
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)


def get_supabase_client():
    """Get Supabase client instance."""
    return supabase


async def test_connection():
    """Test Supabase connection."""
    try:
        response = supabase.table("profiles").select("id").limit(1).execute()
        logger.info("Supabase connection successful")
        return True
    except Exception as e:
        logger.error(f"Supabase connection failed: {str(e)}")
        return False

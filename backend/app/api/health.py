from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from app.config import settings
from app.schemas.response import HealthResponse
from app.core.cache import get_redis_client
from app.core.auth import supabase
from app.logging import logger

router = APIRouter()


async def check_redis_health() -> bool:
    """Check if Redis is available."""
    try:
        redis_client = get_redis_client()
        if redis_client:
            await redis_client.ping()
            return True
        return False
    except Exception as e:
        logger.error(f"Redis health check failed: {str(e)}")
        return False


async def check_supabase_health() -> bool:
    """Check if Supabase is available."""
    try:
        # Simple health check by attempting to query the profiles table
        response = supabase.table("profiles").select("id").limit(1).execute()
        return True
    except Exception as e:
        logger.error(f"Supabase health check failed: {str(e)}")
        return False


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Liveness check - is the application running?"""
    return HealthResponse(
        status="healthy",
        app=settings.APP_NAME,
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
        timestamp=datetime.utcnow(),
    )


@router.get("/ready")
async def readiness_check():
    """Readiness check - are dependencies available?"""
    redis_healthy = await check_redis_health()
    supabase_healthy = await check_supabase_health()

    if redis_healthy and supabase_healthy:
        return {
            "status": "ready",
            "dependencies": {
                "redis": "healthy",
                "supabase": "healthy"
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    else:
        return {
            "status": "not_ready",
            "dependencies": {
                "redis": "healthy" if redis_healthy else "unhealthy",
                "supabase": "healthy" if supabase_healthy else "unhealthy"
            },
            "timestamp": datetime.utcnow().isoformat()
        }, status.HTTP_503_SERVICE_UNAVAILABLE

from datetime import datetime, timezone
import asyncio
from fastapi import APIRouter, HTTPException, status, Request
from fastapi.responses import JSONResponse
from app.config import settings
from app.schemas.response import HealthResponse
from app.core.cache import get_redis_client
from app.core.auth import supabase
from app.logging import logger
from app.core.limiter import limiter

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


def _sync_supabase_check() -> bool:
    try:
        supabase.table("profiles").select("id").limit(1).execute()
        return True
    except Exception as e:
        logger.error(f"Supabase health check failed: {str(e)}")
        return False


async def check_supabase_health() -> bool:
    """Check if Supabase is available without blocking the event loop."""
    try:
        return await asyncio.to_thread(_sync_supabase_check)
    except Exception as e:
        logger.error(f"Supabase health check failed: {str(e)}")
        return False


@router.get("", response_model=HealthResponse)
@limiter.limit("60/minute")
async def api_health_check(request: Request):
    """API liveness check - is the application running?"""
    return HealthResponse(
        status="healthy",
        app=settings.APP_NAME,
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
        timestamp=datetime.now(timezone.utc),
    )


@router.get("/ready")
@limiter.limit("30/minute")
async def readiness_check(request: Request):
    """Readiness check - are dependencies available?"""
    redis_healthy = await check_redis_health()
    supabase_healthy = await check_supabase_health()

    payload = {
        "status": "ready" if (redis_healthy and supabase_healthy) else "degraded" if (redis_healthy or supabase_healthy) else "not_ready",
        "dependencies": {
            "redis": "healthy" if redis_healthy else "unhealthy",
            "supabase": "healthy" if supabase_healthy else "unhealthy"
        },
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    if redis_healthy and supabase_healthy:
        return payload
    return JSONResponse(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, content=payload)

from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.logging import logger


async def cors_middleware(request: Request, call_next):
    """Custom CORS middleware."""
    origin = request.headers.get("origin")
    
    # Check if origin is allowed
    if origin in settings.ALLOWED_ORIGINS:
        # CORS headers are handled by FastAPI's CORSMiddleware
        pass
    
    response = await call_next(request)
    return response

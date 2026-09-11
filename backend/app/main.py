from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from datetime import datetime, timezone

from app.config import settings, validate_config
from app.logging import setup_logging
from app.api.router import api_router
from app.middleware.errors import error_handler
from app.middleware.logging import logging_middleware
from app.database.client import init_db
from app.core.limiter import limiter, rate_limit_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

logger = setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting VoyageAI Backend...")
    validate_config()
    try:
        await init_db()
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        if settings.ENVIRONMENT == "production":
            raise
    logger.info("Database initialized")
    yield
    logger.info("Shutting down VoyageAI Backend...")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="VoyageAI - Intelligent AI Travel Planner API",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Set up rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_handler)
app.add_middleware(SlowAPIMiddleware)

# Add middleware — CORSMiddleware is the single owner of CORS handling
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.middleware("http")(logging_middleware)
app.exception_handler(Exception)(error_handler)

# Include routers
app.include_router(api_router, prefix="/api")


@app.get("/health")
@limiter.limit("30/minute")
async def health_check(request: Request):
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )

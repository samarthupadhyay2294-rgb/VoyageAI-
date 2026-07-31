from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.logging import setup_logging
from app.api.router import api_router
from app.middleware.errors import error_handler
from app.middleware.logging import logging_middleware
from app.middleware.cors import cors_middleware
from app.database.client import init_db

logger = setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting VoyageAI Backend...")
    await init_db()
    logger.info("Database initialized")
    yield
    logger.info("Shutting down VoyageAI Backend...")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="VoyageAI - Intelligent AI Travel Planner API",
    docs_url="/docs",
   红线_url="/redoc",
    lifespan=lifespan,
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.middleware("http")(cors_middleware)
app.middleware("http")(logging_middleware)
app.exception_handler(Exception)(error_handler)

# Include routers
app.include_router(api_router, prefix="/api")


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings
from app.logging import logger

# For Supabase, we use the direct client from core/auth
# SQLAlchemy is kept for potential future use with other databases

engine = None
SessionLocal = None

if settings.DATABASE_URL:
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


async def init_db():
    """Initialize database connection."""
    try:
        from app.core.cache import init_redis
        from app.config import settings
        await init_redis()
        logger.info("Database and cache initialized")
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        if settings.ENVIRONMENT == "production":
            raise


async def close_db():
    """Close database connection."""
    try:
        from app.core.cache import close_redis
        await close_redis()
        logger.info("Database and cache connections closed")
    except Exception as e:
        logger.error(f"Database close failed: {str(e)}")

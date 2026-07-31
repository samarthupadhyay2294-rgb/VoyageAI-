import redis.asyncio as redis
from typing import Optional, Any
import json
from app.config import settings
from app.logging import logger

redis_client: Optional[redis.Redis] = None


async def init_redis():
    """Initialize Redis connection."""
    global redis_client
    try:
        redis_client = redis.from_url(settings.REDIS_URL, encoding="utf-8", decode_responses=True)
        await redis_client.ping()
        logger.info("Redis connection established")
    except Exception as e:
        logger.error(f"Failed to connect to Redis: {str(e)}")
        redis_client = None


async def close_redis():
    """Close Redis connection."""
    global redis_client
    if redis_client:
        await redis_client.close()
        logger.info("Redis connection closed")


async def get_cache(key: str) -> Optional[Any]:
    """Get value from cache."""
    if not redis_client:
        return None
    
    try:
        value = await redis_client.get(key)
        if value:
            return json.loads(value)
        return None
    except Exception as e:
        logger.error(f"Cache get failed for key {key}: {str(e)}")
        return None


async def set_cache(key: str, value: Any, ttl: Optional[int] = None) -> bool:
    """Set value in cache."""
    if not redis_client:
        return False
    
    try:
        ttl = ttl or settings.CACHE_TTL_SECONDS
        serialized_value = json.dumps(value)
        await redis_client.setex(key, ttl, serialized_value)
        return True
    except Exception as e:
        logger.error(f"Cache set failed for key {key}: {str(e)}")
        return False


async def delete_cache(key: str) -> bool:
    """Delete value from cache."""
    if not redis_client:
        return False
    
    try:
        await redis_client.delete(key)
        return True
    except Exception as e:
        logger.error(f"Cache delete failed for key {key}: {str(e)}")
        return False


async def delete_cache_pattern(pattern: str) -> bool:
    """Delete all keys matching pattern."""
    if not redis_client:
        return False
    
    try:
        keys = await redis_client.keys(pattern)
        if keys:
            await redis_client.delete(*keys)
        return True
    except Exception as e:
        logger.error(f"Cache pattern delete failed for {pattern}: {str(e)}")
        return False

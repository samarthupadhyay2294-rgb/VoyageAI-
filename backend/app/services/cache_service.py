from app.core.cache import get_cache, set_cache, delete_cache, delete_cache_pattern
from app.logging import logger
from typing import Optional, Any


class CacheService:
    """Service for managing cache operations."""
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache."""
        return await get_cache(key)
    
    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """Set value in cache."""
        return await set_cache(key, value, ttl)
    
    async def delete(self, key: str) -> bool:
        """Delete value from cache."""
        return await delete_cache(key)
    
    async def delete_pattern(self, pattern: str) -> bool:
        """Delete all keys matching pattern."""
        return await delete_cache_pattern(pattern)
    
    async def invalidate_trip_cache(self, trip_id: str):
        """Invalidate all cache related to a trip."""
        patterns = [
            f"weather:*",
            f"flights:*",
            f"hotels:*",
            f"places:*",
            f"restaurants:*",
        ]
        
        for pattern in patterns:
            await self.delete_pattern(pattern)
        
        logger.info(f"Invalidated cache for trip {trip_id}")

import httpx
from typing import Dict, Any, Optional, List
from app.config import settings
from app.logging import logger
from app.core.cache import get_cache, set_cache
from tenacity import retry, stop_after_attempt, wait_exponential
import random


class UnsplashService:
    """Service for fetching destination images from Unsplash API."""
    
    def __init__(self):
        self.base_url = settings.UNSPLASH_BASE_URL
        self.access_key = settings.UNSPLASH_ACCESS_KEY
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
    async def get_destination_images(self, destination: str, count: int = 5) -> Optional[List[Dict[str, Any]]]:
        """Get images for a destination."""
        try:
            cache_key = f"images:{destination.lower()}"
            cached_data = await get_cache(cache_key)
            if cached_data:
                logger.info(f"Using cached images for {destination}")
                return cached_data
            
            headers = {
                "Authorization": f"Client-ID {self.access_key}",
            }
            
            params = {
                "query": destination,
                "per_page": count,
                "orientation": "landscape",
            }
            
            url = f"{self.base_url}/search/photos"
            
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(url, headers=headers, params=params)
                response.raise_for_status()
                data = response.json()
                
                images = self._process_images_data(data)
                
                await set_cache(cache_key, images, ttl=86400)  # Cache for 24 hours
                
                return images
                
        except httpx.HTTPError as e:
            logger.error(f"HTTP error fetching images for {destination}: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error fetching images for {destination}: {str(e)}")
            return None
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
    async def get_hero_image(self, destination: str) -> Optional[str]:
        """Get a hero image for a destination."""
        try:
            images = await self.get_destination_images(destination, count=1)
            if images and len(images) > 0:
                return images[0].get("url")
            return None
        except Exception as e:
            logger.error(f"Error fetching hero image for {destination}: {str(e)}")
            return None
    
    def _process_images_data(self, data: Dict) -> List[Dict[str, Any]]:
        """Process raw images data from Unsplash."""
        results = data.get("results", [])
        
        images = []
        for photo in results:
            urls = photo.get("urls", {})
            image_info = {
                "url": urls.get("regular", ""),
                "full_url": urls.get("full", ""),
                "thumb_url": urls.get("thumb", ""),
                "description": photo.get("description", ""),
                "alt_description": photo.get("alt_description", ""),
                "photographer": photo.get("user", {}).get("name", ""),
                "photographer_url": photo.get("user", {}).get("links", {}).get("html", ""),
            }
            images.append(image_info)
        
        return images
    
    async def get_fallback_image(self, category: str = "travel") -> str:
        """Get a fallback image when specific destination images are not available."""
        try:
            headers = {
                "Authorization": f"Client-ID {self.access_key}",
            }
            
            params = {
                "query": category,
                "per_page": 1,
                "orientation": "landscape",
            }
            
            url = f"{self.base_url}/search/photos"
            
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(url, headers=headers, params=params)
                response.raise_for_status()
                data = response.json()
                
                results = data.get("results", [])
                if results:
                    return results[0].get("urls", {}).get("regular", "")
                
                return ""
                
        except Exception as e:
            logger.error(f"Error fetching fallback image: {str(e)}")
            return ""

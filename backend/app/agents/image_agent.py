from typing import Dict, Any, Optional, List
from app.services.unsplash_service import UnsplashService
from app.logging import logger


class ImageAgent:
    """Agent for fetching destination images."""
    
    def __init__(self):
        self.unsplash_service = UnsplashService()
    
    async def fetch_destination_images(self, destination: str, count: int = 5) -> Optional[List[Dict[str, Any]]]:
        """Fetch images for a destination."""
        try:
            logger.info(f"Fetching images for {destination}")
            
            images = await self.unsplash_service.get_destination_images(destination, count)
            
            if images:
                logger.info(f"Successfully fetched {len(images)} images for {destination}")
            else:
                logger.warning(f"Failed to fetch images for {destination}")
            
            return images
        except Exception as e:
            logger.error(f"Error in ImageAgent: {str(e)}")
            return None
    
    async def fetch_hero_image(self, destination: str) -> Optional[str]:
        """Fetch a hero image for a destination."""
        try:
            logger.info(f"Fetching hero image for {destination}")
            
            hero_image = await self.unsplash_service.get_hero_image(destination)
            
            if hero_image:
                logger.info(f"Successfully fetched hero image for {destination}")
            else:
                logger.warning(f"Failed to fetch hero image for {destination}")
            
            return hero_image
        except Exception as e:
            logger.error(f"Error fetching hero image: {str(e)}")
            return None
    
    async def create_gallery(self, destination: str) -> Dict[str, Any]:
        """Create a gallery of destination images."""
        try:
            images = await self.fetch_destination_images(destination, count=10)
            
            if not images:
                # Fallback to travel category images
                fallback_image = await self.unsplash_service.get_fallback_image("travel")
                if fallback_image:
                    images = [{"url": fallback_image, "description": "Travel", "photographer": "Unsplash"}]
            
            return {
                "hero": images[0] if images else None,
                "gallery": images[1:] if len(images) > 1 else [],
                "total": len(images),
            }
        except Exception as e:
            logger.error(f"Error creating gallery: {str(e)}")
            return {"hero": None, "gallery": [], "total": 0}

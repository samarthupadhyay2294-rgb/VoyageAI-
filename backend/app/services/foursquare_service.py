import httpx
from typing import Dict, Any, Optional, List
from app.config import settings
from app.logging import logger
from app.core.cache import get_cache, set_cache
from tenacity import retry, stop_after_attempt, wait_exponential


class FoursquareService:
    """Service for fetching places and restaurants from Foursquare API."""
    
    def __init__(self):
        self.base_url = settings.FOURSQUARE_BASE_URL
        self.api_key = settings.FOURSQUARE_API_KEY
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
    async def get_places(self, city: str, categories: Optional[List[str]] = None) -> Optional[Dict[str, Any]]:
        """Get places/attractions in a city."""
        try:
            cache_key = f"places:{city.lower()}"
            cached_data = await get_cache(cache_key)
            if cached_data:
                logger.info(f"Using cached places data for {city}")
                return cached_data
            
            headers = {
                "Authorization": self.api_key,
                "Accept": "application/json",
            }
            
            # Search for places
            params = {
                "near": city,
                "limit": 20,
                "fields": "name,description,rating,location,photos,hours,tips",
            }
            
            if categories:
                params["categories"] = ",".join(categories)
            
            url = f"{self.base_url}/places/search"
            
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(url, headers=headers, params=params)
                response.raise_for_status()
                data = response.json()
                
                places_info = self._process_places_data(data)
                
                await set_cache(cache_key, places_info, ttl=7200)  # Cache for 2 hours
                
                return places_info
                
        except httpx.HTTPError as e:
            logger.error(f"HTTP error fetching places for {city}: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error fetching places for {city}: {str(e)}")
            return None
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
    async def get_restaurants(self, city: str) -> Optional[Dict[str, Any]]:
        """Get restaurants in a city."""
        try:
            cache_key = f"restaurants:{city.lower()}"
            cached_data = await get_cache(cache_key)
            if cached_data:
                logger.info(f"Using cached restaurants data for {city}")
                return cached_data
            
            headers = {
                "Authorization": self.api_key,
                "Accept": "application/json",
            }
            
            # Foursquare category ID for restaurants
            params = {
                "near": city,
                "categories": "13065",  # Food category
                "limit": 20,
                "fields": "name,rating,location,photos,price,hours,tips",
            }
            
            url = f"{self.base_url}/places/search"
            
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(url, headers=headers, params=params)
                response.raise_for_status()
                data = response.json()
                
                restaurants_info = self._process_restaurants_data(data)
                
                await set_cache(cache_key, restaurants_info, ttl=7200)  # Cache for 2 hours
                
                return restaurants_info
                
        except httpx.HTTPError as e:
            logger.error(f"HTTP error fetching restaurants for {city}: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error fetching restaurants for {city}: {str(e)}")
            return None
    
    def _process_places_data(self, data: Dict) -> Dict[str, Any]:
        """Process raw places data from Foursquare."""
        results = data.get("results", [])
        
        attractions = []
        activities = []
        
        for place in results:
            categories = place.get("categories", [])
            category_names = [c.get("name", "") for c in categories]
            
            place_info = {
                "name": place.get("name", "Unknown"),
                "description": place.get("description", ""),
                "rating": place.get("rating", 0),
                "location": place.get("location", {}).get("formatted_address", "Unknown"),
                "category": ", ".join(category_names) if category_names else "General",
                "image_url": self._extract_image_url(place),
            }
            
            # Categorize based on categories
            if any(cat.lower() in ["museum", "monument", "landmark", "historic"] for cat in category_names):
                attractions.append(place_info)
            else:
                activities.append(place_info)
        
        return {
            "attractions": attractions[:10],
            "activities": activities[:10],
        }
    
    def _process_restaurants_data(self, data: Dict) -> Dict[str, Any]:
        """Process raw restaurants data from Foursquare."""
        results = data.get("results", [])
        
        restaurants = []
        
        for place in results:
            price_tier = place.get("price", {}).get("tier", 1)
            price_range = self._price_tier_to_range(price_tier)
            
            restaurant_info = {
                "name": place.get("name", "Unknown"),
                "rating": place.get("rating", 0),
                "location": place.get("location", {}).get("formatted_address", "Unknown"),
                "price_range": price_range,
                "cuisine": self._extract_cuisine(place),
                "image_url": self._extract_image_url(place),
            }
            
            restaurants.append(restaurant_info)
        
        # Categorize by meal type (simplified)
        return {
            "breakfast": restaurants[:5],
            "lunch": restaurants[5:10],
            "dinner": restaurants[10:15],
            "street_food": restaurants[15:20] if len(restaurants) > 15 else [],
        }
    
    def _extract_image_url(self, place: Dict) -> Optional[str]:
        """Extract image URL from place data."""
        photos = place.get("photos", [])
        if photos and len(photos) > 0:
            return photos[0].get("prefix", "") + "original" + photos[0].get("suffix", "")
        return None
    
    def _extract_cuisine(self, place: Dict) -> str:
        """Extract cuisine type from place categories."""
        categories = place.get("categories", [])
        if categories:
            return categories[0].get("name", "Various")
        return "Various"
    
    def _price_tier_to_range(self, tier: int) -> str:
        """Convert Foursquare price tier to readable range."""
        price_ranges = {
            1: "$",
            2: "$$",
            3: "$$$",
            4: "$$$$",
        }
        return price_ranges.get(tier, "$")

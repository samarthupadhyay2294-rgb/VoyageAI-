import httpx
from typing import Dict, Any, Optional, List
from app.config import settings
from app.logging import logger
from app.core.cache import get_cache, set_cache
from tenacity import retry, stop_after_attempt, wait_exponential
from datetime import datetime, timedelta


class TravelPayoutsService:
    """Service for fetching flight and hotel data from TravelPayouts API."""
    
    def __init__(self):
        self.base_url = settings.TRAVELPAYOUTS_BASE_URL
        self.token = settings.TRAVELPAYOUTS_API_TOKEN
        self.marker = settings.TRAVELPAYOUTS_MARKER
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
    async def search_flights(
        self,
        origin: str,
        destination: str,
        departure_date: str,
        return_date: Optional[str] = None,
        travelers: int = 1,
    ) -> Optional[Dict[str, Any]]:
        """Search for flights using TravelPayouts API."""
        try:
            cache_key = f"flights:{origin}:{destination}:{departure_date}:{travelers}"
            cached_data = await get_cache(cache_key)
            if cached_data:
                logger.info(f"Using cached flight data for {origin} to {destination}")
                return cached_data
            
            headers = {
                "X-Access-Token": self.token,
            }
            
            params = {
                "origin": origin,
                "destination": destination,
                "departure_at": departure_date,
                "return_at": return_date,
                "passengers": travelers,
                "marker": self.marker,
                "currency": "USD",
                "locale": "en",
                "trip_class": 0,  # Economy
                "one_way": not bool(return_date),
            }
            
            # Remove None values
            params = {k: v for k, v in params.items() if v is not None}
            
            url = f"{self.base_url}/prices_for_dates"
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, headers=headers, params=params)
                response.raise_for_status()
                data = response.json()
                
                flight_info = self._process_flight_data(data)
                
                await set_cache(cache_key, flight_info, ttl=1800)  # Cache for 30 minutes
                
                return flight_info
                
        except httpx.HTTPError as e:
            logger.error(f"HTTP error searching flights: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error searching flights: {str(e)}")
            return None
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
    async def search_hotels(
        self,
        destination: str,
        check_in: str,
        check_out: str,
        travelers: int = 1,
    ) -> Optional[Dict[str, Any]]:
        """Search for hotels using TravelPayouts API."""
        try:
            cache_key = f"hotels:{destination}:{check_in}:{check_out}:{travelers}"
            cached_data = await get_cache(cache_key)
            if cached_data:
                logger.info(f"Using cached hotel data for {destination}")
                return cached_data
            
            headers = {
                "X-Access-Token": self.token,
            }
            
            params = {
                "city": destination,
                "check_in": check_in,
                "check_out": check_out,
                "guests": travelers,
                "marker": self.marker,
                "currency": "USD",
                "locale": "en",
            }
            
            url = f"{self.base_url}/hotels"
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, headers=headers, params=params)
                response.raise_for_status()
                data = response.json()
                
                hotel_info = self._process_hotel_data(data)
                
                await set_cache(cache_key, hotel_info, ttl=3600)  # Cache for 1 hour
                
                return hotel_info
                
        except httpx.HTTPError as e:
            logger.error(f"HTTP error searching hotels: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error searching hotels: {str(e)}")
            return None
    
    def _process_flight_data(self, data: Dict) -> Dict[str, Any]:
        """Process raw flight data from TravelPayouts."""
        # This is a simplified processing - actual implementation would depend on API response structure
        flights = data.get("data", [])
        
        options = []
        for flight in flights[:10]:  # Limit to 10 options
            option = {
                "airline": flight.get("airline", "Unknown"),
                "price": flight.get("price", 0),
                "duration": self._format_duration(flight.get("duration", 0)),
                "departure_time": flight.get("departure_at", ""),
                "arrival_time": flight.get("return_at", ""),
                "booking_url": flight.get("link", ""),
                "flight_number": flight.get("flight_number", ""),
            }
            options.append(option)
        
        # Find best option (lowest price)
        best_option = min(options, key=lambda x: x["price"]) if options else None
        
        return {
            "options": options,
            "best_option": best_option,
        }
    
    def _process_hotel_data(self, data: Dict) -> Dict[str, Any]:
        """Process raw hotel data from TravelPayouts."""
        # This is a simplified processing - actual implementation would depend on API response structure
        hotels = data.get("data", [])
        
        options = []
        for hotel in hotels[:10]:  # Limit to 10 options
            option = {
                "name": hotel.get("name", "Unknown"),
                "price": hotel.get("price", 0),
                "rating": hotel.get("rating", 0),
                "location": hotel.get("location", "Unknown"),
                "amenities": hotel.get("amenities", []),
                "booking_url": hotel.get("link", ""),
                "image_url": hotel.get("image", ""),
            }
            options.append(option)
        
        # Find best option (highest rating within reasonable price)
        if options:
            best_option = max(options, key=lambda x: x["rating"])
        else:
            best_option = None
        
        return {
            "options": options,
            "best_option": best_option,
        }
    
    def _format_duration(self, minutes: int) -> str:
        """Format flight duration in minutes to readable string."""
        hours = minutes // 60
        mins = minutes % 60
        return f"{hours}h {mins}m"

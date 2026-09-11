from typing import Dict, Any, Optional
from app.services.gemini_service import GeminiService
from app.logging import logger


class PlannerAgent:
    """Agent for generating AI-powered travel itineraries using Gemini."""
    
    def __init__(self):
        self.gemini_service = GeminiService()
    
    async def generate_itinerary(
        self,
        destination: str,
        start_date: str,
        end_date: str,
        travelers: int,
        interests: list,
        travel_style: str,
        weather_data: Dict[str, Any],
        places_data: Dict[str, Any],
        restaurants_data: Dict[str, Any],
        budget: float,
        currency: str,
    ) -> Optional[Dict[str, Any]]:
        """Generate a complete travel itinerary using Gemini AI."""
        try:
            logger.info(f"Generating AI itinerary for {destination}")
            
            itinerary = await self.gemini_service.generate_itinerary(
                destination=destination,
                start_date=start_date,
                end_date=end_date,
                travelers=travelers,
                interests=interests,
                travel_style=travel_style,
                weather_data=weather_data,
                places_data=places_data,
                restaurants_data=restaurants_data,
                budget=budget,
                currency=currency,
            )
            
            if itinerary:
                logger.info(f"Successfully generated AI itinerary for {destination}")
            else:
                logger.warning(f"Failed to generate AI itinerary for {destination}")
            
            return itinerary
        except Exception as e:
            logger.error(f"Error in PlannerAgent: {str(e)}")
            return None
    
    async def validate_itinerary(self, itinerary: Dict[str, Any]) -> bool:
        """Validate the generated itinerary structure."""
        try:
            required_fields = ["summary", "days", "travel_tips", "packing_suggestions"]
            
            for field in required_fields:
                if field not in itinerary:
                    logger.error(f"Missing required field in itinerary: {field}")
                    return False
            
            if not isinstance(itinerary["days"], list) or len(itinerary["days"]) == 0:
                logger.error("Itinerary days must be a non-empty list")
                return False
            
            # Validate each day structure
            for day in itinerary["days"]:
                day_required = ["day", "date", "title", "description", "activities", "meals"]
                for field in day_required:
                    if field not in day:
                        logger.error(f"Missing required field in day: {field}")
                        return False
            
            return True
        except Exception as e:
            logger.error(f"Error validating itinerary: {str(e)}")
            return False

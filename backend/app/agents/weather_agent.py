from typing import Dict, Any, Optional
from app.services.weather_service import WeatherService
from app.logging import logger


class WeatherAgent:
    """Agent for fetching and processing weather data."""
    
    def __init__(self):
        self.weather_service = WeatherService()
    
    async def fetch_weather(self, destination: str) -> Optional[Dict[str, Any]]:
        """Fetch weather data for a destination."""
        try:
            logger.info(f"Fetching weather data for {destination}")
            weather_data = await self.weather_service.get_weather(destination)
            
            if weather_data:
                logger.info(f"Successfully fetched weather data for {destination}")
            else:
                logger.warning(f"Failed to fetch weather data for {destination}")
            
            return weather_data
        except Exception as e:
            logger.error(f"Error in WeatherAgent: {str(e)}")
            return None
    
    async def validate_weather_conditions(self, weather_data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate weather conditions and provide recommendations."""
        try:
            if not weather_data:
                return {"valid": False, "message": "No weather data available"}
            
            current = weather_data.get("current", {})
            temp = current.get("temp", 20)
            
            warnings = weather_data.get("weather_warnings", [])
            
            if temp > 35 or temp < 0:
                return {
                    "valid": True,
                    "recommendation": "Extreme weather conditions. Take necessary precautions.",
                    "warnings": warnings,
                }
            
            return {
                "valid": True,
                "recommendation": "Weather conditions are suitable for travel.",
                "warnings": warnings,
            }
        except Exception as e:
            logger.error(f"Error validating weather conditions: {str(e)}")
            return {"valid": False, "message": "Validation failed"}

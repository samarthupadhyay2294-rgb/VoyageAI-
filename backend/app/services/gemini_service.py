import google.generativeai as genai
from typing import Dict, Any, Optional
from app.config import settings
from app.logging import logger
from tenacity import retry, stop_after_attempt, wait_exponential

genai.configure(api_key=settings.GEMINI_API_KEY)


class GeminiService:
    """Service for interacting with Google Gemini AI."""
    
    def __init__(self):
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
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
            prompt = self._build_itinerary_prompt(
                destination, start_date, end_date, travelers, interests,
                travel_style, weather_data, places_data, restaurants_data, budget, currency
            )
            
            response = self.model.generate_content(prompt)
            
            if response and response.text:
                # Parse the response as JSON
                import json
                try:
                    # Extract JSON from response if it's wrapped in markdown
                    text = response.text.strip()
                    if text.startswith("```json"):
                        text = text[7:]
                    if text.startswith("```"):
                        text = text[3:]
                    if text.endswith("```"):
                        text = text[:-3]
                    
                    itinerary_data = json.loads(text.strip())
                    return itinerary_data
                except json.JSONDecodeError as e:
                    logger.error(f"Failed to parse Gemini response as JSON: {str(e)}")
                    logger.error(f"Response text: {response.text}")
                    return None
            
            return None
        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            return None
    
    def _build_itinerary_prompt(
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
    ) -> str:
        """Build the prompt for itinerary generation."""
        prompt = f"""
You are an expert travel planner. Create a detailed day-by-day itinerary for a trip to {destination}.

Trip Details:
- Destination: {destination}
- Start Date: {start_date}
- End Date: {end_date}
- Number of Travelers: {travelers}
- Interests: {', '.join(interests) if interests else 'General sightseeing'}
- Travel Style: {travel_style}
- Budget: {budget} {currency}

Weather Information:
{self._format_weather(weather_data)}

Available Places and Attractions:
{self._format_places(places_data)}

Restaurant Recommendations:
{self._format_restaurants(restaurants_data)}

Generate a comprehensive itinerary in JSON format with the following structure:
{{
    "summary": "A brief summary of the trip",
    "days": [
        {{
            "day": 1,
            "date": "YYYY-MM-DD",
            "title": "Day title",
            "description": "Day description",
            "activities": [
                {{
                    "time": "09:00",
                    "activity": "Activity name",
                    "location": "Location",
                    "description": "Activity description",
                    "duration": "2 hours",
                    "cost": 0,
                    "category": "sightseeing"
                }}
            ],
            "meals": [
                {{
                    "type": "breakfast",
                    "restaurant": "Restaurant name",
                    "location": "Location",
                    "cuisine": "Cuisine type",
                    "estimated_cost": 20,
                    "recommendation": "Why this restaurant"
                }}
            ],
            "tips": ["Tip 1", "Tip 2"]
        }}
    ],
    "travel_tips": ["General travel tip 1", "General travel tip 2"],
    "packing_suggestions": ["Item 1", "Item 2"],
    "emergency_contacts": ["Emergency contact 1", "Emergency contact 2"],
    "budget_tips": ["Budget tip 1", "Budget tip 2"]
}}

Ensure the itinerary is realistic, well-paced, and matches the traveler's interests and budget.
"""
        return prompt
    
    def _format_weather(self, weather_data: Dict[str, Any]) -> str:
        """Format weather data for the prompt."""
        if not weather_data:
            return "Weather data not available"
        
        current = weather_data.get("current", {})
        return f"Current temperature: {current.get('temp', 'N/A')}°C, Conditions: {current.get('weather_description', 'N/A')}"
    
    def _format_places(self, places_data: Dict[str, Any]) -> str:
        """Format places data for the prompt."""
        if not places_data:
            return "Places data not available"
        
        attractions = places_data.get("attractions", [])[:5]
        formatted = []
        for place in attractions:
            formatted.append(f"- {place.get('name', 'Unknown')}: {place.get('description', 'No description')}")
        
        return "\n".join(formatted) if formatted else "No attractions available"
    
    def _format_restaurants(self, restaurants_data: Dict[str, Any]) -> str:
        """Format restaurants data for the prompt."""
        if not restaurants_data:
            return "Restaurant data not available"
        
        restaurants = restaurants_data.get("restaurants", [])[:5]
        formatted = []
        for restaurant in restaurants:
            formatted.append(f"- {restaurant.get('name', 'Unknown')}: {restaurant.get('cuisine', 'Unknown cuisine')}")
        
        return "\n".join(formatted) if formatted else "No restaurants available"

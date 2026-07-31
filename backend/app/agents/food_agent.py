from typing import Dict, Any, Optional
from app.services.foursquare_service import FoursquareService
from app.logging import logger


class FoodAgent:
    """Agent for recommending restaurants and food options."""
    
    def __init__(self):
        self.foursquare_service = FoursquareService()
    
    async def discover_restaurants(self, destination: str) -> Optional[Dict[str, Any]]:
        """Discover restaurants in a destination."""
        try:
            logger.info(f"Discovering restaurants in {destination}")
            
            restaurants_data = await self.foursquare_service.get_restaurants(destination)
            
            if restaurants_data:
                logger.info(f"Successfully discovered restaurants in {destination}")
            else:
                logger.warning(f"Failed to discover restaurants in {destination}")
            
            return restaurants_data
        except Exception as e:
            logger.error(f"Error in FoodAgent: {str(e)}")
            return None
    
    async def recommend_dining(self, restaurants_data: Dict[str, Any], budget: float, days: int) -> Dict[str, Any]:
        """Recommend dining options based on budget and trip duration."""
        try:
            if not restaurants_data:
                return {"breakfast": [], "lunch": [], "dinner": [], "street_food": []}
            
            # Calculate daily food budget (25% of total budget)
            daily_food_budget = (budget * 0.25) / days
            meal_budget = daily_food_budget / 3  # Divide by 3 meals
            
            # Filter restaurants by price range
            def filter_by_budget(restaurants, max_budget):
                return [r for r in restaurants if self._estimate_cost(r.get("price_range", "$")) <= max_budget]
            
            breakfast = filter_by_budget(restaurants_data.get("breakfast", []), meal_budget * 0.8)
            lunch = filter_by_budget(restaurants_data.get("lunch", []), meal_budget)
            dinner = filter_by_budget(restaurants_data.get("dinner", []), meal_budget * 1.2)
            street_food = restaurants_data.get("street_food", [])[:5]
            
            return {
                "breakfast": breakfast[:3],
                "lunch": lunch[:3],
                "dinner": dinner[:3],
                "street_food": street_food[:5],
            }
        except Exception as e:
            logger.error(f"Error recommending dining: {str(e)}")
            return {"breakfast": [], "lunch": [], "dinner": [], "street_food": []}
    
    def _estimate_cost(self, price_range: str) -> float:
        """Estimate cost from price range."""
        price_mapping = {
            "$": 15,
            "$$": 30,
            "$$$": 60,
            "$$$$": 100,
        }
        return price_mapping.get(price_range, 30)

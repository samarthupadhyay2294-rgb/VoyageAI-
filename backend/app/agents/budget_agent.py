from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from app.services.exchange_service import ExchangeRateService
from app.logging import logger


class BudgetAgent:
    """Agent for budget planning and currency conversion."""
    
    def __init__(self):
        self.exchange_service = ExchangeRateService()
    
    async def convert_currency(self, amount: float, from_currency: str, to_currency: str) -> Optional[float]:
        """Convert amount from one currency to another."""
        try:
            if from_currency == to_currency:
                return amount
            
            converted = await self.exchange_service.convert_currency(amount, from_currency, to_currency)
            return converted
        except Exception as e:
            logger.error(f"Error converting currency: {str(e)}")
            return None
    
    async def allocate_budget(
        self,
        total_budget: float,
        currency: str,
        start_date: str,
        end_date: str,
        travelers: int,
    ) -> Dict[str, Any]:
        """Allocate budget across different categories."""
        try:
            # Calculate trip duration
            start = datetime.strptime(start_date, "%Y-%m-%d")
            end = datetime.strptime(end_date, "%Y-%m-%d")
            days = (end - start).days + 1
            
            # Budget allocation percentages
            allocations = {
                "flights": 0.35,
                "accommodation": 0.30,
                "food": 0.20,
                "activities": 0.10,
                "transport": 0.03,
                "emergency_buffer": 0.02,
            }
            
            breakdown = {}
            for category, percentage in allocations.items():
                amount = total_budget * percentage
                breakdown[category] = round(amount, 2)
            
            # Calculate per-person daily budget
            per_person_daily = (total_budget * 0.98) / (travelers * days)  # Excluding emergency buffer
            
            breakdown["per_person_daily"] = round(per_person_daily, 2)
            breakdown["total_days"] = days
            breakdown["total_travelers"] = travelers
            
            return {
                "total_budget": total_budget,
                "currency": currency,
                "breakdown": breakdown,
                "tips": [
                    "Keep some cash for emergencies",
                    "Book flights in advance for better deals",
                    "Consider local transportation options",
                    "Try street food for authentic and affordable meals",
                    "Look for free attractions and activities",
                ],
            }
        except Exception as e:
            logger.error(f"Error allocating budget: {str(e)}")
            return {}

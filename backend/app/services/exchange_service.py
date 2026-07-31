import httpx
from typing import Dict, Any, Optional
from app.config import settings
from app.logging import logger
from app.core.cache import get_cache, set_cache
from tenacity import retry, stop_after_attempt, wait_exponential


class ExchangeRateService:
    """Service for currency conversion using ExchangeRate API."""
    
    def __init__(self):
        self.base_url = settings_EXCHANGERATE_BASE_URL
        self.api_key = settings.EXCHANGERATE_API_KEY
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
    async def get_exchange_rate(self, from_currency: str, to_currency: str) -> Optional[float]:
        """Get exchange rate between two currencies."""
        try:
            cache_key = f"exchange_rate:{from_currency.lower()}:{to_currency.lower()}"
            cached_data = await get_cache(cache_key)
            if cached_data is not None:
                logger.info(f"Using cached exchange rate for {from_currency} to {to_currency}")
                return cached_data
            
            url = f"{self.base_url}/{self.api_key}/pair/{from_currency}/{to_currency}"
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url)
                response.raise_for_status()
                data = response.json()
                
                if data.get("success"):
                    rate = data.get("conversion_rate")
                    await set_cache(cache_key, rate, ttl=3600)  # Cache for 1 hour
                    return rate
                
                return None
                
        except httpx.HTTPError as e:
            logger.error(f"HTTP error fetching exchange rate: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error fetching exchange rate: {str(e)}")
            return None
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
    async def convert_currency(self, amount: float, from_currency: str, to_currency: str) -> Optional[float]:
        """Convert amount from one currency to another."""
        try:
            if from_currency == to_currency:
                return amount
            
            rate = await self.get_exchange_rate(from_currency, to_currency)
            if rate:
                return round(amount * rate, 2)
            
            return None
        except Exception as e:
            logger.error(f"Error converting currency: {str(e)}")
            return None
    
    async def get_supported_currencies(self) -> Dict[str, str]:
        """Get list of supported currencies."""
        # Common currencies with their symbols
        return {
            "USD": "$",
            "EUR": "€",
            "GBP": "£",
            "JPY": "¥",
            "INR": "₹",
            "AUD": "A$",
            "CAD": "C$",
            "CHF": "Fr",
            "CNY": "¥",
            "SGD": "S$",
        }

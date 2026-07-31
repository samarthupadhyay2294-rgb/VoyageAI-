# Travel styles
TRAVEL_STYLES = [
    "adventure",
    "relaxation",
    "cultural",
    "luxury",
    "budget",
    "family",
    "romantic",
    "solo",
    "business",
]

# Interests
INTERESTS = [
    "museums",
    "parks",
    "temples",
    "shopping",
    "historical_places",
    "adventure_activities",
    "nightlife",
    "food",
    "nature",
    "beaches",
    "mountains",
    "art",
    "music",
    "sports",
    "wellness",
]

# Currencies
CURRENCIES = [
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "INR",
    "AUD",
    "CAD",
    "CHF",
    "CNY",
    "SGD",
]

# Trip statuses
TRIP_STATUSES = ["draft", "planning", "completed", "cancelled"]

# Cache keys
CACHE_KEYS = {
    "weather": "weather:{destination}",
    "flights": "flights:{origin}:{destination}:{date}",
    "hotels": "hotels:{destination}",
    "places": "places:{destination}",
    "restaurants": "restaurants:{destination}",
    "exchange_rate": "exchange_rate:{from_currency}:{to_currency}",
    "images": "images:{destination}",
}

# API timeout settings
API_TIMEOUTS = {
    "weather": 10,
    "flights": 30,
    "hotels": 30,
    "places": 15,
    "restaurants": 15,
    "exchange_rate": 10,
    "images": 15,
    "gemini": 60,
}

# Retry settings
RETRY_SETTINGS = {
    "max_attempts": 3,
    "wait_min": 1,
    "wait_max": 10,
}

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "VoyageAI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"

    # API Keys
    OPENROUTESERVICE_API_KEY: str = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImE0M2IwMjVlY2QwNzRjNTQ5OTRjNjZmMzRjOWJmZGUyIiwiaCI6Im11cm11cjY0In0="
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "demo_gemini_key")
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "demo_weather_key")
    FOURSQUARE_API_KEY: str = os.getenv("FOURSQUARE_API_KEY", "demo_foursquare_key")
    UNSPLASH_ACCESS_KEY: str = os.getenv("UNSPLASH_ACCESS_KEY", "demo_unsplash_key")
    EXCHANGERATE_API_KEY: str = os.getenv("EXCHANGERATE_API_KEY", "demo_exchange_key")
    TRAVELPAYOUTS_API_TOKEN: str = os.getenv("TRAVELPAYOUTS_API_TOKEN", "demo_travel_key")
    TRAVELPAYOUTS_MARKER: str = os.getenv("TRAVELPAYOUTS_MARKER", "voyageai")

    # Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

    # Security
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "secret_voyageai_key_2026")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60 * 24 * 7  # 7 days

    # Redis
    REDIS_URL: str = "redis://redis:6379/0"
    CACHE_TTL_SECONDS: int = 3600  # 1 hour

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000

    # External APIs
    OPENROUTESERVICE_BASE_URL: str = "https://api.openrouteservice.org"
    OPENWEATHER_BASE_URL: str = "https://api.openweathermap.org/data/2.5"
    FOURSQUARE_BASE_URL: str = "https://api.foursquare.com/v3"
    UNSPLASH_BASE_URL: str = "https://api.unsplash.com"
    EXCHANGERATE_BASE_URL: str = "https://v6.exchangerate-api.com/v6"
    TRAVELPAYOUTS_BASE_URL: str = "https://api.travelpayouts.com/aviasales/v3"
    GEMINI_MODEL: str = "gemini-pro"

    # PDF
    PDF_OUTPUT_DIR: str = "/tmp/pdfs"

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"


settings = Settings()

# Create PDF output directory if it doesn't exist
os.makedirs(settings.PDF_OUTPUT_DIR, exist_ok=True)

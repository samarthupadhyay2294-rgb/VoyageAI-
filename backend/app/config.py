from pydantic_settings import BaseSettings
from typing import List, Optional
import os
import logging

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "VoyageAI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")

    # API keys are supplied by the deployment environment.
    OPENROUTESERVICE_API_KEY: str = os.getenv("OPENROUTESERVICE_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "")
    FOURSQUARE_API_KEY: str = os.getenv("FOURSQUARE_API_KEY", "")
    UNSPLASH_ACCESS_KEY: str = os.getenv("UNSPLASH_ACCESS_KEY", "")
    EXCHANGERATE_API_KEY: str = os.getenv("EXCHANGERATE_API_KEY", "")
    TRAVELPAYOUTS_API_TOKEN: str = os.getenv("TRAVELPAYOUTS_API_TOKEN", "")
    TRAVELPAYOUTS_MARKER: str = os.getenv("TRAVELPAYOUTS_MARKER", "voyageai")

    # Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    # Security
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60 * 24 * 7  # 7 days

    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://redis:6379/0")
    CACHE_TTL_SECONDS: int = 3600  # 1 hour

    # CORS
    # Set this as a JSON list in production, for example:
    # ALLOWED_ORIGINS=["https://voyageai-frontend.onrender.com"]
    ALLOWED_ORIGINS_STR: str = os.getenv(
        "ALLOWED_ORIGINS",
        '["http://localhost:3000","http://localhost:5173","http://127.0.0.1:3000","http://127.0.0.1:5173"]'
        if ENVIRONMENT == "development"
        else '[]'
    )

    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        import json
        try:
            return json.loads(self.ALLOWED_ORIGINS_STR)
        except (json.JSONDecodeError, TypeError):
            return ["http://localhost:3000", "http://localhost:5173"] if self.DEBUG else []

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

    model_config = {
        "env_file": ".env",
        "case_sensitive": True,
        "extra": "allow",
    }


settings = Settings()

def validate_config() -> None:
    """Validate required configuration for production environment."""
    if settings.ENVIRONMENT == "production":
        required_vars = [
            "SUPABASE_URL",
            "SUPABASE_ANON_KEY", 
            "SUPABASE_SERVICE_ROLE_KEY",
            "JWT_SECRET_KEY",
        ]
        
        missing_vars = [var for var in required_vars if not getattr(settings, var, "")]
        if missing_vars:
            raise ValueError(
                f"Missing required environment variables for production: {', '.join(missing_vars)}"
            )
        
        logger.info("Production configuration validated successfully")
    else:
        logger.info(f"Running in {settings.ENVIRONMENT} mode with DEBUG={settings.DEBUG}")

# Create PDF output directory if it doesn't exist
os.makedirs(settings.PDF_OUTPUT_DIR, exist_ok=True)

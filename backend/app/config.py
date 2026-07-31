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
OPENROUTESERVICE_API_KEY: str = os.getenv(
    "OPENROUTESERVICE_API_KEY",
    "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImE0M2IwMjVlY2QwNzRjNTQ5OTRjNjZmMzRjOWJmZGUyIiwiaCI6Im11cm11cjY0In0="
)

GEMINI_API_KEY: str = os.getenv(
    "GEMINI_API_KEY",
    "AQ.Ab8RN6K5PNRRC4aQdOQxal_kxNI1BIwqiI3a7CLvTf-8OSTCxw"
)

OPENWEATHER_API_KEY: str = os.getenv(
    "OPENWEATHER_API_KEY",
    "9ef58e936c3f6629938fbb42365afd7d"
)

FOURSQUARE_API_KEY: str = os.getenv(
    "FOURSQUARE_API_KEY",
    "5JYAWJTUGZILMHOWKKJ0NGAOVCEIPMPVBY1FNFTJV0DLHGYR"
)

UNSPLASH_ACCESS_KEY: str = os.getenv(
    "UNSPLASH_ACCESS_KEY",
    "R01r8HGle5zXsS7BmlBF1YBXmLVeV7av5vRNW3seby8"
)

EXCHANGERATE_API_KEY: str = os.getenv(
    "EXCHANGERATE_API_KEY",
    "f23ddafa4cd752e293155dd8"
)

TRAVELPAYOUTS_API_TOKEN: str = os.getenv(
    "TRAVELPAYOUTS_API_TOKEN",
    "877ff3e8ce7ebad0f353b27e4778a3af"
)

TRAVELPAYOUTS_MARKER: str = os.getenv(
    "TRAVELPAYOUTS_MARKER",
    "757887"
)

# Supabase
SUPABASE_URL: str = os.getenv(
    "SUPABASE_URL",
    "https://iswmdqrggxtuovweqonv.supabase.co"
)

SUPABASE_ANON_KEY: str = os.getenv(
    "SUPABASE_ANON_KEY",
    "YOUR_SUPABASE_ANON_KEY"
)

SUPABASE_SERVICE_ROLE_KEY: str = os.getenv(
    "SUPABASE_SERVICE_ROLE_KEY",
    "YOUR_SUPABASE_SERVICE_ROLE_KEY"
)

# Security
JWT_SECRET_KEY: str = os.getenv(
    "JWT_SECRET_KEY",
    "a6fad8097be2fb32e9d501030e36c16d9912a9a70cd2e530b5e167995dd1a18c"
)
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60 * 24 * 7  # 7 days

    # Redis
    REDIS_URL: str = "redis://redis:6379/0"
    CACHE_TTL_SECONDS: int = 3600  # 1 hour

    # CORS
    # Set this as a JSON list in production, for example:
    # ALLOWED_ORIGINS=["https://voyageai-frontend.onrender.com"]
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

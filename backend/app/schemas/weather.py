from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class WeatherCurrent(BaseModel):
    temp: float
    feels_like: float
    humidity: int
    pressure: int
    wind_speed: float
    wind_direction: int
    weather_main: str
    weather_description: str
    visibility: int
    clouds: int


class WeatherForecast(BaseModel):
    date_time: str
    temp_max: float
    temp_min: float
    humidity: int
    weather_main: str
    weather_description: str
    rain_chance: float
    snow_chance: float


class WeatherResponse(BaseModel):
    city: str
    country: str
    current: WeatherCurrent
    forecast: List[WeatherForecast]
    best_time_to_visit: str
    packing_suggestions: List[str]
    weather_warnings: List[str]

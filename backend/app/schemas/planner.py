from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID


class PlannerRequest(BaseModel):
    trip_id: UUID
    regenerate: Optional[bool] = False


class PlannerResponse(BaseModel):
    trip_id: UUID
    status: str
    message: str
    data: Optional[Dict[str, Any]] = None


class ItineraryDay(BaseModel):
    day: int
    date: str
    title: str
    description: str
    activities: List[Dict[str, Any]]
    meals: List[Dict[str, Any]]
    tips: List[str]


class WeatherInfo(BaseModel):
    current: Dict[str, Any]
    forecast: List[Dict[str, Any]]
    best_time_to_visit: str
    packing_suggestions: List[str]


class FlightInfo(BaseModel):
    options: List[Dict[str, Any]]
    best_option: Dict[str, Any]


class HotelInfo(BaseModel):
    options: List[Dict[str, Any]]
    best_option: Dict[str, Any]


class PlaceInfo(BaseModel):
    attractions: List[Dict[str, Any]]
    activities: List[Dict[str, Any]]


class RestaurantInfo(BaseModel):
    breakfast: List[Dict[str, Any]]
    lunch: List[Dict[str, Any]]
    dinner: List[Dict[str, Any]]
    street_food: List[Dict[str, Any]]


class BudgetInfo(BaseModel):
    total_budget: float
    breakdown: Dict[str, float]
    currency: str
    tips: List[str]

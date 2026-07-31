from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID


class ItineraryDay(BaseModel):
    day: int
    date: str
    title: str
    description: str
    activities: List[Dict[str, Any]]
    meals: List[Dict[str, Any]]
    tips: List[str]


class WeatherData(BaseModel):
    current: Dict[str, Any]
    forecast: List[Dict[str, Any]]
    best_time_to_visit: str
    packing_suggestions: List[str]


class FlightOption(BaseModel):
    airline: str
    price: float
    duration: str
    departure_time: str
    arrival_time: str
    booking_url: str


class HotelOption(BaseModel):
    name: str
    price: float
    rating: float
    location: str
    amenities: List[str]
    booking_url: str
    image_url: Optional[str] = None


class Place(BaseModel):
    name: str
    category: str
    description: str
    rating: float
    location: str
    estimated_duration: str
    best_time_to_visit: str
    ticket_price: Optional[float] = None
    image_url: Optional[str] = None


class Restaurant(BaseModel):
    name: str
    cuisine: str
    price_range: str
    rating: float
    location: str
    specialties: List[str]
    best_for: List[str]
    image_url: Optional[str] = None


class BudgetBreakdown(BaseModel):
    total_budget: float
    flights: float
    accommodation: float
    food: float
    activities: float
    transport: float
    emergency_buffer: float
    currency: str

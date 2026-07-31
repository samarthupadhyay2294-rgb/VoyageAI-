from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
from uuid import UUID
from decimal import Decimal


class TripBase(BaseModel):
    origin: str = Field(..., description="Origin city or airport")
    destination: str = Field(..., description="Destination city")
    start_date: date = Field(..., description="Trip start date")
    end_date: date = Field(..., description="Trip end date")
    travelers: int = Field(..., ge=1, le=20, description="Number of travelers")
    budget: Decimal = Field(..., ge=0, description="Trip budget")
    currency: str = Field(default="USD", description="Budget currency")
    interests: Optional[List[str]] = Field(default_factory=list, description="Travel interests")
    travel_style: Optional[str] = Field(default=None, description="Travel style preference")
    status: str = Field(default="draft", description="Trip status")


class TripCreate(TripBase):
    user_id: UUID


class TripUpdate(BaseModel):
    origin: Optional[str] = None
    destination: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    travelers: Optional[int] = None
    budget: Optional[Decimal] = None
    currency: Optional[str] = None
    interests: Optional[List[str]] = None
    travel_style: Optional[str] = None
    status: Optional[str] = None


class Trip(TripBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TripPlanBase(BaseModel):
    weather: Optional[dict] = None
    flights: Optional[dict] = None
    hotels: Optional[dict] = None
    places: Optional[dict] = None
    restaurants: Optional[dict] = None
    budget_breakdown: Optional[dict] = None
    hero_image: Optional[str] = None
    itinerary: Optional[dict] = None
    ai_summary: Optional[str] = None


class TripPlanCreate(TripPlanBase):
    trip_id: UUID


class TripPlanUpdate(TripPlanBase):
    pass


class TripPlan(TripPlanBase):
    id: UUID
    trip_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

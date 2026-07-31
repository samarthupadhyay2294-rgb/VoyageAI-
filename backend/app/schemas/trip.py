from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
from uuid import UUID
from decimal import Decimal


class TripCreate(BaseModel):
    origin: str = Field(..., description="Origin city or airport")
    destination: str = Field(..., description="Destination city")
    start_date: date = Field(..., description="Trip start date")
    end_date: date = Field(..., description="Trip end date")
    travelers: int = Field(..., ge=1, le=20, description="Number of travelers")
    budget: Decimal = Field(..., ge=0, description="Trip budget")
    currency: str = Field(default="USD", description="Budget currency")
    interests: Optional[List[str]] = Field(default_factory=list, description="Travel interests")
    travel_style: Optional[str] = Field(default=None, description="Travel style preference")


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


class TripResponse(BaseModel):
    id: UUID
    user_id: UUID
    origin: str
    destination: str
    start_date: date
    end_date: date
    travelers: int
    budget: Decimal
    currency: str
    interests: List[str]
    travel_style: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TripListResponse(BaseModel):
    trips: List[TripResponse]
    total: int
    page: int
    page_size: int


class TripShareRequest(BaseModel):
    email: str
    message: Optional[str] = None

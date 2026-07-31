from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class UserBase(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    preferred_currency: str = "USD"


class UserCreate(UserBase):
    id: UUID
    email: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    preferred_currency: Optional[str] = None


class User(UserBase):
    id: UUID
    email: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

from fastapi import APIRouter
from app.api import health, auth, users, trips, planner, location

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(trips.router, prefix="/trips", tags=["trips"])
api_router.include_router(planner.router, prefix="/planner", tags=["planner"])
api_router.include_router(location.router, prefix="/location", tags=["location"])

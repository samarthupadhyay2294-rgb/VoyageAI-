from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies import get_current_user
from app.schemas.response import MessageResponse
from app.logging import logger

router = APIRouter()


@router.get("/stats")
async def get_user_stats(current_user_id: str = Depends(get_current_user)):
    """Get user statistics."""
    try:
        from app.database.repository import TripRepository
        
        trip_repo = TripRepository()
        trips = await trip_repo.get_trips(current_user_id)
        
        stats = {
            "total_trips": len(trips),
            "completed_trips": len([t for t in trips if t.get("status") == "completed"]),
            "planning_trips": len([t for t in trips if t.get("status") == "planning"]),
            "draft_trips": len([t for t in trips if t.get("status") == "draft"]),
        }
        
        return stats
    except Exception as e:
        logger.error(f"Failed to get user stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve statistics",
        )

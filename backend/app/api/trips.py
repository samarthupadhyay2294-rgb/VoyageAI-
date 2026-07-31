from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional
from uuid import UUID
from app.dependencies import get_current_user
from app.schemas.trip import TripCreate, TripUpdate, TripResponse, TripListResponse, TripShareRequest
from app.database.repository import TripRepository
from app.schemas.response import SuccessResponse, MessageResponse
from app.logging import logger

router = APIRouter()


@router.get("", response_model=TripListResponse)
async def get_trips(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    current_user_id: str = Depends(get_current_user),
):
    """Get all trips for current user."""
    try:
        trip_repo = TripRepository()
        offset = (page - 1) * page_size
        trips = await trip_repo.get_trips(current_user_id, limit=page_size, offset=offset)
        
        total = len(trips)  # In production, you'd want a separate count query
        total_pages = (total + page_size - 1) // page_size
        
        return TripListResponse(
            trips=[TripResponse(**trip) for trip in trips],
            total=total,
            page=page,
            page_size=page_size,
        )
    except Exception as e:
        logger.error(f"Failed to get trips: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve trips",
        )


@router.post("", response_model=SuccessResponse[TripResponse], status_code=status.HTTP_201_CREATED)
async def create_trip(
    trip_data: TripCreate,
    current_user_id: str = Depends(get_current_user),
):
    """Create a new trip."""
    try:
        trip_repo = TripRepository()
        
        # Add user_id to trip data
        trip_dict = trip_data.model_dump()
        trip_dict["user_id"] = current_user_id
        
        trip = await trip_repo.create_trip(trip_dict)
        if not trip:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create trip",
            )
        
        return SuccessResponse(
            data=TripResponse(**trip),
            message="Trip created successfully",
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create trip: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create trip",
        )


@router.get("/{trip_id}", response_model=SuccessResponse[TripResponse])
async def get_trip(
    trip_id: UUID,
    current_user_id: str = Depends(get_current_user),
):
    """Get a specific trip by ID."""
    try:
        trip_repo = TripRepository()
        trip = await trip_repo.get_trip(trip_id, current_user_id)
        
        if not trip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found",
            )
        
        return SuccessResponse(
            data=TripResponse(**trip),
            message="Trip retrieved successfully",
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get trip {trip_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve trip",
        )


@router.put("/{trip_id}", response_model=SuccessResponse[TripResponse])
async def update_trip(
    trip_id: UUID,
    updates: TripUpdate,
    current_user_id: str = Depends(get_current_user),
):
    """Update a trip."""
    try:
        trip_repo = TripRepository()
        
        # Filter out None values
        update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No valid fields to update",
            )
        
        trip = await trip_repo.update_trip(trip_id, current_user_id, update_data)
        if not trip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found",
            )
        
        return SuccessResponse(
            data=TripResponse(**trip),
            message="Trip updated successfully",
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update trip {trip_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update trip",
        )


@router.delete("/{trip_id}", response_model=MessageResponse)
async def delete_trip(
    trip_id: UUID,
    current_user_id: str = Depends(get_current_user),
):
    """Delete a trip."""
    try:
        trip_repo = TripRepository()
        success = await trip_repo.delete_trip(trip_id, current_user_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found",
            )
        
        return MessageResponse(message="Trip deleted successfully")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete trip {trip_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete trip",
        )


@router.post("/{trip_id}/duplicate", response_model=SuccessResponse[TripResponse])
async def duplicate_trip(
    trip_id: UUID,
    current_user_id: str = Depends(get_current_user),
):
    """Duplicate a trip."""
    try:
        trip_repo = TripRepository()
        original_trip = await trip_repo.get_trip(trip_id, current_user_id)
        
        if not original_trip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found",
            )
        
        # Create a copy without the ID and timestamps
        trip_dict = original_trip.copy()
        trip_dict.pop("id", None)
        trip_dict.pop("created_at", None)
        trip_dict.pop("updated_at", None)
        trip_dict["status"] = "draft"
        
        new_trip = await trip_repo.create_trip(trip_dict)
        if not new_trip:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to duplicate trip",
            )
        
        return SuccessResponse(
            data=TripResponse(**new_trip),
            message="Trip duplicated successfully",
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to duplicate trip {trip_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to duplicate trip",
        )


@router.post("/{trip_id}/share", response_model=MessageResponse)
async def share_trip(
    trip_id: UUID,
    share_data: TripShareRequest,
    current_user_id: str = Depends(get_current_user),
):
    """Share a trip via email."""
    try:
        trip_repo = TripRepository()
        trip = await trip_repo.get_trip(trip_id, current_user_id)
        
        if not trip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found",
            )
        
        # In a real implementation, you would send an email here
        # For now, we'll just log it
        logger.info(f"Sharing trip {trip_id} with {share_data.email}")
        
        return MessageResponse(message="Trip shared successfully")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to share trip {trip_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to share trip",
        )

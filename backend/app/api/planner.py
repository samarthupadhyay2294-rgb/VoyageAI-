from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from uuid import UUID
from app.dependencies import get_current_user
from app.schemas.planner import PlannerRequest, PlannerResponse
from app.database.repository import TripRepository
from app.agents.orchestrator import TripOrchestrator
from app.schemas.response import SuccessResponse, MessageResponse
from app.logging import logger

router = APIRouter()


@router.post("/generate", response_model=SuccessResponse[PlannerResponse])
async def generate_trip_plan(
    request: PlannerRequest,
    background_tasks: BackgroundTasks,
    current_user_id: str = Depends(get_current_user),
):
    """Generate AI trip plan."""
    try:
        trip_repo = TripRepository()
        trip = await trip_repo.get_trip(request.trip_id, current_user_id)
        
        if not trip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found",
            )
        
        # Initialize orchestrator
        orchestrator = TripOrchestrator()
        
        # Generate trip plan
        result = await orchestrator.generate_trip_plan(trip, regenerate=request.regenerate)
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.get("message", "Failed to generate trip plan"),
            )
        
        return SuccessResponse(
            data=PlannerResponse(
                trip_id=request.trip_id,
                status="completed",
                message="Trip plan generated successfully",
                data=result.get("data"),
            ),
            message="Trip plan generated successfully",
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to generate trip plan: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate trip plan",
        )


@router.post("/regenerate/{trip_id}", response_model=SuccessResponse[PlannerResponse])
async def regenerate_trip_plan(
    trip_id: UUID,
    current_user_id: str = Depends(get_current_user),
):
    """Regenerate AI trip plan."""
    try:
        trip_repo = TripRepository()
        trip = await trip_repo.get_trip(trip_id, current_user_id)
        
        if not trip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found",
            )
        
        # Initialize orchestrator
        orchestrator = TripOrchestrator()
        
        # Regenerate trip plan
        result = await orchestrator.generate_trip_plan(trip, regenerate=True)
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.get("message", "Failed to regenerate trip plan"),
            )
        
        return SuccessResponse(
            data=PlannerResponse(
                trip_id=trip_id,
                status="completed",
                message="Trip plan regenerated successfully",
                data=result.get("data"),
            ),
            message="Trip plan regenerated successfully",
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to regenerate trip plan: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to regenerate trip plan",
        )

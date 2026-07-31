from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies import get_current_user, optional_get_current_user
from app.schemas.auth import UserResponse, ProfileUpdate
from app.core.auth import get_user_profile, update_user_profile
from app.schemas.response import SuccessResponse, MessageResponse
from app.logging import logger

router = APIRouter()


@router.get("/me", response_model=SuccessResponse[UserResponse])
async def get_current_user_profile(current_user_id: str = Depends(get_current_user)):
    """Get current user profile."""
    try:
        profile = await get_user_profile(current_user_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found",
            )
        
        return SuccessResponse(
            data=UserResponse(**profile),
            message="Profile retrieved successfully",
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get user profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve profile",
        )


@router.put("/me", response_model=SuccessResponse[UserResponse])
async def update_current_user_profile(
    updates: ProfileUpdate,
    current_user_id: str = Depends(get_current_user),
):
    """Update current user profile."""
    try:
        # Filter out None values
        update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No valid fields to update",
            )
        
        profile = await update_user_profile(current_user_id, update_data)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found",
            )
        
        return SuccessResponse(
            data=UserResponse(**profile),
            message="Profile updated successfully",
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update user profile: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile",
        )

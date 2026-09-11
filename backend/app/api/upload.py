from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Request
from app.dependencies import get_current_user
from app.schemas.response import SuccessResponse
from app.config import settings
from app.logging import logger
from supabase import Client
from app.core.auth import supabase
from app.core.limiter import limiter
import uuid
import os

router = APIRouter()

# File size limits (5MB max)
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'}
ALLOWED_MIME_TYPES = {
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
}


@router.post("", response_model=SuccessResponse[dict])
@limiter.limit("10/minute")
async def upload_file(
    request: Request,
    file: UploadFile = File(...),
    current_user_id: str = Depends(get_current_user),
):
    """Upload a file to Supabase Storage."""
    try:
        # Check if Supabase Storage is configured
        if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Storage service is not configured. Please contact administrator."
            )

        # Validate file extension
        file_extension = os.path.splitext(file.filename)[1].lower()
        if file_extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type {file_extension} not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
            )

        # Validate MIME type
        if file.content_type and file.content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Content type {file.content_type} not allowed"
            )

        # Read file content and validate size
        file_content = await file.read()
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File size exceeds maximum allowed size of {MAX_FILE_SIZE / (1024*1024)}MB"
            )

        # Generate safe filename
        safe_filename = f"{uuid.uuid4()}{file_extension}"
        storage_path = f"uploads/{current_user_id}/{safe_filename}"

        # Upload to Supabase Storage
        try:
            # Create storage client with service role key for uploads
            storage_client = Client(
                settings.SUPABASE_URL,
                settings.SUPABASE_SERVICE_ROLE_KEY
            )

            # Upload file to 'voyageai-uploads' bucket
            storage_client.storage.from_('voyageai-uploads').upload(
                path=storage_path,
                file=file_content,
                file_options={"content-type": file.content_type}
            )

            # Get public URL
            public_url = storage_client.storage.from_('voyageai-uploads').get_public_url(storage_path)

            logger.info(f"File uploaded successfully: {file.filename} -> {storage_path}")

            return SuccessResponse(
                data={
                    "filename": file.filename,
                    "url": public_url,
                    "size": len(file_content),
                    "storage_path": storage_path,
                },
                message="File uploaded successfully",
            )

        except Exception as storage_error:
            # Check if it's a bucket not found error
            error_msg = str(storage_error).lower()
            if "bucket" in error_msg or "not found" in error_msg:
                raise HTTPException(
                    status_code=status.HTTP_501_NOT_IMPLEMENTED,
                    detail="Storage bucket not configured. Please create 'voyageai-uploads' bucket in Supabase Storage."
                )
            raise storage_error

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to upload file: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload file"
        )

from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from app.core.exceptions import VoyageAIException
from app.logging import logger
import traceback


async def error_handler(request: Request, exc: Exception):
    """Global error handler for all exceptions."""
    # Log the error
    logger.error(
        f"Error occurred: {str(exc)}",
        extra={
            "path": request.url.path,
            "method": request.method,
            "error_type": type(exc).__name__,
        }
    )
    
    # Handle custom VoyageAI exceptions
    if isinstance(exc, VoyageAIException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": exc.message,
                "detail": exc.details,
            }
        )
    
    # Handle HTTP exceptions
    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": exc.detail,
                "detail": None,
            }
        )
    
    # Handle unexpected errors
    logger.error(f"Unexpected error: {str(exc)}\n{traceback.format_exc()}")
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "An unexpected error occurred",
            "detail": str(exc) if logger.logger.level == 10 else None,  # Only show detail in debug mode
        }
    )

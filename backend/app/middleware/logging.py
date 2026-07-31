from fastapi import Request
import time
from app.logging import logger


async def logging_middleware(request: Request, call_next):
    """Logging middleware to log all requests and responses."""
    start_time = time.time()
    
    # Log request
    logger.info(
        f"Incoming request: {request.method} {request.url.path}",
        extra={
            "method": request.method,
            "path": request.url.path,
            "client": request.client.host if request.client else "unknown",
        }
    )
    
    # Process request
    response = await call_next(request)
    
    # Calculate duration
    duration = time.time() - start_time
    
    # Log response
    logger.info(
        f"Request completed: {request.method} {request.url.path} - Status: {response.status_code}",
        extra={
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "duration_ms": round(duration * 1000, 2),
        }
    )
    
    # Add custom headers
    response.headers["X-Process-Time"] = str(round(duration * 1000, 2))
    
    return response

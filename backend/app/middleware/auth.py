from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from app.core.auth import verify_jwt_token
from app.logging import logger

security = HTTPBearer(auto_error=False)


async def auth_middleware(request: Request, call_next):
    """Authentication middleware to verify JWT tokens."""
    try:
        # Skip auth for health check and public endpoints
        if request.url.path in ["/health", "/docs", "/redoc", "/openapi.json"]:
            return await call_next(request)
        
        # Get authorization header
        authorization: Optional[str] = request.headers.get("Authorization")
        
        if not authorization:
            # For public endpoints, continue without auth
            if request.url.path.startswith("/api/health"):
                return await call_next(request)
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Missing authorization header",
                )
        
        # Verify token
        token = authorization.replace("Bearer ", "")
        user_id = await verify_jwt_token(token)
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )
        
        # Add user_id to request state
        request.state.user_id = user_id
        
        response = await call_next(request)
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Auth middleware error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication error",
        )

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorityCredentials
from typing import Optional

from app.config import settings
from app.core.auth import verify_jwt_token
from app.core.security import get_current_user_id

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorityCredentials = Depends(security),
) -> str:
    """Get current user ID from JWT token."""
    token = credentials.credentials
    user_id = await verify_jwt_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    return user_id


async def optional_get_current_user(
    credentials: Optional[HTTPAuthorityCredentials] = Depends(HTTPBearer(auto_error=False)),
) -> Optional[str]:
    """Optionally get current user ID from JWT token."""
    if not credentials:
        return None
    token = credentials.credentials
    user_id = await verify_jwt_token(token)
    return user_id

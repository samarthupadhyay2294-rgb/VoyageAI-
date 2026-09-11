from fastapi import HTTPException, status
from typing import Optional, Any


class VoyageAIException(Exception):
    """Base exception for VoyageAI application."""
    
    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: Optional[Any] = None,
    ):
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(self.message)


class AuthenticationException(VoyageAIException):
    """Authentication related exceptions."""
    
    def __init__(self, message: str = "Authentication failed", details: Optional[Any] = None):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED, details)


class AuthorizationException(VoyageAIException):
    """Authorization related exceptions."""
    
    def __init__(self, message: str = "Access denied", details: Optional[Any] = None):
        super().__init__(message, status.HTTP_403_FORBIDDEN, details)


class NotFoundException(VoyageAIException):
    """Resource not found exceptions."""
    
    def __init__(self, message: str = "Resource not found", details: Optional[Any] = None):
        super().__init__(message, status.HTTP_404_NOT_FOUND, details)


class ValidationException(VoyageAIException):
    """Validation related exceptions."""
    
    def __init__(self, message: str = "Validation failed", details: Optional[Any] = None):
        super().__init__(message, status.HTTP_422_UNPROCESSABLE_ENTITY, details)


class ExternalAPIException(VoyageAIException):
    """External API related exceptions."""
    
    def __init__(self, message: str = "External API error", details: Optional[Any] = None):
        super().__init__(message, status.HTTP_502_BAD_GATEWAY, details)


class RateLimitException(VoyageAIException):
    """Rate limit related exceptions."""
    
    def __init__(self, message: str = "Rate limit exceeded", details: Optional[Any] = None):
        super().__init__(message, status.HTTP_429_TOO_MANY_REQUESTS, details)

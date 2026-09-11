"""
Upload validation tests.

Note: Upload endpoint requires authentication. These tests verify the endpoint exists
and basic validation logic. Full upload testing requires Supabase Storage configuration.
"""

import pytest
from fastapi import status
from io import BytesIO


class TestUploadValidation:
    """Tests for upload endpoint validation."""

    def test_upload_endpoint_exists(self, client):
        """Test that upload endpoint exists and responds."""
        # Create a simple test file
        file_content = b"test image content"
        files = {"file": ("test.jpg", BytesIO(file_content), "image/jpeg")}

        # The endpoint requires authentication, so we expect 401 without auth
        response = client.post("/api/upload", files=files)
        # Without auth, should get 401
        assert response.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]
        # Old double-prefix must not exist
        assert client.post("/api/upload/upload", files=files).status_code == status.HTTP_404_NOT_FOUND

    def test_upload_with_invalid_file_extension(self, client):
        """Test upload with invalid file extension."""
        file_content = b"test executable content"
        files = {"file": ("test.exe", BytesIO(file_content), "application/x-msdownload")}

        response = client.post("/api/upload", files=files)
        # Without auth, should get 401
        assert response.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]

    def test_upload_with_file_too_large(self, client):
        """Test upload with file too large."""
        # Create a file larger than 10MB
        large_content = b"x" * (11 * 1024 * 1024)
        files = {"file": ("large.jpg", BytesIO(large_content), "image/jpeg")}

        response = client.post("/api/upload", files=files)
        # Without auth, should get 401 (file size check happens after auth)
        assert response.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]

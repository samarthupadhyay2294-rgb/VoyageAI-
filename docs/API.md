# VoyageAI API Documentation

## Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://api.voyageai.com`

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are obtained via Supabase authentication and verified by the backend.

## Endpoints

### Health

#### GET /health

Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2026-01-01T00:00:00Z"
}
```

### Authentication

#### GET /api/auth/me

Get current user profile.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "preferred_currency": "USD",
  "created_at": "2026-01-01T00:00:00Z"
}
```

#### PUT /api/auth/me

Update current user profile.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "full_name": "John Doe",
  "preferred_currency": "EUR"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "preferred_currency": "EUR",
  "created_at": "2026-01-01T00:00:00Z"
}
```

### Users

#### GET /api/users/stats

Get user statistics.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "total_trips": 10,
  "completed_trips": 5,
  "planning_trips": 3,
  "draft_trips": 2
}
```

### Trips

#### GET /api/trips

List user trips with pagination.

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional, default: 1)
- `page_size` (optional, default: 10)

**Response:**
```json
{
  "trips": [
    {
      "id": "uuid",
      "origin": "New York",
      "destination": "Paris",
      "start_date": "2026-06-01",
      "end_date": "2026-06-10",
      "travelers": 2,
      "budget": 5000,
      "currency": "USD",
      "interests": ["museums", "parks"],
      "travel_style": "cultural",
      "status": "planning",
      "created_at": "2026-01-01T00:00:00Z"
    }
  ],
  "total": 10,
  "page": 1,
  "page_size": 10
}
```

#### POST /api/trips

Create a new trip.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "origin": "New York",
  "destination": "Paris",
  "start_date": "2026-06-01",
  "end_date": "2026-06-10",
  "travelers": 2,
  "budget": 5000,
  "currency": "USD",
  "interests": ["museums", "parks"],
  "travel_style": "cultural"
}
```

**Response:**
```json
{
  "id": "uuid",
  "origin": "New York",
  "destination": "Paris",
  "start_date": "2026-06-01",
  "end_date": "2026-06-10",
  "travelers": 2,
  "budget": 5000,
  "currency": "USD",
  "interests": ["museums", "parks"],
  "travel_style": "cultural",
  "status": "draft",
  "created_at": "2026-01-01T00:00:00Z"
}
```

#### GET /api/trips/{id}

Get trip details by ID.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "uuid",
  "origin": "New York",
  "destination": "Paris",
  "start_date": "2026-06-01",
  "end_date": "2026-06-10",
  "travelers": 2,
  "budget": 5000,
  "currency": "USD",
  "interests": ["museums", "parks"],
  "travel_style": "cultural",
  "status": "planning",
  "created_at": "2026-01-01T00:00:00Z",
  "trip_plan": {
    "id": "uuid",
    "itinerary": [...],
    "weather_data": {...},
    "flight_options": [...],
    "hotel_options": [...],
    "places": [...],
    "restaurants": [...],
    "budget_breakdown": {...},
    "images": [...]
  }
}
```

#### PUT /api/trips/{id}

Update trip details.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "destination": "London",
  "budget": 6000
}
```

**Response:**
```json
{
  "id": "uuid",
  "origin": "New York",
  "destination": "London",
  "start_date": "2026-06-01",
  "end_date": "2026-06-10",
  "travelers": 2,
  "budget": 6000,
  "currency": "USD",
  "interests": ["museums", "parks"],
  "travel_style": "cultural",
  "status": "planning",
  "created_at": "2026-01-01T00:00:00Z"
}
```

#### DELETE /api/trips/{id}

Delete a trip.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Trip deleted successfully"
}
```

#### POST /api/trips/{id}/duplicate

Duplicate a trip.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "new-uuid",
  "origin": "New York",
  "destination": "Paris",
  "start_date": "2026-06-01",
  "end_date": "2026-06-10",
  "travelers": 2,
  "budget": 5000,
  "currency": "USD",
  "interests": ["museums", "parks"],
  "travel_style": "cultural",
  "status": "draft",
  "created_at": "2026-01-01T00:00:00Z"
}
```

#### POST /api/trips/{id}/share

Share a trip with another user.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "email": "friend@example.com",
  "message": "Check out this trip!"
}
```

**Response:**
```json
{
  "message": "Trip shared successfully"
}
```

### Planner

#### POST /api/planner/generate

Generate an AI trip plan.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "trip_id": "uuid"
}
```

**Response:**
```json
{
  "trip_id": "uuid",
  "status": "processing",
  "message": "Trip plan generation started"
}
```

#### POST /api/planner/regenerate

Regenerate an existing trip plan.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "trip_id": "uuid"
}
```

**Response:**
```json
{
  "trip_id": "uuid",
  "status": "processing",
  "message": "Trip plan regeneration started"
}
```

## Error Responses

All endpoints may return error responses:

```json
{
  "error": "Error message",
  "detail": "Detailed error information"
}
```

### Common HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created
- `400 Bad Request`: Invalid request
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Rate Limiting

- **Default**: 100 requests per minute per IP
- **Authenticated**: 200 requests per minute per user
- Rate limit headers are included in responses:
  - `X-RateLimit-Limit`: Total limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time (Unix timestamp)

## Pagination

List endpoints support pagination via query parameters:
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 10, max: 100)

Response includes pagination metadata:
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "page_size": 10
}
```

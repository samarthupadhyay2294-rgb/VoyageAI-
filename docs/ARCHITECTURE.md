# VoyageAI Architecture

## Overview

VoyageAI is a full-stack AI-powered travel planning application with a Python FastAPI backend and React 19 frontend.

## System Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Frontend      │      │    Backend      │      │   External      │
│   (React 19)    │◄────►│   (FastAPI)     │◄────►│    APIs         │
│   Vite + TS     │      │   Python 3.12   │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
         │                        │                        │
         │                        │                        │
         └────────────────────────┴────────────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Supabase      │
                       │   PostgreSQL    │
                       │   + Auth        │
                       └─────────────────┘
```

## Backend Architecture

### Directory Structure

```
backend/
├── app/
│   ├── agents/              # AI agents for travel planning
│   │   ├── planner_agent.py
│   │   ├── weather_agent.py
│   │   ├── flight_agent.py
│   │   ├── hotel_agent.py
│   │   ├── places_agent.py
│   │   ├── food_agent.py
│   │   ├── budget_agent.py
│   │   ├── image_agent.py
│   │   └── orchestrator.py
│   ├── api/                 # API endpoints
│   │   ├── router.py
│   │   ├── health.py
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── trips.py
│   │   └── planner.py
│   ├── core/                # Core utilities
│   │   ├── security.py
│   │   ├── auth.py
│   │   ├── cache.py
│   │   ├── limiter.py
│   │   └── exceptions.py
│   ├── database/            # Database layer
│   │   ├── client.py
│   │   ├── repository.py
│   │   └── supabase.py
│   ├── middleware/          # Custom middleware
│   │   ├── auth.py
│   │   ├── cors.py
│   │   ├── logging.py
│   │   └── errors.py
│   ├── models/              # Pydantic models
│   │   ├── profile.py
│   │   ├── trip.py
│   │   └── trip_plan.py
│   ├── schemas/             # API schemas
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── trip.py
│   │   ├── planner.py
│   │   ├── weather.py
│   │   └── response.py
│   ├── services/            # External API services
│   │   ├── gemini_service.py
│   │   ├── weather_service.py
│   │   ├── foursquare_service.py
│   │   ├── unsplash_service.py
│   │   ├── exchange_service.py
│   │   ├── travelpayouts_service.py
│   │   ├── pdf_service.py
│   │   └── cache_service.py
│   ├── config.py            # Configuration
│   ├── constants.py         # Constants
│   ├── dependencies.py      # FastAPI dependencies
│   ├── logging.py           # Logging setup
│   └── main.py              # Application entry
├── requirements.txt         # Python dependencies
├── pyproject.toml           # Project config
└── Dockerfile               # Docker image
```

### Key Components

#### AI Agents

- **PlannerAgent**: Uses Google Gemini to generate AI-powered itineraries
- **WeatherAgent**: Fetches weather data from OpenWeather API
- **FlightAgent**: Searches flights via TravelPayouts API
- **HotelAgent**: Searches hotels via TravelPayouts API
- **PlacesAgent**: Discovers attractions via Foursquare API
- **FoodAgent**: Recommends restaurants via Foursquare API
- **BudgetAgent**: Handles currency conversion and budget allocation
- **ImageAgent**: Fetches destination images from Unsplash API
- **TripOrchestrator**: Coordinates all agents to generate complete trip plans

#### Services

- **GeminiService**: Google Gemini AI integration for itinerary generation
- **WeatherService**: OpenWeather API integration with caching
- **FoursquareService**: Foursquare Places API for places and restaurants
- **UnsplashService**: Unsplash API for destination images
- **ExchangeService**: Currency conversion via ExchangeRate API
- **TravelPayoutsService**: Flight and hotel search via TravelPayouts API
- **PDFService**: PDF generation using ReportLab
- **CacheService**: Redis-based caching layer

#### Middleware

- **AuthMiddleware**: JWT token verification
- **CORSMiddleware**: Custom CORS handling
- **LoggingMiddleware**: Request/response logging
- **ErrorHandler**: Global exception handling

#### Security

- JWT-based authentication via Supabase
- Rate limiting with SlowAPI
- Request validation with Pydantic
- Security headers
- CORS configuration
- Password hashing with bcrypt

## Frontend Architecture

### Directory Structure

```
frontend/
├── src/
│   ├── api/                 # API layer
│   │   ├── axios.ts
│   │   ├── types.ts
│   │   ├── auth.ts
│   │   ├── trips.ts
│   │   └── planner.ts
│   ├── components/
│   │   └── common/          # Reusable components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       ├── Spinner.tsx
│   │       ├── Modal.tsx
│   │       ├── Badge.tsx
│   │       ├── Avatar.tsx
│   │       ├── Navbar.tsx
│   │       ├── Footer.tsx
│   │       └── EmptyState.tsx
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.ts
│   │   └── useTrips.ts
│   ├── layouts/             # Layout components
│   │   ├── MainLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   └── DashboardLayout.tsx
│   ├── pages/               # Page components
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── CreateTripPage.tsx
│   │   ├── TripDetailsPage.tsx
│   │   ├── TripsPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── SettingsPage.tsx
│   ├── routes/              # Routing
│   │   ├── AppRouter.tsx
│   │   └── ProtectedRoute.tsx
│   ├── services/            # Supabase services
│   │   ├── supabase.ts
│   │   └── auth.ts
│   ├── styles/              # Global styles
│   │   └── globals.css
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── package.json             # Node dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
├── tailwind.config.ts       # Tailwind config
├── Dockerfile               # Docker image
└── nginx.conf               # Nginx config
```

### Key Technologies

- **React 19**: UI library with hooks
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **TailwindCSS**: Utility-first CSS
- **React Router**: Client-side routing
- **TanStack Query**: Data fetching and caching
- **Supabase JS**: Authentication and database
- **Axios**: HTTP client with interceptors
- **Lucide React**: Icon library
- **React Hot Toast**: Toast notifications

### State Management

- **AuthContext**: User authentication state
- **ThemeContext**: Theme (light/dark) state
- **TanStack Query**: Server state for trips and API data
- **React State**: Local component state

## Database Schema

### Tables

#### profiles
- id (UUID, primary key)
- user_id (UUID, references auth.users)
- full_name (text)
- preferred_currency (text)
- created_at (timestamp)
- updated_at (timestamp)

#### trips
- id (UUID, primary key)
- user_id (UUID, references profiles)
- origin (text)
- destination (text)
- start_date (date)
- end_date (date)
- travelers (integer)
- budget (decimal)
- currency (text)
- interests (array)
- travel_style (text)
- status (text)
- created_at (timestamp)
- updated_at (timestamp)

#### trip_plans
- id (UUID, primary key)
- trip_id (UUID, references trips)
- itinerary (jsonb)
- weather_data (jsonb)
- flight_options (jsonb)
- hotel_options (jsonb)
- places (jsonb)
- restaurants (jsonb)
- budget_breakdown (jsonb)
- images (jsonb)
- created_at (timestamp)
- updated_at (timestamp)

### Row Level Security (RLS)

All tables have RLS policies:
- Users can only read/write their own data
- Public read access for shared trips
- Service role key bypasses RLS

## External APIs

### AI Services
- **Google Gemini**: AI itinerary generation

### Travel APIs
- **OpenWeather**: Weather data
- **Foursquare**: Places and restaurants
- **Unsplash**: Destination images
- **ExchangeRate**: Currency conversion
- **TravelPayouts**: Flights and hotels

### Authentication
- **Supabase Auth**: User authentication and JWT tokens

## Caching Strategy

- **Redis**: Server-side caching for API responses
- **TTL**: Configurable cache expiration
- **Cache Invalidation**: On trip updates
- **TanStack Query**: Client-side caching with automatic refetching

## Security Measures

1. **Authentication**: JWT tokens via Supabase
2. **Authorization**: RLS policies in Supabase
3. **Rate Limiting**: SlowAPI with configurable limits
4. **Input Validation**: Pydantic schemas
5. **Output Sanitization**: Type-safe responses
6. **CORS**: Configured allowed origins
7. **Security Headers**: HTTPS, HSTS, CSP
8. **Secrets Management**: Environment variables

## Deployment Architecture

### Docker Compose Services

- **frontend**: React app with Nginx
- **backend**: FastAPI with Uvicorn
- **redis**: Redis for caching
- **postgres**: Supabase PostgreSQL (managed)

### Production Considerations

- **Load Balancing**: Nginx for frontend
- **Process Management**: Multiple Uvicorn workers
- **Health Checks**: /health endpoint
- **Graceful Shutdowns**: Proper signal handling
- **Logging**: Structured JSON logs
- **Monitoring**: Health check endpoints

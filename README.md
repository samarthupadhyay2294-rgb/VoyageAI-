# VoyageAI – Intelligent AI Travel Planner

<div align="center">

![VoyageAI](https://img.shields.io/badge/VoyageAI-AI%20Travel%20Planner-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**An AI-powered travel planning platform that automatically creates complete travel plans using multiple AI agents.**

</div>

---

## ✨ Features

- **AI-Powered Trip Planning**: Automatically generates complete travel itineraries using Google Gemini AI
- **Multi-Agent Architecture**: Specialized AI agents working together (Location, Weather, Flight, Hotel, Places, Food, Budget, Image, and Planner agents)
- **Flight Search**: Integration with TravelPayouts for flight recommendations
- **Hotel Suggestions**: AI-powered hotel recommendations with booking links
- **Attraction Discovery**: Foursquare integration for places and attractions
- **Restaurant Recommendations**: AI-curated dining suggestions
- **Weather Analysis**: Real-time weather data and forecasts
- **Budget Estimation**: Currency conversion and budget breakdown
- **Destination Images**: Beautiful destination photography from Unsplash
- **Trip Analytics**: View travel statistics and insights
- **Responsive Design**: Mobile-first, works on all devices

## 🏗️ Architecture

### Tech Stack

**Frontend**
- React 19
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- Framer Motion
- TanStack Query
- React Hook Form
- Zod
- Axios
- React Router
- Lucide Icons

**Backend**
- Python 3.12
- FastAPI
- Pydantic v2
- SQLAlchemy
- Alembic
- Redis
- SlowAPI
- Uvicorn

**Database & Auth**
- Supabase PostgreSQL
- Supabase Auth

**AI & APIs**
- Google Gemini API
- OpenWeather API
- Foursquare Places API
- TravelPayouts API
- ExchangeRate API
- Unsplash API

**Deployment**
- Docker
- Docker Compose
- Render

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.12+ (for local development)
- Supabase account
- API keys for external services

## 🔑 Environment Variables

Create a `.env` file in the project root:

```bash
# AI & External APIs
GEMINI_API_KEY=your_gemini_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
FOURSQUARE_API_KEY=your_foursquare_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
EXCHANGERATE_API_KEY=your_exchangerate_api_key
TRAVELPAYOUTS_API_TOKEN=your_travelpayouts_token
TRAVELPAYOUTS_MARKER=your_travelpayouts_marker

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Security
JWT_SECRET_KEY=your_jwt_secret_key

# Redis
REDIS_URL=redis://redis:6379/0

# Frontend (Vite)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8000
```

## 🛠️ Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd VoyageAI
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

### 3. Supabase Setup

Create a Supabase project and apply the database migration:

```bash
# Apply the initial schema migration from backend/migrations/001_initial_schema.sql
```

The migration file includes:
- All required tables (profiles, trips, trip_plans)
- Row Level Security (RLS) policies
- Indexes for performance
- Triggers for user profile creation

### 4. Docker Deployment

```bash
# Build and start all services
docker compose up --build

# The application will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

### 5. Local Development

**Backend:**
```bash
cd backend
py -3 -m venv venv
# On macOS / Linux:
source venv/bin/activate
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
py -3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Windows PowerShell helper:**
```powershell
# From the repository root:
.\backend\setup_windows.ps1
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
VoyageAI/
├── README.md
├── docker-compose.yml
├── .env.example
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── services/
│       ├── api/
│       └── tests/
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── test_health_checks.py
│   │   ├── test_rate_limiting.py
│   │   ├── test_trip_plan_persistence.py
│   │   └── test_upload_validation.py
│   └── app/
│       ├── api/
│       ├── core/
│       ├── services/
│       ├── agents/
│       └── ...
└── docs/
    ├── architecture.md
    ├── api.md
    └── deployment.md
```

## 🔒 Security

- JWT token authentication with Supabase
- Row Level Security (RLS) on all database tables
- Request/response validation with Pydantic
- CORS configuration
- Security headers
- Environment variable protection
- Structured logging
- Health and readiness checks for dependencies

## 🤖 AI Agents

The application uses a multi-agent architecture with specialized agents:

1. **Location Agent**: Generates location intelligence
2. **Weather Agent**: Fetches weather data and forecasts
3. **Flight Agent**: Searches for flights via TravelPayouts
4. **Hotel Agent**: Finds hotel recommendations
5. **Places Agent**: Discovers attractions via Foursquare
6. **Restaurant Agent**: Recommends restaurants via Foursquare
7. **Budget Agent**: Handles currency conversion and budget allocation
8. **Image Agent**: Fetches destination images from Unsplash
9. **Planner Agent**: Generates AI itinerary using Gemini

## 📊 API Endpoints

### Health
- `GET /health` - Health check
- `GET /api/health/ready` - Readiness check (dependency health)

### Authentication
- `GET /api/me` - Get current user

### Trips
- `GET /api/trips` - List all trips
- `POST /api/trips` - Create a trip
- `GET /api/trips/{id}` - Get trip details
- `DELETE /api/trips/{id}` - Delete a trip
- `POST /api/trips/{id}/duplicate` - Duplicate a trip
- `POST /api/trips/{id}/share` - Share a trip (not yet implemented)

### Planner
- `POST /api/planner/generate` - Generate AI trip plan
- `POST /api/planner/regenerate/{trip_id}` - Regenerate trip plan

### Upload
- `POST /api/upload/upload` - Upload files (requires Supabase Storage configuration)

## 🚢 Deployment

### Deploy to Render

1. Push code to GitHub
2. Create a new Render service
3. Connect your repository
4. Add environment variables
5. Deploy using Docker Compose

See `docs/deployment.md` for detailed deployment instructions.

### Database Migration

The project includes a SQL migration file for the database schema. Run the migration in your Supabase SQL Editor:

```bash
# Apply the initial schema migration
cat backend/migrations/001_initial_schema.sql
```

The migration includes:
- `profiles` table for user profiles
- `trips` table for trip data
- `trip_plans` table for AI-generated trip plans with all required fields
- Row Level Security (RLS) policies
- Indexes for performance

## 🧪 Testing

**Backend:**
```bash
cd backend
pytest
```

**Frontend:**
```bash
cd frontend
npm test
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support, email support@voyageai.com or open an issue on GitHub.

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- Supabase for database and auth
- TravelPayouts for flight and hotel data
- Foursquare for places and restaurants
- OpenWeather for weather data
- Unsplash for beautiful images

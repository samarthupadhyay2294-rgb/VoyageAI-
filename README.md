# VoyageAI – Intelligent AI Travel Planner

<div align="center">

![VoyageAI](https://img.shields.io/badge/VoyageAI-AI%20Travel%20Planner-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**An enterprise-grade, production-ready AI-powered travel planning platform that automatically creates complete travel plans using multiple AI agents.**

[🌐 Live Demo](https://voyageai-froentend.onrender.com) • [📖 Documentation](#-documentation) • [🚀 Getting Started](#-setup) • [🤝 Contributing](#-contributing)

</div>

---

## ✨ Features

- **AI-Powered Trip Planning**: Automatically generates complete travel itineraries using Google Gemini AI
- **Multi-Agent Architecture**: 11 specialized AI agents working together
- **Flight Search**: Integration with TravelPayouts for flight recommendations
- **Hotel Suggestions**: AI-powered hotel recommendations with booking links
- **Attraction Discovery**: Foursquare integration for places and attractions
- **Restaurant Recommendations**: AI-curated dining suggestions
- **Weather Analysis**: Real-time weather data and forecasts
- **Budget Estimation**: Currency conversion and budget breakdown
- **Destination Images**: Beautiful destination photography from Unsplash
- **PDF Export**: Download complete itineraries as PDF
- **Trip Sharing**: Share trips with others
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

Create a Supabase project and run the following SQL in the Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    preferred_currency TEXT DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trips table
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    travelers INTEGER NOT NULL,
    budget DECIMAL(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    interests TEXT[],
    travel_style TEXT,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trip_plans table
CREATE TABLE trip_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    weather JSONB,
    flights JSONB,
    hotels JSONB,
    places JSONB,
    restaurants JSONB,
    budget_breakdown JSONB,
    hero_image TEXT,
    itinerary JSONB,
    ai_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trip_plans_trip_id ON trip_plans(trip_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own trips" ON trips
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trips" ON trips
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips" ON trips
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips" ON trips
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view trip plans for own trips" ON trip_plans
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = trip_plans.trip_id
            AND trips.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert trip plans for own trips" ON trip_plans
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = trip_plans.trip_id
            AND trips.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update trip plans for own trips" ON trip_plans
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = trip_plans.trip_id
            AND trips.user_id = auth.uid()
        )
    );

-- Function to handle new user profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, full_name, avatar_url, preferred_currency)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url',
        'USD'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
```

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
│       └── ...
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
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
- Rate limiting using SlowAPI
- Request/response validation with Pydantic
- CORS configuration
- Security headers
- Environment variable protection
- Redis caching with TTL
- Structured logging

## 🤖 AI Agents

The application uses 11 specialized AI agents:

1. **Validation Agent**: Validates trip parameters
2. **Weather Agent**: Fetches weather data and forecasts
3. **Flight Agent**: Searches for flights via TravelPayouts
4. **Hotel Agent**: Finds hotel recommendations
5. **Places Agent**: Discovers attractions via Foursquare
6. **Restaurant Agent**: Recommends restaurants via Foursquare
7. **Budget Agent**: Handles currency conversion and budget allocation
8. **Image Agent**: Fetches destination images from Unsplash
9. **Planner Agent**: Generates AI itinerary using Gemini
10. **JSON Validator Agent**: Validates AI responses
11. **Save Agent**: Saves data to Supabase

## 📊 API Endpoints

### Health
- `GET /health` - Health check

### Authentication
- `GET /api/me` - Get current user

### Trips
- `GET /api/trips` - List all trips
- `POST /api/trips` - Create a trip
- `GET /api/trips/{id}` - Get trip details
- `DELETE /api/trips/{id}` - Delete a trip
- `POST /api/trips/{id}/generate` - Generate AI trip plan
- `POST /api/trips/{id}/regenerate` - Regenerate trip plan
- `POST /api/trips/{id}/duplicate` - Duplicate a trip
- `POST /api/trips/{id}/share` - Share a trip
- `GET /api/trips/{id}/pdf` - Download trip as PDF

## 🚢 Deployment

### Live Deployment

- **Frontend**: [https://voyageai-froentend.onrender.com](https://voyageai-froentend.onrender.com)
- **Backend API**: [https://voyageai-backend-kym8.onrender.com](https://voyageai-backend-kym8.onrender.com)
- **API Documentation**: [https://voyageai-backend-kym8.onrender.com/docs](https://voyageai-backend-kym8.onrender.com/docs)

### Deploy to Render

1. Push code to GitHub
2. Create a new Render service
3. Connect your repository
4. Add environment variables
5. Deploy using Docker Compose

See `docs/deployment.md` for detailed deployment instructions.

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

# VoyageAI Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- Supabase account with project created
- API keys for external services (Gemini, OpenWeather, Foursquare, Unsplash, ExchangeRate, TravelPayouts)
- Domain name (optional, for production)

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/voyageai.git
cd voyageai
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update the `.env` file with your actual values:

```env
# AI & External APIs
GEMINI_API_KEY=your_gemini_key
OPENWEATHER_API_KEY=your_openweather_key
FOURSQUARE_API_KEY=your_foursquare_key
UNSPLASH_ACCESS_KEY=your_unsplash_key
EXCHANGERATE_API_KEY=your_exchangerate_key
TRAVELPAYOUTS_API_TOKEN=your_travelpayouts_token
TRAVELPAYOUTS_MARKER=your_marker

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Security
JWT_SECRET_KEY=your_jwt_secret

# Backend
BACKEND_ENV=production
REDIS_URL=redis://redis:6379/0

# Frontend
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=https://api.yourdomain.com
```

### 3. Supabase Database Setup

Run the SQL migration in your Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  preferred_currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  travelers INTEGER DEFAULT 1,
  budget DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  interests TEXT[] DEFAULT '{}',
  travel_style TEXT DEFAULT 'general',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trip_plans table
CREATE TABLE IF NOT EXISTS trip_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  itinerary JSONB,
  weather_data JSONB,
  flight_options JSONB,
  hotel_options JSONB,
  places JSONB,
  restaurants JSONB,
  budget_breakdown JSONB,
  images JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own trips" ON trips
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own trips" ON trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips" ON trips
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips" ON trips
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own trip plans" ON trip_plans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_plans.trip_id
      AND trips.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trip_plans_trip_id ON trip_plans(trip_id);
```

## Local Development

### Start Services

```bash
docker-compose up -d
```

This will start:
- Frontend on `http://localhost:3000`
- Backend on `http://localhost:8000`
- Redis on `localhost:6379`

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f redis
```

### Stop Services

```bash
docker-compose down
```

### Rebuild Services

```bash
docker-compose up -d --build
```

## Production Deployment

### Option 1: Docker Compose (VPS)

1. **Prepare Server**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

2. **Deploy Application**

```bash
# Clone repository
git clone https://github.com/yourusername/voyageai.git
cd voyageai

# Configure environment
cp .env.example .env
nano .env  # Add your production values

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

3. **Configure Nginx (Optional)**

```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/voyageai
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/voyageai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. **SSL with Let's Encrypt**

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

### Option 2: Cloud Deployment (AWS/GCP/Azure)

#### AWS ECS

1. **Push Images to ECR**

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push frontend
docker build -t voyageai-frontend ./frontend
docker tag voyageai-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/voyageai-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/voyageai-frontend:latest

# Build and push backend
docker build -t voyageai-backend ./backend
docker tag voyageai-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/voyageai-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/voyageai-backend:latest
```

2. **Create ECS Task Definition**

Use the AWS Console or CLI to create task definitions for frontend, backend, and Redis.

3. **Create ECS Service**

Create services using the task definitions and configure load balancers.

#### Google Cloud Run

```bash
# Build and push frontend
gcloud builds submit --tag gcr.io/PROJECT_ID/voyageai-frontend ./frontend

# Build and push backend
gcloud builds submit --tag gcr.io/PROJECT_ID/voyageai-backend ./backend

# Deploy frontend
gcloud run deploy voyageai-frontend --image gcr.io/PROJECT_ID/voyageai-frontend --platform managed

# Deploy backend
gcloud run deploy voyageai-backend --image gcr.io/PROJECT_ID/voyageai-backend --platform managed
```

## Monitoring

### Health Checks

- Frontend: `http://yourdomain.com`
- Backend Health: `http://yourdomain.com/api/health`
- Backend API Docs: `http://yourdomain.com/docs`

### Logs

```bash
# Docker Compose
docker-compose logs -f

# Cloud (AWS)
aws logs tail /ecs/voyageai-backend --follow

# Cloud (GCP)
gcloud logging tail
```

### Metrics

Consider setting up:
- Prometheus for metrics collection
- Grafana for visualization
- Uptime monitoring (Pingdom, UptimeRobot)

## Backup Strategy

### Database Backup

Supabase handles automatic backups. Configure:
- Point-in-time recovery (7 days retention)
- Daily backups (30 days retention)
- Weekly backups (90 days retention)

### Backup Environment Variables

```bash
# Backup .env file
cp .env .env.backup

# Encrypt backup
gpg -c .env.backup
rm .env.backup
```

## Scaling

### Horizontal Scaling

- **Frontend**: Use a load balancer (Nginx, AWS ALB)
- **Backend**: Deploy multiple instances behind a load balancer
- **Redis**: Use Redis Cluster for high availability

### Vertical Scaling

- Increase CPU/RAM for Docker containers
- Use larger instance types on cloud providers

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs <service>

# Rebuild without cache
docker-compose build --no-cache <service>

# Check resource usage
docker stats
```

### Database Connection Issues

```bash
# Check Supabase status
# Verify connection string in .env
# Test connection from backend container
docker-compose exec backend python -c "from app.database.supabase import test_connection; test_connection()"
```

### Redis Connection Issues

```bash
# Check Redis status
docker-compose exec redis redis-cli ping

# Clear Redis cache
docker-compose exec redis redis-cli FLUSHALL
```

### API Rate Limiting

Adjust rate limits in `backend/app/config.py`:
```python
RATE_LIMIT_PER_MINUTE = 200  # Increase limit
```

## Security Checklist

- [ ] Change default JWT secret
- [ ] Use strong API keys
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Enable RLS on all tables
- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Use secrets manager (AWS Secrets Manager, GCP Secret Manager)

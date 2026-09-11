-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    preferred_currency TEXT DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
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

-- Create trip_plans table with all fields from TripOrchestrator
CREATE TABLE IF NOT EXISTS trip_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    location_intelligence JSONB,
    weather JSONB,
    flights JSONB,
    hotels JSONB,
    places JSONB,
    restaurants JSONB,
    budget_breakdown JSONB,
    hero_image TEXT,
    gallery JSONB,
    itinerary JSONB,
    ai_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_trip_plan UNIQUE (trip_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_plans_trip_id ON trip_plans(trip_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_plans ENABLE ROW LEVEL SECURITY;

-- PostgreSQL does not support CREATE POLICY IF NOT EXISTS. Drop and recreate
-- policies so this migration can be run again safely.
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own trips" ON trips;
CREATE POLICY "Users can view own trips" ON trips
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own trips" ON trips;
CREATE POLICY "Users can insert own trips" ON trips
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own trips" ON trips;
CREATE POLICY "Users can update own trips" ON trips
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own trips" ON trips;
CREATE POLICY "Users can delete own trips" ON trips
    FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view trip plans for own trips" ON trip_plans;
CREATE POLICY "Users can view trip plans for own trips" ON trip_plans
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = trip_plans.trip_id
            AND trips.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert trip plans for own trips" ON trip_plans;
CREATE POLICY "Users can insert trip plans for own trips" ON trip_plans
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = trip_plans.trip_id
            AND trips.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update trip plans for own trips" ON trip_plans;
CREATE POLICY "Users can update trip plans for own trips" ON trip_plans
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM trips
            WHERE trips.id = trip_plans.trip_id
            AND trips.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete trip plans for own trips" ON trip_plans;
CREATE POLICY "Users can delete trip plans for own trips" ON trip_plans
    FOR DELETE USING (
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
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

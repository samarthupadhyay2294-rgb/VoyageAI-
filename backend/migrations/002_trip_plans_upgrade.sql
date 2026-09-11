-- 002_trip_plans_upgrade.sql
-- Forward-safe upgrade for existing deployments that ran an earlier
-- version of 001_initial_schema.sql which may have lacked
-- location_intelligence, gallery, and the UNIQUE(trip_id) constraint.
--
-- Idempotent: safe to run multiple times on fresh or upgraded databases.
-- Historical duplicate handling: when multiple trip_plans rows share the
-- same trip_id, this migration preserves the newest row deterministically
-- (ORDER BY updated_at DESC, created_at DESC, id DESC) and deletes older
-- duplicates before enforcing uniqueness.

-- 1) Ensure trip_plans exists (fresh or existing DB)
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2) Add missing columns idempotently
ALTER TABLE trip_plans ADD COLUMN IF NOT EXISTS location_intelligence JSONB;
ALTER TABLE trip_plans ADD COLUMN IF NOT EXISTS gallery JSONB;
ALTER TABLE trip_plans ADD COLUMN IF NOT EXISTS weather JSONB;
ALTER TABLE trip_plans ADD COLUMN IF NOT EXISTS flights JSONB;
ALTER TABLE trip_plans ADD COLUMN IF NOT EXISTS hotels JSONB;
ALTER TABLE trip_plans ADD COLUMN IF NOT EXISTS places JSONB;
ALTER TABLE trip_plans ADD COLUMN IF NOT EXISTS restaurants JSONB;
ALTER TABLE trip_plans ADD COLUMN IF NOT EXISTS budget_breakdown JSONB;
ALTER TABLE trip_plans ADD COLUMN IF NOT EXISTS hero_image TEXT;
ALTER TABLE trip_plans ADD COLUMN IF NOT EXISTS itinerary JSONB;
ALTER TABLE trip_plans ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE trip_plans ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE trip_plans ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3) Detect and resolve historical duplicates before adding uniqueness.
-- Keeps exactly one row per trip_id: newest by (updated_at, created_at, id).
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'trip_plans') THEN
        -- Delete duplicates, preserving newest row per trip_id
        DELETE FROM trip_plans
        WHERE id NOT IN (
            SELECT DISTINCT ON (trip_id) id
            FROM trip_plans
            ORDER BY trip_id, updated_at DESC NULLS LAST, created_at DESC NULLS LAST, id DESC
        );
    END IF;
END $$;

-- 4) Add uniqueness guarantee idempotently.
-- Use both a UNIQUE index and a named constraint so fresh and upgraded DBs converge.
CREATE UNIQUE INDEX IF NOT EXISTS unique_trip_plan ON trip_plans (trip_id);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'unique_trip_plan'
        AND conrelid = 'trip_plans'::regclass
    ) THEN
        -- Only add constraint if no duplicate trip_id remains (handled above)
        ALTER TABLE trip_plans ADD CONSTRAINT unique_trip_plan UNIQUE (trip_id);
    END IF;
EXCEPTION WHEN duplicate_table THEN
    NULL;
WHEN duplicate_object THEN
    NULL;
END $$;

-- 5) Supporting index for lookups (idempotent)
CREATE INDEX IF NOT EXISTS idx_trip_plans_trip_id ON trip_plans(trip_id);

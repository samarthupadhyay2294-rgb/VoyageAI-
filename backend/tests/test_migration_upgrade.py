"""Tests for 002_trip_plans_upgrade migration idempotency and content."""
import pathlib

MIGRATION = pathlib.Path(__file__).parent.parent / "migrations" / "002_trip_plans_upgrade.sql"


def test_migration_file_exists():
    assert MIGRATION.exists(), "002_trip_plans_upgrade.sql must exist"


def test_migration_adds_missing_columns_idempotently():
    sql = MIGRATION.read_text(encoding="utf-8")
    # Must use ALTER TABLE ... ADD COLUMN IF NOT EXISTS for required columns
    assert "ADD COLUMN IF NOT EXISTS location_intelligence" in sql
    assert "ADD COLUMN IF NOT EXISTS gallery" in sql


def test_migration_handles_duplicates_before_unique_constraint():
    sql = MIGRATION.read_text(encoding="utf-8").lower()
    # Must delete duplicates deterministically before enforcing uniqueness
    assert "delete from trip_plans" in sql
    assert "distinct on (trip_id)" in sql
    # Preserve newest deterministically
    assert "updated_at desc" in sql
    assert "created_at desc" in sql
    # Documents behavior
    assert "newest" in sql or "preserves" in sql


def test_migration_enforces_unique_trip_id_idempotently():
    sql = MIGRATION.read_text(encoding="utf-8")
    # Idempotent unique guarantee
    assert "CREATE UNIQUE INDEX IF NOT EXISTS unique_trip_plan" in sql
    assert "ADD CONSTRAINT unique_trip_plan UNIQUE (trip_id)" in sql
    # Wrapped in DO block for idempotency
    assert "DO $$" in sql
    assert "duplicate_object" in sql.lower() or "duplicate_table" in sql.lower()


def test_migration_is_repeatable():
    sql = MIGRATION.read_text(encoding="utf-8")
    # No CREATE POLICY IF NOT EXISTS or other non-idempotent constructs
    assert "CREATE POLICY IF NOT EXISTS" not in sql
    # All ADD COLUMN must be IF NOT EXISTS
    for line in sql.splitlines():
        stripped = line.strip().upper()
        if stripped.startswith("ALTER TABLE") and "ADD COLUMN" in stripped:
            assert "IF NOT EXISTS" in stripped, f"Non-idempotent ALTER: {line}"

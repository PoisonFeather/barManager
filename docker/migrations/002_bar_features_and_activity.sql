-- Migration: Add bar features, table activity tracking, and user category permissions

ALTER TABLE bars ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '{"timer_minutes": 20, "has_kds": false}'::jsonb;

ALTER TABLE tables ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE users ADD COLUMN IF NOT EXISTS allowed_categories UUID[] DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_tables_active_last_activity ON tables(last_activity_at) WHERE status = 'active';

-- Verify
-- SELECT id, name, features FROM bars LIMIT 1;

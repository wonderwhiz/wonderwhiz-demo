-- Add streak freeze columns to child_profiles table
ALTER TABLE child_profiles
ADD COLUMN last_streak_freeze_used_at TIMESTAMPTZ NULL,
ADD COLUMN streak_freeze_available BOOLEAN DEFAULT TRUE NOT NULL;

-- Optional: Add an index for faster lookups if needed on streak_freeze_available
-- CREATE INDEX idx_child_profiles_streak_freeze_available ON child_profiles(streak_freeze_available);

-- Update existing rows to have streak_freeze_available set to TRUE
UPDATE child_profiles
SET streak_freeze_available = TRUE
WHERE streak_freeze_available IS NULL;

COMMENT ON COLUMN child_profiles.last_streak_freeze_used_at IS 'Timestamp of when a streak freeze was last consumed by the child.';
COMMENT ON COLUMN child_profiles.streak_freeze_available IS 'Indicates if the child currently has a streak freeze available for use. Defaults to TRUE.';

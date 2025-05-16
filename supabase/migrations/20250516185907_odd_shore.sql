/*
  # Add performer fields

  1. New Fields
    - Travel radius enum and column
    - Availability preferences
    - Performance requirements
    - Content preferences
    - Background check status

  2. Changes
    - Add travel_radius enum type
    - Add all preference columns with appropriate defaults
*/

-- Create travel radius enum type if it doesn't exist
DO $$ BEGIN
  CREATE TYPE travel_radius AS ENUM (
    'local_only',      -- 0-10 miles
    'short_distance',  -- 10-25 miles
    'medium_distance', -- 25-50 miles
    'long_distance',   -- 50-100 miles
    'nationwide'       -- Will travel anywhere
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS travel_radius travel_radius DEFAULT 'local_only',
ADD COLUMN IF NOT EXISTS available_for_travel boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS available_virtual boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS require_travel_expenses boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS require_deposit boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS bring_own_costume boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS perform_outdoors boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS require_dressing_room boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS family_friendly_only boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS adult_themes_ok boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS group_performer boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS background_check boolean DEFAULT false;
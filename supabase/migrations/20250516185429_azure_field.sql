/*
  # Add performer fields for travel and preferences

  1. New Fields
    - `travel_radius` - How far the performer is willing to travel
    - Various boolean preference flags for performer availability and requirements

  2. Changes
    - Add new columns to profiles table
    - Add constraints and default values
*/

-- Add travel radius enum type
CREATE TYPE travel_radius AS ENUM (
  'local_only',      -- 0-10 miles
  'short_distance',  -- 10-25 miles
  'medium_distance', -- 25-50 miles
  'long_distance',   -- 50-100 miles
  'nationwide'       -- Will travel anywhere
);

-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN travel_radius travel_radius DEFAULT 'local_only',
ADD COLUMN available_for_travel boolean DEFAULT false,
ADD COLUMN available_virtual boolean DEFAULT false,
ADD COLUMN require_travel_expenses boolean DEFAULT false,
ADD COLUMN require_deposit boolean DEFAULT false,
ADD COLUMN bring_own_costume boolean DEFAULT true,
ADD COLUMN perform_outdoors boolean DEFAULT true,
ADD COLUMN require_dressing_room boolean DEFAULT false,
ADD COLUMN family_friendly_only boolean DEFAULT false,
ADD COLUMN adult_themes_ok boolean DEFAULT false,
ADD COLUMN group_performer boolean DEFAULT false,
ADD COLUMN background_check boolean DEFAULT false;
/*
  # Add performer fields

  1. New Columns
    - Add travel radius and preferences to profiles table

  2. Changes
    - Add travel_radius column with enum type
    - Add preferences columns for various booking options
*/

-- Create enum for travel radius
CREATE TYPE travel_radius AS ENUM ('0-10', '10-25', '25-50', '50-100', 'nationwide');

-- Add travel radius column
ALTER TABLE profiles
ADD COLUMN travel_radius travel_radius DEFAULT '0-10';

-- Add preference columns
ALTER TABLE profiles
ADD COLUMN available_for_travel boolean DEFAULT false,
ADD COLUMN available_for_virtual boolean DEFAULT false,
ADD COLUMN require_travel_reimbursement boolean DEFAULT false,
ADD COLUMN require_deposit boolean DEFAULT false,
ADD COLUMN bring_own_props boolean DEFAULT false,
ADD COLUMN perform_outdoors boolean DEFAULT false,
ADD COLUMN require_dressing_room boolean DEFAULT false,
ADD COLUMN family_friendly_only boolean DEFAULT false,
ADD COLUMN adult_themed boolean DEFAULT false,
ADD COLUMN work_with_others boolean DEFAULT false,
ADD COLUMN background_check boolean DEFAULT false;
/*
  # Update contact messages table schema

  1. Changes
    - Rename address field to city, state, zip fields
    - Add NOT NULL constraints
    - Update existing data
*/

-- First add the new columns
ALTER TABLE contact_messages
ADD COLUMN city text,
ADD COLUMN state text,
ADD COLUMN zip text;

-- Update existing rows (if any) with empty values
UPDATE contact_messages
SET 
  city = '',
  state = '',
  zip = ''
WHERE 
  city IS NULL OR
  state IS NULL OR
  zip IS NULL;

-- Add NOT NULL constraints
ALTER TABLE contact_messages
ALTER COLUMN city SET NOT NULL,
ALTER COLUMN state SET NOT NULL,
ALTER COLUMN zip SET NOT NULL;

-- Drop the old address column if it exists
ALTER TABLE contact_messages
DROP COLUMN IF EXISTS address;
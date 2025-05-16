/*
  # Add contact email validation

  1. Changes
    - Add email format validation to contact_email column
    - Ensure column exists with proper constraints
*/

-- Add contact_email column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'contact_email'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN contact_email text NOT NULL DEFAULT '';
  END IF;
END $$;

-- Add email validation constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'profiles'
    AND constraint_name = 'profiles_contact_email_check'
  ) THEN
    ALTER TABLE profiles
    ADD CONSTRAINT profiles_contact_email_check 
      CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$');
  END IF;
END $$;

-- Remove any default value
ALTER TABLE profiles 
ALTER COLUMN contact_email DROP DEFAULT;
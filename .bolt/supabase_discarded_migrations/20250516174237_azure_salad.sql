/*
  # Add contact email field to profiles table

  1. Changes
    - Add contact_email column to profiles table
    - Make it required for new profiles
    - Add validation to ensure it's a valid email format

  2. Security
    - Maintain existing RLS policies
*/

-- Add contact_email column with email validation
ALTER TABLE profiles 
ADD COLUMN contact_email text NOT NULL DEFAULT '',
ADD CONSTRAINT profiles_contact_email_check 
  CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Remove the default after adding the column
ALTER TABLE profiles 
ALTER COLUMN contact_email DROP DEFAULT;
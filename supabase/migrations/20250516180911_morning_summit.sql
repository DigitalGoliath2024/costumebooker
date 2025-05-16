/*
  # Add contact email to profiles

  1. Changes
    - Add contact_email column to profiles table
    - Set default values using auth.users email
    - Add email format validation
*/

-- First add the column as nullable
ALTER TABLE profiles 
ADD COLUMN contact_email text;

-- Update existing rows with email from auth.users
UPDATE profiles
SET contact_email = (
  SELECT email 
  FROM auth.users 
  WHERE users.id = profiles.id
);

-- Now make it NOT NULL and add validation
ALTER TABLE profiles 
ALTER COLUMN contact_email SET NOT NULL,
ADD CONSTRAINT profiles_contact_email_check 
  CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$');
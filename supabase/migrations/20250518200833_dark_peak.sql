/*
  # Fix Profile Visibility Bug

  1. Changes
    - Update RLS policies for profiles table to allow both authenticated and anonymous users to view active profiles
    - Remove unintended filtering of profiles based on auth.uid()
    - Maintain security by only showing active and paid profiles

  2. Security
    - Keep existing RLS enabled
    - Maintain data protection while fixing visibility
*/

-- Drop existing public read policy
DROP POLICY IF EXISTS "Public can read active profiles" ON profiles;

-- Create new public read policy that allows viewing all active profiles
CREATE POLICY "Anyone can view active profiles"
  ON profiles
  FOR SELECT
  TO public
  USING (
    is_active = true 
    AND payment_status = 'paid'
  );

-- Ensure authenticated users can still manage their own profiles
DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;

CREATE POLICY "Users can read their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() 
    OR (is_active = true AND payment_status = 'paid')
  );
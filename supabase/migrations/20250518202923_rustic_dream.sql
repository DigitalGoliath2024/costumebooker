/*
  # Update Profile Images Policies

  1. Changes
    - Add public read access policy for profile images
    - Allow users to manage their own images
    - Enable RLS on profile_images table

  2. Security
    - Public can only view images for active, paid profiles
    - Users can only manage (CRUD) their own images
    - No direct deletion of images from storage (handled by application)
*/

-- Enable RLS
ALTER TABLE profile_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can view images for active profiles" ON profile_images;
DROP POLICY IF EXISTS "Users can manage their own images" ON profile_images;

-- Create policy for public read access
CREATE POLICY "Public can view images for active profiles"
ON profile_images
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1
    FROM profiles
    WHERE profiles.id = profile_images.profile_id
    AND profiles.is_active = true
    AND profiles.payment_status = 'paid'
  )
);

-- Create policy for authenticated users to manage their own images
CREATE POLICY "Users can manage their own images"
ON profile_images
FOR ALL
TO authenticated
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());
/*
  # Fix Profile Images Access

  1. Changes
    - Update storage policies to ensure proper image access
    - Fix profile images visibility for authenticated users
    - Ensure public access to active profile images

  2. Security
    - Maintain RLS while allowing proper image access
    - Keep existing security constraints
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view all images" ON storage.objects;

-- Create new upload policy
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create new update policy
CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create new delete policy
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create new read policy for profile images
CREATE POLICY "Anyone can view profile images"
ON storage.objects FOR SELECT TO public
USING (
  bucket_id = 'profile-images'
  AND EXISTS (
    SELECT 1 FROM profiles p
    WHERE 
      p.id::text = (storage.foldername(name))[1]
      AND (
        p.is_active = true 
        AND p.payment_status = 'paid'
        OR auth.uid()::text = (storage.foldername(name))[1]
      )
  )
);
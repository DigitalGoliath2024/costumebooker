/*
  # Fix Profile Images Access

  1. Changes
    - Drop and recreate storage policies to ensure proper image access
    - Fix profile images visibility for authenticated users
    - Ensure public access to active profile images

  2. Security
    - Maintain RLS while allowing proper image access
    - Keep existing security constraints
*/

-- Drop all existing policies first
DO $$ 
BEGIN
  -- Drop policies if they exist
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can upload their own images' AND tablename = 'objects' AND schemaname = 'storage') THEN
    DROP POLICY "Users can upload their own images" ON storage.objects;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own images' AND tablename = 'objects' AND schemaname = 'storage') THEN
    DROP POLICY "Users can update their own images" ON storage.objects;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own images' AND tablename = 'objects' AND schemaname = 'storage') THEN
    DROP POLICY "Users can delete their own images" ON storage.objects;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view profile images' AND tablename = 'objects' AND schemaname = 'storage') THEN
    DROP POLICY "Anyone can view profile images" ON storage.objects;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view all images' AND tablename = 'objects' AND schemaname = 'storage') THEN
    DROP POLICY "Public can view all images" ON storage.objects;
  END IF;
END $$;

-- Create new policies
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

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
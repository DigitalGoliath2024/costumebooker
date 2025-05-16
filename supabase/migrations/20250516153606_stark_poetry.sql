/*
  # Create storage bucket for profile images

  1. Storage
    - Create a new storage bucket named 'profile-images' for storing user profile images
  2. Security
    - Enable public access to the bucket
    - Add policy for authenticated users to manage their own images
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true);

-- Create policy to allow authenticated users to upload their own images
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow authenticated users to update their own images
CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow authenticated users to delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow public read access to all images
CREATE POLICY "Public can view all images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'profile-images');
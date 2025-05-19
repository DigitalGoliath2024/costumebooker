/*
  # Create Free Listing Requests Table

  1. New Tables
    - `free_listing_requests`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text, nullable)
      - `city` (text)
      - `state` (text)
      - `instagram` (text, nullable)
      - `facebook` (text, nullable)
      - `youtube` (text, nullable)
      - `tiktok` (text, nullable)
      - `website` (text, nullable)
      - `experience` (text)
      - `paid_events` (text)
      - `event_types` (text, nullable)
      - `characters` (text, nullable)
      - `bio` (text)
      - `travel` (text)
      - `why_join` (text, nullable)
      - `questions` (text, nullable)
      - `status` (text)
      - `reviewed_at` (timestamp, nullable)
      - `reviewed_by` (uuid, nullable)
      - `notes` (text, nullable)

  2. Security
    - Enable RLS
    - Add policy for public submissions
    - Add policy for admin access
*/

CREATE TABLE IF NOT EXISTS free_listing_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  city text NOT NULL,
  state text NOT NULL,
  instagram text,
  facebook text,
  youtube text,
  tiktok text,
  website text,
  experience text NOT NULL,
  paid_events text NOT NULL,
  event_types text,
  characters text,
  bio text NOT NULL,
  travel text NOT NULL,
  why_join text,
  questions text,
  status text NOT NULL DEFAULT 'pending',
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id),
  notes text,
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$'),
  CONSTRAINT status_values CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Enable RLS
ALTER TABLE free_listing_requests ENABLE ROW LEVEL SECURITY;

-- Allow public submissions
CREATE POLICY "Anyone can submit free listing requests"
  ON free_listing_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow admins to view and manage all requests
CREATE POLICY "Admins can view all requests"
  ON free_listing_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update requests"
  ON free_listing_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );
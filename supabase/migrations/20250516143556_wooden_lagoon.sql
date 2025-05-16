/*
  # Initial Schema for CosplayConnect

  1. New Tables
    - `profiles` - Stores performer profile information
    - `profile_categories` - Junction table for profile categories
    - `profile_images` - Stores profile images
    - `contact_messages` - Stores messages sent to performers

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access to active profiles
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  display_name text,
  bio text,
  state text,
  city text,
  price_min integer,
  price_max integer,
  facebook text,
  instagram text,
  tiktok text,
  twitter text,
  is_active boolean DEFAULT false,
  payment_status text DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'expired')),
  payment_expiry timestamptz
);

-- Create profile categories junction table
CREATE TABLE IF NOT EXISTS profile_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles ON DELETE CASCADE,
  category text NOT NULL
);

-- Create profile images table
CREATE TABLE IF NOT EXISTS profile_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles ON DELETE CASCADE,
  image_url text NOT NULL,
  position integer NOT NULL
);

-- Create contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  profile_id uuid REFERENCES profiles ON DELETE CASCADE,
  sender_name text NOT NULL,
  sender_email text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can create their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Public can read active profiles"
  ON profiles
  FOR SELECT
  TO anon
  USING (is_active = true AND payment_status = 'paid');

-- Profile categories policies
CREATE POLICY "Users can manage their own categories"
  ON profile_categories
  FOR ALL
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Public can read categories for active profiles"
  ON profile_categories
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_id
      AND profiles.is_active = true
      AND profiles.payment_status = 'paid'
    )
  );

-- Profile images policies
CREATE POLICY "Users can manage their own images"
  ON profile_images
  FOR ALL
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Public can view images for active profiles"
  ON profile_images
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_id
      AND profiles.is_active = true
      AND profiles.payment_status = 'paid'
    )
  );

-- Contact messages policies
CREATE POLICY "Anyone can create contact messages"
  ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read messages sent to them"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());
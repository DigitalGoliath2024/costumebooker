/*
  # Fix Contact Messages Permissions

  1. Changes
    - Add proper RLS policies for contact messages
    - Ensure public can create messages
    - Allow users to view and manage their own messages
    - Add proper constraints and validation

  2. Security
    - Enable RLS
    - Add policies for message management
    - Ensure data integrity
*/

-- First, ensure RLS is enabled
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can create contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Users can read messages sent to them" ON contact_messages;
DROP POLICY IF EXISTS "Users can delete messages sent to them" ON contact_messages;

-- Create policy for public message creation
CREATE POLICY "Anyone can create contact messages"
  ON contact_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy for users to read their messages
CREATE POLICY "Users can read messages sent to them"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

-- Create policy for users to delete their messages
CREATE POLICY "Users can delete messages sent to them"
  ON contact_messages
  FOR DELETE
  TO authenticated
  USING (profile_id = auth.uid());

-- Add or update constraints
DO $$ BEGIN
  -- Add message length constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'message_length'
  ) THEN
    ALTER TABLE contact_messages
    ADD CONSTRAINT message_length CHECK (length(message) <= 500);
  END IF;

  -- Add email format validation if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'sender_email_format'
  ) THEN
    ALTER TABLE contact_messages
    ADD CONSTRAINT sender_email_format 
    CHECK (sender_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$');
  END IF;
END $$;
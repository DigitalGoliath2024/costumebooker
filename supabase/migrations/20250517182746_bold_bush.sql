/*
  # Add event types and inquiry details to contact messages

  1. Changes
    - Add event_type column to contact_messages table
    - Add phone_number column
    - Add address column
    - Add captcha fields for validation
    - Add character limit to message

  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE contact_messages
ADD COLUMN event_type text[] NOT NULL DEFAULT '{}',
ADD COLUMN phone_number text NOT NULL,
ADD COLUMN address text NOT NULL,
ADD COLUMN captcha_answer integer NOT NULL,
ADD CONSTRAINT message_length CHECK (length(message) <= 500);
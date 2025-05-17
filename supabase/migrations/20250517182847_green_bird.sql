/*
  # Update contact messages table

  1. Changes
    - Add event_type array field
    - Add phone_number field
    - Add address field
    - Add captcha_answer field
    - Add message length constraint
    
  2. Implementation
    - Add columns as nullable first
    - Update existing rows with default values
    - Add NOT NULL constraints
*/

-- Add new columns as nullable first
ALTER TABLE contact_messages
ADD COLUMN event_type text[] DEFAULT '{}',
ADD COLUMN phone_number text,
ADD COLUMN address text,
ADD COLUMN captcha_answer integer;

-- Update existing rows with default values
UPDATE contact_messages
SET 
  event_type = '{}',
  phone_number = '',
  address = '',
  captcha_answer = 0
WHERE 
  phone_number IS NULL OR
  address IS NULL OR
  captcha_answer IS NULL;

-- Add NOT NULL constraints
ALTER TABLE contact_messages
ALTER COLUMN event_type SET NOT NULL,
ALTER COLUMN phone_number SET NOT NULL,
ALTER COLUMN address SET NOT NULL,
ALTER COLUMN captcha_answer SET NOT NULL;

-- Add message length constraint
ALTER TABLE contact_messages
ADD CONSTRAINT message_length CHECK (length(message) <= 500);
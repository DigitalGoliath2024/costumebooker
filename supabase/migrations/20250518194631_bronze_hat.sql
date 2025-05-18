/*
  # Add delete policy for contact messages

  1. Changes
    - Add policy allowing users to delete messages sent to them
    - Ensure proper security constraints
*/

-- Add policy for users to delete their own messages
CREATE POLICY "Users can delete messages sent to them"
  ON contact_messages
  FOR DELETE
  TO authenticated
  USING (profile_id = auth.uid());
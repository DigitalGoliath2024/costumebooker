/*
  # Add Admin Delete Policies

  1. Changes
    - Add policy for admins to delete contact messages
    - Add policy for admins to delete free listing requests

  2. Security
    - Only admins can delete messages and requests
    - Policies check user_roles table for admin role
*/

-- Add admin delete policy for contact messages
CREATE POLICY "Admins can delete messages"
  ON contact_messages
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Add admin delete policy for free listing requests
CREATE POLICY "Admins can delete requests"
  ON free_listing_requests
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );
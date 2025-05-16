/*
  # Fix recursive user roles policy

  1. Changes
    - Drop the recursive admin policy on user_roles table
    - Create new non-recursive policies for role management
    
  2. Security
    - Enable RLS (already enabled)
    - Add separate policies for admins and users
    - Prevent infinite recursion by using a direct role check
*/

-- Drop the recursive policy
DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;

-- Create new admin management policy using a direct role check
CREATE POLICY "Admins can manage all roles"
ON user_roles
FOR ALL
TO authenticated
USING (
  role = 'admin'
);

-- Keep existing policy for users to read their own role
-- "Users can read their own role" policy is already correct and non-recursive
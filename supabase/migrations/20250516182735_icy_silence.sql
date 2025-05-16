/*
  # Add admin user

  1. Changes
    - Insert admin user into user_roles table
*/

INSERT INTO user_roles (user_id, role)
VALUES ('bc542aa3-8c8e-4bba-be44-1a139e870dce', 'admin')
ON CONFLICT (user_id) DO UPDATE
SET role = 'admin';
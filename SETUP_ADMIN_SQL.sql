-- ============================================
-- QUICK ADMIN SETUP SQL SCRIPT
-- ============================================
-- Run this in Supabase SQL Editor to create admin user
-- ============================================

-- Step 1: Create the admin user (if not exists)
-- Note: You'll need to create the user in Supabase Dashboard first:
-- Go to: Authentication > Users > Add user
-- Email: sushanth@admin.local
-- Password: 123456
-- Auto Confirm: YES

-- Step 2: After creating the user, get their UUID from Authentication > Users
-- Then run this (replace 'YOUR_USER_UUID_HERE' with the actual UUID):

-- Make user an admin
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_UUID_HERE', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Step 3: Verify admin was created
SELECT 
  ur.user_id,
  ur.role,
  au.email,
  au.email_confirmed_at
FROM user_roles ur
JOIN auth.users au ON au.id = ur.user_id
WHERE ur.role = 'admin';

-- ============================================
-- ALTERNATIVE: If user already exists, find and update
-- ============================================

-- Find user by email
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'sushanth@admin.local';

-- Then use the ID from above to set admin role:
-- INSERT INTO user_roles (user_id, role)
-- VALUES ('ID_FROM_ABOVE', 'admin')
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- ============================================
-- FIX: If RLS is blocking, temporarily disable for admin access
-- ============================================

-- Allow admins to view all profiles (should already exist, but verify)
CREATE POLICY IF NOT EXISTS "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to view all user roles
CREATE POLICY IF NOT EXISTS "Admins can view all roles" ON user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

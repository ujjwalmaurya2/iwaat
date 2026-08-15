-- =================================================================
-- Migration: Seed Super Admin User (ujjwalmaurya2@gmail.com)
-- =================================================================

INSERT INTO public.admin_users (
  email,
  full_name,
  role,
  status,
  created_at,
  last_login_at
)
VALUES (
  'ujjwalmaurya2@gmail.com',
  'Ujjwal Maurya',
  'super_admin',
  'active',
  NOW(),
  NOW()
)
ON CONFLICT (email) 
DO UPDATE SET 
  role = 'super_admin',
  status = 'active',
  last_login_at = NOW();

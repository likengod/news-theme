-- Confirm the demo admin email and grant admin role
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE email = 'admin@demo.com';

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users WHERE email = 'admin@demo.com'
ON CONFLICT (user_id, role) DO NOTHING;
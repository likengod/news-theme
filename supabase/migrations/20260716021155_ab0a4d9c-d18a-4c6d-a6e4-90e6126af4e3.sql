-- Ensure profile + default reader role are created on new signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill profiles for existing auth users
INSERT INTO public.profiles (id, display_name, public_user_id)
SELECT u.id,
       COALESCE(u.raw_user_meta_data->>'display_name', split_part(u.email, '@', 1)),
       public.generate_public_user_id()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- Backfill reader role for anyone missing any role
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'reader'::app_role
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = u.id)
ON CONFLICT DO NOTHING;

-- Give journalist_id to anyone with the journalist role who doesn't have one yet
UPDATE public.profiles p
SET journalist_id = public.generate_journalist_id()
WHERE p.journalist_id IS NULL
  AND EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = p.id AND r.role = 'journalist');

-- Random points so the demo has variety
UPDATE public.profiles SET points = floor(random() * 500)::int WHERE points = 0;
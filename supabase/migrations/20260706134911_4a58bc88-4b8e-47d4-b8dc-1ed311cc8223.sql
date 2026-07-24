
-- 1. app_role enum + user_roles table
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'author', 'premium', 'reader');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 2. has_role security definer
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Admins can view all roles
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Add public 10-digit user_id to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS public_user_id text UNIQUE;

-- 4. Generator function
CREATE OR REPLACE FUNCTION public.generate_public_user_id()
RETURNS text
LANGUAGE plpgsql VOLATILE SET search_path = public
AS $$
DECLARE
  candidate text;
  i int := 0;
BEGIN
  LOOP
    -- 10 digits, first digit 1-9
    candidate := (1 + floor(random() * 9))::int::text
              || lpad(floor(random() * 1000000000)::bigint::text, 9, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE public_user_id = candidate);
    i := i + 1;
    IF i > 50 THEN
      candidate := substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
      EXIT;
    END IF;
  END LOOP;
  RETURN candidate;
END;
$$;

-- 5. Update handle_new_user to also set public_user_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, public_user_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    public.generate_public_user_id()
  );
  -- assign default reader role
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'reader')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

-- Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Backfill existing profiles missing public_user_id
UPDATE public.profiles SET public_user_id = public.generate_public_user_id()
WHERE public_user_id IS NULL;

-- 7. Make it required going forward
ALTER TABLE public.profiles ALTER COLUMN public_user_id SET NOT NULL;

-- 8. Admin read policy on profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

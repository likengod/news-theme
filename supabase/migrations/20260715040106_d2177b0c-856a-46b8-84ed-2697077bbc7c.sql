
-- Add 'journalist' to app_role enum (must be committed before use)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'journalist';

-- Add journalist_id column (nullable, unique)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS journalist_id text UNIQUE;

-- Generator: 3 uppercase letters + 4 digits + 1 uppercase letter (e.g. ABC1234Z)
CREATE OR REPLACE FUNCTION public.generate_journalist_id()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  letters text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  candidate text;
  i int := 0;
BEGIN
  LOOP
    candidate :=
      substr(letters, 1 + floor(random()*26)::int, 1) ||
      substr(letters, 1 + floor(random()*26)::int, 1) ||
      substr(letters, 1 + floor(random()*26)::int, 1) ||
      lpad(floor(random()*10000)::int::text, 4, '0') ||
      substr(letters, 1 + floor(random()*26)::int, 1);
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE journalist_id = candidate);
    i := i + 1;
    IF i > 50 THEN
      candidate := upper(substr(replace(gen_random_uuid()::text,'-',''), 1, 8));
      EXIT;
    END IF;
  END LOOP;
  RETURN candidate;
END;
$$;

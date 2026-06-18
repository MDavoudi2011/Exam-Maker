ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, email)
  VALUES (new.id, 'user', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- backfill emails from auth.users (requires postgres privileged access usually, but we can do our best or just gracefully degrade)
-- Supabase exposes auth.users to superuser and trigger
-- If we can't backfill easily from auth.users outside of a script, we'll do it via trigger or just let the current email be null for old users.
DO $$ 
BEGIN 
  UPDATE public.profiles p
  SET email = u.email
  FROM auth.users u
  WHERE p.id = u.id AND p.email IS NULL;
EXCEPTION
  WHEN OTHERS THEN
    -- Ignore if no access
END $$;

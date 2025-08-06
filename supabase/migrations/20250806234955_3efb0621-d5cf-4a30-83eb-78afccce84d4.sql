-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION generate_invitation_slug()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.slug := LOWER(
    REPLACE(
      REPLACE(NEW.bride_name || '-' || NEW.groom_name || '-' || EXTRACT(EPOCH FROM NOW())::text, ' ', '-'),
      '--', '-'
    )
  );
  RETURN NEW;
END;
$$;

-- Fix search_path for update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix search_path for handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;
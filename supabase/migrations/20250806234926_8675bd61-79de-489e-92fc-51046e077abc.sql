-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create wedding invitations table
CREATE TABLE public.wedding_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bride_name TEXT NOT NULL,
  groom_name TEXT NOT NULL,
  wedding_date DATE NOT NULL,
  wedding_time TIME,
  venue_name TEXT,
  venue_address TEXT,
  additional_info TEXT,
  template_id INTEGER DEFAULT 1,
  bride_photo_url TEXT,
  groom_photo_url TEXT,
  music_choice INTEGER DEFAULT 1,
  slug TEXT UNIQUE,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.wedding_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies for wedding invitations
CREATE POLICY "Users can view their own invitations" 
ON public.wedding_invitations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published invitations" 
ON public.wedding_invitations 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Users can create their own invitations" 
ON public.wedding_invitations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invitations" 
ON public.wedding_invitations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invitations" 
ON public.wedding_invitations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RSVP responses table
CREATE TABLE public.rsvp_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.wedding_invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  attendance_status TEXT NOT NULL CHECK (attendance_status IN ('attending', 'not_attending', 'maybe')),
  number_of_guests INTEGER DEFAULT 1,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rsvp_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for RSVP responses
CREATE POLICY "Anyone can create RSVP responses" 
ON public.rsvp_responses 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Invitation owners can view RSVP responses" 
ON public.rsvp_responses 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.wedding_invitations 
    WHERE id = invitation_id AND user_id = auth.uid()
  )
);

-- Create storage bucket for wedding photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'wedding-photos', 
  'wedding-photos', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
);

-- Create storage policies for wedding photos
CREATE POLICY "Anyone can view wedding photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'wedding-photos');

CREATE POLICY "Authenticated users can upload wedding photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'wedding-photos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own wedding photos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'wedding-photos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own wedding photos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'wedding-photos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Function to generate unique slug
CREATE OR REPLACE FUNCTION generate_invitation_slug()
RETURNS TRIGGER AS $$
BEGIN
  NEW.slug := LOWER(
    REPLACE(
      REPLACE(NEW.bride_name || '-' || NEW.groom_name || '-' || EXTRACT(EPOCH FROM NOW())::text, ' ', '-'),
      '--', '-'
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slug
CREATE TRIGGER generate_invitation_slug_trigger
  BEFORE INSERT ON public.wedding_invitations
  FOR EACH ROW
  EXECUTE FUNCTION generate_invitation_slug();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wedding_invitations_updated_at
  BEFORE UPDATE ON public.wedding_invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
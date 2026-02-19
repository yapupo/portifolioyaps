
-- Single-row table for site owner profile
CREATE TABLE public.site_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  bio TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_profile ENABLE ROW LEVEL SECURITY;

-- Anyone can read profile
CREATE POLICY "Anyone can view profile"
  ON public.site_profile FOR SELECT
  USING (true);

-- Admins can manage
CREATE POLICY "Admins can insert profile"
  ON public.site_profile FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update profile"
  ON public.site_profile FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Seed with empty profile
INSERT INTO public.site_profile (name, bio, photo_url) VALUES ('Seu Nome', 'Desenvolvedor web apaixonado por criar experiências digitais únicas.', '');

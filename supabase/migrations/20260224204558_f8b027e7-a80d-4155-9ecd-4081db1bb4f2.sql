
-- Add repo and deploy URLs to projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS repo_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS deploy_url TEXT;

-- Add social links to site_profile
ALTER TABLE public.site_profile ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE public.site_profile ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.site_profile ADD COLUMN IF NOT EXISTS whatsapp TEXT;

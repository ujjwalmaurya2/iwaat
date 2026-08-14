-- =================================================================
-- iWAAT Digital Services - Super Admin CMS & Database Architecture
-- Complete Supabase Schema with Row Level Security (RLS) & Policies
-- =================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ADMIN PROFILES
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'super_admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helper function to check if current authenticated user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
$$;

-- 3. PROJECT CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT NOT NULL,
  category_slug TEXT,
  url TEXT,
  tagline TEXT,
  description TEXT NOT NULL,
  long_description TEXT,
  image TEXT NOT NULL,
  preview_status TEXT DEFAULT 'ready',
  preview_updated_at TIMESTAMPTZ DEFAULT NOW(),
  logo TEXT,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'published', -- 'published' or 'draft'
  start_date TEXT,
  completion_date TEXT,
  display_order INT DEFAULT 0,
  stats JSONB DEFAULT '[]'::JSONB,
  technologies JSONB DEFAULT '[]'::JSONB,
  highlights JSONB DEFAULT '[]'::JSONB,
  client_name TEXT,
  challenge TEXT,
  solution TEXT,
  results TEXT,
  testimonial JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SERVICES
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'Zap',
  popular BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  features JSONB DEFAULT '[]'::JSONB,
  deliverables JSONB DEFAULT '[]'::JSONB,
  stats TEXT,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  content TEXT NOT NULL,
  rating NUMERIC DEFAULT 5,
  image TEXT,
  project_id TEXT,
  project_title TEXT,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'published',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. EVENTS & GALLERY
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  event_date TEXT,
  location TEXT,
  cover_image TEXT NOT NULL,
  images JSONB DEFAULT '[]'::JSONB,
  status TEXT DEFAULT 'published',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. CLIENT PROJECT INQUIRIES
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service TEXT NOT NULL,
  budget TEXT,
  description TEXT NOT NULL,
  requirements TEXT,
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'in_discussion', 'proposal_sent', 'approved', 'in_progress', 'completed', 'rejected', 'archived'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  follow_up_date TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  notes JSONB DEFAULT '[]'::JSONB,
  source TEXT DEFAULT 'website_contact',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. CONTACT SETTINGS
CREATE TABLE IF NOT EXISTS public.contact_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  email TEXT NOT NULL,
  secondary_email TEXT,
  phone TEXT NOT NULL,
  secondary_phone TEXT,
  whatsapp TEXT,
  location TEXT,
  working_hours TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  socials JSONB DEFAULT '{}'::JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. WEBSITE SETTINGS
CREATE TABLE IF NOT EXISTS public.website_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  name TEXT NOT NULL DEFAULT 'iWAAt',
  tagline TEXT,
  short_description TEXT,
  about_description TEXT,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  og_image TEXT,
  copyright_text TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. MEDIA ASSETS
CREATE TABLE IF NOT EXISTS public.media_assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_size INT,
  file_type TEXT,
  category TEXT DEFAULT 'general',
  dimensions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- 'inquiry', 'project', 'system', 'alert'
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  admin_email TEXT,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =================================================================

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. admin_profiles
CREATE POLICY "Admins can view profiles" ON public.admin_profiles
  FOR SELECT USING (auth.uid() = id OR public.is_super_admin());

CREATE POLICY "Super Admins can manage profiles" ON public.admin_profiles
  FOR ALL USING (public.is_super_admin());

-- 2. categories (Public Read, Admin Full)
CREATE POLICY "Public can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Super Admin can manage categories" ON public.categories
  FOR ALL USING (public.is_super_admin());

-- 3. projects (Public Read published, Admin Full)
CREATE POLICY "Public can view published projects" ON public.projects
  FOR SELECT USING (status = 'published' OR public.is_super_admin());

CREATE POLICY "Super Admin can manage projects" ON public.projects
  FOR ALL USING (public.is_super_admin());

-- 4. services (Public Read published, Admin Full)
CREATE POLICY "Public can view published services" ON public.services
  FOR SELECT USING (status = 'published' OR public.is_super_admin());

CREATE POLICY "Super Admin can manage services" ON public.services
  FOR ALL USING (public.is_super_admin());

-- 5. testimonials (Public Read published, Admin Full)
CREATE POLICY "Public can view published testimonials" ON public.testimonials
  FOR SELECT USING (status = 'published' OR public.is_super_admin());

CREATE POLICY "Super Admin can manage testimonials" ON public.testimonials
  FOR ALL USING (public.is_super_admin());

-- 6. events (Public Read published, Admin Full)
CREATE POLICY "Public can view published events" ON public.events
  FOR SELECT USING (status = 'published' OR public.is_super_admin());

CREATE POLICY "Super Admin can manage events" ON public.events
  FOR ALL USING (public.is_super_admin());

-- 7. inquiries (Public can INSERT, Super Admin can READ/UPDATE/DELETE)
CREATE POLICY "Anyone can submit inquiry" ON public.inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Super Admin can manage inquiries" ON public.inquiries
  FOR SELECT USING (public.is_super_admin());

CREATE POLICY "Super Admin can update inquiries" ON public.inquiries
  FOR UPDATE USING (public.is_super_admin());

CREATE POLICY "Super Admin can delete inquiries" ON public.inquiries
  FOR DELETE USING (public.is_super_admin());

-- 8. contact_settings (Public Read, Admin Full)
CREATE POLICY "Public can view contact settings" ON public.contact_settings
  FOR SELECT USING (true);

CREATE POLICY "Super Admin can update contact settings" ON public.contact_settings
  FOR ALL USING (public.is_super_admin());

-- 9. website_settings (Public Read, Admin Full)
CREATE POLICY "Public can view website settings" ON public.website_settings
  FOR SELECT USING (true);

CREATE POLICY "Super Admin can update website settings" ON public.website_settings
  FOR ALL USING (public.is_super_admin());

-- 10. media_assets (Public Read, Admin Full)
CREATE POLICY "Public can view media assets" ON public.media_assets
  FOR SELECT USING (true);

CREATE POLICY "Super Admin can manage media assets" ON public.media_assets
  FOR ALL USING (public.is_super_admin());

-- 11. notifications (Super Admin only)
CREATE POLICY "Super Admin can view and manage notifications" ON public.notifications
  FOR ALL USING (public.is_super_admin());

-- 12. audit_logs (Super Admin only)
CREATE POLICY "Super Admin can view and manage audit logs" ON public.audit_logs
  FOR ALL USING (public.is_super_admin());

-- =================================================================
-- STORAGE BUCKETS CONFIGURATION (Run in Supabase SQL editor)
-- =================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('iwaat-media', 'iwaat-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access iwaat-media" ON storage.objects
  FOR SELECT USING (bucket_id = 'iwaat-media');

CREATE POLICY "Admin Upload iwaat-media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'iwaat-media' AND (auth.role() = 'authenticated' OR public.is_super_admin()));

CREATE POLICY "Admin Delete iwaat-media" ON storage.objects
  FOR DELETE USING (bucket_id = 'iwaat-media' AND (auth.role() = 'authenticated' OR public.is_super_admin()));

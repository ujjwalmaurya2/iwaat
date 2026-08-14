-- =================================================================
-- iWAAT Digital Services - Super Admin CMS & Database Architecture
-- Project: iBot (ref: npqfnzuyglgrzsetrbdo)
-- Complete Supabase Schema with Google OAuth & Row Level Security (RLS)
-- =================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ADMIN USERS & ROLE-BASED ACCESS CONTROL
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'content_admin', 'crm_admin')) DEFAULT 'super_admin',
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'disabled')) DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- Backward compatibility view/synonym for admin_profiles
CREATE OR REPLACE VIEW public.admin_profiles AS 
SELECT id, email, full_name, role, created_at, updated_at 
FROM public.admin_users;

-- Helper function to check if current authenticated user is active super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE (auth_user_id = auth.uid() OR email = auth.jwt() ->> 'email')
      AND role = 'super_admin'
      AND status = 'active'
  );
$$;

-- Helper function to check if current user is any active admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE (auth_user_id = auth.uid() OR email = auth.jwt() ->> 'email')
      AND status = 'active'
  );
$$;

-- Helper trigger for linking Google OAuth sign-in to admin_users table
CREATE OR REPLACE FUNCTION public.handle_admin_google_login()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.admin_users WHERE email = NEW.email) THEN
    UPDATE public.admin_users
    SET auth_user_id = NEW.id,
        full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', full_name),
        avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', avatar_url),
        last_login_at = NOW(),
        updated_at = NOW()
    WHERE email = NEW.email;
  ELSE
    INSERT INTO public.admin_users (auth_user_id, email, full_name, avatar_url, role, status, last_login_at)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Google User'),
      COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL),
      'content_admin',
      'pending',
      NOW()
    )
    ON CONFLICT (email) DO UPDATE
    SET auth_user_id = EXCLUDED.auth_user_id,
        last_login_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;

-- Connect trigger to auth.users (triggers upon first Google OAuth signup)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_admin_google_login();

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
  preview_source TEXT DEFAULT 'auto',
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

-- 8. CLIENT PROJECT INQUIRIES (CRM)
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

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
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

-- 1. admin_users (Admins can view active team; user can always view own record by ID or email)
CREATE POLICY "Admins can view admin_users" ON public.admin_users
  FOR SELECT USING (auth.uid() = auth_user_id OR email = (auth.jwt() ->> 'email') OR public.is_admin());

CREATE POLICY "Super Admins can manage admin_users" ON public.admin_users
  FOR ALL USING (public.is_super_admin());

-- 2. categories (Public Read, Admin Full)
CREATE POLICY "Public can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (public.is_admin());

-- 3. projects (Public Read published, Admin Full)
CREATE POLICY "Public can view published projects" ON public.projects
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage projects" ON public.projects
  FOR ALL USING (public.is_admin());

-- 4. services (Public Read published, Admin Full)
CREATE POLICY "Public can view published services" ON public.services
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL USING (public.is_admin());

-- 5. testimonials (Public Read published, Admin Full)
CREATE POLICY "Public can view published testimonials" ON public.testimonials
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage testimonials" ON public.testimonials
  FOR ALL USING (public.is_admin());

-- 6. events (Public Read published, Admin Full)
CREATE POLICY "Public can view published events" ON public.events
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage events" ON public.events
  FOR ALL USING (public.is_admin());

-- 7. inquiries (Public can INSERT, Admins can READ/UPDATE/DELETE)
CREATE POLICY "Anyone can submit inquiry" ON public.inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage inquiries" ON public.inquiries
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update inquiries" ON public.inquiries
  FOR UPDATE USING (public.is_admin());

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

CREATE POLICY "Admins can manage media assets" ON public.media_assets
  FOR ALL USING (public.is_admin());

-- 11. notifications (Admins only)
CREATE POLICY "Admins can view and manage notifications" ON public.notifications
  FOR ALL USING (public.is_admin());

-- 12. audit_logs (Admins only)
CREATE POLICY "Admins can view and create audit logs" ON public.audit_logs
  FOR ALL USING (public.is_admin());

-- =================================================================
-- INITIAL SUPER ADMIN SEED
-- =================================================================
INSERT INTO public.admin_users (email, full_name, role, status)
VALUES 
  ('ujjwalmaurya2@gmail.com', 'Ujjwal Maurya', 'super_admin', 'active')
ON CONFLICT (email) DO UPDATE 
SET role = 'super_admin', status = 'active';

-- =================================================================
-- 39 STANDARD INDUSTRY CATEGORIES SEED
-- =================================================================
INSERT INTO public.categories (name, slug, display_order)
VALUES
  ('Healthcare', 'healthcare', 1),
  ('Hospitals', 'hospitals', 2),
  ('Pathology & Diagnostic Labs', 'pathology-diagnostic-labs', 3),
  ('Clinics', 'clinics', 4),
  ('Dental Clinics', 'dental-clinics', 5),
  ('Education', 'education', 6),
  ('Schools', 'schools', 7),
  ('Colleges & Universities', 'colleges-universities', 8),
  ('Coaching & Training', 'coaching-training', 9),
  ('NGO & Nonprofit', 'ngo-nonprofit', 10),
  ('Government', 'government', 11),
  ('Government Departments', 'government-departments', 12),
  ('E-Commerce', 'ecommerce', 13),
  ('Retail', 'retail', 14),
  ('Restaurants & Food', 'restaurants-food', 15),
  ('Hotels & Hospitality', 'hotels-hospitality', 16),
  ('Real Estate', 'real-estate', 17),
  ('Construction', 'construction', 18),
  ('Architecture & Interior Design', 'architecture-interior', 19),
  ('Finance & Accounting', 'finance-accounting', 20),
  ('Banking & FinTech', 'banking-fintech', 21),
  ('Legal & Law Firms', 'legal-law-firms', 22),
  ('IT & Software', 'it-software', 23),
  ('SaaS', 'saas', 24),
  ('Digital Marketing', 'digital-marketing', 25),
  ('Manufacturing', 'manufacturing', 26),
  ('Automobile', 'automobile', 27),
  ('Travel & Tourism', 'travel-tourism', 28),
  ('Events & Wedding', 'events-wedding', 29),
  ('Media & Entertainment', 'media-entertainment', 30),
  ('Photography', 'photography', 31),
  ('Printing & Publishing', 'printing-publishing', 32),
  ('Professional Services', 'professional-services', 33),
  ('Personal Portfolio', 'personal-portfolio', 34),
  ('Religious & Spiritual Organizations', 'religious-spiritual', 35),
  ('Community Organizations', 'community-organizations', 36),
  ('Sports & Fitness', 'sports-fitness', 37),
  ('Beauty & Wellness', 'beauty-wellness', 38),
  ('Other', 'other', 39)
ON CONFLICT (slug) DO NOTHING;

-- =================================================================
-- STORAGE BUCKETS CONFIGURATION
-- =================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('iwaat-media', 'iwaat-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access iwaat-media" ON storage.objects
  FOR SELECT USING (bucket_id = 'iwaat-media');

CREATE POLICY "Admin Upload iwaat-media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'iwaat-media' AND (auth.role() = 'authenticated' OR public.is_admin()));

CREATE POLICY "Admin Delete iwaat-media" ON storage.objects
  FOR DELETE USING (bucket_id = 'iwaat-media' AND (auth.role() = 'authenticated' OR public.is_super_admin()));

-- =================================================================
-- DEFAULT SETTINGS SEED
-- =================================================================
INSERT INTO public.contact_settings (
  id, email, secondary_email, phone, secondary_phone, whatsapp, 
  location, working_hours, address, city, state, country, socials
)
VALUES (
  'default',
  'hello@iwaat.com',
  'support@iwaat.com',
  '+1 (800) 492-2800',
  '+1 (800) 492-2801',
  '+18004922800',
  'Global / Remote Digital Agency (US & India Hubs)',
  'Mon - Sat: 9:00 AM - 8:00 PM EST (24/7 Support)',
  '750 Lexington Ave, Suite 1400',
  'New York',
  'NY',
  'USA',
  '{"linkedin": "https://linkedin.com/company/iwaat", "twitter": "https://twitter.com/iwaat", "instagram": "https://instagram.com/iwaat", "github": "https://github.com/iwaat"}'::JSONB
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.website_settings (
  id, site_name, tagline, description, primary_email, hero_title, hero_subtitle
)
VALUES (
  'default',
  'iWAAT Agency',
  'Engineering High-Impact Digital Solutions & Scalable Web Applications',
  'Premier digital agency specializing in custom web platforms, e-commerce, cloud infrastructure, and enterprise digital solutions.',
  'hello@iwaat.com',
  'Engineering Digital Excellence for Modern Global Brands',
  'We architect bespoke digital products, responsive web apps, and secure high-performance platforms.'
)
ON CONFLICT (id) DO NOTHING;


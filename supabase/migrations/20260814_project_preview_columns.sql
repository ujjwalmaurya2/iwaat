-- =================================================================
-- Migration: Add preview fields to public.projects
-- Project: iBot (npqfnzuyglgrzsetrbdo)
-- =================================================================

-- 1. Add preview columns to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS preview_status TEXT DEFAULT 'ready';

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS preview_source TEXT DEFAULT 'auto';

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS preview_updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Seed default singleton rows for settings tables if empty
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

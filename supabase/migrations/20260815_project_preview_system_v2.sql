-- =================================================================
-- Migration: Production-Grade Preview System Schema
-- Project: iBot (npqfnzuyglgrzsetrbdo)
-- =================================================================

-- 1. Add all required preview columns to projects table idempotently
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS preview_status TEXT DEFAULT 'idle';

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS preview_source TEXT;

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS preview_url TEXT;

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS preview_updated_at TIMESTAMPTZ;

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS preview_error TEXT;

-- 2. Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

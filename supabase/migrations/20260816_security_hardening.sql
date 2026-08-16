-- =================================================================
-- Migration: Security Hardening & Storage RLS Policies
-- Target Project: iBot (npqfnzuyglgrzsetrbdo)
-- Date: 2026-08-16
-- =================================================================

-- 1. HARDEN STORAGE RLS POLICIES FOR 'iwaat-media' BUCKET
-- Ensures only active admins can upload/update, super_admin can delete, and public can read.
DROP POLICY IF EXISTS "Public Access iwaat-media" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload iwaat-media" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update iwaat-media" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete iwaat-media" ON storage.objects;

CREATE POLICY "Public Access iwaat-media" ON storage.objects
  FOR SELECT USING (bucket_id = 'iwaat-media');

CREATE POLICY "Admin Upload iwaat-media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'iwaat-media' AND public.is_admin());

CREATE POLICY "Admin Update iwaat-media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'iwaat-media' AND public.is_admin());

CREATE POLICY "Admin Delete iwaat-media" ON storage.objects
  FOR DELETE USING (bucket_id = 'iwaat-media' AND public.is_super_admin());

-- 2. SERVER-SIDE DATABASE RATE LIMITING TRIGGER FOR INQUIRIES
CREATE OR REPLACE FUNCTION public.check_inquiry_rate_limit()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  recent_count INT;
BEGIN
  -- Validate payload size constraints on DB layer
  IF length(NEW.name) > 150 OR length(NEW.email) > 150 OR length(NEW.description) > 5000 THEN
    RAISE EXCEPTION 'Inquiry field length exceeds permissible server limit.'
      USING ERRCODE = 'P0002';
  END IF;

  -- Rate limit submissions by email (max 5 per 10 minutes)
  SELECT COUNT(*) INTO recent_count
  FROM public.inquiries
  WHERE email = NEW.email
    AND created_at > (NOW() - INTERVAL '10 minutes');

  IF recent_count >= 5 THEN
    RAISE EXCEPTION 'Too many submissions for this email address. Please wait a few minutes before trying again.'
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$;

-- Restrict direct execute permissions
REVOKE EXECUTE ON FUNCTION public.check_inquiry_rate_limit() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_inquiry_rate_limit() FROM anon;
REVOKE EXECUTE ON FUNCTION public.check_inquiry_rate_limit() FROM authenticated;

DROP TRIGGER IF EXISTS trg_inquiry_rate_limit ON public.inquiries;
CREATE TRIGGER trg_inquiry_rate_limit
  BEFORE INSERT ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.check_inquiry_rate_limit();

-- 3. AUTOMATED SECURE SERVER-SIDE NOTIFICATION TRIGGER FOR INQUIRIES
-- Replaces direct frontend inserts into notifications, isolating admin notifications.
CREATE OR REPLACE FUNCTION public.handle_new_inquiry_notification()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  INSERT INTO public.notifications (
    id,
    title,
    message,
    type,
    is_read,
    link,
    created_at
  )
  VALUES (
    'notif-' || substr(md5(random()::text || clock_timestamp()::text), 1, 12),
    'New Inquiry from ' || NEW.name,
    NEW.name || ' (' || COALESCE(NULLIF(NEW.company, ''), 'Private') || ') requested a consultation for ' || NEW.service || '.',
    'inquiry',
    false,
    '/super-admin/inquiries/' || NEW.id,
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Restrict direct execute permissions
REVOKE EXECUTE ON FUNCTION public.handle_new_inquiry_notification() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_inquiry_notification() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_inquiry_notification() FROM authenticated;

-- Attach trigger
DROP TRIGGER IF EXISTS on_inquiry_created ON public.inquiries;
CREATE TRIGGER on_inquiry_created
  AFTER INSERT ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_inquiry_notification();

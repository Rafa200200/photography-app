-- ==============================================================================
-- 🔒 SUPABASE STORAGE SECURITY POLICIES (RLS)
-- Run this in the Supabase SQL Editor to secure your Storage Buckets.
-- ==============================================================================

-- 1. Create the buckets if they don't exist yet
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('albums', 'albums', true),          -- Public bucket (photos accessible via URL, albums protected by access code)
  ('portfolio', 'portfolio', true)     -- Public bucket
ON CONFLICT (id) DO UPDATE SET public = excluded.public;

-- 2. PORTFOLIO BUCKET (Public Read, Admin Write)
-- Allow anyone to read portfolio images
CREATE POLICY "Public Read Portfolio" 
ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');

-- Allow only authenticated admins to insert/update/delete portfolio images
CREATE POLICY "Admin Insert Portfolio" 
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

CREATE POLICY "Admin Update Portfolio" 
ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

CREATE POLICY "Admin Delete Portfolio" 
ON storage.objects FOR DELETE USING (bucket_id = 'portfolio' AND auth.role() = 'authenticated');


-- 3. ALBUMS BUCKET (Public Read, Admin Write)
-- Anyone can view album images (access controlled at application level via access codes)
CREATE POLICY "Public Read Albums"
ON storage.objects FOR SELECT USING (bucket_id = 'albums');

-- Allow admins to upload/manage client albums
CREATE POLICY "Admin Insert Albums"
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'albums' AND auth.role() = 'authenticated');

CREATE POLICY "Admin Update Albums"
ON storage.objects FOR UPDATE USING (bucket_id = 'albums' AND auth.role() = 'authenticated');

CREATE POLICY "Admin Delete Albums"
ON storage.objects FOR DELETE USING (bucket_id = 'albums' AND auth.role() = 'authenticated');

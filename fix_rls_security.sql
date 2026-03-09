-- ==============================================================================
-- 🔒 SUPABASE ROW LEVEL SECURITY (RLS) - DATABASE TABLES
-- Run this in the Supabase SQL Editor to resolve all security warnings.
--
-- Logic:
--   - Server components read data using the anon key → needs public SELECT
--   - API routes write data using service_role key → bypasses RLS entirely
--   - Client gallery reads albums/photos server-side → needs public SELECT
--   - Favorites are inserted/deleted via API (service_role) → RLS not needed for writes
-- ==============================================================================

-- ============================================
-- 1. ALBUMS
-- ============================================
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;

-- Anyone can read albums (server components use anon key to fetch by code)
CREATE POLICY "Public read albums"
ON albums FOR SELECT
USING (true);

-- Authenticated users (admin) can insert/update/delete
CREATE POLICY "Admin insert albums"
ON albums FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admin update albums"
ON albums FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Admin delete albums"
ON albums FOR DELETE
TO authenticated
USING (true);


-- ============================================
-- 2. ALBUM CATEGORIES
-- ============================================
ALTER TABLE album_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read album_categories"
ON album_categories FOR SELECT
USING (true);

CREATE POLICY "Admin insert album_categories"
ON album_categories FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admin update album_categories"
ON album_categories FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Admin delete album_categories"
ON album_categories FOR DELETE
TO authenticated
USING (true);


-- ============================================
-- 3. PHOTOS
-- ============================================
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Anyone can read photos (client gallery reads them server-side)
CREATE POLICY "Public read photos"
ON photos FOR SELECT
USING (true);

-- Admin can manage photos (also done via service_role in API routes)
CREATE POLICY "Admin insert photos"
ON photos FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admin update photos"
ON photos FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Admin delete photos"
ON photos FOR DELETE
TO authenticated
USING (true);


-- ============================================
-- 4. PORTFOLIO PHOTOS
-- ============================================
ALTER TABLE portfolio_photos ENABLE ROW LEVEL SECURITY;

-- Anyone can read portfolio photos (they appear on the public homepage)
CREATE POLICY "Public read portfolio_photos"
ON portfolio_photos FOR SELECT
USING (true);

-- Admin can manage portfolio photos
CREATE POLICY "Admin insert portfolio_photos"
ON portfolio_photos FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admin update portfolio_photos"
ON portfolio_photos FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Admin delete portfolio_photos"
ON portfolio_photos FOR DELETE
TO authenticated
USING (true);


-- ============================================
-- 5. FAVORITES (if table exists)
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'favorites') THEN
    ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

    -- Anyone can read favorites (server needs to fetch them for the client gallery)
    EXECUTE 'CREATE POLICY "Public read favorites" ON favorites FOR SELECT USING (true)';

    -- Anyone can insert favorites (clients heart photos without logging in)
    EXECUTE 'CREATE POLICY "Public insert favorites" ON favorites FOR INSERT WITH CHECK (true)';

    -- Anyone can delete favorites (clients can un-heart photos)
    EXECUTE 'CREATE POLICY "Public delete favorites" ON favorites FOR DELETE USING (true)';
  END IF;
END
$$;

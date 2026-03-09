-- Add separate display fields for Navbar and Hero titles
-- Run this in the Supabase SQL Editor

ALTER TABLE photographers 
ADD COLUMN IF NOT EXISTS navbar_title TEXT,
ADD COLUMN IF NOT EXISTS hero_title TEXT,
ADD COLUMN IF NOT EXISTS tagline TEXT DEFAULT 'Capturing moments that last forever';

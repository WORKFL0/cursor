-- ============================================================================
-- FEATURES SCHEMA - For "Zo Werkt Het" / Features Page
-- ============================================================================
-- Created: 2025-11-18
-- Purpose: Manage product features displayed on work/features pages
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: features
-- ============================================================================
CREATE TABLE IF NOT EXISTS features (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Content
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT, -- Lucide icon name (e.g., 'Shield', 'Clock', 'Award')
  icon_url TEXT, -- Alternative: custom icon URL

  -- Media
  image_url TEXT,
  video_url TEXT,

  -- Categorization & Ordering
  category TEXT, -- e.g., 'security', 'productivity', 'communication'
  display_order INTEGER DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),

  -- SEO & metadata
  meta_title TEXT,
  meta_description TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,

  -- Stats
  view_count INTEGER DEFAULT 0
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_features_status ON features(status);
CREATE INDEX IF NOT EXISTS idx_features_category ON features(category);
CREATE INDEX IF NOT EXISTS idx_features_display_order ON features(display_order);
CREATE INDEX IF NOT EXISTS idx_features_published_at ON features(published_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE features ENABLE ROW LEVEL SECURITY;

-- Public read access for published features
DROP POLICY IF EXISTS "Public can read published features" ON features;
CREATE POLICY "Public can read published features"
  ON features FOR SELECT
  USING (status = 'published');

-- Admin full access (authenticated users with admin role)
DROP POLICY IF EXISTS "Admins can do everything on features" ON features;
CREATE POLICY "Admins can do everything on features"
  ON features FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_features_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_features_updated_at ON features;
CREATE TRIGGER trigger_features_updated_at
  BEFORE UPDATE ON features
  FOR EACH ROW
  EXECUTE FUNCTION update_features_updated_at();

-- Auto-set published_at when status changes to 'published'
CREATE OR REPLACE FUNCTION set_features_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_features_published_at ON features;
CREATE TRIGGER trigger_features_published_at
  BEFORE UPDATE ON features
  FOR EACH ROW
  EXECUTE FUNCTION set_features_published_at();

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE features IS 'Product features for Zo Werkt Het / Features pages';
COMMENT ON COLUMN features.icon_name IS 'Lucide icon name (e.g., Shield, Clock, Award)';
COMMENT ON COLUMN features.display_order IS 'Order in which features appear (lower = first)';

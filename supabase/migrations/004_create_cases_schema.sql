-- ============================================================================
-- CASE STUDIES SCHEMA - For Case Studies / Success Stories
-- ============================================================================
-- Created: 2025-11-18
-- Purpose: Manage client case studies and success stories
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: case_studies
-- ============================================================================
CREATE TABLE IF NOT EXISTS case_studies (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Client Information
  client_name TEXT NOT NULL,
  client_logo_url TEXT,
  client_industry TEXT, -- e.g., 'healthcare', 'finance', 'retail', 'media'
  client_size TEXT, -- e.g., '10-50', '50-200', '200+'
  client_location TEXT,

  -- Case Study Content
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT, -- Short one-liner
  challenge TEXT NOT NULL, -- The problem they faced
  solution TEXT NOT NULL, -- What Workflo provided
  results TEXT NOT NULL, -- The outcomes/impact

  -- Additional content
  testimonial TEXT,
  testimonial_author TEXT,
  testimonial_role TEXT,

  -- Media
  featured_image_url TEXT,
  gallery_images TEXT[], -- Array of image URLs
  video_url TEXT,

  -- Metrics (for results highlighting)
  metrics JSONB, -- e.g., {"uptime": "99.9%", "cost_savings": "40%", "response_time": "15min"}

  -- Categorization
  services_used TEXT[], -- e.g., ['managed-it', 'cybersecurity', 'cloud']
  tags TEXT[], -- e.g., ['migration', 'security-improvement', 'cost-reduction']

  -- Display & Ordering
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),

  -- SEO & metadata
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  project_completed_at DATE, -- When the actual project was completed

  -- Stats
  view_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_cases_status ON case_studies(status);
CREATE INDEX IF NOT EXISTS idx_cases_industry ON case_studies(client_industry);
CREATE INDEX IF NOT EXISTS idx_cases_featured ON case_studies(is_featured);
CREATE INDEX IF NOT EXISTS idx_cases_display_order ON case_studies(display_order);
CREATE INDEX IF NOT EXISTS idx_cases_published_at ON case_studies(published_at);
CREATE INDEX IF NOT EXISTS idx_cases_services ON case_studies USING GIN(services_used);
CREATE INDEX IF NOT EXISTS idx_cases_tags ON case_studies USING GIN(tags);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

-- Public read access for published cases
DROP POLICY IF EXISTS "Public can read published cases" ON case_studies;
CREATE POLICY "Public can read published cases"
  ON case_studies FOR SELECT
  USING (status = 'published');

-- Admin full access (authenticated users with admin role)
DROP POLICY IF EXISTS "Admins can do everything on cases" ON case_studies;
CREATE POLICY "Admins can do everything on cases"
  ON case_studies FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_cases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_cases_updated_at ON case_studies;
CREATE TRIGGER trigger_cases_updated_at
  BEFORE UPDATE ON case_studies
  FOR EACH ROW
  EXECUTE FUNCTION update_cases_updated_at();

-- Auto-set published_at when status changes to 'published'
CREATE OR REPLACE FUNCTION set_cases_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_cases_published_at ON case_studies;
CREATE TRIGGER trigger_cases_published_at
  BEFORE UPDATE ON case_studies
  FOR EACH ROW
  EXECUTE FUNCTION set_cases_published_at();

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE case_studies IS 'Client case studies and success stories';
COMMENT ON COLUMN case_studies.metrics IS 'JSON object with key metrics (e.g., {"uptime": "99.9%", "cost_savings": "40%"})';
COMMENT ON COLUMN case_studies.services_used IS 'Array of service slugs used in this case';
COMMENT ON COLUMN case_studies.is_featured IS 'Whether to feature this case on homepage/top of list';

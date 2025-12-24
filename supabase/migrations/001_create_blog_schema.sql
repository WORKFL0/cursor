-- ============================================================================
-- WORKFLO BLOG CMS DATABASE SCHEMA
-- ============================================================================
-- Created: 2025-11-18
-- Purpose: Multi-channel content publishing (Website, LinkedIn, Email)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- BLOG CATEGORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BLOG AUTHORS (extends auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS blog_authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  linkedin_url TEXT,
  role TEXT DEFAULT 'author', -- author, editor, admin
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BLOG POSTS (main content table)
-- ============================================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Basic content
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,

  -- Metadata
  author_id UUID REFERENCES blog_authors(id) ON DELETE SET NULL,
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft', -- draft, scheduled, published, archived

  -- Publishing
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,

  -- Organization
  tags TEXT[] DEFAULT '{}',
  read_time_minutes INTEGER,
  view_count INTEGER DEFAULT 0,

  -- Multi-channel publishing flags
  publish_to_linkedin BOOLEAN DEFAULT false,
  linkedin_post_id TEXT,
  linkedin_posted_at TIMESTAMPTZ,

  publish_to_email BOOLEAN DEFAULT false,
  email_campaign_id TEXT,
  email_sent_at TIMESTAMPTZ,

  -- Analytics
  last_viewed_at TIMESTAMPTZ,

  CONSTRAINT valid_status CHECK (status IN ('draft', 'scheduled', 'published', 'archived'))
);

-- ============================================================================
-- MEDIA LIBRARY
-- ============================================================================
CREATE TABLE IF NOT EXISTS blog_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  type TEXT NOT NULL, -- image, video, document
  mime_type TEXT,
  size_bytes INTEGER,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  caption TEXT,
  uploaded_by UUID REFERENCES blog_authors(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_type CHECK (type IN ('image', 'video', 'document'))
);

-- ============================================================================
-- BLOG TAGS (for better organization)
-- ============================================================================
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_media_type ON blog_media(type);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Public can read published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published' AND published_at <= NOW());

-- Public can read categories
CREATE POLICY "Public can read categories"
  ON blog_categories FOR SELECT
  TO public
  USING (true);

-- Public can read authors
CREATE POLICY "Public can read authors"
  ON blog_authors FOR SELECT
  TO public
  USING (is_active = true);

-- Public can read tags
CREATE POLICY "Public can read tags"
  ON blog_tags FOR SELECT
  TO public
  USING (true);

-- Public can read media
CREATE POLICY "Public can read media"
  ON blog_media FOR SELECT
  TO public
  USING (true);

-- Authors can manage their own posts
CREATE POLICY "Authors can manage own posts"
  ON blog_posts
  FOR ALL
  USING (
    auth.uid()::text = (SELECT id::text FROM blog_authors WHERE email = auth.email())
  );

-- Authors can upload media
CREATE POLICY "Authors can upload media"
  ON blog_media
  FOR INSERT
  WITH CHECK (
    auth.uid()::text = uploaded_by::text
  );

-- Authors can view all their media
CREATE POLICY "Authors can view own media"
  ON blog_media
  FOR SELECT
  USING (
    auth.uid()::text = uploaded_by::text
  );

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-update updated_at on posts
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at on categories
CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at on authors
CREATE TRIGGER update_blog_authors_updated_at
  BEFORE UPDATE ON blog_authors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Calculate read time
CREATE OR REPLACE FUNCTION calculate_read_time(content TEXT)
RETURNS INTEGER AS $$
DECLARE
  word_count INTEGER;
  words_per_minute INTEGER := 200;
BEGIN
  word_count := array_length(regexp_split_to_array(content, '\s+'), 1);
  RETURN GREATEST(1, CEIL(word_count::NUMERIC / words_per_minute));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Auto-calculate read time on insert/update
CREATE OR REPLACE FUNCTION auto_calculate_read_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.read_time_minutes := calculate_read_time(NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_calculate_blog_post_read_time
  BEFORE INSERT OR UPDATE OF content ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION auto_calculate_read_time();

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default category
INSERT INTO blog_categories (name, slug, description, color, icon) VALUES
  ('Cybersecurity', 'cybersecurity', 'Updates over cybersecurity dreigingen en oplossingen', '#EF4444', '🔒'),
  ('IT Tips', 'it-tips', 'Praktische IT tips voor bedrijven', '#3B82F6', '💡'),
  ('Company News', 'company-news', 'Nieuws van Workflo', '#10B981', '📢'),
  ('MSP Insights', 'msp-insights', 'Inzichten over Managed Service Providers', '#8B5CF6', '📊')
ON CONFLICT (slug) DO NOTHING;

-- Insert default author (you can update this later)
INSERT INTO blog_authors (email, display_name, bio, role) VALUES
  ('info@workflo.it', 'Workflo Team', 'IT experts die bedrijven helpen groeien', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert default tags
INSERT INTO blog_tags (name, slug) VALUES
  ('Cybersecurity', 'cybersecurity'),
  ('Cloud', 'cloud'),
  ('Microsoft 365', 'microsoft-365'),
  ('Backup', 'backup'),
  ('Managed IT', 'managed-it'),
  ('VoIP', 'voip')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- STORAGE BUCKET FOR BLOG IMAGES
-- ============================================================================
-- Note: This needs to be run in Supabase Dashboard or via API
-- Storage bucket: 'blog-images'
-- Policies:
--   - Public read access
--   - Authenticated write access
-- ============================================================================

COMMENT ON TABLE blog_posts IS 'Main blog posts table with multi-channel publishing support';
COMMENT ON TABLE blog_categories IS 'Blog post categories for organization';
COMMENT ON TABLE blog_authors IS 'Blog authors and contributors';
COMMENT ON TABLE blog_media IS 'Media library for images, videos, and documents';
COMMENT ON TABLE blog_tags IS 'Tags for blog post organization';

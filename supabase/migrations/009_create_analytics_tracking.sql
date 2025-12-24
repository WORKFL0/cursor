-- ============================================================================
-- ANALYTICS TRACKING SYSTEM
-- ============================================================================
-- Purpose: Track page views, visitors, and user behavior
-- Privacy: No personal data stored, only aggregated metrics
-- ============================================================================

-- Create analytics_page_views table
CREATE TABLE IF NOT EXISTS analytics_page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Page info
  page_path TEXT NOT NULL,
  page_title TEXT,

  -- Visitor info (hashed for privacy)
  visitor_id TEXT NOT NULL, -- Hashed visitor identifier
  session_id TEXT NOT NULL, -- Session identifier

  -- Referrer & source
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  -- Device info
  device_type TEXT, -- desktop, mobile, tablet
  browser TEXT,
  os TEXT,

  -- Geographic (optional)
  country TEXT,
  city TEXT,

  -- Engagement metrics
  time_on_page INTEGER, -- seconds
  scroll_depth INTEGER, -- percentage (0-100)

  -- Timestamps
  viewed_at TIMESTAMPTZ DEFAULT NOW(),

  -- Index for fast queries
  CONSTRAINT valid_scroll CHECK (scroll_depth >= 0 AND scroll_depth <= 100)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_page_views_path ON analytics_page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON analytics_page_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor ON analytics_page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON analytics_page_views(session_id);

-- Blog-specific analytics (inherits blog_posts view_count)
CREATE TABLE IF NOT EXISTS analytics_blog_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  time_on_page INTEGER,
  scroll_depth INTEGER,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_views_post ON analytics_blog_views(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_views_viewed_at ON analytics_blog_views(viewed_at);

-- Conversion tracking
CREATE TABLE IF NOT EXISTS analytics_conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Conversion type
  event_type TEXT NOT NULL, -- 'contact_form', 'newsletter', 'phone_click', 'download', etc.
  event_label TEXT,

  -- Visitor context
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,

  -- Additional data (JSON for flexibility)
  metadata JSONB DEFAULT '{}',

  -- Timestamp
  converted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversions_type ON analytics_conversions(event_type);
CREATE INDEX IF NOT EXISTS idx_conversions_converted_at ON analytics_conversions(converted_at);

-- ============================================================================
-- MATERIALIZED VIEWS FOR FAST QUERIES
-- ============================================================================

-- Daily aggregated stats (refresh daily)
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics_daily_stats AS
SELECT
  DATE(viewed_at) as date,
  COUNT(*) as total_views,
  COUNT(DISTINCT visitor_id) as unique_visitors,
  COUNT(DISTINCT session_id) as sessions,
  AVG(time_on_page) as avg_time_on_page,
  AVG(scroll_depth) as avg_scroll_depth
FROM analytics_page_views
GROUP BY DATE(viewed_at)
ORDER BY date DESC;

CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_stats_date ON analytics_daily_stats(date);

-- Top pages (last 30 days)
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics_top_pages AS
SELECT
  page_path,
  COUNT(*) as views,
  COUNT(DISTINCT visitor_id) as unique_views,
  AVG(time_on_page) as avg_time_on_page,
  AVG(scroll_depth) as avg_scroll_depth
FROM analytics_page_views
WHERE viewed_at >= NOW() - INTERVAL '30 days'
GROUP BY page_path
ORDER BY views DESC
LIMIT 100;

CREATE UNIQUE INDEX IF NOT EXISTS idx_top_pages_path ON analytics_top_pages(page_path);

-- Traffic sources (last 30 days)
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics_traffic_sources AS
SELECT
  COALESCE(utm_source,
    CASE
      WHEN referrer IS NULL THEN 'Direct'
      WHEN referrer LIKE '%google%' THEN 'Google'
      WHEN referrer LIKE '%linkedin%' THEN 'LinkedIn'
      WHEN referrer LIKE '%facebook%' THEN 'Facebook'
      ELSE 'Other'
    END
  ) as source,
  COUNT(DISTINCT visitor_id) as visitors,
  COUNT(*) as views
FROM analytics_page_views
WHERE viewed_at >= NOW() - INTERVAL '30 days'
GROUP BY source
ORDER BY visitors DESC;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to refresh materialized views (call daily via cron)
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_daily_stats;
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_top_pages;
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_traffic_sources;
END;
$$ LANGUAGE plpgsql;

-- Function to track blog post view (increments view_count)
CREATE OR REPLACE FUNCTION track_blog_view()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE blog_posts
  SET view_count = view_count + 1,
      last_viewed_at = NEW.viewed_at
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_blog_view_count
AFTER INSERT ON analytics_blog_views
FOR EACH ROW
EXECUTE FUNCTION track_blog_view();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_blog_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_conversions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for tracking)
CREATE POLICY "Allow public inserts on page_views" ON analytics_page_views
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public inserts on blog_views" ON analytics_blog_views
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public inserts on conversions" ON analytics_conversions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Only service role can read analytics
CREATE POLICY "Service role can read page_views" ON analytics_page_views
  FOR SELECT TO service_role
  USING (true);

CREATE POLICY "Service role can read blog_views" ON analytics_blog_views
  FOR SELECT TO service_role
  USING (true);

CREATE POLICY "Service role can read conversions" ON analytics_conversions
  FOR SELECT TO service_role
  USING (true);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE analytics_page_views IS 'Page view tracking (privacy-friendly, no PII)';
COMMENT ON TABLE analytics_blog_views IS 'Blog-specific view tracking';
COMMENT ON TABLE analytics_conversions IS 'Conversion event tracking';
COMMENT ON MATERIALIZED VIEW analytics_daily_stats IS 'Daily aggregated analytics (refresh daily)';
COMMENT ON MATERIALIZED VIEW analytics_top_pages IS 'Top pages by views (last 30 days)';
COMMENT ON MATERIALIZED VIEW analytics_traffic_sources IS 'Traffic source breakdown (last 30 days)';

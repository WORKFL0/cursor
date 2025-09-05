-- ENHANCED BACKEND SYSTEM MIGRATION
-- This migration adds analytics, email queue, webhooks, and enhanced features
-- Author: Claude Code - Workflo Backend Enhancement
-- Date: 2025-09-04

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Create enhanced enums
CREATE TYPE IF NOT EXISTS webhook_status AS ENUM ('pending', 'processing', 'success', 'failed', 'retry');
CREATE TYPE IF NOT EXISTS webhook_event AS ENUM ('article.created', 'article.updated', 'article.deleted', 'user.created', 'user.updated', 'analytics.daily');
CREATE TYPE IF NOT EXISTS email_status AS ENUM ('queued', 'sending', 'sent', 'failed', 'bounced');
CREATE TYPE IF NOT EXISTS email_type AS ENUM ('welcome', 'newsletter', 'notification', 'alert', 'marketing');
CREATE TYPE IF NOT EXISTS analytics_event_type AS ENUM ('page_view', 'article_view', 'download', 'contact', 'search', 'click');
CREATE TYPE IF NOT EXISTS api_rate_limit_type AS ENUM ('per_minute', 'per_hour', 'per_day');

-- ================================================================
-- ANALYTICS TABLES
-- ================================================================

-- Enhanced analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID,
    user_id UUID,
    event_type analytics_event_type NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    country VARCHAR(2),
    region VARCHAR(100),
    city VARCHAR(100),
    device_type VARCHAR(50),
    browser VARCHAR(50),
    os VARCHAR(50),
    properties JSONB DEFAULT '{}',
    value NUMERIC(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visitor statistics aggregation table
CREATE TABLE IF NOT EXISTS visitor_statistics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE NOT NULL,
    unique_visitors INTEGER DEFAULT 0,
    total_page_views INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    bounce_rate NUMERIC(5,2),
    avg_session_duration INTEGER, -- in seconds
    top_pages JSONB DEFAULT '[]',
    top_referrers JSONB DEFAULT '[]',
    device_breakdown JSONB DEFAULT '{}',
    country_breakdown JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date)
);

-- Article analytics table
CREATE TABLE IF NOT EXISTS article_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    unique_views INTEGER DEFAULT 0,
    time_on_page INTEGER DEFAULT 0, -- average in seconds
    bounce_rate NUMERIC(5,2),
    social_shares INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(article_id, date)
);

-- ================================================================
-- EMAIL QUEUE SYSTEM
-- ================================================================

-- Email templates table
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    type email_type NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body_text TEXT,
    body_html TEXT,
    variables JSONB DEFAULT '{}', -- Template variables schema
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email queue table
CREATE TABLE IF NOT EXISTS email_queue (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
    to_email VARCHAR(255) NOT NULL,
    to_name VARCHAR(255),
    from_email VARCHAR(255) DEFAULT 'noreply@workflo.it',
    from_name VARCHAR(255) DEFAULT 'Workflo',
    subject VARCHAR(255) NOT NULL,
    body_text TEXT,
    body_html TEXT,
    variables JSONB DEFAULT '{}',
    status email_status DEFAULT 'queued',
    priority INTEGER DEFAULT 5, -- 1-10, lower is higher priority
    scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email delivery logs
CREATE TABLE IF NOT EXISTS email_delivery_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email_queue_id UUID REFERENCES email_queue(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- sent, delivered, bounced, opened, clicked
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    provider_id VARCHAR(255),
    provider_response JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}'
);

-- ================================================================
-- WEBHOOK SYSTEM
-- ================================================================

-- Webhook endpoints table
CREATE TABLE IF NOT EXISTS webhook_endpoints (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    secret_key TEXT NOT NULL, -- For signature verification
    events webhook_event[] NOT NULL,
    is_active BOOLEAN DEFAULT true,
    retry_config JSONB DEFAULT '{"max_retries": 3, "backoff_multiplier": 2}',
    headers JSONB DEFAULT '{}', -- Custom headers
    timeout_seconds INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhook delivery queue
CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    endpoint_id UUID REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
    event_type webhook_event NOT NULL,
    payload JSONB NOT NULL,
    status webhook_status DEFAULT 'pending',
    http_status_code INTEGER,
    response_body TEXT,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    next_retry_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- API RATE LIMITING & MONITORING
-- ================================================================

-- API rate limiting table
CREATE TABLE IF NOT EXISTS api_rate_limits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL, -- IP, API key, user ID
    endpoint VARCHAR(255) NOT NULL,
    limit_type api_rate_limit_type NOT NULL,
    request_count INTEGER DEFAULT 0,
    limit_value INTEGER NOT NULL,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    blocked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(identifier, endpoint, limit_type, window_start)
);

-- API usage logs
CREATE TABLE IF NOT EXISTS api_usage_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER,
    ip_address INET,
    user_agent TEXT,
    user_id UUID REFERENCES cms_users(id) ON DELETE SET NULL,
    request_size INTEGER,
    response_size INTEGER,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- ENHANCED CMS FEATURES
-- ================================================================

-- Media library table (enhanced)
CREATE TABLE IF NOT EXISTS media_library (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    width INTEGER,
    height INTEGER,
    alt_text VARCHAR(500),
    caption TEXT,
    uploaded_by UUID REFERENCES cms_users(id) ON DELETE SET NULL,
    usage_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments system
CREATE TABLE IF NOT EXISTS article_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES article_comments(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    is_spam BOOLEAN DEFAULT false,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR(100) DEFAULT 'website',
    tags TEXT[] DEFAULT '{}'
);

-- ================================================================
-- INDEXES FOR PERFORMANCE
-- ================================================================

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_statistics_date ON visitor_statistics(date DESC);
CREATE INDEX IF NOT EXISTS idx_article_analytics_article_date ON article_analytics(article_id, date DESC);

-- Email queue indexes
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_scheduled_for ON email_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_email_queue_priority ON email_queue(priority);

-- Webhook indexes
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_status ON webhook_deliveries(status);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_created_at ON webhook_deliveries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_endpoint_id ON webhook_deliveries(endpoint_id);

-- Rate limiting indexes
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_endpoint ON api_rate_limits(identifier, endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON api_rate_limits(window_start);

-- API usage indexes
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created_at ON api_usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_endpoint ON api_usage_logs(endpoint);

-- Media library indexes
CREATE INDEX IF NOT EXISTS idx_media_library_created_at ON media_library(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_library_mime_type ON media_library(mime_type);

-- ================================================================
-- TRIGGERS AND FUNCTIONS
-- ================================================================

-- Update trigger for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Apply updated_at triggers to new tables
CREATE TRIGGER update_visitor_statistics_updated_at BEFORE UPDATE ON visitor_statistics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_article_analytics_updated_at BEFORE UPDATE ON article_analytics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_queue_updated_at BEFORE UPDATE ON email_queue 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_webhook_endpoints_updated_at BEFORE UPDATE ON webhook_endpoints 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_webhook_deliveries_updated_at BEFORE UPDATE ON webhook_deliveries 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_rate_limits_updated_at BEFORE UPDATE ON api_rate_limits 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_library_updated_at BEFORE UPDATE ON media_library 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_article_comments_updated_at BEFORE UPDATE ON article_comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to track article views
CREATE OR REPLACE FUNCTION track_article_view(article_uuid UUID, visitor_ip INET DEFAULT NULL)
RETURNS VOID AS $$
DECLARE
    today_date DATE := CURRENT_DATE;
BEGIN
    -- Update article view count
    UPDATE articles SET views_count = views_count + 1 WHERE id = article_uuid;
    
    -- Update or insert article analytics
    INSERT INTO article_analytics (article_id, date, views, unique_views)
    VALUES (article_uuid, today_date, 1, 1)
    ON CONFLICT (article_id, date)
    DO UPDATE SET 
        views = article_analytics.views + 1,
        updated_at = NOW();
        
    -- Insert analytics event
    INSERT INTO analytics_events (event_type, event_name, properties, ip_address)
    VALUES ('article_view', 'article_viewed', jsonb_build_object('article_id', article_uuid), visitor_ip);
END;
$$ LANGUAGE plpgsql;

-- Function to aggregate daily statistics
CREATE OR REPLACE FUNCTION aggregate_daily_statistics(target_date DATE DEFAULT CURRENT_DATE - INTERVAL '1 day')
RETURNS VOID AS $$
BEGIN
    INSERT INTO visitor_statistics (
        date,
        unique_visitors,
        total_page_views,
        total_sessions
    )
    SELECT 
        target_date,
        COUNT(DISTINCT ip_address) as unique_visitors,
        COUNT(*) as total_page_views,
        COUNT(DISTINCT session_id) as total_sessions
    FROM analytics_events 
    WHERE DATE(created_at) = target_date
    ON CONFLICT (date) DO UPDATE SET
        unique_visitors = EXCLUDED.unique_visitors,
        total_page_views = EXCLUDED.total_page_views,
        total_sessions = EXCLUDED.total_sessions,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================

-- Enable RLS on new tables
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for service role
CREATE POLICY "Service role access" ON analytics_events FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access" ON visitor_statistics FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access" ON article_analytics FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access" ON email_templates FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access" ON email_queue FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access" ON email_delivery_logs FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access" ON webhook_endpoints FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access" ON webhook_deliveries FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access" ON api_rate_limits FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access" ON api_usage_logs FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access" ON media_library FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access" ON article_comments FOR ALL TO service_role USING (true);
CREATE POLICY "Service role access" ON newsletter_subscribers FOR ALL TO service_role USING (true);

-- Public read policies for some tables
CREATE POLICY "Public read access" ON media_library FOR SELECT TO anon USING (is_public = true);
CREATE POLICY "Public read access" ON article_comments FOR SELECT TO anon USING (is_approved = true);

-- ================================================================
-- INITIAL DATA SEEDING
-- ================================================================

-- Insert default email templates
INSERT INTO email_templates (name, type, subject, body_html, body_text, variables) VALUES
(
    'welcome_email',
    'welcome',
    'Welkom bij Workflo!',
    '<h1>Welkom bij Workflo, {{name}}!</h1><p>Bedankt voor je interesse in onze IT-services. We nemen binnenkort contact met je op.</p>',
    'Welkom bij Workflo, {{name}}! Bedankt voor je interesse in onze IT-services. We nemen binnenkort contact met je op.',
    '{"name": "string", "email": "string"}'::jsonb
),
(
    'newsletter_weekly',
    'newsletter',
    'Workflo Weekly - IT Nieuws & Tips',
    '<h1>Workflo Weekly</h1><p>De laatste IT-nieuws en tips van ons team:</p>{{content}}',
    'Workflo Weekly - De laatste IT-nieuws en tips van ons team: {{content}}',
    '{"content": "string", "week": "string"}'::jsonb
),
(
    'contact_notification',
    'notification',
    'Nieuw contactformulier bericht',
    '<h2>Nieuw bericht van {{name}}</h2><p><strong>Email:</strong> {{email}}</p><p><strong>Bedrijf:</strong> {{company}}</p><p><strong>Bericht:</strong></p><p>{{message}}</p>',
    'Nieuw bericht van {{name}} ({{email}}) bij {{company}}: {{message}}',
    '{"name": "string", "email": "string", "company": "string", "message": "string"}'::jsonb
)
ON CONFLICT (name) DO NOTHING;

-- Insert sample webhook endpoint (you should replace with real URLs)
INSERT INTO webhook_endpoints (name, url, secret_key, events) VALUES
(
    'n8n_workflow_trigger',
    'https://your-n8n-instance.com/webhook/workflo-cms',
    'your-secret-webhook-key-change-this',
    ARRAY['article.created', 'article.updated']::webhook_event[]
),
(
    'analytics_aggregation',
    'https://your-analytics-endpoint.com/webhook',
    'your-analytics-webhook-key',
    ARRAY['analytics.daily']::webhook_event[]
)
ON CONFLICT DO NOTHING;

-- Schedule daily statistics aggregation (requires pg_cron extension)
-- This will run every day at 1 AM
SELECT cron.schedule('daily-stats-aggregation', '0 1 * * *', 'SELECT aggregate_daily_statistics();');

-- ================================================================
-- SUCCESS MESSAGE
-- ================================================================

DO $$
BEGIN
    RAISE NOTICE '🚀 Enhanced Backend System Migration Completed Successfully!';
    RAISE NOTICE '📊 Analytics: events, visitor stats, article analytics';
    RAISE NOTICE '📧 Email System: templates, queue, delivery logs';
    RAISE NOTICE '🔗 Webhooks: endpoints, delivery tracking';
    RAISE NOTICE '📈 Monitoring: rate limiting, API usage logs';
    RAISE NOTICE '💬 Features: comments, media library, newsletters';
    RAISE NOTICE '⚡ Performance: comprehensive indexing applied';
    RAISE NOTICE '🔒 Security: RLS enabled with proper policies';
    RAISE NOTICE '🤖 Automation: daily stats aggregation scheduled';
END $$;
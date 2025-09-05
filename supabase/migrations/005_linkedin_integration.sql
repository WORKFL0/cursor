-- LinkedIn Integration Enhancement Migration
-- Adds LinkedIn-specific tracking fields and metadata storage
-- Author: Claude Code - n8n LinkedIn Integration
-- Date: 2025-09-04

-- ================================================================
-- ADD LINKEDIN SOURCE TO ARTICLE SOURCE ENUM
-- ================================================================

-- First check if linkedin is not already in the enum
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'linkedin' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'article_source')
    ) THEN
        ALTER TYPE article_source ADD VALUE 'linkedin';
    END IF;
END $$;

-- ================================================================
-- ADD LINKEDIN METADATA TABLE
-- ================================================================

-- Create table to store LinkedIn-specific post metadata
CREATE TABLE IF NOT EXISTS linkedin_post_metadata (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    linkedin_id VARCHAR(255) UNIQUE, -- LinkedIn post URN (e.g., urn:li:share:1234567890)
    linkedin_url TEXT, -- Full URL to LinkedIn post
    post_type VARCHAR(50), -- text, image, video, article, poll
    company_page VARCHAR(255), -- Company page name if applicable
    
    -- Engagement metrics
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    engagement_rate NUMERIC(5,2), -- Percentage
    
    -- Additional metadata
    hashtags TEXT[], -- Array of hashtags used
    mentions TEXT[], -- Array of mentioned users/companies
    media_urls TEXT[], -- Array of media URLs (images/videos)
    
    -- Import tracking
    imported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    import_source VARCHAR(50) DEFAULT 'n8n', -- n8n, api, manual
    n8n_workflow_id VARCHAR(255), -- n8n workflow execution ID
    n8n_node_id VARCHAR(255), -- n8n node that sent the webhook
    
    -- Sync status
    last_synced_at TIMESTAMP WITH TIME ZONE,
    sync_status VARCHAR(50) DEFAULT 'imported', -- imported, synced, failed, pending
    sync_error TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_linkedin_metadata_article_id ON linkedin_post_metadata(article_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_metadata_linkedin_id ON linkedin_post_metadata(linkedin_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_metadata_imported_at ON linkedin_post_metadata(imported_at);
CREATE INDEX IF NOT EXISTS idx_linkedin_metadata_sync_status ON linkedin_post_metadata(sync_status);

-- ================================================================
-- ADD N8N WEBHOOK LOG TABLE
-- ================================================================

-- Create table to log n8n webhook calls for debugging and monitoring
CREATE TABLE IF NOT EXISTS n8n_webhook_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    webhook_endpoint VARCHAR(255) NOT NULL,
    request_id VARCHAR(255) UNIQUE,
    
    -- Request details
    method VARCHAR(10) NOT NULL,
    headers JSONB,
    payload JSONB,
    ip_address INET,
    user_agent TEXT,
    
    -- Processing details
    status VARCHAR(50) NOT NULL, -- received, processing, success, failed, duplicate
    status_code INTEGER,
    response JSONB,
    error_message TEXT,
    
    -- LinkedIn specific
    linkedin_id VARCHAR(255),
    article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
    is_duplicate BOOLEAN DEFAULT false,
    
    -- Timing
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processing_time_ms INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for webhook logs
CREATE INDEX IF NOT EXISTS idx_n8n_logs_request_id ON n8n_webhook_logs(request_id);
CREATE INDEX IF NOT EXISTS idx_n8n_logs_linkedin_id ON n8n_webhook_logs(linkedin_id);
CREATE INDEX IF NOT EXISTS idx_n8n_logs_status ON n8n_webhook_logs(status);
CREATE INDEX IF NOT EXISTS idx_n8n_logs_received_at ON n8n_webhook_logs(received_at DESC);

-- ================================================================
-- FUNCTIONS FOR LINKEDIN INTEGRATION
-- ================================================================

-- Function to update LinkedIn metrics
CREATE OR REPLACE FUNCTION update_linkedin_metrics(
    p_article_id UUID,
    p_likes INTEGER DEFAULT NULL,
    p_comments INTEGER DEFAULT NULL,
    p_shares INTEGER DEFAULT NULL,
    p_impressions INTEGER DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    UPDATE linkedin_post_metadata
    SET 
        likes = COALESCE(p_likes, likes),
        comments = COALESCE(p_comments, comments),
        shares = COALESCE(p_shares, shares),
        impressions = COALESCE(p_impressions, impressions),
        engagement_rate = CASE 
            WHEN COALESCE(p_impressions, impressions, 0) > 0 
            THEN ((COALESCE(p_likes, likes, 0) + COALESCE(p_comments, comments, 0) + COALESCE(p_shares, shares, 0))::NUMERIC / COALESCE(p_impressions, impressions)::NUMERIC) * 100
            ELSE 0
        END,
        last_synced_at = NOW(),
        updated_at = NOW()
    WHERE article_id = p_article_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check for duplicate LinkedIn posts
CREATE OR REPLACE FUNCTION check_linkedin_duplicate(p_linkedin_id VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM linkedin_post_metadata 
        WHERE linkedin_id = p_linkedin_id
    );
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- TRIGGERS
-- ================================================================

-- Trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_linkedin_metadata_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_linkedin_metadata_timestamp
BEFORE UPDATE ON linkedin_post_metadata
FOR EACH ROW
EXECUTE FUNCTION update_linkedin_metadata_timestamp();

-- ================================================================
-- VIEWS FOR REPORTING
-- ================================================================

-- View for LinkedIn post performance analytics
CREATE OR REPLACE VIEW linkedin_post_analytics AS
SELECT 
    a.id AS article_id,
    a.title,
    a.slug,
    a.published_at,
    lpm.linkedin_id,
    lpm.linkedin_url,
    lpm.post_type,
    lpm.likes,
    lpm.comments,
    lpm.shares,
    lpm.impressions,
    lpm.engagement_rate,
    lpm.imported_at,
    lpm.last_synced_at,
    ARRAY_LENGTH(lpm.hashtags, 1) AS hashtag_count,
    (lpm.likes + lpm.comments + lpm.shares) AS total_engagement
FROM articles a
INNER JOIN linkedin_post_metadata lpm ON a.id = lpm.article_id
WHERE a.source = 'linkedin'
ORDER BY lpm.imported_at DESC;

-- View for n8n webhook activity monitoring
CREATE OR REPLACE VIEW n8n_webhook_activity AS
SELECT 
    DATE_TRUNC('hour', received_at) AS hour,
    webhook_endpoint,
    COUNT(*) AS total_requests,
    COUNT(CASE WHEN status = 'success' THEN 1 END) AS successful,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) AS failed,
    COUNT(CASE WHEN is_duplicate THEN 1 END) AS duplicates,
    AVG(processing_time_ms) AS avg_processing_time_ms,
    MAX(processing_time_ms) AS max_processing_time_ms
FROM n8n_webhook_logs
WHERE received_at > NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('hour', received_at), webhook_endpoint
ORDER BY hour DESC;

-- ================================================================
-- SAMPLE DATA FOR TESTING
-- ================================================================

-- Insert sample n8n webhook configuration (commented out, uncomment for testing)
/*
INSERT INTO n8n_webhook_logs (
    webhook_endpoint,
    request_id,
    method,
    headers,
    payload,
    status,
    status_code,
    response,
    linkedin_id,
    processing_time_ms
) VALUES (
    '/api/n8n/linkedin',
    'test_' || gen_random_uuid()::TEXT,
    'POST',
    '{"content-type": "application/json", "x-n8n-workflow": "linkedin-import"}'::JSONB,
    '{"linkedinId": "urn:li:share:test123", "author": "Workflo Test", "content": "Test LinkedIn post"}'::JSONB,
    'success',
    201,
    '{"success": true, "message": "Test import successful"}'::JSONB,
    'urn:li:share:test123',
    45
);
*/

-- ================================================================
-- PERMISSIONS
-- ================================================================

-- Grant appropriate permissions (adjust based on your roles)
GRANT SELECT, INSERT, UPDATE ON linkedin_post_metadata TO authenticated;
GRANT SELECT, INSERT ON n8n_webhook_logs TO authenticated;
GRANT SELECT ON linkedin_post_analytics TO authenticated;
GRANT SELECT ON n8n_webhook_activity TO authenticated;

-- ================================================================
-- COMMENTS FOR DOCUMENTATION
-- ================================================================

COMMENT ON TABLE linkedin_post_metadata IS 'Stores LinkedIn-specific metadata for imported posts';
COMMENT ON TABLE n8n_webhook_logs IS 'Logs all n8n webhook requests for monitoring and debugging';
COMMENT ON VIEW linkedin_post_analytics IS 'Analytics view for LinkedIn post performance';
COMMENT ON VIEW n8n_webhook_activity IS 'Monitoring view for n8n webhook activity';
COMMENT ON FUNCTION update_linkedin_metrics IS 'Updates LinkedIn engagement metrics for a given article';
COMMENT ON FUNCTION check_linkedin_duplicate IS 'Checks if a LinkedIn post has already been imported';
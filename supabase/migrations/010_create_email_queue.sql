-- =====================================================
-- EMAIL QUEUE & SYSTEM MONITORING SCHEMA
-- =====================================================
-- Purpose: Email queue system with retry logic and system health monitoring
-- Created: 2025-01-20
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. EMAIL QUEUE TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS email_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Email Details
  to_email TEXT NOT NULL,
  from_email TEXT NOT NULL DEFAULT 'noreply@workflo.nl',
  reply_to TEXT,
  subject TEXT NOT NULL,
  html_body TEXT NOT NULL,
  text_body TEXT,

  -- Metadata
  email_type TEXT NOT NULL CHECK (email_type IN (
    'contact_notification',
    'contact_confirmation',
    'quote_notification',
    'quote_confirmation',
    'newsletter_welcome',
    'referral_notification',
    'admin_alert',
    'system_notification'
  )),

  priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10), -- 1=highest, 10=lowest

  -- Queue Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',
    'processing',
    'sent',
    'failed',
    'cancelled'
  )),

  -- Retry Logic
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  last_error TEXT,
  last_attempted_at TIMESTAMPTZ,

  -- Related Data
  form_data JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_for TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,

  -- Tracking
  message_id TEXT,
  provider TEXT DEFAULT 'resend',

  -- Indexes for performance
  CONSTRAINT valid_scheduled_time CHECK (scheduled_for >= created_at)
);

-- Indexes for email queue
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status) WHERE status IN ('pending', 'processing');
CREATE INDEX IF NOT EXISTS idx_email_queue_scheduled ON email_queue(scheduled_for) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_email_queue_priority ON email_queue(priority, scheduled_for) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_email_queue_created ON email_queue(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_queue_type ON email_queue(email_type);

-- =====================================================
-- 2. SYSTEM HEALTH MONITORING TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS system_health_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Service Details
  service_name TEXT NOT NULL CHECK (service_name IN (
    'api',
    'database',
    'email',
    'hubspot',
    'analytics',
    'storage',
    'cache'
  )),

  -- Health Status
  status TEXT NOT NULL CHECK (status IN ('healthy', 'degraded', 'unhealthy')),
  response_time_ms INTEGER,

  -- Error Details
  error_message TEXT,
  error_code TEXT,
  stack_trace TEXT,

  -- Context
  endpoint TEXT,
  method TEXT,
  user_agent TEXT,
  ip_address INET,

  -- Metadata
  metadata JSONB DEFAULT '{}',

  -- Timestamp
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for health monitoring
CREATE INDEX IF NOT EXISTS idx_health_service ON system_health_log(service_name, checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_status ON system_health_log(status, checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_checked ON system_health_log(checked_at DESC);

-- =====================================================
-- 3. ERROR NOTIFICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS error_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Error Details
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),

  -- Context
  service_name TEXT,
  endpoint TEXT,
  method TEXT,

  -- Stack Trace
  stack_trace TEXT,
  request_data JSONB DEFAULT '{}',
  response_data JSONB DEFAULT '{}',

  -- Notification Status
  notified BOOLEAN DEFAULT FALSE,
  notified_at TIMESTAMPTZ,
  notification_method TEXT, -- 'email', 'slack', 'sms'

  -- Resolution
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  resolution_notes TEXT,

  -- Timestamps
  occurred_at TIMESTAMPTZ DEFAULT NOW(),

  -- Metadata
  metadata JSONB DEFAULT '{}',

  -- User Impact
  affected_users_count INTEGER DEFAULT 0,
  impact_description TEXT
);

-- Indexes for error notifications
CREATE INDEX IF NOT EXISTS idx_errors_severity ON error_notifications(severity, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_errors_unresolved ON error_notifications(resolved, occurred_at DESC) WHERE NOT resolved;
CREATE INDEX IF NOT EXISTS idx_errors_service ON error_notifications(service_name, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_errors_occurred ON error_notifications(occurred_at DESC);

-- =====================================================
-- 4. HUBSPOT SYNC QUEUE TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS hubspot_sync_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Sync Details
  sync_type TEXT NOT NULL CHECK (sync_type IN (
    'create_contact',
    'update_contact',
    'track_form_submission',
    'add_to_list',
    'create_deal',
    'log_activity'
  )),

  email TEXT NOT NULL,

  -- Data Payload
  contact_data JSONB DEFAULT '{}',
  form_data JSONB DEFAULT '{}',

  -- Queue Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',
    'processing',
    'completed',
    'failed',
    'cancelled'
  )),

  -- Retry Logic
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  last_error TEXT,
  last_attempted_at TIMESTAMPTZ,

  -- Result
  hubspot_contact_id TEXT,
  hubspot_response JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_for TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}',
  priority INTEGER DEFAULT 5
);

-- Indexes for HubSpot sync queue
CREATE INDEX IF NOT EXISTS idx_hubspot_status ON hubspot_sync_queue(status) WHERE status IN ('pending', 'processing');
CREATE INDEX IF NOT EXISTS idx_hubspot_scheduled ON hubspot_sync_queue(scheduled_for) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_hubspot_email ON hubspot_sync_queue(email);
CREATE INDEX IF NOT EXISTS idx_hubspot_created ON hubspot_sync_queue(created_at DESC);

-- =====================================================
-- 5. FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to auto-retry failed emails
CREATE OR REPLACE FUNCTION retry_failed_emails()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- Reset failed emails that haven't exceeded max retries and are old enough for retry
  UPDATE email_queue
  SET
    status = 'pending',
    last_attempted_at = NULL
  WHERE
    status = 'failed'
    AND retry_count < max_retries
    AND (last_attempted_at IS NULL OR last_attempted_at < NOW() - INTERVAL '5 minutes')
    AND created_at > NOW() - INTERVAL '24 hours'; -- Don't retry emails older than 24 hours

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old queue entries
CREATE OR REPLACE FUNCTION cleanup_old_queue_entries()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete sent emails older than 30 days
  DELETE FROM email_queue
  WHERE status = 'sent' AND sent_at < NOW() - INTERVAL '30 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  -- Delete failed emails older than 7 days
  DELETE FROM email_queue
  WHERE status = 'failed' AND created_at < NOW() - INTERVAL '7 days';

  -- Delete old health logs (keep only last 7 days)
  DELETE FROM system_health_log
  WHERE checked_at < NOW() - INTERVAL '7 days';

  -- Delete resolved errors older than 30 days
  DELETE FROM error_notifications
  WHERE resolved = TRUE AND resolved_at < NOW() - INTERVAL '30 days';

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get system health summary
CREATE OR REPLACE FUNCTION get_system_health_summary()
RETURNS TABLE (
  service_name TEXT,
  status TEXT,
  avg_response_time_ms NUMERIC,
  error_count BIGINT,
  last_checked TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    shl.service_name,
    (
      SELECT shl2.status
      FROM system_health_log shl2
      WHERE shl2.service_name = shl.service_name
      ORDER BY shl2.checked_at DESC
      LIMIT 1
    ) as status,
    AVG(shl.response_time_ms)::NUMERIC as avg_response_time_ms,
    COUNT(*) FILTER (WHERE shl.status = 'unhealthy') as error_count,
    MAX(shl.checked_at) as last_checked
  FROM system_health_log shl
  WHERE shl.checked_at > NOW() - INTERVAL '1 hour'
  GROUP BY shl.service_name;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE hubspot_sync_queue ENABLE ROW LEVEL SECURITY;

-- Only service role can manage email queue
CREATE POLICY "Service role can manage email queue" ON email_queue
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Only service role can write health logs
CREATE POLICY "Service role can write health logs" ON system_health_log
  FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can read health logs" ON system_health_log
  FOR SELECT TO service_role
  USING (true);

-- Only service role can manage error notifications
CREATE POLICY "Service role can manage errors" ON error_notifications
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Only service role can manage HubSpot sync queue
CREATE POLICY "Service role can manage hubspot queue" ON hubspot_sync_queue
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 7. COMMENTS
-- =====================================================

COMMENT ON TABLE email_queue IS 'Queue for reliable email delivery with retry logic and prioritization';
COMMENT ON TABLE system_health_log IS 'System health monitoring and performance tracking';
COMMENT ON TABLE error_notifications IS 'Error tracking and notification management';
COMMENT ON TABLE hubspot_sync_queue IS 'Queue for reliable HubSpot CRM synchronization';

COMMENT ON COLUMN email_queue.priority IS '1=highest priority (immediate), 10=lowest priority (batch)';
COMMENT ON COLUMN email_queue.status IS 'Current state: pending=not yet sent, processing=being sent, sent=delivered, failed=delivery failed, cancelled=intentionally not sent';
COMMENT ON COLUMN system_health_log.response_time_ms IS 'Response time in milliseconds for the health check';
COMMENT ON COLUMN error_notifications.severity IS 'Error severity: low=minor issues, medium=degraded service, high=major issues, critical=service down';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

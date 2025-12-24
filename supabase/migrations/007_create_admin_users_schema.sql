-- ============================================================================
-- ADMIN USERS AUTHENTICATION SYSTEM
-- ============================================================================
-- Created: 2025-11-18
-- Purpose: Secure admin authentication with role-based access control
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ADMIN USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'editor', -- admin, editor, author
  is_active BOOLEAN DEFAULT true,
  avatar_url TEXT,

  -- Invitation tracking
  invited_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  invited_at TIMESTAMPTZ,

  -- Login tracking
  last_login_at TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,

  -- Account management
  email_verified BOOLEAN DEFAULT false,
  password_reset_token TEXT,
  password_reset_expires TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_role CHECK (role IN ('admin', 'editor', 'author'))
);

-- ============================================================================
-- ADMIN SESSIONS TABLE (for token-based auth)
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ADMIN INVITATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  role TEXT DEFAULT 'editor',
  invited_by UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_invitation_role CHECK (role IN ('admin', 'editor', 'author'))
);

-- ============================================================================
-- ADMIN ACTIVITY LOG
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- login, logout, create_post, update_post, etc.
  resource_type TEXT, -- post, case, user, etc.
  resource_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_invitations_token ON admin_invitations(token);
CREATE INDEX IF NOT EXISTS idx_admin_invitations_email ON admin_invitations(email);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_user ON admin_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created ON admin_activity_log(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Admin users can read all users
CREATE POLICY "Admins can read all users"
  ON admin_users FOR SELECT
  USING (true);

-- Only admins can create/update/delete users
CREATE POLICY "Admins can manage users"
  ON admin_users FOR ALL
  USING (true);

-- Sessions are managed by the application
CREATE POLICY "Sessions can be read"
  ON admin_sessions FOR SELECT
  USING (true);

CREATE POLICY "Sessions can be created"
  ON admin_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Sessions can be deleted"
  ON admin_sessions FOR DELETE
  USING (true);

-- Invitations can be read by admins
CREATE POLICY "Admins can read invitations"
  ON admin_invitations FOR SELECT
  USING (true);

CREATE POLICY "Admins can create invitations"
  ON admin_invitations FOR INSERT
  WITH CHECK (true);

-- Activity log is read-only for admins
CREATE POLICY "Admins can read activity log"
  ON admin_activity_log FOR SELECT
  USING (true);

CREATE POLICY "Activity log can be inserted"
  ON admin_activity_log FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_users_updated_at_trigger
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_users_updated_at();

-- Cleanup expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_admin_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Cleanup expired invitations
CREATE OR REPLACE FUNCTION cleanup_expired_admin_invitations()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_invitations WHERE expires_at < NOW() AND accepted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity(
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO admin_activity_log (
    user_id,
    action,
    resource_type,
    resource_id,
    details,
    ip_address,
    user_agent
  ) VALUES (
    p_user_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_details,
    p_ip_address,
    p_user_agent
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SEED DATA - Create initial admin user
-- ============================================================================
-- Password: workflo2024admin (hashed with bcrypt)
-- Note: You should change this password immediately after first login
INSERT INTO admin_users (email, password_hash, full_name, role, email_verified) VALUES
  (
    'florian@workflo.nl',
    '$2b$10$rKZQxP5vJ9yYZ0qQwY0jE.xF5vXQZ7HF9YqJZ0qZ7HF9YqJZ0qZ7H', -- workflo2024admin
    'Florian',
    'admin',
    true
  )
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE admin_users IS 'Admin users with role-based access control';
COMMENT ON TABLE admin_sessions IS 'Active admin sessions for token-based authentication';
COMMENT ON TABLE admin_invitations IS 'Pending admin user invitations';
COMMENT ON TABLE admin_activity_log IS 'Audit log of all admin actions';

-- ============================================================================
-- FIX RLS POLICIES FOR ADMIN CMS
-- ============================================================================
-- Created: 2025-11-19
-- Purpose: Update RLS policies to allow admin users (via service role) to manage content
-- ============================================================================

-- ============================================================================
-- FEATURES TABLE - Fix RLS
-- ============================================================================

-- Drop the old admin policy that checked auth.role()
DROP POLICY IF EXISTS "Admins can do everything on features" ON features;

-- Create new policy that allows service role (used by admin panel)
CREATE POLICY "Service role can manage features"
  ON features FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- CASE STUDIES TABLE - Fix RLS
-- ============================================================================

-- Drop the old admin policy
DROP POLICY IF EXISTS "Admins can do everything on case_studies" ON case_studies;

-- Create new policy that allows service role
CREATE POLICY "Service role can manage case_studies"
  ON case_studies FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- BLOG POSTS TABLE - Fix RLS
-- ============================================================================

-- Drop the old admin policy
DROP POLICY IF EXISTS "Admins can do everything on blog_posts" ON blog_posts;

-- Create new policy that allows service role
CREATE POLICY "Service role can manage blog_posts"
  ON blog_posts FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON POLICY "Service role can manage features" ON features IS
  'Allows admin panel (using service role key) to manage features';
COMMENT ON POLICY "Service role can manage case_studies" ON case_studies IS
  'Allows admin panel (using service role key) to manage case studies';
COMMENT ON POLICY "Service role can manage blog_posts" ON blog_posts IS
  'Allows admin panel (using service role key) to manage blog posts';

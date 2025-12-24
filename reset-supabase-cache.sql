-- Step 1: Drop and recreate the schema cache
-- This forces PostgREST to rebuild its entire schema cache

-- First, let's verify the tables exist
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename LIKE 'blog_%'
ORDER BY tablename;

-- Force a full schema reload by touching the tables
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

ALTER TABLE blog_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE blog_authors DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;

-- Send reload signal
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- Verify tables are accessible
SELECT COUNT(*) as total_posts FROM blog_posts;
SELECT COUNT(*) as total_categories FROM blog_categories;
SELECT COUNT(*) as total_authors FROM blog_authors;

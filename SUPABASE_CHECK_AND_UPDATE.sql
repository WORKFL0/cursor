-- Check wat er al bestaat en voeg ontbrekende dingen toe

-- 1. Check of de articles tabel al bestaat
-- Als deze error geeft, bestaat de tabel al (dat is goed!)
SELECT COUNT(*) FROM articles LIMIT 1;

-- 2. Voeg eventueel ontbrekende kolommen toe (deze geven geen error als ze al bestaan)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS title_nl TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS excerpt_nl TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS content_nl TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'cms';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS external_url TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS image TEXT;

-- 3. Create indexes als ze nog niet bestaan
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);

-- 4. Enable RLS als dat nog niet is gedaan
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 5. Drop oude policies en maak nieuwe (voor development)
DROP POLICY IF EXISTS "Public can read published articles" ON articles;
DROP POLICY IF EXISTS "Allow all operations" ON articles;

-- Nieuwe policies
CREATE POLICY "Public can read published articles" ON articles
FOR SELECT USING (published = true);

CREATE POLICY "Allow all operations for development" ON articles
FOR ALL USING (true) WITH CHECK (true);

-- 6. Create users table voor CMS authentication
CREATE TABLE IF NOT EXISTS cms_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'editor', -- admin, editor, viewer
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES cms_users(id),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 7. Create sessions table voor login tracking
CREATE TABLE IF NOT EXISTS cms_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES cms_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create audit log voor security
CREATE TABLE IF NOT EXISTS cms_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES cms_users(id),
  action TEXT NOT NULL, -- login, logout, create, update, delete, password_change
  entity_type TEXT, -- article, user, etc
  entity_id TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Add RLS policies voor users tables
ALTER TABLE cms_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_audit_log ENABLE ROW LEVEL SECURITY;

-- Allow all for development (maak dit veiliger voor productie!)
CREATE POLICY "Allow all operations on cms_users" ON cms_users
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on cms_sessions" ON cms_sessions
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on cms_audit_log" ON cms_audit_log
FOR ALL USING (true) WITH CHECK (true);

-- 10. Insert default admin user (CHANGE PASSWORD!)
-- Password: Workflo2024! (this is hashed with bcrypt)
INSERT INTO cms_users (email, username, password_hash, role) 
VALUES (
  'admin@workflo.it',
  'admin',
  '$2a$10$rBV2JDeWW3.vKyeQcM8fFO4777l4bVeQgDL6VZkDQ9dqGZMarf5ye', -- Dit is een voorbeeld hash
  'admin'
) ON CONFLICT (username) DO NOTHING;

-- 11. Create LinkedIn posts table voor N8N integration
CREATE TABLE IF NOT EXISTS linkedin_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id TEXT UNIQUE NOT NULL,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  url TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  imported_at TIMESTAMPTZ DEFAULT NOW(),
  synced_to_articles BOOLEAN DEFAULT false
);

-- 12. Create RSS items table
CREATE TABLE IF NOT EXISTS rss_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feed_url TEXT NOT NULL,
  guid TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  link TEXT,
  pub_date TIMESTAMPTZ,
  author TEXT,
  category TEXT,
  imported_at TIMESTAMPTZ DEFAULT NOW(),
  synced_to_articles BOOLEAN DEFAULT false
);

-- 13. Create function to sync LinkedIn/RSS to articles
CREATE OR REPLACE FUNCTION sync_external_to_articles()
RETURNS void AS $$
BEGIN
  -- Sync LinkedIn posts
  INSERT INTO articles (title, title_nl, slug, excerpt, content, author, source, external_url, published, published_at)
  SELECT 
    SUBSTRING(content FROM 1 FOR 100) as title,
    SUBSTRING(content FROM 1 FOR 100) as title_nl,
    'linkedin-' || post_id as slug,
    content as excerpt,
    content,
    author,
    'linkedin' as source,
    url as external_url,
    true as published,
    published_at
  FROM linkedin_posts
  WHERE synced_to_articles = false
  ON CONFLICT (slug) DO NOTHING;
  
  -- Mark as synced
  UPDATE linkedin_posts SET synced_to_articles = true WHERE synced_to_articles = false;
  
  -- Sync RSS items
  INSERT INTO articles (title, title_nl, slug, excerpt, content, author, source, external_url, published, published_at)
  SELECT 
    title,
    title as title_nl,
    'rss-' || guid as slug,
    description as excerpt,
    description as content,
    COALESCE(author, 'RSS Feed') as author,
    'rss' as source,
    link as external_url,
    true as published,
    pub_date as published_at
  FROM rss_items
  WHERE synced_to_articles = false
  ON CONFLICT (slug) DO NOTHING;
  
  -- Mark as synced
  UPDATE rss_items SET synced_to_articles = true WHERE synced_to_articles = false;
END;
$$ LANGUAGE plpgsql;

-- 14. Create view voor alle content sources
CREATE OR REPLACE VIEW all_content AS
SELECT 
  'article' as content_type,
  id,
  title,
  slug,
  excerpt,
  author,
  source,
  published_at,
  published
FROM articles
UNION ALL
SELECT 
  'linkedin' as content_type,
  id,
  SUBSTRING(content FROM 1 FOR 100) as title,
  'linkedin-' || post_id as slug,
  content as excerpt,
  author,
  'linkedin' as source,
  published_at,
  true as published
FROM linkedin_posts
WHERE synced_to_articles = false
UNION ALL
SELECT 
  'rss' as content_type,
  id,
  title,
  'rss-' || guid as slug,
  description as excerpt,
  COALESCE(author, 'RSS Feed') as author,
  'rss' as source,
  pub_date as published_at,
  true as published
FROM rss_items
WHERE synced_to_articles = false
ORDER BY published_at DESC;

-- Test query om te zien of alles werkt
SELECT 'Setup compleet! Aantal artikelen:' as status, COUNT(*) as count FROM articles
UNION ALL
SELECT 'Aantal CMS users:' as status, COUNT(*) as count FROM cms_users;
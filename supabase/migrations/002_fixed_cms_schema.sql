-- Fixed CMS Database Schema
-- Run this INSTEAD of 001_initial_cms_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS article_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS media CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS cms_users CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- Drop types if they exist
DROP TYPE IF EXISTS article_source CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Create enum types
CREATE TYPE article_source AS ENUM ('cms', 'rss', 'linkedin', 'external');
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');

-- Users table
CREATE TABLE cms_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role DEFAULT 'editor' NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    last_login_at TIMESTAMP WITH TIME ZONE,
    password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Categories table
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    name_nl VARCHAR(100),
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Articles table (simplified - no created_by/updated_by initially)
CREATE TABLE articles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    title_nl VARCHAR(500),
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    excerpt_nl TEXT,
    content TEXT,
    content_nl TEXT,
    author VARCHAR(255) DEFAULT 'Workflo Team',
    category VARCHAR(100) DEFAULT 'Nieuws',
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    featured_image_alt TEXT,
    published BOOLEAN DEFAULT false NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    source article_source DEFAULT 'cms' NOT NULL,
    external_url TEXT,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT[],
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Now add the foreign key columns after both tables exist
ALTER TABLE articles 
    ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES cms_users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES cms_users(id) ON DELETE SET NULL;

-- Tags table
CREATE TABLE tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Article Tags junction table
CREATE TABLE article_tags (
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

-- Media table
CREATE TABLE media (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    mime_type VARCHAR(100),
    size_bytes BIGINT,
    url TEXT NOT NULL,
    alt_text TEXT,
    caption TEXT,
    width INTEGER,
    height INTEGER,
    uploaded_by UUID REFERENCES cms_users(id) ON DELETE SET NULL,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Comments table
CREATE TABLE comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255),
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Analytics table
CREATE TABLE analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    ip_address INET,
    user_agent TEXT,
    referer TEXT,
    session_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Sessions table
CREATE TABLE sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES cms_users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES cms_users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Settings table
CREATE TABLE settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB,
    description TEXT,
    updated_by UUID REFERENCES cms_users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published ON articles(published);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_source ON articles(source);
CREATE INDEX idx_articles_tags ON articles USING GIN(tags);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_featured ON articles(featured);

CREATE INDEX idx_users_email ON cms_users(email);
CREATE INDEX idx_users_username ON cms_users(username);
CREATE INDEX idx_users_role ON cms_users(role);

CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_categories_slug ON categories(slug);

CREATE INDEX idx_comments_article ON comments(article_id);
CREATE INDEX idx_comments_approved ON comments(is_approved);

CREATE INDEX idx_analytics_article ON analytics(article_id);
CREATE INDEX idx_analytics_event ON analytics(event_type);
CREATE INDEX idx_analytics_created ON analytics(created_at DESC);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- Create full-text search index
ALTER TABLE articles ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE OR REPLACE FUNCTION articles_search_trigger() RETURNS trigger AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.excerpt, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'D');
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_search_update 
    BEFORE INSERT OR UPDATE ON articles 
    FOR EACH ROW 
    EXECUTE FUNCTION articles_search_trigger();

CREATE INDEX idx_articles_search ON articles USING GIN(search_vector);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON cms_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for service role)
CREATE POLICY "Service role has full access to articles" ON articles
    FOR ALL USING (true);

CREATE POLICY "Service role has full access to users" ON cms_users
    FOR ALL USING (true);

CREATE POLICY "Service role has full access to categories" ON categories
    FOR ALL USING (true);

CREATE POLICY "Service role has full access to tags" ON tags
    FOR ALL USING (true);

CREATE POLICY "Service role has full access to media" ON media
    FOR ALL USING (true);

CREATE POLICY "Service role has full access to comments" ON comments
    FOR ALL USING (true);

CREATE POLICY "Service role has full access to analytics" ON analytics
    FOR ALL USING (true);

CREATE POLICY "Service role has full access to sessions" ON sessions
    FOR ALL USING (true);

CREATE POLICY "Service role has full access to audit_logs" ON audit_logs
    FOR ALL USING (true);

CREATE POLICY "Service role has full access to settings" ON settings
    FOR ALL USING (true);

-- Insert default admin user (password: Admin123!)
INSERT INTO cms_users (email, username, password_hash, role, first_name, last_name)
VALUES (
    'admin@workflo.it',
    'admin',
    '$2a$12$LQGxR3FAMyDK5M4hK6x5R.KlEMLKmEXGRW8Tg1dAuQGVBBW.qp6D.',
    'admin',
    'Admin',
    'User'
) ON CONFLICT (email) DO NOTHING;

-- Insert default categories
INSERT INTO categories (name, name_nl, slug, description) VALUES
    ('News', 'Nieuws', 'news', 'Company news and updates'),
    ('Blog', 'Blog', 'blog', 'Technical articles and insights'),
    ('Updates', 'Updates', 'updates', 'Product and service updates'),
    ('Events', 'Evenementen', 'events', 'Upcoming events and webinars')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample articles
INSERT INTO articles (
    title, 
    slug, 
    excerpt, 
    content, 
    published, 
    published_at,
    category,
    tags,
    source
) VALUES 
(
    'Welkom bij het nieuwe Workflo CMS',
    'welkom-nieuwe-cms',
    'Het nieuwe CMS systeem is live met Supabase integratie.',
    '# Welkom bij het nieuwe CMS\n\nOns nieuwe content management systeem is nu volledig operationeel met:\n\n- **Database-driven content** via Supabase\n- **Veilige authenticatie** voor editors\n- **Real-time updates** naar de website\n- **API integratie** voor n8n workflows\n\n## Wat is er nieuw?\n\nAlles wordt nu opgeslagen in een professionele PostgreSQL database. Dit betekent:\n- Betere performance\n- Schaalbare architectuur\n- Backup mogelijkheden\n- Multi-user support\n\n## Aan de slag\n\nLog in op `/cms` met je credentials om content te beheren.',
    true,
    NOW(),
    'News',
    ARRAY['cms', 'update', 'supabase'],
    'cms'
),
(
    'Microsoft 365 Migration Success Story',
    'microsoft-365-migration-success',
    'Een Amsterdam creative agency stapt succesvol over naar Microsoft 365.',
    '# Microsoft 365 Migration Success\n\nWe hebben weer een succesvolle migratie afgerond! Dit keer voor een creatief bureau in Amsterdam met 25 medewerkers.\n\n## De uitdaging\n- Verouderde on-premise Exchange server\n- Geen mobiele toegang tot email\n- Beperkte samenwerking mogelijkheden\n\n## De oplossing\nComplete migratie naar Microsoft 365 Business Premium inclusief:\n- Exchange Online voor email\n- SharePoint voor document management\n- Teams voor communicatie\n\n## Resultaten\n- **50% snellere** file sharing\n- **Zero downtime** tijdens migratie\n- **100% gebruikerstevredenheid**\n\nNeem contact op voor uw eigen migratie!',
    true,
    NOW() - INTERVAL '2 days',
    'Blog',
    ARRAY['microsoft365', 'migration', 'case-study'],
    'cms'
)
ON CONFLICT (slug) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'CMS database schema created successfully!';
    RAISE NOTICE 'Default admin user: admin@workflo.it / Admin123!';
    RAISE NOTICE 'Tables created: articles, cms_users, categories, tags, media, comments, analytics, sessions, audit_logs, settings';
END $$;
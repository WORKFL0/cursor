-- CMS Database Schema Migration
-- Creates all necessary tables for the CMS system with proper indexes and constraints

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS (Row Level Security) extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types for better type safety
DO $$ BEGIN
    CREATE TYPE article_source AS ENUM ('cms', 'rss', 'linkedin', 'external');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table for CMS authentication
CREATE TABLE IF NOT EXISTS cms_users (
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

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
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
    created_by UUID REFERENCES cms_users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES cms_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Categories table for better category management
CREATE TABLE IF NOT EXISTS article_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    name_nl VARCHAR(100),
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Blue as default
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tags table for better tag management
CREATE TABLE IF NOT EXISTS article_tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    name_nl VARCHAR(100),
    description TEXT,
    color VARCHAR(7) DEFAULT '#10B981', -- Green as default
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Junction table for article-tag relationships
CREATE TABLE IF NOT EXISTS article_tag_relations (
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES article_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (article_id, tag_id)
);

-- Media/Images table for file management
CREATE TABLE IF NOT EXISTS media_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    alt_text TEXT,
    caption TEXT,
    width INTEGER,
    height INTEGER,
    uploaded_by UUID REFERENCES cms_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- RSS feeds table for external content management
CREATE TABLE IF NOT EXISTS rss_feeds (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    feed_url TEXT UNIQUE NOT NULL,
    description TEXT,
    website_url TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    last_fetched_at TIMESTAMP WITH TIME ZONE,
    fetch_frequency_hours INTEGER DEFAULT 24,
    auto_import BOOLEAN DEFAULT false,
    category_mapping VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- RSS items table for imported content
CREATE TABLE IF NOT EXISTS rss_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    feed_id UUID REFERENCES rss_feeds(id) ON DELETE CASCADE,
    guid TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    link TEXT,
    author VARCHAR(255),
    pub_date TIMESTAMP WITH TIME ZONE,
    imported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    synced_to_articles BOOLEAN DEFAULT false,
    article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
    UNIQUE(feed_id, guid)
);

-- LinkedIn posts table for social media integration
CREATE TABLE IF NOT EXISTS linkedin_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id VARCHAR(255) UNIQUE NOT NULL,
    author VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    url TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    imported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    synced_to_articles BOOLEAN DEFAULT false,
    article_id UUID REFERENCES articles(id) ON DELETE SET NULL
);

-- Audit log table for security and tracking
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES cms_users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- User sessions table for authentication management
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES cms_users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for performance optimization

-- Articles table indexes
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author);
CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at);
CREATE INDEX IF NOT EXISTS idx_articles_updated_at ON articles(updated_at);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_articles_full_text ON articles USING GIN(to_tsvector('english', title || ' ' || COALESCE(excerpt, '') || ' ' || COALESCE(content, '')));

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_cms_users_email ON cms_users(email);
CREATE INDEX IF NOT EXISTS idx_cms_users_username ON cms_users(username);
CREATE INDEX IF NOT EXISTS idx_cms_users_role ON cms_users(role);
CREATE INDEX IF NOT EXISTS idx_cms_users_is_active ON cms_users(is_active);
CREATE INDEX IF NOT EXISTS idx_cms_users_last_login ON cms_users(last_login_at);

-- Categories and tags indexes
CREATE INDEX IF NOT EXISTS idx_article_categories_name ON article_categories(name);
CREATE INDEX IF NOT EXISTS idx_article_categories_active ON article_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_article_tags_name ON article_tags(name);
CREATE INDEX IF NOT EXISTS idx_article_tags_active ON article_tags(is_active);
CREATE INDEX IF NOT EXISTS idx_article_tags_usage ON article_tags(usage_count);

-- Media files indexes
CREATE INDEX IF NOT EXISTS idx_media_files_type ON media_files(file_type);
CREATE INDEX IF NOT EXISTS idx_media_files_size ON media_files(file_size);
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_by ON media_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_files_created_at ON media_files(created_at);

-- RSS and LinkedIn indexes
CREATE INDEX IF NOT EXISTS idx_rss_items_feed_id ON rss_items(feed_id);
CREATE INDEX IF NOT EXISTS idx_rss_items_pub_date ON rss_items(pub_date);
CREATE INDEX IF NOT EXISTS idx_rss_items_synced ON rss_items(synced_to_articles);
CREATE INDEX IF NOT EXISTS idx_linkedin_posts_published_at ON linkedin_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_linkedin_posts_synced ON linkedin_posts(synced_to_articles);

-- Session and audit indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at columns
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cms_users_updated_at BEFORE UPDATE ON cms_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_article_categories_updated_at BEFORE UPDATE ON article_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_article_tags_updated_at BEFORE UPDATE ON article_tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_files_updated_at BEFORE UPDATE ON media_files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rss_feeds_updated_at BEFORE UPDATE ON rss_feeds
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE ON user_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Articles policies
CREATE POLICY "Public articles are viewable by everyone" ON articles
    FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can view all articles" ON articles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin users can do anything with articles" ON articles
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM cms_users 
            WHERE cms_users.id = auth.uid() 
            AND cms_users.role = 'admin'
            AND cms_users.is_active = true
        )
    );

CREATE POLICY "Editors can create and update articles" ON articles
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM cms_users 
            WHERE cms_users.id = auth.uid() 
            AND cms_users.role IN ('admin', 'editor')
            AND cms_users.is_active = true
        )
    );

CREATE POLICY "Editors can update their own articles" ON articles
    FOR UPDATE TO authenticated USING (
        created_by = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM cms_users 
            WHERE cms_users.id = auth.uid() 
            AND cms_users.role IN ('admin', 'editor')
            AND cms_users.is_active = true
        )
    );

-- Users policies (restrict access to user management)
CREATE POLICY "Users can view their own profile" ON cms_users
    FOR SELECT TO authenticated USING (id = auth.uid());

CREATE POLICY "Admin users can manage all users" ON cms_users
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM cms_users u
            WHERE u.id = auth.uid() 
            AND u.role = 'admin'
            AND u.is_active = true
        )
    );

-- Categories and tags policies
CREATE POLICY "Everyone can view active categories" ON article_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage categories" ON article_categories
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM cms_users 
            WHERE cms_users.id = auth.uid() 
            AND cms_users.role IN ('admin', 'editor')
            AND cms_users.is_active = true
        )
    );

CREATE POLICY "Everyone can view active tags" ON article_tags
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage tags" ON article_tags
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM cms_users 
            WHERE cms_users.id = auth.uid() 
            AND cms_users.role IN ('admin', 'editor')
            AND cms_users.is_active = true
        )
    );

-- Media files policies
CREATE POLICY "Everyone can view media files" ON media_files
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload media" ON media_files
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM cms_users 
            WHERE cms_users.id = auth.uid() 
            AND cms_users.role IN ('admin', 'editor')
            AND cms_users.is_active = true
        )
    );

CREATE POLICY "Users can update their own uploads" ON media_files
    FOR UPDATE TO authenticated USING (
        uploaded_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM cms_users 
            WHERE cms_users.id = auth.uid() 
            AND cms_users.role = 'admin'
            AND cms_users.is_active = true
        )
    );

-- Sessions policies
CREATE POLICY "Users can view their own sessions" ON user_sessions
    FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can update their own sessions" ON user_sessions
    FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Audit logs policies (read-only for admins)
CREATE POLICY "Admin users can view audit logs" ON audit_logs
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM cms_users 
            WHERE cms_users.id = auth.uid() 
            AND cms_users.role = 'admin'
            AND cms_users.is_active = true
        )
    );

-- Functions for common operations

-- Function to increment tag usage count
CREATE OR REPLACE FUNCTION increment_tag_usage(tag_name TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE article_tags 
    SET usage_count = usage_count + 1
    WHERE name = tag_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement tag usage count
CREATE OR REPLACE FUNCTION decrement_tag_usage(tag_name TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE article_tags 
    SET usage_count = GREATEST(usage_count - 1, 0)
    WHERE name = tag_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get article analytics
CREATE OR REPLACE FUNCTION get_article_analytics(article_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'views', views_count,
        'likes', likes_count,
        'shares', shares_count,
        'created_at', created_at,
        'published_at', published_at,
        'last_updated', updated_at
    ) INTO result
    FROM articles 
    WHERE id = article_uuid;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search articles with full-text search
CREATE OR REPLACE FUNCTION search_articles(
    search_query TEXT,
    limit_count INTEGER DEFAULT 10,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    excerpt TEXT,
    slug VARCHAR,
    category VARCHAR,
    author VARCHAR,
    published_at TIMESTAMP WITH TIME ZONE,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.title,
        a.excerpt,
        a.slug,
        a.category,
        a.author,
        a.published_at,
        ts_rank(to_tsvector('english', a.title || ' ' || COALESCE(a.excerpt, '') || ' ' || COALESCE(a.content, '')), 
                plainto_tsquery('english', search_query)) as rank
    FROM articles a
    WHERE a.published = true
      AND to_tsvector('english', a.title || ' ' || COALESCE(a.excerpt, '') || ' ' || COALESCE(a.content, ''))
          @@ plainto_tsquery('english', search_query)
    ORDER BY rank DESC, a.published_at DESC
    LIMIT limit_count OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create initial admin user (password: Admin123!)
-- Note: In production, this should be done separately with a secure password
INSERT INTO cms_users (email, username, password_hash, role, first_name, last_name, is_active)
VALUES (
    'admin@workflo.it',
    'admin',
    crypt('Admin123!', gen_salt('bf', 12)), -- Use bcrypt with cost 12
    'admin',
    'System',
    'Administrator',
    true
) ON CONFLICT (email) DO NOTHING;

-- Insert default categories
INSERT INTO article_categories (name, name_nl, description, color, sort_order, is_active) VALUES
('Nieuws', 'Nieuws', 'General news and announcements', '#3B82F6', 1, true),
('Blog', 'Blog', 'Blog posts and insights', '#10B981', 2, true),
('Tutorial', 'Tutorial', 'How-to guides and tutorials', '#8B5CF6', 3, true),
('Update', 'Update', 'Product and service updates', '#F59E0B', 4, true),
('Cybersecurity', 'Cybersecurity', 'Security-related articles', '#EF4444', 5, true),
('Cloud', 'Cloud', 'Cloud computing articles', '#06B6D4', 6, true),
('IT Services', 'IT Diensten', 'IT service related content', '#EC4899', 7, true)
ON CONFLICT (name) DO NOTHING;

-- Insert default tags
INSERT INTO article_tags (name, name_nl, description, color, is_active) VALUES
('workflo', 'workflo', 'Content about Workflo company', '#FBBF24', true),
('it-services', 'it-diensten', 'IT services related', '#3B82F6', true),
('cybersecurity', 'cyberbeveiliging', 'Security-related topics', '#EF4444', true),
('cloud', 'cloud', 'Cloud computing topics', '#06B6D4', true),
('microsoft365', 'microsoft365', 'Microsoft 365 related', '#F59E0B', true),
('backup', 'backup', 'Backup and disaster recovery', '#10B981', true),
('managed-it', 'managed-it', 'Managed IT services', '#8B5CF6', true),
('voip', 'voip', 'VoIP and telephony', '#EC4899', true),
('tutorial', 'tutorial', 'Tutorial and how-to content', '#6B7280', true),
('update', 'update', 'Product and service updates', '#F97316', true)
ON CONFLICT (name) DO NOTHING;

-- Add some sample RSS feeds
INSERT INTO rss_feeds (name, feed_url, description, website_url, is_active, fetch_frequency_hours, auto_import, category_mapping) VALUES
('TechCrunch Security', 'https://techcrunch.com/category/security/feed/', 'Security news from TechCrunch', 'https://techcrunch.com', true, 6, false, 'Cybersecurity'),
('Microsoft 365 Blog', 'https://www.microsoft.com/en-us/microsoft-365/blog/feed/', 'Official Microsoft 365 updates', 'https://www.microsoft.com/en-us/microsoft-365/', true, 12, false, 'Update'),
('IT Pro Today', 'https://www.itprotoday.com/rss.xml', 'IT Professional news and insights', 'https://www.itprotoday.com', true, 24, false, 'IT Services')
ON CONFLICT (feed_url) DO NOTHING;

COMMIT;
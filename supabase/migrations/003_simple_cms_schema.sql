-- SIMPLIFIED CMS Schema - Start Fresh
-- This version creates a minimal working CMS

-- Clean up any existing tables
DROP TABLE IF EXISTS article_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS media CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS cms_users CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- Drop types if they exist
DROP TYPE IF EXISTS article_source CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create simple enums
CREATE TYPE article_source AS ENUM ('cms', 'rss', 'linkedin', 'external');
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');

-- 1. Create Users table FIRST (no dependencies)
CREATE TABLE cms_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role DEFAULT 'editor' NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Articles table (simplified - no foreign keys yet)
CREATE TABLE articles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    author VARCHAR(255) DEFAULT 'Workflo Team',
    category VARCHAR(100) DEFAULT 'Nieuws',
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    published BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    source article_source DEFAULT 'cms',
    external_url TEXT,
    views_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Tags table
CREATE TABLE tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Categories table
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Add indexes for performance
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published ON articles(published);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_users_email ON cms_users(email);

-- 6. Create update trigger for updated_at
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

-- 7. Enable Row Level Security (but allow all for now)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for service role
CREATE POLICY "Allow all for articles" ON articles FOR ALL USING (true);
CREATE POLICY "Allow all for users" ON cms_users FOR ALL USING (true);
CREATE POLICY "Allow all for tags" ON tags FOR ALL USING (true);
CREATE POLICY "Allow all for categories" ON categories FOR ALL USING (true);

-- 8. Insert default admin user (password: Admin123!)
-- Password hash for 'Admin123!' using bcrypt
INSERT INTO cms_users (email, username, password_hash, role, first_name, last_name)
VALUES (
    'admin@workflo.it',
    'admin',
    '$2a$12$LQGxR3FAMyDK5M4hK6x5R.KlEMLKmEXGRW8Tg1dAuQGVBBW.qp6D.',
    'admin',
    'Admin',
    'User'
) ON CONFLICT (email) DO NOTHING;

-- 9. Insert default categories
INSERT INTO categories (name, slug, description) VALUES
    ('Nieuws', 'nieuws', 'Bedrijfsnieuws en updates'),
    ('Blog', 'blog', 'Technische artikelen en inzichten'),
    ('Updates', 'updates', 'Product en service updates'),
    ('Events', 'events', 'Aankomende evenementen')
ON CONFLICT (slug) DO NOTHING;

-- 10. Insert some sample articles
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
    '# Welkom bij het nieuwe CMS

Ons nieuwe content management systeem is nu volledig operationeel met:

- **Database-driven content** via Supabase
- **Veilige authenticatie** voor editors
- **Real-time updates** naar de website
- **API integratie** voor n8n workflows

## Wat is er nieuw?

Alles wordt nu opgeslagen in een professionele PostgreSQL database. Dit betekent:
- Betere performance
- Schaalbare architectuur
- Backup mogelijkheden
- Multi-user support

## Aan de slag

Log in op `/cms` met je credentials om content te beheren.',
    true,
    NOW(),
    'Nieuws',
    ARRAY['cms', 'update', 'supabase'],
    'cms'
),
(
    'Microsoft 365 Migration Success Story',
    'microsoft-365-migration-success',
    'Een Amsterdam creative agency stapt succesvol over naar Microsoft 365.',
    '# Microsoft 365 Migration Success

We hebben weer een succesvolle migratie afgerond! Dit keer voor een creatief bureau in Amsterdam met 25 medewerkers.

## De uitdaging
- Verouderde on-premise Exchange server
- Geen mobiele toegang tot email
- Beperkte samenwerking mogelijkheden

## De oplossing
Complete migratie naar Microsoft 365 Business Premium inclusief:
- Exchange Online voor email
- SharePoint voor document management
- Teams voor communicatie

## Resultaten
- **50% snellere** file sharing
- **Zero downtime** tijdens migratie
- **100% gebruikerstevredenheid**

Neem contact op voor uw eigen migratie!',
    true,
    NOW() - INTERVAL '2 days',
    'Blog',
    ARRAY['microsoft365', 'migration', 'case-study'],
    'cms'
),
(
    'Cybersecurity Tips voor MKB',
    'cybersecurity-tips-mkb',
    'Essentiële beveiligingstips voor kleine en middelgrote bedrijven.',
    '# Cybersecurity Tips voor MKB

Cybersecurity is niet alleen voor grote bedrijven. Hier zijn onze top tips:

## 1. Multi-Factor Authentication (MFA)
Schakel MFA in voor alle kritieke accounts. Dit voorkomt 99% van de account hacks.

## 2. Regelmatige Backups
Test je backups maandelijks. Een backup die niet werkt is geen backup.

## 3. Training voor Medewerkers
80% van de incidenten komt door menselijke fouten. Train je team!

## 4. Update Software
Houdt alle software up-to-date. Automatische updates zijn je vriend.

## 5. Incident Response Plan
Weet wat te doen ALS het misgaat, niet wanneer het misgaat.

Contact ons voor een gratis security assessment!',
    true,
    NOW() - INTERVAL '5 days',
    'Blog',
    ARRAY['security', 'tips', 'mkb'],
    'cms'
)
ON CONFLICT (slug) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ CMS database created successfully!';
    RAISE NOTICE '📧 Admin login: admin@workflo.it';
    RAISE NOTICE '🔑 Password: Admin123!';
    RAISE NOTICE '📊 Tables: articles, cms_users, categories, tags';
    RAISE NOTICE '📝 Sample articles: 3 added';
END $$;
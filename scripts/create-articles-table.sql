-- Create the articles table for the CMS system
-- Run this in your Supabase SQL editor

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_nl TEXT,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  excerpt_nl TEXT,
  content TEXT,
  content_nl TEXT,
  author TEXT DEFAULT 'Workflo Team',
  category TEXT DEFAULT 'Nieuws',
  tags TEXT[] DEFAULT '{}',
  image TEXT,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  source TEXT DEFAULT 'cms',
  external_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access and authenticated write access
CREATE POLICY "Public can read published articles" ON articles
FOR SELECT USING (published = true);

-- For development: allow all operations (make this more restrictive in production)
CREATE POLICY "Allow all operations for development" ON articles
FOR ALL USING (true) WITH CHECK (true);

-- Insert some sample data
INSERT INTO articles (title, slug, excerpt, content, author, category, published, published_at) VALUES 
('Welkom bij het nieuwe CMS systeem', 'welkom-bij-het-nieuwe-cms-systeem', 'Het nieuwe CMS systeem is nu live en klaar voor gebruik.', 'Het nieuwe CMS systeem biedt uitgebreide mogelijkheden voor het beheren van artikelen, nieuws en blog posts. Met een moderne interface en krachtige functies kunnen we nu eenvoudig content creëren en beheren.', 'Workflo Team', 'Nieuws', true, NOW()),
('Cybersecurity trends voor 2024', 'cybersecurity-trends-voor-2024', 'De belangrijkste cybersecurity ontwikkelingen voor het komende jaar.', 'In 2024 zien we een aantal belangrijke trends in cybersecurity. Van AI-gedreven bedreigingen tot zero-trust architecturen, organisaties moeten voorbereid zijn op de uitdagingen die komen.', 'Workflo Security Team', 'Blog', true, NOW() - INTERVAL '1 day'),
('Cloud migratie strategie', 'cloud-migratie-strategie', 'Een stap-voor-stap handleiding voor succesvolle cloud migratie.', 'Cloud migratie vereist een doordachte aanpak. Deze handleiding beschrijft de belangrijkste stappen en overwegingen voor een succesvolle migratie naar de cloud.', 'Workflo Cloud Team', 'Tutorial', false, NULL);

-- Check if everything was created successfully
SELECT 
  'Articles table created successfully!' as status,
  COUNT(*) as sample_articles_count
FROM articles;
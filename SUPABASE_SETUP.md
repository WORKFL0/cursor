# 🚀 Supabase Setup Guide voor Workflo CMS

## Stap 1: Maak Supabase Account

1. Ga naar [supabase.com](https://supabase.com)
2. Klik op "Start your project"
3. Login met GitHub of maak account
4. Maak nieuw project:
   - **Name**: `workflo-cms`
   - **Database Password**: Bewaar deze goed!
   - **Region**: Frankfurt (dichtbij Amsterdam)

## Stap 2: Kopieer deze SQL en run in Supabase SQL Editor

Ga naar SQL Editor in Supabase en plak dit:

```sql
-- Create articles table
CREATE TABLE articles (
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
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_articles_published ON articles(published);
CREATE INDEX idx_articles_slug ON articles(slug);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow public to read published articles
CREATE POLICY "Public can read published articles" ON articles
FOR SELECT USING (published = true);

-- Allow all operations without authentication (for development)
CREATE POLICY "Allow all operations" ON articles
FOR ALL USING (true) WITH CHECK (true);
```

## Stap 3: Haal API Keys Op

1. Ga naar **Settings** → **API** in Supabase
2. Kopieer deze waarden voor je .env.local file

## Stap 4: Update .env.local

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Klaar! Restart je dev server en het CMS werkt met database.

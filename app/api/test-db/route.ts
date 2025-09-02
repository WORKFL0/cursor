import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({
        success: false,
        error: 'Supabase not configured',
        details: 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
      }, { status: 500 })
    }

    // Test basic connection
    const { data: healthCheck, error: healthError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(1)

    if (healthError) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: healthError.message
      }, { status: 500 })
    }

    // Check if articles table exists
    const { data: articlesTableCheck, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'articles')

    const articlesTableExists = articlesTableCheck && articlesTableCheck.length > 0

    let articlesCount = 0
    if (articlesTableExists) {
      try {
        const { count, error: countError } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
        
        if (!countError) {
          articlesCount = count || 0
        }
      } catch (err) {
        console.warn('Could not get articles count:', err)
      }
    }

    return NextResponse.json({
      success: true,
      connection: 'OK',
      database: {
        connected: true,
        articlesTableExists,
        articlesCount,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...'
      }
    })

  } catch (error: any) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Database test failed',
      details: error.message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (action === 'create-table') {
      if (!isSupabaseConfigured || !supabase) {
        return NextResponse.json({
          success: false,
          error: 'Supabase not configured'
        }, { status: 500 })
      }

      // Create articles table with RLS
      const createTableSQL = `
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

        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Public can read published articles" ON articles;
        DROP POLICY IF EXISTS "Allow all operations for development" ON articles;

        -- Create policies for public read access and authenticated write access
        CREATE POLICY "Public can read published articles" ON articles
          FOR SELECT USING (published = true);

        -- For development: allow all operations (make this more restrictive in production)
        CREATE POLICY "Allow all operations for development" ON articles
          FOR ALL USING (true) WITH CHECK (true);
      `

      const { error } = await supabase.rpc('sql', { query: createTableSQL })

      if (error) {
        console.error('Error creating articles table:', error)
        return NextResponse.json({
          success: false,
          error: 'Failed to create articles table',
          details: error.message
        }, { status: 500 })
      }

      // Insert sample data
      const sampleData = [
        {
          title: 'Welkom bij het nieuwe CMS systeem',
          slug: 'welkom-bij-het-nieuwe-cms-systeem',
          excerpt: 'Het nieuwe CMS systeem is nu live en klaar voor gebruik.',
          content: 'Het nieuwe CMS systeem biedt uitgebreide mogelijkheden voor het beheren van artikelen, nieuws en blog posts. Met een moderne interface en krachtige functies kunnen we nu eenvoudig content creëren en beheren.',
          author: 'Workflo Team',
          category: 'Nieuws',
          published: true,
          featured: true,
          published_at: new Date().toISOString()
        },
        {
          title: 'Cybersecurity trends voor 2024',
          slug: 'cybersecurity-trends-voor-2024',
          excerpt: 'De belangrijkste cybersecurity ontwikkelingen voor het komende jaar.',
          content: 'In 2024 zien we een aantal belangrijke trends in cybersecurity. Van AI-gedreven bedreigingen tot zero-trust architecturen, organisaties moeten voorbereid zijn op de uitdagingen die komen.',
          author: 'Workflo Security Team',
          category: 'Blog',
          published: true,
          featured: false,
          published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          title: 'Cloud migratie strategie',
          slug: 'cloud-migratie-strategie',
          excerpt: 'Een stap-voor-stap handleiding voor succesvolle cloud migratie.',
          content: 'Cloud migratie vereist een doordachte aanpak. Deze handleiding beschrijft de belangrijkste stappen en overwegingen voor een succesvolle migratie naar de cloud.',
          author: 'Workflo Cloud Team',
          category: 'Tutorial',
          published: true,
          featured: false,
          published_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
        }
      ]

      const { error: insertError } = await supabase
        .from('articles')
        .insert(sampleData)

      if (insertError) {
        console.warn('Sample data insertion failed:', insertError)
      }

      return NextResponse.json({
        success: true,
        message: 'Articles table created successfully',
        sampleDataInserted: !insertError
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 })

  } catch (error: any) {
    console.error('Database setup error:', error)
    return NextResponse.json({
      success: false,
      error: 'Database setup failed',
      details: error.message
    }, { status: 500 })
  }
}
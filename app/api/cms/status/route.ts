import { NextRequest, NextResponse } from 'next/server'
import { ArticleService } from '@/lib/services/article-service'
import { isSupabaseConfigured } from '@/lib/supabase/client'

export async function GET(_request: NextRequest) {
  try {
    // Test database connection
    const connectionTest = await ArticleService.testConnection()
    
    // Get configuration status
    const configStatus = {
      supabaseConfigured: isSupabaseConfigured,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing (not required for basic operations)',
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Missing'
    }

    // Try to get article count
    let articleCount = 0
    let storageType = 'Unknown'
    
    try {
      const articles = await ArticleService.getArticles({ limit: 1 })
      articleCount = articles.count
      storageType = articles.useClientStorage ? 'localStorage (client-side)' : 'Supabase (database)'
    } catch (error) {
      console.error('Error getting article count:', error)
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      database: connectionTest,
      configuration: configStatus,
      articles: {
        count: articleCount,
        storageType
      },
      recommendations: getRecommendations(configStatus, connectionTest)
    })
  } catch (error: any) {
    console.error('Error in CMS status check:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

function getRecommendations(config: any, connection: any): string[] {
  const recommendations: string[] = []

  if (!config.supabaseConfigured) {
    recommendations.push('Configure Supabase by setting NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  }

  if (!connection.success) {
    recommendations.push('Database connection failed - check Supabase configuration and create the articles table')
    recommendations.push('Run the SQL script in /scripts/create-articles-table.sql in your Supabase SQL editor')
  }

  if (config.serviceRoleKey === 'Missing') {
    recommendations.push('Consider setting SUPABASE_SERVICE_ROLE_KEY for advanced database operations (optional)')
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ All systems operational! CMS is ready to use with database storage.')
  }

  return recommendations
}
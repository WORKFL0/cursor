import { NextRequest, NextResponse } from 'next/server'
import SupabaseArticleService from '@/lib/services/supabase-article-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    const publishedOnly = searchParams.get('publishedOnly') !== 'false'
    
    if (!query || !query.trim()) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      )
    }

    const result = await SupabaseArticleService.searchArticles(
      query.trim(),
      limit,
      offset,
      publishedOnly
    )
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Search failed' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in GET /api/cms/articles/search:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
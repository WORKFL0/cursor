import { NextRequest, NextResponse } from 'next/server'
import SupabaseArticleService from '@/lib/services/supabase-article-service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      )
    }

    const result = await SupabaseArticleService.getArticle(id)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Article not found' },
        { status: result.error === 'Article not found' ? 404 : 500 }
      )
    }

    // Increment view count for published articles
    if (result.data?.published) {
      SupabaseArticleService.incrementViews(id) // Don't await - fire and forget
    }
    
    return NextResponse.json({
      success: true,
      data: result.data
    })
  } catch (error) {
    console.error('Error in GET /api/cms/articles/[id]:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
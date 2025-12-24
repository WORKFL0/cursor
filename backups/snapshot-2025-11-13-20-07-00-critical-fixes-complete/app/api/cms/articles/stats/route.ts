import { NextRequest, NextResponse } from 'next/server'
import { CMSAuthService } from '@/lib/auth/cms-auth'
import SupabaseArticleService from '@/lib/services/supabase-article-service'

export async function GET(request: NextRequest) {
  try {
    // Check authentication - only authenticated users can view stats
    const authResult = await CMSAuthService.requireAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult // Auth failed
    }

    const result = await SupabaseArticleService.getArticleStats()
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to get statistics' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: result.data
    })
  } catch (error) {
    console.error('Error in GET /api/cms/articles/stats:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
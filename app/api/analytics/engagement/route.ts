import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase'

/**
 * POST /api/analytics/engagement
 * Updates engagement metrics (time on page, scroll depth) for the most recent page view
 */
export async function POST(request: NextRequest) {
  try {
    const { page_path, visitor_id, session_id, time_on_page, scroll_depth } = await request.json()
    const supabase = getServerSupabaseClient()

    // Validate required fields
    if (!page_path || !visitor_id || !session_id) {
      return NextResponse.json(
        { error: 'Missing required fields: page_path, visitor_id, session_id' },
        { status: 400 }
      )
    }

    // Update most recent page view with engagement metrics
    const { error } = await supabase
      .from('analytics_page_views')
      .update({
        time_on_page,
        scroll_depth,
      })
      .eq('page_path', page_path)
      .eq('visitor_id', visitor_id)
      .eq('session_id', session_id)
      .order('viewed_at', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Error updating engagement:', error)
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Engagement error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

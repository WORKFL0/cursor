import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase'

/**
 * POST /api/analytics/track
 * Tracks page views and visitor data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = getServerSupabaseClient()

    // Validate required fields
    if (!body.page_path || !body.visitor_id || !body.session_id) {
      return NextResponse.json(
        { error: 'Missing required fields: page_path, visitor_id, session_id' },
        { status: 400 }
      )
    }

    // Insert page view
    const { error } = await supabase
      .from('analytics_page_views')
      .insert([{
        page_path: body.page_path,
        page_title: body.page_title || null,
        visitor_id: body.visitor_id,
        session_id: body.session_id,
        referrer: body.referrer || null,
        utm_source: body.utm_source || null,
        utm_medium: body.utm_medium || null,
        utm_campaign: body.utm_campaign || null,
        device_type: body.device_type || null,
        browser: body.browser || null,
        os: body.os || null,
        time_on_page: body.time_on_page || null,
        scroll_depth: body.scroll_depth || null,
      }])

    if (error) {
      console.error('Error tracking page view:', error)
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Track error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

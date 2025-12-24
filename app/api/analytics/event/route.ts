import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase'

/**
 * POST /api/analytics/event
 * Tracks custom events and conversions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = getServerSupabaseClient()

    // Validate required fields
    if (!body.event_type || !body.visitor_id || !body.session_id || !body.page_path) {
      return NextResponse.json(
        { error: 'Missing required fields: event_type, visitor_id, session_id, page_path' },
        { status: 400 }
      )
    }

    // Insert conversion/event
    const { error } = await supabase
      .from('analytics_conversions')
      .insert([{
        event_type: body.event_type,
        event_label: body.event_label || null,
        visitor_id: body.visitor_id,
        session_id: body.session_id,
        page_path: body.page_path,
        metadata: body.metadata || {},
      }])

    if (error) {
      console.error('Error tracking event:', error)
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Event error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

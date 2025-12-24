/**
 * Analytics API - v1
 * Track events and retrieve analytics data
 * Author: Claude Code - Workflo Backend System
 * Date: 2025-09-04
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { allowAnonymous, requireEditor, strictRateLimit } from '@/lib/middleware/auth'
import type { 
  Database, 
  AnalyticsEvent, 
  VisitorStatistics,
  ApiResponse,
  AnalyticsEventType 
} from '@/lib/database.types'

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Supabase client
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

/**
 * Extract client information from request
 */
function extractClientInfo(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1'
  
  // Simple user agent parsing (in production, consider using a proper UA parser)
  let deviceType = 'desktop'
  let browser = 'unknown'
  let os = 'unknown'

  if (userAgent) {
    // Device detection
    if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
      deviceType = 'mobile'
    } else if (/tablet|ipad/i.test(userAgent)) {
      deviceType = 'tablet'
    }

    // Browser detection
    if (userAgent.includes('Chrome')) browser = 'Chrome'
    else if (userAgent.includes('Firefox')) browser = 'Firefox'
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari'
    else if (userAgent.includes('Edge')) browser = 'Edge'

    // OS detection
    if (userAgent.includes('Windows')) os = 'Windows'
    else if (userAgent.includes('Mac')) os = 'macOS'
    else if (userAgent.includes('Linux')) os = 'Linux'
    else if (userAgent.includes('Android')) os = 'Android'
    else if (userAgent.includes('iOS')) os = 'iOS'
  }

  return { ip, userAgent, deviceType, browser, os }
}

/**
 * Generate session ID based on IP and user agent
 */
function generateSessionId(ip: string, userAgent: string): string {
  const crypto = require('crypto')
  const sessionData = `${ip}-${userAgent}-${new Date().toDateString()}`
  return crypto.createHash('sha256').update(sessionData).digest('hex')
}

// ================================================================
// GET /api/v1/analytics - Get analytics data (requires editor role)
// ================================================================

export const GET = requireEditor(async (req: NextRequest, { user }) => {
  try {
    const url = new URL(req.url)
    const searchParams = url.searchParams

    const type = searchParams.get('type') || 'overview'
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000)

    switch (type) {
      case 'overview':
        return await getOverviewAnalytics(dateFrom, dateTo)
      
      case 'visitors':
        return await getVisitorStatistics(dateFrom, dateTo)
      
      case 'articles':
        return await getArticleAnalytics(dateFrom, dateTo, limit)
      
      case 'events':
        return await getEventAnalytics(dateFrom, dateTo, limit)
      
      case 'realtime':
        return await getRealtimeAnalytics()
      
      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid analytics type',
            message: 'Valid types: overview, visitors, articles, events, realtime'
          },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('GET /api/v1/analytics error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch analytics',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
})

// ================================================================
// POST /api/v1/analytics - Track analytics event (rate limited)
// ================================================================

export const POST = strictRateLimit(async (req: NextRequest, { user }) => {
  try {
    const body = await req.json()

    // Validate required fields
    if (!body.event_name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'event_name is required'
        },
        { status: 400 }
      )
    }

    // Extract client information
    const clientInfo = extractClientInfo(req)
    const sessionId = generateSessionId(clientInfo.ip, clientInfo.userAgent)

    // Prepare analytics event
    const eventData = {
      session_id: sessionId,
      user_id: user?.id || null,
      event_type: (body.event_type as AnalyticsEventType) || 'page_view',
      event_name: body.event_name,
      page_url: body.page_url || req.url,
      referrer: body.referrer || req.headers.get('referer') || null,
      user_agent: clientInfo.userAgent,
      ip_address: clientInfo.ip,
      device_type: clientInfo.deviceType,
      browser: clientInfo.browser,
      os: clientInfo.os,
      properties: body.properties || {},
      value: body.value || null
    }

    // Insert analytics event
    const { data: newEvent, error } = await supabase
      .from('analytics_events')
      .insert(eventData as any) // Type assertion needed due to Supabase types issue
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to track event: ${error.message}`)
    }

    const response = {
      success: true,
      data: newEvent,
      message: 'Event tracked successfully',
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('POST /api/v1/analytics error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to track event',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
})

// ================================================================
// ANALYTICS QUERY FUNCTIONS
// ================================================================

async function getOverviewAnalytics(dateFrom?: string | null, dateTo?: string | null) {
  const endDate = dateTo || new Date().toISOString().split('T')[0]
  const startDate = dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // Get visitor statistics
  const { data: visitorStats } = await supabase
    .from('visitor_statistics')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false })

  // Calculate totals
  const totals = visitorStats?.reduce((acc, day: any) => ({
    unique_visitors: acc.unique_visitors + (day.unique_visitors || 0),
    total_page_views: acc.total_page_views + (day.total_page_views || 0),
    total_sessions: acc.total_sessions + (day.total_sessions || 0)
  }), { unique_visitors: 0, total_page_views: 0, total_sessions: 0 }) || { unique_visitors: 0, total_page_views: 0, total_sessions: 0 }

  // Get top articles
  const { data: topArticles } = await supabase
    .from('articles')
    .select('id, title, slug, views_count')
    .eq('published', true)
    .order('views_count', { ascending: false })
    .limit(10)

  // Get recent events
  const { data: recentEvents } = await supabase
    .from('analytics_events')
    .select('event_name, event_type, created_at, properties')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false })
    .limit(50)

  return NextResponse.json({
    success: true,
    data: {
      period: { start: startDate, end: endDate },
      totals,
      daily_stats: visitorStats,
      top_articles: topArticles,
      recent_events: recentEvents
    },
    timestamp: new Date().toISOString()
  })
}

async function getVisitorStatistics(dateFrom?: string | null, dateTo?: string | null) {
  const endDate = dateTo || new Date().toISOString().split('T')[0]
  const startDate = dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const { data: stats, error } = await supabase
    .from('visitor_statistics')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch visitor statistics: ${error.message}`)
  }

  return NextResponse.json({
    success: true,
    data: {
      period: { start: startDate, end: endDate },
      statistics: stats
    },
    timestamp: new Date().toISOString()
  })
}

async function getArticleAnalytics(dateFrom?: string | null, dateTo?: string | null, limit: number = 100) {
  const endDate = dateTo || new Date().toISOString().split('T')[0]
  const startDate = dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const { data: articleStats, error } = await supabase
    .from('article_analytics')
    .select(`
      *,
      articles!inner(id, title, slug, published)
    `)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('views', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to fetch article analytics: ${error.message}`)
  }

  return NextResponse.json({
    success: true,
    data: {
      period: { start: startDate, end: endDate },
      article_stats: articleStats
    },
    timestamp: new Date().toISOString()
  })
}

async function getEventAnalytics(dateFrom?: string | null, dateTo?: string | null, limit: number = 1000) {
  const endDate = dateTo || new Date().toISOString()
  const startDate = dateFrom || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const { data: events, error } = await supabase
    .from('analytics_events')
    .select('event_type, event_name, created_at, properties, page_url, device_type, browser, os')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to fetch event analytics: ${error.message}`)
  }

  // Group events by type
  const eventsByType = events?.reduce((acc: any, event: any) => {
    if (!acc[event.event_type]) {
      acc[event.event_type] = []
    }
    acc[event.event_type].push(event)
    return acc
  }, {})

  return NextResponse.json({
    success: true,
    data: {
      period: { start: startDate, end: endDate },
      total_events: events?.length || 0,
      events,
      events_by_type: eventsByType
    },
    timestamp: new Date().toISOString()
  })
}

async function getRealtimeAnalytics() {
  const last15Minutes = new Date(Date.now() - 15 * 60 * 1000).toISOString()

  // Get recent events
  const { data: recentEvents } = await supabase
    .from('analytics_events')
    .select('event_type, event_name, created_at, page_url, device_type')
    .gte('created_at', last15Minutes)
    .order('created_at', { ascending: false })
    .limit(100)

  // Count active sessions (unique sessions in last 15 minutes)
  const { data: activeSessions } = await supabase
    .from('analytics_events')
    .select('session_id')
    .gte('created_at', last15Minutes)

  const uniqueSessions = new Set(activeSessions?.map((e: any) => e.session_id)).size

  // Get current top pages
  const pageViews = recentEvents?.filter((e: any) => e.event_type === 'page_view')
  const topPages = pageViews?.reduce((acc: any, event: any) => {
    const page = event.page_url
    acc[page] = (acc[page] || 0) + 1
    return acc
  }, {})

  const sortedPages = Object.entries(topPages || {})
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 10)
    .map(([page, views]) => ({ page, views }))

  return NextResponse.json({
    success: true,
    data: {
      active_sessions: uniqueSessions,
      recent_events: recentEvents,
      top_pages: sortedPages,
      last_updated: new Date().toISOString()
    },
    timestamp: new Date().toISOString()
  })
}
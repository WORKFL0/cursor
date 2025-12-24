import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase'

/**
 * Validate admin authentication
 */
async function validateAdminAuth(request: NextRequest): Promise<boolean> {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return false

    const supabase = getServerSupabaseClient()
    const { data: session } = await supabase
      .from('admin_sessions')
      .select('*')
      .eq('token', token)
      .single()

    if (!session) return false
    if (new Date((session as any).expires_at) < new Date()) return false

    return true
  } catch {
    return false
  }
}

/**
 * GET /api/admin/analytics?range=7d
 * Get analytics dashboard data
 */
export async function GET(request: NextRequest) {
  try {
    // Validate admin authentication
    const isAuthenticated = await validateAdminAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7d'

    // Calculate date range
    const daysMap: Record<string, number> = {
      '24h': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
    }
    const days = daysMap[range] || 7
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const supabase = getServerSupabaseClient()

    // ===== OVERVIEW STATS =====
    const [currentPeriod, previousPeriod] = await Promise.all([
      fetchPeriodStats(supabase, startDate, new Date()),
      fetchPeriodStats(
        supabase,
        new Date(startDate.getTime() - days * 24 * 60 * 60 * 1000),
        startDate
      ),
    ])

    const overview = {
      totalViews: currentPeriod.views,
      uniqueVisitors: currentPeriod.visitors,
      pageViews: currentPeriod.views,
      averageSessionDuration: Math.round(currentPeriod.avgTime || 0),
      bounceRate: currentPeriod.bounceRate || 0,
      viewsChange: calculatePercentageChange(
        currentPeriod.views,
        previousPeriod.views
      ),
      visitorsChange: calculatePercentageChange(
        currentPeriod.visitors,
        previousPeriod.visitors
      ),
    }

    // ===== TOP PAGES =====
    const { data: topPagesData } = await supabase
      .from('analytics_page_views')
      .select('page_path, time_on_page')
      .gte('viewed_at', startDate.toISOString())
      .order('viewed_at', { ascending: false })

    const topPages = aggregateTopPages(topPagesData || [])

    // ===== TOP ARTICLES (Blog posts) =====
    const { data: topArticles } = await supabase
      .from('blog_posts')
      .select('id, title, slug, view_count, published_at')
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .limit(10)

    const topArticlesFormatted = ((topArticles as any[]) || []).map((article: any) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      views: article.view_count || 0,
      uniqueViews: Math.round((article.view_count || 0) * 0.85), // Estimate
      publishedAt: article.published_at,
    }))

    // ===== TRAFFIC OVER TIME =====
    const { data: trafficData } = await supabase
      .from('analytics_page_views')
      .select('viewed_at, visitor_id')
      .gte('viewed_at', startDate.toISOString())
      .order('viewed_at', { ascending: true })

    const traffic = aggregateTrafficByDay(trafficData || [], days)

    // ===== TRAFFIC SOURCES =====
    const { data: sourcesData } = await supabase
      .from('analytics_page_views')
      .select('referrer, utm_source, visitor_id')
      .gte('viewed_at', startDate.toISOString())

    const sources = aggregateTrafficSources(sourcesData || [])

    // ===== DEVICE BREAKDOWN =====
    const { data: devicesData } = await supabase
      .from('analytics_page_views')
      .select('device_type, visitor_id')
      .gte('viewed_at', startDate.toISOString())

    const devices = aggregateDeviceStats(devicesData || [])

    return NextResponse.json({
      overview,
      topPages,
      topArticles: topArticlesFormatted,
      traffic,
      sources,
      devices,
    })
  } catch (error: any) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

// ===== HELPER FUNCTIONS =====

async function fetchPeriodStats(
  supabase: any,
  startDate: Date,
  endDate: Date
) {
  const { data } = await supabase
    .from('analytics_page_views')
    .select('visitor_id, session_id, time_on_page')
    .gte('viewed_at', startDate.toISOString())
    .lt('viewed_at', endDate.toISOString())

  if (!data || data.length === 0) {
    return { views: 0, visitors: 0, sessions: 0, avgTime: 0, bounceRate: 0 }
  }

  const visitors = new Set(data.map((d: any) => d.visitor_id)).size
  const sessions = new Set(data.map((d: any) => d.session_id)).size
  const totalTime = data.reduce((sum: number, d: any) => sum + (d.time_on_page || 0), 0)
  const avgTime = totalTime / data.length

  // Estimate bounce rate (sessions with only 1 page view)
  const sessionCounts = data.reduce((acc: any, d: any) => {
    acc[d.session_id] = (acc[d.session_id] || 0) + 1
    return acc
  }, {})
  const bouncedSessions = Object.values(sessionCounts).filter((count: any) => count === 1).length
  const bounceRate = sessions > 0 ? (bouncedSessions / sessions) * 100 : 0

  return {
    views: data.length,
    visitors,
    sessions,
    avgTime,
    bounceRate: parseFloat(bounceRate.toFixed(1)),
  }
}

function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return parseFloat((((current - previous) / previous) * 100).toFixed(1))
}

function aggregateTopPages(data: any[]) {
  const pageStats: Record<string, any> = {}

  data.forEach((item) => {
    const path = item.page_path
    if (!pageStats[path]) {
      pageStats[path] = {
        path,
        views: 0,
        uniqueViews: new Set(),
        totalTime: 0,
      }
    }
    pageStats[path].views++
    pageStats[path].uniqueViews.add(item.visitor_id)
    pageStats[path].totalTime += item.time_on_page || 0
  })

  return Object.values(pageStats)
    .map((page: any) => ({
      path: page.path,
      views: page.views,
      uniqueViews: page.uniqueViews.size,
      averageTimeOnPage: Math.round(page.totalTime / page.views),
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)
}

function aggregateTrafficByDay(data: any[], days: number) {
  const dailyStats: Record<string, any> = {}

  // Initialize all days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0] as string
    dailyStats[dateStr] = {
      date: dateStr,
      views: 0,
      visitors: new Set(),
    }
  }

  // Aggregate data
  data.forEach((item) => {
    const dateStr = (item as any).viewed_at.split('T')[0]
    if (dailyStats[dateStr]) {
      dailyStats[dateStr].views++
      dailyStats[dateStr].visitors.add(item.visitor_id)
    }
  })

  return Object.values(dailyStats).map((day: any) => ({
    date: day.date,
    views: day.views,
    visitors: day.visitors.size,
  }))
}

function aggregateTrafficSources(data: any[]) {
  const sourceCounts: Record<string, Set<string>> = {}

  data.forEach((item) => {
    let source = item.utm_source || 'Direct'

    if (!item.utm_source && item.referrer) {
      if (item.referrer.includes('google')) source = 'Google Search'
      else if (item.referrer.includes('linkedin')) source = 'LinkedIn'
      else if (item.referrer.includes('facebook')) source = 'Facebook'
      else if (item.referrer.includes('twitter') || item.referrer.includes('x.com')) source = 'Twitter'
      else source = 'Other'
    }

    if (!sourceCounts[source]) {
      sourceCounts[source] = new Set()
    }
    sourceCounts[source].add(item.visitor_id)
  })

  const total = data.length
  const sources = Object.entries(sourceCounts).map(([source, visitors]) => ({
    source,
    visitors: visitors.size,
    percentage: parseFloat(((visitors.size / total) * 100).toFixed(1)),
  }))

  return sources.sort((a, b) => b.visitors - a.visitors)
}

function aggregateDeviceStats(data: any[]) {
  const deviceCounts: Record<string, Set<string>> = {}

  data.forEach((item) => {
    const device = item.device_type || 'Unknown'
    if (!deviceCounts[device]) {
      deviceCounts[device] = new Set()
    }
    deviceCounts[device].add(item.visitor_id)
  })

  const total = Object.values(deviceCounts).reduce(
    (sum, visitors) => sum + visitors.size,
    0
  )

  const devices = Object.entries(deviceCounts).map(([device, visitors]) => ({
    device: device.charAt(0).toUpperCase() + device.slice(1),
    visitors: visitors.size,
    percentage: parseFloat(((visitors.size / total) * 100).toFixed(1)),
  }))

  return devices.sort((a, b) => b.visitors - a.visitors)
}

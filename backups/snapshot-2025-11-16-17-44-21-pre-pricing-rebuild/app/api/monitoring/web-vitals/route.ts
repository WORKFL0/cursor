import { NextRequest, NextResponse } from 'next/server'

interface WebVitalMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
  url: string
  timestamp: number
}

interface WebVitalData extends WebVitalMetric {
  userAgent?: string
  connectionType?: string
  deviceMemory?: number
  hardwareConcurrency?: number
  sessionId?: string
  userId?: string
}

// In-memory storage for demo (use a proper database in production)
const webVitalsData: WebVitalData[] = []
const MAX_STORED_METRICS = 10000 // Prevent memory overflow

export async function POST(request: NextRequest) {
  try {
    const data: WebVitalMetric = await request.json()
    
    // Validate required fields
    if (!data.name || !data.value || !data.id || !data.url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Enrich data with additional context
    const enrichedData: WebVitalData = {
      ...data,
      userAgent: request.headers.get('user-agent') || undefined,
      sessionId: request.headers.get('x-session-id') || undefined,
      userId: request.headers.get('x-user-id') || undefined,
    }

    // Store the metric (in production, save to database)
    webVitalsData.push(enrichedData)
    
    // Keep only the most recent metrics to prevent memory overflow
    if (webVitalsData.length > MAX_STORED_METRICS) {
      webVitalsData.splice(0, webVitalsData.length - MAX_STORED_METRICS)
    }

    // Log performance issues
    if (data.rating === 'poor') {
      console.warn(`Poor ${data.name} performance:`, {
        value: data.value,
        url: data.url,
        userAgent: enrichedData.userAgent,
      })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Web Vitals tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track web vital' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const metric = searchParams.get('metric')
    const limit = parseInt(searchParams.get('limit') || '100')
    const since = searchParams.get('since') // ISO date string
    
    let filteredData = webVitalsData

    // Filter by metric name
    if (metric) {
      filteredData = filteredData.filter(d => d.name === metric)
    }

    // Filter by date
    if (since) {
      const sinceTimestamp = new Date(since).getTime()
      filteredData = filteredData.filter(d => d.timestamp >= sinceTimestamp)
    }

    // Sort by timestamp (most recent first) and limit
    filteredData = filteredData
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)

    // Calculate statistics
    const stats = calculateWebVitalStats(filteredData)

    return NextResponse.json({
      data: filteredData,
      stats,
      total: filteredData.length,
    })
  } catch (error) {
    console.error('Web Vitals retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve web vitals' },
      { status: 500 }
    )
  }
}

function calculateWebVitalStats(data: WebVitalData[]) {
  if (data.length === 0) return null

  const groupedByMetric = data.reduce((acc, metric) => {
    if (!acc[metric.name]) {
      acc[metric.name] = []
    }
    acc[metric.name]!.push(metric)
    return acc
  }, {} as Record<string, WebVitalData[]>)

  const stats: Record<string, any> = {}

  Object.entries(groupedByMetric).forEach(([metricName, metrics]) => {
    const values = metrics.map(m => m.value)
    const ratings = metrics.map(m => m.rating)
    
    stats[metricName] = {
      count: metrics.length,
      average: values.reduce((sum, val) => sum + val, 0) / values.length,
      median: getMedian(values),
      p75: getPercentile(values, 75),
      p90: getPercentile(values, 90),
      p95: getPercentile(values, 95),
      min: Math.min(...values),
      max: Math.max(...values),
      ratings: {
        good: ratings.filter(r => r === 'good').length,
        'needs-improvement': ratings.filter(r => r === 'needs-improvement').length,
        poor: ratings.filter(r => r === 'poor').length,
      }
    }
  })

  return stats
}

function getMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2
}

function getPercentile(values: number[], percentile: number): number {
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.ceil((percentile / 100) * sorted.length) - 1
  return sorted[Math.max(0, index)]!
}
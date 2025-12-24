import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase'
import { emailQueueService } from '@/lib/services/email-queue-service'
import { hubspotService } from '@/lib/services/hubspot-service'

/**
 * System Health Monitoring API
 * Provides comprehensive health check for all services
 */

interface ServiceHealth {
  name: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  responseTime?: number
  message?: string
  details?: Record<string, any>
}

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'unhealthy'
  responseTime: number
  timestamp: string
  services: ServiceHealth[]
  errors?: string[]
}

/**
 * GET /api/system/health
 * Returns system health status
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const services: ServiceHealth[] = []
  const errors: string[] = []

  try {
    // Check Database
    const dbHealth = await checkDatabase()
    services.push(dbHealth)

    // Check Email Service
    const emailHealth = await checkEmailService()
    services.push(emailHealth)

    // Check HubSpot Service
    const hubspotHealth = await checkHubSpot()
    services.push(hubspotHealth)

    // Check Analytics
    const analyticsHealth = await checkAnalytics()
    services.push(analyticsHealth)

    // Check API Response Time
    const apiHealth = checkAPIResponseTime(startTime)
    services.push(apiHealth)

    // Determine overall health
    const unhealthyCount = services.filter(s => s.status === 'unhealthy').length
    const degradedCount = services.filter(s => s.status === 'degraded').length

    let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
    if (unhealthyCount > 0) {
      overall = 'unhealthy'
    } else if (degradedCount > 0) {
      overall = 'degraded'
    }

    const responseTime = Date.now() - startTime

    // Log health check
    await logHealthCheck({
      serviceName: 'api',
      status: overall,
      responseTimeMs: responseTime,
      metadata: {
        services: services.map(s => ({ name: s.name, status: s.status })),
      },
    })

    const health: SystemHealth = {
      overall,
      responseTime,
      timestamp: new Date().toISOString(),
      services,
      ...(errors.length > 0 && { errors }),
    }

    // Return appropriate status code based on overall health
    const statusCode = overall === 'healthy' ? 200 : overall === 'degraded' ? 200 : 503

    return NextResponse.json(health, { status: statusCode })
  } catch (error: any) {
    console.error('Health check failed:', error)

    return NextResponse.json(
      {
        overall: 'unhealthy',
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        services,
        errors: [error.message],
      } as SystemHealth,
      { status: 503 }
    )
  }
}

/**
 * Check database connectivity and performance
 */
async function checkDatabase(): Promise<ServiceHealth> {
  const startTime = Date.now()

  try {
    const supabase = getServerSupabaseClient()

    // Simple query to check DB connectivity
    const { error } = await supabase
      .from('blog_posts')
      .select('id', { count: 'exact', head: true })
      .limit(1)

    const responseTime = Date.now() - startTime

    if (error) {
      throw error
    }

    // Check if response time is acceptable
    const status = responseTime > 1000 ? 'degraded' : 'healthy'

    return {
      name: 'database',
      status,
      responseTime,
      message: status === 'healthy' ? 'Database operational' : 'Database slow',
    }
  } catch (error: any) {
    return {
      name: 'database',
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      message: 'Database connection failed',
      details: { error: error.message },
    }
  }
}

/**
 * Check email service
 */
async function checkEmailService(): Promise<ServiceHealth> {
  const startTime = Date.now()

  try {
    const stats = await emailQueueService.getStats()
    const responseTime = Date.now() - startTime

    // Check for high failure rate
    const failureRate = stats.total > 0 ? (stats.failed / stats.total) * 100 : 0
    const pendingCount = stats.pending

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
    let message = 'Email service operational'

    if (failureRate > 50) {
      status = 'unhealthy'
      message = `High failure rate: ${failureRate.toFixed(1)}%`
    } else if (failureRate > 20 || pendingCount > 100) {
      status = 'degraded'
      message = `Degraded: ${failureRate.toFixed(1)}% failures, ${pendingCount} pending`
    }

    return {
      name: 'email',
      status,
      responseTime,
      message,
      details: stats,
    }
  } catch (error: any) {
    return {
      name: 'email',
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      message: 'Email service check failed',
      details: { error: error.message },
    }
  }
}

/**
 * Check HubSpot integration
 */
async function checkHubSpot(): Promise<ServiceHealth> {
  const startTime = Date.now()

  try {
    const isAvailable = hubspotService.isAvailable()
    const responseTime = Date.now() - startTime

    return {
      name: 'hubspot',
      status: isAvailable ? 'healthy' : 'degraded',
      responseTime,
      message: isAvailable ? 'HubSpot connected' : 'HubSpot not configured',
    }
  } catch (error: any) {
    return {
      name: 'hubspot',
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      message: 'HubSpot check failed',
      details: { error: error.message },
    }
  }
}

/**
 * Check analytics
 */
async function checkAnalytics(): Promise<ServiceHealth> {
  const startTime = Date.now()

  try {
    const supabase = getServerSupabaseClient()

    // Check if analytics tables are accessible
    const { error } = await supabase
      .from('analytics_page_views')
      .select('id', { count: 'exact', head: true })
      .limit(1)

    const responseTime = Date.now() - startTime

    if (error) {
      throw error
    }

    return {
      name: 'analytics',
      status: responseTime > 500 ? 'degraded' : 'healthy',
      responseTime,
      message: 'Analytics tracking operational',
    }
  } catch (error: any) {
    return {
      name: 'analytics',
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      message: 'Analytics check failed',
      details: { error: error.message },
    }
  }
}

/**
 * Check API response time
 */
function checkAPIResponseTime(startTime: number): ServiceHealth {
  const responseTime = Date.now() - startTime

  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
  let message = 'API responding normally'

  if (responseTime > 3000) {
    status = 'unhealthy'
    message = `API very slow: ${responseTime}ms`
  } else if (responseTime > 1000) {
    status = 'degraded'
    message = `API slow: ${responseTime}ms`
  }

  return {
    name: 'api',
    status,
    responseTime,
    message,
  }
}

/**
 * Log health check to database
 */
async function logHealthCheck(data: {
  serviceName: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  responseTimeMs: number
  errorMessage?: string
  metadata?: Record<string, any>
}): Promise<void> {
  try {
    const supabase = getServerSupabaseClient()

    await supabase.from('system_health_log').insert([{
      service_name: data.serviceName,
      status: data.status,
      response_time_ms: data.responseTimeMs,
      error_message: data.errorMessage,
      metadata: data.metadata || {},
      checked_at: new Date().toISOString(),
    }])
  } catch (error) {
    console.error('Failed to log health check:', error)
  }
}

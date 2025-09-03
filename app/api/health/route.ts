import { NextRequest, NextResponse } from 'next/server'
import { uptimeMonitor } from '@/lib/monitoring/uptime-monitor'

interface MetricsData {
  responseTime: number
  memoryUsage: number
  uptime: number
  throughput: number
  errorRate: number
}

interface HealthCheckItem {
  name: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  details?: string
}

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  uptime: number
  checks: {
    database: 'pass' | 'fail'
    memory: 'pass' | 'warn' | 'fail'
    disk: 'pass' | 'warn' | 'fail'
    responseTime: number
  }
  environment: string
  monitoring: {
    metrics: MetricsData
    healthChecks: HealthCheckItem[]
  }
}

// Simple health check for load balancers and monitoring systems
export async function GET(_request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Check database connectivity
    let databaseStatus: 'pass' | 'warn' | 'fail' = 'pass'
    try {
      // Try to import and test Supabase connection
      const { supabase, isSupabaseConfigured } = await import('@/src/lib/supabase')
      
      if (!isSupabaseConfigured || !supabase) {
        console.warn('Database health check skipped: Supabase not configured')
        databaseStatus = 'warn'
      } else {
        const { error } = await supabase
          .from('users')
          .select('count', { count: 'exact', head: true })
          .limit(1)
        if (error) {
          console.warn('Database health check failed:', error.message)
          databaseStatus = 'fail'
        }
      }
    } catch (importError) {
      console.warn('Database import failed:', importError)
      databaseStatus = 'fail'
    }
    
    // Check memory usage (Node.js)
    const memoryUsage = process.memoryUsage()
    const memoryUsedMB = memoryUsage.heapUsed / 1024 / 1024
    let memoryStatus: 'pass' | 'warn' | 'fail' = 'pass'
    
    if (memoryUsedMB > 512) memoryStatus = 'fail'
    else if (memoryUsedMB > 256) memoryStatus = 'warn'
    
    // Check disk space (simplified - in production use proper disk check)
    let diskStatus: 'pass' | 'warn' | 'fail' = 'pass' // Placeholder
    
    const responseTime = Date.now() - startTime
    
    // Record this request in our monitoring system
    uptimeMonitor.recordRequest(responseTime, false)
    
    // Get comprehensive monitoring data
    const monitoringMetrics = uptimeMonitor.getMetrics()
    const healthChecks = await uptimeMonitor.performHealthChecks()
    
    // Determine overall status
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy'
    
    if (databaseStatus === 'fail' || memoryStatus === 'fail' || (diskStatus as any) === 'fail') {
      overallStatus = 'unhealthy'
    } else if (memoryStatus === 'warn' || (diskStatus as any) === 'warn' || responseTime > 1000) {
      overallStatus = 'degraded'
    } else {
      overallStatus = 'healthy'
    }
    
    // Consider monitoring health checks in overall status
    const unhealthyChecks = healthChecks.filter(check => check.status === 'unhealthy')
    
    if (unhealthyChecks.length > 0 && overallStatus === 'healthy') {
      overallStatus = 'degraded'
    }
    
    const healthResult: HealthCheckResult = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      checks: {
        database: databaseStatus as any,
        memory: memoryStatus as any,
        disk: diskStatus as any,
        responseTime
      },
      environment: process.env.NODE_ENV || 'development',
      monitoring: {
        metrics: monitoringMetrics as any,
        healthChecks: healthChecks as any
      }
    }
    
    // Return appropriate HTTP status codes for monitoring tools
    const httpStatus = overallStatus === 'unhealthy' ? 503 : 
                      overallStatus === 'degraded' ? 206 : 200
    
    return NextResponse.json(healthResult, { 
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check system failure',
      responseTime: Date.now() - startTime
    }, { status: 503 })
  }
}

// Simple readiness check (for Kubernetes/container orchestration)
export async function HEAD() {
  try {
    // Quick database ping
    const { supabase, isSupabaseConfigured } = await import('@/src/lib/supabase')
    
    if (!isSupabaseConfigured || !supabase) {
      // Application is ready but database is not configured
      return new NextResponse(null, { 
        status: 200,
        headers: {
          'Cache-Control': 'no-cache',
          'X-Health-Check': 'ready-no-db'
        }
      })
    }
    
    const { error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true })
      .limit(1)
    
    return new NextResponse(null, { 
      status: error ? 503 : 200,
      headers: {
        'Cache-Control': 'no-cache',
        'X-Health-Check': error ? 'not-ready' : 'ready'
      }
    })
  } catch {
    return new NextResponse(null, { 
      status: 503,
      headers: {
        'X-Health-Check': 'not-ready'
      }
    })
  }
}
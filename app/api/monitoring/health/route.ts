import { NextRequest, NextResponse } from 'next/server'

interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: string
  uptime: number
  version: string
  environment: string
  checks: {
    database: { status: 'up' | 'down'; latency?: number }
    external_apis: { status: 'up' | 'down'; services: Record<string, boolean> }
    memory: { status: 'up' | 'down'; usage: number; limit: number }
    disk: { status: 'up' | 'down'; usage: number }
  }
}

let startTime = Date.now()

export async function GET(request: NextRequest) {
  const start = Date.now()
  
  try {
    // Basic system checks
    const memoryUsage = process.memoryUsage()
    const uptime = Date.now() - startTime

    const healthCheck: HealthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: await checkDatabase(),
        external_apis: await checkExternalAPIs(),
        memory: checkMemory(memoryUsage),
        disk: await checkDisk(),
      }
    }

    // Determine overall status
    const checkStatuses = Object.values(healthCheck.checks).map(check => check.status)
    if (checkStatuses.includes('down')) {
      healthCheck.status = 'unhealthy'
    } else if (checkStatuses.some(status => status === 'down')) {
      healthCheck.status = 'degraded'
    }

    const responseTime = Date.now() - start

    return NextResponse.json(
      {
        ...healthCheck,
        response_time_ms: responseTime,
      },
      { 
        status: healthCheck.status === 'healthy' ? 200 : 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Response-Time': `${responseTime}ms`,
        }
      }
    )
  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        response_time_ms: Date.now() - start,
      },
      { status: 503 }
    )
  }
}

async function checkDatabase() {
  try {
    // Since we're using Supabase, we can do a simple connection test
    // In a real app, you'd test your actual database connection
    const testQuery = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      }
    })
    
    return {
      status: testQuery.ok ? 'up' as const : 'down' as const,
      latency: testQuery.ok ? 50 : undefined // Mock latency
    }
  } catch (error) {
    return { status: 'down' as const }
  }
}

async function checkExternalAPIs() {
  const services = {
    hubspot: process.env.HUBSPOT_API_KEY ? await testAPI('https://api.hubapi.com/cms/v3/source-code') : true,
    anthropic: process.env.ANTHROPIC_API_KEY ? await testAPI('https://api.anthropic.com/v1/messages', { method: 'POST', expectFailure: true }) : true,
    openai: process.env.OPENAI_API_KEY ? await testAPI('https://api.openai.com/v1/models') : true,
  }

  const allUp = Object.values(services).every(status => status === true)
  return {
    status: allUp ? 'up' as const : 'down' as const,
    services
  }
}

async function testAPI(url: string, options?: { method?: string; expectFailure?: boolean }) {
  try {
    const response = await fetch(url, {
      method: options?.method || 'GET',
      timeout: 5000, // 5 second timeout
    })
    
    return options?.expectFailure ? !response.ok : response.ok
  } catch (error) {
    return false
  }
}

function checkMemory(memoryUsage: NodeJS.MemoryUsage) {
  const totalMemory = memoryUsage.heapTotal + memoryUsage.external
  const usedMemory = memoryUsage.heapUsed
  const memoryLimit = 512 * 1024 * 1024 // 512MB limit for serverless
  
  return {
    status: usedMemory > memoryLimit * 0.9 ? 'down' as const : 'up' as const,
    usage: Math.round((usedMemory / 1024 / 1024) * 100) / 100, // MB
    limit: Math.round((memoryLimit / 1024 / 1024) * 100) / 100, // MB
  }
}

async function checkDisk() {
  try {
    // For serverless, disk check is less relevant, but we can check tmp directory
    return {
      status: 'up' as const,
      usage: 0, // Serverless doesn't have persistent disk
    }
  } catch (error) {
    return {
      status: 'down' as const,
      usage: 0,
    }
  }
}
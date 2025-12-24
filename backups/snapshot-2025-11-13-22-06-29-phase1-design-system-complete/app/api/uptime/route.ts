import { NextRequest, NextResponse } from 'next/server'

// Service status checking utilities
interface ServiceStatus {
  name: string
  status: 'up' | 'down' | 'degraded'
  responseTime?: number
  lastChecked: string
  error?: string
}

interface UptimeStatus {
  overall: 'healthy' | 'degraded' | 'down'
  services: ServiceStatus[]
  uptime: {
    percentage: number
    lastDowntime?: string
    totalDowntime: number
  }
  timestamp: string
}

// Check database connectivity
async function checkDatabase(): Promise<ServiceStatus> {
  const start = Date.now()
  try {
    // Check if Supabase environment variables are configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return {
        name: 'Database (Supabase)',
        status: 'down',
        responseTime: Date.now() - start,
        lastChecked: new Date().toISOString(),
        error: 'Supabase environment variables not configured'
      }
    }

    const { supabase, isSupabaseConfigured } = await import('@/src/lib/supabase')
    
    if (!isSupabaseConfigured || !supabase) {
      return {
        name: 'Database (Supabase)',
        status: 'down',
        responseTime: Date.now() - start,
        lastChecked: new Date().toISOString(),
        error: 'Supabase not configured - missing environment variables'
      }
    }
    
    // Simple query to test connection - use a more generic approach
    const { data: _data, error } = await supabase
      .from('information_schema.tables')
      .select('count', { count: 'exact', head: true })
      .limit(1)
    
    const responseTime = Date.now() - start
    
    if (error) {
      return {
        name: 'Database (Supabase)',
        status: 'down',
        responseTime,
        lastChecked: new Date().toISOString(),
        error: error.message
      }
    }
    
    return {
      name: 'Database (Supabase)',
      status: responseTime < 1000 ? 'up' : 'degraded',
      responseTime,
      lastChecked: new Date().toISOString()
    }
  } catch (error) {
    return {
      name: 'Database (Supabase)',
      status: 'down',
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Connection failed'
    }
  }
}

// Check external API services
async function checkExternalServices(): Promise<ServiceStatus[]> {
  const services: ServiceStatus[] = []
  
  // Check HubSpot API
  if (process.env.HUBSPOT_ACCESS_TOKEN) {
    try {
      const start = Date.now()
      const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts?limit=1', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })
      
      const responseTime = Date.now() - start
      
      services.push({
        name: 'HubSpot API',
        status: response.ok ? (responseTime < 2000 ? 'up' : 'degraded') : 'down',
        responseTime,
        lastChecked: new Date().toISOString(),
        error: !response.ok ? `HTTP ${response.status}` : undefined
      })
    } catch (error) {
      services.push({
        name: 'HubSpot API',
        status: 'down',
        lastChecked: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Connection failed'
      })
    }
  } else {
    services.push({
      name: 'HubSpot API',
      status: 'down',
      lastChecked: new Date().toISOString(),
      error: 'HubSpot API token not configured'
    })
  }
  
  // Check Resend API (Email service)
  if (process.env.RESEND_API_KEY) {
    try {
      const start = Date.now()
      const response = await fetch('https://api.resend.com/domains', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      const responseTime = Date.now() - start
      
      services.push({
        name: 'Resend Email API',
        status: response.ok ? (responseTime < 2000 ? 'up' : 'degraded') : 'down',
        responseTime,
        lastChecked: new Date().toISOString(),
        error: !response.ok ? `HTTP ${response.status}` : undefined
      })
    } catch (error) {
      services.push({
        name: 'Resend Email API',
        status: 'down',
        lastChecked: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Connection failed'
      })
    }
  } else {
    services.push({
      name: 'Resend Email API',
      status: 'down',
      lastChecked: new Date().toISOString(),
      error: 'Resend API key not configured'
    })
  }
  
  return services
}

// Calculate uptime statistics (in production, this would use stored metrics)
function calculateUptime(services: ServiceStatus[]) {
  const upServices = services.filter(s => s.status === 'up')
  const percentage = services.length > 0 ? (upServices.length / services.length) * 100 : 100
  
  // In a real implementation, you'd store historical data
  // For now, we'll return mock uptime data
  return {
    percentage: Math.min(percentage, 99.9), // Realistic uptime
    lastDowntime: percentage < 100 ? new Date(Date.now() - 86400000).toISOString() : undefined,
    totalDowntime: percentage < 100 ? 300 : 0 // 5 minutes in seconds
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const detailed = searchParams.get('detailed') === 'true'
    
    // Run all service checks in parallel
    const [dbStatus, externalServices] = await Promise.all([
      checkDatabase(),
      checkExternalServices()
    ])
    
    const allServices = [dbStatus, ...externalServices]
    const uptime = calculateUptime(allServices)
    
    // Determine overall status
    const downServices = allServices.filter(s => s.status === 'down')
    const degradedServices = allServices.filter(s => s.status === 'degraded')
    
    let overall: 'healthy' | 'degraded' | 'down'
    if (downServices.length > 0) {
      overall = 'down'
    } else if (degradedServices.length > 0) {
      overall = 'degraded'
    } else {
      overall = 'healthy'
    }
    
    const uptimeStatus: UptimeStatus = {
      overall,
      services: detailed ? allServices : allServices.map(s => ({
        name: s.name,
        status: s.status,
        lastChecked: s.lastChecked
      })),
      uptime,
      timestamp: new Date().toISOString()
    }
    
    // Set appropriate HTTP status
    const httpStatus = overall === 'down' ? 503 : overall === 'degraded' ? 206 : 200
    
    return NextResponse.json(uptimeStatus, { 
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
  } catch (error) {
    console.error('Uptime check failed:', error)
    
    return NextResponse.json({
      overall: 'down',
      services: [],
      uptime: { percentage: 0, totalDowntime: 0 },
      timestamp: new Date().toISOString(),
      error: 'Health check system failure'
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
}

// POST endpoint to manually trigger health checks or update status
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (body.action === 'force-check') {
      // Force immediate health check
      return GET(request)
    }
    
    if (body.action === 'simulate-downtime') {
      // For testing purposes only (remove in production)
      if (process.env.NODE_ENV !== 'production') {
        return NextResponse.json({
          overall: 'down',
          services: [{
            name: 'Simulated Service',
            status: 'down' as const,
            lastChecked: new Date().toISOString(),
            error: 'Simulated downtime for testing'
          }],
          uptime: { percentage: 95.5, totalDowntime: 3600 },
          timestamp: new Date().toISOString()
        }, { status: 503 })
      }
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
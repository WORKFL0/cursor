'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Database, 
  Globe, 
  MemoryStick, 
  RefreshCw,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react'

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: string
  uptime: number
  version: string
  environment: string
  response_time_ms: number
  checks: {
    database: { status: 'up' | 'down'; latency?: number }
    external_apis: { status: 'up' | 'down'; services: Record<string, boolean> }
    memory: { status: 'up' | 'down'; usage: number; limit: number }
    disk: { status: 'up' | 'down'; usage: number }
  }
}

interface WebVitalStats {
  [key: string]: {
    count: number
    average: number
    median: number
    p75: number
    p90: number
    p95: number
    min: number
    max: number
    ratings: {
      good: number
      'needs-improvement': number
      poor: number
    }
  }
}

export default function MonitoringDashboard() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null)
  const [webVitalStats, setWebVitalStats] = useState<WebVitalStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchHealthStatus = async () => {
    try {
      const response = await fetch('/api/monitoring/health')
      const data = await response.json()
      setHealthStatus(data)
    } catch (error) {
      console.error('Failed to fetch health status:', error)
    }
  }

  const fetchWebVitalStats = async () => {
    try {
      const response = await fetch('/api/monitoring/web-vitals')
      const data = await response.json()
      setWebVitalStats(data.stats)
    } catch (error) {
      console.error('Failed to fetch web vital stats:', error)
    }
  }

  const refreshData = async () => {
    setLoading(true)
    await Promise.all([fetchHealthStatus(), fetchWebVitalStats()])
    setLastUpdated(new Date())
    setLoading(false)
  }

  useEffect(() => {
    refreshData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'up':
        return 'text-green-600 bg-green-100'
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100'
      case 'unhealthy':
      case 'down':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatUptime = (uptime: number) => {
    const seconds = Math.floor(uptime / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  const getWebVitalThreshold = (metric: string, value: number) => {
    const thresholds = {
      CLS: { good: 0.1, poor: 0.25 },
      FID: { good: 100, poor: 300 },
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      TTFB: { good: 800, poor: 1800 }
    }

    const threshold = thresholds[metric as keyof typeof thresholds]
    if (!threshold) return 'needs-improvement'

    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Monitoring Dashboard</h1>
          <p className="text-gray-600">Real-time system health and performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <Button onClick={refreshData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status Alert */}
      {healthStatus && (
        <Alert className={`mb-6 ${
          healthStatus.status === 'healthy' 
            ? 'border-green-200 bg-green-50' 
            : healthStatus.status === 'degraded'
            ? 'border-yellow-200 bg-yellow-50'
            : 'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-center">
            {healthStatus.status === 'healthy' ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <AlertDescription className="ml-2">
              System is currently <strong>{healthStatus.status}</strong>. 
              Response time: {healthStatus.response_time_ms}ms
            </AlertDescription>
          </div>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Status Overview Cards */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <Badge className={getStatusColor(healthStatus?.status || 'unknown')}>
                    {healthStatus?.status || 'Unknown'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {healthStatus ? formatUptime(healthStatus.uptime) : '-'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {healthStatus?.response_time_ms || '-'}ms
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Environment</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">
                  {healthStatus?.environment || '-'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Health Status */}
          {healthStatus && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <Database className="w-4 h-4 mr-2" />
                    Database
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={getStatusColor(healthStatus.checks.database.status)}>
                    {healthStatus.checks.database.status}
                  </Badge>
                  {healthStatus.checks.database.latency && (
                    <p className="text-sm text-gray-500 mt-1">
                      {healthStatus.checks.database.latency}ms latency
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <Globe className="w-4 h-4 mr-2" />
                    External APIs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={getStatusColor(healthStatus.checks.external_apis.status)}>
                    {healthStatus.checks.external_apis.status}
                  </Badge>
                  <div className="mt-2 space-y-1">
                    {Object.entries(healthStatus.checks.external_apis.services).map(([service, status]) => (
                      <div key={service} className="flex justify-between text-sm">
                        <span className="capitalize">{service}</span>
                        <Badge variant="outline" className={status ? 'text-green-600' : 'text-red-600'}>
                          {status ? '✓' : '✗'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <MemoryStick className="w-4 h-4 mr-2" />
                    Memory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={getStatusColor(healthStatus.checks.memory.status)}>
                    {healthStatus.checks.memory.status}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">
                    {healthStatus.checks.memory.usage}MB / {healthStatus.checks.memory.limit}MB
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <Activity className="w-4 h-4 mr-2" />
                    Disk Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={getStatusColor(healthStatus.checks.disk.status)}>
                    {healthStatus.checks.disk.status}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">
                    {healthStatus.checks.disk.usage}% used
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="health">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health Details</CardTitle>
                <CardDescription>
                  Detailed health check information and system diagnostics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {healthStatus ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">System Information</h4>
                        <dl className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <dt>Version:</dt>
                            <dd>{healthStatus.version}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt>Environment:</dt>
                            <dd className="capitalize">{healthStatus.environment}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt>Last Check:</dt>
                            <dd>{new Date(healthStatus.timestamp).toLocaleString()}</dd>
                          </div>
                        </dl>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Performance Metrics</h4>
                        <dl className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <dt>Response Time:</dt>
                            <dd>{healthStatus.response_time_ms}ms</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt>Uptime:</dt>
                            <dd>{formatUptime(healthStatus.uptime)}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>Loading health status...</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Web Vitals Performance
                </CardTitle>
                <CardDescription>
                  Core Web Vitals metrics collected from real user experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                {webVitalStats ? (
                  <div className="grid gap-6">
                    {Object.entries(webVitalStats).map(([metric, stats]) => (
                      <div key={metric} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-lg">{metric}</h4>
                          <Badge className={getStatusColor(getWebVitalThreshold(metric, stats.median))}>
                            {getWebVitalThreshold(metric, stats.median)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Median</p>
                            <p className="text-xl font-bold">
                              {metric === 'CLS' ? stats.median.toFixed(3) : Math.round(stats.median)}
                              {metric !== 'CLS' && 'ms'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">75th percentile</p>
                            <p className="text-xl font-bold">
                              {metric === 'CLS' ? stats.p75.toFixed(3) : Math.round(stats.p75)}
                              {metric !== 'CLS' && 'ms'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">95th percentile</p>
                            <p className="text-xl font-bold">
                              {metric === 'CLS' ? stats.p95.toFixed(3) : Math.round(stats.p95)}
                              {metric !== 'CLS' && 'ms'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Samples</p>
                            <p className="text-xl font-bold">{stats.count}</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Badge className="bg-green-100 text-green-800">
                            Good: {stats.ratings.good}
                          </Badge>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Needs Improvement: {stats.ratings['needs-improvement']}
                          </Badge>
                          <Badge className="bg-red-100 text-red-800">
                            Poor: {stats.ratings.poor}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No Web Vitals data available yet. Visit the site to start collecting metrics.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Analytics & Tracking
                </CardTitle>
                <CardDescription>
                  Analytics services status and configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {[
                    { name: 'Google Analytics 4', enabled: process.env.NEXT_PUBLIC_ENABLE_GA4 === 'true', id: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID },
                    { name: 'Microsoft Clarity', enabled: process.env.NEXT_PUBLIC_ENABLE_CLARITY === 'true', id: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID },
                    { name: 'Hotjar', enabled: process.env.NEXT_PUBLIC_ENABLE_HOTJAR === 'true', id: process.env.NEXT_PUBLIC_HOTJAR_SITE_ID },
                    { name: 'Facebook Pixel', enabled: process.env.NEXT_PUBLIC_ENABLE_FACEBOOK === 'true', id: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID },
                    { name: 'LinkedIn Insight', enabled: process.env.NEXT_PUBLIC_ENABLE_LINKEDIN === 'true', id: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID },
                  ].map(service => (
                    <div key={service.name} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        {service.id && (
                          <p className="text-sm text-gray-500">ID: {service.id}</p>
                        )}
                      </div>
                      <Badge className={service.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {service.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
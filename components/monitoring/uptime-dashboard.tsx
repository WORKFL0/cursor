'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Clock, 
  Activity,
  Database,
  Mail,
  ExternalLink,
  TrendingUp
} from 'lucide-react'

interface ServiceStatus {
  name: string
  status: 'up' | 'down' | 'degraded'
  responseTime?: number
  lastChecked: string
  error?: string
}

interface UptimeData {
  overall: 'healthy' | 'degraded' | 'down'
  services: ServiceStatus[]
  uptime: {
    percentage: number
    lastDowntime?: string
    totalDowntime: number
  }
  timestamp: string
  error?: string
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'up':
    case 'healthy':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'degraded':
      return <AlertTriangle className="h-5 w-5 text-workflo-yellow" />
    case 'down':
    default:
      return <XCircle className="h-5 w-5 text-red-500" />
  }
}

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, any> = {
    up: { variant: 'default', className: 'bg-green-100 text-green-800 hover:bg-green-200' },
    healthy: { variant: 'default', className: 'bg-green-100 text-green-800 hover:bg-green-200' },
    degraded: { variant: 'secondary', className: 'bg-workflo-yellow/20 text-foreground font-medium hover:bg-workflo-yellow/30' },
    down: { variant: 'destructive' }
  }

  const config = variants[status] || variants.down

  return (
    <Badge {...config}>
      {status === 'up' || status === 'healthy' ? 'Online' : 
       status === 'degraded' ? 'Degraded' : 'Offline'}
    </Badge>
  )
}

export function UptimeDashboard() {
  const [uptimeData, setUptimeData] = useState<UptimeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchUptimeData = async (detailed: boolean = true) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/uptime?detailed=${detailed}`)
      const data = await response.json()
      setUptimeData(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch uptime data:', error)
      setUptimeData({
        overall: 'down',
        services: [],
        uptime: { percentage: 0, totalDowntime: 0 },
        timestamp: new Date().toISOString(),
        error: 'Failed to load system status'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUptimeData()

    // Auto-refresh every 30 seconds if enabled
    const interval = setInterval(() => {
      if (autoRefresh) {
        fetchUptimeData()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  const formatUptime = (percentage: number) => {
    return percentage.toFixed(2) + '%'
  }

  const formatResponseTime = (ms?: number) => {
    if (!ms) return 'N/A'
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const formatLastChecked = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)

    if (diffSeconds < 60) return `${diffSeconds}s ago`
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
    return date.toLocaleTimeString()
  }

  const getServiceIcon = (serviceName: string) => {
    if (serviceName.toLowerCase().includes('database')) return <Database className="h-4 w-4" />
    if (serviceName.toLowerCase().includes('email')) return <Mail className="h-4 w-4" />
    if (serviceName.toLowerCase().includes('hubspot')) return <ExternalLink className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Status</h2>
          <p className="text-muted-foreground">
            Real-time monitoring of Workflo services and infrastructure
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
          >
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchUptimeData()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon status={uptimeData?.overall || 'down'} />
                System Status
              </CardTitle>
              <CardDescription>
                {lastUpdated && `Last updated: ${lastUpdated.toLocaleString()}`}
              </CardDescription>
            </div>
            <StatusBadge status={uptimeData?.overall || 'down'} />
          </div>
        </CardHeader>
        
        {uptimeData?.error && (
          <CardContent>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{uptimeData.error}</AlertDescription>
            </Alert>
          </CardContent>
        )}
      </Card>

      {/* Uptime Statistics */}
      {uptimeData && !uptimeData.error && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Uptime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatUptime(uptimeData.uptime.percentage)}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                Rolling 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Downtime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.floor(uptimeData.uptime.totalDowntime / 60)}m
              </div>
              <p className="text-xs text-muted-foreground">
                <Clock className="h-3 w-3 inline mr-1" />
                Past 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Services Online</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {uptimeData.services.filter(s => s.status === 'up').length}/{uptimeData.services.length}
              </div>
              <p className="text-xs text-muted-foreground">
                <Activity className="h-3 w-3 inline mr-1" />
                All critical systems
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Service Status Details */}
      {uptimeData && uptimeData.services.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription>
              Current status of all monitored services and their response times
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {uptimeData.services.map((service, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getServiceIcon(service.name)}
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Last checked: {formatLastChecked(service.lastChecked)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {service.responseTime && (
                      <div className="text-sm text-muted-foreground">
                        {formatResponseTime(service.responseTime)}
                      </div>
                    )}
                    <StatusBadge status={service.status} />
                    <StatusIcon status={service.status} />
                  </div>
                </div>
                
                {service.error && (
                  <Alert className="mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Error:</strong> {service.error}
                    </AlertDescription>
                  </Alert>
                )}
                
                {index < uptimeData.services.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Incident History (Placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
          <CardDescription>
            Recent system outages and maintenance activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uptimeData?.uptime.lastDowntime ? (
            <div className="flex items-center justify-between p-3 bg-workflo-yellow/10 border border-workflo-yellow/30 rounded-md">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-workflo-yellow" />
                <div>
                  <div className="text-sm font-medium">Service Degradation</div>
                  <div className="text-xs text-muted-foreground">
                    Last occurred: {new Date(uptimeData.uptime.lastDowntime).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <Badge variant="outline">Resolved</Badge>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div>No recent incidents</div>
              <div className="text-sm">All systems have been running smoothly</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default UptimeDashboard
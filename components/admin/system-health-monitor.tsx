'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, AlertTriangle, RefreshCw, Server, Mail, Activity, Database, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

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

const serviceIcons: Record<string, React.ReactNode> = {
  api: <Server className="w-4 h-4" />,
  database: <Database className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  hubspot: <Activity className="w-4 h-4" />,
  analytics: <BarChart3 className="w-4 h-4" />,
}

const statusConfig = {
  healthy: {
    icon: CheckCircle,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950',
    border: 'border-green-200 dark:border-green-800',
    badgeVariant: 'default' as const,
  },
  degraded: {
    icon: AlertTriangle,
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    border: 'border-yellow-200 dark:border-yellow-800',
    badgeVariant: 'secondary' as const,
  },
  unhealthy: {
    icon: AlertCircle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950',
    border: 'border-red-200 dark:border-red-800',
    badgeVariant: 'destructive' as const,
  },
}

export function SystemHealthMonitor() {
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchHealth = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/system/health')
      const data = await response.json()

      setHealth(data)
      setLastChecked(new Date())
    } catch (err: any) {
      setError(err.message || 'Failed to fetch system health')
      console.error('Health check failed:', err)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchHealth()
  }, [])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchHealth()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh])

  if (loading && !health) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Loading system status...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !health) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Unable to fetch system status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-900 dark:text-red-100">{error || 'System unreachable'}</p>
          </div>
          <Button onClick={fetchHealth} className="mt-4" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const overallConfig = statusConfig[health.overall]
  const OverallIcon = overallConfig.icon

  return (
    <Card className={cn('border-2', overallConfig.border)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <OverallIcon className={cn('w-5 h-5', overallConfig.color)} />
              System Health
            </CardTitle>
            <CardDescription>
              {lastChecked && (
                <>
                  Last checked: {lastChecked.toLocaleTimeString()} • Response time: {health.responseTime}ms
                </>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={overallConfig.badgeVariant} className="uppercase">
              {health.overall}
            </Badge>
            <Button
              onClick={fetchHealth}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Overall Status Message */}
        {health.overall !== 'healthy' && (
          <div className={cn('p-4 rounded-lg border', overallConfig.bg, overallConfig.border)}>
            <div className="flex items-start gap-3">
              <OverallIcon className={cn('w-5 h-5 mt-0.5', overallConfig.color)} />
              <div>
                <h4 className="font-medium text-sm mb-1">
                  {health.overall === 'degraded'
                    ? 'System is currently degraded'
                    : 'System is currently unhealthy'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {health.overall === 'degraded'
                    ? `Some services are experiencing issues. Response time: ${health.responseTime}ms`
                    : `Critical services are down. Response time: ${health.responseTime}ms`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Services Status */}
        <div className="grid gap-2">
          {health.services.map((service) => {
            const config = statusConfig[service.status]
            const Icon = config.icon

            return (
              <div
                key={service.name}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border',
                  service.status === 'healthy' ? 'bg-background' : config.bg,
                  service.status === 'healthy' ? 'border-border' : config.border
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-md', config.bg)}>
                    {serviceIcons[service.name] || <Server className="w-4 h-4" />}
                  </div>
                  <div>
                    <h5 className="font-medium text-sm capitalize">{service.name}</h5>
                    <p className="text-xs text-muted-foreground">{service.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {service.responseTime !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {service.responseTime}ms
                    </span>
                  )}
                  <Icon className={cn('w-4 h-4', config.color)} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Email Queue Details */}
        {health.services.find(s => s.name === 'email')?.details && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <h5 className="font-medium text-sm mb-2">Email Queue Status</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {Object.entries(health.services.find(s => s.name === 'email')!.details!).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground capitalize">{key}:</span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Errors */}
        {health.errors && health.errors.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <h5 className="font-medium text-sm text-red-900 dark:text-red-100 mb-2">Errors</h5>
            <ul className="list-disc list-inside text-xs text-red-800 dark:text-red-200 space-y-1">
              {health.errors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Auto-refresh toggle */}
        <div className="flex items-center justify-between pt-3 border-t">
          <span className="text-xs text-muted-foreground">Auto-refresh every 30s</span>
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

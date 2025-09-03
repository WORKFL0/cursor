'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// import { Progress } from '@/components/ui/progress' // Component doesn't exist
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  Activity, 
  Clock, 
  Zap, 
  Target, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'
import { PerformanceMonitor, usePerformanceMonitoring } from '@/lib/utils/performance-monitor'

interface PerformanceMetrics {
  lcp?: number
  fid?: number
  cls?: number
  fcp?: number
  ttfb?: number
  inp?: number
}

interface PerformanceScore {
  score: number
  grade: string
  details: {
    [key: string]: {
      value: number
      threshold: number
      weight: number
    }
  }
}

export function PerformanceMonitorComponent() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})
  const [score, setScore] = useState<PerformanceScore | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    if (typeof window === 'undefined') return

    const monitor = PerformanceMonitor.getInstance()
    monitor.init()
    monitor.trackPageLoad()

    // Update metrics every 2 seconds
    const interval = setInterval(() => {
      const currentScore = monitor.getPerformanceScore()
      setScore(currentScore)
      
      // Get current metrics from the monitor
      const currentMetrics: PerformanceMetrics = {}
      if ((monitor as any).metrics) {
        currentMetrics.lcp = (monitor as any).metrics.get('lcp')
        currentMetrics.fid = (monitor as any).metrics.get('fid') 
        currentMetrics.cls = (monitor as any).metrics.get('cls')
        currentMetrics.fcp = (monitor as any).metrics.get('fcp')
        currentMetrics.ttfb = (monitor as any).metrics.get('ttfb')
        currentMetrics.inp = (monitor as any).metrics.get('inp')
      }
      setMetrics(currentMetrics)
    }, 2000)

    return () => {
      clearInterval(interval)
      monitor.disconnect()
    }
  }, [])

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Monitor
          </CardTitle>
          <CardDescription>Loading performance metrics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-workflo-yellow'
    return 'text-red-600'
  }

  const getGradeBadgeColor = (grade: string) => {
    const colors = {
      A: 'bg-green-100 text-green-800 hover:bg-green-200',
      B: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      C: 'bg-workflo-yellow/20 text-foreground font-medium hover:bg-workflo-yellow/30',
      D: 'bg-workflo-yellow/20 text-foreground font-medium hover:bg-workflo-yellow/30',
      F: 'bg-red-100 text-red-800 hover:bg-red-200'
    }
    return colors[grade as keyof typeof colors] || colors.F
  }

  const getMetricStatus = (value: number, threshold: number) => {
    if (value <= threshold) return { icon: CheckCircle, color: 'text-green-500', status: 'Good' }
    if (value <= threshold * 1.5) return { icon: AlertTriangle, color: 'text-workflo-yellow', status: 'Needs Improvement' }
    return { icon: AlertTriangle, color: 'text-red-500', status: 'Poor' }
  }

  const coreWebVitals = [
    {
      name: 'Largest Contentful Paint',
      key: 'lcp',
      description: 'Loading performance',
      threshold: 2500,
      unit: 'ms',
      icon: Clock,
      target: '< 2.5s'
    },
    {
      name: 'First Input Delay',
      key: 'fid', 
      description: 'Interactivity',
      threshold: 100,
      unit: 'ms',
      icon: Zap,
      target: '< 100ms'
    },
    {
      name: 'Cumulative Layout Shift',
      key: 'cls',
      description: 'Visual stability',
      threshold: 0.1,
      unit: '',
      icon: Target,
      target: '< 0.1'
    }
  ]

  const additionalMetrics = [
    {
      name: 'First Contentful Paint',
      key: 'fcp',
      description: 'Loading',
      threshold: 1800,
      unit: 'ms',
      target: '< 1.8s'
    },
    {
      name: 'Time to First Byte',
      key: 'ttfb',
      description: 'Server response',
      threshold: 800,
      unit: 'ms',
      target: '< 800ms'
    },
    {
      name: 'Interaction to Next Paint',
      key: 'inp',
      description: 'Responsiveness',
      threshold: 200,
      unit: 'ms',
      target: '< 200ms'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Overall Performance Score */}
      {score && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Performance Score
                </CardTitle>
                <CardDescription>
                  Based on Core Web Vitals and page performance metrics
                </CardDescription>
              </div>
              <Badge className={getGradeBadgeColor(score.grade)}>
                Grade {score.grade}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`text-3xl font-bold ${getScoreColor(score.score)}`}>
                  {score.score}/100
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300" 
                      style={{ width: `${score.score}%` }}
                    />
                  </div>
                </div>
              </div>

              {score.score < 80 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Performance could be improved. Focus on optimizing the metrics below.
                  </AlertDescription>
                </Alert>
              )}

              {score.score >= 90 && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Excellent performance! Your site loads fast and provides a great user experience.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Core Web Vitals */}
      <Card>
        <CardHeader>
          <CardTitle>Core Web Vitals</CardTitle>
          <CardDescription>
            Google's key metrics for page experience and SEO ranking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {coreWebVitals.map((vital, index) => {
            const value = metrics[vital.key as keyof PerformanceMetrics]
            const status = value ? getMetricStatus(value, vital.threshold) : null
            const Icon = vital.icon

            return (
              <div key={vital.key}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{vital.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {vital.description} • Target: {vital.target}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {value !== undefined ? (
                      <>
                        <div className="text-right">
                          <div className="font-mono text-sm">
                            {vital.key === 'cls' ? value.toFixed(3) : Math.round(value)}{vital.unit}
                          </div>
                          {status && (
                            <div className={`text-xs ${status.color}`}>
                              {status.status}
                            </div>
                          )}
                        </div>
                        {status && <status.icon className={`h-4 w-4 ${status.color}`} />}
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">Measuring...</div>
                    )}
                  </div>
                </div>

                {index < coreWebVitals.length - 1 && <Separator />}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Performance Metrics</CardTitle>
          <CardDescription>
            Supporting metrics for comprehensive performance analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {additionalMetrics.map((metric, index) => {
            const value = metrics[metric.key as keyof PerformanceMetrics]
            const status = value ? getMetricStatus(value, metric.threshold) : null

            return (
              <div key={metric.key}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{metric.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {metric.description} • Target: {metric.target}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {value !== undefined ? (
                      <>
                        <div className="text-right">
                          <div className="font-mono text-sm">
                            {Math.round(value)}{metric.unit}
                          </div>
                          {status && (
                            <div className={`text-xs ${status.color}`}>
                              {status.status}
                            </div>
                          )}
                        </div>
                        {status && <status.icon className={`h-4 w-4 ${status.color}`} />}
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">Measuring...</div>
                    )}
                  </div>
                </div>

                {index < additionalMetrics.length - 1 && <Separator />}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Performance Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Performance Tips
          </CardTitle>
          <CardDescription>
            Recommendations to improve your Core Web Vitals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>• <strong>Images:</strong> Use Next.js Image component with proper sizing and lazy loading</div>
            <div>• <strong>JavaScript:</strong> Minimize unused JavaScript and implement code splitting</div>
            <div>• <strong>CSS:</strong> Remove unused CSS and inline critical styles</div>
            <div>• <strong>Fonts:</strong> Use font-display: swap and preload critical fonts</div>
            <div>• <strong>Server:</strong> Optimize server response times and use CDN</div>
            <div>• <strong>Layout:</strong> Set dimensions for images and embeds to prevent layout shifts</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PerformanceMonitorComponent
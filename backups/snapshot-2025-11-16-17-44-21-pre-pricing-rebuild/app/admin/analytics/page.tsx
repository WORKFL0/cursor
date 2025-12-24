'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Users, 
  Globe,
  Clock,
  BarChart3,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalViews: number
    uniqueVisitors: number
    pageViews: number
    averageSessionDuration: number
    bounceRate: number
    viewsChange: number
    visitorsChange: number
  }
  topPages: Array<{
    path: string
    views: number
    uniqueViews: number
    averageTimeOnPage: number
  }>
  topArticles: Array<{
    id: string
    title: string
    slug: string
    views: number
    uniqueViews: number
    publishedAt: string
  }>
  traffic: Array<{
    date: string
    views: number
    visitors: number
  }>
  sources: Array<{
    source: string
    visitors: number
    percentage: number
  }>
  devices: Array<{
    device: string
    visitors: number
    percentage: number
  }>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [dateRange, setDateRange] = useState('7d')

  // Mock analytics data for demonstration
  const mockAnalytics: AnalyticsData = {
    overview: {
      totalViews: 15420,
      uniqueVisitors: 8950,
      pageViews: 23100,
      averageSessionDuration: 145,
      bounceRate: 42.3,
      viewsChange: 12.5,
      visitorsChange: 8.2
    },
    topPages: [
      { path: '/', views: 3240, uniqueViews: 2890, averageTimeOnPage: 180 },
      { path: '/nieuws', views: 2100, uniqueViews: 1850, averageTimeOnPage: 210 },
      { path: '/diensten', views: 1850, uniqueViews: 1650, averageTimeOnPage: 165 },
      { path: '/contact', views: 980, uniqueViews: 890, averageTimeOnPage: 95 },
      { path: '/over-ons', views: 750, uniqueViews: 680, averageTimeOnPage: 140 }
    ],
    topArticles: [
      {
        id: '1',
        title: 'De toekomst van IT-beheer: Trends voor 2024',
        slug: 'toekomst-it-beheer-2024',
        views: 1250,
        uniqueViews: 1180,
        publishedAt: '2024-01-15T09:00:00Z'
      },
      {
        id: '2', 
        title: 'Cybersecurity best practices voor kleine bedrijven',
        slug: 'cybersecurity-kleine-bedrijven',
        views: 980,
        uniqueViews: 920,
        publishedAt: '2024-01-12T14:30:00Z'
      },
      {
        id: '3',
        title: 'Cloud migratie: Een stap-voor-stap handleiding',
        slug: 'cloud-migratie-handleiding',
        views: 750,
        uniqueViews: 720,
        publishedAt: '2024-01-10T11:15:00Z'
      }
    ],
    traffic: [
      { date: '2024-01-01', views: 1200, visitors: 890 },
      { date: '2024-01-02', views: 1350, visitors: 950 },
      { date: '2024-01-03', views: 1100, visitors: 820 },
      { date: '2024-01-04', views: 1450, visitors: 1020 },
      { date: '2024-01-05', views: 1650, visitors: 1180 },
      { date: '2024-01-06', views: 1400, visitors: 980 },
      { date: '2024-01-07', views: 1550, visitors: 1100 }
    ],
    sources: [
      { source: 'Direct', visitors: 3580, percentage: 40.0 },
      { source: 'Google Search', visitors: 2685, percentage: 30.0 },
      { source: 'LinkedIn', visitors: 1343, percentage: 15.0 },
      { source: 'Email', visitors: 895, percentage: 10.0 },
      { source: 'Other', visitors: 447, percentage: 5.0 }
    ],
    devices: [
      { device: 'Desktop', visitors: 5370, percentage: 60.0 },
      { device: 'Mobile', visitors: 2685, percentage: 30.0 },
      { device: 'Tablet', visitors: 895, percentage: 10.0 }
    ]
  }

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true)
      try {
        // For demo purposes, we'll use mock data
        // In real implementation:
        // const token = localStorage.getItem('admin_token')
        // const response = await fetch(`/api/v1/analytics?range=${dateRange}`, { headers: { 'Authorization': `Bearer ${token}` } })
        
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
        setAnalytics(mockAnalytics)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
        setError('Failed to load analytics data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [dateRange])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">{error}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Website traffic and performance insights
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm" disabled>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{analytics?.overview.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              {analytics?.overview.viewsChange && analytics.overview.viewsChange > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600">+{analytics.overview.viewsChange}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  <span className="text-red-600">{analytics?.overview.viewsChange}%</span>
                </>
              )}
              <span className="text-muted-foreground ml-1">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unique Visitors</p>
                <p className="text-2xl font-bold">{analytics?.overview.uniqueVisitors.toLocaleString()}</p>
              </div>
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+{analytics?.overview.visitorsChange}%</span>
              <span className="text-muted-foreground ml-1">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Page Views</p>
                <p className="text-2xl font-bold">{analytics?.overview.pageViews.toLocaleString()}</p>
              </div>
              <Globe className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Avg {((analytics?.overview.pageViews || 0) / (analytics?.overview.uniqueVisitors || 1)).toFixed(1)} per visitor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Session</p>
                <p className="text-2xl font-bold">
                  {formatDuration(analytics?.overview.averageSessionDuration || 0)}
                </p>
              </div>
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Time on site
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
                <p className="text-2xl font-bold">{analytics?.overview.bounceRate}%</p>
              </div>
              <BarChart3 className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Single page visits
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages on your site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.topPages.map((page, index) => (
                <div key={page.path} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{page.path}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDuration(page.averageTimeOnPage)} avg time
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{page.views.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {page.uniqueViews.toLocaleString()} unique
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.sources.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="font-medium">{source.source}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{source.visitors.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{source.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Top Articles</CardTitle>
          <CardDescription>Most popular blog posts and articles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Unique Views</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics?.topArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{article.title}</p>
                      <p className="text-sm text-muted-foreground">/nieuws/{article.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>{article.views.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{article.uniqueViews.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/nieuws/${article.slug}`} target="_blank">
                        View
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Device Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Device Breakdown</CardTitle>
          <CardDescription>Visitor device preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6 text-center">
            {analytics?.devices.map((device) => (
              <div key={device.device}>
                <p className="text-2xl font-bold">{device.percentage}%</p>
                <p className="text-sm text-muted-foreground">{device.device}</p>
                <p className="text-xs text-muted-foreground">
                  {device.visitors.toLocaleString()} visitors
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
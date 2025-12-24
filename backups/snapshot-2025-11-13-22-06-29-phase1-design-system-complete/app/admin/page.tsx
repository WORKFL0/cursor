'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Image, 
  Users, 
  Eye, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  articles: {
    total: number
    published: number
    draft: number
    featured: number
  }
  analytics: {
    totalViews: number
    monthlyViews: number
    viewsChange: number
    topArticles: Array<{
      id: string
      title: string
      views: number
    }>
  }
  media: {
    totalFiles: number
    totalSize: string
  }
  emails: {
    total: number
    pending: number
    sent: number
    failed: number
  }
  contacts: {
    total: number
    unread: number
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('admin_token')
        
        // Fetch articles stats
        const [articlesRes, analyticsRes, mediaRes, emailsRes, contactsRes] = await Promise.all([
          fetch('/api/v1/articles?limit=100', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/v1/analytics', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/v1/media', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/v1/emails', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/contact', {
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch(() => ({ json: () => ({ success: false }) })) // Fallback if contact API doesn't exist
        ])

        const [articlesData, analyticsData, mediaData, emailsData, contactsData] = await Promise.all([
          articlesRes.json(),
          analyticsRes.json(),
          mediaRes.json(),
          emailsRes.json(),
          contactsRes.json()
        ])

        // Process articles stats
        const articles = articlesData.success ? articlesData.data.data : []
        const articleStats = {
          total: articles.length,
          published: articles.filter((a: any) => a.published).length,
          draft: articles.filter((a: any) => !a.published).length,
          featured: articles.filter((a: any) => a.featured).length,
        }

        // Process analytics stats
        const analyticsStats = analyticsData.success ? {
          totalViews: analyticsData.data.totalViews || 0,
          monthlyViews: analyticsData.data.monthlyViews || 0,
          viewsChange: analyticsData.data.viewsChange || 0,
          topArticles: analyticsData.data.topArticles || []
        } : {
          totalViews: 0,
          monthlyViews: 0,
          viewsChange: 0,
          topArticles: []
        }

        // Process media stats
        const mediaStats = mediaData.success ? {
          totalFiles: mediaData.data.files?.length || 0,
          totalSize: mediaData.data.totalSize || '0 MB'
        } : {
          totalFiles: 0,
          totalSize: '0 MB'
        }

        // Process email stats
        const emails = emailsData.success ? emailsData.data : []
        const emailStats = {
          total: emails.length,
          pending: emails.filter((e: any) => e.status === 'pending').length,
          sent: emails.filter((e: any) => e.status === 'sent').length,
          failed: emails.filter((e: any) => e.status === 'failed').length,
        }

        // Process contact stats
        const contacts = contactsData.success ? contactsData.data : []
        const contactStats = {
          total: contacts.length,
          unread: contacts.filter((c: any) => !c.read).length,
        }

        setStats({
          articles: articleStats,
          analytics: analyticsStats,
          media: mediaStats,
          emails: emailStats,
          contacts: contactStats
        })

      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
        setError('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.articles.total}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>{stats?.articles.published} published</span>
              <Clock className="h-3 w-3 text-orange-500" />
              <span>{stats?.articles.draft} drafts</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.analytics.totalViews.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs">
              {stats?.analytics.viewsChange && stats.analytics.viewsChange > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={stats?.analytics.viewsChange && stats.analytics.viewsChange > 0 ? 'text-green-600' : 'text-red-600'}>
                {stats?.analytics.viewsChange}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Media Files</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.media.totalFiles}</div>
            <p className="text-xs text-muted-foreground">
              Total size: {stats?.media.totalSize}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Queue</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.emails.total}</div>
            <div className="flex items-center space-x-2 text-xs">
              {stats?.emails?.pending && stats.emails.pending > 0 && (
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  {stats.emails.pending} pending
                </Badge>
              )}
              {stats?.emails?.failed && stats.emails.failed > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {stats.emails.failed} failed
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Articles</CardTitle>
              <CardDescription>Latest published content</CardDescription>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/articles">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.articles.total === 0 ? (
                <p className="text-sm text-muted-foreground">No articles yet</p>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Featured Articles</p>
                      <p className="text-xs text-muted-foreground">{stats?.articles.featured} articles</p>
                    </div>
                    <Badge>{stats?.articles.featured}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Draft Articles</p>
                      <p className="text-xs text-muted-foreground">Pending publication</p>
                    </div>
                    <Badge variant="outline">{stats?.articles.draft}</Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button asChild>
                <Link href="/admin/articles/new" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>New Article</span>
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/media" className="flex items-center space-x-2">
                  <Image className="h-4 w-4" />
                  <span>Media Library</span>
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/analytics" className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Analytics</span>
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/contact" className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Contact Forms</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Overview of system health and activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats?.emails.sent}</div>
              <p className="text-sm text-muted-foreground">Emails Sent</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats?.emails.pending}</div>
              <p className="text-sm text-muted-foreground">Emails Pending</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats?.contacts.unread}</div>
              <p className="text-sm text-muted-foreground">Unread Messages</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
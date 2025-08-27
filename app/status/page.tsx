import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo/metadata'
import UptimeDashboard from '@/components/monitoring/uptime-dashboard'

export const metadata: Metadata = generatePageMetadata(
  'System Status Dashboard',
  'Real-time monitoring of Workflo IT services, server uptime, and system health. Check current service availability and performance metrics.',
  '/status',
  ['system status', 'uptime monitoring', 'server monitoring', 'IT infrastructure', 'service health']
)

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <UptimeDashboard />
      </div>
    </div>
  )
}

// Add revalidation to keep the page fresh
export const revalidate = 30
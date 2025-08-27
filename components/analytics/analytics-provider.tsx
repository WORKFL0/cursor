'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { analytics } from '@/lib/analytics'

/**
 * Analytics Tracker Component
 * Tracks page views when route changes
 */
function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize analytics on mount
    analytics.initialize()
  }, [])

  useEffect(() => {
    // Track page views on route change
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    analytics.pageView(url)
  }, [pathname, searchParams])

  return null
}

/**
 * Analytics Provider Component
 * Wraps the tracker in Suspense boundary
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {children}
    </>
  )
}
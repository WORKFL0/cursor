'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { analytics } from '@/lib/analytics'
import { GoogleAnalytics } from './google-analytics'
import { MicrosoftClarity } from './microsoft-clarity'
import Hotjar from './hotjar'

/**
 * Analytics Tracker Component
 * Tracks page views when route changes and handles scroll/time tracking
 */
function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize analytics on mount
    analytics.initialize()

    // Set up scroll tracking
    let scrollTracked: number[] = []
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      )
      
      const milestones = [25, 50, 75, 90, 100]
      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && !scrollTracked.includes(milestone)) {
          scrollTracked.push(milestone)
          analytics.trackScrollDepth(milestone)
        }
      })
    }

    // Set up time on page tracking
    let timeOnPage = 0
    let timeTracked: number[] = []
    const timeIntervals = [30, 60, 120, 300, 600] // 30s, 1m, 2m, 5m, 10m
    
    const timeTracker = setInterval(() => {
      timeOnPage += 10
      
      timeIntervals.forEach(interval => {
        if (timeOnPage >= interval && !timeTracked.includes(interval)) {
          timeTracked.push(interval)
          analytics.trackTimeOnPage(interval)
        }
      })
    }, 10000) // Check every 10 seconds

    // Set up error tracking
    const handleError = (event: ErrorEvent) => {
      const errorContext = `${event.filename}:${event.lineno}:${event.colno}`
      analytics.trackError(new Error(event.message), errorContext)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      analytics.trackError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        'unhandled_promise_rejection'
      )
    }

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      clearInterval(timeTracker)
    }
  }, [])

  useEffect(() => {
    // Track page views on route change
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    analytics.pageView(url, document.title)
  }, [pathname, searchParams])

  return null
}

/**
 * Analytics Provider Component
 * Wraps all analytics services and tracking
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Third-party analytics scripts */}
      <GoogleAnalytics />
      <MicrosoftClarity />
      <Hotjar />

      {/* Custom analytics tracker */}
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>

      {children}
    </>
  )
}
'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Page View Tracker
 * Tracks page views and engagement metrics
 * Privacy-friendly: No personal data stored
 */
export function PageViewTracker() {
  const pathname = usePathname()
  const startTimeRef = useRef<number>(Date.now())
  const maxScrollRef = useRef<number>(0)
  const hasTrackedRef = useRef<boolean>(false)

  useEffect(() => {
    // Reset on page change
    startTimeRef.current = Date.now()
    maxScrollRef.current = 0
    hasTrackedRef.current = false

    // Generate visitor & session IDs (stored in sessionStorage)
    const visitorId = getOrCreateVisitorId()
    const sessionId = getOrCreateSessionId()

    // Track page view
    trackPageView(pathname, visitorId, sessionId)

    // Track scroll depth
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      maxScrollRef.current = Math.max(maxScrollRef.current, scrollPercent)
    }

    // Track time on page before leaving
    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000)
      trackEngagement(pathname, visitorId, sessionId, timeOnPage, maxScrollRef.current)
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('beforeunload', handleBeforeUnload)

      // Track on unmount (route change)
      if (!hasTrackedRef.current) {
        const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000)
        trackEngagement(pathname, visitorId, sessionId, timeOnPage, maxScrollRef.current)
        hasTrackedRef.current = true
      }
    }
  }, [pathname])

  return null
}

// ===== HELPER FUNCTIONS =====

function getOrCreateVisitorId(): string {
  let visitorId = localStorage.getItem('visitor_id')
  if (!visitorId) {
    visitorId = `v_${generateId()}`
    localStorage.setItem('visitor_id', visitorId)
  }
  return visitorId
}

function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem('session_id')
  if (!sessionId) {
    sessionId = `s_${generateId()}`
    sessionStorage.setItem('session_id', sessionId)
  }
  return sessionId
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}

async function trackPageView(
  pathname: string,
  visitorId: string,
  sessionId: string
) {
  try {
    // Get referrer and UTM params
    const referrer = document.referrer || null
    const urlParams = new URLSearchParams(window.location.search)
    const utmSource = urlParams.get('utm_source')
    const utmMedium = urlParams.get('utm_medium')
    const utmCampaign = urlParams.get('utm_campaign')

    // Detect device type
    const deviceType = detectDeviceType()
    const browser = detectBrowser()
    const os = detectOS()

    // Send to API
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_path: pathname,
        page_title: document.title,
        visitor_id: visitorId,
        session_id: sessionId,
        referrer,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        device_type: deviceType,
        browser,
        os,
      }),
    })
  } catch (error) {
    console.error('Failed to track page view:', error)
  }
}

async function trackEngagement(
  pathname: string,
  visitorId: string,
  sessionId: string,
  timeOnPage: number,
  scrollDepth: number
) {
  try {
    // Only track if user spent more than 3 seconds
    if (timeOnPage < 3) return

    await fetch('/api/analytics/engagement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_path: pathname,
        visitor_id: visitorId,
        session_id: sessionId,
        time_on_page: timeOnPage,
        scroll_depth: Math.min(scrollDepth, 100),
      }),
    })
  } catch (error) {
    console.error('Failed to track engagement:', error)
  }
}

// ===== DEVICE DETECTION =====

function detectDeviceType(): string {
  const userAgent = navigator.userAgent.toLowerCase()
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    return 'tablet'
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    return 'mobile'
  }
  return 'desktop'
}

function detectBrowser(): string {
  const userAgent = navigator.userAgent.toLowerCase()
  if (userAgent.includes('chrome')) return 'Chrome'
  if (userAgent.includes('safari')) return 'Safari'
  if (userAgent.includes('firefox')) return 'Firefox'
  if (userAgent.includes('edge')) return 'Edge'
  if (userAgent.includes('opera')) return 'Opera'
  return 'Other'
}

function detectOS(): string {
  const userAgent = navigator.userAgent
  if (/Windows/i.test(userAgent)) return 'Windows'
  if (/Mac/i.test(userAgent)) return 'macOS'
  if (/Linux/i.test(userAgent)) return 'Linux'
  if (/Android/i.test(userAgent)) return 'Android'
  if (/iOS|iPhone|iPad|iPod/i.test(userAgent)) return 'iOS'
  return 'Other'
}

// ===== PUBLIC API FOR MANUAL TRACKING =====

export const Analytics = {
  /**
   * Track custom event (conversion, interaction, etc.)
   */
  trackEvent: async (eventType: string, eventLabel?: string, metadata?: any) => {
    try {
      const visitorId = getOrCreateVisitorId()
      const sessionId = getOrCreateSessionId()

      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: eventType,
          event_label: eventLabel,
          visitor_id: visitorId,
          session_id: sessionId,
          page_path: window.location.pathname,
          metadata,
        }),
      })
    } catch (error) {
      console.error('Failed to track event:', error)
    }
  },

  /**
   * Track conversion
   */
  trackConversion: (conversionType: string, value?: number) => {
    Analytics.trackEvent('conversion', conversionType, { value })
  },
}

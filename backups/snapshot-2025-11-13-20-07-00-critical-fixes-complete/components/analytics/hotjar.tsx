'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { analyticsConfig } from '@/lib/analytics/config'
import { consentManager } from '@/lib/analytics/consent-manager'

/**
 * Hotjar Analytics Component
 * Loads Hotjar tracking script when consent is given
 */
export function Hotjar() {
  useEffect(() => {
    // Initialize Hotjar if consent is already given
    if (consentManager.hasAnalyticsConsent() && analyticsConfig.hotjar.enabled) {
      initializeHotjar()
    }

    // Listen for consent changes
    const unsubscribe = consentManager.onConsentChange((consent) => {
      if (consent.analytics && analyticsConfig.hotjar.enabled && analyticsConfig.hotjar.siteId) {
        initializeHotjar()
      }
    })

    return unsubscribe
  }, [])

  const initializeHotjar = () => {
    if (typeof window !== 'undefined' && !window.hj && analyticsConfig.hotjar.siteId) {
      // Hotjar initialization script
      ;(function(h: any, o: any, t: string, j: string, a: any, r: any) {
        h.hj = h.hj || function(...args: any[]) { (h.hj.q = h.hj.q || []).push(args) }
        h._hjSettings = { hjid: analyticsConfig.hotjar.siteId, hjsv: analyticsConfig.hotjar.version }
        a = o.getElementsByTagName('head')[0]
        r = o.createElement('script')
        r.async = 1
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
        a.appendChild(r)
      })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=')

      if (analyticsConfig.debug) {
        console.log('Hotjar initialized with site ID:', analyticsConfig.hotjar.siteId)
      }
    }
  }

  // Don't render anything if Hotjar is disabled or no site ID
  if (!analyticsConfig.hotjar.enabled || !analyticsConfig.hotjar.siteId) {
    return null
  }

  return null
}

export default Hotjar
/**
 * Google Analytics 4 Tracker
 * Handles all GA4 tracking implementation
 */

import { analyticsConfig, analyticsEvents } from '../config'
import { consentManager } from '../consent-manager'

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

class GoogleAnalyticsTracker {
  private initialized = false
  private pendingEvents: Array<() => void> = []

  constructor() {
    // Listen for consent changes
    consentManager.onConsentChange((consent) => {
      if (consent.analytics && !this.initialized) {
        this.initialize()
      }
    })
  }

  /**
   * Initialize Google Analytics
   */
  private initialize(): void {
    if (this.initialized || !analyticsConfig.ga4.enabled || !analyticsConfig.ga4.measurementId) {
      return
    }

    // Create dataLayer
    window.dataLayer = window.dataLayer || []
    window.gtag = function() {
      window.dataLayer?.push(arguments)
    }
    window.gtag('js', new Date())

    // Configure GA4 with consent mode
    window.gtag('consent', 'default', {
      analytics_storage: consentManager.hasAnalyticsConsent() ? 'granted' : 'denied',
      ad_storage: consentManager.hasMarketingConsent() ? 'granted' : 'denied',
      functionality_storage: 'granted',
      personalization_storage: 'granted',
      security_storage: 'granted',
    })

    window.gtag('config', analyticsConfig.ga4.measurementId, {
      page_path: window.location.pathname,
      send_page_view: false, // We'll send it manually
    })

    // Load GA4 script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.ga4.measurementId}`
    script.onload = () => {
      this.initialized = true
      this.processPendingEvents()
    }
    document.head.appendChild(script)

    if (analyticsConfig.debug) {
      console.log('GA4 initialized with ID:', analyticsConfig.ga4.measurementId)
    }
  }

  /**
   * Update consent mode
   */
  updateConsent(): void {
    if (!window.gtag) return

    window.gtag('consent', 'update', {
      analytics_storage: consentManager.hasAnalyticsConsent() ? 'granted' : 'denied',
      ad_storage: consentManager.hasMarketingConsent() ? 'granted' : 'denied',
    })
  }

  /**
   * Process pending events
   */
  private processPendingEvents(): void {
    this.pendingEvents.forEach(event => event())
    this.pendingEvents = []
  }

  /**
   * Track page view
   */
  pageView(url?: string, title?: string): void {
    const trackEvent = () => {
      if (!window.gtag) return

      window.gtag('event', 'page_view', {
        page_path: url || window.location.pathname,
        page_title: title || document.title,
        page_location: window.location.href,
      })

      if (analyticsConfig.debug) {
        console.log('GA4 Page View:', { url, title })
      }
    }

    if (this.initialized) {
      trackEvent()
    } else {
      this.pendingEvents.push(trackEvent)
    }
  }

  /**
   * Track custom event
   */
  event(eventName: string, parameters?: Record<string, any>): void {
    const trackEvent = () => {
      if (!window.gtag || !consentManager.hasAnalyticsConsent()) return

      window.gtag('event', eventName, {
        ...parameters,
        send_to: analyticsConfig.ga4.measurementId,
      })

      if (analyticsConfig.debug) {
        console.log('GA4 Event:', eventName, parameters)
      }
    }

    if (this.initialized) {
      trackEvent()
    } else {
      this.pendingEvents.push(trackEvent)
    }
  }

  /**
   * Track form submission
   */
  trackFormSubmit(formName: string, formData?: Record<string, any>): void {
    this.event(analyticsEvents.formSubmit, {
      form_name: formName,
      form_destination: window.location.pathname,
      ...formData,
    })
  }

  /**
   * Track conversion
   */
  trackConversion(conversionType: string, value?: number, currency = 'EUR'): void {
    this.event('conversion', {
      conversion_type: conversionType,
      value: value,
      currency: currency,
      send_to: analyticsConfig.ga4.measurementId,
    })
  }

  /**
   * Track error
   */
  trackError(errorType: string, errorMessage: string, fatal = false): void {
    this.event('exception', {
      description: errorMessage,
      error_type: errorType,
      fatal: fatal,
    })
  }

  /**
   * Track timing
   */
  trackTiming(category: string, variable: string, value: number): void {
    this.event('timing_complete', {
      name: variable,
      value: value,
      event_category: category,
    })
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: Record<string, any>): void {
    if (!window.gtag || !consentManager.hasAnalyticsConsent()) return

    window.gtag('set', 'user_properties', properties)
  }

  /**
   * Track scroll depth
   */
  trackScrollDepth(percentage: number): void {
    this.event(analyticsEvents.scrollDepth, {
      percent_scrolled: percentage,
    })
  }

  /**
   * Track engagement time
   */
  trackEngagementTime(seconds: number): void {
    this.event(analyticsEvents.timeOnPage, {
      engagement_time_msec: seconds * 1000,
    })
  }
}

export const ga4Tracker = new GoogleAnalyticsTracker()
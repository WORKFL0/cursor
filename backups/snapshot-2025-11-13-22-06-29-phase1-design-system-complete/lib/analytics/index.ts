/**
 * Unified Analytics API
 * Central interface for all tracking services
 */

import { ga4Tracker } from './trackers/google-analytics'
import { clarityTracker } from './trackers/microsoft-clarity'
import { hotjarTracker } from './trackers/hotjar'
import { linkedInTracker } from './trackers/linkedin'
import { facebookPixelTracker } from './trackers/facebook'
import { consentManager } from './consent-manager'
import { analyticsEvents, conversionValues, servicePages } from './config'

export { consentManager, analyticsEvents, conversionValues, servicePages }

/**
 * Analytics class providing unified tracking interface
 */
class Analytics {
  /**
   * Initialize all tracking services based on consent
   */
  initialize(): void {
    // Trackers will auto-initialize based on consent
    if (typeof window !== 'undefined') {
      this.setupPageTracking()
      this.setupErrorTracking()
      this.setupEngagementTracking()
    }
  }

  /**
   * Track page view across all platforms
   */
  pageView(url?: string, title?: string): void {
    ga4Tracker.pageView(url, title)
    clarityTracker.trackPageView(title || document.title)
    hotjarTracker.trackPageView(url || window.location.pathname)
    facebookPixelTracker.trackPageView()
  }

  /**
   * Track custom event across relevant platforms
   */
  event(eventName: string, parameters?: Record<string, any>): void {
    ga4Tracker.event(eventName, parameters)
    clarityTracker.event(eventName)
    hotjarTracker.event(eventName)
    
    // Map to Facebook events if applicable
    if (eventName.includes('lead') || eventName.includes('contact')) {
      facebookPixelTracker.trackLead(eventName, parameters?.value)
    }
  }

  /**
   * Track form submission
   */
  trackFormSubmit(formName: string, formType: 'contact' | 'newsletter' | 'quote' | 'demo' | 'appointment'): void {
    const typeMap: Record<string, keyof typeof conversionValues> = {
      'contact': 'contactFormSubmit',
      'newsletter': 'newsletterSignup', 
      'quote': 'quoteRequested',
      'demo': 'demoScheduled',
      'appointment': 'appointmentBooked'
    }
    const mappedType = typeMap[formType] || 'contactFormSubmit'
    const value = conversionValues[mappedType] || conversionValues.contactFormSubmit

    // GA4
    ga4Tracker.trackFormSubmit(formName, { form_type: formType, value })
    ga4Tracker.trackConversion(`${formType}_form_submit`, value)

    // Clarity
    clarityTracker.trackFormInteraction(formName, 'complete')
    clarityTracker.upgradeSession(`Form Submitted: ${formName}`)

    // Hotjar
    hotjarTracker.trackFormInteraction(formName, 'submit')
    hotjarTracker.tagRecording(['form-submission', formType])

    // LinkedIn
    linkedInTracker.trackFormSubmit(formName, formType as any)

    // Facebook
    facebookPixelTracker.trackFormSubmit(formName, formType)
  }

  /**
   * Track newsletter signup
   */
  trackNewsletterSignup(email: string): void {
    const value = conversionValues.newsletterSignup

    this.event(analyticsEvents.newsletterSignup, { value })
    
    // Track as lead across platforms
    linkedInTracker.trackConversion('newsletter_signup')
    facebookPixelTracker.trackSubscribe('newsletter', value)
  }

  /**
   * Track appointment booking
   */
  trackAppointmentBooked(serviceName: string, date: string): void {
    const value = conversionValues.appointmentBooked

    this.event(analyticsEvents.appointmentBooked, { 
      service: serviceName,
      date: date,
      value 
    })

    // Track conversions
    ga4Tracker.trackConversion('appointment_booked', value)
    linkedInTracker.trackConversion('appointment_booked')
    facebookPixelTracker.trackSchedule('appointment', serviceName)
  }

  /**
   * Track service page view
   */
  trackServicePageView(serviceName: string): void {
    const serviceLabel = servicePages[serviceName as keyof typeof servicePages] || serviceName

    this.event(analyticsEvents.servicePageView, {
      service_name: serviceLabel,
      service_slug: serviceName,
    })

    // Track for retargeting
    linkedInTracker.trackPageCategory(`service_${serviceName}`)
    facebookPixelTracker.trackViewContent(serviceLabel, 'service')
  }

  /**
   * Track download
   */
  trackDownload(fileName: string, fileType: string): void {
    const value = fileType === 'support-tool' ? conversionValues.supportToolDownload : 0

    this.event(analyticsEvents.downloadStarted, {
      file_name: fileName,
      file_type: fileType,
      value,
    })

    // Track across platforms
    linkedInTracker.trackDownload(fileName, fileType)
    facebookPixelTracker.trackDownload(fileName, fileType)
    
    if (fileType === 'support-tool') {
      ga4Tracker.trackConversion('support_tool_download', value)
    }
  }

  /**
   * Track pricing calculator usage
   */
  trackPricingCalculator(services: string[], totalPrice: number): void {
    this.event(analyticsEvents.pricingCalculatorUsed, {
      services: services.join(','),
      total_price: totalPrice,
      service_count: services.length,
    })

    // Track engagement
    clarityTracker.upgradeSession('Pricing Calculator Used')
    hotjarTracker.tagRecording(['pricing-calculator', `price-${totalPrice}`])
  }

  /**
   * Track error
   */
  trackError(errorType: string, errorMessage: string, fatal = false): void {
    ga4Tracker.trackError(errorType, errorMessage, fatal)
    
    if (fatal) {
      clarityTracker.upgradeSession(`Fatal Error: ${errorType}`)
      hotjarTracker.trackFrustration('error')
    }
  }

  /**
   * Track user identification
   */
  identify(userId: string, traits?: Record<string, any>): void {
    // Set user IDs
    clarityTracker.setUserId(userId)
    hotjarTracker.identify(userId, traits)
    
    // Set user properties
    if (traits) {
      ga4Tracker.setUserProperties(traits)
      clarityTracker.identify(traits)
    }
  }

  /**
   * Track scroll depth
   */
  trackScrollDepth(percentage: number): void {
    // Only track at specific milestones
    const milestones = [25, 50, 75, 90, 100]
    if (milestones.includes(percentage)) {
      ga4Tracker.trackScrollDepth(percentage)
      
      if (percentage === 90) {
        clarityTracker.event('High Engagement - 90% Scroll')
      }
    }
  }

  /**
   * Track time on page
   */
  trackTimeOnPage(seconds: number): void {
    // Track at specific intervals
    const intervals = [30, 60, 120, 300, 600]
    if (intervals.includes(seconds)) {
      ga4Tracker.trackEngagementTime(seconds)
      
      if (seconds >= 300) {
        clarityTracker.upgradeSession('High Engagement - 5+ minutes')
      }
    }
  }

  /**
   * Setup automatic page tracking
   */
  private setupPageTracking(): void {
    // Track initial page view
    if (document.readyState === 'complete') {
      this.pageView()
    } else {
      window.addEventListener('load', () => this.pageView())
    }

    // Track route changes (for SPAs)
    if (typeof window !== 'undefined') {
      const originalPushState = history.pushState
      const originalReplaceState = history.replaceState

      history.pushState = (...args) => {
        originalPushState.apply(history, args)
        this.pageView()
      }

      history.replaceState = (...args) => {
        originalReplaceState.apply(history, args)
        this.pageView()
      }

      window.addEventListener('popstate', () => this.pageView())
    }
  }

  /**
   * Setup automatic error tracking
   */
  private setupErrorTracking(): void {
    window.addEventListener('error', (event) => {
      this.trackError('javascript', event.message, false)
    })

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('unhandled_promise', String(event.reason), false)
    })
  }

  /**
   * Setup engagement tracking
   */
  private setupEngagementTracking(): void {
    let scrollTracker: number | null = null
    let maxScroll = 0
    const timeTracker: number | null = null
    const startTime = Date.now()

    // Track scroll depth
    const trackScroll = () => {
      const scrollPercentage = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      )
      
      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage
        
        if (scrollTracker) {
          clearTimeout(scrollTracker)
        }
        
        scrollTracker = window.setTimeout(() => {
          this.trackScrollDepth(maxScroll)
        }, 1000)
      }
    }

    window.addEventListener('scroll', trackScroll, { passive: true })

    // Track time on page
    const trackTime = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000)
      this.trackTimeOnPage(timeOnPage)
    }

    // Track at intervals
    [30, 60, 120, 300, 600].forEach(interval => {
      window.setTimeout(() => trackTime(), interval * 1000)
    })

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      if (scrollTracker) {
        clearTimeout(scrollTracker)
      }
      if (timeTracker) {
        clearInterval(timeTracker)
      }
    })
  }

  /**
   * Update consent for all trackers
   */
  updateConsent(): void {
    ga4Tracker.updateConsent()
    // Other trackers handle consent automatically
  }
}

// Export singleton instance
export const analytics = new Analytics()

// Export types
export type { CookieConsent } from './consent-manager'
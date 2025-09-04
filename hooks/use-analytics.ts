/**
 * Analytics Hook
 * Provides easy access to analytics tracking functions
 */

import { useCallback } from 'react'
import { analytics } from '@/lib/analytics'

interface AnalyticsEventParameters {
  [key: string]: string | number | boolean | null | undefined
}

interface UserTraits {
  email?: string
  name?: string
  company?: string
  plan?: string
  signupDate?: string
  [key: string]: string | number | boolean | null | undefined
}

export function useAnalytics() {
  /**
   * Track form submission
   */
  const trackFormSubmit = useCallback((
    formName: string, 
    formType: 'contact' | 'newsletter' | 'quote' | 'demo' | 'appointment'
  ) => {
    analytics.trackFormSubmit(formName, formType)
  }, [])

  /**
   * Track newsletter signup
   */
  const trackNewsletterSignup = useCallback((email: string) => {
    analytics.trackConversion({
      event_name: 'newsletter_signup',
      value: 0
    })
  }, [])

  /**
   * Track appointment booking
   */
  const trackAppointmentBooked = useCallback((serviceName: string, date: string) => {
    analytics.trackConversion({
      event_name: 'appointment_booked',
      value: 0
    })
  }, [])

  /**
   * Track service page view
   */
  const trackServicePageView = useCallback((serviceName: string) => {
    analytics.trackEvent({
      category: 'Service',
      action: 'view',
      label: serviceName,
      value: 0
    })
  }, [])

  /**
   * Track download
   */
  const trackDownload = useCallback((fileName: string, fileType: string) => {
    analytics.trackEvent({
      category: 'Download',
      action: 'file_download',
      label: fileName,
      value: 0
    })
  }, [])

  /**
   * Track pricing calculator usage
   */
  const trackPricingCalculator = useCallback((services: string[], totalPrice: number) => {
    analytics.trackEvent({
      category: 'Calculator',
      action: 'pricing_calculated',
      label: services.join(', '),
      value: totalPrice
    })
  }, [])

  /**
   * Track custom event
   */
  const trackEvent = useCallback((eventName: string, parameters?: AnalyticsEventParameters) => {
    analytics.trackEvent({
      category: 'Custom',
      action: eventName,
      label: parameters ? JSON.stringify(parameters) : '',
      value: 0
    })
  }, [])

  /**
   * Track error
   */
  const trackError = useCallback((errorType: string, errorMessage: string, fatal = false) => {
    analytics.trackError(new Error(errorMessage), errorType)
  }, [])

  /**
   * Identify user (placeholder - not implemented in analytics)
   */
  const identify = useCallback((userId: string, traits?: UserTraits) => {
    // User identification not yet implemented in analytics
    console.log('User identification:', userId, traits)
  }, [])

  return {
    trackFormSubmit,
    trackNewsletterSignup,
    trackAppointmentBooked,
    trackServicePageView,
    trackDownload,
    trackPricingCalculator,
    trackEvent,
    trackError,
    identify,
  }
}
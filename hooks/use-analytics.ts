/**
 * Analytics Hook
 * Provides easy access to analytics tracking functions
 */

import { useCallback } from 'react'
import { analytics, analyticsEvents } from '@/lib/analytics'

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
    analytics.trackNewsletterSignup(email)
  }, [])

  /**
   * Track appointment booking
   */
  const trackAppointmentBooked = useCallback((serviceName: string, date: string) => {
    analytics.trackAppointmentBooked(serviceName, date)
  }, [])

  /**
   * Track service page view
   */
  const trackServicePageView = useCallback((serviceName: string) => {
    analytics.trackServicePageView(serviceName)
  }, [])

  /**
   * Track download
   */
  const trackDownload = useCallback((fileName: string, fileType: string) => {
    analytics.trackDownload(fileName, fileType)
  }, [])

  /**
   * Track pricing calculator usage
   */
  const trackPricingCalculator = useCallback((services: string[], totalPrice: number) => {
    analytics.trackPricingCalculator(services, totalPrice)
  }, [])

  /**
   * Track custom event
   */
  const trackEvent = useCallback((eventName: string, parameters?: AnalyticsEventParameters) => {
    analytics.event(eventName, parameters)
  }, [])

  /**
   * Track error
   */
  const trackError = useCallback((errorType: string, errorMessage: string, fatal = false) => {
    analytics.trackError(errorType, errorMessage, fatal)
  }, [])

  /**
   * Identify user
   */
  const identify = useCallback((userId: string, traits?: UserTraits) => {
    analytics.identify(userId, traits)
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
    events: analyticsEvents,
  }
}
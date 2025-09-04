/**
 * Analytics service for tracking form submissions and user interactions
 */

interface AnalyticsEvent {
  event: string
  category?: string
  label?: string
  value?: number
  custom_parameters?: Record<string, any>
}

interface FormSubmissionData {
  formType: 'contact' | 'quote' | 'newsletter'
  success: boolean
  hubspotIntegrated?: boolean
  fallbackUsed?: boolean
  errorType?: string
  services?: string[]
  userAgent?: string
  timestamp?: string
}

class AnalyticsService {
  private isGoogleAnalyticsEnabled: boolean
  private isClarityEnabled: boolean
  private isHotjarEnabled: boolean
  private isLinkedInEnabled: boolean
  private isFacebookEnabled: boolean

  constructor() {
    this.isGoogleAnalyticsEnabled = typeof window !== 'undefined' && !!(window as any).gtag
    this.isClarityEnabled = typeof window !== 'undefined' && !!(window as any).clarity
    this.isHotjarEnabled = typeof window !== 'undefined' && !!(window as any).hj
    this.isLinkedInEnabled = typeof window !== 'undefined' && !!(window as any).lintrk
    this.isFacebookEnabled = typeof window !== 'undefined' && !!(window as any).fbq
  }

  /**
   * Track form submission events
   */
  public trackFormSubmission(data: FormSubmissionData): void {
    const eventData: AnalyticsEvent = {
      event: 'form_submit',
      category: 'engagement',
      label: data.formType,
      value: data.success ? 1 : 0,
      custom_parameters: {
        form_type: data.formType,
        success: data.success,
        hubspot_integrated: data.hubspotIntegrated || false,
        fallback_used: data.fallbackUsed || false,
        error_type: data.errorType || null,
        services: data.services?.join(',') || null,
        timestamp: data.timestamp || new Date().toISOString()
      }
    }

    // Google Analytics 4
    if (this.isGoogleAnalyticsEnabled) {
      (window as any).gtag('event', eventData.event, {
        event_category: eventData.category,
        event_label: eventData.label,
        value: eventData.value,
        ...eventData.custom_parameters
      })
    }

    // Microsoft Clarity
    if (this.isClarityEnabled) {
      (window as any).clarity('event', eventData.event, eventData.custom_parameters)
    }

    // Hotjar
    if (this.isHotjarEnabled) {
      (window as any).hj('event', eventData.event)
    }

    // LinkedIn Insight Tag
    if (this.isLinkedInEnabled && data.success) {
      (window as any).lintrk('track', { conversion_id: 'form_submission' })
    }

    // Facebook Pixel
    if (this.isFacebookEnabled && data.success) {
      (window as any).fbq('track', 'Lead', {
        content_name: data.formType,
        content_category: 'Form Submission'
      })
    }

    console.log('Analytics event tracked:', eventData)
  }

  /**
   * Track conversion events (successful form submissions)
   */
  public trackConversion(formType: string, value?: number): void {
    const conversionData = {
      event: 'conversion',
      category: 'conversion',
      label: formType,
      value: value || 1
    }

    // Google Analytics conversion
    if (this.isGoogleAnalyticsEnabled) {
      (window as any).gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID', // Replace with actual conversion ID
        event_category: 'conversion',
        event_label: formType,
        value: conversionData.value
      })
    }

    // LinkedIn conversion
    if (this.isLinkedInEnabled) {
      (window as any).lintrk('track', { conversion_id: 'lead_generation' })
    }

    // Facebook conversion
    if (this.isFacebookEnabled) {
      (window as any).fbq('track', 'CompleteRegistration', {
        content_name: formType,
        value: conversionData.value,
        currency: 'EUR'
      })
    }

    console.log('Conversion tracked:', conversionData)
  }

  /**
   * Track form validation errors
   */
  public trackFormValidationError(formType: string, fieldName: string, errorType: string): void {
    const errorData = {
      event: 'form_validation_error',
      category: 'form_interaction',
      label: `${formType}_${fieldName}`,
      custom_parameters: {
        form_type: formType,
        field_name: fieldName,
        error_type: errorType,
        timestamp: new Date().toISOString()
      }
    }

    // Google Analytics
    if (this.isGoogleAnalyticsEnabled) {
      (window as any).gtag('event', errorData.event, {
        event_category: errorData.category,
        event_label: errorData.label,
        ...errorData.custom_parameters
      })
    }

    // Clarity
    if (this.isClarityEnabled) {
      (window as any).clarity('event', errorData.event, errorData.custom_parameters)
    }

    console.log('Form validation error tracked:', errorData)
  }

  /**
   * Track form abandonment
   */
  public trackFormAbandonment(formType: string, completionPercentage: number, lastField?: string): void {
    const abandonmentData = {
      event: 'form_abandonment',
      category: 'form_interaction',
      label: formType,
      value: Math.round(completionPercentage),
      custom_parameters: {
        form_type: formType,
        completion_percentage: completionPercentage,
        last_field: lastField,
        timestamp: new Date().toISOString()
      }
    }

    // Google Analytics
    if (this.isGoogleAnalyticsEnabled) {
      (window as any).gtag('event', abandonmentData.event, {
        event_category: abandonmentData.category,
        event_label: abandonmentData.label,
        value: abandonmentData.value,
        ...abandonmentData.custom_parameters
      })
    }

    // Clarity
    if (this.isClarityEnabled) {
      (window as any).clarity('event', abandonmentData.event, abandonmentData.custom_parameters)
    }

    console.log('Form abandonment tracked:', abandonmentData)
  }

  /**
   * Track user engagement with forms
   */
  public trackFormEngagement(formType: string, action: string, value?: string): void {
    const engagementData = {
      event: 'form_engagement',
      category: 'form_interaction',
      label: `${formType}_${action}`,
      custom_parameters: {
        form_type: formType,
        action: action,
        value: value,
        timestamp: new Date().toISOString()
      }
    }

    // Google Analytics
    if (this.isGoogleAnalyticsEnabled) {
      (window as any).gtag('event', engagementData.event, {
        event_category: engagementData.category,
        event_label: engagementData.label,
        ...engagementData.custom_parameters
      })
    }

    // Clarity
    if (this.isClarityEnabled) {
      (window as any).clarity('event', engagementData.event, engagementData.custom_parameters)
    }

    console.log('Form engagement tracked:', engagementData)
  }

  /**
   * Track HubSpot integration health
   */
  public trackHubSpotIntegration(success: boolean, errorType?: string, fallbackUsed?: boolean): void {
    const integrationData = {
      event: 'hubspot_integration',
      category: 'system_health',
      label: success ? 'success' : 'failure',
      custom_parameters: {
        success: success,
        error_type: errorType,
        fallback_used: fallbackUsed || false,
        timestamp: new Date().toISOString()
      }
    }

    // Google Analytics (for system monitoring)
    if (this.isGoogleAnalyticsEnabled) {
      (window as any).gtag('event', integrationData.event, {
        event_category: integrationData.category,
        event_label: integrationData.label,
        ...integrationData.custom_parameters
      })
    }

    console.log('HubSpot integration status tracked:', integrationData)
  }

  /**
   * Initialize form tracking for a specific form
   */
  public initializeFormTracking(formType: string, formElement: HTMLFormElement): void {
    if (!formElement) return

    let startTime = Date.now()
    let fieldInteractions: Record<string, number> = {}
    let lastActiveField: string | null = null

    // Track form start
    this.trackFormEngagement(formType, 'form_started')

    // Track field interactions
    const inputs = formElement.querySelectorAll('input, textarea, select')
    inputs.forEach((input) => {
      const fieldName = (input as HTMLElement).getAttribute('name') || 'unknown'
      
      input.addEventListener('focus', () => {
        lastActiveField = fieldName
        fieldInteractions[fieldName] = (fieldInteractions[fieldName] || 0) + 1
        
        if (fieldInteractions[fieldName] === 1) {
          this.trackFormEngagement(formType, 'field_focused', fieldName)
        }
      })

      input.addEventListener('blur', () => {
        if ((input as HTMLInputElement).value) {
          this.trackFormEngagement(formType, 'field_completed', fieldName)
        }
      })
    })

    // Track form abandonment on page unload
    const handleUnload = () => {
      const timeSpent = Date.now() - startTime
      const totalFields = inputs.length
      const completedFields = Array.from(inputs).filter(input => (input as HTMLInputElement).value).length
      const completionPercentage = totalFields > 0 ? (completedFields / totalFields) * 100 : 0

      if (completionPercentage > 0 && completionPercentage < 100) {
        this.trackFormAbandonment(formType, completionPercentage, lastActiveField || undefined)
      }
    }

    window.addEventListener('beforeunload', handleUnload)
    
    // Clean up event listener when form is submitted successfully
    formElement.addEventListener('submit', () => {
      window.removeEventListener('beforeunload', handleUnload)
    })
  }

  /**
   * Track custom events
   */
  public trackCustomEvent(eventName: string, parameters?: Record<string, any>): void {
    // Google Analytics
    if (this.isGoogleAnalyticsEnabled) {
      (window as any).gtag('event', eventName, parameters || {})
    }

    // Microsoft Clarity
    if (this.isClarityEnabled) {
      (window as any).clarity('event', eventName, parameters || {})
    }

    console.log('Custom event tracked:', { event: eventName, parameters })
  }

  /**
   * Check if analytics is properly loaded
   */
  public isAnalyticsReady(): boolean {
    return this.isGoogleAnalyticsEnabled || this.isClarityEnabled || this.isHotjarEnabled
  }

  /**
   * Get analytics status
   */
  public getAnalyticsStatus() {
    return {
      googleAnalytics: this.isGoogleAnalyticsEnabled,
      clarity: this.isClarityEnabled,
      hotjar: this.isHotjarEnabled,
      linkedIn: this.isLinkedInEnabled,
      facebook: this.isFacebookEnabled
    }
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService()

// Hook for React components
export function useAnalytics() {
  return analyticsService
}

export default analyticsService
/**
 * LinkedIn Insight Tag Tracker
 * Handles B2B marketing tracking and conversion tracking
 */

import { analyticsConfig } from '../config'
import { consentManager } from '../consent-manager'

declare global {
  interface Window {
    _linkedin_partner_id?: string
    _linkedin_data_partner_ids?: string[]
    lintrk?: (...args: any[]) => void
  }
}

class LinkedInTracker {
  private initialized = false

  constructor() {
    // Listen for consent changes
    consentManager.onConsentChange((consent) => {
      if (consent.marketing && !this.initialized) {
        this.initialize()
      }
    })
  }

  /**
   * Initialize LinkedIn Insight Tag
   */
  private initialize(): void {
    if (this.initialized || !analyticsConfig.linkedin.enabled || !analyticsConfig.linkedin.partnerId) {
      return
    }

    if (!consentManager.hasMarketingConsent()) {
      return
    }

    // Set partner ID
    window._linkedin_partner_id = analyticsConfig.linkedin.partnerId
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []
    window._linkedin_data_partner_ids.push(analyticsConfig.linkedin.partnerId)

    // Load LinkedIn Insight Tag
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js'
    
    const firstScript = document.getElementsByTagName('script')[0]
    firstScript.parentNode?.insertBefore(script, firstScript)

    // Create img tag for noscript fallback
    const noscript = document.createElement('noscript')
    const img = document.createElement('img')
    img.height = 1
    img.width = 1
    img.style.display = 'none'
    img.alt = ''
    img.src = `https://px.ads.linkedin.com/collect/?pid=${analyticsConfig.linkedin.partnerId}&fmt=gif`
    noscript.appendChild(img)
    document.body.appendChild(noscript)

    this.initialized = true

    if (analyticsConfig.debug) {
      console.log('LinkedIn Insight Tag initialized with partner ID:', analyticsConfig.linkedin.partnerId)
    }
  }

  /**
   * Track conversion
   */
  trackConversion(conversionId: string): void {
    if (!window.lintrk || !consentManager.hasMarketingConsent()) return

    window.lintrk('track', { conversion_id: conversionId })

    if (analyticsConfig.debug) {
      console.log('LinkedIn conversion tracked:', conversionId)
    }
  }

  /**
   * Track custom event
   */
  trackEvent(eventName: string, data?: Record<string, any>): void {
    if (!window.lintrk || !consentManager.hasMarketingConsent()) return

    window.lintrk('track', {
      event: eventName,
      ...data,
    })

    if (analyticsConfig.debug) {
      console.log('LinkedIn event tracked:', eventName, data)
    }
  }

  /**
   * Track form submission
   */
  trackFormSubmit(formName: string, formType: 'contact' | 'demo' | 'newsletter' | 'quote'): void {
    const conversionMap = {
      contact: 'contact_form_submit',
      demo: 'demo_request',
      newsletter: 'newsletter_signup',
      quote: 'quote_request',
    }

    this.trackEvent('form_submit', {
      form_name: formName,
      form_type: formType,
    })

    // Track as conversion if mapped
    if (conversionMap[formType]) {
      this.trackConversion(conversionMap[formType])
    }
  }

  /**
   * Track page category view (for retargeting)
   */
  trackPageCategory(category: string): void {
    this.trackEvent('page_view', {
      page_category: category,
    })
  }

  /**
   * Track content view
   */
  trackContentView(contentType: string, contentId: string, contentTitle?: string): void {
    this.trackEvent('content_view', {
      content_type: contentType,
      content_id: contentId,
      content_title: contentTitle,
    })
  }

  /**
   * Track download
   */
  trackDownload(fileName: string, fileType: string): void {
    this.trackEvent('download', {
      file_name: fileName,
      file_type: fileType,
    })
    
    // Also track as conversion for important downloads
    if (fileType === 'whitepaper' || fileType === 'ebook' || fileType === 'guide') {
      this.trackConversion('content_download')
    }
  }

  /**
   * Track service interest
   */
  trackServiceInterest(serviceName: string, action: string): void {
    this.trackEvent('service_interest', {
      service_name: serviceName,
      action: action,
    })
  }

  /**
   * Track B2B lead quality
   */
  trackLeadQuality(score: number, attributes: Record<string, any>): void {
    this.trackEvent('lead_scored', {
      lead_score: score,
      ...attributes,
    })

    // High-quality leads tracked as conversion
    if (score >= 80) {
      this.trackConversion('high_quality_lead')
    }
  }

  /**
   * Track company identification
   */
  trackCompanyIdentified(companyName: string, industry?: string, size?: string): void {
    this.trackEvent('company_identified', {
      company_name: companyName,
      industry: industry,
      company_size: size,
    })
  }
}

export const linkedInTracker = new LinkedInTracker()
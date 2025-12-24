/**
 * Facebook Pixel Tracker
 * Handles social media marketing tracking and conversions
 */

import { analyticsConfig } from '../config'
import { consentManager } from '../consent-manager'

declare global {
  interface Window {
    fbq?: (...args: any[]) => void
    _fbq?: (...args: any[]) => void
  }
}

class FacebookPixelTracker {
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
   * Initialize Facebook Pixel
   */
  private initialize(): void {
    if (this.initialized || !analyticsConfig.facebook.enabled || !analyticsConfig.facebook.pixelId) {
      return
    }

    if (!consentManager.hasMarketingConsent()) {
      return
    }

    // Facebook Pixel initialization script
    const fbScript = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
    `

    const script = document.createElement('script')
    script.innerHTML = fbScript
    document.head.appendChild(script)

    // Initialize pixel
    if (window.fbq) {
      window.fbq('init', analyticsConfig.facebook.pixelId)
      window.fbq('track', 'PageView')
    }

    // Add noscript fallback
    const noscript = document.createElement('noscript')
    const img = document.createElement('img')
    img.height = 1
    img.width = 1
    img.style.display = 'none'
    img.src = `https://www.facebook.com/tr?id=${analyticsConfig.facebook.pixelId}&ev=PageView&noscript=1`
    noscript.appendChild(img)
    document.body.appendChild(noscript)

    this.initialized = true

    if (analyticsConfig.debug) {
      console.log('Facebook Pixel initialized with ID:', analyticsConfig.facebook.pixelId)
    }
  }

  /**
   * Track standard event
   */
  track(eventName: string, parameters?: Record<string, any>): void {
    if (!window.fbq || !consentManager.hasMarketingConsent()) return

    window.fbq('track', eventName, parameters)

    if (analyticsConfig.debug) {
      console.log('Facebook Pixel event:', eventName, parameters)
    }
  }

  /**
   * Track custom event
   */
  trackCustom(eventName: string, parameters?: Record<string, any>): void {
    if (!window.fbq || !consentManager.hasMarketingConsent()) return

    window.fbq('trackCustom', eventName, parameters)

    if (analyticsConfig.debug) {
      console.log('Facebook Pixel custom event:', eventName, parameters)
    }
  }

  /**
   * Track page view
   */
  trackPageView(): void {
    this.track('PageView')
  }

  /**
   * Track view content
   */
  trackViewContent(contentName: string, contentCategory: string, value?: number): void {
    this.track('ViewContent', {
      content_name: contentName,
      content_category: contentCategory,
      value: value,
      currency: 'EUR',
    })
  }

  /**
   * Track search
   */
  trackSearch(searchString: string): void {
    this.track('Search', {
      search_string: searchString,
    })
  }

  /**
   * Track lead generation
   */
  trackLead(leadType: string, value?: number): void {
    this.track('Lead', {
      content_name: leadType,
      value: value,
      currency: 'EUR',
    })
  }

  /**
   * Track form submission
   */
  trackFormSubmit(formName: string, formType: string): void {
    this.track('Lead', {
      content_name: formName,
      content_category: formType,
    })
  }

  /**
   * Track contact
   */
  trackContact(contactMethod: string): void {
    this.track('Contact', {
      content_name: contactMethod,
    })
  }

  /**
   * Track subscription
   */
  trackSubscribe(subscriptionType: string, value?: number): void {
    this.track('Subscribe', {
      content_name: subscriptionType,
      value: value,
      currency: 'EUR',
    })
  }

  /**
   * Track complete registration
   */
  trackCompleteRegistration(registrationType: string, value?: number): void {
    this.track('CompleteRegistration', {
      content_name: registrationType,
      value: value,
      currency: 'EUR',
      status: true,
    })
  }

  /**
   * Track schedule (appointments, demos, etc.)
   */
  trackSchedule(scheduleType: string, serviceName?: string): void {
    this.track('Schedule', {
      content_name: scheduleType,
      content_ids: [serviceName],
    })
  }

  /**
   * Track custom conversion
   */
  trackCustomConversion(conversionName: string, value?: number, parameters?: Record<string, any>): void {
    this.trackCustom(conversionName, {
      value: value,
      currency: 'EUR',
      ...parameters,
    })
  }

  /**
   * Track download
   */
  trackDownload(fileName: string, fileType: string): void {
    this.trackCustom('Download', {
      content_name: fileName,
      content_type: fileType,
    })
  }

  /**
   * Track service interest
   */
  trackServiceInterest(serviceName: string, action: string): void {
    this.trackCustom('ServiceInterest', {
      service_name: serviceName,
      action: action,
    })
  }

  /**
   * Set user data for advanced matching
   */
  setUserData(userData: {
    email?: string
    phone?: string
    firstName?: string
    lastName?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }): void {
    if (!window.fbq || !consentManager.hasMarketingConsent()) return

    // Hash sensitive data before sending
    const hashedData: Record<string, string> = {}
    
    if (userData.email) {
      hashedData.em = this.hashData(userData.email.toLowerCase())
    }
    if (userData.phone) {
      hashedData.ph = this.hashData(userData.phone.replace(/\D/g, ''))
    }
    if (userData.firstName) {
      hashedData.fn = this.hashData(userData.firstName.toLowerCase())
    }
    if (userData.lastName) {
      hashedData.ln = this.hashData(userData.lastName.toLowerCase())
    }
    if (userData.city) {
      hashedData.ct = this.hashData(userData.city.toLowerCase())
    }
    if (userData.state) {
      hashedData.st = this.hashData(userData.state.toLowerCase())
    }
    if (userData.zipCode) {
      hashedData.zp = this.hashData(userData.zipCode)
    }
    if (userData.country) {
      hashedData.country = this.hashData(userData.country.toLowerCase())
    }

    window.fbq('init', analyticsConfig.facebook.pixelId, hashedData)
  }

  /**
   * Simple hash function for data (SHA-256 would be better in production)
   */
  private hashData(data: string): string {
    // In production, use a proper SHA-256 implementation
    // This is a simple placeholder
    return btoa(data)
  }
}

export const facebookPixelTracker = new FacebookPixelTracker()
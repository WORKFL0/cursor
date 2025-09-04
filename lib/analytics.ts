'use client'

import { onCLS, onFCP, onINP, onLCP, onTTFB, Metric } from 'web-vitals'

// Types
export interface AnalyticsEvent {
  action: string
  category?: string
  label?: string
  value?: number
  custom_parameters?: Record<string, any>
}

export interface ConversionEvent {
  event_name: string
  currency?: string
  value?: number
  items?: Array<{
    item_id: string
    item_name: string
    category: string
    quantity?: number
    price?: number
  }>
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    clarity?: (...args: any[]) => void
    hj?: (...args: any[]) => void
    fbq?: (...args: any[]) => void
    lintrk?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

class Analytics {
  private initialized = false
  private debug = false
  private consentGiven = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.debug = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true'
      this.checkConsentStatus()
    }
  }

  /**
   * Initialize analytics services
   */
  initialize() {
    if (typeof window === 'undefined' || this.initialized) return

    this.log('Initializing analytics...')
    this.checkConsentStatus()

    if (this.consentGiven) {
      this.loadGoogleAnalytics()
      this.loadMicrosoftClarity()
      this.loadHotjar()
      this.loadFacebookPixel()
      this.loadLinkedInInsightTag()
      this.initializeWebVitals()
    }

    this.initialized = true
  }

  /**
   * Check if user has given consent for analytics
   */
  private checkConsentStatus() {
    if (typeof window === 'undefined') return

    try {
      const consent = localStorage.getItem('workflo-cookie-consent')
      if (consent) {
        const consentData = JSON.parse(consent)
        this.consentGiven = consentData.analytics === true
      }
    } catch (error) {
      this.log('Error checking consent status:', error)
    }
  }

  /**
   * Update consent status and reload analytics if granted
   */
  updateConsent(consent: { analytics: boolean; marketing: boolean }) {
    this.consentGiven = consent.analytics || consent.marketing
    this.log('Consent updated:', { analytics: consent.analytics, marketing: consent.marketing })

    if (this.consentGiven && !this.initialized) {
      this.initialize()
    }
  }

  /**
   * Load Google Analytics 4
   */
  private loadGoogleAnalytics() {
    const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID
    const enableGA4 = process.env.NEXT_PUBLIC_ENABLE_GA4 === 'true'

    if (!measurementId || !enableGA4) {
      this.log('GA4 not configured or disabled')
      return
    }

    this.log('Loading Google Analytics 4...')

    // Load gtag script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    window.gtag = function() {
      window.dataLayer!.push(arguments)
    }

    window.gtag('js', new Date())
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 7776000, // 90 days
    })
  }

  /**
   * Load Microsoft Clarity
   */
  private loadMicrosoftClarity() {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID
    const enableClarity = process.env.NEXT_PUBLIC_ENABLE_CLARITY === 'true'

    if (!projectId || !enableClarity) {
      this.log('Microsoft Clarity not configured or disabled')
      return
    }

    this.log('Loading Microsoft Clarity...')

    const script = document.createElement('script')
    script.innerHTML = `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${projectId}");
    `
    document.head.appendChild(script)
  }

  /**
   * Load Hotjar
   */
  private loadHotjar() {
    const siteId = process.env.NEXT_PUBLIC_HOTJAR_SITE_ID
    const enableHotjar = process.env.NEXT_PUBLIC_ENABLE_HOTJAR === 'true'

    if (!siteId || !enableHotjar) {
      this.log('Hotjar not configured or disabled')
      return
    }

    this.log('Loading Hotjar...')

    const script = document.createElement('script')
    script.innerHTML = `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${siteId},hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `
    document.head.appendChild(script)
  }

  /**
   * Load Facebook Pixel
   */
  private loadFacebookPixel() {
    const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID
    const enableFacebook = process.env.NEXT_PUBLIC_ENABLE_FACEBOOK === 'true'

    if (!pixelId || !enableFacebook) {
      this.log('Facebook Pixel not configured or disabled')
      return
    }

    this.log('Loading Facebook Pixel...')

    const script = document.createElement('script')
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `
    document.head.appendChild(script)
  }

  /**
   * Load LinkedIn Insight Tag
   */
  private loadLinkedInInsightTag() {
    const partnerId = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID
    const enableLinkedIn = process.env.NEXT_PUBLIC_ENABLE_LINKEDIN === 'true'

    if (!partnerId || !enableLinkedIn) {
      this.log('LinkedIn Insight Tag not configured or disabled')
      return
    }

    this.log('Loading LinkedIn Insight Tag...')

    const script = document.createElement('script')
    script.innerHTML = `
      _linkedin_partner_id = "${partnerId}";
      window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
      window._linkedin_data_partner_ids.push(_linkedin_partner_id);
      (function(l) {
        if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
        window.lintrk.q=[]}
        var s = document.getElementsByTagName("script")[0];
        var b = document.createElement("script");
        b.type = "text/javascript";b.async = true;
        b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
        s.parentNode.insertBefore(b, s);})(window.lintrk);
    `
    document.head.appendChild(script)
  }

  /**
   * Initialize Web Vitals monitoring
   */
  private initializeWebVitals() {
    this.log('Initializing Web Vitals monitoring...')

    const vitalsHandler = (metric: Metric) => {
      this.log('Web Vital:', metric)

      // Send to Google Analytics
      if (window.gtag) {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        })
      }

      // Send to Microsoft Clarity
      if (window.clarity) {
        window.clarity('event', `web_vital_${metric.name.toLowerCase()}`, {
          value: metric.value,
          rating: metric.rating,
        })
      }

      // Custom endpoint for internal monitoring
      this.sendWebVital(metric)
    }

    onCLS(vitalsHandler)
    onFCP(vitalsHandler)
    onINP(vitalsHandler)
    onLCP(vitalsHandler)
    onTTFB(vitalsHandler)
  }

  /**
   * Send Web Vital to custom monitoring endpoint
   */
  private async sendWebVital(metric: Metric) {
    try {
      await fetch('/api/monitoring/web-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          url: window.location.href,
          timestamp: Date.now(),
        }),
      })
    } catch (error) {
      this.log('Error sending web vital:', error)
    }
  }

  /**
   * Track page view
   */
  pageView(url: string, title?: string) {
    if (!this.consentGiven) return

    this.log('Page view:', { url, title })

    // Google Analytics
    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID!, {
        page_title: title || document.title,
        page_location: url,
      })
    }

    // Microsoft Clarity
    if (window.clarity) {
      window.clarity('event', 'page_view', {
        url,
        title: title || document.title,
      })
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'PageView')
    }
  }

  /**
   * Track custom event
   */
  trackEvent(event: AnalyticsEvent) {
    if (!this.consentGiven) return

    this.log('Event:', event)

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters,
      })
    }

    // Microsoft Clarity
    if (window.clarity) {
      window.clarity('event', event.action, {
        category: event.category,
        label: event.label,
        value: event.value,
        ...event.custom_parameters,
      })
    }

    // Hotjar
    if (window.hj) {
      window.hj('event', event.action)
    }
  }

  /**
   * Track conversion event
   */
  trackConversion(event: ConversionEvent) {
    if (!this.consentGiven) return

    this.log('Conversion:', event)

    // Google Analytics Enhanced Ecommerce
    if (window.gtag) {
      window.gtag('event', event.event_name, {
        currency: event.currency || 'EUR',
        value: event.value,
        items: event.items,
      })
    }

    // Facebook Pixel
    if (window.fbq && event.value) {
      window.fbq('track', 'Purchase', {
        value: event.value,
        currency: event.currency || 'EUR',
      })
    }

    // LinkedIn Conversion
    if (window.lintrk) {
      window.lintrk('track', { conversion_id: event.event_name })
    }
  }

  /**
   * Track form submission
   */
  trackFormSubmit(formName: string, formType: string = 'form') {
    this.trackEvent({
      action: 'form_submit',
      category: 'engagement',
      label: formName,
      custom_parameters: {
        form_type: formType,
        form_name: formName,
      },
    })

    // Track as conversion if it's a lead form
    if (formType === 'contact' || formType === 'quote' || formType === 'newsletter') {
      this.trackConversion({
        event_name: 'generate_lead',
        value: formType === 'contact' ? 50 : formType === 'quote' ? 100 : 5,
        currency: 'EUR',
      })
    }
  }

  /**
   * Track scroll depth
   */
  trackScrollDepth(percentage: number) {
    this.trackEvent({
      action: 'scroll',
      category: 'engagement',
      label: `${percentage}%`,
      value: percentage,
      custom_parameters: {
        scroll_depth: percentage,
      },
    })
  }

  /**
   * Track time on page
   */
  trackTimeOnPage(seconds: number) {
    const minutes = Math.floor(seconds / 60)
    let label = `${seconds}s`
    
    if (minutes >= 1) {
      label = `${minutes}min`
    }

    this.trackEvent({
      action: 'time_on_page',
      category: 'engagement',
      label,
      value: seconds,
      custom_parameters: {
        time_seconds: seconds,
        time_minutes: minutes,
      },
    })
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: string) {
    this.log('Error:', error, context)

    this.trackEvent({
      action: 'javascript_error',
      category: 'error',
      label: error.message,
      custom_parameters: {
        error_name: error.name,
        error_message: error.message,
        error_stack: error.stack?.substring(0, 500), // Truncate for privacy
        error_context: context,
        page_url: window.location.href,
      },
    })
  }

  /**
   * Track 404 error
   */
  track404(path: string) {
    this.trackEvent({
      action: 'page_not_found',
      category: 'error',
      label: path,
      custom_parameters: {
        error_path: path,
        referrer: document.referrer,
      },
    })
  }

  /**
   * Debug logging
   */
  private log(...args: any[]) {
    if (this.debug) {
      console.log('[Analytics]', ...args)
    }
  }
}

// Export singleton instance
export const analytics = new Analytics()

// React hook for easy use in components
export function useAnalytics() {
  return {
    trackEvent: (event: AnalyticsEvent) => analytics.trackEvent(event),
    trackConversion: (event: ConversionEvent) => analytics.trackConversion(event),
    trackFormSubmit: (formName: string, formType?: string) => 
      analytics.trackFormSubmit(formName, formType),
    trackScrollDepth: (percentage: number) => analytics.trackScrollDepth(percentage),
    trackTimeOnPage: (seconds: number) => analytics.trackTimeOnPage(seconds),
    trackError: (error: Error, context?: string) => analytics.trackError(error, context),
    track404: (path: string) => analytics.track404(path),
    updateConsent: (consent: { analytics: boolean; marketing: boolean }) => 
      analytics.updateConsent(consent),
  }
}
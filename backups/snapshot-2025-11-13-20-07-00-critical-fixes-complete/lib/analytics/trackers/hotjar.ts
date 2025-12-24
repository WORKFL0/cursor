/**
 * Hotjar Tracker
 * Handles user behavior tracking and feedback collection
 */

import { analyticsConfig } from '../config'
import { consentManager } from '../consent-manager'

declare global {
  interface Window {
    hj?: (...args: any[]) => void
    _hjSettings?: {
      hjid: number
      hjsv: number
    }
  }
}

class HotjarTracker {
  private initialized = false

  constructor() {
    // Listen for consent changes
    consentManager.onConsentChange((consent) => {
      if (consent.analytics && !this.initialized) {
        this.initialize()
      }
    })
  }

  /**
   * Initialize Hotjar
   */
  private initialize(): void {
    if (this.initialized || !analyticsConfig.hotjar.enabled || !analyticsConfig.hotjar.siteId) {
      return
    }

    if (!consentManager.hasAnalyticsConsent()) {
      return
    }

    // Hotjar initialization script
    const hotjarScript = `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${analyticsConfig.hotjar.siteId},hjsv:${analyticsConfig.hotjar.version}};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `

    const script = document.createElement('script')
    script.innerHTML = hotjarScript
    document.head.appendChild(script)

    this.initialized = true

    if (analyticsConfig.debug) {
      console.log('Hotjar initialized with site ID:', analyticsConfig.hotjar.siteId)
    }
  }

  /**
   * Identify user
   */
  identify(userId: string, userVars?: Record<string, string | number>): void {
    if (!window.hj || !consentManager.hasAnalyticsConsent()) return

    window.hj('identify', userId, userVars)

    if (analyticsConfig.debug) {
      console.log('Hotjar user identified:', userId, userVars)
    }
  }

  /**
   * Track virtual page view
   */
  trackPageView(pageName: string): void {
    if (!window.hj || !consentManager.hasAnalyticsConsent()) return

    window.hj('stateChange', pageName)

    if (analyticsConfig.debug) {
      console.log('Hotjar virtual page view:', pageName)
    }
  }

  /**
   * Trigger event
   */
  event(eventName: string): void {
    if (!window.hj || !consentManager.hasAnalyticsConsent()) return

    window.hj('event', eventName)

    if (analyticsConfig.debug) {
      console.log('Hotjar event:', eventName)
    }
  }

  /**
   * Tag recording
   */
  tagRecording(tags: string[]): void {
    if (!window.hj || !consentManager.hasAnalyticsConsent()) return

    window.hj('tagRecording', tags)

    if (analyticsConfig.debug) {
      console.log('Hotjar recording tagged:', tags)
    }
  }

  /**
   * Set user attributes
   */
  setUserAttributes(attributes: Record<string, string | number | boolean>): void {
    if (!window.hj || !consentManager.hasAnalyticsConsent()) return

    window.hj('identify', null, attributes)
  }

  /**
   * Trigger feedback widget
   */
  showFeedback(widgetId?: string): void {
    if (!window.hj) return

    if (widgetId) {
      window.hj('showFeedbackWidget', widgetId)
    } else {
      window.hj('showFeedbackWidget')
    }
  }

  /**
   * Trigger survey
   */
  showSurvey(surveyId: string): void {
    if (!window.hj) return

    window.hj('showSurvey', surveyId)
  }

  /**
   * Track form interaction
   */
  trackFormInteraction(formName: string, interaction: 'start' | 'submit' | 'abandon'): void {
    this.event(`form_${interaction}_${formName}`)
    
    if (interaction === 'abandon') {
      this.tagRecording(['form-abandoned', formName])
    }
  }

  /**
   * Track conversion funnel
   */
  trackFunnelStep(funnelName: string, step: number, stepName: string): void {
    this.event(`funnel_${funnelName}_step_${step}`)
    this.tagRecording([funnelName, `step-${step}`, stepName])
  }

  /**
   * Track user frustration signals
   */
  trackFrustration(type: 'rage-click' | 'dead-click' | 'error' | 'slow-load'): void {
    this.event(`frustration_${type}`)
    this.tagRecording(['frustration', type])
  }

  /**
   * Track A/B test variant
   */
  trackABTest(testName: string, variant: string): void {
    this.setUserAttributes({
      [`ab_test_${testName}`]: variant,
    })
    this.tagRecording(['ab-test', testName, variant])
  }
}

export const hotjarTracker = new HotjarTracker()
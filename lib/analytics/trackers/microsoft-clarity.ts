/**
 * Microsoft Clarity Tracker
 * Handles session recording and heatmap tracking
 */

import { analyticsConfig } from '../config'
import { consentManager } from '../consent-manager'

declare global {
  interface Window {
    clarity?: (...args: any[]) => void
  }
}

class MicrosoftClarityTracker {
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
   * Initialize Microsoft Clarity
   */
  private initialize(): void {
    if (this.initialized || !analyticsConfig.clarity.enabled || !analyticsConfig.clarity.projectId) {
      return
    }

    if (!consentManager.hasAnalyticsConsent()) {
      return
    }

    // Clarity initialization script
    const clarityScript = `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${analyticsConfig.clarity.projectId}");
    `

    const script = document.createElement('script')
    script.innerHTML = clarityScript
    document.head.appendChild(script)

    this.initialized = true

    if (analyticsConfig.debug) {
      console.log('Microsoft Clarity initialized with project ID:', analyticsConfig.clarity.projectId)
    }
  }

  /**
   * Set custom user ID
   */
  setUserId(userId: string): void {
    if (!window.clarity || !consentManager.hasAnalyticsConsent()) return

    window.clarity('set', 'userId', userId)

    if (analyticsConfig.debug) {
      console.log('Clarity User ID set:', userId)
    }
  }

  /**
   * Set custom session ID
   */
  setSessionId(sessionId: string): void {
    if (!window.clarity || !consentManager.hasAnalyticsConsent()) return

    window.clarity('set', 'sessionId', sessionId)
  }

  /**
   * Set custom tags for filtering sessions
   */
  setCustomTags(tags: Record<string, string>): void {
    if (!window.clarity || !consentManager.hasAnalyticsConsent()) return

    Object.entries(tags).forEach(([key, value]) => {
      if (window.clarity) {
        window.clarity('set', key, value)
      }
    })

    if (analyticsConfig.debug) {
      console.log('Clarity custom tags set:', tags)
    }
  }

  /**
   * Start recording a new session
   */
  startNewSession(): void {
    if (!window.clarity || !consentManager.hasAnalyticsConsent()) return

    window.clarity('start')
  }

  /**
   * Stop recording the current session
   */
  stopSession(): void {
    if (!window.clarity) return

    window.clarity('stop')
  }

  /**
   * Upgrade session for detailed recording
   * Useful for capturing important user journeys
   */
  upgradeSession(reason: string): void {
    if (!window.clarity || !consentManager.hasAnalyticsConsent()) return

    window.clarity('upgrade', reason)

    if (analyticsConfig.debug) {
      console.log('Clarity session upgraded:', reason)
    }
  }

  /**
   * Mark an event in the session
   */
  event(eventName: string): void {
    if (!window.clarity || !consentManager.hasAnalyticsConsent()) return

    window.clarity('event', eventName)

    if (analyticsConfig.debug) {
      console.log('Clarity event:', eventName)
    }
  }

  /**
   * Identify user traits
   */
  identify(traits: Record<string, any>): void {
    if (!window.clarity || !consentManager.hasAnalyticsConsent()) return

    Object.entries(traits).forEach(([key, value]) => {
      if (window.clarity) {
        window.clarity('identify', key, String(value))
      }
    })
  }

  /**
   * Track page navigation
   */
  trackPageView(pageName: string): void {
    this.event(`Page View: ${pageName}`)
  }

  /**
   * Track form interactions
   */
  trackFormInteraction(formName: string, action: 'start' | 'complete' | 'error'): void {
    this.event(`Form ${action}: ${formName}`)
  }

  /**
   * Track conversion funnel steps
   */
  trackFunnelStep(funnelName: string, step: number, stepName: string): void {
    this.setCustomTags({
      funnel: funnelName,
      funnel_step: String(step),
      funnel_step_name: stepName,
    })
    this.event(`Funnel Step: ${funnelName} - ${stepName}`)
  }
}

export const clarityTracker = new MicrosoftClarityTracker()
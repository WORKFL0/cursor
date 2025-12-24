/**
 * Consent Manager
 * Manages user consent for analytics and marketing cookies
 */

import Cookies from 'js-cookie'
import { analyticsConfig } from './config'

export interface CookieConsent {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
  version?: string
  timestamp?: string
}

class ConsentManager {
  private static instance: ConsentManager
  private consent: CookieConsent | null = null
  private callbacks: Array<(consent: CookieConsent) => void> = []

  private constructor() {
    this.loadConsent()
  }

  static getInstance(): ConsentManager {
    if (!ConsentManager.instance) {
      ConsentManager.instance = new ConsentManager()
    }
    return ConsentManager.instance
  }

  /**
   * Load consent from cookies
   */
  private loadConsent(): void {
    try {
      const consentCookie = Cookies.get(analyticsConfig.cookieConsent.cookieName)
      if (consentCookie) {
        this.consent = JSON.parse(consentCookie)
      }
    } catch (error) {
      console.error('Error loading consent:', error)
    }
  }

  /**
   * Save consent to cookies
   */
  saveConsent(consent: CookieConsent): void {
    const consentWithMetadata = {
      ...consent,
      version: analyticsConfig.cookieConsent.version,
      timestamp: new Date().toISOString(),
    }

    Cookies.set(
      analyticsConfig.cookieConsent.cookieName,
      JSON.stringify(consentWithMetadata),
      {
        expires: analyticsConfig.cookieConsent.cookieExpiry,
        sameSite: 'lax',
        secure: true,
      }
    )

    this.consent = consentWithMetadata
    this.notifyCallbacks(consentWithMetadata)
  }

  /**
   * Get current consent
   */
  getConsent(): CookieConsent | null {
    return this.consent
  }

  /**
   * Check if user has given consent
   */
  hasConsent(): boolean {
    return this.consent !== null
  }

  /**
   * Check if analytics consent is given
   */
  hasAnalyticsConsent(): boolean {
    return this.consent?.analytics === true
  }

  /**
   * Check if marketing consent is given
   */
  hasMarketingConsent(): boolean {
    return this.consent?.marketing === true
  }

  /**
   * Register callback for consent changes
   */
  onConsentChange(callback: (consent: CookieConsent) => void): void {
    this.callbacks.push(callback)
    
    // Call immediately if consent already exists
    if (this.consent) {
      callback(this.consent)
    }
  }

  /**
   * Notify all callbacks of consent change
   */
  private notifyCallbacks(consent: CookieConsent): void {
    this.callbacks.forEach(callback => callback(consent))
  }

  /**
   * Accept all cookies
   */
  acceptAll(): void {
    this.saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    })
  }

  /**
   * Reject all non-necessary cookies
   */
  rejectAll(): void {
    this.saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    })
  }

  /**
   * Update consent
   */
  updateConsent(consent: Partial<CookieConsent>): void {
    const currentConsent = this.consent || {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    }

    this.saveConsent({
      ...currentConsent,
      ...consent,
      necessary: true, // Always required
    })
  }

  /**
   * Clear consent (for testing or user request)
   */
  clearConsent(): void {
    Cookies.remove(analyticsConfig.cookieConsent.cookieName)
    this.consent = null
  }
}

export const consentManager = ConsentManager.getInstance()
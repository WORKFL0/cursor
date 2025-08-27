/**
 * Analytics Configuration
 * Centralized configuration for all tracking services
 */

export const analyticsConfig = {
  // Google Analytics 4
  ga4: {
    measurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '',
    enabled: Boolean(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID) && 
             process.env.NEXT_PUBLIC_ENABLE_GA4 !== 'false',
  },
  
  // Microsoft Clarity
  clarity: {
    projectId: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || '',
    enabled: Boolean(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID) && 
             process.env.NEXT_PUBLIC_ENABLE_CLARITY !== 'false',
  },
  
  // Hotjar
  hotjar: {
    siteId: process.env.NEXT_PUBLIC_HOTJAR_SITE_ID ? 
            parseInt(process.env.NEXT_PUBLIC_HOTJAR_SITE_ID, 10) : 0,
    version: 6,
    enabled: Boolean(process.env.NEXT_PUBLIC_HOTJAR_SITE_ID) && 
             process.env.NEXT_PUBLIC_ENABLE_HOTJAR !== 'false',
  },
  
  // LinkedIn Insight Tag
  linkedin: {
    partnerId: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID || '',
    enabled: Boolean(process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID) && 
             process.env.NEXT_PUBLIC_ENABLE_LINKEDIN !== 'false',
  },
  
  // Facebook Pixel
  facebook: {
    pixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '',
    enabled: Boolean(process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID) && 
             process.env.NEXT_PUBLIC_ENABLE_FACEBOOK !== 'false',
  },
  
  // Cookie consent settings
  cookieConsent: {
    cookieName: 'workflo-cookie-consent',
    cookieExpiry: 365, // days
    version: '1.0',
  },
  
  // Debug mode
  debug: process.env.NODE_ENV === 'development',
}

/**
 * Custom event names for consistent tracking across platforms
 */
export const analyticsEvents = {
  // Page views
  pageView: 'page_view',
  
  // Form interactions
  formStart: 'form_start',
  formSubmit: 'form_submit',
  formError: 'form_error',
  
  // Contact events
  contactFormSubmit: 'contact_form_submit',
  newsletterSignup: 'newsletter_signup',
  appointmentBooked: 'appointment_booked',
  
  // Service interactions
  servicePageView: 'service_page_view',
  serviceInfoRequest: 'service_info_request',
  pricingCalculatorUsed: 'pricing_calculator_used',
  
  // Downloads
  downloadStarted: 'download_started',
  downloadCompleted: 'download_completed',
  supportToolDownload: 'support_tool_download',
  
  // Navigation
  menuClick: 'menu_click',
  ctaClick: 'cta_click',
  socialLinkClick: 'social_link_click',
  
  // Engagement
  scrollDepth: 'scroll_depth',
  timeOnPage: 'time_on_page',
  videoPlayed: 'video_played',
  
  // Conversion events
  leadGenerated: 'lead_generated',
  quoteRequested: 'quote_requested',
  demoScheduled: 'demo_scheduled',
  
  // Error tracking
  error404: 'error_404',
  errorJavaScript: 'error_javascript',
  errorApi: 'error_api',
}

/**
 * Service page mapping for tracking
 */
export const servicePages = {
  'managed-it': 'Managed IT Services',
  'cloud': 'Cloud Solutions',
  'cybersecurity': 'Cybersecurity',
  'microsoft-365': 'Microsoft 365',
  'backup-disaster-recovery': 'Backup & Disaster Recovery',
  'voip-telefonie': 'VoIP Telefonie',
  'hardware-as-a-service': 'Hardware as a Service',
}

/**
 * Conversion value mapping (in EUR)
 */
export const conversionValues = {
  contactFormSubmit: 50,
  newsletterSignup: 5,
  appointmentBooked: 100,
  quoteRequested: 150,
  demoScheduled: 200,
  supportToolDownload: 25,
}
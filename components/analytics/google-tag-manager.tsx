'use client'

import Script from 'next/script'

/**
 * Google Tag Manager Component
 * Centralizes all tracking pixels and conversion events
 */
export function GoogleTagManager() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID

  if (!gtmId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[GTM] GTM_ID not configured - tracking disabled')
    }
    return null
  }

  return (
    <>
      {/* Google Tag Manager - Head */}
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />

      {/* Google Tag Manager - NoScript fallback */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  )
}

/**
 * Helper function to push events to GTM dataLayer
 */
export function gtmEvent(eventName: string, eventData?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventData,
    })
  }
}

/**
 * Conversion tracking events
 */
export const GTMEvents = {
  // Form submissions
  contactFormSubmit: (formType: string) => {
    gtmEvent('form_submit', {
      form_type: formType,
      form_location: window.location.pathname,
    })
  },

  newsletterSignup: (email: string) => {
    gtmEvent('newsletter_signup', {
      email_hash: btoa(email), // Basic hash for privacy
    })
  },

  // Phone clicks
  phoneClick: (phoneNumber: string) => {
    gtmEvent('phone_click', {
      phone_number: phoneNumber,
      page: window.location.pathname,
    })
  },

  // Downloads
  downloadClick: (fileName: string, fileType: string) => {
    gtmEvent('file_download', {
      file_name: fileName,
      file_type: fileType,
    })
  },

  // Video engagement
  videoPlay: (videoTitle: string) => {
    gtmEvent('video_play', {
      video_title: videoTitle,
    })
  },

  videoComplete: (videoTitle: string) => {
    gtmEvent('video_complete', {
      video_title: videoTitle,
    })
  },

  // CTA clicks
  ctaClick: (ctaText: string, ctaLocation: string) => {
    gtmEvent('cta_click', {
      cta_text: ctaText,
      cta_location: ctaLocation,
    })
  },

  // Service requests
  serviceRequest: (serviceType: string) => {
    gtmEvent('service_request', {
      service_type: serviceType,
    })
  },

  // Calculator usage
  calculatorComplete: (result: any) => {
    gtmEvent('calculator_complete', {
      result_value: result,
    })
  },

  // Blog engagement
  blogRead: (articleTitle: string, readPercentage: number) => {
    gtmEvent('blog_read', {
      article_title: articleTitle,
      read_percentage: readPercentage,
    })
  },
}

// Extend window type for TypeScript
declare global {
  interface Window {
    dataLayer: any[]
  }
}

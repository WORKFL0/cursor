'use client'

import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google'
import { useEffect } from 'react'
import Script from 'next/script'

interface GoogleAnalyticsProps {
  measurementId?: string
  enabled?: boolean
  debugMode?: boolean
}

export function GoogleAnalytics({ 
  measurementId = process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  enabled = process.env.ENABLE_ANALYTICS !== 'false',
  debugMode = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true' || process.env.NODE_ENV === 'development'
}: GoogleAnalyticsProps) {
  
  useEffect(() => {
    if (debugMode) {
      console.log('[GA4] Configuration:', {
        measurementId,
        enabled,
        debugMode
      })
    }
  }, [measurementId, enabled, debugMode])

  // Don't render if not enabled or no measurement ID
  if (!enabled || !measurementId) {
    if (debugMode) {
      console.log('[GA4] Not loading - disabled or missing measurement ID')
    }
    return null
  }

  return (
    <>
      <NextGoogleAnalytics gaId={measurementId} />
      
      {/* Additional GA4 configuration */}
      <Script
        id="ga4-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.gtag('config', '${measurementId}', {
              // Privacy settings
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
              
              // Cookie settings
              cookie_expires: 7776000, // 90 days
              cookie_update: true,
              cookie_prefix: 'workflo',
              
              // Enhanced measurement settings
              enhanced_measurement: {
                scrolls: true,
                outbound_clicks: true,
                site_search: true,
                video_engagement: true,
                file_downloads: true
              },
              
              // Custom parameters
              custom_map: {
                'custom_parameter_1': 'user_type',
                'custom_parameter_2': 'page_category'
              },
              
              // Debug mode
              debug_mode: ${debugMode}
            });
            
            // Set default user properties
            window.gtag('set', {
              'currency': 'EUR',
              'country': 'NL',
              'language': 'nl'
            });
            
            // Track initial page view with enhanced data
            window.gtag('event', 'page_view', {
              'page_title': document.title,
              'page_location': window.location.href,
              'page_referrer': document.referrer,
              'user_agent': navigator.userAgent,
              'screen_resolution': screen.width + 'x' + screen.height,
              'viewport_size': window.innerWidth + 'x' + window.innerHeight
            });
          `
        }}
      />

      {/* Enhanced E-commerce configuration */}
      <Script
        id="ga4-ecommerce"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Enhanced E-commerce tracking setup
            window.gtag('config', '${measurementId}', {
              // E-commerce settings
              send_page_view: false, // We handle this manually above
              
              // Conversion settings
              conversion_linker: true,
              
              // Attribution settings
              attribution_reporting_enabled: true,
              ads_data_redaction: true
            });
          `
        }}
      />

      {/* Custom event listeners */}
      <Script
        id="ga4-custom-events"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Track scroll depth
            let scrollDepths = [25, 50, 75, 90, 100];
            let scrolled = [];
            
            window.addEventListener('scroll', function() {
              let scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
              );
              
              scrollDepths.forEach(function(depth) {
                if (scrollPercent >= depth && !scrolled.includes(depth)) {
                  scrolled.push(depth);
                  window.gtag('event', 'scroll', {
                    'event_category': 'engagement',
                    'event_label': depth + '%',
                    'value': depth
                  });
                }
              });
            });
            
            // Track time on page
            let timeOnPage = 0;
            let timeTracked = [];
            let timeIntervals = [30, 60, 120, 300, 600]; // 30s, 1m, 2m, 5m, 10m
            
            setInterval(function() {
              timeOnPage += 10;
              
              timeIntervals.forEach(function(interval) {
                if (timeOnPage >= interval && !timeTracked.includes(interval)) {
                  timeTracked.push(interval);
                  window.gtag('event', 'timing_complete', {
                    'event_category': 'engagement',
                    'event_label': interval + 's',
                    'value': interval
                  });
                }
              });
            }, 10000); // Check every 10 seconds
            
            // Track outbound links
            document.addEventListener('click', function(event) {
              let link = event.target.closest('a');
              if (link && link.hostname !== window.location.hostname) {
                window.gtag('event', 'click', {
                  'event_category': 'outbound',
                  'event_label': link.href,
                  'transport_type': 'beacon'
                });
              }
            });
            
            // Track form interactions
            document.addEventListener('submit', function(event) {
              let form = event.target;
              if (form.tagName === 'FORM') {
                let formName = form.name || form.id || 'unknown_form';
                window.gtag('event', 'form_submit', {
                  'event_category': 'engagement',
                  'event_label': formName
                });
              }
            });
            
            // Track JavaScript errors
            window.addEventListener('error', function(event) {
              window.gtag('event', 'exception', {
                'description': event.message,
                'fatal': false,
                'event_category': 'javascript_error'
              });
            });
            
            // Track unhandled promise rejections
            window.addEventListener('unhandledrejection', function(event) {
              window.gtag('event', 'exception', {
                'description': 'Unhandled promise rejection: ' + event.reason,
                'fatal': false,
                'event_category': 'javascript_error'
              });
            });
          `
        }}
      />

      {debugMode && (
        <Script
          id="ga4-debug"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              console.log('[GA4] Debug mode enabled');
              
              // Override gtag to log all events
              const originalGtag = window.gtag;
              window.gtag = function() {
                console.log('[GA4] Event:', arguments);
                return originalGtag.apply(this, arguments);
              };
            `
          }}
        />
      )}
    </>
  )
}
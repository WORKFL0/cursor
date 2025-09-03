'use client'

import Script from 'next/script'
import { useEffect } from 'react'

interface MicrosoftClarityProps {
  projectId?: string
  enabled?: boolean
  debugMode?: boolean
}

export function MicrosoftClarity({
  projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
  enabled = process.env.NEXT_PUBLIC_ENABLE_CLARITY === 'true',
  debugMode = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true'
}: MicrosoftClarityProps) {
  
  useEffect(() => {
    if (debugMode) {
      console.log('[Clarity] Configuration:', {
        projectId,
        enabled,
        debugMode
      })
    }
  }, [projectId, enabled, debugMode])

  // Don't render if not enabled or no project ID
  if (!enabled || !projectId) {
    if (debugMode) {
      console.log('[Clarity] Not loading - disabled or missing project ID')
    }
    return null
  }

  return (
    <>
      {/* Microsoft Clarity tracking code */}
      <Script
        id="microsoft-clarity"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${projectId}");
          `
        }}
      />

      {/* Enhanced Clarity configuration */}
      <Script
        id="clarity-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Wait for Clarity to load
            window.addEventListener('load', function() {
              if (typeof window.clarity !== 'undefined') {
                
                // Set custom tags for better segmentation
                window.clarity('set', 'page_type', document.body.dataset.pageType || 'unknown');
                window.clarity('set', 'user_type', localStorage.getItem('user_type') || 'anonymous');
                window.clarity('set', 'language', document.documentElement.lang || 'nl');
                window.clarity('set', 'device_type', /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'mobile' : 'desktop');
                
                // Track custom events
                window.clarity('event', 'page_load_complete');
                
                ${debugMode ? `
                // Debug logging
                console.log('[Clarity] Initialized with project ID: ${projectId}');
                
                // Override clarity to log all events
                const originalClarity = window.clarity;
                window.clarity = function() {
                  console.log('[Clarity] Event:', arguments);
                  return originalClarity.apply(this, arguments);
                };
                ` : ''}
              }
            });
          `
        }}
      />

      {/* Custom event tracking for Clarity */}
      <Script
        id="clarity-custom-events"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Track form interactions
            document.addEventListener('focusin', function(event) {
              if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
                if (typeof window.clarity !== 'undefined') {
                  window.clarity('event', 'form_field_focus', {
                    field_type: event.target.type || event.target.tagName.toLowerCase(),
                    field_name: event.target.name || event.target.id || 'unnamed'
                  });
                }
              }
            });
            
            // Track button clicks
            document.addEventListener('click', function(event) {
              if (event.target.tagName === 'BUTTON' || (event.target.tagName === 'A' && event.target.getAttribute('role') === 'button')) {
                if (typeof window.clarity !== 'undefined') {
                  window.clarity('event', 'button_click', {
                    button_text: event.target.textContent?.trim() || 'no_text',
                    button_type: event.target.type || 'button',
                    button_class: event.target.className || 'no_class'
                  });
                }
              }
            });
            
            // Track scroll milestones
            let clarityScrollTracked = [];
            window.addEventListener('scroll', function() {
              let scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
              );
              
              [25, 50, 75, 90, 100].forEach(function(milestone) {
                if (scrollPercent >= milestone && !clarityScrollTracked.includes(milestone)) {
                  clarityScrollTracked.push(milestone);
                  if (typeof window.clarity !== 'undefined') {
                    window.clarity('event', 'scroll_milestone', {
                      percentage: milestone
                    });
                  }
                }
              });
            });
            
            // Track rage clicks (multiple clicks in short time)
            let clickCount = 0;
            let clickTimer;
            document.addEventListener('click', function(event) {
              clickCount++;
              clearTimeout(clickTimer);
              
              clickTimer = setTimeout(function() {
                if (clickCount >= 3) {
                  if (typeof window.clarity !== 'undefined') {
                    window.clarity('event', 'rage_click', {
                      click_count: clickCount,
                      element_tag: event.target.tagName,
                      element_class: event.target.className || 'no_class'
                    });
                  }
                }
                clickCount = 0;
              }, 1000);
            });
            
            // Track page visibility changes
            document.addEventListener('visibilitychange', function() {
              if (typeof window.clarity !== 'undefined') {
                window.clarity('event', 'page_visibility_change', {
                  is_visible: !document.hidden
                });
              }
            });
            
            // Track JavaScript errors
            window.addEventListener('error', function(event) {
              if (typeof window.clarity !== 'undefined') {
                window.clarity('event', 'javascript_error', {
                  message: event.message,
                  filename: event.filename,
                  lineno: event.lineno,
                  colno: event.colno
                });
              }
            });
          `
        }}
      />

      {/* GDPR Compliance - Mask sensitive data */}
      <Script
        id="clarity-privacy"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Mask sensitive elements from recording
            document.addEventListener('DOMContentLoaded', function() {
              // Add privacy classes to sensitive elements
              const sensitiveSelectors = [
                'input[type="password"]',
                'input[type="email"]',
                'input[name*="phone"]',
                'input[name*="telephone"]',
                '.sensitive-data',
                '.privacy-sensitive'
              ];
              
              sensitiveSelectors.forEach(function(selector) {
                document.querySelectorAll(selector).forEach(function(element) {
                  element.classList.add('clarity-mask');
                });
              });
            });
          `
        }}
      />
    </>
  )
}
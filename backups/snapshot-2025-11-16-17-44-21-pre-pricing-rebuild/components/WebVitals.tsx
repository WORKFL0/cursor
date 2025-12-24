'use client'

import { useEffect } from 'react'
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      custom_parameter_1: metric.value,
      custom_parameter_2: metric.rating,
      custom_parameter_3: metric.delta,
      custom_parameter_4: metric.id,
    })
  }
  
  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id
    })
  }
}

export default function WebVitals() {
  useEffect(() => {
    // Measure Core Web Vitals
    getCLS(sendToAnalytics)
    getFID(sendToAnalytics) 
    getFCP(sendToAnalytics)
    getLCP(sendToAnalytics)
    getTTFB(sendToAnalytics)
    
    // Performance observer for additional metrics
    if ('PerformanceObserver' in window) {
      // Observe layout shifts
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift') {
            console.log('Layout shift detected:', entry)
          }
        }
      })
      
      observer.observe({ type: 'layout-shift', buffered: true })
      
      // Observe long tasks (blocking main thread)
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('Long task detected:', entry.duration + 'ms')
          }
        }
      })
      
      longTaskObserver.observe({ type: 'longtask', buffered: true })
      
      return () => {
        observer.disconnect()
        longTaskObserver.disconnect()
      }
    }
  }, [])
  
  // Preload critical resources
  useEffect(() => {
    // Preload fonts
    const fontLink = document.createElement('link')
    fontLink.rel = 'preload'
    fontLink.href = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
    fontLink.as = 'font'
    fontLink.type = 'font/woff2'
    fontLink.crossOrigin = 'anonymous'
    document.head.appendChild(fontLink)
    
    // Preload critical images
    const criticalImages = [
      '/images/workflo-logo.webp',
      '/images/hero-bg.webp'
    ]
    
    criticalImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = src
      link.as = 'image'
      document.head.appendChild(link)
    })
    
    // Prefetch likely next pages
    const prefetchPages = [
      '/diensten',
      '/contact',
      '/over-ons'
    ]
    
    prefetchPages.forEach(href => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = href
      document.head.appendChild(link)
    })
  }, [])
  
  // Intersection Observer for lazy loading optimization
  useEffect(() => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.classList.remove('lazy')
              observer.unobserve(img)
            }
          }
        })
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      })
      
      // Observe all lazy images
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img)
      })
      
      return () => imageObserver.disconnect()
    }
  }, [])
  
  return null // This component doesn't render anything
}
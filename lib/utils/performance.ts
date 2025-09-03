/**
 * Performance optimization utilities
 * Implements Core Web Vitals monitoring and optimization
 */

import React from 'react'

export interface PerformanceMetrics {
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  fcp?: number // First Contentful Paint
  ttfb?: number // Time to First Byte
  inp?: number // Interaction to Next Paint
}

export interface ResourceTiming {
  name: string
  duration: number
  transferSize: number
  encodedBodySize: number
  decodedBodySize: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {}
  private observers: PerformanceObserver[] = []

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers()
    }
  }

  /**
   * Initialize performance observers for Core Web Vitals
   */
  private initializeObservers() {
    // Largest Contentful Paint (LCP)
    this.observeMetric('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number }
      this.metrics.lcp = lastEntry.renderTime || lastEntry.startTime
      this.reportMetric('LCP', this.metrics.lcp)
    })

    // First Input Delay (FID)
    this.observeMetric('first-input', (entries) => {
      const firstInput = entries[0] as PerformanceEntry & { processingStart?: number }
      if (firstInput.processingStart) {
        this.metrics.fid = firstInput.processingStart - firstInput.startTime
        this.reportMetric('FID', this.metrics.fid)
      }
    })

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    this.observeMetric('layout-shift', (entries) => {
      for (const entry of entries as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
      this.metrics.cls = clsValue
      this.reportMetric('CLS', this.metrics.cls)
    })

    // First Contentful Paint (FCP)
    this.observeMetric('paint', (entries) => {
      const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        this.metrics.fcp = fcpEntry.startTime
        this.reportMetric('FCP', this.metrics.fcp)
      }
    })

    // Navigation Timing for TTFB
    this.observeNavigation()
  }

  /**
   * Observe specific performance metrics
   */
  private observeMetric(type: string, callback: (entries: PerformanceEntry[]) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries())
      })
      observer.observe({ entryTypes: [type] })
      this.observers.push(observer)
    } catch (error) {
      console.warn(`Performance observer for ${type} not supported`, error)
    }
  }

  /**
   * Observe navigation timing
   */
  private observeNavigation() {
    if ('navigation' in performance && performance.getEntriesByType) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      if (navigationEntries.length > 0) {
        const nav = navigationEntries[0]
        if (!nav) return
        this.metrics.ttfb = nav.responseStart - nav.fetchStart
        this.reportMetric('TTFB', this.metrics.ttfb)
      }
    }
  }

  /**
   * Report metric to analytics
   */
  private reportMetric(name: string, value: number) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'web_vitals', {
        metric_name: name,
        metric_value: Math.round(value),
        metric_rating: this.getRating(name, value),
        event_category: 'Performance'
      })
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name}: ${Math.round(value)}ms (${this.getRating(name, value)})`)
    }
  }

  /**
   * Get performance rating based on Core Web Vitals thresholds
   */
  private getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 800, poor: 1800 }
    }

    const threshold = thresholds[metric as keyof typeof thresholds]
    if (!threshold) return 'good'

    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * Analyze resource performance
   */
  analyzeResources(): ResourceTiming[] {
    if (typeof window === 'undefined' || !performance.getEntriesByType) {
      return []
    }

    const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    
    return resourceEntries
      .filter(entry => entry.transferSize > 0)
      .map(entry => ({
        name: entry.name,
        duration: entry.responseEnd - entry.startTime,
        transferSize: entry.transferSize,
        encodedBodySize: entry.encodedBodySize,
        decodedBodySize: entry.decodedBodySize
      }))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 20) // Top 20 slowest resources
  }

  /**
   * Measure function execution time
   */
  measureFunction<T>(name: string, fn: () => T): T {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    
    console.log(`${name}: ${Math.round(end - start)}ms`)
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'function_timing', {
        function_name: name,
        execution_time: Math.round(end - start),
        event_category: 'Performance'
      })
    }
    
    return result
  }

  /**
   * Measure async function execution time
   */
  async measureAsyncFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    const result = await fn()
    const end = performance.now()
    
    console.log(`${name}: ${Math.round(end - start)}ms`)
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'async_function_timing', {
        function_name: name,
        execution_time: Math.round(end - start),
        event_category: 'Performance'
      })
    }
    
    return result
  }

  /**
   * Generate performance report
   */
  generateReport() {
    const metrics = this.getMetrics()
    const resources = this.analyzeResources()
    
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: (navigator as any).connection?.effectiveType || 'unknown',
      metrics,
      slowestResources: resources.slice(0, 5),
      recommendations: this.generateRecommendations(metrics, resources)
    }

    return report
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(metrics: PerformanceMetrics, resources: ResourceTiming[]): string[] {
    const recommendations: string[] = []

    if (metrics.lcp && metrics.lcp > 2500) {
      recommendations.push('Optimize Largest Contentful Paint by reducing server response time and optimizing critical resources')
    }

    if (metrics.fid && metrics.fid > 100) {
      recommendations.push('Reduce First Input Delay by minimizing JavaScript execution time')
    }

    if (metrics.cls && metrics.cls > 0.1) {
      recommendations.push('Improve Cumulative Layout Shift by adding size attributes to images and avoiding dynamic content insertion')
    }

    if (metrics.ttfb && metrics.ttfb > 800) {
      recommendations.push('Reduce Time to First Byte by optimizing server response time')
    }

    // Check for large resources
    const largeResources = resources.filter(r => r.transferSize > 500000) // 500KB+
    if (largeResources.length > 0) {
      recommendations.push(`Optimize large resources: ${largeResources.map(r => r.name).join(', ')}`)
    }

    return recommendations
  }

  /**
   * Clean up observers
   */
  disconnect() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

/**
 * Resource loading optimization utilities
 */
export class ResourceOptimizer {
  /**
   * Preload critical resources
   */
  static preloadCriticalResources() {
    const criticalResources = [
      { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2' },
      { href: '/images/workflo-logo.webp', as: 'image' },
      { href: '/api/health', as: 'fetch' }
    ]

    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource.href
      link.as = resource.as
      if (resource.type) {
        link.type = resource.type
      }
      if (resource.as === 'font') {
        link.crossOrigin = 'anonymous'
      }
      document.head.appendChild(link)
    })
  }

  /**
   * Lazy load non-critical resources
   */
  static lazyLoadNonCritical() {
    // Lazy load analytics scripts
    if (typeof window !== 'undefined') {
      requestIdleCallback(() => {
        // Load analytics after idle
        console.log('Loading non-critical analytics...')
      })
    }
  }

  /**
   * Optimize bundle loading with dynamic imports
   */
  static async loadModuleWhenNeeded<T>(
    moduleLoader: () => Promise<{ default: T }>,
    trigger: () => boolean = () => true
  ): Promise<T | null> {
    if (!trigger()) return null

    try {
      const module = await moduleLoader()
      return module.default
    } catch (error) {
      console.error('Failed to load module:', error)
      return null
    }
  }

  /**
   * Implement service worker for caching
   */
  static async registerServiceWorker() {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service worker registered successfully')
        return registration
      } catch (error) {
        console.error('Service worker registration failed:', error)
        return null
      }
    }
    return null
  }
}

/**
 * Code splitting helpers
 */
export const dynamicImports = {
  /**
   * Load component when in viewport
   */
  loadWhenVisible: <T>(
    loader: () => Promise<{ default: React.ComponentType<T> }>,
    fallback: React.ComponentType<T>
  ) => {
    return React.lazy(() => {
      return new Promise(resolve => {
        const observer = new IntersectionObserver((entries) => {
          if (entries[0]?.isIntersecting) {
            observer.disconnect()
            loader().then(resolve as any)
          }
        })
        
        // Observe a placeholder element
        const placeholder = document.createElement('div')
        observer.observe(placeholder)
      })
    })
  },

  /**
   * Load component on user interaction
   */
  loadOnInteraction: <T>(
    loader: () => Promise<{ default: React.ComponentType<T> }>
  ) => {
    return React.lazy(() => {
      return new Promise(resolve => {
        const events = ['mousedown', 'touchstart', 'keydown']
        
        const loadComponent = () => {
          events.forEach(event => 
            document.removeEventListener(event, loadComponent)
          )
          loader().then(resolve as any)
        }
        
        events.forEach(event => 
          document.addEventListener(event, loadComponent, { once: true })
        )
      })
    })
  }
}

// Global instance
export const performanceMonitor = new PerformanceMonitor()

export default performanceMonitor
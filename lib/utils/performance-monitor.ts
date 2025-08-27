'use client'

/**
 * Performance monitoring utility for Core Web Vitals and page metrics
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private observers: PerformanceObserver[] = []
  private metrics: Map<string, number> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  /**
   * Initialize all performance monitoring
   */
  init() {
    if (typeof window === 'undefined') return

    this.observeLCP() // Largest Contentful Paint
    this.observeFID() // First Input Delay  
    this.observeCLS() // Cumulative Layout Shift
    this.observeFCP() // First Contentful Paint
    this.observeTTFB() // Time to First Byte
    this.observeINP() // Interaction to Next Paint

    // Report metrics after page is fully loaded
    window.addEventListener('load', () => {
      setTimeout(() => this.reportAllMetrics(), 1000)
    })
  }

  /**
   * Observe Largest Contentful Paint (LCP)
   * Target: < 2.5s
   */
  private observeLCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as PerformanceEventTiming
      
      const lcp = lastEntry.startTime
      this.metrics.set('lcp', lcp)
      
      this.logMetric('LCP', lcp, 'ms', lcp < 2500 ? 'good' : lcp < 4000 ? 'needs-improvement' : 'poor')
      this.sendToAnalytics('largest_contentful_paint', lcp)
    })
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] })
    this.observers.push(observer)
  }

  /**
   * Observe First Input Delay (FID)
   * Target: < 100ms
   */
  private observeFID() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        const fid = entry.processingStart - entry.startTime
        this.metrics.set('fid', fid)
        
        this.logMetric('FID', fid, 'ms', fid < 100 ? 'good' : fid < 300 ? 'needs-improvement' : 'poor')
        this.sendToAnalytics('first_input_delay', fid)
      })
    })
    
    observer.observe({ entryTypes: ['first-input'] })
    this.observers.push(observer)
  }

  /**
   * Observe Cumulative Layout Shift (CLS)
   * Target: < 0.1
   */
  private observeCLS() {
    let clsValue = 0
    let sessionValue = 0
    let sessionEntries: PerformanceEventTiming[] = []

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as PerformanceEventTiming[]) {
        // Only count layout shifts without recent user input
        if (!(entry as any).hadRecentInput) {
          const firstSessionEntry = sessionEntries[0]
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1]

          // If the entry occurred less than 1 second after the previous entry and
          // less than 5 seconds after the first entry in the session, include it
          if (sessionValue &&
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000) {
            sessionValue += (entry as any).value
            sessionEntries.push(entry)
          } else {
            sessionValue = (entry as any).value
            sessionEntries = [entry]
          }

          if (sessionValue > clsValue) {
            clsValue = sessionValue
            this.metrics.set('cls', clsValue)
            
            this.logMetric('CLS', clsValue, '', clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor')
            this.sendToAnalytics('cumulative_layout_shift', clsValue)
          }
        }
      }
    })
    
    observer.observe({ entryTypes: ['layout-shift'] })
    this.observers.push(observer)
  }

  /**
   * Observe First Contentful Paint (FCP)
   * Target: < 1.8s
   */
  private observeFCP() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          const fcp = entry.startTime
          this.metrics.set('fcp', fcp)
          
          this.logMetric('FCP', fcp, 'ms', fcp < 1800 ? 'good' : fcp < 3000 ? 'needs-improvement' : 'poor')
          this.sendToAnalytics('first_contentful_paint', fcp)
        }
      }
    })
    
    observer.observe({ entryTypes: ['paint'] })
    this.observers.push(observer)
  }

  /**
   * Observe Time to First Byte (TTFB)
   * Target: < 800ms
   */
  private observeTTFB() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        const ttfb = entry.responseStart
        this.metrics.set('ttfb', ttfb)
        
        this.logMetric('TTFB', ttfb, 'ms', ttfb < 800 ? 'good' : ttfb < 1800 ? 'needs-improvement' : 'poor')
        this.sendToAnalytics('time_to_first_byte', ttfb)
      })
    })
    
    observer.observe({ entryTypes: ['navigation'] })
    this.observers.push(observer)
  }

  /**
   * Observe Interaction to Next Paint (INP)
   * Target: < 200ms
   */
  private observeINP() {
    const interactions: any[] = []

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (entry.interactionId) {
          interactions.push(entry)
          
          // Calculate INP as the 98th percentile of all interactions
          if (interactions.length >= 10) {
            const sortedInteractions = interactions
              .map(i => i.duration)
              .sort((a, b) => a - b)
            
            const inp = sortedInteractions[Math.floor(sortedInteractions.length * 0.98)]
            this.metrics.set('inp', inp)
            
            this.logMetric('INP', inp, 'ms', inp < 200 ? 'good' : inp < 500 ? 'needs-improvement' : 'poor')
            this.sendToAnalytics('interaction_to_next_paint', inp)
          }
        }
      }
    })
    
    observer.observe({ entryTypes: ['event'] })
    this.observers.push(observer)
  }

  /**
   * Measure custom performance marks
   */
  measureCustomMetric(name: string, startMark?: string, endMark?: string) {
    if (typeof window === 'undefined') return

    try {
      if (startMark && endMark) {
        performance.measure(name, startMark, endMark)
      }
      
      const entries = performance.getEntriesByName(name, 'measure')
      if (entries.length > 0) {
        const duration = entries[entries.length - 1].duration
        this.metrics.set(name, duration)
        this.logMetric(name, duration, 'ms', 'info')
        this.sendToAnalytics(`custom_${name.toLowerCase().replace(/\s/g, '_')}`, duration)
      }
    } catch (error) {
      console.warn('Failed to measure custom metric:', name, error)
    }
  }

  /**
   * Track page load performance
   */
  trackPageLoad() {
    if (typeof window === 'undefined') return

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      const metrics = {
        dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp_connection: navigation.connectEnd - navigation.connectStart,
        server_response: navigation.responseStart - navigation.requestStart,
        dom_parsing: navigation.domContentLoadedEventStart - navigation.responseEnd,
        resource_loading: navigation.loadEventStart - navigation.domContentLoadedEventEnd,
        total_load_time: navigation.loadEventEnd - navigation.navigationStart
      }

      Object.entries(metrics).forEach(([key, value]) => {
        this.metrics.set(key, value)
        this.logMetric(key.replace(/_/g, ' ').toUpperCase(), value, 'ms', 'info')
        this.sendToAnalytics(key, value)
      })
    })
  }

  /**
   * Get current performance score based on Core Web Vitals
   */
  getPerformanceScore(): { score: number; grade: string; details: any } {
    const lcp = this.metrics.get('lcp') || 0
    const fid = this.metrics.get('fid') || 0
    const cls = this.metrics.get('cls') || 0
    const fcp = this.metrics.get('fcp') || 0
    const ttfb = this.metrics.get('ttfb') || 0

    let score = 100

    // LCP scoring (25% weight)
    if (lcp > 4000) score -= 25
    else if (lcp > 2500) score -= 15

    // FID scoring (25% weight)  
    if (fid > 300) score -= 25
    else if (fid > 100) score -= 15

    // CLS scoring (25% weight)
    if (cls > 0.25) score -= 25
    else if (cls > 0.1) score -= 15

    // FCP scoring (15% weight)
    if (fcp > 3000) score -= 15
    else if (fcp > 1800) score -= 8

    // TTFB scoring (10% weight)
    if (ttfb > 1800) score -= 10
    else if (ttfb > 800) score -= 5

    const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F'

    return {
      score: Math.max(0, Math.round(score)),
      grade,
      details: {
        lcp: { value: lcp, threshold: 2500, weight: 25 },
        fid: { value: fid, threshold: 100, weight: 25 },
        cls: { value: cls, threshold: 0.1, weight: 25 },
        fcp: { value: fcp, threshold: 1800, weight: 15 },
        ttfb: { value: ttfb, threshold: 800, weight: 10 }
      }
    }
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const score = this.getPerformanceScore()
    const allMetrics = Array.from(this.metrics.entries())

    let report = `\n🚀 PERFORMANCE REPORT\n`
    report += `========================\n`
    report += `Overall Score: ${score.score}/100 (${score.grade})\n\n`

    report += `📊 Core Web Vitals:\n`
    Object.entries(score.details).forEach(([key, data]: [string, any]) => {
      const status = data.value < data.threshold ? '✅' : '❌'
      report += `${status} ${key.toUpperCase()}: ${data.value.toFixed(data.value < 1 ? 3 : 0)}${key === 'cls' ? '' : 'ms'} (target: <${data.threshold}${key === 'cls' ? '' : 'ms'})\n`
    })

    if (allMetrics.length > 5) {
      report += `\n📈 Additional Metrics:\n`
      allMetrics
        .filter(([key]) => !['lcp', 'fid', 'cls', 'fcp', 'ttfb'].includes(key))
        .forEach(([key, value]) => {
          report += `• ${key.replace(/_/g, ' ').toUpperCase()}: ${value.toFixed(0)}ms\n`
        })
    }

    return report
  }

  /**
   * Log metric with color coding
   */
  private logMetric(name: string, value: number, unit: string, status: string) {
    const colors = {
      good: '#16a34a',
      'needs-improvement': '#ea580c', 
      poor: '#dc2626',
      info: '#2563eb'
    }

    const color = colors[status as keyof typeof colors] || colors.info
    
    console.log(
      `%c📊 ${name}: ${value.toFixed(value < 1 ? 3 : 0)}${unit} (${status})`,
      `color: ${color}; font-weight: bold;`
    )
  }

  /**
   * Send metrics to analytics
   */
  private sendToAnalytics(event: string, value: number) {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, {
        value: Math.round(value),
        event_category: 'Web Vitals',
        custom_parameter: true
      })
    }

    // Microsoft Clarity custom events
    if (typeof window !== 'undefined' && (window as any).clarity) {
      (window as any).clarity('set', event, Math.round(value))
    }
  }

  /**
   * Report all metrics to console and analytics
   */
  reportAllMetrics() {
    console.log(this.generateReport())
    
    const score = this.getPerformanceScore()
    this.sendToAnalytics('performance_score', score.score)
    
    // Send grade as custom event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_grade', {
        grade: score.grade,
        event_category: 'Performance'
      })
    }
  }

  /**
   * Clean up observers
   */
  disconnect() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.metrics.clear()
  }
}

/**
 * React hook for performance monitoring
 */
export function usePerformanceMonitoring(enabled = true) {
  if (typeof window === 'undefined' || !enabled) return

  const monitor = PerformanceMonitor.getInstance()
  
  // Initialize on first use
  if (!monitor.metrics) {
    monitor.init()
    monitor.trackPageLoad()
  }

  return {
    measureCustomMetric: monitor.measureCustomMetric.bind(monitor),
    getPerformanceScore: monitor.getPerformanceScore.bind(monitor),
    generateReport: monitor.generateReport.bind(monitor)
  }
}

export default PerformanceMonitor
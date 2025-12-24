import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

export const initSentry = () => {
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not configured')
    return
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,
    
    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Session replay for better debugging
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Error filtering
    beforeSend(event, hint) {
      // Filter out known non-critical errors
      if (event.exception) {
        const error = hint.originalException
        if (error instanceof Error) {
          // Skip common browser errors
          if (error.message.includes('ResizeObserver loop limit exceeded') ||
              error.message.includes('Non-Error promise rejection captured') ||
              error.message.includes('Script error')) {
            return null
          }
        }
      }
      
      // Don't send errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Sentry error (not sent in dev):', event)
        return null
      }
      
      return event
    },
    
    // Performance filtering
    beforeSendTransaction(event) {
      // Sample transactions based on operation
      if (event.transaction?.includes('api/')) {
        // Lower sampling for API routes
        return Math.random() < 0.01 ? event : null
      }
      return event
    },
    
    // Additional configuration
    debug: process.env.NODE_ENV === 'development',
    integrations: [
      // TODO: Update Sentry integrations for newer SDK version
      // BrowserTracing and Replay are not available in the current version
    ],
    
    // Set user context
    initialScope: {
      tags: {
        component: 'workflo-website',
        version: process.env.npm_package_version || 'unknown',
      },
    },
  })

  // Set up custom error boundary
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      Sentry.captureException(event.reason)
    })
  }
}

// Custom error tracking functions
export const trackError = (error: Error, context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('error_context', context)
    }
    scope.setLevel('error')
    Sentry.captureException(error)
  })
}

export const trackPerformance = (name: string, duration: number, data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    category: 'performance',
    message: `${name} took ${duration}ms`,
    level: 'info',
    data,
  })
}

export const setUserContext = (user: { id: string; email?: string; [key: string]: any }) => {
  Sentry.setUser(user)
}

export const addBreadcrumb = (message: string, category: string = 'custom', data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    message,
    category,
    level: 'info',
    data,
  })
}
'use client'

import React from 'react'
import * as Sentry from '@sentry/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  eventId?: string
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
  level?: 'page' | 'component' | 'critical'
  name?: string
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo)

    // Track error with Sentry
    const eventId = Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
        errorBoundary: {
          name: this.props.name || 'Unknown',
          level: this.props.level || 'component',
        },
      },
      tags: {
        errorBoundary: true,
        level: this.props.level || 'component',
      },
    })

    this.setState({
      error,
      errorInfo,
      eventId,
    })

    // Track error in analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: this.props.level === 'critical',
        event_category: 'react_error_boundary',
        event_label: this.props.name || 'unknown',
      })
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, eventId: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback component
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} retry={this.retry} />
      }

      // Default error UI based on level
      return this.renderErrorUI()
    }

    return this.props.children
  }

  private renderErrorUI() {
    const { level = 'component' } = this.props
    const { error, eventId } = this.state

    if (level === 'critical') {
      return <CriticalErrorFallback error={error!} eventId={eventId} retry={this.retry} />
    }

    if (level === 'page') {
      return <PageErrorFallback error={error!} eventId={eventId} retry={this.retry} />
    }

    return <ComponentErrorFallback error={error!} retry={this.retry} />
  }
}

// Critical error fallback (full page)
function CriticalErrorFallback({ 
  error, 
  eventId, 
  retry 
}: { 
  error: Error
  eventId?: string
  retry: () => void 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-900">Kritieke Fout</CardTitle>
          <CardDescription>
            Er is een onverwachte fout opgetreden. Onze technische dienst is op de hoogte gesteld.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-red-50 p-3 rounded-md">
              <p className="text-sm font-medium text-red-800">Development Error:</p>
              <p className="text-sm text-red-700 font-mono">{error.message}</p>
            </div>
          )}
          
          {eventId && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">
                Fout ID: <span className="font-mono text-xs">{eventId}</span>
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            <Button onClick={retry} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Probeer Opnieuw
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'} 
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Naar Home
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Hulp nodig? Bel{' '}
              <a href="tel:+31203080465" className="text-workflo-yellow-dark hover:underline">
                020 308 0465
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Page error fallback
function PageErrorFallback({ 
  error, 
  eventId, 
  retry 
}: { 
  error: Error
  eventId?: string
  retry: () => void 
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <CardTitle className="text-xl">Oops! Er ging iets mis</CardTitle>
          <CardDescription>
            Deze pagina kon niet correct worden geladen. Probeer het opnieuw.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-yellow-50 p-3 rounded-md">
              <p className="text-sm font-medium text-yellow-800">Development Error:</p>
              <p className="text-sm text-yellow-700 font-mono">{error.message}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <Button onClick={retry} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Probeer Opnieuw
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'} 
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Component error fallback
function ComponentErrorFallback({ 
  error, 
  retry 
}: { 
  error: Error
  retry: () => void 
}) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-red-600" />
        <h3 className="text-sm font-medium text-red-800">Component Error</h3>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <p className="text-sm text-red-700 mb-2 font-mono">{error.message}</p>
      )}
      
      <Button onClick={retry} size="sm" variant="outline">
        <RefreshCw className="w-3 h-3 mr-1" />
        Retry
      </Button>
    </div>
  )
}

// Higher-order component wrapper
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  return WrappedComponent
}

// React hook for error handling
export function useErrorHandler() {
  return React.useCallback((error: Error, errorInfo?: Record<string, any>) => {
    console.error('Manual error report:', error)
    
    // Track with Sentry
    Sentry.captureException(error, {
      extra: errorInfo,
      tags: { manual_report: true }
    })

    // Track with analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        event_category: 'manual_error_report',
      })
    }
  }, [])
}
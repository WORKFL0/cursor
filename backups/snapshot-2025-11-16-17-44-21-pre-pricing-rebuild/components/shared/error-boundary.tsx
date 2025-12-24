'use client'

import React, { Component, ReactNode, ErrorInfo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  showDetails?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error, 
      errorInfo: null 
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI with IT humor
      return (
        <Card className="max-w-2xl mx-auto m-8 border-destructive/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-destructive/10 rounded-full">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-xl text-destructive">
              Oeps! Er ging iets mis 🔧
            </CardTitle>
            <p className="text-muted-foreground">
              Onze componenten hebben blijkbaar koffie nodig...
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* IT Humor Error Message */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-foreground font-medium mb-2">
                🖥️ IT Diagnose:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Component heeft een burnout gekregen</li>
                <li>• Mogelijk te veel React re-renders</li>
                <li>• Of gewoon een slechte dag...</li>
              </ul>
            </div>

            {/* Technical Details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.props.showDetails && this.state.error && (
              <details className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                <summary className="cursor-pointer text-sm font-medium text-destructive mb-2">
                  <Bug className="w-4 h-4 inline mr-2" />
                  Technische Details (Development Only)
                </summary>
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Error:</p>
                    <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Component Stack:</p>
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => window.location.reload()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Pagina Herladen
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Terug naar Home
              </Button>
            </div>

            {/* Support Information */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-foreground">
                <strong>Probleem blijft bestaan?</strong>
                <br />
                Neem contact op met ons IT support team:
              </p>
              <div className="mt-2 space-y-1 text-sm">
                <p>
                  📞 <a href="tel:+31203080465" className="text-primary hover:underline">020-30 80 465</a>
                </p>
                <p>
                  📧 <a href="mailto:info@workflo.it" className="text-primary hover:underline">info@workflo.it</a>
                </p>
              </div>
            </div>

            {/* Workflo Branding */}
            <div className="text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Workflo - We fix IT problems (including our own) 🔧
              </p>
            </div>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}

// Hook-based error boundary for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error handled by hook:', error, errorInfo)
    // You can implement custom error reporting here
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: ReactNode,
  showDetails: boolean = false
) {
  const WrappedComponent = (props: T) => (
    <ErrorBoundary fallback={fallback} showDetails={showDetails}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}
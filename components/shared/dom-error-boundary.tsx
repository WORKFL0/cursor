'use client'

import React, { Component, ReactNode } from 'react'

interface DomErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  isRecovering: boolean
}

interface DomErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  autoRecover?: boolean
  recoveryDelay?: number
}

/**
 * Error boundary specifically designed to handle DOM manipulation errors
 * common in Next.js 15 with React 19, especially with third-party scripts like HubSpot
 */
export class DomErrorBoundary extends Component<DomErrorBoundaryProps, DomErrorBoundaryState> {
  private recoveryTimer?: NodeJS.Timeout

  constructor(props: DomErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      isRecovering: false
    }
  }

  static getDerivedStateFromError(error: Error): Partial<DomErrorBoundaryState> {
    // Check if it's a DOM manipulation error that we can recover from
    const isDomError = this.isDomManipulationError(error)
    
    return {
      hasError: true,
      error,
      isRecovering: false
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error for debugging
    console.warn('DOM Error Boundary caught error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      isDomError: DomErrorBoundary.isDomManipulationError(error)
    })

    this.setState({
      error,
      errorInfo
    })

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // Auto-recover from DOM errors after delay
    if (this.props.autoRecover !== false && DomErrorBoundary.isDomManipulationError(error)) {
      this.startRecovery()
    }
  }

  componentWillUnmount() {
    if (this.recoveryTimer) {
      clearTimeout(this.recoveryTimer)
    }
  }

  public static isDomManipulationError(error: Error): boolean {
    const domErrorPatterns = [
      /failed to execute 'removechild'/i,
      /the node to be removed is not a child/i,
      /node is not a child of this node/i,
      /cannot read property 'removechild'/i,
      /cannot read properties of null \(reading 'removechild'\)/i,
      /hubspot.*dom/i
    ]

    return domErrorPatterns.some(pattern => 
      pattern.test(error.message) || 
      (error.stack && pattern.test(error.stack))
    )
  }

  private startRecovery = () => {
    const delay = this.props.recoveryDelay || 100

    this.setState({ isRecovering: true })

    this.recoveryTimer = setTimeout(() => {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        isRecovering: false
      })
    }, delay)
  }

  private handleManualRetry = () => {
    this.startRecovery()
  }

  render() {
    if (this.state.hasError) {
      const isDomError = this.state.error && DomErrorBoundary.isDomManipulationError(this.state.error)

      // For DOM errors, show minimal disruption
      if (isDomError) {
        if (this.state.isRecovering) {
          return (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-workflo-yellow border-t-transparent"></div>
              <span className="ml-2 text-sm text-muted-foreground">Loading form...</span>
            </div>
          )
        }

        return (
          <div className="rounded-lg border border-workflo-yellow/30 bg-workflo-yellow-light dark:border-workflo-yellow dark:bg-workflo-yellow/20 p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-workflo-yellow dark:bg-workflo-yellow flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-workflo-yellow-dark dark:text-workflo-yellow">
                  Form Loading Issue
                </h3>
                <p className="text-xs text-workflo-yellow-dark/80 dark:text-workflo-yellow/80 mt-1">
                  There was a temporary issue loading the form. 
                </p>
              </div>
              <button
                onClick={this.handleManualRetry}
                className="text-xs bg-workflo-yellow-light hover:bg-workflo-yellow/20 dark:bg-workflo-yellow/30 dark:hover:bg-workflo-yellow/40 text-workflo-yellow-dark dark:text-workflo-yellow px-2 py-1 rounded transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )
      }

      // For other errors, use custom fallback or default
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-red-500 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Something went wrong
              </h3>
              <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
            </div>
            <button
              onClick={this.handleManualRetry}
              className="text-xs bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-200 px-2 py-1 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// React hooks version for functional components
export function useDomErrorRecovery(
  onError?: (error: Error) => void
): {
  hasError: boolean
  error?: Error
  recover: () => void
} {
  const [hasError, setHasError] = React.useState(false)
  const [error, setError] = React.useState<Error | undefined>()

  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason instanceof Error && DomErrorBoundary.isDomManipulationError(event.reason)) {
        console.warn('Unhandled DOM error recovered:', event.reason)
        event.preventDefault()
      }
    }

    const handleError = (event: ErrorEvent) => {
      if (event.error && DomErrorBoundary.isDomManipulationError(event.error)) {
        console.warn('Global DOM error recovered:', event.error)
        setHasError(true)
        setError(event.error)
        onError?.(event.error)
        event.preventDefault()
      }
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [onError])

  const recover = React.useCallback(() => {
    setHasError(false)
    setError(undefined)
  }, [])

  return { hasError, error, recover }
}
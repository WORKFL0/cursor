'use client'

import { motion } from 'framer-motion'
import { Loader2, Wifi, Send, Database, Cloud } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Generic Loading Spinner
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && <span className="text-muted-foreground">{text}</span>}
    </div>
  )
}

// Form Loading State
interface FormLoadingProps {
  message?: string
  type?: 'contact' | 'newsletter' | 'generic'
}

export function FormLoading({ message, type = 'generic' }: FormLoadingProps) {
  const getIcon = () => {
    switch (type) {
      case 'contact':
        return <Send className="w-5 h-5" />
      case 'newsletter':
        return <Database className="w-5 h-5" />
      default:
        return <Loader2 className="w-5 h-5" />
    }
  }

  const getDefaultMessage = () => {
    switch (type) {
      case 'contact':
        return 'Bericht wordt verzonden...'
      case 'newsletter':
        return 'Inschrijving wordt verwerkt...'
      default:
        return 'Bezig met verwerken...'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="text-primary"
      >
        {getIcon()}
      </motion.div>
      <span className="text-sm font-medium text-foreground">
        {message || getDefaultMessage()}
      </span>
    </motion.div>
  )
}

// Page Loading State
interface PageLoadingProps {
  message?: string
  showLogo?: boolean
}

export function PageLoading({ message = 'Pagina wordt geladen...', showLogo = true }: PageLoadingProps) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-6">
            {showLogo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold text-primary"
              >
                Workflo
              </motion.div>
            )}
            
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="flex justify-center"
            >
              <Loader2 className="w-8 h-8 text-primary" />
            </motion.div>
            
            <p className="text-muted-foreground">{message}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Data Fetching Loading State
interface DataLoadingProps {
  rows?: number
  showHeader?: boolean
  className?: string
}

export function DataLoading({ rows = 3, showHeader = true, className }: DataLoadingProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {showHeader && (
        <div className="space-y-2">
          <div className="h-8 bg-muted/50 rounded animate-pulse" />
          <div className="h-4 bg-muted/30 rounded w-2/3 animate-pulse" />
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="space-y-2"
          >
            <div className="h-4 bg-muted/40 rounded animate-pulse" />
            <div className="h-4 bg-muted/30 rounded w-4/5 animate-pulse" />
            <div className="h-4 bg-muted/20 rounded w-3/5 animate-pulse" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Connection Status Loading
interface ConnectionLoadingProps {
  status: 'connecting' | 'connected' | 'error'
  service?: string
}

export function ConnectionLoading({ status, service = 'service' }: ConnectionLoadingProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'connecting':
        return <Wifi className="w-5 h-5 text-workflo-yellow animate-pulse" />
      case 'connected':
        return <Cloud className="w-5 h-5 text-green-500" />
      case 'error':
        return <Wifi className="w-5 h-5 text-red-500" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'connecting':
        return `Verbinding maken met ${service}...`
      case 'connected':
        return `Verbonden met ${service}`
      case 'error':
        return `Verbinding met ${service} mislukt`
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'connecting':
        return 'border-workflo-yellow bg-workflo-yellow/10'
      case 'connected':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex items-center gap-3 p-3 rounded-lg border', getStatusColor())}
    >
      {getStatusIcon()}
      <span className="text-sm font-medium">{getStatusText()}</span>
    </motion.div>
  )
}

// IT-themed Loading with Humor
export function ITLoadingMessage() {
  const messages = [
    { text: "Koffie wordt gezet...", icon: "☕" },
    { text: "Bytes worden gesorteerd...", icon: "💾" },
    { text: "Servers worden wakker gemaakt...", icon: "🖥️" },
    { text: "Code wordt gecompileerd...", icon: "⚡" },
    { text: "Cache wordt geleegd...", icon: "🗑️" },
    { text: "IT afdeling zoekt USB-stick...", icon: "🔌" },
    { text: "Have you tried turning it off and on again?", icon: "🔄" },
    { text: "Workflo magie aan het werk...", icon: "✨" }
  ]

  const randomMessage = messages[Math.floor(Math.random() * messages.length)] || { text: "Loading...", icon: "⏳" }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg"
    >
      <span className="text-2xl animate-bounce">{randomMessage.icon}</span>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{randomMessage.text}</p>
        <div className="flex items-center gap-2">
          <Loader2 className="w-3 h-3 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground">Workflo IT Services</span>
        </div>
      </div>
    </motion.div>
  )
}

// Button Loading State
interface ButtonLoadingProps {
  isLoading: boolean
  loadingText?: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export function LoadingButton({ 
  isLoading, 
  loadingText, 
  children, 
  className,
  onClick,
  disabled,
  type = 'button'
}: ButtonLoadingProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </Button>
  )
}

// Page Transition Loading
export function PageTransitionLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <Card className="bg-background/95 shadow-xl">
        <CardHeader>
          <ITLoadingMessage />
        </CardHeader>
      </Card>
    </motion.div>
  )
}
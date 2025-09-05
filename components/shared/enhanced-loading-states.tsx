'use client'

import { motion } from '@/lib/framer-motion'
import { Loader2, Zap, Sparkles } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'workflo' | 'pulse'
  message?: string
  className?: string
}

interface LoadingSkeletonProps {
  lines?: number
  className?: string
}

interface ButtonLoadingProps {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
  icon?: React.ReactNode
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'workflo', 
  message, 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  if (variant === 'workflo') {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
        <motion.div
          className={`${sizeClasses[size]} relative`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          {/* Outer Ring */}
          <div className="absolute inset-0 border-2 border-workflo-yellow/30 rounded-full" />
          {/* Inner Spinning Element */}
          <div className="absolute inset-1 border-2 border-transparent border-t-workflo-yellow rounded-full" />
          {/* Center Dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Zap className="w-3 h-3 text-workflo-yellow" />
          </div>
        </motion.div>
        
        {message && (
          <motion.p 
            className="text-sm text-muted-foreground text-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {message}
          </motion.p>
        )}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
        <motion.div
          className={`${sizeClasses[size]} bg-workflo-yellow rounded-full`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        {message && (
          <p className="text-sm text-muted-foreground text-center">{message}</p>
        )}
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} text-workflo-yellow animate-spin`} />
      {message && (
        <p className="text-sm text-muted-foreground text-center">{message}</p>
      )}
    </div>
  )
}

export function LoadingSkeleton({ lines = 3, className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className="h-4 bg-muted rounded-md"
          style={{ width: `${Math.random() * 40 + 60}%` }}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            delay: i * 0.2 
          }}
        />
      ))}
    </div>
  )
}

export function ButtonLoading({
  isLoading,
  children,
  loadingText = 'Loading...',
  icon,
  className = '',
  onClick,
  type = 'button',
  disabled
}: ButtonLoadingProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`
        relative overflow-hidden
        min-h-[44px] px-6 py-3 
        bg-workflo-yellow text-black font-semibold rounded-lg
        hover:bg-workflo-yellow/90 
        disabled:opacity-70 disabled:cursor-not-allowed
        transition-all duration-200
        focus:ring-2 focus:ring-workflo-yellow focus:ring-offset-2
        ${className}
      `}
    >
      <motion.div
        className="flex items-center justify-center gap-2"
        animate={{ opacity: isLoading ? 0.7 : 1 }}
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" variant="default" />
            {loadingText}
          </>
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </motion.div>
      
      {/* Loading overlay */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-workflo-yellow/20"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </button>
  )
}

export function FormLoadingState({ message = 'Processing your request...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg border">
      <LoadingSpinner size="lg" variant="workflo" />
      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-foreground mb-2">Please wait...</h3>
        <p className="text-muted-foreground">{message}</p>
      </motion.div>
    </div>
  )
}

export function PageLoadingState() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative">
          <motion.div
            className="w-16 h-16 border-4 border-workflo-yellow/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 border-4 border-transparent border-t-workflo-yellow rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-workflo-yellow" />
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Loading Workflo</h2>
          <p className="text-muted-foreground">Getting everything ready for you...</p>
        </div>
      </motion.div>
    </div>
  )
}
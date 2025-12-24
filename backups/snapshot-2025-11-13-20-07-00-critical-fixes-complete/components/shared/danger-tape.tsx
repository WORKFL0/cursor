'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DangerTapeProps {
  variant?: 'subtle' | 'bold' | 'warning' | 'alert' | 'background'
  className?: string
  children?: ReactNode
  text?: string
  animate?: boolean
}

export default function DangerTape({ 
  variant = 'subtle',
  className = '',
  children,
  text,
  animate = false
}: DangerTapeProps) {
  
  const getTapeStyle = () => {
    switch (variant) {
      case 'subtle':
        return {
          background: `repeating-linear-gradient(45deg, hsl(var(--workflo-yellow)) 0px, hsl(var(--workflo-yellow)) 8px, hsl(var(--muted)) 8px, hsl(var(--muted)) 16px)`,
          height: '2px',
          opacity: 0.4
        }
      case 'bold':
        return {
          background: `repeating-linear-gradient(45deg, hsl(var(--workflo-yellow)) 0px, hsl(var(--workflo-yellow)) 12px, #000000 12px, #000000 24px)`,
          height: '4px',
          opacity: 0.8
        }
      case 'warning':
        return {
          background: `repeating-linear-gradient(45deg, hsl(var(--workflo-yellow)) 0px, hsl(var(--workflo-yellow)) 15px, #dc2626 15px, #dc2626 30px)`,
          height: '6px',
          opacity: 0.9
        }
      case 'alert':
        return {
          background: `repeating-linear-gradient(45deg, hsl(var(--workflo-yellow)) 0px, hsl(var(--workflo-yellow)) 10px, #000000 10px, #000000 20px)`,
          height: '8px',
          opacity: 1
        }
      case 'background':
        return {
          background: `repeating-linear-gradient(45deg, transparent 0px, transparent 10px, hsl(var(--workflo-yellow)) 10px, hsl(var(--workflo-yellow)) 20px)`,
          height: '100%',
          opacity: 0.05
        }
      default:
        return {
          background: `repeating-linear-gradient(45deg, hsl(var(--workflo-yellow)) 0px, hsl(var(--workflo-yellow)) 8px, #f3f4f6 8px, #f3f4f6 16px)`,
          height: '2px',
          opacity: 0.6
        }
    }
  }

  const tapeStyle = getTapeStyle()
  
  if (children || text) {
    return (
      <div className={cn('relative', className)}>
        {children && (
          <div className="relative z-10">
            {children}
          </div>
        )}
        {text && (
          <div className="relative z-10 bg-workflo-yellow text-black px-4 py-2 font-bold text-center uppercase tracking-wider border-2 border-black shadow-lg">
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000000 10px, #000000 20px)',
              }}
            />
            <span className="relative z-10">⚠️ {text} ⚠️</span>
          </div>
        )}
        <div 
          className={cn(
            'absolute inset-0',
            animate && 'animate-pulse'
          )}
          style={tapeStyle}
        />
      </div>
    )
  }
  
  return (
    <div 
      className={cn(
        'w-full',
        animate && 'animate-pulse',
        className
      )}
      style={tapeStyle}
    />
  )
}

// Helper component for danger tape sections
export function DangerTapeSection({ 
  children, 
  className = '',
  title,
  subtitle 
}: { 
  children: ReactNode
  className?: string
  title?: string
  subtitle?: string
}) {
  return (
    <section className={cn('relative bg-gradient-to-br from-workflo-yellow-light/20 to-background border-l-2 border-workflo-yellow', className)}>
      <DangerTape variant="subtle" className="absolute top-0 left-0 right-0" />
      <div className="relative z-10 px-6 py-8">
        {title && (
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground text-lg">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
      <DangerTape variant="subtle" className="absolute bottom-0 left-0 right-0" />
    </section>
  )
}

// Emergency Alert Banner
export function EmergencyAlert({ 
  message, 
  action,
  onClose 
}: { 
  message: string
  action?: ReactNode
  onClose?: () => void
}) {
  return (
    <div className="relative bg-red-600 text-white py-3 px-4">
      <DangerTape variant="warning" className="absolute top-0 left-0 right-0" />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-workflo-yellow text-xl animate-pulse">🚨</span>
          <span className="font-bold uppercase tracking-wide">{message}</span>
        </div>
        <div className="flex items-center space-x-3">
          {action}
          {onClose && (
            <button 
              onClick={onClose}
              className="text-white hover:text-workflo-yellow transition-colors"
              aria-label="Close alert"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      <DangerTape variant="warning" className="absolute bottom-0 left-0 right-0" />
    </div>
  )
}
'use client'

import { ReactNode } from 'react'
import { LifeBuoy } from 'lucide-react'
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
            <span className="relative z-10">{text}</span>
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

// Premium Support Banner - Art Director Design System
// CALM blue background, LifeBuoy icon, no alarm styling
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
    <div className="relative bg-blue-50 dark:bg-blue-950/20 border-y border-blue-100 dark:border-blue-900/30 py-4 px-4">
      <div className="relative z-10 container mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-3">
          {/* Art Director: LifeBuoy icon - calm, helpful */}
          <LifeBuoy className="w-5 h-5 text-blue-600 dark:text-blue-400 stroke-2 flex-shrink-0" />
          <span className="text-base font-medium text-gray-800 dark:text-gray-200">{message}</span>
        </div>
        <div className="flex items-center gap-3">
          {action}
        </div>
      </div>
    </div>
  )
}
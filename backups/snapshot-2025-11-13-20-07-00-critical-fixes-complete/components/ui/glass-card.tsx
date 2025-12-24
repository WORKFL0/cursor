'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion, HTMLMotionProps } from 'framer-motion'

export interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  variant?: 'default' | 'primary' | 'secondary'
  hover3d?: boolean
  glowEffect?: boolean
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', hover3d = false, glowEffect = false, children, ...props }, ref) => {
    const [rotateX, setRotateX] = React.useState(0)
    const [rotateY, setRotateY] = React.useState(0)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hover3d) return

      const card = e.currentTarget
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateXValue = ((y - centerY) / centerY) * -10
      const rotateYValue = ((x - centerX) / centerX) * 10

      setRotateX(rotateXValue)
      setRotateY(rotateYValue)
    }

    const handleMouseLeave = () => {
      setRotateX(0)
      setRotateY(0)
    }

    const variants = {
      default: 'bg-white/80 dark:bg-gray-900/80 border-white/20 dark:border-gray-800/20',
      primary: 'bg-[#f2f400]/10 border-[#f2f400]/30',
      secondary: 'bg-blue-500/10 border-blue-500/30',
    }

    const glowVariants = {
      default: 'hover:shadow-white/20',
      primary: 'hover:shadow-[#f2f400]/30',
      secondary: 'hover:shadow-blue-500/30',
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          // Base styles
          'relative overflow-hidden rounded-xl border backdrop-blur-xl',
          // Glassmorphism
          'bg-clip-padding',
          // Variant styles
          variants[variant],
          // Shadow
          'shadow-lg',
          glowEffect && `hover:shadow-2xl ${glowVariants[variant]}`,
          // Transitions
          'transition-all duration-300 ease-out',
          // Hover effects
          'hover:-translate-y-1',
          // Custom className
          className
        )}
        style={{
          transform: hover3d ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` : undefined,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        {...props}
      >
        {/* Gradient overlay for depth */}
        {variant === 'primary' && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#f2f400]/5 via-transparent to-transparent pointer-events-none" />
        )}

        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">{children}</div>

        {/* Bottom glow */}
        {glowEffect && (
          <div
            className={cn(
              'absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500',
              variant === 'primary' && 'bg-gradient-to-r from-transparent via-[#f2f400] to-transparent',
              variant === 'secondary' && 'bg-gradient-to-r from-transparent via-blue-500 to-transparent',
              variant === 'default' && 'bg-gradient-to-r from-transparent via-white to-transparent'
            )}
          />
        )}
      </motion.div>
    )
  }
)
GlassCard.displayName = 'GlassCard'

const GlassCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
)
GlassCardHeader.displayName = 'GlassCardHeader'

const GlassCardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
  )
)
GlassCardTitle.displayName = 'GlassCardTitle'

const GlassCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
)
GlassCardDescription.displayName = 'GlassCardDescription'

const GlassCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
)
GlassCardContent.displayName = 'GlassCardContent'

const GlassCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
)
GlassCardFooter.displayName = 'GlassCardFooter'

export { GlassCard, GlassCardHeader, GlassCardFooter, GlassCardTitle, GlassCardDescription, GlassCardContent }

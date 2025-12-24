/**
 * Workflo Button System v2.0
 *
 * Implements the design system specifications from DESIGN_SYSTEM.md
 *
 * Three button variants:
 * - Primary: Yellow background, navy text, arrow icon, shadow
 * - Secondary: Transparent background, navy border, navy text
 * - Tertiary: Navy text link with arrow, no underline
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary:
          'bg-[#f2f400] text-[#0F172A] rounded-xl shadow-[0_4px_14px_rgba(242,244,0,0.25)] hover:shadow-[0_6px_20px_rgba(242,244,0,0.35)] hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-[#f2f400]',
        secondary:
          'bg-transparent border-2 border-[#0F172A] text-[#0F172A] rounded-xl hover:bg-[#0F172A] hover:text-white active:scale-[0.98] focus-visible:ring-[#0F172A]',
        tertiary:
          'bg-transparent text-[#0F172A] font-medium no-underline hover:text-[#f2f400] hover:translate-x-0.5 active:translate-x-0 p-0 h-auto',
      },
      size: {
        default: 'text-base px-8 py-4',
        sm: 'text-sm px-6 py-3',
        lg: 'text-lg px-10 py-5',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonV2Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  showArrow?: boolean
  href?: string
}

/**
 * Primary Button Component
 * Use for main action per section (max 1 per viewport)
 */
const ButtonV2 = React.forwardRef<HTMLButtonElement, ButtonV2Props>(
  ({ className, variant, size, showArrow = true, href, children, ...props }, ref) => {
    const Comp = href ? 'a' : 'button'
    const isLink = variant === 'tertiary'

    const content = (
      <>
        {children}
        {showArrow && variant !== 'secondary' && (
          <ArrowRight className={cn(
            'transition-transform',
            variant === 'tertiary' ? 'w-4 h-4' : 'w-5 h-5'
          )} />
        )}
      </>
    )

    if (href) {
      return (
        <Link
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
        >
          {content}
        </Link>
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref as any}
        {...props}
      >
        {content}
      </Comp>
    )
  }
)
ButtonV2.displayName = 'ButtonV2'

/**
 * Primary Button
 * Yellow background, navy text, arrow icon
 * Use for main CTAs like "Plan gratis IT-scan"
 */
export const ButtonPrimary = React.forwardRef<HTMLButtonElement, Omit<ButtonV2Props, 'variant'>>(
  ({ ...props }, ref) => {
    return <ButtonV2 ref={ref} variant="primary" {...props} />
  }
)
ButtonPrimary.displayName = 'ButtonPrimary'

/**
 * Secondary Button
 * Transparent background, navy border
 * Use for alternative actions, less urgent CTAs
 */
export const ButtonSecondary = React.forwardRef<HTMLButtonElement, Omit<ButtonV2Props, 'variant'>>(
  ({ showArrow = false, ...props }, ref) => {
    return <ButtonV2 ref={ref} variant="secondary" showArrow={showArrow} {...props} />
  }
)
ButtonSecondary.displayName = 'ButtonSecondary'

/**
 * Tertiary Link
 * Navy text with arrow, no underline
 * Use for in-text navigation, "read more" links
 */
export const LinkTertiary = React.forwardRef<HTMLButtonElement, Omit<ButtonV2Props, 'variant'>>(
  ({ size = 'sm', ...props }, ref) => {
    return <ButtonV2 ref={ref} variant="tertiary" size={size} {...props} />
  }
)
LinkTertiary.displayName = 'LinkTertiary'

export { ButtonV2, buttonVariants }

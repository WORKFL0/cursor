import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  showArrow?: boolean
}

/**
 * Primary Button - Art Director Design System
 * Yellow background (#FFD938), black text, arrow icon
 * Use for main CTAs like "Plan gratis IT-scan"
 */
export function ButtonPrimary({
  children,
  href,
  onClick,
  className,
  disabled = false,
  type = 'button',
  showArrow = true
}: ButtonProps) {
  const baseStyles = cn(
    "inline-flex items-center justify-center gap-3",
    "px-7 py-4", // 28px horizontal, 16px vertical
    "bg-workflo-yellow hover:bg-workflo-yellow-dark",
    "text-workflo-black workflo-button-text",
    "rounded-lg", // 8px border radius
    "transition-all duration-200",
    "shadow-sm hover:shadow-md",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    className
  )

  if (href && !disabled) {
    return (
      <Link href={href} className={baseStyles}>
        {children}
        {showArrow && <ArrowRight className="w-4 h-4" />}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
    >
      {children}
      {showArrow && <ArrowRight className="w-4 h-4" />}
    </button>
  )
}

/**
 * Secondary Button - Art Director Design System
 * Black border, white background, black text
 * Use for alternative actions like "Bekijk prijzen"
 */
export function ButtonSecondary({
  children,
  href,
  onClick,
  className,
  disabled = false,
  type = 'button',
  showArrow = false
}: ButtonProps) {
  const baseStyles = cn(
    "inline-flex items-center justify-center gap-3",
    "px-7 py-4",
    "bg-white hover:bg-workflo-gray-50",
    "border-[1.5px] border-workflo-black",
    "text-workflo-black workflo-button-text",
    "rounded-lg",
    "transition-all duration-200",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    className
  )

  if (href && !disabled) {
    return (
      <Link href={href} className={baseStyles}>
        {children}
        {showArrow && <ArrowRight className="w-4 h-4" />}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
    >
      {children}
      {showArrow && <ArrowRight className="w-4 h-4" />}
    </button>
  )
}

/**
 * Tertiary Link - Art Director Design System
 * Text with small arrow, no border
 * Use for "Meer informatie" style links
 */
export function LinkTertiary({
  children,
  href,
  onClick,
  className
}: ButtonProps) {
  const baseStyles = cn(
    "inline-flex items-center gap-2",
    "text-workflo-black font-semibold",
    "hover:text-workflo-yellow-dark",
    "transition-colors duration-200",
    className
  )

  if (href) {
    return (
      <Link href={href} className={baseStyles}>
        {children}
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={baseStyles}>
      {children}
      <ArrowRight className="w-3.5 h-3.5" />
    </button>
  )
}

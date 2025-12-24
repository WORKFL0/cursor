import React from 'react'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LinkTertiary } from '@/components/ui/button-art-director'

interface SectorCardProps {
  title: string
  description: string
  icon: LucideIcon
  href?: string
  className?: string
}

/**
 * SectorCard - Premium Art Director Design System
 *
 * Specs:
 * - 56x56px icon container with light background
 * - 28px icon (h-7 w-7)
 * - Consistent padding: 32px (p-8)
 * - Border radius: 12px (rounded-xl)
 * - Hover: Yellow border + lift + shadow
 * - Lucide icons only, stroke-2
 */
export function SectorCard({ title, description, icon: Icon, href, className }: SectorCardProps) {
  const cardContent = (
    <div className={cn(
      "group relative p-8",
      "bg-white dark:bg-workflo-gray-900",
      "rounded-xl",
      "border border-gray-100 dark:border-workflo-gray-800",
      "hover:border-workflo-yellow",
      "hover:shadow-xl hover:-translate-y-1",
      "transition-all duration-300",
      "h-full flex flex-col",
      className
    )}>
      {/* Icon Container - 56x56px */}
      <div className="w-14 h-14 mb-6 bg-workflo-yellow-light dark:bg-workflo-yellow/10 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="h-7 w-7 text-workflo-yellow-dark dark:text-workflo-yellow stroke-2" />
      </div>

      {/* Title - H3 */}
      <h3 className="text-2xl font-semibold text-workflo-black dark:text-gray-100 mb-3">
        {title}
      </h3>

      {/* Description - Body */}
      <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">
        {description}
      </p>

      {/* Link */}
      {href && (
        <div className="mt-auto">
          <LinkTertiary href={href}>
            Meer informatie
          </LinkTertiary>
        </div>
      )}
    </div>
  )

  if (href) {
    return cardContent
  }

  return cardContent
}

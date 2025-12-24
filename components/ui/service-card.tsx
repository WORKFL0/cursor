import React from 'react'
import Link from 'next/link'
import { LucideIcon, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LinkTertiary } from '@/components/ui/button-art-director'

interface ServiceFeature {
  nl: string
  en?: string
}

interface ServiceCardProps {
  title: string
  description: string
  icon: LucideIcon
  features?: ServiceFeature[]
  href?: string
  className?: string
  language?: 'nl' | 'en'
}

/**
 * ServiceCard - Premium Art Director Design System
 *
 * Unified card component for services
 * Same layout system as SectorCard for consistency
 *
 * Specs:
 * - 56x56px icon container
 * - 28px icon (h-7 w-7)
 * - Consistent padding: 32px (p-8)
 * - Border radius: 12px (rounded-xl)
 * - Hover: Yellow border + lift + shadow
 * - Lucide icons only, stroke-2
 */
export function ServiceCard({
  title,
  description,
  icon: Icon,
  features = [],
  href,
  className,
  language = 'nl'
}: ServiceCardProps) {
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
      {/* Icon Container - 56x56px, matches SectorCard */}
      <div className="w-14 h-14 mb-6 bg-workflo-yellow-light dark:bg-workflo-yellow/10 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="h-7 w-7 text-workflo-yellow-dark dark:text-workflo-yellow stroke-2" />
      </div>

      {/* Title - H3 */}
      <h3 className="text-2xl font-semibold text-workflo-black dark:text-gray-100 mb-3">
        {title}
      </h3>

      {/* Description - Body */}
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {description}
      </p>

      {/* Features List */}
      {features.length > 0 && (
        <ul className="space-y-2 mb-6 flex-grow">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-workflo-yellow flex-shrink-0 mt-0.5 stroke-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {language === 'en' && feature.en ? feature.en : feature.nl}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Link */}
      {href && (
        <div className="mt-auto pt-4">
          <LinkTertiary href={href}>
            {language === 'nl' ? 'Meer informatie' : 'Learn more'}
          </LinkTertiary>
        </div>
      )}
    </div>
  )

  return cardContent
}

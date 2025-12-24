'use client'

import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLanguage } from '@/lib/contexts/language-context'
import type { Testimonial } from '@/lib/data/testimonials-data'

interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { language } = useLanguage()
  
  const name = language === 'nl' ? testimonial.nameNL : testimonial.name
  const role = language === 'nl' ? testimonial.roleNL : testimonial.role
  const quote = language === 'nl' ? testimonial.quoteNL : testimonial.quote
  const service = language === 'nl' ? testimonial.serviceNL : testimonial.service
  
  return (
    <Card className="h-full hover:border-workflo-yellow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-gray-100 dark:border-workflo-gray-800 bg-white dark:bg-workflo-gray-900">
      <CardContent className="p-8">
        {/* Art Director Layout: Avatar | Quote | Name | Role | Company Logo */}

        {/* Avatar */}
        <div className="mb-6">
          <Avatar className="w-16 h-16">
            <AvatarImage src={testimonial.image} alt={name} />
            <AvatarFallback className="bg-workflo-yellow-light dark:bg-workflo-yellow/10 text-workflo-black dark:text-workflo-yellow font-semibold text-lg">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Rating Stars */}
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < testimonial.rating
                  ? 'text-workflo-yellow fill-workflo-yellow'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Quote - Body text */}
        <blockquote className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          &ldquo;{quote}&rdquo;
        </blockquote>

        {/* Name - Semibold */}
        <p className="font-semibold text-workflo-black dark:text-gray-100 mb-1">{name}</p>

        {/* Role - Muted */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {role}
        </p>

        {/* Company - with subtle branding */}
        <div className="flex items-center gap-2">
          <div className="h-px flex-grow bg-gray-200 dark:bg-workflo-gray-800" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {testimonial.company}
          </p>
        </div>

        {/* Service tag if available */}
        {service && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-workflo-gray-800">
            <p className="text-xs text-workflo-yellow font-medium">{service}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
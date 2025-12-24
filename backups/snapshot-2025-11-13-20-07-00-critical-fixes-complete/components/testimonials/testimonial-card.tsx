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
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        {/* Rating Stars */}
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < testimonial.rating
                  ? 'text-workflo-yellow fill-workflo-yellow'
                  : 'text-muted-foreground/50'
              }`}
            />
          ))}
        </div>
        
        {/* Quote */}
        <blockquote className="text-muted-foreground mb-6 italic">
          &ldquo;{quote}&rdquo;
        </blockquote>
        
        {/* Author */}
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={testimonial.image} alt={name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{name}</p>
            <p className="text-sm text-muted-foreground">
              {role} • {testimonial.company}
            </p>
            {service && (
              <p className="text-xs text-primary mt-1">{service}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TestimonialCard } from './testimonial-card'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/contexts/language-context'
import type { Testimonial } from '@/lib/data/testimonials-data'

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
  autoPlay?: boolean
  interval?: number
}

export function TestimonialsCarousel({ 
  testimonials, 
  autoPlay = true, 
  interval = 5000 
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { language } = useLanguage()
  
  const itemsPerView = 3 // Show 3 testimonials at a time on desktop
  const totalSlides = Math.ceil(testimonials.length / itemsPerView)
  
  useEffect(() => {
    if (!autoPlay) return
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides)
    }, interval)
    
    return () => clearInterval(timer)
  }, [autoPlay, interval, totalSlides])
  
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }
  
  const currentTestimonials = testimonials.slice(
    currentIndex * itemsPerView,
    (currentIndex + 1) * itemsPerView
  )
  
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-foreground">
          {language === 'nl' ? 'Wat onze klanten zeggen' : 'What our clients say'}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            aria-label="Next testimonials"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {currentTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {[...Array(totalSlides)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
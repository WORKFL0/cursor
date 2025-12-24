'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TestimonialCard } from './testimonial-card'
import { motion, AnimatePresence } from '@/lib/framer-motion'
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
      {/* Premium Navigation - Art Director Design */}
      <div className="flex gap-3 justify-center mb-8">
        <button
          onClick={goToPrevious}
          className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-gray-200 dark:border-workflo-gray-800 text-gray-600 dark:text-gray-300 hover:border-workflo-yellow hover:text-workflo-yellow transition-all duration-200"
          aria-label={language === 'nl' ? 'Vorige' : 'Previous'}
        >
          <ChevronLeft className="h-5 w-5 stroke-2" />
        </button>
        <button
          onClick={goToNext}
          className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-gray-200 dark:border-workflo-gray-800 text-gray-600 dark:text-gray-300 hover:border-workflo-yellow hover:text-workflo-yellow transition-all duration-200"
          aria-label={language === 'nl' ? 'Volgende' : 'Next'}
        >
          <ChevronRight className="h-5 w-5 stroke-2" />
        </button>
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
      
      {/* Art Director Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {[...Array(totalSlides)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? 'bg-workflo-yellow w-8'
                : 'bg-gray-300 dark:bg-workflo-gray-700 hover:bg-workflo-yellow/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
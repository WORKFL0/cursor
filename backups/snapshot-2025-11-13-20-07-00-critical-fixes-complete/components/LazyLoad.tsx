'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface LazyLoadProps {
  children: ReactNode
  className?: string
  fallback?: ReactNode
  threshold?: number
  rootMargin?: string
  once?: boolean
  fadeIn?: boolean
  slideIn?: 'up' | 'down' | 'left' | 'right' | false
}

export default function LazyLoad({
  children,
  className = '',
  fallback = null,
  threshold = 0.1,
  rootMargin = '50px',
  once = true,
  fadeIn = true,
  slideIn = 'up'
}: LazyLoadProps) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          
          if (once) {
            setHasAnimated(true)
            observer.unobserve(element)
          }
        } else if (!once && !hasAnimated) {
          setIsIntersecting(false)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, once, hasAnimated])

  // Animation variants
  const getInitialAnimation = () => {
    const animations: any = {}
    
    if (fadeIn) {
      animations.opacity = 0
    }
    
    if (slideIn) {
      switch (slideIn) {
        case 'up':
          animations.y = 50
          break
        case 'down':
          animations.y = -50
          break
        case 'left':
          animations.x = 50
          break
        case 'right':
          animations.x = -50
          break
      }
    }
    
    return animations
  }

  const getFinalAnimation = () => {
    const animations: any = {}
    
    if (fadeIn) {
      animations.opacity = 1
    }
    
    if (slideIn) {
      animations.x = 0
      animations.y = 0
    }
    
    return animations
  }

  const shouldAnimate = fadeIn || slideIn
  const showContent = isIntersecting || hasAnimated

  if (shouldAnimate) {
    return (
      <div ref={ref} className={className}>
        {showContent ? (
          <motion.div
            initial={getInitialAnimation()}
            animate={getFinalAnimation()}
            transition={{
              duration: 0.6,
              ease: 'easeOut'
            }}
          >
            {children}
          </motion.div>
        ) : (
          fallback
        )}
      </div>
    )
  }

  return (
    <div ref={ref} className={className}>
      {showContent ? children : fallback}
    </div>
  )
}

// Specialized lazy loading components
export function LazyImage({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'blur',
  ...props 
}: {
  src: string
  alt: string
  className?: string
  placeholder?: 'blur' | 'empty'
  [key: string]: any
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <LazyLoad 
      className={className}
      fallback={
        <div className={`bg-gray-200 animate-pulse ${className}`}>
          {placeholder === 'blur' && (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      }
    >
      <div className="relative">
        {!loaded && !error && (
          <div className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`}>
            {placeholder === 'blur' && (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        )}
        
        {error ? (
          <div className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 ${className}`}>
            <div className="text-center">
              <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-xs">Failed to load</p>
            </div>
          </div>
        ) : (
          <motion.img
            src={src}
            alt={alt}
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            {...props}
          />
        )}
      </div>
    </LazyLoad>
  )
}

export function LazyVideo({
  src,
  poster,
  className = '',
  autoPlay = false,
  ...props
}: {
  src: string
  poster?: string
  className?: string
  autoPlay?: boolean
  [key: string]: any
}) {
  return (
    <LazyLoad
      className={className}
      fallback={
        <div className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}>
          <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </div>
      }
    >
      <motion.video
        src={src}
        poster={poster}
        className={className}
        autoPlay={autoPlay}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        {...props}
      />
    </LazyLoad>
  )
}
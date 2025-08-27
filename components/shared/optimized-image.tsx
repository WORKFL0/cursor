'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ImageOptimizer, OptimizedImageConfig, ImagePerformanceMonitor, LazyImageLoader } from '@/lib/utils/image-optimization'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends OptimizedImageConfig {
  className?: string
  containerClassName?: string
  fill?: boolean
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: () => void
  trackPerformance?: boolean
  lazyLoading?: boolean
  fadeIn?: boolean
}

/**
 * Optimized Image Component
 * Provides comprehensive image optimization with lazy loading, performance tracking,
 * and responsive behavior
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  placeholder = 'blur',
  blurDataURL = ImageOptimizer.generateBlurDataURL(),
  sizes,
  quality = 80,
  className = '',
  containerClassName = '',
  fill = false,
  style,
  onLoad,
  onError,
  trackPerformance = false,
  lazyLoading = !priority,
  fadeIn = true,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [startTime] = useState(performance.now())
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (lazyLoading && !priority) {
      LazyImageLoader.init()
    }

    if (trackPerformance) {
      ImagePerformanceMonitor.trackLargestContentfulPaint()
    }
  }, [lazyLoading, priority, trackPerformance])

  const handleLoad = () => {
    setIsLoading(false)
    
    if (trackPerformance) {
      ImagePerformanceMonitor.trackImageLoad(String(src), startTime)
    }
    
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  const imageClasses = cn(
    'transition-opacity duration-300',
    {
      'opacity-0': isLoading && fadeIn,
      'opacity-100': !isLoading || !fadeIn,
      'object-cover': fill,
      'lazy-loading': lazyLoading && !priority
    },
    className
  )

  const containerClasses = cn(
    'relative overflow-hidden',
    {
      'w-full h-full': fill,
      'bg-muted animate-pulse': isLoading,
    },
    containerClassName
  )

  // Error state
  if (hasError) {
    return (
      <div 
        className={cn(
          containerClasses,
          'flex items-center justify-center bg-muted text-muted-foreground',
          !fill && `w-[${width}px] h-[${height}px]`
        )}
        style={style}
      >
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-2 bg-current opacity-20 rounded" />
          <p className="text-xs">Image not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className={containerClasses} style={style}>
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        {...(fill ? { fill: true } : { width, height })}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={sizes}
        quality={quality}
        className={imageClasses}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {/* Loading overlay with skeleton */}
      {isLoading && fadeIn && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  )
}

/**
 * Pre-configured image components for common use cases
 */
export const HeroImage = (props: Omit<OptimizedImageProps, 'priority' | 'sizes'>) => (
  <OptimizedImage
    {...ImageOptimizer.hero(props.src, props.alt)}
    {...props}
    trackPerformance
  />
)

export const LogoImage = ({ width, height, ...props }: Omit<OptimizedImageProps, 'priority'>) => (
  <OptimizedImage
    {...ImageOptimizer.logo(props.src, props.alt, width, height)}
    {...props}
  />
)

export const ClientLogoImage = (props: Omit<OptimizedImageProps, 'width' | 'height'>) => (
  <OptimizedImage
    {...ImageOptimizer.clientLogo(props.src, props.alt)}
    {...props}
    fadeIn={false}
  />
)

export const TeamPhotoImage = (props: Omit<OptimizedImageProps, 'width' | 'height'>) => (
  <OptimizedImage
    {...ImageOptimizer.teamPhoto(props.src, props.alt)}
    {...props}
  />
)

export const ArticleImage = (props: Omit<OptimizedImageProps, 'width' | 'height'>) => (
  <OptimizedImage
    {...ImageOptimizer.articleImage(props.src, props.alt)}
    {...props}
  />
)

export const ServiceIconImage = (props: Omit<OptimizedImageProps, 'width' | 'height'>) => (
  <OptimizedImage
    {...ImageOptimizer.serviceIcon(props.src, props.alt)}
    {...props}
    fadeIn={false}
  />
)

export const ThumbnailImage = (props: Omit<OptimizedImageProps, 'width' | 'height'>) => (
  <OptimizedImage
    {...ImageOptimizer.thumbnail(props.src, props.alt)}
    {...props}
  />
)

export default OptimizedImage
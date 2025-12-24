'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/advanced-skeletons'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string
  showSkeleton?: boolean
  skeletonClassName?: string
  containerClassName?: string
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  showSkeleton = true,
  skeletonClassName,
  containerClassName,
  className,
  priority = false,
  quality = 85,
  sizes,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsError(true)
    setIsLoading(false)
    if (fallbackSrc) {
      setImageSrc(fallbackSrc)
    }
  }

  const optimizedSizes = sizes || (
    props.fill 
      ? '100vw'
      : props.width && props.height
      ? `(max-width: 768px) 100vw, ${props.width}px`
      : '(max-width: 768px) 100vw, 50vw'
  )

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      {/* Loading skeleton */}
      {isLoading && showSkeleton && (
        <div className={cn(
          'absolute inset-0 z-10',
          props.fill ? 'w-full h-full' : `w-[${props.width}px] h-[${props.height}px]`
        )}>
          <Skeleton 
            className={cn('w-full h-full', skeletonClassName)} 
            animation="shimmer" 
          />
        </div>
      )}

      <Image
        {...props}
        src={imageSrc}
        alt={alt}
        sizes={optimizedSizes}
        quality={quality}
        priority={priority}
        className={cn(
          'transition-opacity duration-300',
          isLoading && showSkeleton ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        // Optimize loading behavior
        loading={priority ? 'eager' : 'lazy'}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />

      {/* Error state */}
      {isError && !fallbackSrc && (
        <div className={cn(
          'absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground',
          props.fill ? 'w-full h-full' : `w-[${props.width}px] h-[${props.height}px]`
        )}>
          <div className="text-center p-4">
            <div className="text-sm font-medium">Image not available</div>
            <div className="text-xs mt-1">Failed to load: {alt}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// Hero/Banner optimized image component
export function HeroImage({
  src,
  alt,
  className,
  containerClassName,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      priority
      quality={90}
      sizes="100vw"
      className={cn('object-cover', className)}
      containerClassName={cn('w-full h-full', containerClassName)}
      showSkeleton={true}
      {...props}
    />
  )
}

// Logo optimized image component
export function LogoImage({
  src,
  alt,
  width = 120,
  height = 40,
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority
      quality={95}
      sizes="(max-width: 768px) 100px, 120px"
      className={cn('object-contain', className)}
      showSkeleton={false}
      {...props}
    />
  )
}

// Avatar/Profile optimized image component
export function AvatarImage({
  src,
  alt,
  size = 48,
  className,
  ...props
}: OptimizedImageProps & { size?: number }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      quality={90}
      sizes={`${size}px`}
      className={cn('rounded-full object-cover', className)}
      showSkeleton={true}
      {...props}
    />
  )
}

// Card/Content optimized image component
export function ContentImage({
  src,
  alt,
  aspectRatio = 'video', // 'square', 'video', 'portrait'
  className,
  containerClassName,
  ...props
}: OptimizedImageProps & { aspectRatio?: 'square' | 'video' | 'portrait' }) {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]'
  }

  return (
    <div className={cn(
      'relative overflow-hidden rounded-lg bg-muted',
      aspectRatioClasses[aspectRatio],
      containerClassName
    )}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={85}
        className={cn('object-cover', className)}
        showSkeleton={true}
        {...props}
      />
    </div>
  )
}

// Gallery/Thumbnail optimized image component
export function ThumbnailImage({
  src,
  alt,
  size = 120,
  className,
  ...props
}: OptimizedImageProps & { size?: number }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      quality={80}
      sizes={`${size}px`}
      className={cn('rounded-md object-cover cursor-pointer hover:opacity-90 transition-opacity', className)}
      showSkeleton={true}
      {...props}
    />
  )
}
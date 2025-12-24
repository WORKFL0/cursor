'use client'

import React from 'react'
import Image, { ImageProps } from 'next/image'
import { useLanguage } from '@/lib/contexts/language-context'

interface SEOImageProps extends Omit<ImageProps, 'alt'> {
  alt: string
  altNL?: string
  caption?: string
  captionNL?: string
  title?: string
  titleNL?: string
  loading?: 'lazy' | 'eager'
  priority?: boolean
  schema?: boolean
  className?: string
}

export function SEOImage({
  src,
  alt,
  altNL,
  caption,
  captionNL,
  title,
  titleNL,
  loading = 'lazy',
  priority = false,
  schema = false,
  className = '',
  width,
  height,
  ...props
}: SEOImageProps) {
  const { language } = useLanguage()
  
  const currentAlt = language === 'nl' && altNL ? altNL : alt
  const currentCaption = language === 'nl' && captionNL ? captionNL : caption
  const currentTitle = language === 'nl' && titleNL ? titleNL : title

  // Generate structured data for images if schema is enabled
  const imageSchema = schema && {
    '@type': 'ImageObject',
    '@id': `${typeof src === 'string' ? src : ''}#image`,
    url: typeof src === 'string' ? src : '',
    caption: currentCaption || currentAlt,
    name: currentTitle || currentAlt,
    description: currentAlt,
    ...(width && { width }),
    ...(height && { height }),
    encodingFormat: getImageFormat(typeof src === 'string' ? src : ''),
    uploadDate: new Date().toISOString(),
    contentUrl: typeof src === 'string' ? src : '',
    acquireLicensePage: 'https://workflo.it/privacy',
    creditText: 'Workflo B.V.',
    creator: {
      '@type': 'Organization',
      name: 'Workflo B.V.'
    },
    copyrightHolder: {
      '@type': 'Organization',
      name: 'Workflo B.V.'
    },
    license: 'https://workflo.it/terms'
  }

  const imageElement = (
    <Image
      src={src}
      alt={currentAlt}
      title={currentTitle}
      loading={loading}
      priority={priority}
      width={width}
      height={height}
      className={`${className} transition-opacity duration-300 hover:opacity-90`}
      {...props}
      // SEO optimizations
      decoding="async"
      // Add data attributes for better analytics tracking
      data-alt={currentAlt}
      data-src={typeof src === 'string' ? src : ''}
    />
  )

  return (
    <figure className="relative">
      {/* Structured Data for Images */}
      {schema && imageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(imageSchema),
          }}
        />
      )}
      
      {imageElement}
      
      {/* Caption */}
      {currentCaption && (
        <figcaption className="mt-2 text-sm text-gray-600 italic text-center">
          {currentCaption}
        </figcaption>
      )}
    </figure>
  )
}

// Service-specific image component for better SEO
export function ServiceImage({
  serviceName,
  serviceNameNL,
  src,
  className = '',
  ...props
}: {
  serviceName: string
  serviceNameNL?: string
  src: string
  className?: string
} & Omit<SEOImageProps, 'alt' | 'altNL' | 'src'>) {
  const currentServiceName = serviceNameNL || serviceName

  return (
    <SEOImage
      src={src}
      alt={`${serviceName} - Professional IT Services Amsterdam`}
      altNL={`${currentServiceName} - Professionele IT-diensten Amsterdam`}
      title={`${serviceName} Solutions by Workflo`}
      titleNL={`${currentServiceName} Oplossingen door Workflo`}
      className={`rounded-lg shadow-lg ${className}`}
      schema={true}
      {...props}
    />
  )
}

// Team member image component
export function TeamMemberImage({
  name,
  role,
  roleNL,
  src,
  className = '',
  ...props
}: {
  name: string
  role: string
  roleNL?: string
  src: string
  className?: string
} & Omit<SEOImageProps, 'alt' | 'altNL' | 'src'>) {
  const currentRole = roleNL || role

  return (
    <SEOImage
      src={src}
      alt={`${name} - ${role} at Workflo IT Services Amsterdam`}
      altNL={`${name} - ${currentRole} bij Workflo IT Services Amsterdam`}
      title={`${name}, ${role}`}
      titleNL={`${name}, ${currentRole}`}
      className={`rounded-full ${className}`}
      schema={true}
      {...props}
    />
  )
}

// Company logo component with proper schema
export function CompanyLogo({
  variant = 'default',
  className = '',
  ...props
}: {
  variant?: 'default' | 'header' | 'footer'
  className?: string
} & Omit<SEOImageProps, 'alt' | 'altNL' | 'src'>) {
  const logoSrc = variant === 'header' 
    ? '/images/logos/workflo-logo-header.png'
    : variant === 'footer'
    ? '/images/logos/workflo-logo-footer.png'  
    : '/images/logos/workflo-logo.png'

  return (
    <SEOImage
      src={logoSrc}
      alt="Workflo IT Services Amsterdam - Logo"
      altNL="Workflo IT Services Amsterdam - Logo"
      title="Workflo - Amsterdam's Trusted IT Partner"
      titleNL="Workflo - Amsterdam's Vertrouwde IT-Partner"
      className={className}
      priority={variant === 'header'}
      schema={true}
      width={200}
      height={60}
      {...props}
    />
  )
}

// Utility function to determine image format
function getImageFormat(src: string): string {
  const extension = src.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'avif':
      return 'image/avif'
    case 'svg':
      return 'image/svg+xml'
    default:
      return 'image/jpeg'
  }
}

// Default export for common usage
export default SEOImage
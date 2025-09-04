'use client'

import React from 'react'
import { useLanguage } from '@/lib/contexts/language-context'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

interface SEOHeadingProps {
  level: HeadingLevel
  children: React.ReactNode
  childrenNL?: React.ReactNode
  className?: string
  id?: string
  schema?: boolean
  priority?: 'high' | 'medium' | 'low'
}

export function SEOHeading({
  level,
  children,
  childrenNL,
  className = '',
  id,
  schema = false,
  priority = 'medium'
}: SEOHeadingProps) {
  const { language } = useLanguage()
  const Tag: HeadingTag = `h${level}` as HeadingTag
  
  const content = language === 'nl' && childrenNL ? childrenNL : children
  
  // Base styles for different heading levels
  const baseStyles = {
    1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
    2: 'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight',
    3: 'text-2xl md:text-3xl font-semibold',
    4: 'text-xl md:text-2xl font-semibold',
    5: 'text-lg md:text-xl font-medium',
    6: 'text-base md:text-lg font-medium'
  }
  
  // SEO-optimized class combinations
  const seoStyles = {
    1: 'text-gray-900 leading-tight',
    2: 'text-gray-900 leading-tight',
    3: 'text-gray-800 leading-snug',
    4: 'text-gray-800 leading-snug',
    5: 'text-gray-700 leading-relaxed',
    6: 'text-gray-700 leading-relaxed'
  }
  
  const combinedClassName = `${baseStyles[level]} ${seoStyles[level]} ${className}`
  
  // Generate structured data for headings if schema is enabled
  const headingSchema = schema && level <= 2 && {
    '@type': 'WebPageElement',
    '@id': id ? `#${id}` : undefined,
    name: typeof content === 'string' ? content : '',
    description: typeof content === 'string' ? content : '',
    position: level,
    mainEntity: level === 1 ? true : undefined
  }
  
  return (
    <>
      {/* Structured Data for Important Headings */}
      {schema && headingSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(headingSchema),
          }}
        />
      )}
      
      <Tag
        className={combinedClassName}
        id={id}
        // SEO attributes
        itemProp={level === 1 ? 'name' : undefined}
        // Accessibility
        role={level === 1 ? 'banner' : undefined}
        // Priority hints for browser optimization
        data-priority={priority}
      >
        {content}
      </Tag>
    </>
  )
}

// Specialized components for different page types
export function PageTitle({ 
  children, 
  childrenNL,
  className = '',
  id = 'main-title',
  ...props 
}: Omit<SEOHeadingProps, 'level'>) {
  return (
    <SEOHeading
      level={1}
      className={`mb-6 ${className}`}
      id={id}
      schema={true}
      priority="high"
      {...props}
    >
      {children}
    </SEOHeading>
  )
}

export function SectionTitle({ 
  children, 
  childrenNL,
  className = '',
  ...props 
}: Omit<SEOHeadingProps, 'level'>) {
  return (
    <SEOHeading
      level={2}
      className={`mb-4 ${className}`}
      schema={true}
      priority="high"
      {...props}
    >
      {children}
    </SEOHeading>
  )
}

export function SubSectionTitle({ 
  children, 
  childrenNL,
  className = '',
  ...props 
}: Omit<SEOHeadingProps, 'level'>) {
  return (
    <SEOHeading
      level={3}
      className={`mb-3 ${className}`}
      priority="medium"
      {...props}
    >
      {children}
    </SEOHeading>
  )
}

export function ServiceTitle({ 
  serviceName,
  serviceNameNL,
  className = '',
  ...props 
}: {
  serviceName: string
  serviceNameNL?: string
  className?: string
} & Omit<SEOHeadingProps, 'level' | 'children' | 'childrenNL'>) {
  return (
    <SEOHeading
      level={1}
      className={`text-center mb-8 ${className}`}
      schema={true}
      priority="high"
      {...props}
    >
      {serviceName}
      {serviceNameNL && <span className="sr-only">{serviceNameNL}</span>}
    </SEOHeading>
  )
}

export function ArticleTitle({ 
  title,
  titleNL,
  publishedAt,
  className = '',
  ...props 
}: {
  title: string
  titleNL?: string
  publishedAt?: string
  className?: string
} & Omit<SEOHeadingProps, 'level' | 'children' | 'childrenNL'>) {
  const { language } = useLanguage()
  const currentTitle = language === 'nl' && titleNL ? titleNL : title
  
  return (
    <header className="mb-8">
      <SEOHeading
        level={1}
        className={`mb-2 ${className}`}
        schema={true}
        priority="high"
        {...props}
      >
        {currentTitle}
      </SEOHeading>
      
      {publishedAt && (
        <time 
          className="text-sm text-gray-600"
          dateTime={publishedAt}
        >
          {new Date(publishedAt).toLocaleDateString(
            language === 'nl' ? 'nl-NL' : 'en-US',
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }
          )}
        </time>
      )}
    </header>
  )
}

// Hook to track heading hierarchy and warn about SEO issues (development only)
export function useHeadingHierarchy() {
  if (process.env.NODE_ENV === 'development') {
    React.useEffect(() => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      const hierarchy: number[] = []
      
      headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1))
        hierarchy.push(level)
      })
      
      // Check for multiple H1s
      const h1Count = hierarchy.filter(level => level === 1).length
      if (h1Count > 1) {
        console.warn(`SEO Warning: Found ${h1Count} H1 headings. Pages should have exactly one H1.`)
      }
      
      // Check for heading hierarchy violations
      for (let i = 1; i < hierarchy.length; i++) {
        const current = hierarchy[i]
        const previous = hierarchy[i - 1]
        
        if (current && current - previous > 1) {
          console.warn(`SEO Warning: Heading hierarchy violation detected. H${previous} followed by H${current}. Consider using H${previous + 1} instead.`)
        }
      }
    }, [])
  }
}

// Utility function to generate heading IDs for anchor links
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .trim()
}

export default SEOHeading
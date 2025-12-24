'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Breadcrumb, BreadcrumbItem, generateBreadcrumbsFromPath } from './breadcrumb'
import { generateStructuredData, StructuredDataConfig } from '@/lib/seo/structured-data'
import { useLanguage } from '@/lib/contexts/language-context'
import { siteConfig } from '@/lib/data/workflo-data'

interface SEOPageProps {
  children: React.ReactNode
  breadcrumbs?: BreadcrumbItem[]
  structuredData?: StructuredDataConfig[]
  showBreadcrumbs?: boolean
  className?: string
  schema?: {
    pageType?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'ItemPage'
    lastModified?: string
    mainEntity?: any
  }
}

export function SEOPage({
  children,
  breadcrumbs,
  structuredData = [],
  showBreadcrumbs = true,
  className = '',
  schema
}: SEOPageProps) {
  const pathname = usePathname()
  const { language } = useLanguage()
  
  // Auto-generate breadcrumbs if not provided
  const finalBreadcrumbs = breadcrumbs || generateBreadcrumbsFromPath(pathname)
  
  // Generate page-specific structured data
  const pageStructuredData = schema && {
    '@type': schema.pageType || 'WebPage',
    '@id': `${siteConfig.url}${pathname}#webpage`,
    url: `${siteConfig.url}${pathname}`,
    name: 'Workflo IT Services',
    description: siteConfig.description,
    isPartOf: {
      '@id': `${siteConfig.url}/#website`
    },
    about: {
      '@id': `${siteConfig.url}/#organization`
    },
    datePublished: '2014-01-01',
    dateModified: schema.lastModified || new Date().toISOString().split('T')[0],
    inLanguage: language === 'nl' ? 'nl-NL' : 'en-US',
    potentialAction: [
      {
        '@type': 'ReadAction',
        target: [`${siteConfig.url}${pathname}`]
      }
    ],
    ...(schema.mainEntity && { mainEntity: schema.mainEntity })
  }
  
  // Combine all structured data
  const allStructuredData = [
    ...structuredData,
    ...(pageStructuredData ? [{ type: 'webpage' as const, data: pageStructuredData }] : [])
  ]
  
  const completeStructuredData = generateStructuredData(allStructuredData)

  return (
    <div className={`min-h-screen ${className}`}>
      {/* Complete Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(completeStructuredData),
        }}
      />
      
      {/* Breadcrumb Navigation */}
      {showBreadcrumbs && finalBreadcrumbs.length > 1 && (
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Breadcrumb items={finalBreadcrumbs} />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-workflo-yellow text-gray-900 px-4 py-2 rounded-md font-medium z-50"
      >
        {language === 'nl' ? 'Spring naar hoofdinhoud' : 'Skip to main content'}
      </a>
    </div>
  )
}

// Specialized page wrappers for different content types
export function ServicePage({
  serviceName,
  serviceNameNL,
  description,
  descriptionNL,
  features,
  pricing,
  children,
  ...props
}: {
  serviceName: string
  serviceNameNL?: string
  description: string
  descriptionNL?: string
  features?: string[]
  pricing?: {
    base: number
    currency: string
    period: string
  }
  children: React.ReactNode
} & Omit<SEOPageProps, 'structuredData'>) {
  const { language } = useLanguage()
  
  const serviceStructuredData: StructuredDataConfig[] = [
    {
      type: 'service',
      data: {
        name: serviceName,
        nameNL: serviceNameNL || serviceName,
        description,
        descriptionNL: descriptionNL || description,
        slug: serviceName.toLowerCase().replace(/\s+/g, '-'),
        features,
        pricing
      }
    }
  ]
  
  return (
    <SEOPage
      structuredData={serviceStructuredData}
      schema={{
        pageType: 'ItemPage',
        mainEntity: {
          '@type': 'Service',
          name: language === 'nl' && serviceNameNL ? serviceNameNL : serviceName,
          description: language === 'nl' && descriptionNL ? descriptionNL : description
        }
      }}
      {...props}
    >
      {children}
    </SEOPage>
  )
}

export function ArticlePage({
  title,
  titleNL,
  description,
  descriptionNL,
  publishedAt,
  updatedAt,
  author,
  category,
  image,
  children,
  ...props
}: {
  title: string
  titleNL?: string
  description: string
  descriptionNL?: string
  publishedAt: string
  updatedAt?: string
  author?: string
  category?: string
  image?: string
  children: React.ReactNode
} & Omit<SEOPageProps, 'structuredData'>) {
  const { language } = useLanguage()
  const pathname = usePathname()
  const slug = pathname.split('/').pop() || ''
  
  const articleStructuredData: StructuredDataConfig[] = [
    {
      type: 'article',
      data: {
        title: language === 'nl' && titleNL ? titleNL : title,
        description: language === 'nl' && descriptionNL ? descriptionNL : description,
        slug,
        publishedAt,
        updatedAt,
        author: author || 'Workflo B.V.',
        image,
        category
      }
    }
  ]
  
  return (
    <SEOPage
      structuredData={articleStructuredData}
      schema={{
        pageType: 'ItemPage',
        lastModified: updatedAt || publishedAt,
        mainEntity: {
          '@type': 'Article',
          headline: language === 'nl' && titleNL ? titleNL : title,
          description: language === 'nl' && descriptionNL ? descriptionNL : description,
          datePublished: publishedAt,
          dateModified: updatedAt || publishedAt
        }
      }}
      {...props}
    >
      {children}
    </SEOPage>
  )
}

export function FAQPage({
  faqs,
  children,
  ...props
}: {
  faqs: Array<{ question: string; questionNL?: string; answer: string; answerNL?: string }>
  children: React.ReactNode
} & Omit<SEOPageProps, 'structuredData'>) {
  const { language } = useLanguage()
  
  const faqStructuredData: StructuredDataConfig[] = [
    {
      type: 'faq',
      data: faqs.map(faq => ({
        question: language === 'nl' && faq.questionNL ? faq.questionNL : faq.question,
        answer: language === 'nl' && faq.answerNL ? faq.answerNL : faq.answer
      }))
    }
  ]
  
  return (
    <SEOPage
      structuredData={faqStructuredData}
      schema={{
        pageType: 'ItemPage',
        mainEntity: {
          '@type': 'FAQPage'
        }
      }}
      {...props}
    >
      {children}
    </SEOPage>
  )
}

export function ContactPage({
  children,
  ...props
}: {
  children: React.ReactNode
} & Omit<SEOPageProps, 'structuredData'>) {
  return (
    <SEOPage
      schema={{
        pageType: 'ContactPage',
        mainEntity: {
          '@type': 'ContactPage'
        }
      }}
      {...props}
    >
      {children}
    </SEOPage>
  )
}

export function AboutPage({
  children,
  ...props
}: {
  children: React.ReactNode
} & Omit<SEOPageProps, 'structuredData'>) {
  return (
    <SEOPage
      schema={{
        pageType: 'AboutPage',
        mainEntity: {
          '@type': 'AboutPage'
        }
      }}
      {...props}
    >
      {children}
    </SEOPage>
  )
}

export default SEOPage
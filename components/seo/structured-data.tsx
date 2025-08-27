'use client'

import Script from 'next/script'
import { schemaGenerator } from '@/lib/seo/schema'

interface StructuredDataProps {
  type: 'organization' | 'localBusiness' | 'website' | 'article' | 'service' | 'breadcrumb' | 'faq' | 'homepage' | 'pricing' | 'reviews'
  data?: any
  priority?: boolean
}

/**
 * Structured Data Component
 * Renders JSON-LD structured data for SEO
 */
export function StructuredData({ type, data, priority = false }: StructuredDataProps) {
  const getSchemaData = () => {
    switch (type) {
      case 'organization':
        return schemaGenerator.generateOrganization()
      
      case 'localBusiness':
        return schemaGenerator.generateLocalBusiness()
      
      case 'website':
        return schemaGenerator.generateWebSite()
      
      case 'homepage':
        const homepageSchemas = schemaGenerator.generateHomepageSchema()
        return [
          homepageSchemas.organization,
          homepageSchemas.localBusiness,
          homepageSchemas.website
        ]
      
      case 'article':
        if (!data) return null
        return schemaGenerator.generateArticle(
          data.title,
          data.description,
          data.author,
          data.publishedDate,
          data.modifiedDate,
          data.imageUrl,
          data.keywords
        )
      
      case 'service':
        if (!data) return null
        return schemaGenerator.generateService(
          data.name,
          data.description,
          data.subServices
        )
      
      case 'breadcrumb':
        if (!data) return null
        return schemaGenerator.generateBreadcrumb(data)
      
      case 'faq':
        if (!data) return null
        return schemaGenerator.generateFAQ(data)
      
      case 'pricing':
        if (!data) return null
        return schemaGenerator.generatePricingSchema(data)
      
      case 'reviews':
        if (!data) return null
        return schemaGenerator.generateReviewSchema(data)
      
      default:
        return null
    }
  }

  const schemaData = getSchemaData()

  if (!schemaData) return null

  // Handle multiple schemas for homepage
  if (Array.isArray(schemaData)) {
    return (
      <>
        {schemaData.map((schema, index) => (
          <Script
            key={`schema-${type}-${index}`}
            id={`schema-${type}-${index}`}
            type="application/ld+json"
            strategy={priority ? "beforeInteractive" : "afterInteractive"}
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schema, null, 0)
            }}
          />
        ))}
      </>
    )
  }

  return (
    <Script
      id={`schema-${type}`}
      type="application/ld+json"
      strategy={priority ? "beforeInteractive" : "afterInteractive"}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData, null, 0)
      }}
    />
  )
}

/**
 * Pre-configured schema components for common pages
 */
export const HomepageSchema = () => (
  <StructuredData type="homepage" priority />
)

export const ArticleSchema = (props: {
  title: string
  description: string
  author: string
  publishedDate: string
  modifiedDate?: string
  imageUrl?: string
  keywords?: string[]
}) => (
  <StructuredData type="article" data={props} />
)

export const ServiceSchema = (props: {
  name: string
  description: string
  subServices: string[]
}) => (
  <StructuredData type="service" data={props} />
)

export const BreadcrumbSchema = (props: Array<{ name: string; url: string }>) => (
  <StructuredData type="breadcrumb" data={props} />
)

export const FAQSchema = (props: Array<{ question: string; answer: string }>) => (
  <StructuredData type="faq" data={props} />
)

export const PricingSchema = (props: Array<{
  name: string
  description: string
  price?: string
  features: string[]
}>) => (
  <StructuredData type="pricing" data={props} />
)

export const ReviewsSchema = (props: Array<{
  author: string
  rating: number
  text: string
  company?: string
  date?: string
}>) => (
  <StructuredData type="reviews" data={props} />
)

export default StructuredData
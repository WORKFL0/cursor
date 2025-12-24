import { companyInfo } from '@/lib/data/workflo-data'

/**
 * Schema.org structured data generator for Workflo
 * Implements rich snippets for better search engine understanding
 */

export interface SchemaOrganization {
  '@context': string
  '@type': string
  name: string
  url: string
  logo: string
  description: string
  address: {
    '@type': string
    streetAddress: string
    addressLocality: string
    postalCode: string
    addressCountry: string
  }
  contactPoint: {
    '@type': string
    telephone: string
    contactType: string
    availableLanguage: string[]
  }
  sameAs: string[]
  foundingDate: string
  numberOfEmployees: string
  industry: string[]
  services: string[]
}

export interface SchemaService {
  '@context': string
  '@type': string
  name: string
  description: string
  provider: {
    '@type': string
    name: string
  }
  areaServed: string
  hasOfferCatalog: {
    '@type': string
    name: string
    itemListElement: Array<{
      '@type': string
      itemOffered: {
        '@type': string
        name: string
        description: string
      }
    }>
  }
}

export interface SchemaBreadcrumb {
  '@context': string
  '@type': string
  itemListElement: Array<{
    '@type': string
    position: number
    name: string
    item: string
  }>
}

export interface SchemaArticle {
  '@context': string
  '@type': string
  headline: string
  description: string
  author: {
    '@type': string
    name: string
    url?: string
  }
  publisher: {
    '@type': string
    name: string
    logo: {
      '@type': string
      url: string
    }
  }
  datePublished: string
  dateModified: string
  mainEntityOfPage: string
  image?: string
  wordCount?: number
  keywords?: string[]
}

export interface SchemaWebSite {
  '@context': string
  '@type': string
  name: string
  url: string
  potentialAction: {
    '@type': string
    target: {
      '@type': string
      urlTemplate: string
    }
    'query-input': string
  }
}

export interface SchemaLocalBusiness {
  '@context': string
  '@type': string
  name: string
  description: string
  url: string
  telephone: string
  address: {
    '@type': string
    streetAddress: string
    addressLocality: string
    postalCode: string
    addressCountry: string
  }
  geo: {
    '@type': string
    latitude: number
    longitude: number
  }
  openingHoursSpecification: Array<{
    '@type': string
    dayOfWeek: string[]
    opens: string
    closes: string
  }>
  priceRange: string
  paymentAccepted: string[]
  currenciesAccepted: string
  hasMap: string
}

export interface SchemaFAQ {
  '@context': string
  '@type': string
  mainEntity: Array<{
    '@type': string
    name: string
    acceptedAnswer: {
      '@type': string
      text: string
    }
  }>
}

class SchemaGenerator {
  private baseUrl = 'https://workflo.nl'

  /**
   * Generate organization schema
   */
  generateOrganization(): SchemaOrganization {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: companyInfo.name,
      url: this.baseUrl,
      logo: `${this.baseUrl}/images/workflo-logo.png`,
      description: companyInfo.description,
      address: {
        '@type': 'PostalAddress',
        streetAddress: companyInfo.location.address,
        addressLocality: companyInfo.location.city,
        postalCode: companyInfo.location.postalCode,
        addressCountry: 'NL'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: companyInfo.location.phone,
        contactType: 'customer support',
        availableLanguage: ['Dutch', 'English']
      },
      sameAs: [
        // Add social media URLs when available
      ],
      foundingDate: '2018',
      numberOfEmployees: '10-50',
      industry: [
        'Information Technology',
        'Managed IT Services',
        'Cybersecurity',
        'Cloud Computing'
      ],
      services: [
        'Managed IT Services',
        'Cloud Migration',
        'Cybersecurity',
        'Backup & Recovery',
        'VoIP Services',
        'Microsoft 365'
      ]
    }
  }

  /**
   * Generate local business schema
   */
  generateLocalBusiness(): SchemaLocalBusiness {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: companyInfo.name,
      description: companyInfo.description,
      url: this.baseUrl,
      telephone: companyInfo.location.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: companyInfo.location.address,
        addressLocality: companyInfo.location.city,
        postalCode: companyInfo.location.postalCode,
        addressCountry: 'NL'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 52.3906,
        longitude: 4.8851
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '18:00'
        }
      ],
      priceRange: '€€€',
      paymentAccepted: ['Cash', 'Credit Card', 'Invoice'],
      currenciesAccepted: 'EUR',
      hasMap: `https://maps.google.com/?q=${encodeURIComponent(`${companyInfo.location.address}, ${companyInfo.location.city}, ${companyInfo.location.country}`)}`
    }
  }

  /**
   * Generate website schema with search action
   */
  generateWebSite(): SchemaWebSite {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: companyInfo.name,
      url: this.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.baseUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    }
  }

  /**
   * Generate service schema
   */
  generateService(serviceName: string, serviceDescription: string, subServices: string[]): SchemaService {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: serviceName,
      description: serviceDescription,
      provider: {
        '@type': 'Organization',
        name: companyInfo.name
      },
      areaServed: 'Netherlands',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${serviceName} Services`,
        itemListElement: subServices.map((service, index) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service,
            description: `Professional ${service} services by ${companyInfo.name}`
          }
        }))
      }
    }
  }

  /**
   * Generate breadcrumb schema
   */
  generateBreadcrumb(items: Array<{ name: string; url: string }>): SchemaBreadcrumb {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url.startsWith('http') ? item.url : `${this.baseUrl}${item.url}`
      }))
    }
  }

  /**
   * Generate article schema
   */
  generateArticle(
    title: string,
    description: string,
    author: string,
    publishedDate: string,
    modifiedDate?: string,
    imageUrl?: string,
    keywords?: string[]
  ): SchemaArticle {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: description,
      author: {
        '@type': 'Person',
        name: author,
        url: `${this.baseUrl}/team`
      },
      publisher: {
        '@type': 'Organization',
        name: companyInfo.name,
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/images/workflo-logo.png`
        }
      },
      datePublished: publishedDate,
      dateModified: modifiedDate || publishedDate,
      mainEntityOfPage: window.location.href,
      ...(imageUrl && { image: imageUrl }),
      ...(keywords && { keywords })
    }
  }

  /**
   * Generate FAQ schema
   */
  generateFAQ(faqs: Array<{ question: string; answer: string }>): SchemaFAQ {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }
  }

  /**
   * Generate product/service schema for pricing pages
   */
  generatePricingSchema(services: Array<{
    name: string
    description: string
    price?: string
    features: string[]
  }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'IT Services Pricing',
      description: 'Comprehensive IT services and pricing options',
      itemListElement: services.map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Service',
          name: service.name,
          description: service.description,
          ...(service.price && {
            offers: {
              '@type': 'Offer',
              price: service.price,
              priceCurrency: 'EUR',
              availability: 'https://schema.org/InStock'
            }
          }),
          additionalProperty: service.features.map(feature => ({
            '@type': 'PropertyValue',
            name: 'Feature',
            value: feature
          }))
        }
      }))
    }
  }

  /**
   * Generate review/testimonial schema
   */
  generateReviewSchema(reviews: Array<{
    author: string
    rating: number
    text: string
    company?: string
    date?: string
  }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: companyInfo.name,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
        reviewCount: reviews.length,
        bestRating: 5,
        worstRating: 1
      },
      review: reviews.map(review => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author,
          ...(review.company && { worksFor: review.company })
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1
        },
        reviewBody: review.text,
        ...(review.date && { datePublished: review.date })
      }))
    }
  }

  /**
   * Generate complete schema for homepage
   */
  generateHomepageSchema() {
    return {
      organization: this.generateOrganization(),
      localBusiness: this.generateLocalBusiness(),
      website: this.generateWebSite()
    }
  }
}

export const schemaGenerator = new SchemaGenerator()
export default schemaGenerator
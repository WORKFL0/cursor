import { siteConfig, companyInfo, serviceCategories } from '@/lib/data/workflo-data'

export interface StructuredDataConfig {
  type: 'organization' | 'website' | 'article' | 'service' | 'faq' | 'breadcrumb' | 'local-business'
  data: any
}

// Organization Schema
export function getOrganizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: 'Workflo B.V.',
    alternateName: ['Workflo', 'Workflo Amsterdam', 'Workflo IT'],
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      '@id': `${siteConfig.url}/#logo`,
      url: `${siteConfig.url}/images/logos/workflo-logo.png`,
      caption: 'Workflo IT Services Logo',
      width: 200,
      height: 60,
      inLanguage: 'nl-NL'
    },
    image: {
      '@type': 'ImageObject',
      '@id': `${siteConfig.url}/#logo`
    },
    description: siteConfig.description,
    slogan: companyInfo.taglineNL,
    foundingDate: '2014-01-01',
    foundingLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Koivistokade 3',
        addressLocality: 'Amsterdam',
        postalCode: '1013 AC',
        addressCountry: 'NL',
        addressRegion: 'Noord-Holland'
      }
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Koivistokade 3',
      addressLocality: 'Amsterdam',
      postalCode: '1013 AC',
      addressCountry: 'NL',
      addressRegion: 'Noord-Holland'
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+31-20-308-0465',
        contactType: 'customer service',
        email: 'info@workflo.it',
        availableLanguage: ['Dutch', 'English'],
        areaServed: 'NL',
        hoursAvailable: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00',
            closes: '18:00'
          }
        ]
      },
      {
        '@type': 'ContactPoint',
        contactType: 'emergency',
        telephone: '+31-20-308-0465',
        availableLanguage: ['Dutch', 'English'],
        description: '24/7 Emergency IT Support for contract clients'
      }
    ],
    sameAs: [
      'https://linkedin.com/company/workflo-it',
      'https://www.kvk.nl/orderstraat/product-kiezen/?kvknummer=60924357'
    ],
    serviceArea: [
      {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: 52.38495507204196,
          longitude: 4.888571976608
        },
        geoRadius: '50000'
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Amsterdam Metropolitan Area'
      },
      {
        '@type': 'AdministrativeArea', 
        name: 'Noord-Holland'
      }
    ],
    areaServed: {
      '@type': 'Place',
      name: 'Netherlands'
    },
    knowsAbout: [
      'IT Support',
      'Managed IT Services', 
      'Cloud Computing',
      'Microsoft 365',
      'Azure',
      'Cybersecurity',
      'Network Infrastructure',
      'IT Consulting',
      'System Administration',
      'Business IT Solutions'
    ],
    memberOf: [
      {
        '@type': 'Organization',
        name: 'Microsoft Partner Network'
      }
    ],
    award: companyInfo.certifications,
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: 5
    },
    currenciesAccepted: 'EUR',
    paymentAccepted: ['Cash', 'Credit Card', 'Invoice', 'Bank Transfer']
  }
}

// Local Business Schema
export function getLocalBusinessSchema() {
  return {
    '@type': 'LocalBusiness',
    '@id': `${siteConfig.url}/#localbusiness`,
    name: 'Workflo B.V.',
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: '+31-20-308-0465',
    email: 'info@workflo.it',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Koivistokade 3',
      addressLocality: 'Amsterdam',
      postalCode: '1013 AC',
      addressCountry: 'NL',
      addressRegion: 'Noord-Holland'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 52.38495507204196,
      longitude: 4.888571976608
    },
    openingHours: [
      'Mo-Fr 08:00-18:00'
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00'
      }
    ],
    priceRange: '€€',
    acceptsReservations: 'True',
    currenciesAccepted: 'EUR',
    paymentAccepted: ['Cash', 'Credit Card', 'Invoice', 'Bank Transfer'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'IT Services Catalog',
      itemListElement: serviceCategories.map(category => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: category.nameNL,
          description: category.descriptionNL,
          provider: {
            '@id': `${siteConfig.url}/#organization`
          },
          areaServed: {
            '@type': 'Place',
            name: 'Amsterdam Metropolitan Area'
          },
          availableChannel: {
            '@type': 'ServiceChannel',
            serviceUrl: `${siteConfig.url}/diensten/${category.slug}`,
            servicePhone: '+31-20-308-0465'
          }
        }
      }))
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '47',
      bestRating: '5',
      worstRating: '1'
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5'
        },
        author: {
          '@type': 'Person',
          name: 'Satisfied Client'
        },
        reviewBody: 'Excellent IT support and very professional service. Highly recommended!'
      }
    ]
  }
}

// Website Schema
export function getWebsiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: 'Workflo',
    description: siteConfig.description,
    publisher: {
      '@id': `${siteConfig.url}/#organization`
    },
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteConfig.url}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    ],
    inLanguage: ['nl-NL', 'en-US'],
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: {
      '@id': `${siteConfig.url}/#organization`
    }
  }
}

// Service Schema Generator
export function getServiceSchema(service: {
  name: string
  nameNL: string
  description: string
  descriptionNL: string
  slug: string
  features?: string[]
  pricing?: {
    base: number
    currency: string
    period: string
  }
}) {
  const serviceUrl = `${siteConfig.url}/diensten/${service.slug}`
  
  return {
    '@type': 'Service',
    '@id': `${serviceUrl}/#service`,
    name: service.nameNL,
    alternateName: service.name,
    description: service.descriptionNL,
    url: serviceUrl,
    provider: {
      '@id': `${siteConfig.url}/#organization`
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Amsterdam'
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Noord-Holland'
      }
    ],
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: serviceUrl,
      servicePhone: '+31-20-308-0465',
      serviceType: 'In-Person, Remote'
    },
    serviceType: service.nameNL,
    ...(service.features && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${service.nameNL} Features`,
        itemListElement: service.features.map((feature, index) => ({
          '@type': 'Offer',
          name: feature,
          position: index + 1
        }))
      }
    }),
    ...(service.pricing && {
      offers: {
        '@type': 'Offer',
        price: service.pricing.base,
        priceCurrency: service.pricing.currency,
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: service.pricing.base,
          priceCurrency: service.pricing.currency,
          unitText: service.pricing.period
        },
        availability: 'https://schema.org/InStock',
        validFrom: new Date().toISOString().split('T')[0]
      }
    })
  }
}

// Article Schema
export function getArticleSchema(article: {
  title: string
  description: string
  slug: string
  publishedAt: string
  updatedAt?: string
  author: string
  image?: string
  category?: string
}) {
  const articleUrl = `${siteConfig.url}/nieuws/${article.slug}`
  
  return {
    '@type': 'Article',
    '@id': `${articleUrl}/#article`,
    headline: article.title,
    description: article.description,
    url: articleUrl,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Organization',
      '@id': `${siteConfig.url}/#organization`,
      name: 'Workflo B.V.'
    },
    publisher: {
      '@id': `${siteConfig.url}/#organization`
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl
    },
    ...(article.image && {
      image: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}${article.image}`,
        caption: article.title
      }
    }),
    articleSection: article.category || 'IT News',
    inLanguage: 'nl-NL',
    isAccessibleForFree: true
  }
}

// FAQ Schema
export function getFAQSchema(faqs: Array<{question: string, answer: string}>) {
  return {
    '@type': 'FAQPage',
    '@id': `${siteConfig.url}/faq#faq`,
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

// Breadcrumb Schema
export function getBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url
    }))
  }
}

// Generate complete structured data
export function generateStructuredData(configs: StructuredDataConfig[]) {
  const baseGraph = [
    getOrganizationSchema(),
    getWebsiteSchema(),
    getLocalBusinessSchema()
  ]

  const additionalSchemas = configs.map(config => {
    switch (config.type) {
      case 'article':
        return getArticleSchema(config.data)
      case 'service':
        return getServiceSchema(config.data)
      case 'faq':
        return getFAQSchema(config.data)
      case 'breadcrumb':
        return getBreadcrumbSchema(config.data)
      default:
        return null
    }
  }).filter(Boolean)

  return {
    '@context': 'https://schema.org',
    '@graph': [...baseGraph, ...additionalSchemas]
  }
}
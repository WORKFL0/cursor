import { Metadata } from 'next'

export const siteMetadata = {
  title: 'Workflo | Amsterdam IT Services - Managed IT, Cloud & Cybersecurity',
  description: 'Leading Amsterdam MSP offering managed IT services from €60/month. 24/7 monitoring, cybersecurity, Microsoft 365, cloud solutions. 250+ satisfied Dutch SMB clients. ☎️ 020-30 80 465',
  keywords: [
    // Primary Keywords
    'IT Services Amsterdam',
    'Managed IT Netherlands',
    'MSP Amsterdam',
    'IT Beheer Amsterdam',
    'IT Support Amsterdam',
    
    // Service Keywords
    'Cloud Solutions Amsterdam',
    'Cybersecurity Netherlands',
    'Microsoft 365 Migration Amsterdam',
    'Azure Cloud Services Netherlands',
    'Backup Solutions Amsterdam',
    'VoIP Telefonie Nederland',
    'Hardware as a Service Amsterdam',
    
    // Business Keywords
    'IT Outsourcing Amsterdam',
    'Managed Service Provider Netherlands',
    'IT Consultancy Amsterdam',
    'Network Security Netherlands',
    'Business IT Support',
    'SME IT Support Netherlands',
    'MKB IT Diensten',
    
    // Location Keywords
    'IT Services Herengracht',
    'Amsterdam Centrum IT',
    'Noord-Holland IT Services',
    'Groot-Amsterdam IT Support',
    
    // Solution Keywords
    'Remote IT Support Netherlands',
    'Onsite IT Support Amsterdam',
    'IT Helpdesk Amsterdam',
    'Cloud Migration Netherlands',
    'Disaster Recovery Amsterdam',
    'GDPR Compliance IT Netherlands',
    
    // Branded Keywords
    'Workflo IT',
    'Workflo Amsterdam',
    'Workflo Managed Services',
    'Workflo Cloud Solutions'
  ],
  authors: [
    { name: 'Workflo B.V.', url: 'https://workflo.it' }
  ],
  creator: 'Workflo B.V.',
  publisher: 'Workflo B.V.',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '', // Add Google Search Console verification
    bing: '',   // Add Bing Webmaster verification
  }
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ITSystemsManagementService',
  '@id': 'https://workflo.it/#organization',
  name: 'Workflo B.V.',
  alternateName: 'Workflo IT Services Amsterdam',
  url: 'https://workflo.it',
  logo: {
    '@type': 'ImageObject',
    url: 'https://workflo.it/images/logos/workflo-logo.png',
    width: 200,
    height: 60
  },
  description: 'Leading Amsterdam-based Managed Service Provider offering comprehensive IT solutions including 24/7 monitoring, cybersecurity, cloud services, and Microsoft 365 management for Dutch SMBs.',
  foundingDate: '2015',
  founders: [
    {
      '@type': 'Person',
      name: 'Florian Clanet',
      jobTitle: 'Founder & CEO'
    }
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Herengracht 282',
    addressLocality: 'Amsterdam',
    addressRegion: 'Noord-Holland',
    postalCode: '1016 BX',
    addressCountry: 'NL'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 52.3676,
    longitude: 4.9041
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+31-20-30-80-465',
      contactType: 'customer service',
      email: 'info@workflo.it',
      areaServed: 'NL',
      availableLanguage: ['Dutch', 'English'],
      contactOption: ['TollFree', 'HearingImpairedSupported']
    },
    {
      '@type': 'ContactPoint',
      telephone: '+31-20-30-80-465',
      contactType: 'emergency',
      email: 'support@workflo.it',
      areaServed: 'NL',
      availableLanguage: ['Dutch', 'English'],
      contactOption: 'Emergency'
    }
  ],
  sameAs: [
    'https://linkedin.com/company/workflo-it',
    'https://github.com/workflo-it',
    'https://twitter.com/workflo_it'
  ],
  knowsAbout: [
    'Managed IT Services',
    'Cybersecurity',
    'Cloud Computing',
    'Microsoft 365',
    'Azure',
    'Network Security',
    'IT Support',
    'Disaster Recovery',
    'GDPR Compliance',
    'VoIP Systems'
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Workflo IT Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Remote Managed IT Support',
          description: 'Complete remote IT management and 24/7 monitoring',
          provider: {
            '@type': 'Organization',
            name: 'Workflo B.V.'
          }
        },
        price: '60',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '60',
          priceCurrency: 'EUR',
          unitText: 'per user per month'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Onsite Managed IT Support',
          description: 'Complete IT management with onsite support',
          provider: {
            '@type': 'Organization',
            name: 'Workflo B.V.'
          }
        },
        price: '90',
        priceCurrency: 'EUR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '90',
          priceCurrency: 'EUR',
          unitText: 'per user per month'
        }
      }
    ]
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    bestRating: '5',
    worstRating: '1',
    ratingCount: '127',
    reviewCount: '89'
  },
  areaServed: {
    '@type': 'Place',
    name: 'Greater Amsterdam Area',
    geo: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 52.3676,
        longitude: 4.9041
      },
      geoRadius: '50000'
    }
  },
  slogan: 'IT dat gewoon werkt',
  numberOfEmployees: {
    '@type': 'QuantitativeValue',
    value: 4
  },
  taxID: 'NL864300852B01',
  vatID: 'NL864300852B01',
  legalName: 'Workflo B.V.',
  naics: '541513',
  isicV4: '6201'
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://workflo.it/#website',
  url: 'https://workflo.it',
  name: 'Workflo IT Services Amsterdam',
  description: 'Professional IT services and solutions for Amsterdam businesses',
  publisher: {
    '@id': 'https://workflo.it/#organization'
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://workflo.it/search?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  },
  inLanguage: ['nl-NL', 'en-US']
}

export const breadcrumbSchema = (items: Array<{name: string, url: string}>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
})

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Wat kost managed IT support bij Workflo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Onze managed IT services beginnen bij €60 per gebruiker per maand voor remote support en €90 per gebruiker per maand voor onsite support. Dit is all-inclusive zonder verborgen kosten.'
      }
    },
    {
      '@type': 'Question',
      name: 'Hoe snel reageert Workflo bij IT-problemen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We garanderen een reactietijd van maximaal 4 uur tijdens kantooruren. In de praktijk is onze gemiddelde reactietijd 1,7 uur. Voor noodgevallen bieden we 24/7 support met een reactietijd van 15 minuten.'
      }
    },
    {
      '@type': 'Question',
      name: 'Welke gebieden bedient Workflo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Workflo bedient primair de regio Groot-Amsterdam, maar we ondersteunen bedrijven door heel Nederland met onze remote support diensten. Ons kantoor is gevestigd aan de Herengracht 282 in Amsterdam.'
      }
    }
  ]
}

export function generatePageMetadata(
  title: string,
  description: string,
  path: string,
  keywords?: string[]
): Metadata {
  const url = `https://workflo.it${path}`
  
  return {
    title: `${title} | Workflo Amsterdam IT Services`,
    description,
    keywords: keywords || siteMetadata.keywords,
    alternates: {
      canonical: url,
      languages: {
        'nl-NL': url,
        'en-US': `${url}?lang=en`
      }
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Workflo',
      locale: 'nl_NL',
      alternateLocale: 'en_US',
      type: 'website',
      images: [
        {
          url: 'https://workflo.it/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Workflo IT Services Amsterdam'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://workflo.it/images/twitter-card.jpg'],
      creator: '@workflo_it',
      site: '@workflo_it'
    },
    robots: siteMetadata.robots as any,
    authors: siteMetadata.authors,
    category: 'Technology'
  }
}
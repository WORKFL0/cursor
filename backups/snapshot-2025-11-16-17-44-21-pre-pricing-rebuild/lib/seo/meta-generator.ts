import type { Metadata } from 'next'
import { siteConfig } from '@/lib/data/workflo-data'

export interface PageSEOData {
  title?: string
  titleNL?: string
  description?: string
  descriptionNL?: string
  keywords?: string[]
  ogImage?: string
  canonicalUrl?: string
  pageType?: 'website' | 'article' | 'service' | 'about' | 'contact'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  noIndex?: boolean
  breadcrumbs?: Array<{
    name: string
    nameNL: string
    url: string
  }>
}

export function generateMetadata(
  seoData: PageSEOData,
  language: 'nl' | 'en' = 'nl'
): Metadata {
  const title = (language === 'nl' ? seoData.titleNL : seoData.title) || siteConfig.name
  const description = (language === 'nl' ? seoData.descriptionNL : seoData.description) || siteConfig.description
  const canonicalUrl = seoData.canonicalUrl || siteConfig.url
  const ogImage = seoData.ogImage || `${siteConfig.url}/images/og-default.jpg`

  // Generate enhanced keywords for Dutch market
  const baseKeywords = [
    'IT Services Amsterdam', 'IT ondersteuning', 'Managed IT Nederland', 
    'Computer reparatie Amsterdam', 'IT hulp', 'Cloud oplossingen',
    'Microsoft 365 Nederland', 'Cybersecurity Amsterdam', 'IT support',
    'Workflo Amsterdam', 'IT partner', 'Helpdesk Nederland'
  ]
  
  const keywords = seoData.keywords ? [...baseKeywords, ...seoData.keywords] : baseKeywords

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s | Workflo IT Amsterdam${language === 'en' ? ' | Managed IT Services' : ' | IT Ondersteuning'}`,
    },
    description,
    keywords: keywords,
    authors: [{ name: 'Workflo B.V.', url: siteConfig.url }],
    creator: 'Workflo B.V.',
    publisher: 'Workflo B.V.',
    category: 'Technology',
    classification: 'Business Services',
    openGraph: {
      type: seoData.pageType === 'article' ? 'article' : 'website',
      locale: language === 'nl' ? 'nl_NL' : 'en_US',
      alternateLocale: language === 'nl' ? 'en_US' : 'nl_NL',
      url: canonicalUrl,
      siteName: 'Workflo',
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${title} - Workflo IT Services Amsterdam`,
          type: 'image/jpeg',
        },
      ],
      ...(seoData.publishedTime && { publishedTime: seoData.publishedTime }),
      ...(seoData.modifiedTime && { modifiedTime: seoData.modifiedTime }),
      ...(seoData.author && { authors: [seoData.author] }),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@workflo_it',
      creator: '@workflo_it',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: !seoData.noIndex,
      follow: !seoData.noIndex,
      googleBot: {
        index: !seoData.noIndex,
        follow: !seoData.noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'nl-NL': language === 'en' ? canonicalUrl.replace('/en', '') : canonicalUrl,
        'en-US': language === 'nl' && !canonicalUrl.includes('/en') ? `${canonicalUrl}/en` : canonicalUrl,
      },
    },
    other: {
      'geo.region': 'NL-NH',
      'geo.placename': 'Amsterdam',
      'geo.position': '52.3676;4.9041',
      'ICBM': '52.3676, 4.9041',
      'revisit-after': '7 days',
      'distribution': 'global',
      'rating': 'general',
      'HandheldFriendly': 'True',
      'MobileOptimized': '320',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'Workflo IT',
    },
  }
}

// Specialized metadata generators for different page types
export const seoTemplates = {
  service: (serviceName: string, serviceNameNL: string, description: string, descriptionNL: string): PageSEOData => ({
    title: `${serviceName} | Professional IT Services Amsterdam`,
    titleNL: `${serviceNameNL} | Professionele IT-diensten Amsterdam`,
    description: `${description} Expert ${serviceName.toLowerCase()} solutions for Dutch businesses. Transparent pricing, 24/7 support.`,
    descriptionNL: `${descriptionNL} Professionele ${serviceNameNL.toLowerCase()} oplossingen voor Nederlandse bedrijven. Transparante prijzen, 24/7 ondersteuning.`,
    keywords: [
      `${serviceName} Amsterdam`,
      `${serviceNameNL}`,
      `${serviceName} Nederland`,
      'IT Services Amsterdam',
      'Managed IT',
      'Business IT Support'
    ],
    pageType: 'service'
  }),

  article: (title: string, titleNL: string, excerpt: string, excerptNL: string, publishedTime?: string): PageSEOData => ({
    title: `${title} | Workflo IT Blog`,
    titleNL: `${titleNL} | Workflo IT Blog`,
    description: excerpt,
    descriptionNL: excerptNL,
    keywords: [
      'IT nieuws',
      'Technology blog',
      'IT trends',
      'Amsterdam IT',
      'Business technology'
    ],
    pageType: 'article',
    publishedTime,
    author: 'Workflo B.V.'
  }),

  sector: (sectorName: string, sectorNameNL: string): PageSEOData => ({
    title: `IT Solutions for ${sectorName} | Specialized Services Amsterdam`,
    titleNL: `IT-oplossingen voor ${sectorNameNL} | Gespecialiseerde diensten Amsterdam`,
    description: `Specialized IT services for the ${sectorName.toLowerCase()} sector in Amsterdam. Tailored solutions, compliance support, and expert guidance.`,
    descriptionNL: `Gespecialiseerde IT-diensten voor de ${sectorNameNL.toLowerCase()} sector in Amsterdam. Oplossingen op maat, compliance-ondersteuning en expert begeleiding.`,
    keywords: [
      `${sectorName} IT Amsterdam`,
      `${sectorNameNL} IT`,
      `${sectorName} technology`,
      'Sector-specific IT',
      'Industry solutions'
    ],
    pageType: 'service'
  }),

  location: (locationName: string, serviceType: string = 'IT Services'): PageSEOData => ({
    title: `${serviceType} ${locationName} | Local IT Support & Management`,
    titleNL: `${serviceType} ${locationName} | Lokale IT-ondersteuning & Beheer`,
    description: `Professional ${serviceType.toLowerCase()} in ${locationName}. Local support, Dutch expertise, transparent pricing. Serving businesses across the Amsterdam area.`,
    descriptionNL: `Professionele ${serviceType.toLowerCase()} in ${locationName}. Lokale ondersteuning, Nederlandse expertise, transparante prijzen. Ten dienste van bedrijven in de regio Amsterdam.`,
    keywords: [
      `${serviceType} ${locationName}`,
      `IT support ${locationName}`,
      `Computer repair ${locationName}`,
      'Local IT services',
      'Amsterdam IT'
    ],
    pageType: 'service'
  })
}
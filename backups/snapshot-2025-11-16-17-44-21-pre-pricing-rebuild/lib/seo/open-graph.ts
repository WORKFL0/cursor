import { Metadata } from 'next'
import { siteConfig } from '@/lib/data/workflo-data'

export interface OpenGraphConfig {
  title: string
  description: string
  type?: 'website' | 'article' | 'profile' | 'book' | 'music.song' | 'video.movie'
  image?: string
  url?: string
  siteName?: string
  locale?: string
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  tags?: string[]
  section?: string
}

export interface TwitterConfig {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player'
  site?: string
  creator?: string
  title?: string
  description?: string
  image?: string
}

/**
 * Open Graph and Twitter Card generator for social media optimization
 */
class SocialMediaSEO {
  private baseUrl = siteConfig.url
  private defaultImage = `${this.baseUrl}/images/workflo-social-share.jpg`
  private siteName = 'Workflo'
  private twitterHandle = '@workflo_it'
  
  /**
   * Generate comprehensive Open Graph metadata
   */
  generateOpenGraph(config: OpenGraphConfig): Record<string, any> {
    const {
      title,
      description,
      type = 'website',
      image = this.defaultImage,
      url,
      siteName = this.siteName,
      locale = 'nl_NL',
      publishedTime,
      modifiedTime,
      authors,
      tags,
      section
    } = config

    const openGraph: Record<string, any> = {
      type,
      locale,
      url: url || this.baseUrl,
      siteName,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/jpeg',
        },
      ],
    }

    // Add article-specific properties
    if (type === 'article') {
      if (publishedTime) openGraph.publishedTime = publishedTime
      if (modifiedTime) openGraph.modifiedTime = modifiedTime
      if (authors) openGraph.authors = authors
      if (tags) openGraph.tags = tags
      if (section) openGraph.section = section
    }

    return openGraph
  }

  /**
   * Generate Twitter Card metadata
   */
  generateTwitterCard(config: TwitterConfig): Record<string, any> {
    const {
      card = 'summary_large_image',
      site = this.twitterHandle,
      creator = this.twitterHandle,
      title,
      description,
      image
    } = config

    return {
      card,
      site,
      creator,
      ...(title && { title }),
      ...(description && { description }),
      ...(image && { images: [image] })
    }
  }

  /**
   * Generate complete metadata for a page
   */
  generatePageMetadata({
    title,
    description,
    type = 'website',
    image,
    url,
    publishedTime,
    modifiedTime,
    authors,
    tags,
    section,
    keywords
  }: OpenGraphConfig & {
    keywords?: string[]
  }): Metadata {
    const openGraph = this.generateOpenGraph({
      title,
      description,
      type,
      image,
      url,
      publishedTime,
      modifiedTime,
      authors,
      tags,
      section
    })

    const twitter = this.generateTwitterCard({
      title,
      description,
      image
    })

    return {
      title,
      description,
      ...(keywords && { keywords }),
      openGraph,
      twitter,
      ...(url && {
        alternates: {
          canonical: url
        }
      })
    }
  }

  /**
   * Homepage metadata
   */
  getHomepageMetadata(): Metadata {
    return this.generatePageMetadata({
      title: 'Workflo | Amsterdam\'s Trusted IT Growth Partner - Managed IT, Cloud & Cybersecurity',
      description: 'Leading IT services in Amsterdam. Managed IT, cloud solutions, cybersecurity & Microsoft 365. 24/7 support for SME growth. Contact us for a free IT health check!',
      url: this.baseUrl,
      keywords: [
        'IT Services Amsterdam', 'Managed IT Netherlands', 'Cloud Solutions Amsterdam',
        'Cybersecurity Netherlands', 'SME IT Support', 'Microsoft 365 Migration Amsterdam',
        'Azure Cloud Services', 'IT Helpdesk Amsterdam', 'Network Security Netherlands'
      ]
    })
  }

  /**
   * Service page metadata
   */
  getServiceMetadata(serviceName: string, serviceDescription: string): Metadata {
    return this.generatePageMetadata({
      title: `${serviceName} | Professional IT Services Amsterdam - Workflo`,
      description: serviceDescription,
      url: `${this.baseUrl}/diensten/${serviceName.toLowerCase().replace(/\s+/g, '-')}`,
      image: `${this.baseUrl}/images/services/${serviceName.toLowerCase().replace(/\s+/g, '-')}-social.jpg`
    })
  }

  /**
   * Article metadata
   */
  getArticleMetadata({
    title,
    description,
    slug,
    publishedDate,
    modifiedDate,
    author,
    tags,
    image
  }: {
    title: string
    description: string
    slug: string
    publishedDate: string
    modifiedDate?: string
    author: string
    tags?: string[]
    image?: string
  }): Metadata {
    return this.generatePageMetadata({
      title: `${title} | Workflo IT Insights`,
      description,
      type: 'article',
      url: `${this.baseUrl}/nieuws/${slug}`,
      publishedTime: publishedDate,
      modifiedTime: modifiedDate,
      authors: [author],
      tags,
      image: image || `${this.baseUrl}/images/articles/default-article-social.jpg`,
      section: 'IT News & Tips'
    })
  }

  /**
   * Contact page metadata
   */
  getContactMetadata(): Metadata {
    return this.generatePageMetadata({
      title: 'Contact Workflo | IT Services Amsterdam | Get Expert IT Support',
      description: 'Contact Workflo for professional IT services in Amsterdam. Get a free consultation, IT health check, or emergency support. Call 020-30 80 465 or fill out our form.',
      url: `${this.baseUrl}/contact`,
      image: `${this.baseUrl}/images/contact-workflo-amsterdam.jpg`
    })
  }

  /**
   * About page metadata
   */
  getAboutMetadata(): Metadata {
    return this.generatePageMetadata({
      title: 'About Workflo | Amsterdam IT Experts Since 2015 | Meet Our Team',
      description: 'Learn about Workflo, Amsterdam\'s trusted IT partner since 2015. Meet our expert team and discover our mission to help SME businesses grow through reliable IT solutions.',
      url: `${this.baseUrl}/over-ons`,
      image: `${this.baseUrl}/images/team/workflo-team-amsterdam.jpg`
    })
  }

  /**
   * Pricing page metadata
   */
  getPricingMetadata(): Metadata {
    return this.generatePageMetadata({
      title: 'IT Services Pricing | Transparent Costs | Amsterdam - Workflo',
      description: 'Transparent pricing for our IT services in Amsterdam. From €99/month for basic support to complete managed IT solutions. Calculate your costs with our pricing tool.',
      url: `${this.baseUrl}/prijzen`,
      image: `${this.baseUrl}/images/pricing-calculator-social.jpg`
    })
  }

  /**
   * Case studies metadata
   */
  getCaseStudiesMetadata(): Metadata {
    return this.generatePageMetadata({
      title: 'Success Stories | IT Projects Amsterdam | Client Case Studies - Workflo',
      description: 'Discover how Workflo helped Amsterdam businesses transform their IT. Real case studies, measurable results, and client testimonials from our managed IT services.',
      url: `${this.baseUrl}/case-studies`,
      image: `${this.baseUrl}/images/case-studies-social.jpg`
    })
  }

  /**
   * FAQ page metadata
   */
  getFAQMetadata(): Metadata {
    return this.generatePageMetadata({
      title: 'Frequently Asked Questions | IT Services Amsterdam - Workflo',
      description: 'Get answers to common questions about our IT services, managed IT support, cloud solutions, and cybersecurity. Expert advice from Amsterdam\'s IT professionals.',
      url: `${this.baseUrl}/faq`,
      image: `${this.baseUrl}/images/faq-it-support-social.jpg`
    })
  }

  /**
   * Generate social sharing URLs
   */
  generateSocialSharingUrls(title: string, url: string, description?: string) {
    const encodedTitle = encodeURIComponent(title)
    const encodedUrl = encodeURIComponent(url)
    const encodedDescription = description ? encodeURIComponent(description) : ''

    return {
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
    }
  }

  /**
   * Generate Rich Snippets for local business
   */
  generateLocalBusinessSnippets() {
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Workflo B.V.',
      image: this.defaultImage,
      telephone: '+31-20-308-0465',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Koivistokade 3',
        addressLocality: 'Amsterdam',
        postalCode: '1013 AC',
        addressCountry: 'NL'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 52.3676,
        longitude: 4.9041
      },
      url: this.baseUrl,
      priceRange: '€€',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday', 
          'Wednesday',
          'Thursday',
          'Friday'
        ],
        opens: '08:00',
        closes: '18:00'
      }
    }
  }
}

export const socialMediaSEO = new SocialMediaSEO()
export default socialMediaSEO
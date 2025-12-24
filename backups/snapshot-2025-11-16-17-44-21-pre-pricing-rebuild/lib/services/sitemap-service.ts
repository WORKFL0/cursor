import { newsArticles, NewsArticle } from '@/lib/data/news-data'

export interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
  images?: string[]
  alternateLanguages?: { lang: string; url: string }[]
}

export interface SitemapConfig {
  baseUrl: string
  defaultChangefreq: SitemapUrl['changefreq']
  defaultPriority: number
}

class SitemapService {
  private config: SitemapConfig

  constructor() {
    this.config = {
      baseUrl: 'https://workflo.nl',
      defaultChangefreq: 'weekly',
      defaultPriority: 0.8
    }
  }

  /**
   * Generate complete sitemap with all pages
   */
  public async generateSitemap(): Promise<string> {
    const urls: SitemapUrl[] = []

    // Add static pages
    urls.push(...this.getStaticPages())

    // Add dynamic content
    urls.push(...this.getNewsArticlePages())

    // Add service pages
    urls.push(...this.getServicePages())

    // Sort URLs by priority (highest first) then alphabetically
    urls.sort((a, b) => {
      if (a.priority !== b.priority) {
        return (b.priority || 0) - (a.priority || 0)
      }
      return a.loc.localeCompare(b.loc)
    })

    return this.generateSitemapXML(urls)
  }

  /**
   * Get static page URLs
   */
  private getStaticPages(): SitemapUrl[] {
    const staticPages: Array<{
      path: string
      priority: number
      changefreq: SitemapUrl['changefreq']
      images?: string[]
    }> = [
      {
        path: '',
        priority: 1.0,
        changefreq: 'daily',
        images: [
          `${this.config.baseUrl}/images/workflo-building.jpg`,
          `${this.config.baseUrl}/images/logo-yellow.png`
        ]
      },
      {
        path: '/contact',
        priority: 0.95,
        changefreq: 'monthly',
        images: [`${this.config.baseUrl}/images/workflo-building.jpg`]
      },
      {
        path: '/diensten',
        priority: 0.9,
        changefreq: 'weekly'
      },
      {
        path: '/over-ons',
        priority: 0.85,
        changefreq: 'monthly',
        images: [
          `${this.config.baseUrl}/images/team/florian.jpg`,
          `${this.config.baseUrl}/images/team/marcello.jpg`,
          `${this.config.baseUrl}/images/team/nam.jpg`,
          `${this.config.baseUrl}/images/team/samir.jpg`
        ]
      },
      {
        path: '/prijzen',
        priority: 0.9,
        changefreq: 'weekly'
      },
      {
        path: '/tevredenheidscheck',
        priority: 0.85,
        changefreq: 'monthly'
      },
      {
        path: '/nieuws',
        priority: 0.8,
        changefreq: 'daily'
      },
      {
        path: '/case-studies',
        priority: 0.75,
        changefreq: 'monthly'
      },
      {
        path: '/portfolio',
        priority: 0.75,
        changefreq: 'monthly'
      },
      {
        path: '/testimonials',
        priority: 0.7,
        changefreq: 'monthly'
      },
      {
        path: '/faq',
        priority: 0.7,
        changefreq: 'monthly'
      },
      {
        path: '/werken-bij',
        priority: 0.6,
        changefreq: 'monthly'
      },
      {
        path: '/referral',
        priority: 0.6,
        changefreq: 'monthly'
      },
      {
        path: '/servicedesk',
        priority: 0.65,
        changefreq: 'monthly'
      },
      {
        path: '/downloads',
        priority: 0.5,
        changefreq: 'monthly'
      },
      {
        path: '/privacy',
        priority: 0.3,
        changefreq: 'yearly'
      },
      {
        path: '/terms',
        priority: 0.3,
        changefreq: 'yearly'
      },
      {
        path: '/cookies',
        priority: 0.3,
        changefreq: 'yearly'
      },
      {
        path: '/afspraak',
        priority: 0.8,
        changefreq: 'monthly'
      }
    ]

    return staticPages.map(page => ({
      loc: `${this.config.baseUrl}${page.path}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: page.changefreq,
      priority: page.priority,
      images: page.images
    }))
  }

  /**
   * Get service page URLs
   */
  private getServicePages(): SitemapUrl[] {
    const services = [
      'managed-it',
      'cybersecurity',
      'cloud',
      'microsoft-365',
      'backup-disaster-recovery',
      'hardware-as-a-service',
      'voip-telefonie'
    ]

    return services.map(service => ({
      loc: `${this.config.baseUrl}/diensten/${service}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly' as const,
      priority: 0.9,
      images: [`${this.config.baseUrl}/images/placeholder-blog.svg`]
    }))
  }

  /**
   * Get news article page URLs
   */
  private getNewsArticlePages(): SitemapUrl[] {
    return newsArticles.map(article => ({
      loc: `${this.config.baseUrl}/nieuws/${article.slug}`,
      lastmod: article.updatedAt.toISOString().split('T')[0],
      changefreq: 'monthly' as const,
      priority: article.featured ? 0.8 : 0.7,
      images: article.image ? [`${this.config.baseUrl}${article.image}`] : undefined
    }))
  }

  /**
   * Generate sitemap XML
   */
  private generateSitemapXML(urls: SitemapUrl[]): string {
    const urlElements = urls.map(url => {
      let urlXml = `  <url>
    <loc>${this.escapeXml(url.loc)}</loc>`

      if (url.lastmod) {
        urlXml += `
    <lastmod>${url.lastmod}</lastmod>`
      }

      if (url.changefreq) {
        urlXml += `
    <changefreq>${url.changefreq}</changefreq>`
      }

      if (url.priority !== undefined) {
        urlXml += `
    <priority>${url.priority.toFixed(1)}</priority>`
      }

      // Add image information
      if (url.images && url.images.length > 0) {
        url.images.forEach(image => {
          urlXml += `
    <image:image>
      <image:loc>${this.escapeXml(image)}</image:loc>
    </image:image>`
        })
      }

      urlXml += `
  </url>`

      return urlXml
    }).join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlElements}
</urlset>`
  }

  /**
   * Generate robots.txt compatible sitemap reference
   */
  public generateRobotsSitemapReference(): string {
    return `Sitemap: ${this.config.baseUrl}/sitemap.xml`
  }

  /**
   * Generate news-specific sitemap for Google News
   */
  public async generateNewsSitemap(): Promise<string> {
    // Only include articles from the last 2 days for Google News
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    const recentArticles = newsArticles.filter(
      article => article.publishedAt > twoDaysAgo
    )

    if (recentArticles.length === 0) {
      // Return empty sitemap if no recent articles
      return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
</urlset>`
    }

    const newsUrls = recentArticles.map(article => {
      return `  <url>
    <loc>${this.escapeXml(`${this.config.baseUrl}/nieuws/${article.slug}`)}</loc>
    <news:news>
      <news:publication>
        <news:name>Workflo IT Services</news:name>
        <news:language>nl</news:language>
      </news:publication>
      <news:publication_date>${article.publishedAt.toISOString()}</news:publication_date>
      <news:title>${this.escapeXml(article.titleNL)}</news:title>
      <news:keywords>${this.escapeXml(article.tagsNL.join(', '))}</news:keywords>
    </news:news>
  </url>`
    }).join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsUrls}
</urlset>`
  }

  /**
   * Get sitemap statistics
   */
  public async getSitemapStats(): Promise<{
    totalUrls: number
    staticPages: number
    servicePages: number
    newsPages: number
    lastGenerated: string
    estimatedSize: number
  }> {
    const staticPages = this.getStaticPages()
    const servicePages = this.getServicePages()
    const newsPages = this.getNewsArticlePages()

    const totalUrls = staticPages.length + servicePages.length + newsPages.length
    const sitemapContent = await this.generateSitemap()
    const estimatedSize = Buffer.byteLength(sitemapContent, 'utf8')

    return {
      totalUrls,
      staticPages: staticPages.length,
      servicePages: servicePages.length,
      newsPages: newsPages.length,
      lastGenerated: new Date().toISOString(),
      estimatedSize
    }
  }

  /**
   * Escape XML special characters
   */
  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  /**
   * Update base URL (useful for different environments)
   */
  public setBaseUrl(baseUrl: string): void {
    this.config.baseUrl = baseUrl.replace(/\/$/, '') // Remove trailing slash
  }
}

export const sitemapService = new SitemapService()
export default sitemapService
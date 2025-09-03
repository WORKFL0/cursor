import { NewsArticle, newsArticles, getRecentArticles } from '@/lib/data/news-data'

export interface ExternalRSSFeed {
  url: string
  name: string
  category: string
  language: 'nl' | 'en'
  enabled: boolean
  lastFetch?: Date
  priority: number
}

export interface RSSItem {
  id: string
  title: string
  description: string
  link: string
  pubDate: Date
  author: string
  category: string
  source: string
  isExternal: boolean
}

export interface RSSFeedConfig {
  maxItems: number
  cacheDuration: number // in minutes
  feeds: ExternalRSSFeed[]
}

class RSSService {
  private cache: Map<string, { items: RSSItem[], fetchedAt: Date }> = new Map()
  private readonly config: RSSFeedConfig

  constructor() {
    this.config = {
      maxItems: 50,
      cacheDuration: 30, // 30 minutes
      feeds: [
        {
          url: 'https://tweakers.net/feeds/mixed.xml',
          name: 'Tweakers',
          category: 'technology',
          language: 'nl',
          enabled: true,
          priority: 1
        },
        {
          url: 'https://www.security.nl/rss.xml',
          name: 'Security.nl',
          category: 'security',
          language: 'nl',
          enabled: true,
          priority: 1
        },
        {
          url: 'https://feeds.feedburner.com/oreilly/radar',
          name: "O'Reilly Radar",
          category: 'technology',
          language: 'en',
          enabled: false, // Disabled by default for Dutch site
          priority: 2
        },
        {
          url: 'https://krebsonsecurity.com/feed/',
          name: 'Krebs on Security',
          category: 'security',
          language: 'en',
          enabled: false, // Disabled by default for Dutch site
          priority: 2
        }
      ]
    }
  }

  /**
   * Get combined feed of internal and external articles
   */
  public async getCombinedFeed(options: {
    maxItems?: number
    category?: string
    includeExternal?: boolean
    language?: 'nl' | 'en'
  } = {}): Promise<RSSItem[]> {
    const {
      maxItems = this.config.maxItems,
      category,
      includeExternal = true,
      language = 'nl'
    } = options

    const items: RSSItem[] = []

    // Add internal articles
    const internalArticles = this.getInternalArticles(category, language)
    items.push(...internalArticles)

    // Add external articles if enabled
    if (includeExternal) {
      const externalItems = await this.getExternalArticles(category, language)
      items.push(...externalItems)
    }

    // Sort by publication date (newest first)
    items.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())

    // Limit results
    return items.slice(0, maxItems)
  }

  /**
   * Convert internal news articles to RSS items
   */
  private getInternalArticles(category?: string, language: 'nl' | 'en' = 'nl'): RSSItem[] {
    let articles = newsArticles

    // Filter by category if specified
    if (category) {
      articles = articles.filter(article => article.category === category)
    }

    return articles.map(article => ({
      id: `internal-${article.id}`,
      title: language === 'nl' ? article.titleNL : article.title,
      description: language === 'nl' ? article.excerptNL : article.excerpt,
      link: `https://workflo.nl/nieuws/${article.slug}`,
      pubDate: article.publishedAt,
      author: article.author,
      category: article.category,
      source: 'Workflo',
      isExternal: false
    }))
  }

  /**
   * Fetch and parse external RSS feeds
   */
  private async getExternalArticles(category?: string, language: 'nl' | 'en' = 'nl'): Promise<RSSItem[]> {
    const items: RSSItem[] = []
    
    // Filter feeds by language and category
    const relevantFeeds = this.config.feeds.filter(feed => 
      feed.enabled &&
      feed.language === language &&
      (!category || feed.category === category)
    )

    // Fetch from each feed
    for (const feed of relevantFeeds) {
      try {
        const feedItems = await this.fetchRSSFeed(feed)
        items.push(...feedItems)
      } catch (error) {
        console.warn(`Failed to fetch RSS feed from ${feed.name}:`, error)
        // Continue with other feeds
      }
    }

    return items
  }

  /**
   * Fetch and parse a single RSS feed
   */
  private async fetchRSSFeed(feed: ExternalRSSFeed): Promise<RSSItem[]> {
    const cacheKey = feed.url
    const cached = this.cache.get(cacheKey)

    // Check if we have valid cached data
    if (cached && this.isCacheValid(cached.fetchedAt)) {
      return cached.items
    }

    try {
      // Note: In a real implementation, you would need a server-side solution
      // to fetch RSS feeds due to CORS restrictions
      
      // For now, we'll simulate external RSS items
      const mockItems = this.generateMockExternalItems(feed)
      
      // Cache the results
      this.cache.set(cacheKey, {
        items: mockItems,
        fetchedAt: new Date()
      })

      return mockItems
    } catch (error) {
      console.error(`Error fetching RSS feed from ${feed.name}:`, error)
      
      // Return cached data if available, even if stale
      if (cached) {
        return cached.items
      }
      
      return []
    }
  }

  /**
   * Generate mock external RSS items (placeholder for real RSS parsing)
   */
  private generateMockExternalItems(feed: ExternalRSSFeed): RSSItem[] {
    const mockItems: RSSItem[] = []
    const currentDate = new Date()

    // Generate some sample external items based on the feed
    const itemCount = Math.floor(Math.random() * 5) + 3 // 3-7 items

    for (let i = 0; i < itemCount; i++) {
      const daysAgo = Math.floor(Math.random() * 7) + 1
      const pubDate = new Date(currentDate)
      pubDate.setDate(pubDate.getDate() - daysAgo)

      let title: string
      let description: string

      if (feed.category === 'security') {
        const securityTopics = [
          'Nieuwe kwetsbaarheid ontdekt in populaire software',
          'Ransomware aanval op Nederlandse bedrijven voorkomen',
          'Update: Kritieke beveiligingspatches beschikbaar',
          'Phishing campagne richt zich op MKB bedrijven',
          'Zero-day exploit gepatch door Microsoft'
        ]
        title = securityTopics[Math.floor(Math.random() * securityTopics.length)] || securityTopics[0] || 'Beveiligingsupdate'
        description = `Beveiligingsupdate van ${feed.name}: ${title.toLowerCase()}. Lees meer over de details en beschermingsmaatregelen.`
      } else {
        const techTopics = [
          'Nieuwe AI-tools voor kleine bedrijven beschikbaar',
          'Cloud computing trends voor 2024',
          'Microsoft kondigt nieuwe features aan',
          'Beste practices voor remote work IT',
          'Duurzame IT oplossingen winnen aan populariteit'
        ]
        title = techTopics[Math.floor(Math.random() * techTopics.length)] || techTopics[0] || 'Technologie update'
        description = `Technologie update van ${feed.name}: ${title.toLowerCase()}. Ontdek de laatste ontwikkelingen.`
      }

      mockItems.push({
        id: `external-${feed.name.toLowerCase()}-${i}-${Date.now()}`,
        title,
        description,
        link: `${feed.url}#item-${i}`,
        pubDate,
        author: feed.name,
        category: feed.category,
        source: feed.name,
        isExternal: true
      })
    }

    return mockItems
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(fetchedAt: Date): boolean {
    const now = new Date()
    const diffMinutes = (now.getTime() - fetchedAt.getTime()) / (1000 * 60)
    return diffMinutes < this.config.cacheDuration
  }

  /**
   * Generate RSS XML for the combined feed
   */
  public async generateRSSXML(options: {
    maxItems?: number
    category?: string
    includeExternal?: boolean
    language?: 'nl' | 'en'
  } = {}): Promise<string> {
    const items = await this.getCombinedFeed(options)
    const siteUrl = 'https://workflo.nl'
    const language = options.language || 'nl'

    const rssItems = items.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <guid>${item.link}</guid>
      <pubDate>${item.pubDate.toUTCString()}</pubDate>
      <author>noreply@workflo.nl (${item.author})</author>
      <category>${item.category}</category>
      <source url="${item.isExternal ? item.link : siteUrl}">${item.source}</source>
    </item>
  `).join('')

    const title = language === 'nl' 
      ? 'Workflo IT Services - Nieuws & Updates'
      : 'Workflo IT Services - News & Updates'
    
    const description = language === 'nl'
      ? 'Latest nieuws, updates en inzichten van Workflo en relevante IT-bronnen.'
      : 'Latest news, updates and insights from Workflo and relevant IT sources.'

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <description>${description}</description>
    <link>${siteUrl}/nieuws</link>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml" />
    <language>${language === 'nl' ? 'nl-NL' : 'en-US'}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>30</ttl>
    <webMaster>noreply@workflo.nl (Workflo IT Team)</webMaster>
    <managingEditor>noreply@workflo.nl (Workflo IT Team)</managingEditor>
    <generator>Workflo RSS Service v1.0</generator>
    <image>
      <url>${siteUrl}/images/logo-yellow.png</url>
      <title>${title}</title>
      <link>${siteUrl}/nieuws</link>
      <width>144</width>
      <height>144</height>
    </image>
    ${rssItems}
  </channel>
</rss>`
  }

  /**
   * Get RSS feed statistics
   */
  public async getFeedStats(): Promise<{
    totalItems: number
    internalItems: number
    externalItems: number
    lastUpdate: Date
    cacheStatus: { feed: string, lastFetch: Date | null, itemCount: number }[]
  }> {
    const items = await this.getCombinedFeed({ includeExternal: true })
    const internalItems = items.filter(item => !item.isExternal).length
    const externalItems = items.filter(item => item.isExternal).length

    const cacheStatus = this.config.feeds.map(feed => ({
      feed: feed.name,
      lastFetch: this.cache.get(feed.url)?.fetchedAt || null,
      itemCount: this.cache.get(feed.url)?.items.length || 0
    }))

    return {
      totalItems: items.length,
      internalItems,
      externalItems,
      lastUpdate: new Date(),
      cacheStatus
    }
  }

  /**
   * Clear RSS cache
   */
  public clearCache(): void {
    this.cache.clear()
  }

  /**
   * Update feed configuration
   */
  public updateFeedConfig(feedUrl: string, updates: Partial<ExternalRSSFeed>): boolean {
    const feedIndex = this.config.feeds.findIndex(feed => feed.url === feedUrl)
    
    if (feedIndex === -1) {
      return false
    }

    this.config.feeds[feedIndex] = { ...this.config.feeds[feedIndex], ...updates } as any
    
    // Clear cache for this feed to force refresh
    this.cache.delete(feedUrl)
    
    return true
  }
}

export const rssService = new RSSService()
export default rssService
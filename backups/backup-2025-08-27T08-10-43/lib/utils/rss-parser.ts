/**
 * RSS Feed Parser Utility
 * Parses RSS feeds and returns structured data
 */

interface RSSItem {
  title: string
  description: string
  link: string
  pubDate: string
  guid?: string
  author?: string
  category?: string
}

interface ParsedRSSItem {
  id: string
  title: string
  excerpt: string
  url: string
  publishedAt: Date
  source: string
  category: string
  type: 'rss'
}

/**
 * Parse RSS feed from URL
 * @param feedUrl - The RSS feed URL
 * @param sourceName - Name of the RSS source
 * @param category - Category for the items
 * @returns Array of parsed RSS items
 */
export async function parseRSSFeed(
  feedUrl: string, 
  sourceName: string, 
  category: string
): Promise<ParsedRSSItem[]> {
  try {
    // Fetch the RSS feed
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Workflo RSS Reader/1.0',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
      next: {
        revalidate: 600, // Cache for 10 minutes
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`)
    }

    const text = await response.text()
    
    // Parse RSS XML
    const items = parseRSSXML(text)
    
    // Transform to our format
    return items.map((item, index) => ({
      id: `rss-${sourceName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${index}`,
      title: cleanText(item.title),
      excerpt: cleanText(item.description).slice(0, 300) + (item.description.length > 300 ? '...' : ''),
      url: item.link,
      publishedAt: new Date(item.pubDate),
      source: sourceName,
      category,
      type: 'rss' as const,
    }))
  } catch (error) {
    console.error(`Error parsing RSS feed from ${sourceName}:`, error)
    return []
  }
}

/**
 * Parse RSS XML string
 * Simple XML parser without external dependencies
 */
function parseRSSXML(xml: string): RSSItem[] {
  const items: RSSItem[] = []
  
  // Extract all <item> or <entry> elements
  const itemMatches = xml.match(/<item[^>]*>[\s\S]*?<\/item>|<entry[^>]*>[\s\S]*?<\/entry>/gi)
  
  if (!itemMatches) {
    return items
  }
  
  for (const itemXml of itemMatches) {
    const item: RSSItem = {
      title: extractXMLValue(itemXml, 'title') || '',
      description: extractXMLValue(itemXml, 'description') || extractXMLValue(itemXml, 'summary') || '',
      link: extractXMLValue(itemXml, 'link') || extractXMLValue(itemXml, 'url') || '',
      pubDate: extractXMLValue(itemXml, 'pubDate') || extractXMLValue(itemXml, 'published') || extractXMLValue(itemXml, 'updated') || new Date().toISOString(),
      guid: extractXMLValue(itemXml, 'guid') || extractXMLValue(itemXml, 'id'),
      author: extractXMLValue(itemXml, 'author') || extractXMLValue(itemXml, 'dc:creator'),
      category: extractXMLValue(itemXml, 'category'),
    }
    
    // Only add items with required fields
    if (item.title && item.link) {
      items.push(item)
    }
  }
  
  return items
}

/**
 * Extract value from XML tag
 */
function extractXMLValue(xml: string, tag: string): string | undefined {
  // Try CDATA first
  const cdataMatch = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i'))
  if (cdataMatch) {
    return cdataMatch[1]
  }
  
  // Then try regular tag content
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  if (match) {
    return match[1]
  }
  
  // Try self-closing tag with href attribute (for links)
  if (tag === 'link') {
    const hrefMatch = xml.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i)
    if (hrefMatch) {
      return hrefMatch[1]
    }
  }
  
  return undefined
}

/**
 * Clean text from HTML and extra whitespace
 */
function cleanText(text: string): string {
  if (!text) return ''
  
  return text
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') // Remove CDATA
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#47;/g, '/')
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}
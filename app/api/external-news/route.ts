import { NextResponse } from 'next/server'
import { workfloLinkedInPosts } from '@/lib/config/linkedin-posts'
import { parseRSSFeed } from '@/lib/utils/rss-parser'

// External RSS feeds
const externalSources = [
  {
    name: 'Workflo RSS Feed',
    url: 'https://rss.workflo.it/i/?a=rss&user=workflo&token=&hours=168',
    category: 'workflo',
    enabled: false  // Disabled - RSS feed not available
  },
  {
    name: 'Tweakers IT Nieuws',
    url: 'https://feeds.feedburner.com/tweakers/mixed',
    category: 'technology',
    enabled: true  // Dutch IT news
  },
  {
    name: 'Microsoft 365 Blog',
    url: 'https://www.microsoft.com/en-us/microsoft-365/blog/feed/',
    category: 'cloud',
    enabled: true  // Microsoft 365 news
  },
  {
    name: 'The Hacker News',
    url: 'https://feeds.feedburner.com/TheHackersNews',
    category: 'security',
    enabled: true  // Cybersecurity news
  }
]

// LinkedIn posts are now managed in /lib/config/linkedin-posts.ts
// To add or update LinkedIn posts, edit that file directly

interface ExternalNewsItem {
  id: string
  title: string
  excerpt: string
  url: string
  publishedAt: Date
  source: string
  category: string
  type: 'rss' | 'linkedin'
}


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeLinkedIn = searchParams.get('linkedin') === 'true'
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')

    const allNews: ExternalNewsItem[] = []

    // Fetch RSS feeds
    for (const source of externalSources) {
      if (source.enabled && (!category || source.category === category)) {
        try {
          const items = await parseRSSFeed(source.url, source.name, source.category)
          // Convert to ExternalNewsItem format
          const externalItems: ExternalNewsItem[] = items.map(item => ({
            id: item.id,
            title: item.title,
            excerpt: item.excerpt,
            url: item.url,
            publishedAt: item.publishedAt,
            source: item.source,
            category: item.category,
            type: 'rss' as const
          }))
          allNews.push(...externalItems)
        } catch (error) {
          console.warn(`Failed to fetch RSS from ${source.name}:`, error)
        }
      }
    }

    // Include LinkedIn posts if requested
    if (includeLinkedIn && workfloLinkedInPosts && workfloLinkedInPosts.length > 0) {
      console.log('Including LinkedIn posts:', workfloLinkedInPosts.length) // Debug log
      
      const linkedInItems: ExternalNewsItem[] = workfloLinkedInPosts.map(post => ({
        id: post.id,
        title: post.author || 'Workflo B.V.',
        excerpt: post.content || 'No content available',
        url: post.url,
        publishedAt: post.publishedAt,
        source: post.author || 'Workflo LinkedIn',
        category: 'social',
        type: 'linkedin' as const
      }))
      
      console.log('LinkedIn items created:', linkedInItems.length) // Debug log
      
      if (!category || category === 'social') {
        allNews.push(...linkedInItems)
        console.log('LinkedIn posts added to allNews. Total items now:', allNews.length) // Debug log
      }
    } else {
      console.log('LinkedIn posts not included:', { 
        includeLinkedIn, 
        postsAvailable: workfloLinkedInPosts?.length || 0 
      }) // Debug log
    }

    // Sort by publication date (newest first) and limit results
    const sortedNews = allNews
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, limit)

    return NextResponse.json({
      success: true,
      data: sortedNews,
      total: sortedNews.length,
      sources: {
        rss: externalSources.filter(s => s.enabled).length,
        linkedin: includeLinkedIn ? workfloLinkedInPosts.length : 0
      }
    })

  } catch (error) {
    console.error('Error fetching external news:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch external news',
      data: []
    }, { status: 500 })
  }
}

// Add configuration endpoint
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, sourceId, enabled } = body

    if (action === 'toggle-source') {
      const source = externalSources.find(s => s.name === sourceId)
      if (source) {
        source.enabled = enabled
        return NextResponse.json({ success: true, message: 'Source updated' })
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update configuration' 
    }, { status: 500 })
  }
}
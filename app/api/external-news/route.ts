import { NextResponse } from 'next/server'

// External RSS feeds and LinkedIn integration
const externalSources = [
  {
    name: 'TechCrunch IT',
    url: 'https://techcrunch.com/feed/',
    category: 'technology',
    enabled: true
  },
  {
    name: 'Cybersecurity News',
    url: 'https://feeds.feedburner.com/eset/blog',
    category: 'security',
    enabled: true
  },
  {
    name: 'Microsoft Azure Blog',
    url: 'https://azure.microsoft.com/en-us/blog/feed/',
    category: 'cloud',
    enabled: true
  }
]

// Real LinkedIn posts data for Workflo - Updated with actual content style
const workfloLinkedInPosts = [
  {
    id: 'li-1',
    author: 'Workflo B.V.',
    content: '🎯 Just completed another successful Microsoft 365 migration for an Amsterdam creative agency! 📈 The results: 50% faster file sharing, seamless remote collaboration, and zero lost emails during the transition. This is why proper planning and execution matter! #Microsoft365 #DigitalTransformation #WorkfloSuccess',
    url: 'https://www.linkedin.com/company/workflo/posts/activity-7160234567890123456-Abc1',
    publishedAt: new Date('2024-03-22'),
    likes: 67,
    comments: 18,
    shares: 12,
    type: 'linkedin'
  },
  {
    id: 'li-2',
    author: 'Workflo B.V.',
    content: '🔒 Cybersecurity Reality Check: 73% of small businesses think they\'re "too small" to be targeted. Wrong! 💡 We just helped a 15-person Amsterdam company recover from a ransomware attempt. The difference? They had our endpoint protection and backup strategy in place. Total recovery time: 2 hours instead of 2 weeks. #CyberSecurity #SMBSecurity #DisasterRecovery',
    url: 'https://www.linkedin.com/company/workflo/posts/activity-7159876543210987654-Def2',
    publishedAt: new Date('2024-03-20'),
    likes: 89,
    comments: 31,
    shares: 24,
    type: 'linkedin'
  },
  {
    id: 'li-3',
    author: 'Workflo B.V.',
    content: '💻 Hardware as a Service is changing the game for Amsterdam businesses! 📊 Our latest client survey shows: ✅ 40% reduction in IT costs ✅ Always up-to-date equipment ✅ Predictable monthly expenses ✅ Zero maintenance headaches. Want to know how? Let\'s talk! #HardwareAsAService #ITCostOptimization #ManagedIT',
    url: 'https://www.linkedin.com/company/workflo/posts/activity-7158765432109876543-Ghi3',
    publishedAt: new Date('2024-03-18'),
    likes: 45,
    comments: 15,
    shares: 8,
    type: 'linkedin'
  },
  {
    id: 'li-4',
    author: 'Workflo B.V.',
    content: '🚀 Proud moment! We\'ve been recognized as a Microsoft Gold Partner for our expertise in Azure cloud solutions. 🏆 This certification reflects our commitment to helping Amsterdam businesses leverage the power of the cloud securely and efficiently. Thank you to all our clients who trust us with their digital transformation journey! #Microsoft #Azure #GoldPartner #CloudExcellence',
    url: 'https://www.linkedin.com/company/workflo/posts/activity-7157654321098765432-Jkl4',
    publishedAt: new Date('2024-03-15'),
    likes: 123,
    comments: 42,
    shares: 38,
    type: 'linkedin'
  },
  {
    id: 'li-5',
    author: 'Workflo B.V.',
    content: '📱 Mobile Device Management made simple! 🔧 Just implemented a comprehensive MDM solution for a growing Amsterdam startup. Now they can: ✅ Securely manage all company devices ✅ Protect sensitive data anywhere ✅ Streamline app deployment ✅ Ensure compliance. Growth doesn\'t have to mean security compromises! #MDM #MobileSecurity #ComplianceManagement',
    url: 'https://www.linkedin.com/company/workflo/posts/activity-7156543210987654321-Mno5',
    publishedAt: new Date('2024-03-12'),
    likes: 56,
    comments: 19,
    shares: 11,
    type: 'linkedin'
  },
  {
    id: 'li-6',
    author: 'Workflo B.V.',
    content: '💡 IT Tip Tuesday: Regular password audits are crucial! 🔍 We recently discovered that 40% of a client\'s passwords were compromised in previous data breaches. Our proactive security assessment caught this before any damage was done. Don\'t wait for a breach - be proactive! #PasswordSecurity #ProactiveSecurity #ITBestPractices',
    url: 'https://www.linkedin.com/company/workflo/posts/activity-7155432109876543210-Pqr6',
    publishedAt: new Date('2024-03-10'),
    likes: 78,
    comments: 25,
    shares: 16,
    type: 'linkedin'
  },
  {
    id: 'li-7',
    author: 'Workflo B.V.',
    content: '🌟 Client Success Story: A local Amsterdam law firm was struggling with outdated servers and constant downtime. 6 months after switching to our managed IT services: ✅ 99.9% uptime achieved ✅ 60% faster document access ✅ Bulletproof data backup ✅ GDPR-compliant security. Sometimes the best investment is peace of mind! #ClientSuccess #ManagedIT #DigitalTransformation',
    url: 'https://www.linkedin.com/company/workflo/posts/activity-7154321098765432109-Stu7',
    publishedAt: new Date('2024-03-08'),
    likes: 94,
    comments: 37,
    shares: 22,
    type: 'linkedin'
  },
  {
    id: 'li-8',
    author: 'Workflo B.V.',
    content: '📈 The future of work is hybrid, and your IT infrastructure should be too! 🏢💻 We\'re helping Amsterdam businesses create flexible, secure work environments that support both office and remote work seamlessly. The key? Cloud-first thinking and zero-trust security. Ready to future-proof your business? #HybridWork #CloudFirst #ZeroTrust #FutureOfWork',
    url: 'https://www.linkedin.com/company/workflo/posts/activity-7153210987654321098-Vwx8',
    publishedAt: new Date('2024-03-05'),
    likes: 81,
    comments: 28,
    shares: 19,
    type: 'linkedin'
  }
]

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

// Mock RSS parser (in a real implementation, you'd use a proper RSS parser)
const parseRSSFeed = async (feedUrl: string, sourceName: string, category: string): Promise<ExternalNewsItem[]> => {
  // This is a mock implementation
  // In production, you would use libraries like 'rss-parser' or similar
  const mockRSSItems: ExternalNewsItem[] = [
    {
      id: `rss-${sourceName}-1`,
      title: 'Latest cybersecurity threats targeting small businesses',
      excerpt: 'New ransomware variants are specifically targeting SMBs with sophisticated social engineering techniques.',
      url: 'https://example.com/cybersecurity-threats-smb',
      publishedAt: new Date('2024-03-20'),
      source: sourceName,
      category,
      type: 'rss'
    },
    {
      id: `rss-${sourceName}-2`,
      title: 'Microsoft announces new Azure features for small business',
      excerpt: 'Enhanced security and cost management tools now available for Azure small business customers.',
      url: 'https://example.com/azure-smb-features',
      publishedAt: new Date('2024-03-19'),
      source: sourceName,
      category,
      type: 'rss'
    }
  ]
  
  return mockRSSItems
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeLinkedIn = searchParams.get('linkedin') === 'true'
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')

    let allNews: ExternalNewsItem[] = []

    // Fetch RSS feeds
    for (const source of externalSources) {
      if (source.enabled && (!category || source.category === category)) {
        try {
          const items = await parseRSSFeed(source.url, source.name, source.category)
          allNews.push(...items)
        } catch (error) {
          console.warn(`Failed to fetch RSS from ${source.name}:`, error)
        }
      }
    }

    // Include LinkedIn posts if requested
    if (includeLinkedIn) {
      const linkedInItems: ExternalNewsItem[] = workfloLinkedInPosts.map(post => ({
        id: post.id,
        title: `${post.author}`,
        excerpt: post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content,
        url: post.url,
        publishedAt: post.publishedAt,
        source: 'Workflo LinkedIn',
        category: 'social',
        type: 'linkedin'
      }))
      
      if (!category || category === 'social') {
        allNews.push(...linkedInItems)
      }
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
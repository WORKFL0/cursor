import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/data/workflo-data'
import { supabase } from '@/src/lib/supabase'

// Types for sitemap entries
interface SitemapEntry {
  url: string
  lastModified: Date
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
  alternates?: {
    languages: Record<string, string>
  }
}

export async function GET() {
  const baseUrl = siteConfig.url
  const lastModified = new Date()
  
  // Static pages with priorities and change frequencies
  const staticPages: Array<{
    path: string
    priority: number
    changeFreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
    alternates?: boolean
  }> = [
    // High priority pages
    { path: '', priority: 1.0, changeFreq: 'daily', alternates: true },
    { path: '/diensten', priority: 0.9, changeFreq: 'weekly', alternates: true },
    { path: '/contact', priority: 0.9, changeFreq: 'monthly', alternates: true },
    { path: '/over-ons', priority: 0.8, changeFreq: 'monthly', alternates: true },
    
    // Service pages
    { path: '/diensten/managed-it', priority: 0.9, changeFreq: 'weekly', alternates: true },
    { path: '/diensten/cybersecurity', priority: 0.9, changeFreq: 'weekly', alternates: true },
    { path: '/diensten/cloud', priority: 0.9, changeFreq: 'weekly', alternates: true },
    { path: '/diensten/cloud-oplossingen', priority: 0.9, changeFreq: 'weekly', alternates: true },
    { path: '/diensten/microsoft-365', priority: 0.9, changeFreq: 'weekly', alternates: true },
    { path: '/diensten/backup-disaster-recovery', priority: 0.8, changeFreq: 'weekly', alternates: true },
    { path: '/diensten/hardware-as-a-service', priority: 0.8, changeFreq: 'weekly', alternates: true },
    { path: '/diensten/voip-telefonie', priority: 0.8, changeFreq: 'weekly', alternates: true },
    
    // Sector pages
    { path: '/sectoren/architecten', priority: 0.7, changeFreq: 'monthly', alternates: true },
    { path: '/sectoren/divers', priority: 0.7, changeFreq: 'monthly', alternates: true },
    { path: '/sectoren/financiele-sector', priority: 0.7, changeFreq: 'monthly', alternates: true },
    { path: '/sectoren/gezondheidszorg', priority: 0.7, changeFreq: 'monthly', alternates: true },
    { path: '/sectoren/marketing-reclame', priority: 0.7, changeFreq: 'monthly', alternates: true },
    { path: '/sectoren/media', priority: 0.7, changeFreq: 'monthly', alternates: true },
    { path: '/sectoren/non-profit', priority: 0.7, changeFreq: 'monthly', alternates: true },
    { path: '/sectoren/retail', priority: 0.7, changeFreq: 'monthly', alternates: true },
    { path: '/sectoren/zzp', priority: 0.7, changeFreq: 'monthly', alternates: true },
    
    // Information pages
    { path: '/prijzen', priority: 0.8, changeFreq: 'weekly', alternates: true },
    { path: '/case-studies', priority: 0.7, changeFreq: 'monthly', alternates: true },
    { path: '/portfolio', priority: 0.7, changeFreq: 'monthly', alternates: true },
    { path: '/testimonials', priority: 0.7, changeFreq: 'monthly', alternates: true },
    { path: '/faq', priority: 0.8, changeFreq: 'weekly', alternates: true },
    { path: '/tevredenheidscheck', priority: 0.6, changeFreq: 'monthly', alternates: true },
    { path: '/referral', priority: 0.6, changeFreq: 'monthly', alternates: true },
    { path: '/werken-bij', priority: 0.7, changeFreq: 'monthly', alternates: true },
    { path: '/careers', priority: 0.7, changeFreq: 'monthly', alternates: true },
    { path: '/servicedesk', priority: 0.6, changeFreq: 'yearly', alternates: false },
    { path: '/support', priority: 0.6, changeFreq: 'yearly', alternates: false },
    { path: '/nieuws', priority: 0.8, changeFreq: 'daily', alternates: true },
    { path: '/downloads', priority: 0.5, changeFreq: 'monthly', alternates: false },
    
    // Legal pages
    { path: '/privacy', priority: 0.4, changeFreq: 'yearly', alternates: false },
    { path: '/terms', priority: 0.4, changeFreq: 'yearly', alternates: false },
    { path: '/cookies', priority: 0.4, changeFreq: 'yearly', alternates: false },
    { path: '/disclaimer', priority: 0.4, changeFreq: 'yearly', alternates: false },
  ]

  // Fetch dynamic content (articles)
  const articles = await fetchArticles()
  
  // Build sitemap entries
  const sitemapEntries: SitemapEntry[] = []
  
  // Add static pages
  staticPages.forEach(page => {
    const entry: SitemapEntry = {
      url: `${baseUrl}${page.path}`,
      lastModified,
      changeFrequency: page.changeFreq,
      priority: page.priority
    }
    
    // Add language alternatives for supported pages
    if (page.alternates) {
      entry.alternates = {
        languages: {
          'nl': `${baseUrl}${page.path}`,
          'en': `${baseUrl}/en${page.path}`
        }
      }
    }
    
    sitemapEntries.push(entry)
  })
  
  // Add article pages
  articles.forEach(article => {
    sitemapEntries.push({
      url: `${baseUrl}/nieuws/${article.slug}`,
      lastModified: new Date(article.updated_at || article.created_at),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          'nl': `${baseUrl}/nieuws/${article.slug}`,
          'en': `${baseUrl}/en/nieuws/${article.slug}`
        }
      }
    })
  })
  
  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries
    .map(entry => {
      let xml = `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>`
      
      // Add hreflang alternates
      if (entry.alternates?.languages) {
        Object.entries(entry.alternates.languages).forEach(([lang, url]) => {
          xml += `\n    <xhtml:link rel="alternate" hreflang="${lang}" href="${url}" />`
        })
      }
      
      xml += '\n  </url>'
      return xml
    })
    .join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'noindex'
    },
  })
}

// Helper function to fetch articles from CMS
async function fetchArticles() {
  if (!supabase) {
    return []
  }
  
  try {
    const { data: articles } = await supabase
      .from('articles')
      .select('slug, created_at, updated_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(1000) // Reasonable limit for sitemap
    
    return articles || []
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error)
    return []
  }
}
import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/data/workflo-data'
import { supabase } from '@/lib/supabase/client'

// Type for article from database
interface Article {
  slug: string
  created_at: string
  updated_at?: string
  status: string
}

// Type for case studies
interface CaseStudy {
  slug: string
  created_at: string
  updated_at?: string
  status: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url
  const lastModified = new Date()
  
  // Static pages with priorities and change frequencies
  const staticPages = [
    // High priority pages
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/diensten', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/over-ons', priority: 0.8, changeFrequency: 'monthly' as const },
    
    // Core service pages - High SEO value
    { path: '/diensten/managed-it', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/diensten/cybersecurity', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/diensten/cloud', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/diensten/cloud-oplossingen', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/diensten/microsoft-365', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/diensten/backup-disaster-recovery', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/diensten/hardware-as-a-service', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/diensten/voip-telefonie', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Industry sector pages - High SEO value for local search
    { path: '/sectoren/architecten', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/sectoren/divers', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/sectoren/financiele-sector', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/sectoren/gezondheidszorg', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/sectoren/marketing-reclame', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/sectoren/media', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/sectoren/non-profit', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/sectoren/retail', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/sectoren/zzp', priority: 0.7, changeFrequency: 'monthly' as const },
    
    // Information and conversion pages
    { path: '/prijzen', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/case-studies', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/portfolio', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/testimonials', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/faq', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/tevredenheidscheck', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/referral', priority: 0.6, changeFrequency: 'monthly' as const },
    
    // Career and company pages
    { path: '/werken-bij', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/careers', priority: 0.7, changeFrequency: 'monthly' as const },
    
    // News and resources
    { path: '/nieuws', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/downloads', priority: 0.5, changeFrequency: 'monthly' as const },
    
    // Support pages
    { path: '/servicedesk', priority: 0.6, changeFrequency: 'yearly' as const },
    { path: '/support', priority: 0.6, changeFrequency: 'yearly' as const },
    
    // Legal pages
    { path: '/privacy', priority: 0.4, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.4, changeFrequency: 'yearly' as const },
    { path: '/cookies', priority: 0.4, changeFrequency: 'yearly' as const },
    { path: '/disclaimer', priority: 0.4, changeFrequency: 'yearly' as const },
  ]

  // Fetch dynamic content
  const [articles, caseStudies] = await Promise.all([
    fetchArticles(),
    fetchCaseStudies(),
  ])

  // Build sitemap entries
  const sitemapEntries: MetadataRoute.Sitemap = []
  
  // Add static pages
  staticPages.forEach(page => {
    sitemapEntries.push({
      url: `${baseUrl}${page.path}`,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })
  })
  
  // Add article pages
  articles.forEach(article => {
    sitemapEntries.push({
      url: `${baseUrl}/nieuws/${article.slug}`,
      lastModified: new Date(article.updated_at || article.created_at),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  })
  
  // Add case study pages
  caseStudies.forEach(caseStudy => {
    sitemapEntries.push({
      url: `${baseUrl}/case-studies/${caseStudy.slug}`,
      lastModified: new Date(caseStudy.updated_at || caseStudy.created_at),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  })

  return sitemapEntries
}

// Helper function to fetch articles from CMS
async function fetchArticles(): Promise<Article[]> {
  if (!supabase) {
    console.warn('Supabase client not available for sitemap generation')
    return []
  }
  
  try {
    const { data: articles, error } = await supabase
      .from('articles')
      .select('slug, created_at, updated_at, status')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(1000) // Reasonable limit for sitemap
    
    if (error) {
      console.error('Error fetching articles for sitemap:', error)
      return []
    }
    
    return articles || []
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error)
    return []
  }
}

// Helper function to fetch case studies from CMS
async function fetchCaseStudies(): Promise<CaseStudy[]> {
  if (!supabase) {
    console.warn('Supabase client not available for sitemap generation')
    return []
  }
  
  try {
    const { data: caseStudies, error } = await supabase
      .from('case_studies')
      .select('slug, created_at, updated_at, status')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(100) // Reasonable limit
    
    if (error) {
      console.warn('Case studies table might not exist yet:', error.message)
      return []
    }
    
    return caseStudies || []
  } catch (error) {
    console.warn('Error fetching case studies for sitemap (table might not exist):', error)
    return []
  }
}
import { siteConfig } from '@/lib/data/workflo-data'
import { supabase } from '@/src/lib/supabase'

export async function GET() {
  const baseUrl = siteConfig.url
  
  // Fetch recent articles (last 2 days for Google News)
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  
  if (!supabase) {
    // Return empty sitemap if database not configured
    const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
</urlset>`
    
    return new Response(emptySitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
  
  try {
    const { data: articles } = await supabase
      .from('articles')
      .select('slug, title, excerpt, created_at, updated_at, category')
      .eq('status', 'published')
      .gte('created_at', twoDaysAgo)
      .order('created_at', { ascending: false })
      .limit(1000)

    if (!articles || articles.length === 0) {
      // Return empty news sitemap if no recent articles
      const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
</urlset>`
      
      return new Response(emptySitemap, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600',
        },
      })
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${articles
  .map(article => {
    const publishDate = new Date(article.created_at)
    const isRecent = (Date.now() - publishDate.getTime()) <= (2 * 24 * 60 * 60 * 1000)
    
    if (!isRecent) return ''
    
    return `  <url>
    <loc>${baseUrl}/nieuws/${article.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>Workflo IT News</news:name>
        <news:language>nl</news:language>
      </news:publication>
      <news:publication_date>${publishDate.toISOString()}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
      ${article.category ? `<news:keywords>${escapeXml(article.category)}, IT News, Amsterdam, Technology</news:keywords>` : '<news:keywords>IT News, Amsterdam, Technology</news:keywords>'}
    </news:news>
    <lastmod>${new Date(article.updated_at || article.created_at).toISOString()}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>`
  })
  .filter(entry => entry !== '')
  .join('\n')}
</urlset>`

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800', // 30 minutes cache for news
        'X-Robots-Tag': 'noindex'
      },
    })
    
  } catch (error) {
    console.error('Error generating news sitemap:', error)
    
    // Return empty sitemap on error
    const errorSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
</urlset>`
    
    return new Response(errorSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300', // 5 minutes cache on error
      },
    })
  }
}

// Helper function to escape XML characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
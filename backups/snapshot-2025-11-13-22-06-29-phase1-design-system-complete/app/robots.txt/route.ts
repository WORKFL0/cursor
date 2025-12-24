import { siteConfig } from '@/lib/data/workflo-data'

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Allow specific crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

# Disallow admin and private areas
User-agent: *
Disallow: /cms/
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /login/
Disallow: /cms/login/
Disallow: /test-*
Disallow: /*?*
Disallow: /search?
Disallow: /ai-demo/
Disallow: /newsletter-demo/
Disallow: /system-status/
Disallow: /status/

# Allow important directories
User-agent: *
Allow: /images/
Allow: /favicon.ico
Allow: /sitemap.xml
Allow: /robots.txt

# Crawl rate limiting for resource-intensive bots
User-agent: MJ12bot
Crawl-delay: 10

User-agent: AhrefsBot
Crawl-delay: 5

User-agent: SemrushBot
Crawl-delay: 5

User-agent: DotBot
Crawl-delay: 2

# Block problematic bots
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: BLEXBot
Disallow: /

User-agent: DataForSeoBot
Disallow: /

# Sitemap location
Sitemap: ${siteConfig.url}/sitemap.xml

# Additional sitemap for news (if implemented)
# Sitemap: ${siteConfig.url}/news-sitemap.xml

# Host directive
Host: ${siteConfig.url}
`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
    },
  })
}
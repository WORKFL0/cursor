import { MetadataRoute } from 'next'

export async function GET() {
  const baseUrl = 'https://workflo.it'
  const lastModified = new Date().toISOString()

  const staticPages = [
    '',
    '/diensten/managed-it',
    '/diensten/cybersecurity',
    '/diensten/cloud',
    '/diensten/microsoft-365',
    '/diensten/backup-disaster-recovery',
    '/diensten/hardware-as-a-service',
    '/diensten/voip-telefonie',
    '/prijzen',
    '/contact',
    '/over-ons',
    '/case-studies',
    '/portfolio',
    '/testimonials',
    '/faq',
    '/tevredenheidscheck',
    '/referral',
    '/werken-bij',
    '/servicedesk',
    '/nieuws',
    '/privacy',
    '/terms',
    '/cookies',
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : page.includes('/diensten/') ? '0.9' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
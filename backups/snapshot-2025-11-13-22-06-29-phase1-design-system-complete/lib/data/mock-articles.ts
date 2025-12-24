/**
 * Mock Articles Data
 * Used when database is not available
 */

export interface Article {
  id: string
  title: string
  titleNL: string
  slug: string
  excerpt: string
  excerptNL: string
  content: string
  contentNL: string
  author: string
  category: string
  tags: string[]
  image?: string
  published: boolean
  featured: boolean
  publishedAt: Date
  createdAt: Date
  updatedAt: Date
}

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'The Importance of Regular IT Maintenance',
    titleNL: 'Het Belang van Regelmatig IT-Onderhoud',
    slug: 'importance-of-it-maintenance',
    excerpt: 'Regular IT maintenance is crucial for keeping your systems running smoothly and preventing costly downtime.',
    excerptNL: 'Regelmatig IT-onderhoud is cruciaal voor het soepel laten draaien van uw systemen en het voorkomen van kostbare downtime.',
    content: `
      <h2>Why IT Maintenance Matters</h2>
      <p>In today's digital age, businesses rely heavily on their IT infrastructure. Regular maintenance ensures optimal performance, security, and reliability.</p>
      <h3>Key Benefits</h3>
      <ul>
        <li>Prevents unexpected downtime</li>
        <li>Improves system performance</li>
        <li>Enhances security</li>
        <li>Extends hardware lifespan</li>
      </ul>
    `,
    contentNL: `
      <h2>Waarom IT-Onderhoud Belangrijk Is</h2>
      <p>In het huidige digitale tijdperk zijn bedrijven sterk afhankelijk van hun IT-infrastructuur. Regelmatig onderhoud zorgt voor optimale prestaties, beveiliging en betrouwbaarheid.</p>
      <h3>Belangrijkste Voordelen</h3>
      <ul>
        <li>Voorkomt onverwachte downtime</li>
        <li>Verbetert systeemprestaties</li>
        <li>Verhoogt de beveiliging</li>
        <li>Verlengt de levensduur van hardware</li>
      </ul>
    `,
    author: 'Workflo Team',
    category: 'IT Tips',
    tags: ['maintenance', 'best-practices', 'infrastructure'],
    published: true,
    featured: true,
    publishedAt: new Date('2024-03-15'),
    createdAt: new Date('2024-03-14'),
    updatedAt: new Date('2024-03-15')
  },
  {
    id: '2',
    title: 'Cybersecurity Best Practices for Small Businesses',
    titleNL: 'Cybersecurity Best Practices voor Kleine Bedrijven',
    slug: 'cybersecurity-best-practices',
    excerpt: 'Protect your business from cyber threats with these essential security practices.',
    excerptNL: 'Bescherm uw bedrijf tegen cyberdreigingen met deze essentiële beveiligingspraktijken.',
    content: `
      <h2>Essential Security Measures</h2>
      <p>Small businesses are increasingly targeted by cybercriminals. Implementing these best practices can significantly reduce your risk.</p>
      <h3>Top 5 Security Measures</h3>
      <ol>
        <li>Use strong, unique passwords</li>
        <li>Enable two-factor authentication</li>
        <li>Keep software updated</li>
        <li>Regular backups</li>
        <li>Employee training</li>
      </ol>
    `,
    contentNL: `
      <h2>Essentiële Beveiligingsmaatregelen</h2>
      <p>Kleine bedrijven worden steeds vaker het doelwit van cybercriminelen. Het implementeren van deze best practices kan uw risico aanzienlijk verminderen.</p>
      <h3>Top 5 Beveiligingsmaatregelen</h3>
      <ol>
        <li>Gebruik sterke, unieke wachtwoorden</li>
        <li>Schakel tweefactorauthenticatie in</li>
        <li>Houd software up-to-date</li>
        <li>Regelmatige backups</li>
        <li>Medewerkerstraining</li>
      </ol>
    `,
    author: 'Security Team',
    category: 'Cybersecurity',
    tags: ['security', 'best-practices', 'small-business'],
    published: true,
    featured: false,
    publishedAt: new Date('2024-03-10'),
    createdAt: new Date('2024-03-09'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: '3',
    title: 'Cloud Migration: A Step-by-Step Guide',
    titleNL: 'Cloud Migratie: Een Stap-voor-Stap Gids',
    slug: 'cloud-migration-guide',
    excerpt: 'Learn how to successfully migrate your business to the cloud with our comprehensive guide.',
    excerptNL: 'Leer hoe u uw bedrijf succesvol naar de cloud kunt migreren met onze uitgebreide gids.',
    content: `
      <h2>Planning Your Cloud Migration</h2>
      <p>Moving to the cloud can transform your business operations, but careful planning is essential for success.</p>
      <h3>Migration Steps</h3>
      <ol>
        <li>Assess your current infrastructure</li>
        <li>Choose the right cloud provider</li>
        <li>Plan your migration strategy</li>
        <li>Test thoroughly</li>
        <li>Execute and monitor</li>
      </ol>
    `,
    contentNL: `
      <h2>Uw Cloud Migratie Plannen</h2>
      <p>Verhuizen naar de cloud kan uw bedrijfsvoering transformeren, maar zorgvuldige planning is essentieel voor succes.</p>
      <h3>Migratiestappen</h3>
      <ol>
        <li>Beoordeel uw huidige infrastructuur</li>
        <li>Kies de juiste cloudprovider</li>
        <li>Plan uw migratiestrategie</li>
        <li>Test grondig</li>
        <li>Voer uit en monitor</li>
      </ol>
    `,
    author: 'Cloud Team',
    category: 'Cloud',
    tags: ['cloud', 'migration', 'azure', 'aws'],
    published: true,
    featured: true,
    publishedAt: new Date('2024-03-05'),
    createdAt: new Date('2024-03-04'),
    updatedAt: new Date('2024-03-05')
  }
]

// Helper functions
export function getMockArticles(options?: {
  published?: boolean
  featured?: boolean
  category?: string
  limit?: number
  offset?: number
}): Article[] {
  let filtered = [...mockArticles]
  
  if (options?.published !== undefined) {
    filtered = filtered.filter(a => a.published === options.published)
  }
  
  if (options?.featured !== undefined) {
    filtered = filtered.filter(a => a.featured === options.featured)
  }
  
  if (options?.category) {
    filtered = filtered.filter(a => a.category === options.category)
  }
  
  // Apply offset and limit
  const start = options?.offset || 0
  const end = options?.limit ? start + options.limit : undefined
  
  return filtered.slice(start, end)
}

export function getMockArticleBySlug(slug: string): Article | undefined {
  return mockArticles.find(a => a.slug === slug)
}

export function getMockCategories(): string[] {
  const categories = new Set(mockArticles.map(a => a.category))
  return Array.from(categories)
}

export function getMockTags(): string[] {
  const tags = new Set(mockArticles.flatMap(a => a.tags))
  return Array.from(tags)
}
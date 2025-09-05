#!/usr/bin/env tsx
/**
 * Database Seeding Script for Workflo CMS
 * This script populates the database with initial data for development and testing
 * Author: Claude Code - Workflo Backend System
 * Date: 2025-09-04
 * 
 * Usage: npm run seed:database
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../lib/database.types'
import bcrypt from 'bcryptjs'

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// ================================================================
// SEED DATA DEFINITIONS
// ================================================================

const SEED_USERS = [
  {
    email: 'admin@workflo.it',
    username: 'admin',
    password: 'Admin123!',
    role: 'admin' as const,
    first_name: 'Admin',
    last_name: 'User',
    is_active: true
  },
  {
    email: 'editor@workflo.it',
    username: 'editor',
    password: 'Editor123!',
    role: 'editor' as const,
    first_name: 'Content',
    last_name: 'Editor',
    is_active: true
  },
  {
    email: 'florian@workflo.it',
    username: 'florian',
    password: 'Florian123!',
    role: 'admin' as const,
    first_name: 'Florian',
    last_name: 'van der Laan',
    is_active: true
  }
]

const SEED_CATEGORIES = [
  {
    name: 'Nieuws',
    slug: 'nieuws',
    description: 'Bedrijfsnieuws en updates van Workflo'
  },
  {
    name: 'Blog',
    slug: 'blog',
    description: 'Technische artikelen en inzichten'
  },
  {
    name: 'Case Studies',
    slug: 'case-studies',
    description: 'Succesverhalen van onze klanten'
  },
  {
    name: 'Updates',
    slug: 'updates',
    description: 'Product en service updates'
  },
  {
    name: 'Events',
    slug: 'events',
    description: 'Aankomende evenementen en webinars'
  },
  {
    name: 'Tutorials',
    slug: 'tutorials',
    description: 'How-to gidsen en tutorials'
  },
  {
    name: 'Security',
    slug: 'security',
    description: 'Cybersecurity tips en best practices'
  }
]

const SEED_TAGS = [
  { name: 'Microsoft 365', slug: 'microsoft-365' },
  { name: 'Azure', slug: 'azure' },
  { name: 'Security', slug: 'security' },
  { name: 'Cloud', slug: 'cloud' },
  { name: 'Migration', slug: 'migration' },
  { name: 'Backup', slug: 'backup' },
  { name: 'Monitoring', slug: 'monitoring' },
  { name: 'Automation', slug: 'automation' },
  { name: 'MKB', slug: 'mkb' },
  { name: 'Tips', slug: 'tips' },
  { name: 'Tutorial', slug: 'tutorial' },
  { name: 'Case Study', slug: 'case-study' },
  { name: 'Best Practice', slug: 'best-practice' },
  { name: 'Innovation', slug: 'innovation' },
  { name: 'Digital Transformation', slug: 'digital-transformation' }
]

const SEED_ARTICLES = [
  {
    title: 'De Complete Microsoft 365 Migratie Gids voor MKB',
    slug: 'complete-microsoft-365-migratie-gids-mkb',
    excerpt: 'Alles wat je moet weten over het migreren naar Microsoft 365, van planning tot uitvoering.',
    content: `# De Complete Microsoft 365 Migratie Gids voor MKB

Microsoft 365 biedt moderne werkplekoplossingen die perfect zijn voor het MKB. Deze gids helpt je bij het plannen en uitvoeren van een succesvolle migratie.

## Waarom Microsoft 365?

- **Kosteneffectief**: Voorspelbare maandelijkse kosten
- **Schaalbaarheid**: Groei mee met je bedrijf
- **Security**: Enterprise-level beveiliging
- **Samenwerking**: Modern werken en communiceren

## Migratiestappen

### 1. Voorbereiding en Assessment
- Huidige IT-infrastructuur in kaart brengen
- Gebruikersvereisten analyseren
- Migratieplan opstellen

### 2. Tenant Setup
- Microsoft 365 tenant configureren
- Domeinen verificeren
- Licenties toewijzen

### 3. Email Migratie
- Exchange Online opzetten
- Mailbox migratie uitvoeren
- DNS-records bijwerken

### 4. Data Migratie
- OneDrive for Business inrichten
- SharePoint sites migreren
- Teams configureren

### 5. Training en Adoptie
- Gebruikerstraining organiseren
- Support documentatie maken
- Change management

## Best Practices

- Plan zorgvuldig en communiceer helder
- Voer migratie gefaseerd uit
- Test grondig voor go-live
- Monitor post-migratie performance

Wil je hulp bij je Microsoft 365 migratie? [Neem contact op](/contact) voor een vrijblijvend gesprek.`,
    author: 'Florian van der Laan',
    category: 'Blog',
    tags: ['microsoft-365', 'migration', 'mkb', 'tutorial'],
    published: true,
    featured: true,
    source: 'cms' as const,
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    title: 'Cybersecurity Essentials: 10 Tips voor Kleine Bedrijven',
    slug: 'cybersecurity-essentials-10-tips-kleine-bedrijven',
    excerpt: 'Bescherm je bedrijf tegen cyberdreigingen met deze praktische beveiligingstips.',
    content: `# Cybersecurity Essentials: 10 Tips voor Kleine Bedrijven

Cybersecurity is niet alleen voor grote bedrijven. Kleine bedrijven zijn vaak juist kwetsbaarder. Hier zijn 10 essentiële tips.

## 1. Sterke Wachtwoorden en MFA

- Gebruik unieke, complexe wachtwoorden
- Schakel Multi-Factor Authentication in
- Overweeg een password manager

## 2. Software Updates

- Houd besturingssystemen up-to-date
- Update applicaties regelmatig
- Schakel automatische updates in waar mogelijk

## 3. Regelmatige Backups

- Maak dagelijkse backups
- Test backup herstel procedures
- Bewaar backups offline of in de cloud

## 4. Firewall en Antivirus

- Configureer een professionele firewall
- Installeer enterprise antivirus software
- Monitor netwerk verkeer

## 5. Email Beveiliging

- Filter spam en phishing emails
- Train medewerkers herkennen verdachte emails
- Gebruik email encryption voor gevoelige data

## 6. Toegangscontrole

- Implementeer principe van minimale toegang
- Review user rechten regelmatig
- Gebruik role-based access control

## 7. Network Segmentatie

- Scheid kritieke systemen af
- Gebruik VLANs voor netwerkscheiding
- Implementeer zero-trust principes

## 8. Security Awareness Training

- Train alle medewerkers regelmatig
- Simuleer phishing attacks
- Creëer security-bewuste cultuur

## 9. Incident Response Plan

- Maak een incident response plan
- Test het plan regelmatig
- Zorg voor duidelijke communicatie lijnen

## 10. Professional Security Assessment

- Laat jaarlijks een security audit uitvoeren
- Implementeer recommendations
- Monitor en verbeter continu

## Conclusie

Cybersecurity is een continu proces. Door deze 10 tips te implementeren, versterk je de beveiliging van je bedrijf aanzienlijk.

Wil je een gratis security assessment? [Neem contact op](/contact) met ons team.`,
    author: 'Workflo Security Team',
    category: 'Security',
    tags: ['security', 'tips', 'mkb', 'best-practice'],
    published: true,
    featured: false,
    source: 'cms' as const,
    published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
  },
  {
    title: 'Case Study: Creative Agency Amsterdam - Complete IT Transformatie',
    slug: 'case-study-creative-agency-amsterdam-it-transformatie',
    excerpt: 'Hoe een Amsterdamse creative agency hun IT volledig transformeerde met Microsoft 365 en Azure.',
    content: `# Case Study: Creative Agency Amsterdam - Complete IT Transformatie

## De Uitdaging

Een groeiende creative agency in Amsterdam met 35 medewerkers kampte met verouderde IT-systemen:

- On-premise Exchange server uit 2012
- Beperkte remote work mogelijkheden
- Geen centrale file storage
- Frequente IT-problemen
- Hoge onderhoudskosten

## De Oplossing

Workflo ontwierp een complete cloud-first strategie:

### Microsoft 365 Business Premium
- Exchange Online voor email en agenda
- SharePoint Online voor document management
- Microsoft Teams voor communicatie
- OneDrive for Business voor persönlijke files

### Azure Infrastructure
- Azure AD voor identity management
- Azure Backup voor data protection
- Azure Monitor voor proactive monitoring

### Security Enhancements
- Multi-Factor Authentication
- Conditional Access policies
- Advanced Threat Protection
- Data Loss Prevention

## Implementation

### Fase 1: Planning (2 weken)
- Current state assessment
- Migration planning
- User training planning
- Risk assessment

### Fase 2: Setup (1 week)
- Microsoft 365 tenant configuration
- Azure AD setup
- Security policies implementation
- DNS preparation

### Fase 3: Migration (2 weken)
- Email migration (weekends)
- File migration to SharePoint/OneDrive
- Teams deployment
- User account provisioning

### Fase 4: Training & Support (2 weken)
- End-user training sessions
- Administrator training
- Documentation delivery
- Go-live support

## Resultaten

Na 3 maanden:

### Performance Improvements
- **99.9%** email uptime (vs 85% previously)
- **60%** faster file access
- **Zero** email server outages
- **50%** reduction in IT support tickets

### Business Benefits
- **€2,400/maand** cost savings
- **40%** improvement in team collaboration
- **100%** remote work capability
- **Enhanced** security posture

### User Satisfaction
- **95%** user satisfaction score
- **85%** reported productivity increase
- **90%** adoption rate after 1 month

## Client Testimonial

*"De migratie naar Microsoft 365 was een game-changer voor ons agency. We kunnen nu overal werken, files zijn altijd beschikbaar, en onze IT-problemen zijn praktisch verdwenen. Workflo heeft het hele proces perfect gemanaged."*

**- Sarah Mitchell, Operations Director**

## Lessons Learned

- Zorgvuldige planning is essentieel
- User training accelereert adoptie
- Phased approach minimiseert risico's
- 24/7 support tijdens go-live is cruciaal

## Volgende Stappen

De agency plant nu:
- Power BI implementatie voor analytics
- Power Automate voor workflow automation
- Azure DevOps voor development teams
- Advanced security features

Wil je ook je IT transformeren? [Neem contact op](/contact) voor een gratis assessment.`,
    author: 'Florian van der Laan',
    category: 'Case Studies',
    tags: ['case-study', 'microsoft-365', 'azure', 'digital-transformation'],
    published: true,
    featured: true,
    source: 'cms' as const,
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
  },
  {
    title: 'Azure Cost Optimization: 15 Strategieën om je Cloud Kosten te Verlagen',
    slug: 'azure-cost-optimization-15-strategieen-cloud-kosten-verlagen',
    excerpt: 'Praktische tips om je Azure kosten onder controle te houden zonder in te leveren op performance.',
    content: `# Azure Cost Optimization: 15 Strategieën om je Cloud Kosten te Verlagen

Cloud kosten kunnen snel oplopen. Met deze 15 strategieën hou je je Azure uitgaven onder controle.

## 1. Right-sizing Resources

- Monitor resource utilization
- Downsize underutilized VMs
- Use Azure Advisor recommendations

## 2. Reserved Instances

- Purchase Reserved Instances voor stable workloads
- 1-year vs 3-year commitments
- Mix and match RI types

## 3. Spot Instances

- Use Spot VMs voor non-critical workloads
- Save up to 90% on compute costs
- Implement fault-tolerant architectures

## 4. Auto-scaling

- Implement horizontal scaling
- Schedule-based scaling
- Metrics-based scaling

## 5. Storage Optimization

- Use appropriate storage tiers
- Implement lifecycle policies
- Clean up unused storage

## 6. Network Cost Management

- Minimize data transfer costs
- Use CDN for global content
- Optimize bandwidth usage

## 7. Development/Test Subscriptions

- Use Dev/Test pricing
- Separate dev and prod subscriptions
- Implement resource policies

## 8. Resource Tagging

- Tag all resources consistently
- Track costs per project/department
- Implement cost allocation

## 9. Azure Cost Management

- Set up budgets and alerts
- Use cost analysis reports
- Implement cost anomaly detection

## 10. Serverless Computing

- Use Azure Functions waar mogelijk
- Pay only for execution time
- Reduce always-on costs

## 11. Container Optimization

- Use Azure Container Instances
- Right-size container resources
- Implement container scheduling

## 12. Database Cost Optimization

- Use appropriate service tiers
- Implement database scaling
- Consider PaaS vs IaaS

## 13. Monitoring and Alerting

- Set up cost alerts
- Monitor usage patterns
- Regular cost reviews

## 14. Resource Cleanup

- Delete unused resources
- Implement cleanup policies
- Regular environment audits

## 15. Professional Assessment

- Annual cost optimization reviews
- Expert recommendations
- Implementation support

## Implementation Tips

1. Start with highest-cost resources
2. Implement changes gradually
3. Monitor impact carefully
4. Document all changes

## Conclusion

Cost optimization is an ongoing process. Deze 15 strategieën helpen je om Azure kosten onder controle te houden terwijl je optimale performance behoudt.

Wil je hulp bij Azure cost optimization? [Neem contact op](/contact) met onze cloud experts.`,
    author: 'Azure Team Workflo',
    category: 'Blog',
    tags: ['azure', 'cloud', 'cost-optimization', 'tips'],
    published: true,
    featured: false,
    source: 'cms' as const,
    published_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
  }
]

const SEED_EMAIL_TEMPLATES = [
  {
    name: 'welcome_new_user',
    type: 'welcome' as const,
    subject: 'Welkom bij Workflo - Je account is aangemaakt',
    body_html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0066cc;">Welkom bij Workflo, {{name}}!</h1>
        <p>Je account is succesvol aangemaakt. We zijn blij je te verwelkomen bij ons team.</p>
        <p><strong>Je accountgegevens:</strong></p>
        <ul>
          <li>Email: {{email}}</li>
          <li>Gebruikersnaam: {{username}}</li>
        </ul>
        <p>Je kunt nu inloggen op ons CMS systeem en beginnen met het beheren van content.</p>
        <p>Heb je vragen? Neem gerust contact met ons op.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Dit bericht is automatisch gegenereerd door het Workflo CMS systeem.</p>
      </div>
    `,
    body_text: 'Welkom bij Workflo, {{name}}! Je account is succesvol aangemaakt. Email: {{email}}, Gebruikersnaam: {{username}}',
    variables: { name: 'string', email: 'string', username: 'string' },
    is_active: true
  },
  {
    name: 'contact_form_notification',
    type: 'notification' as const,
    subject: 'Nieuw contactformulier bericht - {{company}}',
    body_html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0066cc;">Nieuw contactformulier bericht</h2>
        <p><strong>Van:</strong> {{name}} ({{email}})</p>
        <p><strong>Bedrijf:</strong> {{company}}</p>
        <p><strong>Telefoon:</strong> {{phone}}</p>
        <p><strong>Onderwerp:</strong> {{subject}}</p>
        <p><strong>Bericht:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #0066cc;">
          {{message}}
        </div>
        <p style="margin-top: 20px;">
          <a href="mailto:{{email}}" style="background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reageer direct
          </a>
        </p>
      </div>
    `,
    body_text: 'Nieuw contactformulier bericht van {{name}} ({{email}}) bij {{company}}: {{message}}',
    variables: { name: 'string', email: 'string', company: 'string', phone: 'string', subject: 'string', message: 'string' },
    is_active: true
  },
  {
    name: 'weekly_newsletter',
    type: 'newsletter' as const,
    subject: 'Workflo Weekly - IT Nieuws & Tips',
    body_html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <header style="background: #0066cc; color: white; padding: 20px; text-align: center;">
          <h1>Workflo Weekly</h1>
          <p>Week {{week_number}} - {{date}}</p>
        </header>
        
        <div style="padding: 20px;">
          <h2>Deze week in IT</h2>
          {{content}}
          
          <hr style="margin: 30px 0;">
          
          <h3>Featured Article</h3>
          <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
            <h4><a href="{{featured_url}}" style="color: #0066cc;">{{featured_title}}</a></h4>
            <p>{{featured_excerpt}}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="{{website_url}}" style="background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Bezoek onze website
            </a>
          </div>
        </div>
        
        <footer style="background: #f5f5f5; padding: 15px; text-align: center; color: #666;">
          <p>Je ontvangt deze nieuwsbrief omdat je bent geabonneerd op Workflo updates.</p>
          <p><a href="{{unsubscribe_url}}">Uitschrijven</a></p>
        </footer>
      </div>
    `,
    body_text: 'Workflo Weekly - Week {{week_number}}: {{content}}',
    variables: { 
      week_number: 'string', 
      date: 'string', 
      content: 'string',
      featured_title: 'string',
      featured_excerpt: 'string',
      featured_url: 'string',
      website_url: 'string',
      unsubscribe_url: 'string'
    },
    is_active: true
  }
]

const NEWSLETTER_SUBSCRIBERS = [
  { email: 'test1@example.com', name: 'Test User 1', source: 'website', tags: ['newsletter', 'tech'] },
  { email: 'test2@example.com', name: 'Test User 2', source: 'contact-form', tags: ['newsletter'] },
  { email: 'demo@workflo.it', name: 'Demo User', source: 'manual', tags: ['newsletter', 'demo'] }
]

// ================================================================
// SEEDING FUNCTIONS
// ================================================================

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

async function seedUsers() {
  console.log('🔐 Seeding users...')
  
  for (const userData of SEED_USERS) {
    const hashedPassword = await hashPassword(userData.password)
    
    const { error } = await supabase
      .from('cms_users')
      .upsert({
        email: userData.email,
        username: userData.username,
        password_hash: hashedPassword,
        role: userData.role,
        first_name: userData.first_name,
        last_name: userData.last_name,
        is_active: userData.is_active
      })
      .select()

    if (error) {
      console.error(`❌ Error seeding user ${userData.email}:`, error.message)
    } else {
      console.log(`✅ Created user: ${userData.email}`)
    }
  }
}

async function seedCategories() {
  console.log('📁 Seeding categories...')
  
  const { error } = await supabase
    .from('categories')
    .upsert(SEED_CATEGORIES)
    .select()

  if (error) {
    console.error('❌ Error seeding categories:', error.message)
  } else {
    console.log(`✅ Created ${SEED_CATEGORIES.length} categories`)
  }
}

async function seedTags() {
  console.log('🏷️  Seeding tags...')
  
  const { error } = await supabase
    .from('tags')
    .upsert(SEED_TAGS)
    .select()

  if (error) {
    console.error('❌ Error seeding tags:', error.message)
  } else {
    console.log(`✅ Created ${SEED_TAGS.length} tags`)
  }
}

async function seedArticles() {
  console.log('📝 Seeding articles...')
  
  for (const articleData of SEED_ARTICLES) {
    const { error } = await supabase
      .from('articles')
      .upsert(articleData)
      .select()

    if (error) {
      console.error(`❌ Error seeding article ${articleData.slug}:`, error.message)
    } else {
      console.log(`✅ Created article: ${articleData.title}`)
    }
  }
}

async function seedEmailTemplates() {
  console.log('📧 Seeding email templates...')
  
  for (const template of SEED_EMAIL_TEMPLATES) {
    const { error } = await supabase
      .from('email_templates')
      .upsert(template)
      .select()

    if (error) {
      console.error(`❌ Error seeding email template ${template.name}:`, error.message)
    } else {
      console.log(`✅ Created email template: ${template.name}`)
    }
  }
}

async function seedNewsletterSubscribers() {
  console.log('📬 Seeding newsletter subscribers...')
  
  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert(NEWSLETTER_SUBSCRIBERS)
    .select()

  if (error) {
    console.error('❌ Error seeding newsletter subscribers:', error.message)
  } else {
    console.log(`✅ Created ${NEWSLETTER_SUBSCRIBERS.length} newsletter subscribers`)
  }
}

async function seedAnalytics() {
  console.log('📊 Seeding analytics data...')
  
  // Create some sample analytics events
  const events = []
  const now = new Date()
  
  for (let i = 0; i < 100; i++) {
    const date = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Last 30 days
    events.push({
      event_type: 'page_view',
      event_name: 'page_viewed',
      page_url: `https://workflo.it/blog/article-${Math.floor(Math.random() * 10)}`,
      ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`,
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      properties: { source: 'organic', device: 'desktop' },
      created_at: date.toISOString()
    })
  }
  
  const { error } = await supabase
    .from('analytics_events')
    .upsert(events)
    .select()

  if (error) {
    console.error('❌ Error seeding analytics:', error.message)
  } else {
    console.log(`✅ Created ${events.length} analytics events`)
  }
}

// ================================================================
// MAIN SEEDING FUNCTION
// ================================================================

async function main() {
  console.log('🌱 Starting database seeding...')
  console.log('=====================================')

  try {
    // Test database connection
    const { error: testError } = await supabase
      .from('cms_users')
      .select('count')
      .single()

    if (testError && !testError.message.includes('multiple')) {
      throw new Error(`Database connection failed: ${testError.message}`)
    }

    console.log('✅ Database connection established')

    // Run seeding functions in order
    await seedUsers()
    await seedCategories() 
    await seedTags()
    await seedArticles()
    await seedEmailTemplates()
    await seedNewsletterSubscribers()
    await seedAnalytics()

    console.log('=====================================')
    console.log('🎉 Database seeding completed successfully!')
    console.log('')
    console.log('📧 Admin credentials:')
    console.log('   Email: admin@workflo.it')
    console.log('   Password: Admin123!')
    console.log('')
    console.log('📧 Editor credentials:')
    console.log('   Email: editor@workflo.it')
    console.log('   Password: Editor123!')
    console.log('')
    console.log('📧 Florian credentials:')
    console.log('   Email: florian@workflo.it')
    console.log('   Password: Florian123!')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run the seeding script
if (require.main === module) {
  main()
}
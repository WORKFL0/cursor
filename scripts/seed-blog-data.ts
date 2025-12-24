#!/usr/bin/env tsx

/**
 * Seed Blog Data
 *
 * Adds sample blog posts, categories, and authors for testing
 * Run with: npx tsx scripts/seed-blog-data.ts
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_P_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_service_role || process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials!')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function seedBlogData() {
  console.log('🌱 Starting blog data seeding...\n')

  try {
    // 1. Seed categories
    console.log('📂 Seeding categories...')
    const { data: categories, error: categoriesError } = await supabase
      .from('blog_categories')
      .upsert([
        {
          name: 'Cybersecurity',
          slug: 'cybersecurity',
          description: 'Updates over cybersecurity dreigingen en oplossingen',
          color: '#EF4444',
          icon: '🔒',
        },
        {
          name: 'IT Tips',
          slug: 'it-tips',
          description: 'Praktische IT tips voor bedrijven',
          color: '#3B82F6',
          icon: '💡',
        },
        {
          name: 'Company News',
          slug: 'company-news',
          description: 'Nieuws van Workflo',
          color: '#10B981',
          icon: '📢',
        },
        {
          name: 'MSP Insights',
          slug: 'msp-insights',
          description: 'Inzichten over Managed Service Providers',
          color: '#8B5CF6',
          icon: '📊',
        },
      ], { onConflict: 'slug' })
      .select()

    if (categoriesError) throw categoriesError
    console.log(`   ✅ ${categories?.length} categories created\n`)

    // 2. Seed authors
    console.log('👤 Seeding authors...')
    const { data: authors, error: authorsError } = await supabase
      .from('blog_authors')
      .upsert([
        {
          email: 'info@workflo.it',
          display_name: 'Workflo Team',
          bio: 'IT experts die Nederlandse bedrijven helpen groeien met managed IT services',
          role: 'admin',
          is_active: true,
        },
      ], { onConflict: 'email' })
      .select()

    if (authorsError) throw authorsError
    console.log(`   ✅ ${authors?.length} authors created\n`)

    const author = authors![0]
    const cybersecurityCategory = categories!.find(c => c.slug === 'cybersecurity')!
    const itTipsCategory = categories!.find(c => c.slug === 'it-tips')!

    // 3. Seed blog posts
    console.log('📝 Seeding blog posts...')
    const samplePosts = [
      {
        title: 'Nieuwe Ransomware Golf Treft Nederlandse Bedrijven',
        slug: 'nieuwe-ransomware-golf-treft-nederlandse-bedrijven',
        excerpt: 'De laatste ransomware aanval heeft al meer dan 50 Nederlandse MKB bedrijven getroffen. Leer hoe je jezelf beschermt tegen deze dreiging.',
        content: `# Wat is er aan de hand?

De afgelopen weken is er een nieuwe golf van ransomware aanvallen gaande die specifiek gericht is op Nederlandse MKB bedrijven. Cybercriminelen maken gebruik van geavanceerde phishing technieken om toegang te krijgen tot bedrijfsnetwerken.

## Hoe werkt de aanval?

1. **Phishing email**: Medewerkers ontvangen een nep-factuur
2. **Malware installatie**: Bij het openen wordt ransomware geïnstalleerd
3. **Encryptie**: Alle bedrijfsbestanden worden versleuteld
4. **Losgeld**: Er wordt €50.000+ gevraagd voor de decryptie sleutel

## Wat kun je doen?

### 1. Implementeer Multi-Factor Authentication (MFA)
MFA voorkomt dat aanvallers met gestolen wachtwoorden toegang krijgen.

### 2. Backup, Backup, Backup
Zorg voor offline backups die niet bereikbaar zijn vanaf het netwerk.

### 3. Train je medewerkers
80% van de cyberaanvallen begint met een medewerker die een verkeerde link klikt.

### 4. Update je systemen
Houd Windows, Office en alle andere software up-to-date.

## Workflo kan helpen

Met onze **Managed Security Services** ben je beschermd:

- 24/7 monitoring van je netwerk
- Automatische patch management
- Security awareness training
- Incident response team

**Vanaf €60/gebruiker/maand** krijg je volledige cybersecurity bescherming.

[Vraag een gratis security scan aan →](/contact)`,
        author_id: author.id,
        category_id: cybersecurityCategory.id,
        status: 'published',
        published_at: new Date().toISOString(),
        meta_title: 'Nieuwe Ransomware Golf - Bescherm je Bedrijf | Workflo',
        meta_description: 'Leer hoe je je bedrijf beschermt tegen de nieuwe ransomware aanvallen die Nederlandse bedrijven treffen.',
        tags: ['cybersecurity', 'ransomware', 'phishing', 'backup'],
        publish_to_linkedin: false,
        publish_to_email: false,
        featured_image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop',
      },
      {
        title: '5 Microsoft 365 Features Die Je Waarschijnlijk Niet Gebruikt',
        slug: '5-microsoft-365-features-die-je-waarschijnlijk-niet-gebruikt',
        excerpt: 'Microsoft 365 zit vol met handige features die de productiviteit verhogen. Ontdek welke je nu al kunt gebruiken!',
        content: `# Microsoft 365: Meer dan alleen Outlook en Word

De meeste bedrijven gebruiken Microsoft 365, maar wist je dat je waarschijnlijk maar 20% van de beschikbare functionaliteit gebruikt? Hier zijn 5 features die je direct kunt inzetten.

## 1. Microsoft Lists - Projectbeheer zonder extra tools

Vergeet Trello of Asana - Lists is al inbegrepen in je M365 licentie.

**Wat kun je ermee:**
- Taken bijhouden per team
- Custom workflows maken
- Integreren met Teams en SharePoint

## 2. Power Automate - Automatiseer repetitieve taken

**Voorbeelden:**
- Auto-archiveer emails ouder dan 6 maanden
- Verstuur automatisch facturen naar klanten
- Sync Outlook agenda met Excel rapport

**Cost savings:** 5-10 uur per week per medewerker!

## 3. OneDrive Offline Folders

Perfect voor remote werk. Sync specifieke folders voor offline toegang.

## 4. Microsoft Bookings

Klanten kunnen zelf afspraken inplannen zonder email heen-en-weer.

**Ideaal voor:**
- Consultancy bedrijven
- Support afspraken
- Sales meetings

## 5. SharePoint Hubs

Centraliseer al je bedrijfsinformatie op één plek.

## Wil je meer uit Microsoft 365 halen?

Workflo helpt bedrijven het maximale uit hun M365 investering te halen.

**Onze Microsoft 365 Optimization Service:**
- Analyse van huidige gebruik
- Implementatie van best practices
- Training voor medewerkers
- Ongoing support

[Boek een gratis M365 audit →](/contact)`,
        author_id: author.id,
        category_id: itTipsCategory.id,
        status: 'published',
        published_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        meta_title: '5 Microsoft 365 Features die je Productiviteit Verhogen',
        meta_description: 'Ontdek 5 hidden features in Microsoft 365 die je bedrijf productiever maken.',
        tags: ['microsoft-365', 'productivity', 'tips', 'automation'],
        featured_image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop',
      },
      {
        title: 'Waarom Fixed-Fee MSP Beter Is Dan Pay-Per-Hour Support',
        slug: 'waarom-fixed-fee-msp-beter-is-dan-pay-per-hour-support',
        excerpt: 'De meeste bedrijven betalen nog steeds per uur voor IT support. Ontdek waarom fixed-fee MSP services veel voordeliger zijn.',
        content: `# De Echte Kosten van Pay-Per-Hour IT Support

Als je nog steeds €110/uur betaalt voor ad-hoc IT support, ben je waarschijnlijk te veel geld kwijt. Hier is waarom.

## Het Probleem met Uurtarief

**Scenario:** Bedrijf met 10 medewerkers

### Ad-hoc Support Kosten:
- Gemiddeld 1 uur IT support per medewerker per maand
- 10 medewerkers × 1 uur × €110 = **€1.100/maand**
- Jaarlijks: **€13.200**

**Maar dat is niet alles:**
- Geen proactieve monitoring → meer problemen
- Geen preventief onderhoud → langere downtime
- Emergency support (150% tarief) → €165/uur
- **Werkelijke kosten: €18.000-€25.000/jaar**

## Fixed-Fee MSP Alternative

**Workflo MSP Remote:** €60/gebruiker/maand
- 10 medewerkers × €60 = **€600/maand**
- Jaarlijks: **€7.200**

### Wat krijg je?

**Inbegrepen:**
✅ Unlimited support tickets
✅ 24/7 proactieve monitoring
✅ Patch management
✅ Backup monitoring
✅ Email security
✅ Endpoint protection
✅ Strategic IT planning

## De Besparing

| Item | Ad-hoc | MSP | Verschil |
|------|--------|-----|----------|
| Support kosten | €25.000 | €7.200 | **€17.800** |
| Downtime (uren) | 40h | 10h | 30h × €200 = **€6.000** |
| Security breach risico | Hoog | Laag | **Onbetaalbaar** |

**Totale besparing: €23.800/jaar**

## Waarom Wachten?

Switch nu naar Workflo MSP en:
- Bespaar direct 60%+
- Geen verrassingen meer
- Focus op je core business

[Bereken je MSP pakket →](/prijzen)`,
        author_id: author.id,
        category_id: categories!.find(c => c.slug === 'msp-insights')!.id,
        status: 'draft',
        meta_title: 'Fixed-Fee MSP vs Pay-Per-Hour IT Support - Kostenvergelijking',
        meta_description: 'Bespaar tot 60% op IT kosten door te switchen van pay-per-hour naar fixed-fee MSP services.',
        tags: ['msp', 'pricing', 'cost-savings', 'managed-it'],
        featured_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=630&fit=crop',
      },
    ]

    for (const post of samplePosts) {
      const { error } = await supabase
        .from('blog_posts')
        .upsert([post], { onConflict: 'slug' })

      if (error) {
        console.error(`   ❌ Error creating post: ${post.title}`)
        console.error(error)
      } else {
        console.log(`   ✅ Created: ${post.title}`)
      }
    }

    console.log('\n🎉 Blog data seeding complete!')
    console.log('\nNext steps:')
    console.log('1. Visit: http://localhost:3000/admin/blog')
    console.log('2. Visit: http://localhost:3000/blog')
    console.log('3. Start writing your first real article!\n')

  } catch (error) {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  }
}

seedBlogData()

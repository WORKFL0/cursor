import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/services/database-service'
import { testDatabaseConnection } from '@/src/lib/supabase-db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'stats':
        const stats = await databaseService.getStats()
        return NextResponse.json({
          success: true,
          data: stats
        })

      case 'test-connection':
        const connectionTest = await testDatabaseConnection()
        return NextResponse.json({
          success: connectionTest.success,
          data: connectionTest
        })

      case 'health':
        // Basic health check
        const healthCheck = {
          database: 'checking...',
          timestamp: new Date().toISOString(),
          services: {
            database: false,
            articles: false
          }
        }

        try {
          const connectionResult = await testDatabaseConnection()
          healthCheck.database = connectionResult.connected ? 'connected' : 'disconnected'
          healthCheck.services.database = connectionResult.connected || false

          // Test articles service
          const articlesTest = await databaseService.getArticles({ limit: 1 })
          healthCheck.services.articles = !articlesTest.error
        } catch {
          healthCheck.database = 'error'
        }

        return NextResponse.json({
          success: true,
          data: healthCheck
        })

      default:
        return NextResponse.json({
          success: true,
          message: 'CMS Management API',
          availableActions: [
            'stats - Get article statistics',
            'test-connection - Test database connection',
            'health - Check system health'
          ],
          endpoints: {
            stats: '/api/cms/manage?action=stats',
            testConnection: '/api/cms/manage?action=test-connection',
            health: '/api/cms/manage?action=health'
          }
        })
    }
  } catch (error: unknown) {
    console.error('CMS management error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'CMS management operation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'seed-articles':
        // Seed some initial articles for development
        const seedArticles = [
          {
            title: 'Workflo lanceert nieuwe cybersecurity diensten voor MKB',
            slug: 'workflo-lanceert-cybersecurity-diensten',
            excerpt: 'Workflo breidt haar dienstenpakket uit met geavanceerde cybersecurity oplossingen speciaal ontwikkeld voor het MKB.',
            content: `Workflo B.V. kondigt met trots de lancering aan van een uitgebreid cybersecurity pakket, speciaal ontwikkeld voor kleine en middelgrote bedrijven in de regio Amsterdam.

## Nieuwe Cybersecurity Services

Ons nieuwe dienstenpakket omvat:

- **24/7 Security Monitoring**: Continue bewaking van jouw IT-infrastructuur
- **Advanced Threat Protection**: Proactieve bescherming tegen de nieuwste cyberdreigingen  
- **Security Awareness Training**: Training voor jouw medewerkers over cybersecurity best practices
- **Incident Response**: Snelle reactie bij beveiligingsincidenten
- **Compliance Support**: Ondersteuning bij het naleven van regelgeving zoals AVG/GDPR

## Waarom Cybersecurity Essentieel Is

Met de toename van cyberaanvallen is het voor MKB-bedrijven cruciaal om hun digitale assets te beschermen. Onze expertise helpt je om:

- Downtime te minimaliseren
- Klantvertrouwen te behouden
- Compliance te waarborgen
- Financiële schade te voorkomen

## Contact

Voor meer informatie over onze cybersecurity diensten, neem contact op via info@workflo.nl of bel 020-30 80 465.`,
            author: 'Florian van Workflo',
            category: 'Nieuws',
            tags: ['cybersecurity', 'mkb', 'diensten', 'beveiliging'],
            published: true,
            featured: true,
            meta_title: 'Workflo lanceert cybersecurity diensten voor MKB - IT Beveiliging Amsterdam',
            meta_description: 'Workflo introduceert geavanceerde cybersecurity oplossingen voor kleine en middelgrote bedrijven. 24/7 monitoring, threat protection en meer.'
          },
          {
            title: 'Microsoft 365 Copilot: De toekomst van productiviteit',
            slug: 'microsoft-365-copilot-toekomst',
            excerpt: 'Ontdek hoe Microsoft 365 Copilot jouw bedrijfsprocessen kan transformeren met AI-gestuurde productiviteit.',
            content: `Microsoft 365 Copilot revolutioneert de manier waarop we werken. Deze AI-assistent integreert naadloos met jouw bestaande Microsoft 365 omgeving.

## Wat is Microsoft 365 Copilot?

Microsoft 365 Copilot is een AI-powered assistent die direct geïntegreerd is in de Microsoft 365-apps die je dagelijks gebruikt:

- **Word**: Automatisch documenten schrijven en bewerken
- **Excel**: Complexe data-analyse en visualisatie
- **PowerPoint**: Professionele presentaties binnen minuten
- **Outlook**: Intelligente e-mailbeheer en planning
- **Teams**: Verbeterde samenwerking en meeting summaries

## Voordelen voor jouw Bedrijf

### Tijdsbesparing
Copilot kan routine taken automatiseren, waardoor jouw team zich kan focussen op strategische activiteiten.

### Verbeterde Kwaliteit
AI-gestuurde suggesties helpen bij het creëren van professionelere documenten en presentaties.

### Betere Besluitvorming
Geavanceerde data-analyse mogelijkheden ondersteunen bij het maken van datagedreven beslissingen.

## Implementatie bij Workflo

Workflo helpt je bij de implementatie van Microsoft 365 Copilot:

1. **Assessment**: We analyseren jouw huidige IT-omgeving
2. **Planning**: Samen stellen we een implementatieplan op
3. **Training**: We trainen je medewerkers in het gebruik van Copilot
4. **Support**: Continue ondersteuning bij het optimaal benutten van AI-functionaliteiten

## Aan de Slag

Klaar om de voordelen van AI in je bedrijf te ervaren? Neem contact op voor een gratis consultatie.`,
            author: 'Tech Team Workflo',
            category: 'Blog',
            tags: ['microsoft', 'ai', 'productiviteit', 'copilot', '365'],
            published: true,
            featured: false,
            meta_title: 'Microsoft 365 Copilot Implementation - AI Productiviteit Workflo',
            meta_description: 'Transformeer je bedrijfsprocessen met Microsoft 365 Copilot. Workflo helpt bij implementatie en training. Ontdek de mogelijkheden van AI.'
          },
          {
            title: 'Cloud Migration: Complete gids voor kleine bedrijven',
            slug: 'cloud-migration-gids-kleine-bedrijven',
            excerpt: 'Een stap-voor-stap gids voor het succesvol migreren van je kleine bedrijf naar de cloud.',
            content: `Cloud migratie kan overweldigend lijken, maar met de juiste aanpak is het een krachtige stap naar meer flexibiliteit en efficiency.

## Waarom Cloud Migration?

### Kostenbesparingen
- Geen dure hardware-investeringen
- Predictable maandelijkse kosten
- Schaalbare resources

### Flexibiliteit
- Werken van overal
- Automatische updates
- Snelle schaling bij groei

## De Migratie Stappen

### 1. Assessment
We beginnen met een grondige analyse van jouw huidige IT-omgeving.

### 2. Planning
Samen stellen we een gedetailleerd migratieplan op met tijdlijn en budgettering.

### 3. Pilot
We starten met een kleine pilot om het proces te testen en verfijnen.

### 4. Migratie
Gefaseerde migratie van je systemen met minimale downtime.

### 5. Optimalisatie
Continue optimalisatie voor beste performance en kostenefficiëntie.

## Workflo's Cloud Expertise

Met jarenlange ervaring in cloud migraties helpen we je bij:

- **Azure Specialist**: Gecertificeerd in Microsoft Azure
- **Minimale Downtime**: Bewezen methodieken voor soepele overgangen  
- **Security First**: Beveiliging staat centraal in elke migratie
- **24/7 Support**: Continue ondersteuning tijdens en na de migratie

## Success Stories

Onze klanten ervaren gemiddeld:
- 30% kostenreductie op IT-infrastructure
- 50% minder downtime
- 80% snellere implementatie van nieuwe functionaliteiten

## Volgende Stappen

Klaar voor de cloud? Plan een gratis cloud readiness assessment in.`,
            author: 'Workflo Cloud Team',
            category: 'Gids',
            tags: ['cloud', 'migratie', 'azure', 'mkb', 'digital transformation'],
            published: false,
            featured: false,
            meta_title: 'Cloud Migration Gids - Stap-voor-stap naar de Cloud | Workflo',
            meta_description: 'Volledige gids voor cloud migratie voor kleine bedrijven. Van planning tot implementatie, ontdek hoe Workflo je helpt bij een soepele overgang.'
          }
        ]

        const results = []
        for (const article of seedArticles) {
          const result = await databaseService.createArticle(article)
          results.push(result)
        }

        const successful = results.filter(r => !r.error).length
        const failed = results.filter(r => r.error).length

        return NextResponse.json({
          success: true,
          message: `Seeded ${successful} articles successfully`,
          details: {
            successful,
            failed,
            results: results.filter(r => r.error).map(r => r.error) // Only show errors
          }
        })

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
            availableActions: ['seed-articles']
          },
          { status: 400 }
        )
    }
  } catch (error: unknown) {
    console.error('CMS management POST error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'CMS management operation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
import { Metadata } from 'next'
import Link from 'next/link'
import { Building2, TrendingUp, Heart, Megaphone, Film, ShoppingCart, Users, Briefcase, HandHelping } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Sectoren | Workflo - IT-oplossingen voor elke branche',
  description: 'Ontdek hoe Workflo IT-oplossingen biedt die perfect aansluiten bij de specifieke behoeften van jouw sector. Van architecten tot ZZP\'ers.',
}

const sectors = [
  {
    title: 'Architecten',
    slug: 'architecten',
    icon: Building2,
    description: 'IT-oplossingen voor architectenbureaus en bouwprojecten',
    features: ['CAD software', 'Projectmanagement', 'Cloud opslag', 'Samenwerking'],
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Financiële Sector',
    slug: 'financiele-sector',
    icon: TrendingUp,
    description: 'Veilige en compliant IT-systemen voor financiële dienstverleners',
    features: ['Beveiliging', 'Compliance', 'Data analyse', 'Backup'],
    color: 'from-green-500 to-green-600',
  },
  {
    title: 'Gezondheidszorg',
    slug: 'gezondheidszorg',
    icon: Heart,
    description: 'GDPR-conforme IT-oplossingen voor zorgverleners',
    features: ['Privacy', 'EPD integratie', 'Communicatie', 'Planning'],
    color: 'from-red-500 to-red-600',
  },
  {
    title: 'Marketing & Reclame',
    slug: 'marketing-reclame',
    icon: Megaphone,
    description: 'Creatieve IT-tools voor marketing en reclame bureaus',
    features: ['Creative software', 'Samenwerking', 'Asset management', 'Analytics'],
    color: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Media',
    slug: 'media',
    icon: Film,
    description: 'High-performance IT voor media productie en distributie',
    features: ['Media storage', 'Streaming', 'Bewerking', 'Archivering'],
    color: 'from-pink-500 to-pink-600',
  },
  {
    title: 'Retail',
    slug: 'retail',
    icon: ShoppingCart,
    description: 'Betrouwbare IT-systemen voor retail en e-commerce',
    features: ['POS systemen', 'Voorraad', 'E-commerce', 'Klantenservice'],
    color: 'from-orange-500 to-orange-600',
  },
  {
    title: 'ZZP & Freelancers',
    slug: 'zzp',
    icon: Briefcase,
    description: 'Betaalbare IT-oplossingen speciaal voor ZZP\'ers',
    features: ['Facturatie', 'Boekhouding', 'Website', 'Cloud tools'],
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    title: 'Non-Profit',
    slug: 'non-profit',
    icon: HandHelping,
    description: 'Kostenefficiënte IT voor non-profit organisaties',
    features: ['Donatie systemen', 'CRM', 'Vrijwilligers', 'Communicatie'],
    color: 'from-teal-500 to-teal-600',
  },
  {
    title: 'Overig',
    slug: 'divers',
    icon: Users,
    description: 'Maatwerk IT-oplossingen voor diverse sectoren',
    features: ['Op maat', 'Flexibel', 'Schaalbaar', 'Support'],
    color: 'from-indigo-500 to-indigo-600',
  },
]

export default function SectorenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />

        <div className="container mx-auto max-w-7xl relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              IT-oplossingen voor elke sector
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Bij Workflo begrijpen we dat elke branche unieke IT-behoeften heeft.
              Ontdek hoe wij jouw sector kunnen ondersteunen met op maat gemaakte oplossingen.
            </p>
          </div>

          {/* Sectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((sector) => {
              const Icon = sector.icon
              return (
                <Link key={sector.slug} href={`/sectoren/${sector.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${sector.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {sector.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {sector.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-4">
                        {sector.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant="ghost"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        Meer info →
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            Jouw sector staat er niet bij?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Geen probleem! Workflo levert maatwerk IT-oplossingen voor vrijwel elke branche.
            Neem contact met ons op om te bespreken hoe wij jouw bedrijf kunnen helpen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">
                Neem contact op
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/tevredenheidscheck">
                Gratis IT-check
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

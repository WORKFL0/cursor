'use client'

import { motion } from '@/lib/framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Clock, 
  Users, 
  Server,
  Package,
  Zap,
  Shield,
  Euro,
  AlertCircle,
  Phone,
  Calendar,
  ArrowRight,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/contexts/language-context'

export default function TarievenPage() {
  const { language } = useLanguage()

  const pricingOptions = [
    {
      id: 'ad-hoc',
      name: 'Ad-hoc Support',
      tagline: 'You break, we fix',
      price: '€110',
      unit: 'per uur',
      icon: <Zap className="w-8 h-8" />,
      color: 'border-gray-500',
      features: [
        'Betaal alleen wat je gebruikt',
        'Achteraf gefactureerd',
        'Geen vaste kosten',
        'Flexibel inzetbaar'
      ],
      drawbacks: [
        '150% tarief na 19:00 en weekenden',
        'Lagere prioriteit bij drukte',
        'Geen gegarandeerde responstijd'
      ],
      bestFor: 'Kleine bedrijven met weinig IT-problemen'
    },
    {
      id: 'prepaid',
      name: 'Pre-Paid Bundels',
      tagline: 'Beste prijs-kwaliteit',
      packages: [
        { hours: 10, price: '€1.000', perHour: '€100' },
        { hours: 20, price: '€1.800', perHour: '€90' }
      ],
      icon: <Package className="w-8 h-8" />,
      color: 'border-workflo-yellow',
      badge: 'Meest Gekozen',
      features: [
        'Hoge prioriteit respons',
        '4 uur gegarandeerde responstijd',
        'Uren verlopen nooit',
        'Maandelijkse saldo updates',
        'Beste uurtarief (vanaf €90/uur)'
      ],
      bestFor: 'Bedrijven die kosten willen beheersen'
    },
    {
      id: 'fixed-fee',
      name: 'Fixed-Fee All You Can Eat',
      tagline: 'Geen verrassingen, ever',
      options: [
        {
          type: 'Remote Support',
          price: '€60',
          unit: 'per gebruiker/maand',
          description: 'Support via tickets, email, Teams, WhatsApp, telefoon'
        },
        {
          type: 'Onsite Support',
          price: '€90',
          unit: 'per gebruiker/maand',
          description: 'Ook ter plaatse + hardware vervanging'
        }
      ],
      icon: <Shield className="w-8 h-8" />,
      color: 'border-primary',
      badge: 'Beste Waarde',
      features: [
        'Onbeperkte support',
        'Alle beveiligingslicenties inbegrepen',
        'Proactieve monitoring',
        'Regelmatig onderhoud',
        'Complete digitale welzijn garantie',
        'Server support zelfde prijs als gebruiker'
      ],
      note: 'Office 365 licenties apart verkrijgbaar',
      bestFor: 'Bedrijven die zekerheid willen'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Transparante Tarieven
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Kies het support model dat bij je past. Geen verborgen kosten, altijd duidelijk.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                Geen opstartkosten
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                Maandelijks opzegbaar
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Alles inclusief
              </Badge>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Pricing Options */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full border-2 ${option.color} hover:shadow-2xl transition-shadow relative`}>
                  {option.badge && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-workflo-yellow text-black">
                      {option.badge}
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 text-primary">
                      {option.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold">
                      {option.name}
                    </CardTitle>
                    <CardDescription className="text-lg font-medium">
                      {option.tagline}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Pricing Display */}
                    <div className="text-center py-4 bg-muted/50 rounded-lg">
                      {option.price && (
                        <div>
                          <span className="text-3xl font-bold">{option.price}</span>
                          {option.unit && (
                            <span className="text-muted-foreground ml-2">{option.unit}</span>
                          )}
                        </div>
                      )}
                      
                      {option.packages && (
                        <div className="space-y-2">
                          {option.packages.map(pkg => (
                            <div key={pkg.hours} className="flex justify-between items-center px-4">
                              <span className="font-medium">{pkg.hours} uur</span>
                              <span className="font-bold">{pkg.price}</span>
                              <Badge variant="secondary">{pkg.perHour}/uur</Badge>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {option.options && (
                        <div className="space-y-3">
                          {option.options.map(opt => (
                            <div key={opt.type} className="text-left px-4">
                              <div className="font-semibold">{opt.type}</div>
                              <div className="text-2xl font-bold">{opt.price}</div>
                              <div className="text-sm text-muted-foreground">{opt.unit}</div>
                              <div className="text-xs mt-1">{opt.description}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      {option.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Drawbacks */}
                    {option.drawbacks && (
                      <div className="space-y-2 pt-4 border-t">
                        {option.drawbacks.map((drawback, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{drawback}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Note */}
                    {option.note && (
                      <div className="text-sm text-muted-foreground italic pt-4 border-t">
                        * {option.note}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex flex-col gap-3">
                    <div className="text-sm text-center text-muted-foreground">
                      <strong>Beste voor:</strong> {option.bestFor}
                    </div>
                    <Button asChild className="w-full" variant={option.badge ? 'default' : 'outline'}>
                      <Link href="/afspraak">
                        Bespreek deze optie
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Goed om te weten</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Server className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Server Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Een server kost hetzelfde als een gebruiker, afhankelijk van je support keuze (remote of onsite).
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">All-inclusive Beveiliging</h4>
                    <p className="text-sm text-muted-foreground">
                      Bij Fixed-Fee zitten alle benodigde beveiligingslicenties inbegrepen. Van antivirus tot backup software - alles geregeld.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Office 365 Licenties</h4>
                    <p className="text-sm text-muted-foreground">
                      Office 365 licenties zijn apart verkrijgbaar gezien de verschillende varianten. We adviseren graag de beste optie voor je situatie.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Onze Belofte</h4>
                    <p className="text-sm text-muted-foreground">
                      De volledige verantwoordelijkheid voor je digitale welzijn - dat is onze belofte. Geen verrassingen, geen kleine lettertjes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6">
              Niet zeker welke optie het beste past?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Geen probleem! We bespreken graag je situatie en adviseren de beste oplossing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/afspraak">
                  <Calendar className="w-5 h-5 mr-2" />
                  Plan gratis adviesgesprek
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="tel:+31203080465">
                  <Phone className="w-5 h-5 mr-2" />
                  Bel direct: 020-30 80 465
                </Link>
              </Button>
            </div>
            
            <div className="mt-12 pt-12 border-t">
              <p className="text-sm text-muted-foreground">
                Actuele tarieven per {new Date().toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}. 
                Prijzen zijn exclusief BTW. Maandelijks opzegbaar met 30 dagen opzegtermijn.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
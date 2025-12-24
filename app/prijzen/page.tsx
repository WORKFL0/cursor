'use client'

import { motion } from '@/lib/framer-motion'
import { Badge } from '@/components/ui/badge'
import { Calculator, CheckCircle, TrendingDown, Shield, Target, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import WorkfloPricingCalculator from '@/components/calculator/WorkfloPricingCalculator'

export default function PrijzenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-workflo-yellow/10 to-workflo-yellow/5" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-workflo-navy text-workflo-yellow border border-workflo-yellow">
              Transparante Prijzen - Geen Verrassingen
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Eenvoudige, Eerlijke IT Prijzen
            </h1>
            <p className="text-xl text-muted-foreground">
              Vergelijk onze drie support modellen en ontdek binnen 30 seconden hoeveel je kunt besparen.
              <span className="block mt-2 text-workflo-yellow font-semibold">
                Geen verborgen kosten. Geen verplichtingen. 100% transparant.
              </span>
            </p>
          </div>
        </motion.div>
      </section>

      {/* Interactive Calculator */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                <Calculator className="w-10 h-10 text-workflo-yellow" />
                Bereken Je Maandelijkse IT Kosten
              </h2>
              <p className="text-lg text-muted-foreground">
                Ontdek direct wat IT support echt kost - met volledige transparantie over alle drie onze modellen
              </p>
            </div>

            <WorkfloPricingCalculator defaultUsers={10} />
          </motion.div>
        </div>
      </section>

      {/* Why MSP Section */}
      <section className="py-20 bg-workflo-navy text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Waarom Fixed-Fee MSP de slimste keuze is
              </h2>
              <p className="text-xl text-gray-300">
                Meer dan alleen IT support - een strategisch partnerschap
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/10 border-workflo-yellow/30">
                  <CardHeader>
                    <TrendingDown className="w-12 h-12 text-workflo-yellow mb-4" />
                    <CardTitle className="text-white text-xl">
                      Tot 35% Kostenbesparing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-300">
                    <p className="mb-4">
                      Voorspelbare maandelijkse kosten in plaats van dure ad-hoc facturen.
                      Geen noodgevallen meer met 150% toeslag na kantoortijd.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-workflo-yellow mt-1 flex-shrink-0" />
                        <span className="text-sm">Geen verrassingen op de factuur</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-workflo-yellow mt-1 flex-shrink-0" />
                        <span className="text-sm">Budget-vriendelijk en voorspelbaar</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-workflo-yellow mt-1 flex-shrink-0" />
                        <span className="text-sm">Volume kortingen vanaf 10 gebruikers</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/10 border-workflo-yellow/30">
                  <CardHeader>
                    <Shield className="w-12 h-12 text-workflo-yellow mb-4" />
                    <CardTitle className="text-white text-xl">
                      Proactieve Preventie
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-300">
                    <p className="mb-4">
                      24/7 monitoring voorkomt problemen voordat ze ontstaan.
                      Minder downtime betekent meer productiviteit en omzet.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-workflo-yellow mt-1 flex-shrink-0" />
                        <span className="text-sm">Automatische patches en updates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-workflo-yellow mt-1 flex-shrink-0" />
                        <span className="text-sm">Security monitoring en threat detection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-workflo-yellow mt-1 flex-shrink-0" />
                        <span className="text-sm">Backup verificatie en disaster recovery</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ x: 30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/10 border-workflo-yellow/30">
                  <CardHeader>
                    <Target className="w-12 h-12 text-workflo-yellow mb-4" />
                    <CardTitle className="text-white text-xl">
                      Strategisch Partnership
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-300">
                    <p className="mb-4">
                      Een dedicated IT partner die je bedrijfsdoelen begrijpt en
                      je helpt groeien met de juiste technologie.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-workflo-yellow mt-1 flex-shrink-0" />
                        <span className="text-sm">vCIO strategisch IT advies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-workflo-yellow mt-1 flex-shrink-0" />
                        <span className="text-sm">Technology roadmap planning</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-workflo-yellow mt-1 flex-shrink-0" />
                        <span className="text-sm">Onbeperkte gebruikersondersteuning</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Kant-en-klare Vergelijking</h2>
              <p className="text-muted-foreground">
                Zie in één oogopslag de verschillen tussen de support modellen
              </p>
            </motion.div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-card rounded-lg overflow-hidden">
                <thead>
                  <tr className="border-b-2 border-workflo-yellow bg-workflo-navy text-white">
                    <th className="text-left p-4 font-semibold">Functie</th>
                    <th className="text-center p-4 font-semibold">Ad-Hoc</th>
                    <th className="text-center p-4 font-semibold">Pre-Paid</th>
                    <th className="text-center p-4 font-semibold bg-workflo-yellow text-workflo-navy">
                      <Badge className="mb-2 bg-workflo-navy text-workflo-yellow">Aanbevolen</Badge>
                      <div>Fixed-Fee MSP</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Voorspelbare kosten</td>
                    <td className="text-center p-4">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">✗</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600">~</div>
                    </td>
                    <td className="text-center p-4 bg-green-50 dark:bg-green-950">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">✓</div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">24/7 Proactieve monitoring</td>
                    <td className="text-center p-4">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">✗</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">✗</div>
                    </td>
                    <td className="text-center p-4 bg-green-50 dark:bg-green-950">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">✓</div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Onbeperkte support tickets</td>
                    <td className="text-center p-4">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">✗</div>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-sm text-muted-foreground">Beperkt tot uren</span>
                    </td>
                    <td className="text-center p-4 bg-green-50 dark:bg-green-950">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">✓</div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">SLA garantie</td>
                    <td className="text-center p-4">
                      <span className="text-sm text-muted-foreground">Nee</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-sm text-muted-foreground">Nee</span>
                    </td>
                    <td className="text-center p-4 bg-green-50 dark:bg-green-950">
                      <span className="font-semibold text-green-600">4h/2h/1h</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Strategisch IT advies</td>
                    <td className="text-center p-4">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">✗</div>
                    </td>
                    <td className="text-center p-4">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">✗</div>
                    </td>
                    <td className="text-center p-4 bg-green-50 dark:bg-green-950">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">✓</div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Email & endpoint security</td>
                    <td className="text-center p-4">
                      <span className="text-sm text-muted-foreground">Extra kosten</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-sm text-muted-foreground">Extra kosten</span>
                    </td>
                    <td className="text-center p-4 bg-green-50 dark:bg-green-950">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">✓</div>
                    </td>
                  </tr>
                  <tr className="border-b bg-workflo-yellow/10">
                    <td className="p-4 font-bold">Beste voor</td>
                    <td className="text-center p-4 text-sm">Incidenteel gebruik</td>
                    <td className="text-center p-4 text-sm">Regelmatig gebruik</td>
                    <td className="text-center p-4 font-semibold text-workflo-navy bg-workflo-yellow/30">
                      Dagelijkse bedrijfsvoering
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Bij Alle Pakketten Inbegrepen</h2>
              <p className="text-muted-foreground">
                Deze garanties krijg je altijd, ongeacht welk model je kiest
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Nederlandse Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-sm">24/7 bereikbaarheid via telefoon en email</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-sm">Nederlandse helpdesk zonder taalbarrière</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-sm">Persoonlijke service - geen wachtrijen</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-sm">Direct contact met engineers</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ x: 30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-workflo-yellow" />
                      Workflo Garanties
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-sm">99.9% uptime garantie op beheerde systemen</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-sm">Transparante prijzen - geen verborgen kosten</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-sm">Maandelijks opzegbaar - geen lange contracten</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-sm">Compliance met GDPR en ISO normen</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-workflo-navy to-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-workflo-yellow text-workflo-navy px-6 py-3 rounded-full font-bold mb-6 shadow-lg">
            <TrendingDown className="w-5 h-5" />
            <span>Bespaar tot 35% op je IT-kosten</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Stop met teveel betalen voor IT
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Ontdek binnen 30 seconden hoeveel je kunt besparen met Fixed-Fee MSP. <br />
            <span className="text-workflo-yellow font-semibold">
              Directe prijsindicatie • Geen verplichtingen • 100% transparant
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-workflo-yellow hover:bg-workflo-yellow/90 text-workflo-navy font-bold text-lg shadow-lg px-8"
              asChild
            >
              <Link href="/contact">
                Vraag Gratis Advies Aan →
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg bg-white/10 text-white border-white/30 hover:bg-white/20 px-8"
            >
              <Link href="/tevredenheidscheck">
                Doe de IT-Check (2 min)
              </Link>
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-6">
            ✓ Vandaag nog reactie • ✓ Geen lange contracten • ✓ Maandelijks opzegbaar
          </p>
        </motion.div>
      </section>
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Calculator, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import PricingCalculatorNew from '@/components/pricing/pricing-calculator-new'
import QuoteForm from '@/components/forms/quote-form'
import { useState } from 'react'
import { servicesData } from '@/lib/data/services-data'

export default function PrijzenPage() {
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [calculatedUsers, setCalculatedUsers] = useState(10)
  const [calculatedSupportType, setCalculatedSupportType] = useState<'remote' | 'onsite'>('remote')

  const handleQuoteRequest = (serviceId: string, users: number, supportType: 'remote' | 'onsite') => {
    setSelectedServiceId(serviceId)
    setCalculatedUsers(users)
    setCalculatedSupportType(supportType)
    setShowQuoteForm(true)
  }

  if (showQuoteForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4">Offerte Aanvragen</h1>
                <p className="text-muted-foreground">
                  Vul onderstaande gegevens in voor een persoonlijke offerte
                </p>
              </div>
              
              <QuoteForm 
                initialService={selectedServiceId}
                initialUsers={calculatedUsers}
                initialSupportType={calculatedSupportType}
              />
              
              <div className="text-center mt-6">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowQuoteForm(false)}
                >
                  ← Terug naar Calculator
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    )
  }

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
            <Badge className="mb-4 bg-gray-900 text-primary border border-primary">
              Transparante Prijzen
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Eenvoudige, Eerlijke Prijzen
            </h1>
            <p className="text-xl text-muted-foreground">
              Geen verborgen kosten. Geen verrassingen. Gewoon duidelijke prijzen voor professionele IT-services.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Services Calculator */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                <Calculator className="w-10 h-10 text-primary" />
                Bereken Je Investering
              </h2>
              <p className="text-lg text-muted-foreground">
                Kies een service en krijg direct een transparante prijsindicatie
              </p>
            </div>

            <PricingCalculatorNew />
          </motion.div>
        </div>
      </section>


      {/* What's Always Included */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Bij Alle Services Inbegrepen</h2>
              <p className="text-muted-foreground">
                Deze voordelen krijg je altijd, ongeacht welke service je kiest
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 w-5 text-green-600" />
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
                        <span className="text-sm">Geen wachtrijen - directe persoonlijke hulp</span>
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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 w-5 text-green-600" />
                      Transparante Prijzen
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-sm">Geen verborgen kosten of onverwachte bijkomende kosten</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-sm">Maandelijks opzegbaar - geen lange contracten</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-sm">Volume kortingen vanaf 5 gebruikers</span>
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
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full font-semibold mb-6">
            <span className="animate-pulse">🔥</span>
            <span>Bespaar tot 35% op je IT-kosten</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Stop met teveel betalen voor IT
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Ontdek binnen 30 seconden hoeveel je kunt besparen. <br />
            <span className="text-primary font-semibold">Directe prijsindicatie • Geen verplichtingen • 100% transparant</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-black font-bold text-lg shadow-lg"
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
              className="text-lg bg-white/10 text-white border-white/30 hover:bg-white/20"
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
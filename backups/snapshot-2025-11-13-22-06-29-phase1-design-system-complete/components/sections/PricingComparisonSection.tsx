'use client'

import { motion } from '@/lib/framer-motion'
import { Check, X, Clock, CreditCard, Shield, TrendingUp, AlertCircle, Users, Zap, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useLanguage } from '@/lib/contexts/language-context'

export default function PricingComparisonSection() {
  const { language } = useLanguage()

  const pricingOptions = [
    {
      title: language === 'nl' ? 'Ad-hoc "You Break, We Fix"' : 'Ad-hoc "You Break, We Fix"',
      price: '€110',
      perUnit: language === 'nl' ? 'per uur' : 'per hour',
      icon: AlertCircle,
      type: 'adhoc',
      color: 'border-workflo-yellow/20 bg-workflo-yellow/10 dark:bg-workflo-yellow/10',
      description: language === 'nl' 
        ? 'Voor incidentele problemen en noodgevallen'
        : 'For occasional problems and emergencies',
      features: [
        { text: language === 'nl' ? 'Geen commitment' : 'No commitment', included: true },
        { text: language === 'nl' ? 'Direct hulp bij problemen' : 'Immediate problem solving', included: true },
        { text: language === 'nl' ? 'Betaal per incident' : 'Pay per incident', included: true },
        { text: language === 'nl' ? 'Voorspelbare kosten' : 'Predictable costs', included: false },
        { text: language === 'nl' ? 'Proactief onderhoud' : 'Proactive maintenance', included: false },
        { text: language === 'nl' ? 'Prioriteit support' : 'Priority support', included: false },
      ],
      cons: [
        language === 'nl' ? 'Duurste optie per uur' : 'Most expensive per hour',
        language === 'nl' ? 'Alleen reactief, niet preventief' : 'Only reactive, not preventive',
        language === 'nl' ? 'Onvoorspelbare maandkosten' : 'Unpredictable monthly costs',
      ]
    },
    {
      title: language === 'nl' ? 'Strippenkaart 10 uur' : 'Prepaid Card 10 hours',
      price: '€95',
      perUnit: language === 'nl' ? 'per uur' : 'per hour',
      totalPrice: '€950',
      icon: CreditCard,
      type: 'prepaid10',
      color: 'border-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10',
      description: language === 'nl'
        ? 'Vooraf betaalde uren met korting'
        : 'Prepaid hours with discount',
      features: [
        { text: language === 'nl' ? '€15/uur korting' : '€15/hour discount', included: true },
        { text: language === 'nl' ? 'Flexibel in te zetten' : 'Flexible usage', included: true },
        { text: language === 'nl' ? '12 maanden geldig' : '12 months validity', included: true },
        { text: language === 'nl' ? 'Voorspelbare kosten' : 'Predictable costs', included: false },
        { text: language === 'nl' ? 'Proactief onderhoud' : 'Proactive maintenance', included: false },
        { text: language === 'nl' ? 'Prioriteit support' : 'Priority support', included: true },
      ],
      cons: [
        language === 'nl' ? 'Vooraf investering vereist' : 'Upfront investment required',
        language === 'nl' ? 'Uren kunnen opraken' : 'Hours can run out',
        language === 'nl' ? 'Geen proactieve monitoring' : 'No proactive monitoring',
      ]
    },
    {
      title: language === 'nl' ? 'Strippenkaart 20 uur' : 'Prepaid Card 20 hours',
      price: '€90',
      perUnit: language === 'nl' ? 'per uur' : 'per hour',
      totalPrice: '€1800',
      icon: CreditCard,
      type: 'prepaid20',
      color: 'border-purple-500/20 bg-purple-50/50 dark:bg-purple-900/10',
      description: language === 'nl'
        ? 'Meer uren, meer korting'
        : 'More hours, more discount',
      features: [
        { text: language === 'nl' ? '€20/uur korting' : '€20/hour discount', included: true },
        { text: language === 'nl' ? 'Beste prijs per uur' : 'Best price per hour', included: true },
        { text: language === 'nl' ? '12 maanden geldig' : '12 months validity', included: true },
        { text: language === 'nl' ? 'Maandelijks urenrapport' : 'Monthly hour report', included: true },
        { text: language === 'nl' ? 'Proactief onderhoud' : 'Proactive maintenance', included: false },
        { text: language === 'nl' ? 'Prioriteit support' : 'Priority support', included: true },
      ],
      cons: [
        language === 'nl' ? 'Grotere vooraf investering' : 'Larger upfront investment',
        language === 'nl' ? 'Uren kunnen opraken' : 'Hours can run out',
        language === 'nl' ? 'Geen 24/7 monitoring' : 'No 24/7 monitoring',
      ]
    },
    {
      title: language === 'nl' ? 'Fixed-Fee Maandcontract' : 'Fixed-Fee Monthly Contract',
      price: language === 'nl' ? 'Vanaf €750' : 'From €750',
      perUnit: language === 'nl' ? 'per maand' : 'per month',
      icon: Shield,
      type: 'fixed',
      recommended: true,
      color: 'border-workflo-yellow/30 bg-workflo-yellow/10 ring-2 ring-workflo-yellow/20',
      description: language === 'nl'
        ? 'Complete IT-dienstverlening zonder zorgen'
        : 'Complete IT services without worries',
      features: [
        { text: language === 'nl' ? 'Voorspelbare vaste kosten' : 'Predictable fixed costs', included: true },
        { text: language === 'nl' ? 'Onbeperkte support' : 'Unlimited support', included: true },
        { text: language === 'nl' ? '24/7 monitoring' : '24/7 monitoring', included: true },
        { text: language === 'nl' ? 'Proactief onderhoud' : 'Proactive maintenance', included: true },
        { text: language === 'nl' ? 'Prioriteit bij storingen' : 'Priority during outages', included: true },
        { text: language === 'nl' ? 'Maandelijkse rapportages' : 'Monthly reports', included: true },
      ],
      benefits: [
        language === 'nl' ? 'Geen verrassingen in je budget' : 'No budget surprises',
        language === 'nl' ? 'We voorkomen problemen voordat ze ontstaan' : 'We prevent problems before they occur',
        language === 'nl' ? 'Altijd bereikbaar, ook buiten kantooruren' : 'Always available, even after hours',
        language === 'nl' ? 'Je IT groeit mee met je bedrijf' : 'Your IT grows with your business',
      ]
    }
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-4 bg-workflo-yellow/10 text-workflo-yellow-dark border-workflo-yellow/30">
            <Calculator className="w-3 h-3 mr-1" />
            {language === 'nl' ? 'Transparante Prijzen' : 'Transparent Pricing'}
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {language === 'nl' ? 'Kies de Beste Optie voor Jouw Bedrijf' : 'Choose the Best Option for Your Business'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {language === 'nl' 
              ? 'Van ad-hoc hulp tot complete IT-ondersteuning. Ontdek waarom 87% van onze klanten kiest voor een fixed-fee contract.'
              : 'From ad-hoc help to complete IT support. Discover why 87% of our clients choose a fixed-fee contract.'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6 mb-12">
          {pricingOptions.map((option, index) => (
            <motion.div
              key={option.type}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className={`relative h-full ${option.color} ${option.recommended ? 'scale-105 shadow-xl' : ''}`}>
                {option.recommended && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-workflo-yellow text-foreground">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {language === 'nl' ? 'Meest Gekozen' : 'Most Popular'}
                  </Badge>
                )}
                
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <option.icon className={`w-8 h-8 ${option.recommended ? 'text-workflo-yellow' : 'text-muted-foreground'}`} />
                    {option.totalPrice && (
                      <Badge variant="secondary" className="text-xs">
                        {language === 'nl' ? 'Totaal' : 'Total'}: {option.totalPrice}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{option.price}</span>
                    <span className="text-muted-foreground ml-1">/{option.perUnit}</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {option.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${feature.included ? '' : 'text-muted-foreground/70'}`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  {option.cons && (
                    <div className="pt-4 border-t border-border/50">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        {language === 'nl' ? 'Nadelen' : 'Drawbacks'}:
                      </p>
                      <ul className="space-y-1">
                        {option.cons.map((con, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                            <span className="text-workflo-yellow dark:text-workflo-yellow">•</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {option.benefits && (
                    <div className="pt-4 border-t border-workflo-yellow/30">
                      <p className="text-xs font-medium text-workflo-yellow-dark dark:text-workflo-yellow mb-2">
                        {language === 'nl' ? 'Voordelen' : 'Benefits'}:
                      </p>
                      <ul className="space-y-1">
                        {option.benefits.map((benefit, i) => (
                          <li key={i} className="text-xs text-foreground flex items-start gap-1">
                            <span className="text-workflo-yellow">✓</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Why Fixed-Fee is Better */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-workflo-yellow/10 via-workflo-yellow/5 to-workflo-yellow/10 rounded-3xl p-8 lg:p-12 border border-workflo-yellow/20"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4 bg-workflo-yellow/20 text-workflo-yellow-dark border-workflo-yellow/30">
                <Zap className="w-3 h-3 mr-1" />
                {language === 'nl' ? 'Waarom Fixed-Fee?' : 'Why Fixed-Fee?'}
              </Badge>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                {language === 'nl' 
                  ? 'De Slimme Keuze voor Groeiende Bedrijven'
                  : 'The Smart Choice for Growing Businesses'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {language === 'nl'
                  ? 'Met een fixed-fee contract ben je niet alleen goedkoper uit, maar krijg je ook betere service. We worden je IT-partner, niet alleen je probleemoplosser.'
                  : 'With a fixed-fee contract, you\'re not only saving money, but you also get better service. We become your IT partner, not just your problem solver.'}
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-workflo-yellow mt-1" />
                  <div>
                    <p className="font-semibold text-sm">{language === 'nl' ? 'Bespaar 40% op kosten' : 'Save 40% on costs'}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'nl' 
                        ? 'Gemiddeld t.o.v. ad-hoc support'
                        : 'On average vs. ad-hoc support'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-workflo-yellow mt-1" />
                  <div>
                    <p className="font-semibold text-sm">{language === 'nl' ? '70% minder downtime' : '70% less downtime'}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'nl'
                        ? 'Door proactief onderhoud'
                        : 'Through proactive maintenance'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-workflo-yellow mt-1" />
                  <div>
                    <p className="font-semibold text-sm">{language === 'nl' ? 'Dedicated team' : 'Dedicated team'}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'nl'
                        ? 'Kent jouw systemen door en door'
                        : 'Knows your systems inside out'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-workflo-yellow mt-1" />
                  <div>
                    <p className="font-semibold text-sm">{language === 'nl' ? 'Schaalbaar' : 'Scalable'}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'nl'
                        ? 'Groeit mee met je bedrijf'
                        : 'Grows with your business'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-6 border border-workflo-yellow/20">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-workflo-yellow" />
                {language === 'nl' ? 'Rekenvoorbeeld' : 'Cost Example'}
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <span className="text-muted-foreground">{language === 'nl' ? 'Ad-hoc (8 uur/maand)' : 'Ad-hoc (8 hours/month)'}</span>
                  <span className="font-mono">€880/maand</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <span className="text-muted-foreground">{language === 'nl' ? 'Strippenkaart' : 'Prepaid card'}</span>
                  <span className="font-mono">€720-760/maand</span>
                </div>
                <div className="flex justify-between items-center text-workflo-yellow-dark dark:text-workflo-yellow font-semibold">
                  <span>{language === 'nl' ? 'Fixed-fee contract' : 'Fixed-fee contract'}</span>
                  <span className="font-mono">€750/maand</span>
                </div>
                <div className="pt-3 border-t border-workflo-yellow/30">
                  <p className="text-xs text-muted-foreground">
                    {language === 'nl'
                      ? '+ Onbeperkte support, 24/7 monitoring, proactief onderhoud'
                      : '+ Unlimited support, 24/7 monitoring, proactive maintenance'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button size="lg" className="bg-workflo-yellow hover:bg-workflo-yellow-dark text-foreground" asChild>
              <Link href="/contact">
                {language === 'nl' ? 'Vraag Gratis Advies Aan' : 'Request Free Consultation'}
                <Zap className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/diensten">
                {language === 'nl' ? 'Bekijk Alle Diensten' : 'View All Services'}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
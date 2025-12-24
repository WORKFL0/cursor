'use client'


import { motion } from '@/lib/framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Shield, AlertTriangle, ArrowRight, CheckCircle, Phone, Mail, Star, Euro, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { getServiceBySlug, calculateServicePrice } from '@/lib/data/services-data'

export default function CybersecurityPage() {
  const service = getServiceBySlug('cybersecurity')!

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4 animate-pulse bg-primary text-primary-foreground">
              🚨 Kritieke Bedreiging Alert
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              {service.title}
            </h1>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-8"
            >
              <Alert className="border-primary bg-primary/10 dark:border-primary dark:bg-primary/20 max-w-3xl mx-auto">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <AlertTitle className="text-foreground dark:text-primary font-bold">
                  🚨 Waarschuwing: Nederlandse bedrijven onder vuur
                </AlertTitle>
                <AlertDescription className="text-muted-foreground dark:text-muted-foreground">
                  {service.description}
                </AlertDescription>
              </Alert>
            </motion.div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 animate-pulse">
                <Link href="/contact">
                  Gratis Security Scan Nu <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="/prijzen">
                  Bekijk Prijzen
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Key Points */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Waarom kiezen voor {service.title}?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {service.shortDescription}
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {service.keyPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="flex items-start gap-4"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{point}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Wat krijg je met {service.title}?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Complete bescherming tegen alle moderne cyberdreigingen
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {service.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className={`h-5 w-5 ${feature.included ? 'text-green-600' : 'text-muted-foreground'}`} />
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Voordelen voor jouw bedrijf</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {service.benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ x: index % 2 === 0 ? -30 : 30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="flex items-start gap-3"
              >
                <Star className="h-5 w-5 text-workflo-yellow flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MSP Inclusion Banner */}
      <section className="py-16 bg-gradient-to-br from-workflo-yellow/20 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-green-600">Inbegrepen in MSP Pakketten</Badge>
            <h2 className="text-3xl font-bold mb-4">
              Volledige Cybersecurity vanaf €60/gebruiker/maand
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Alle cybersecurity features zijn standaard inbegrepen in onze Managed Services pakketten.
              Geen extra kosten, geen verrassingen.
            </p>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">Inbegrepen in MSP pakket:</p>
                <p className="text-4xl font-bold text-green-600 mb-2">GRATIS*</p>
                <p className="text-sm text-muted-foreground">*Vanaf €60/gebruiker/maand MSP pakket</p>
              </div>
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-sm font-semibold text-green-700 dark:text-green-400 text-center">
                  Volledige cybersecurity bescherming zonder extra kosten
                </p>
              </div>
            </div>
            <div className="mt-8 flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg">
                <Link href="/prijzen">
                  Bereken Je MSP Pakket
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">
                  Vraag Gratis Security Scan
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Veelgestelde Vragen</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Antwoorden op de meest gestelde vragen over {service.title}
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {service.faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Interesse in {service.title}?</h2>
            <p className="text-muted-foreground mb-8">
              Neem contact op voor een gratis security scan en persoonlijk advies
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    <CardTitle>Noodlijn</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">24/7 bereikbaar bij security incidenten</p>
                  <Button asChild className="w-full">
                    <Link href="tel:+31203080465">
                      020 308 04 65
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <CardTitle>Gratis Security Scan</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Ontvang binnen 24 uur een rapport</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/contact">
                      Scan Aanvragen
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Social Proof */}
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>100+ tevreden klanten</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-workflo-yellow fill-current" />
                <span>4.8/5 gemiddelde</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>ISO 27001 gecertificeerd</span>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-4">
              Geen verplichtingen • Gratis consult • 30 dagen opzegtermijn
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, currentColor, currentColor 10px, transparent 10px, transparent 20px)`
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Start vandaag met {service.title}</h2>
            <p className="text-xl mb-8 opacity-90">Bescherm je bedrijf tegen cybercriminelen voordat het te laat is</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link href="/contact">
                  Gratis Security Scan <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link href="/prijzen">
                  Bereken Je Prijs
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
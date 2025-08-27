'use client'


import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Phone, Mail, Star, Euro } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { getServiceBySlug, calculateServicePrice } from '@/lib/data/services-data'

export default function Microsoft365Page() {
  const service = getServiceBySlug('microsoft-365')!
  const examplePricing = calculateServicePrice(service, 10)

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
            <Badge variant="secondary" className="mb-4 bg-[#f2f400] text-black">
              📊 Microsoft Gold Partner
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              {service.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {service.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/contact">
                  Gratis Microsoft 365 Assessment <ArrowRight className="ml-2 h-5 w-5" />
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
              Complete Microsoft 365 beheer en ondersteuning
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
                <Star className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Transparante Prijzen</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professioneel Microsoft 365 beheer inclusief ondersteuning
            </p>
          </motion.div>
          
          <div className="max-w-md mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  €{service.pricing.basePrice}
                  <span className="text-sm font-normal text-muted-foreground ml-1">per gebruiker/maand</span>
                </div>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
                <CardDescription>{service.shortDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Setup kosten</span>
                    <span className="font-semibold">€{service.pricing.setup}</span>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-4">Voorbeeld voor 10 gebruikers:</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Maandelijks (10 users)</span>
                        <span>€{examplePricing.monthly}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Setup (eenmalig)</span>
                        <span>€{examplePricing.setup}</span>
                      </div>
                      {examplePricing.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Volume korting</span>
                          <span>-€{examplePricing.discount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button asChild className="w-full" size="lg">
                    <Link href="/prijzen">
                      Bereken Je Prijs <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
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
              Neem contact op voor een gratis Microsoft 365 assessment en persoonlijk advies
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    <CardTitle>Microsoft Specialist</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Direct contact met onze Microsoft experts</p>
                  <Button asChild className="w-full">
                    <Link href="tel:+31207220706">
                      020 722 07 06
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <CardTitle>Gratis Assessment</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Ontvang binnen 24 uur een offerte op maat</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/contact">
                      Assessment Aanvragen
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
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
            <p className="text-xl mb-8 opacity-90">Ontdek de kracht van Microsoft 365 met professionele ondersteuning</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/contact">
                  Gratis Assessment <ArrowRight className="ml-2 h-5 w-5" />
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
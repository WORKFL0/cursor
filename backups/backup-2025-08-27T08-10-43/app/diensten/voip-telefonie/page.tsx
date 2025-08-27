'use client'


import { motion } from 'framer-motion'
import Link from 'next/link'
import { Phone, Smartphone, Headphones, MessageSquare, BarChart3, Globe, ArrowRight, CheckCircle, Users, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function VoIPTelefoniePage() {
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
            <Badge variant="secondary" className="mb-4">
              Modern Telefoneren voor Amsterdam
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              VoIP Telefonie: Professioneel Bellen, Overal
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Vergeet dure telefooncentales en beperkte functionaliteit. Met Workflo's VoIP telefonie 
              krijg je enterprise-grade telefonie features tegen fractie van de kosten. 
              Perfect voor Amsterdamse bedrijven die professioneel willen communiceren.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/tevredenheidscheck">
                  Bereken Je Telefonie Besparing <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="/prijzen">
                  Bekijk VoIP Prijzen
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Benefits */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Waarom Amsterdamse Bedrijven Overstappen naar VoIP</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meer functies, lagere kosten, en flexibiliteit die traditionele telefonie niet kan bieden
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Phone,
                title: "60% Kostenbesparing",
                description: "Gemiddeld besparen Amsterdamse bedrijven 60% op hun telefonie kosten door over te stappen naar VoIP."
              },
              {
                icon: Globe,
                title: "Bel Overal Vandaan",
                description: "Je kantoortelefoon werkt thuis, onderweg, of in het buitenland. Dezelfde functionaliteit, overal."
              },
              {
                icon: Settings,
                title: "Enterprise Features",
                description: "Call forwarding, voicemail-to-email, call recording, en conference calling - allemaal standaard inbegrepen."
              },
              {
                icon: Smartphone,
                title: "Mobiele Integratie",
                description: "Je mobiele telefoon wordt onderdeel van het kantoorsysteem. Één nummer, alle apparaten."
              },
              {
                icon: BarChart3,
                title: "Gedetailleerde Rapportage",
                description: "Inzicht in gespreksduur, kosten per afdeling, en performance metrics voor betere bedrijfsvoering."
              },
              {
                icon: MessageSquare,
                title: "Unified Communications",
                description: "Telefoon, chat, video, en screen sharing in één geïntegreerde oplossing."
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg mb-4 flex items-center justify-center">
                      <benefit.icon className="h-6 w-6 text-primary dark:text-primary" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">VoIP vs. Traditionele Telefonie</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Zie het verschil in functionaliteit en kosten
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="border-destructive/20 dark:border-destructive">
                  <CardHeader>
                    <CardTitle className="text-xl text-destructive dark:text-destructive">Traditionele Telefonie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-muted-foreground">
                      {[
                        "Hoge maandelijkse kosten",
                        "Dure internationale gesprekken",
                        "Beperkte features",
                        "Vast aan locatie gebonden",
                        "Dure uitbreidingen",
                        "Geen integratie met IT-systemen",
                        "Ouderwetse voicemail",
                        "Geen mobile integration"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-destructive">❌</span>
                          {item}
                        </li>
                      ))}
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
                <Card className="border-primary/20 dark:border-primary">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary dark:text-primary">Workflo VoIP</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-muted-foreground">
                      {[
                        "60% lagere kosten",
                        "Gratis internationale gesprekken*",
                        "Enterprise-grade features",
                        "Werk overal vandaan",
                        "Eenvoudige uitbreidingen",
                        "Volledige CRM integratie",
                        "Voicemail-to-email",
                        "Mobile app inbegrepen"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* VoIP Plans */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">VoIP Plannen voor Elk Bedrijf</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Van startups tot enterprise - transparante prijzen zonder verborgen kosten
            </p>
          </motion.div>

          <Tabs defaultValue="essential" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="essential">Essential</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
            </TabsList>
            
            <TabsContent value="essential" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader className="text-center">
                    <Badge variant="outline" className="mb-2">Perfect voor Startups</Badge>
                    <CardTitle className="text-2xl">Essential VoIP</CardTitle>
                    <div className="text-3xl font-bold text-primary">€12,50 <span className="text-base font-normal">/gebruiker/maand</span></div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Inbegrepen:</h4>
                        <ul className="space-y-2">
                          {[
                            "Unlimited binnenlandse gesprekken",
                            "Voicemail & call forwarding",
                            "Mobile app (iOS/Android)",
                            "Online dashboard",
                            "Email support"
                          ].map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Ideaal voor:</h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• Kleine teams (2-10 gebruikers)</li>
                          <li>• Budget-bewuste organisaties</li>
                          <li>• Eenvoudige telefonie behoeften</li>
                          <li>• Startups en freelancers</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="professional" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-primary">
                  <CardHeader className="text-center">
                    <Badge className="mb-2">Meest Populair</Badge>
                    <CardTitle className="text-2xl">Professional VoIP</CardTitle>
                    <div className="text-3xl font-bold text-primary">€18,75 <span className="text-base font-normal">/gebruiker/maand</span></div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Alles van Essential, plus:</h4>
                        <ul className="space-y-2">
                          {[
                            "Conference calling (tot 25 deelnemers)",
                            "Call recording & analytics",
                            "CRM integratie (HubSpot, Salesforce)",
                            "Auto attendant (keuzemenu)",
                            "Voicemail-to-email",
                            "24/7 telefoon support"
                          ].map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Ideaal voor:</h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• Groeiende bedrijven (10-50 gebruikers)</li>
                          <li>• Sales teams</li>
                          <li>• Customer service afdelingen</li>
                          <li>• Professionele communicatie</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="enterprise" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader className="text-center">
                    <Badge variant="outline" className="mb-2">Enterprise Features</Badge>
                    <CardTitle className="text-2xl">Enterprise VoIP</CardTitle>
                    <div className="text-3xl font-bold text-primary">€24,50 <span className="text-base font-normal">/gebruiker/maand</span></div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Alles van Professional, plus:</h4>
                        <ul className="space-y-2">
                          {[
                            "Unlimited conference calling",
                            "Advanced call analytics & reporting",
                            "Multi-site deployment",
                            "Dedicated account manager",
                            "API access voor integraties",
                            "Priority support & SLA"
                          ].map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Ideaal voor:</h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• Grote organisaties (50+ gebruikers)</li>
                          <li>• Multi-locatie bedrijven</li>
                          <li>• Call centers</li>
                          <li>• Complexe telefonie behoeften</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Implementation Process */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Naadloze VoIP Implementatie</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Van traditionele telefonie naar modern VoIP in 5 eenvoudige stappen
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Telefonie Audit",
                  description: "We analyseren je huidige telefonie setup, kosten en gebruikspatronen om het optimale VoIP plan te bepalen."
                },
                {
                  step: "2",
                  title: "Netwerk Assessment",
                  description: "Verificatie van je internetverbinding en netwerk om optimale VoIP call quality te garanderen."
                },
                {
                  step: "3",
                  title: "VoIP Configuratie",
                  description: "Setup van je VoIP systeem met alle gewenste features, nummerbehoud en gebruikersaccounts."
                },
                {
                  step: "4",
                  title: "Training & Go-Live",
                  description: "Comprehensive training voor je team en begeleide overgang van oud naar nieuw systeem."
                },
                {
                  step: "5",
                  title: "Ongoing Support",
                  description: "Continue ondersteuning, monitoring en optimalisatie van je VoIP oplossing."
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary-foreground">{step.step}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-8">
                <blockquote className="text-lg text-muted-foreground italic mb-4 leading-relaxed">
                  "De overstap naar VoIP met Workflo heeft ons €2.400 per maand bespaard op telefonie kosten. 
                  Bovendien kunnen onze sales mensen nu overal professioneel bereikbaar zijn. 
                  De call quality is beter dan onze oude telefooncentrale en de features zijn fantastisch."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                    <Headphones className="h-6 w-6 text-primary dark:text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Lisa van Houten</p>
                    <p className="text-sm text-muted-foreground">Office Manager, Amsterdam Tech Solutions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
            <h2 className="text-4xl font-bold mb-4">Klaar voor Moderne Telefonie?</h2>
            <p className="text-xl mb-8 opacity-90">
              Bespaar tot 60% op je telefonie kosten en krijg enterprise features
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link href="/tevredenheidscheck">
                  Bereken Je VoIP Besparing <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <div className="text-white">
                <p className="text-sm opacity-90">Of bel voor advies:</p>
                <a href="tel:020-3080465" className="text-lg font-bold hover:underline">020-30 80 465</a>
              </div>
            </div>
            <p className="text-sm opacity-75 mt-6">
              ✓ Gratis telefonie audit • ✓ Behoud je huidige nummers • ✓ 30 dagen geld-terug garantie
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
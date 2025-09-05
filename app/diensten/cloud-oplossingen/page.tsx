'use client'


import { motion } from '@/lib/framer-motion'
import Link from 'next/link'
import { Cloud, ArrowRight, CheckCircle, Phone, Mail, Star, Euro, Shield, Zap, TrendingUp, Users, BarChart3, Settings, Monitor, Smartphone, Lock, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getServiceBySlug, calculateServicePrice } from '@/lib/data/services-data'

export default function CloudOplossingenPage() {
  const service = getServiceBySlug('cloud')!
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
              ☁️ Schaal Je Bedrijf Zonder IT-Hoofdpijn
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Cloud Oplossingen Amsterdam
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Van startup tot enterprise - wij maken cloud computing simpel en veilig. 
              Werk vanaf elke locatie met dezelfde snelheid en beveiliging als op kantoor. 
              <span className="font-semibold text-primary">95% van onze klanten ervaart betere prestaties dan hun oude on-premise systemen.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/contact">
                  Gratis Cloud Assessment <ArrowRight className="ml-2 h-5 w-5" />
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

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { stat: "99.9%", label: "Uptime Garantie", icon: TrendingUp },
              { stat: "60%", label: "Kostenbesparing vs On-Premise", icon: Euro },
              { stat: "24/7", label: "Monitoring & Support", icon: Shield },
              { stat: "100+", label: "Tevreden Cloud Klanten", icon: Users }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col items-center">
                    <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-full mb-3">
                      <item.icon className="h-6 w-6 text-primary dark:text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-1">{item.stat}</div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cloud Solutions Tabs */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Complete Cloud Oplossingen</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Van Microsoft 365 tot volledig beheerde Azure environments - wij bieden alles voor moderne bedrijven
            </p>
          </motion.div>

          <Tabs defaultValue="microsoft365" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="microsoft365">Microsoft 365</TabsTrigger>
              <TabsTrigger value="azure">Azure Cloud</TabsTrigger>
              <TabsTrigger value="hybrid">Hybride Cloud</TabsTrigger>
              <TabsTrigger value="backup">Cloud Backup</TabsTrigger>
            </TabsList>
            
            <TabsContent value="microsoft365" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Microsoft 365 Complete
                    </CardTitle>
                    <CardDescription>
                      Volledige Microsoft 365 setup en beheer voor moderne werkplekken
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {[
                        "Office 365 Apps (Word, Excel, PowerPoint, Teams)",
                        "Exchange Online Email + 50GB mailbox",
                        "OneDrive 1TB cloud storage per gebruiker",
                        "SharePoint voor document samenwerking",
                        "Microsoft Teams voor videobellen",
                        "Advanced Threat Protection",
                        "Multi-Factor Authentication setup",
                        "Mobile Device Management (MDM)"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Waarom Microsoft 365?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-lg">
                        <h4 className="font-semibold mb-2">💰 Kostenbesparing</h4>
                        <p className="text-sm text-muted-foreground">Gemiddeld 40% goedkoper dan on-premise Office + email server</p>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <h4 className="font-semibold mb-2">🔄 Altijd Up-to-date</h4>
                        <p className="text-sm text-muted-foreground">Automatische updates, geen verouderde software meer</p>
                      </div>
                      <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-lg">
                        <h4 className="font-semibold mb-2">🏢 Hybride Werken</h4>
                        <p className="text-sm text-muted-foreground">Naadloos werken tussen kantoor, thuis en onderweg</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="azure" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cloud className="h-5 w-5 text-primary" />
                      Azure Cloud Services
                    </CardTitle>
                    <CardDescription>
                      Enterprise cloud infrastructure voor schaalbare bedrijfsgroei
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {[
                        "Virtual Machines & App Services",
                        "Azure SQL Database beheer",
                        "Load Balancing & Auto-scaling",
                        "Content Delivery Network (CDN)",
                        "Azure Active Directory Integration",
                        "Application Gateway & Firewall",
                        "Monitoring & Alerting (Azure Monitor)",
                        "Disaster Recovery & Geographic Redundancy"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Azure Voordelen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Elastische Schaalbaarheid</p>
                          <p className="text-sm text-muted-foreground">Automatisch opschalen bij piekmomenten, bespaar kosten in rustige periodes</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Lock className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Enterprise Security</p>
                          <p className="text-sm text-muted-foreground">ISO 27001, SOC 2 gecertificeerd met advanced threat protection</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Globale Beschikbaarheid</p>
                          <p className="text-sm text-muted-foreground">Datacenters in Nederland en Europa voor optimale prestaties</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="hybrid" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5 text-primary" />
                      Hybride Cloud Strategie
                    </CardTitle>
                    <CardDescription>
                      Het beste van beide werelden: on-premise + cloud
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {[
                        "Azure Arc voor unified management",
                        "Site-to-Site VPN verbindingen",
                        "Active Directory synchronisatie",
                        "Hybrid Exchange configuratie",
                        "Cloud backup van on-premise data",
                        "Gradual cloud migration planning",
                        "Consistent security policies",
                        "Centralized monitoring dashboard"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Perfecte Transitie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border-l-4 border-primary bg-primary/10 dark:bg-primary/20">
                        <h4 className="font-semibold mb-1">Fase 1: Assessment</h4>
                        <p className="text-sm text-muted-foreground">Analyse huidige infrastructuur en cloud-readiness</p>
                      </div>
                      <div className="p-4 border-l-4 border-primary bg-primary/10 dark:bg-primary/20">
                        <h4 className="font-semibold mb-1">Fase 2: Hybrid Setup</h4>
                        <p className="text-sm text-muted-foreground">Veilige verbinding tussen on-premise en cloud</p>
                      </div>
                      <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20">
                        <h4 className="font-semibold mb-1">Fase 3: Gradual Migration</h4>
                        <p className="text-sm text-muted-foreground">Stapsgewijze overzet zonder service onderbreking</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="backup" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      Cloud Backup Solutions
                    </CardTitle>
                    <CardDescription>
                      Enterprise-grade backup met instant recovery mogelijkheden
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {[
                        "Automated daily backups",
                        "Point-in-time recovery (elke 15 minuten)",
                        "Geographic redundancy (NL + EU)",
                        "Ransomware protection & detection",
                        "Backup verification & testing",
                        "Instant VM recovery in Azure",
                        "Granular file-level restore",
                        "Compliance reporting (AVG/GDPR)"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recovery Garanties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">&lt; 4 uur</div>
                        <p className="text-sm text-muted-foreground">Complete server recovery tijd</p>
                      </div>
                      <div className="text-center p-4 bg-primary/10 dark:bg-primary/20 rounded-lg">
                        <div className="text-2xl font-bold text-primary">99.99%</div>
                        <p className="text-sm text-muted-foreground">Backup success rate</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 dark:bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-foreground">7 jaar</div>
                        <p className="text-sm text-muted-foreground">Retention voor compliance</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
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
            <h2 className="text-3xl font-bold mb-4">Waarom Workflo voor Cloud Oplossingen?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meer dan alleen technologie - wij zijn je strategische cloud partner
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Microsoft Gold Partner",
                description: "Gecertificeerd voor alle Microsoft cloud services met direct access tot Microsoft support en resources."
              },
              {
                icon: Users,
                title: "24/7 Monitoring Team",
                description: "Nederlands cloud operations team monitort je omgeving rond de klok en grijpt in voordat jij problemen merkt."
              },
              {
                icon: BarChart3,
                title: "Proactive Optimization",
                description: "Maandelijkse analyses van performance en kosten om je cloud omgeving continu te verbeteren."
              },
              {
                icon: Lock,
                title: "Security First",
                description: "GDPR/AVG compliance, zero-trust architectuur en advanced threat protection as standard."
              },
              {
                icon: Zap,
                title: "Rapid Deployment",
                description: "Van offerte tot live cloud omgeving binnen 5 werkdagen, inclusief gebruikerstraining."
              },
              {
                icon: Euro,
                title: "Transparante Pricing",
                description: "Vaste maandprijs zonder verrassingen. Volume kortingen en flexibele betalingsopties beschikbaar."
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-full mb-4">
                      <benefit.icon className="h-6 w-6 text-primary dark:text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </Card>
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
            <h2 className="text-3xl font-bold mb-4">Transparante Cloud Prijzen</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Complete cloud oplossingen vanaf €25 per gebruiker per maand
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Starter Cloud",
                price: "25",
                description: "Perfect voor kleine teams",
                features: [
                  "Microsoft 365 Business Basic",
                  "OneDrive 1TB per gebruiker",
                  "Teams videobellen",
                  "Exchange Online email",
                  "Setup & configuratie",
                  "Email ondersteuning"
                ],
                highlight: false
              },
              {
                name: "Professional Cloud",
                price: "45",
                description: "Meest gekozen voor groeiende bedrijven",
                features: [
                  "Microsoft 365 Business Premium",
                  "Advanced Threat Protection",
                  "Multi-Factor Authentication",
                  "Device Management (MDM)",
                  "SharePoint Online",
                  "24/7 telefoon support",
                  "Maandelijkse health check"
                ],
                highlight: true
              },
              {
                name: "Enterprise Cloud",
                price: "Maatwerk",
                description: "Voor complexe organisaties",
                features: [
                  "Microsoft 365 E3/E5",
                  "Azure AD Premium",
                  "Azure cloud infrastructure",
                  "Hybride configuraties",
                  "Custom integrations",
                  "Dedicated account manager",
                  "SLA garanties"
                ],
                highlight: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full ${plan.highlight ? 'border-[#f2f400] shadow-lg' : ''} relative`}>
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-[#f2f400] text-black">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="text-3xl font-bold text-primary mt-4">
                      {plan.price !== "Maatwerk" ? `€${plan.price}` : plan.price}
                      {plan.price !== "Maatwerk" && <span className="text-sm font-normal text-muted-foreground">/gebruiker/maand</span>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      asChild 
                      className="w-full"
                      variant={plan.highlight ? 'default' : 'outline'}
                    >
                      <Link href="/contact">
                        {plan.price !== "Maatwerk" ? "Start Nu" : "Vraag Offerte"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
            <h2 className="text-3xl font-bold mb-4">Veelgestelde Vragen over Cloud</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Antwoorden op de meest gestelde vragen over cloud oplossingen
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "Hoe veilig is de cloud vergeleken met mijn eigen servers?",
                  answer: "Microsoft cloud datacenters hebben enterprise-grade beveiliging die voor de meeste bedrijven onbetaalbaar zou zijn. Denk aan 24/7 bewaking, biometrische toegangscontrole, redundante systemen en continue security updates. Statistisch gezien is de kans op datalekken 5x kleiner dan bij on-premise servers."
                },
                {
                  question: "Wat gebeurt er met mijn data bij internetstoring?",
                  answer: "Je kunt offline werken met lokaal opgeslagen bestanden. Zodra internet weer werkt, synchroniseert alles automatisch. Voor kritische processen kunnen we lokale backup systemen opzetten als extra zekerheid."
                },
                {
                  question: "Hoelang duurt de overstap naar de cloud?",
                  answer: "Voor Microsoft 365: 3-5 werkdagen. Voor complexere Azure migraties: 2-8 weken afhankelijk van je huidige infrastructuur. We plannen altijd buiten kantooruren om verstoring te voorkomen."
                },
                {
                  question: "Kan ik mijn huidige software blijven gebruiken?",
                  answer: "De meeste software werkt perfect in de cloud. Voor oudere applicaties kunnen we virtualisatie-oplossingen inzetten. We maken altijd eerst een compatibility assessment voordat we beginnen."
                },
                {
                  question: "Wat zijn de werkelijke kosten van cloud?",
                  answer: "Naast de maandelijkse software kosten (transparant geprijsd) rekenen we eenmalig €100-200 setup kosten. Geen verborgen kosten of surprise bills. De meeste klanten besparen 40-60% vergeleken met hun oude IT-infrastructuur."
                },
                {
                  question: "Krijg ik training voor mijn team?",
                  answer: "Ja, inclusief! We geven hands-on training voor alle medewerkers, maken instructievideo's voor jullie specifieke setup en zijn altijd bereikbaar voor vragen tijdens de wenperiode."
                }
              ].map((faq, index) => (
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
            <h2 className="text-3xl font-bold mb-4">Klaar voor de Cloud?</h2>
            <p className="text-muted-foreground mb-8">
              Start met een gratis cloud assessment en ontdek hoe wij je bedrijf naar een hoger niveau tillen
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    <CardTitle>Direct Contact</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Spreek direct met onze cloud specialisten</p>
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
                    <CardTitle>Gratis Cloud Assessment</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Ontvang binnen 24 uur een persoonlijke analyse</p>
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
            <h2 className="text-4xl font-bold mb-4">Begin Je Cloud Reis Vandaag</h2>
            <p className="text-xl mb-8 opacity-90">Sluit je aan bij 100+ tevreden klanten die al de voordelen van cloud computing ervaren</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/contact">
                  Gratis Cloud Assessment <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link href="/prijzen">
                  Bereken Je Kosten
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
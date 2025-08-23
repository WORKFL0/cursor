'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Calendar, Users, Cloud, Shield, Smartphone, FileText, ArrowRight, CheckCircle, Settings, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Microsoft365Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4">
              Microsoft Gold Partner
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Microsoft 365: Je Complete Digitale Werkplek
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Van email tot samenwerking, van beveiliging tot compliance - Microsoft 365 brengt alles samen 
              in één krachtige suite. Workflo zorgt voor naadloze implementatie en optimale configuratie 
              voor Amsterdamse bedrijven.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/tevredenheidscheck">
                  Start Gratis Microsoft 365 Assessment <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="/prijzen">
                  Bekijk Microsoft 365 Prijzen
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Core Applications */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">De Complete Microsoft 365 Suite</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Alle tools die je team nodig heeft voor productief en veilig werken
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            {[
              {
                icon: Mail,
                title: "Outlook & Exchange",
                description: "Professionele email met 50GB mailbox, kalender, contacten en geavanceerde spam-filtering."
              },
              {
                icon: Users,
                title: "Microsoft Teams",
                description: "Video calls, chat, bestandsdeling en samenwerking in één krachtige applicatie."
              },
              {
                icon: FileText,
                title: "Office Apps",
                description: "Word, Excel, PowerPoint en meer - altijd de nieuwste versies op al je apparaten."
              },
              {
                icon: Cloud,
                title: "OneDrive & SharePoint",
                description: "1TB cloud opslag per gebruiker plus centrale bestandsopslag en delen voor teams."
              },
              {
                icon: Shield,
                title: "Advanced Security",
                description: "Enterprise-grade beveiliging met multi-factor authenticatie en threat protection."
              },
              {
                icon: Smartphone,
                title: "Mobile Device Management",
                description: "Veilig toegang vanaf elke locatie met volledige controle over bedrijfsdata."
              }
            ].map((app, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4 flex items-center justify-center">
                      <app.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-xl">{app.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {app.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Comparison */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Microsoft 365 Plannen voor Elk Bedrijf</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Van startups tot enterprise - wij helpen u het juiste plan te kiezen
            </p>
          </motion.div>

          <Tabs defaultValue="business" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Business Basic</TabsTrigger>
              <TabsTrigger value="business">Business Standard</TabsTrigger>
              <TabsTrigger value="premium">Business Premium</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader className="text-center">
                    <Badge variant="outline" className="mb-2">Perfect voor Starters</Badge>
                    <CardTitle className="text-2xl">Business Basic</CardTitle>
                    <div className="text-3xl font-bold text-primary">€5,10 <span className="text-base font-normal">/gebruiker/maand</span></div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Inbegrepen:</h4>
                        <ul className="space-y-2">
                          {[
                            "Outlook web en mobiel",
                            "Microsoft Teams",
                            "1TB OneDrive opslag",
                            "SharePoint sites",
                            "Web versies van Office apps"
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
                          <li>• Startups en kleine teams</li>
                          <li>• Web-based werken</li>
                          <li>• Budget-bewuste organisaties</li>
                          <li>• Eenvoudige samenwerkingsbehoeften</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="business" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-primary">
                  <CardHeader className="text-center">
                    <Badge className="mb-2">Meest Populair</Badge>
                    <CardTitle className="text-2xl">Business Standard</CardTitle>
                    <div className="text-3xl font-bold text-primary">€11,70 <span className="text-base font-normal">/gebruiker/maand</span></div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Alles van Basic, plus:</h4>
                        <ul className="space-y-2">
                          {[
                            "Desktop versies Office apps",
                            "Exchange Online (50GB mailbox)",
                            "Microsoft Bookings",
                            "Geavanceerde Teams functies",
                            "Webinar hosting (tot 250 deelnemers)"
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
                          <li>• Groeiende bedrijven (5-300 gebruikers)</li>
                          <li>• Volledige Office functionaliteit</li>
                          <li>• Externe samenwerking</li>
                          <li>• Professionele communicatie</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="premium" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader className="text-center">
                    <Badge variant="outline" className="mb-2">Enterprise Security</Badge>
                    <CardTitle className="text-2xl">Business Premium</CardTitle>
                    <div className="text-3xl font-bold text-primary">€20,60 <span className="text-base font-normal">/gebruiker/maand</span></div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Alles van Standard, plus:</h4>
                        <ul className="space-y-2">
                          {[
                            "Microsoft Defender for Business",
                            "Advanced Threat Protection",
                            "Intune device management",
                            "Azure Information Protection",
                            "Advanced compliance tools"
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
                          <li>• Bedrijven met hoge security eisen</li>
                          <li>• Regulated industries</li>
                          <li>• Remote work scenarios</li>
                          <li>• GDPR compliance behoeften</li>
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

      {/* Migration Process */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Naadloze Microsoft 365 Migratie</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Van planning tot go-live - wij zorgen voor een perfecte overgang
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Assessment & Planning",
                  description: "We analyseren je huidige email en samenwerkingstools, identificeren migratierisico's en maken een gedetailleerd migratieplan."
                },
                {
                  step: "2",
                  title: "Tenant Setup & Configuration",
                  description: "Wij richten je Microsoft 365 tenant in met optimale beveiligingsinstellingen, compliance policies en gebruikersaccounts."
                },
                {
                  step: "3",
                  title: "Data Migratie",
                  description: "Email, bestanden en instellingen worden veilig gemigreerd met minimale downtime. We zorgen ervoor dat niets verloren gaat."
                },
                {
                  step: "4",
                  title: "Training & Support",
                  description: "Uw team krijgt uitgebreide training in de nieuwe tools. Na go-live bieden we continue support en optimalisatie."
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-white">{step.step}</span>
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

      {/* Benefits */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Waarom Amsterdamse Bedrijven Kiezen voor Microsoft 365</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Bewezen voordelen die je bedrijf direct zal ervaren
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Zap,
                title: "40% Productiever",
                description: "Teams die Microsoft 365 gebruiken zijn gemiddeld 40% productiever door betere samenwerking en automatisering."
              },
              {
                icon: Shield,
                title: "99.9% Uptime",
                description: "Microsoft garandeert 99.9% beschikbaarheid met financiële compensatie bij niet-nakoming van de SLA."
              },
              {
                icon: Settings,
                title: "Altijd Up-to-Date",
                description: "Automatische updates zorgen ervoor dat u altijd de nieuwste functies en beveiligingspatches heeft."
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <benefit.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-8">
                <blockquote className="text-lg text-muted-foreground italic mb-4 leading-relaxed">
                  "De overstap naar Microsoft 365 met Workflo was naadloos. Binnen een week hadden we alles 
                  operationeel en ons team was al productiever dan ooit. De beveiligingsfuncties gaven ons 
                  eindelijk gemoedsrust over onze klantdata. Een investering die zichzelf binnen 6 maanden terugverdiende."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Sarah de Wit</p>
                    <p className="text-sm text-muted-foreground">Operations Director, Amsterdam Creative Agency</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
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
            <h2 className="text-4xl font-bold mb-4">Klaar voor de Toekomst van Werken?</h2>
            <p className="text-xl mb-8 opacity-90">Start vandaag nog met Microsoft 365 en ervaar het verschil</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link href="/tevredenheidscheck">
                  Plan Gratis Microsoft 365 Consult <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <div className="text-white">
                <p className="text-sm opacity-90">Of bel direct:</p>
                <a href="tel:020-3080465" className="text-lg font-bold hover:underline">020-30 80 465</a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Cloud, Globe, Euro, Shield, Zap, RefreshCw, TrendingUp, ArrowRight, CheckCircle, Users, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MobileFirstSection } from '@/components/sections/mobile-first-section'

export default function CloudServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 bg-gradient-to-br from-blue-50 via-background to-indigo-50 dark:from-blue-950/20 dark:via-background dark:to-indigo-950/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-primary to-indigo-500"></div>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4">
              Schaal Je Bedrijf Zonder IT-Hoofdpijn
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Scale Your Business Without Scaling Your IT Headaches
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Groeiende Amsterdamse bedrijven staan voor een keuze: dure on-premise infrastructuur 
              die snel veroudert, of cloudoplossingen die meegroeien. Slimme bedrijfseigenaren kiezen voor de cloud.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/tevredenheidscheck">
                  Gratis Cloud Assessment <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="/prijzen">
                  Bekijk Cloud Prijzen
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Benefits Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Waarom Amsterdamse Bedrijven Overstappen naar de Cloud</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ontdek de voordelen die je bedrijf direct kan ervaren
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Globe,
                title: "Werk Overal Vandaan",
                description: "Toegang tot je data en applicaties veilig vanaf elke locatie. Perfect voor hybride werken en meerdere kantoorlocaties in Amsterdam."
              },
              {
                icon: Euro,
                title: "Betaal Alleen Wat Je Gebruikt",
                description: "Geen over-dimensionering van servers meer. Schaal op tijdens drukke periodes, schaal af om kosten te besparen. Perfect voor seizoensgebonden bedrijven."
              },
              {
                icon: Shield,
                title: "Enterprise-Grade Security",
                description: "Microsoft en Google investeren miljarden in beveiliging. Krijg dezelfde bescherming als Fortune 500 bedrijven tegen MKB-prijzen."
              },
              {
                icon: Zap,
                title: "Bliksemsnelle Implementatie",
                description: "10 nieuwe werkplekken nodig voor je nieuwe Amsterdam kantoor? Zet ze op in uren, niet weken. Geen vertragingen door hardware-inkoop."
              },
              {
                icon: RefreshCw,
                title: "Automatisch Alles",
                description: "Updates, backups en onderhoud gebeuren automatisch. Je team blijft productief terwijl wij de technische details afhandelen."
              },
              {
                icon: TrendingUp,
                title: "Oneindige Schaalbaarheid",
                description: "Van 5 tot 500 medewerkers, de cloud groeit mee. Geen IT-infrastructuur meer die je bedrijfsgroei tegenhoudt."
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
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4 flex items-center justify-center">
                      <benefit.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
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

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Complete Cloud Oplossingen voor Elke Behoefte</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Van productiviteit tot infrastructuur - alles wat je nodig hebt in de cloud
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {[
              {
                title: "Microsoft 365 & Productiviteit",
                features: [
                  "Email, kalender en contacten",
                  "Teams voor samenwerking", 
                  "SharePoint voor bestandsdeling",
                  "OneDrive voor persoonlijke opslag",
                  "Geavanceerde beveiligingsfuncties",
                  "Mobile device management",
                  "Compliance tools (GDPR-ready)",
                  "24/7 Workflo support inbegrepen"
                ]
              },
              {
                title: "Cloud Infrastructuur (IaaS)",
                features: [
                  "Virtuele servers on-demand",
                  "Veilige netwerken",
                  "Load balancing",
                  "Disaster recovery ingebouwd",
                  "99.99% uptime SLA",
                  "Amsterdam datacenters",
                  "GDPR-compliant opslag",
                  "24/7 monitoring inbegrepen"
                ]
              },
              {
                title: "Backup & Disaster Recovery",
                features: [
                  "Geautomatiseerde dagelijkse backups",
                  "30-dagen retentie standaard",
                  "Directe bestandsherstel",
                  "Ransomware bescherming",
                  "Volledige systeemherstel",
                  "Reguliere recovery testing",
                  "Compliance rapportage",
                  "Zero data loss garantie"
                ]
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ x: index % 2 === 0 ? -30 : 30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Kostenvoordeel Cloud vs On-Premise</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Voor een typisch MKB bedrijf met 10-25 medewerkers
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">On-Premise Server (Traditioneel)</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="text-red-500">❌</span>
                        Server hardware: €8.000-12.000
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-red-500">❌</span>
                        Windows Server licenties: €3.000/jaar
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-red-500">❌</span>
                        Backup oplossing: €2.000/jaar
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-red-500">❌</span>
                        Stroomverbruik: €1.200/jaar
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-red-500">❌</span>
                        IT onderhoud: €5.000/jaar
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-red-500">❌</span>
                        Vervangen om de 5 jaar
                      </li>
                    </ul>
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 rounded">
                      <p className="font-bold text-red-700 dark:text-red-400">Jaar 1: €19.200 + hardware</p>
                      <p className="text-sm">Per jaar: €11.200 + afschrijving</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-green-600 dark:text-green-400">Cloud met Workflo</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Microsoft 365: €12.50/gebruiker
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Azure storage: €50/maand
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Backup inbegrepen
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Workflo beheer: €90/gebruiker
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        24/7 monitoring & support
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Schaalbaar zonder investering
                      </li>
                    </ul>
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 rounded">
                      <p className="font-bold text-green-700 dark:text-green-400">15 gebruikers: €1.537/maand</p>
                      <p className="text-sm">Inclusief alles, direct operationeel</p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">Geen grote investering vooraf nodig</p>
                  <p className="text-muted-foreground mt-2">Plus flexibiliteit, beveiliging en gemoedsrust</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Migration Process */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Zero-Verstoring Cloud Migratie</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Je overstap naar de cloud zonder onderbreking van je bedrijf
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Gratis Cloud Assessment",
                  description: "We analyseren je huidige infrastructuur en creëren een aangepast migratieplan dat verstoring minimaliseert en ROI maximaliseert."
                },
                {
                  step: "2",
                  title: "Gefaseerde Migratie",
                  description: "We verplaatsen je systemen in fasen, waarbij we ervoor zorgen dat elk onderdeel perfect werkt voordat we verdergaan. Je bedrijf stopt nooit."
                },
                {
                  step: "3",
                  title: "Training & Support",
                  description: "Je team krijgt uitgebreide training. Plus, onze 24/7 support zorgt ervoor dat vragen onmiddellijk worden beantwoord."
                },
                {
                  step: "4",
                  title: "Continue Optimalisatie", 
                  description: "Na migratie monitoren en optimaliseren we je cloudomgeving continu voor prestaties en kostenefficiëntie."
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold text-white">{step.step}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{step.title}</h3>
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
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-8">
                <blockquote className="text-lg text-muted-foreground italic mb-4 leading-relaxed">
                  "Overstappen naar de cloud met Workflo verminderde onze IT-kosten met 45% en gaf ons de flexibiliteit 
                  om onze tweede Amsterdam locatie te openen zonder IT-setup hoofdpijn. Wat vroeger weken duurde, duurt nu uren. 
                  Het beste deel? Alles werkt gewoon."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Petra Janssen</p>
                    <p className="text-sm text-muted-foreground">CEO, Janssen Architecture</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Mobile-First Section */}
      <MobileFirstSection language="nl" />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden">
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
            <h2 className="text-4xl font-bold mb-4">Klaar om aan te sluiten bij de Cloud Revolutie?</h2>
            <p className="text-xl mb-8 opacity-90">Zie hoeveel je kunt besparen met onze gratis cloud assessment</p>
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link href="/tevredenheidscheck">
                Plan Je Cloud Strategie Sessie <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
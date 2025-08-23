'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Clock, RotateCcw, HardDrive, CloudSnow, AlertTriangle, ArrowRight, CheckCircle, Timer, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function BackupDisasterRecoveryPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 bg-gradient-to-br from-green-50 via-background to-blue-50 dark:from-green-950/20 dark:via-background dark:to-blue-950/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-green-500"></div>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4">
              99.9% Data Recovery Garantie
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Backup & Disaster Recovery: Je Bedrijf Altijd Beschermd
            </h1>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-8"
            >
              <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30 max-w-3xl mx-auto">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <AlertTitle className="text-orange-800 dark:text-orange-400 font-bold">
                  Wist je dat 60% van de bedrijven die hun data verliezen binnen 6 maanden failliet gaan?
                </AlertTitle>
                <AlertDescription className="text-orange-700 dark:text-orange-300">
                  Een brand, ransomware aanval, of simpele hardware storing kan je bedrijf in één klap vernietigen. 
                  <strong> Werkflo's Backup & Disaster Recovery</strong> zorgt ervoor dat dit nooit gebeurt.
                </AlertDescription>
              </Alert>
            </motion.div>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Van automatische dagelijkse backups tot volledige disaster recovery in de cloud - 
              wij zorgen ervoor dat je bedrijfsdata altijd veilig en toegankelijk is, 
              waar je ook bent en wat er ook gebeurt.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/tevredenheidscheck">
                  Test Je Backup Nu <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="/prijzen">
                  Bekijk Backup Prijzen
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* The Problem */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Waarom Amsterdamse Bedrijven Hun Data Verliezen</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              De meeste bedrijven realiseren zich te laat hoe kwetsbaar hun data is
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: AlertTriangle,
                title: "Ransomware",
                stat: "37%",
                description: "Van alle dataverlies wordt veroorzaakt door ransomware aanvallen"
              },
              {
                icon: HardDrive,
                title: "Hardware Storing",
                stat: "31%",
                description: "Server crashes en disk failures vernietigen onverwacht jaren werk"
              },
              {
                icon: Database,
                title: "Menselijke Fout",
                stat: "22%",
                description: "Ongelukken gebeuren - verkeerde bestanden wissen komt vaker voor dan je denkt"
              },
              {
                icon: CloudSnow,
                title: "Natuurrampen",
                stat: "10%",
                description: "Brand, overstroming, of andere rampen kunnen je gehele kantoor vernietigen"
              }
            ].map((problem, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow border-red-200 dark:border-red-800">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <problem.icon className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="text-3xl font-bold text-red-500 mb-2">{problem.stat}</div>
                    <h3 className="font-bold mb-2">{problem.title}</h3>
                    <p className="text-sm text-muted-foreground">{problem.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Complete Backup & Disaster Recovery Oplossing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meer dan alleen backup - volledige bedrijfscontinuïteit voor elk scenario
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Automatische Cloud Backup",
                features: [
                  "Dagelijkse automatische backups van alle kritieke data",
                  "Incrementele backups voor snelheid en efficiency",
                  "30-dagen retentie standaard (uitbreidbaar)",
                  "Versleuteling tijdens transport en opslag",
                  "Geautomatiseerde backup verificatie"
                ]
              },
              {
                icon: RotateCcw,
                title: "Instant File Recovery",
                features: [
                  "Herstel individuele bestanden binnen minuten",
                  "Self-service portal voor eindgebruikers",
                  "Versiegeschiedenis - herstel van elke backup punt",
                  "Granular Exchange mailbox recovery",
                  "SharePoint site en document recovery"
                ]
              },
              {
                icon: Timer,
                title: "Volledige Disaster Recovery",
                features: [
                  "Complete server recovery binnen 4 uur",
                  "Virtualized recovery naar cloud infrastructuur",
                  "Regular disaster recovery testing",
                  "Gegarandeerde Recovery Time Objective (RTO)",
                  "Business continuity planning en documentatie"
                ]
              },
              {
                icon: Clock,
                title: "24/7 Monitoring & Alerting",
                features: [
                  "Real-time backup monitoring en rapportage",
                  "Proactieve alerts bij backup failures",
                  "Monthly backup health reports",
                  "Compliance reporting voor audits",
                  "Dedicated backup engineer support"
                ]
              }
            ].map((solution, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mb-4 flex items-center justify-center">
                      <solution.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-xl">{solution.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RTO/RPO Guarantees */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Onze Gegarandeerde Recovery Tijden</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Geen vage beloftes - harde garanties voor je bedrijfscontinuïteit
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Individual Files",
                time: "< 15 minuten",
                description: "Self-service herstel van individuele bestanden en folders"
              },
              {
                title: "Email Recovery",
                time: "< 1 uur",
                description: "Volledige mailbox of individual email recovery"
              },
              {
                title: "Full Server Recovery",
                time: "< 4 uur",
                description: "Complete server recovery met alle applicaties en data"
              }
            ].map((guarantee, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow border-green-200 dark:border-green-800">
                  <CardContent className="p-8">
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{guarantee.time}</div>
                    <h3 className="text-xl font-bold mb-3">{guarantee.title}</h3>
                    <p className="text-muted-foreground">{guarantee.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto mt-12"
          >
            <Card className="border-green-200 dark:border-green-800">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Zero Data Loss Garantie</h3>
                <p className="text-muted-foreground mb-6">
                  Met onze incremental backup technologie garanderen we dat u nooit meer dan 
                  4 uur werk verliest, ongeacht wat er gebeurt.
                </p>
                <Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400">
                  RPO: 4 uur maximum
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Kosten van Dataverlies vs. Preventie</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Investeren in backup is veel goedkoper dan herstellen van dataverlies
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
                <Card className="border-red-200 dark:border-red-800">
                  <CardHeader>
                    <CardTitle className="text-xl text-red-600 dark:text-red-400">Kosten van Dataverlies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex justify-between">
                        <span>Data recovery specialist</span>
                        <span className="font-semibold">€15.000 - €50.000</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Verloren productiviteit</span>
                        <span className="font-semibold">€25.000 - €100.000</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Reputatieschade</span>
                        <span className="font-semibold">€50.000 - €500.000</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Compliance boetes</span>
                        <span className="font-semibold">€20.000 - €20.000.000</span>
                      </li>
                      <li className="flex justify-between border-t pt-3">
                        <span className="font-bold">Totaal risico:</span>
                        <span className="font-bold text-red-600 dark:text-red-400">€110.000 - €20.650.000</span>
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
                <Card className="border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-600 dark:text-green-400">Workflo Backup & DR</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex justify-between">
                        <span>Setup & configuratie</span>
                        <span className="font-semibold">€0 (gratis)</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Maandelijke kosten</span>
                        <span className="font-semibold">€150 - €500</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Recovery kosten</span>
                        <span className="font-semibold">€0 (inbegrepen)</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Gemoedsrust</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">Onbetaalbaar</span>
                      </li>
                      <li className="flex justify-between border-t pt-3">
                        <span className="font-bold">Jaarlijkse kosten:</span>
                        <span className="font-bold text-green-600 dark:text-green-400">€1.800 - €6.000</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <Card className="inline-block bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30">
                <CardContent className="p-6">
                  <p className="text-2xl font-bold mb-2">Bespaar tot 99.7% op disaster recovery kosten</p>
                  <p className="text-muted-foreground">Plus de zekerheid dat je bedrijf altijd doorloopt</p>
                </CardContent>
              </Card>
            </motion.div>
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
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-8">
                <blockquote className="text-lg text-muted-foreground italic mb-4 leading-relaxed">
                  "Toen onze server crashte door een stroomstoring, dachten we dat we alles kwijt waren. 
                  Dankzij Workflo's backup oplossing hadden we binnen 3 uur alles weer online. 
                  Hun disaster recovery service heeft ons letterlijk gered van het faillissement."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Rob van der Meer</p>
                    <p className="text-sm text-muted-foreground">Eigenaar, Amsterdam Legal Services</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white relative overflow-hidden">
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
            <h2 className="text-4xl font-bold mb-4">Test Je Huidige Backup - Gratis Health Check</h2>
            <p className="text-xl mb-8 opacity-90">
              Weet je zeker dat je huidige backup werkt als je het nodig hebt?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link href="/tevredenheidscheck">
                  Gratis Backup Test <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <div className="text-white">
                <p className="text-sm opacity-90">Of bel voor noodherstel:</p>
                <a href="tel:020-3080465" className="text-lg font-bold hover:underline">020-30 80 465</a>
              </div>
            </div>
            <p className="text-sm opacity-75 mt-6">
              ✓ Geen verplichtingen • ✓ Resultaten binnen 24 uur • ✓ Concrete aanbevelingen
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
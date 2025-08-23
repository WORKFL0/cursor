'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Zap, TrendingUp, Euro, Clock, CheckCircle, ArrowRight, Users, Settings, BarChart3, AlertTriangle, Lock, TrendingDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import DangerTape from '@/components/shared/danger-tape'

export default function ManagedITPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5"
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
              Amsterdam's #1 Managed IT Services
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Managed IT Services Amsterdam: Zet Problemen Om in Winst
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Elk uur dat je team vecht met technologie is een uur niet besteed aan groei van je bedrijf. 
              Amsterdamse bedrijven verspillen gemiddeld 8% van werktijd aan IT-problemen – dat is 
              €19 miljard verlies jaarlijks in heel Nederland. <span className="font-semibold text-primary">Workflo elimineert deze verspilling volledig.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/tevredenheidscheck">
                  Bereken Je IT-Besparing <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="/prijzen">
                  Bekijk Transparante Prijzen
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Urgency Alert Section */}
      <section className="py-8 bg-red-50 dark:bg-red-950/20 border-y-4 border-red-200 dark:border-red-800 relative overflow-hidden">
        <DangerTape variant="warning" className="absolute top-0 left-0 right-0" />
        <DangerTape variant="warning" className="absolute bottom-0 left-0 right-0" />
        <div className="container mx-auto px-4 relative z-10">
          <Alert className="bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-700">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-900 dark:text-red-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-lg mb-1">⚠️ WAARSCHUWING: Cybercriminaliteit in Amsterdam stijgt met 300% in 2024</p>
                  <p className="text-sm">43% van Nederlandse MKB bedrijven werd vorig jaar gehackt. Gemiddelde schade: €2.4 miljoen. Is jouw bedrijf beschermd?</p>
                </div>
                <Button variant="destructive" size="sm" asChild className="whitespace-nowrap">
                  <Link href="#security-package">
                    Test Je Beveiliging Nu
                  </Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {[
              { icon: TrendingDown, label: "Downtime Kost", value: "€5.600/uur", subtext: "Voor gemiddeld MKB bedrijf" },
              { icon: Lock, label: "Ransomware Aanvallen", value: "+87%", subtext: "Toename in Amsterdam 2024" },
              { icon: AlertTriangle, label: "Zonder MSP", value: "6x", subtext: "Meer kans op data verlies" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card dark:bg-gray-900 p-4 rounded-lg shadow-md border border-red-200 dark:border-red-800"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                    <stat.icon className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stat.value}</p>
                    <p className="text-sm font-medium text-foreground dark:text-gray-100">{stat.label}</p>
                    <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                  </div>
                </div>
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
            <h2 className="text-3xl font-bold mb-4">Wat Je Krijgt met Workflo Managed IT</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Complete IT-ondersteuning die je bedrijf doet groeien in plaats van vertragen
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Shield,
                title: "24/7 Proactieve Monitoring",
                description: "Onze geavanceerde AI-gestuurde monitoring detecteert en lost 94% van problemen op voordat ze impact hebben op je bedrijf. Je team blijft productief terwijl wij problemen geruisloos op de achtergrond oplossen.",
                stat: "Gemiddelde detectietijd: 47 seconden"
              },
              {
                icon: Zap,
                title: "4-Uur Reactiegarantie",
                description: "Tijdens kantooruren garanderen we reactie binnen 4 uur. Kritieke problemen krijgen onmiddellijke aandacht met 15-minuten noodrespons.",
                stat: "Werkelijk gemiddelde: 1,7 uur"
              },
              {
                icon: TrendingUp,
                title: "Strategische IT-Planning",
                description: "Kwartaalreviews zorgen ervoor dat je technologie-roadmap aansluit bij groeistrategie. We plannen proactief upgrades, voorkomen knelpunten en schalen mee met je.",
                stat: "ROI op strategische planning: 3,2x"
              },
              {
                icon: Euro,
                title: "Vaste Maandelijkse Prijzen",
                description: "Geen verrassingen, geen verborgen kosten. Één voorspelbare maandprijs dekt onbeperkte support, alle monitoring en strategische planning. Budgetteer met vertrouwen.",
                stat: "Gemiddelde besparing: €1.850/maand"
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
                    <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-4 leading-relaxed">
                      {benefit.description}
                    </CardDescription>
                    <Badge variant="secondary" className="text-primary font-medium">
                      {benefit.stat}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Resultaten Die Je Kunt Verwachten</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Bewezen resultaten van 100+ Amsterdamse bedrijven
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { stat: "95%", label: "Reductie in IT-gerelateerde uitval" },
              { stat: "40%", label: "Verlaging van IT-operationele kosten" },
              { stat: "60%", label: "Verbetering in medewerkersproductiviteit" },
              { stat: "100%", label: "Gemoedsrust wetende dat IT gewoon werkt" }
            ].map((result, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-primary mb-2">{result.stat}</div>
                <p className="text-muted-foreground">{result.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Hoe Workflo Managed IT Werkt</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Van eerste contact tot continue ondersteuning - je reis naar zorgeloze IT
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Gratis IT-Assessment",
                  description: "We analyseren je huidige IT-infrastructuur, identificeren zwakke punten en creëren een op maat gemaakt verbeterplan afgestemd op je bedrijfsbehoeften."
                },
                {
                  step: "2", 
                  title: "Naadloze Onboarding",
                  description: "Ons team neemt je IT-beheer over zonder verstoring. We documenteren alles, implementeren monitoring en beginnen direct met optimaliseren."
                },
                {
                  step: "3",
                  title: "Continue Verbetering", 
                  description: "We onderhouden, monitoren en verbeteren je systemen proactief. Regelmatige rapportages houden je geïnformeerd terwijl wij alle technische details afhandelen."
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
      <section className="py-16 bg-background">
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
                  "De overstap naar Workflo's managed IT-diensten verminderde onze IT-kosten met 45% en gaf ons de 
                  flexibiliteit om onze tweede Amsterdam-locatie te openen zonder IT-hoofdpijn. 
                  Hun proactieve aanpak betekent dat we al 18 maanden geen enkele IT-noodsituatie hebben gehad."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Petra Janssen</p>
                    <p className="text-sm text-muted-foreground">CEO, Janssen Architectuur</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Security Package Selection */}
      <section id="security-package" className="py-20 bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
        <DangerTape variant="alert" className="absolute top-0 left-0 right-0" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="destructive" className="mb-4 text-lg px-4 py-2">
              🚨 ACTIE VEREIST: Kies Je Beschermingsniveau Nu 🚨
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Welk Niveau van Bescherming Past Bij Jouw Bedrijf?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Elke dag zonder professionele MSP-bescherming is een gok met je bedrijfscontinuïteit. 
              Kies nu je pakket en krijg <span className="text-yellow-400 font-bold">direct 24/7 bescherming</span>.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Remote Support Package */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gray-800 border-2 border-gray-700 hover:border-yellow-400 transition-all duration-300 h-full">
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-blue-600 text-white">Meest Gekozen</Badge>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-white">€60</p>
                      <p className="text-sm text-muted-foreground">per gebruiker/maand</p>
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-white">Remote Support</CardTitle>
                  <CardDescription className="text-gray-300">
                    Complete IT-ondersteuning op afstand voor moderne bedrijven
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-yellow-900/30 border border-yellow-600 rounded-lg">
                    <p className="text-yellow-400 text-sm font-semibold">
                      ⚡ Perfecte bescherming tegen: Phishing, Malware, Downtime
                    </p>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "24/7 Monitoring & Alerting",
                      "Remote Support (4-uur SLA)",
                      "Antivirus & Anti-malware",
                      "Email Security & Spam Filter",
                      "Microsoft 365 Beheer",
                      "Backup & Recovery (dagelijks)",
                      "Patch Management",
                      "Maandelijkse Security Rapporten"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold" size="lg">
                    <Link href="/prijzen?type=remote">
                      Bereken Je Investering →
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Onsite Support Package */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-yellow-900/20 to-gray-800 border-2 border-yellow-600 hover:border-yellow-400 transition-all duration-300 relative h-full">
                <div className="absolute -top-1 -right-1">
                  <Badge className="bg-red-600 text-white animate-pulse">
                    Maximum Bescherming
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-yellow-600 text-black">Enterprise Grade</Badge>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-white">€90</p>
                      <p className="text-sm text-muted-foreground">per gebruiker/maand</p>
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-white">Onsite + Remote Support</CardTitle>
                  <CardDescription className="text-gray-300">
                    Complete bescherming met fysieke aanwezigheid wanneer nodig
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-900/30 border border-green-600 rounded-lg">
                    <p className="text-green-400 text-sm font-semibold">
                      🛡️ Totale bescherming + Onsite response bij kritieke issues
                    </p>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "ALLES van Remote Support PLUS:",
                      "Wekelijkse onsite bezoeken",
                      "2-uur SLA voor kritieke issues",
                      "Hardware installatie & beheer",
                      "Netwerk optimalisatie",
                      "Persoonlijke IT-consultant",
                      "Disaster Recovery Planning",
                      "Compliance & Security Audits",
                      "Prioriteit 24/7 noodlijn"
                    ].map((feature, i) => (
                      <li key={i} className={`flex items-center gap-2 ${i === 0 ? 'text-yellow-400 font-bold' : 'text-gray-300'}`}>
                        <CheckCircle className={`w-5 h-5 ${i === 0 ? 'text-yellow-500' : 'text-green-500'} flex-shrink-0`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold" size="lg">
                    <Link href="/prijzen?type=onsite">
                      Start Premium Bescherming →
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Urgency Stats */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 p-6 bg-red-900/20 border border-red-600 rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              {[
                { label: "Bedrijven gehackt vandaag", value: "127", icon: AlertTriangle },
                { label: "Gemiddelde downtime", value: "21 uur", icon: Clock },
                { label: "Data verlies risico", value: "67%", icon: TrendingDown },
                { label: "Herstelkosten", value: "€45.000+", icon: Euro }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <stat.icon className="w-6 h-6 text-red-400 mb-2" />
                  <p className="text-2xl font-bold text-red-400">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
            <p className="text-center mt-4 text-yellow-400 font-semibold">
              ⏰ Elke minuut zonder bescherming verhoogt je risico. Activeer je MSP-schild vandaag nog.
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
            <h2 className="text-4xl font-bold mb-4">Stop Met Vechten Tegen IT-Problemen. Begin Met Groeien Van Je Bedrijf.</h2>
            <p className="text-xl mb-8 opacity-90">Sluit je aan bij 100+ Amsterdamse bedrijven die Workflo vertrouwen voor hun IT</p>
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link href="/tevredenheidscheck">
                Plan Je Gratis IT-Assessment <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, AlertTriangle, Eye, GraduationCap, RefreshCw, ArrowRight, CheckCircle, Users, Lock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { VideoBackground, VideoSets } from '@/components/shared/video-background'

export default function CybersecurityPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 bg-gradient-to-br from-destructive/5 via-background to-warning/5 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <VideoBackground 
          videos={VideoSets.security} 
          opacity={0.1} 
          overlay={true}
        />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-destructive via-warning to-destructive"></div>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="destructive" className="mb-4 animate-pulse">
              🚨 Kritieke Bedreiging Alert
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Cybersecurity Amsterdam: Stop Aanvallen Voordat Ze Beginnen
            </h1>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-8"
            >
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30 max-w-3xl mx-auto">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <AlertTitle className="text-red-800 dark:text-red-400 font-bold">
                  🚨 Waarschuwing: 39% van Nederlandse bedrijven werd aangevallen in 2023.
                </AlertTitle>
                <AlertDescription className="text-red-700 dark:text-red-300">
                  Kleine bedrijven zijn primaire doelwitten omdat criminelen weten dat je minder bescherming hebt. 
                  <strong> Elke 11 seconden</strong> valt een ander bedrijf ten prooi aan ransomware.
                  <br /><br />
                  De gemiddelde aanval kost Nederlandse MKB-bedrijven <strong>€2,8 miljoen</strong>. Kan je bedrijf dat overleven?
                </AlertDescription>
              </Alert>
            </motion.div>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Stel je voor dat je morgen je kantoor binnenloopt en al je data versleuteld aantreft door 
              ransomware. Je klantendatabase, financiële records, jaren werk – allemaal gegijzeld. 
              Voor veel Amsterdamse bedrijven wordt deze nachtmerrie werkelijkheid.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" variant="destructive" className="text-lg px-8 py-6 animate-pulse">
                <Link href="/tevredenheidscheck">
                  Krijg Gratis Security Scan Nu <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="text-muted-foreground text-sm">
                <strong>Tijd is kritiek:</strong> Onbeschermd voor 30+ dagen? Je bent waarschijnlijk al gecompromitteerd.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Threat Landscape */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">De Groeiende Bedreiging voor Amsterdamse MKB</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cijfers liegen niet - cybercriminaliteit neemt explosief toe
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { stat: "€2.8M", label: "Gemiddelde kosten van een datalek voor Nederlandse MKB" },
              { stat: "43%", label: "Van cyberaanvallen richt zich op kleine bedrijven" },
              { stat: "60%", label: "Van MKB-bedrijven sluit binnen 6 maanden na een cyberaanval" }
            ].map((threat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow border-red-200 dark:border-red-800">
                  <CardContent className="p-8">
                    <div className="text-4xl font-bold text-red-500 mb-2">{threat.stat}</div>
                    <p className="text-muted-foreground">{threat.label}</p>
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
            <h2 className="text-3xl font-bold mb-4">Meerlaagse Beveiliging Die Echt Werkt</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Geen enkele beveiligingslaag is perfect - daarom gebruiken we er vele
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Geavanceerde Bedreigingsbescherming",
                features: [
                  "Next-generation firewall bescherming",
                  "Real-time bedreigingsdetectie en -respons",
                  "Geavanceerde email beveiliging en filtering",
                  "Endpoint bescherming voor alle apparaten"
                ]
              },
              {
                icon: Eye,
                title: "24/7 Security Monitoring",
                features: [
                  "24-uurs security operations center",
                  "Onmiddellijke bedreigingsrespons en -insluiting",
                  "Security incident onderzoek",
                  "Maandelijkse security rapporten en briefings"
                ]
              },
              {
                icon: GraduationCap,
                title: "Medewerker Security Training",
                features: [
                  "Phishing awareness training",
                  "Security best practices workshops",
                  "Reguliere security testing en oefeningen",
                  "Aangepaste security policies voor je bedrijf"
                ]
              },
              {
                icon: RefreshCw,
                title: "Snelle Recovery Oplossingen",
                features: [
                  "Geautomatiseerde backup en disaster recovery",
                  "Gegarandeerde recovery time objectives",
                  "Reguliere recovery testing",
                  "Business continuity planning"
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
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg mb-4 flex items-center justify-center">
                      <solution.icon className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="text-xl">{solution.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          {feature}
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

      {/* Security Guarantee */}
      <section className="py-16 bg-gradient-to-r from-orange-400 to-red-500 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6">De €50.000 Workflo Security Garantie</h2>
            <Card className="text-foreground shadow-lg">
              <CardContent className="p-8">
                <p className="text-2xl font-bold mb-4">
                  We zijn zo zeker van onze zaak, dat we ons geld inzetten:
                </p>
                <p className="text-lg mb-6 text-muted-foreground">
                  Als je succesvol wordt aangevallen terwijl je onder onze volledige bescherming staat, 
                  dekken wij de herstelkosten tot <span className="text-3xl font-bold text-primary">€50.000</span>
                </p>
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    ✓ Inclusief dataherstel • ✓ Bedrijfsonderbreking kosten • ✓ Juridische kosten
                  </p>
                </div>
              </CardContent>
            </Card>
            <div className="bg-black/20 backdrop-blur rounded-lg p-6 mt-6 inline-block">
              <p className="text-lg font-bold">Geen andere Amsterdam IT-provider durft deze garantie aan te bieden.</p>
              <p className="text-sm mt-2 opacity-90">Vraag je huidige provider of ze dit kunnen evenaren. (Spoiler: Dat kunnen ze niet)</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">GDPR & Compliance Eenvoudig Gemaakt</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nederlandse bedrijven hebben te maken met strikte GDPR-eisen. Wij zorgen ervoor dat je IT-infrastructuur 
              voldoet aan alle regelgevingseisen en beschermen je tegen boetes tot €20 miljoen.
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
                      Wat Wij Afhandelen:
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      {[
                        "Data protection impact assessments",
                        "Privacy by design implementatie",
                        "Datalek notificatie procedures",
                        "Right to erasure compliance",
                        "Reguliere compliance audits"
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
              
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Sectoren Waarin Wij Specialist Zijn:
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      {[
                        "Financiële diensten (AFM compliance)",
                        "Gezondheidszorg (NEN 7510)",
                        "Juridische diensten (cliënt vertrouwelijkheid)",
                        "E-commerce (PCI DSS)",
                        "Professionele diensten"
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
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-8">
                <blockquote className="text-lg text-muted-foreground italic mb-4 leading-relaxed">
                  "Workflo transformeerde onze compliance nachtmerrie in een concurrentievoordeel. GDPR 
                  compliance ging van onze grootste zorg naar iets waar we niet eens meer aan denken. 
                  Hun security monitoring onderschepte drie pogingen tot inbraak vorig jaar – allemaal gestopt voordat 
                  er schade werd aangericht."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Marcus van den Berg</p>
                    <p className="text-sm text-muted-foreground">CFO, Amsterdam Financial Partners</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-600 text-white relative overflow-hidden">
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
            className="max-w-3xl mx-auto"
          >
            <p className="text-red-200 font-bold text-lg mb-4 animate-pulse">⚠️ KRITIEKE SECURITY ALERT ⚠️</p>
            <h2 className="text-4xl font-bold mb-4">Elke Dag Dat Je Wacht Verhoogt Je Risico Met 3%</h2>
            <p className="text-xl mb-4">Op dit moment zouden hackers in je netwerk kunnen zitten. Je weet het alleen nog niet.</p>
            <p className="text-lg mb-8 text-orange-200">
              <strong>Beperkte Tijd:</strong> Gratis €2.500 Security Audit + Onmiddellijk Bedreigingsrapport
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 animate-pulse">
                <Link href="/tevredenheidscheck">
                  Scan Mijn Netwerk Nu <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <div className="text-white">
                <p className="text-sm">Of bel onze noodlijn:</p>
                <a href="tel:020-3080465" className="text-orange-200 font-bold text-lg hover:underline">020-30 80 465</a>
              </div>
            </div>
            <p className="text-sm text-orange-200 mt-6">
              ✓ Resultaten in 2 minuten • ✓ Geen software installatie • ✓ 100% vertrouwelijk
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { 
  Scan, 
  FileText, 
  TrendingUp, 
  Shield, 
  ChevronRight,
  CheckCircle2,
  Network,
  ClipboardCheck,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/contexts/language-context'

export default function NetworkScanOffer() {
  const { language } = useLanguage()
  
  const benefits = language === 'nl' ? [
    'Volledig inzicht in jouw huidige IT-infrastructuur',
    'Professioneel adviesrapport op maat',
    'Geen verborgen kosten of verplichtingen',
    'Directe verbeterpunten voor optimalisatie',
    'Beveiligingsrisico\'s direct in kaart',
    'ROI-berekening voor voorgestelde verbeteringen'
  ] : [
    'Complete insight into your current IT infrastructure',
    'Professional custom advisory report',
    'No hidden costs or obligations',
    'Immediate optimization opportunities',
    'Security risks mapped instantly',
    'ROI calculation for proposed improvements'
  ]
  
  const process = language === 'nl' ? [
    {
      icon: Scan,
      title: 'Wij maken een afspraak voor een netwerk-scan',
      description: 'We komen langs voor een gratis gesprek. Geen verplichtingen. We kijken naar je huidige situatie en maken een netwerk-scan om te zien wat voor vlees jullie in de kuip hebben.'
    },
    {
      icon: FileText,
      title: 'Wij maken een advies aan de hand van onze scan',
      description: 'Ga je met dit advies liever naar een ander, geen probleem! Dan rekenen we 2 uur voor de moeite van het maken van dit rapport en het gemaakte advies. Als je akkoord gaat, vervallen deze kosten en regelen wij alles.'
    },
    {
      icon: CheckCircle2,
      title: 'Je werkt zorgeloos verder!',
      description: 'Vanaf dat moment zorgen wij dat alles werkt. Zorgen wij dat alles veilig is en blijft. Voor een vaste prijs per maand. Geen verrassingen, geen gedoe.'
    }
  ] : [
    {
      icon: Scan,
      title: 'We make an appointment for a network scan',
      description: 'We visit for a free consultation. No obligations. We look at your current situation and perform a network scan to assess your current IT setup.'
    },
    {
      icon: FileText,
      title: 'We create advice based on our scan',
      description: 'Prefer to take our advice to someone else? No problem! We charge 2 hours for the effort of creating the report and advice. If you agree to work with us, these costs are waived and we arrange everything.'
    },
    {
      icon: CheckCircle2,
      title: 'You work worry-free!',
      description: 'From that moment we ensure everything works and stays safe and secure. For a fixed price per month. No surprises, no hassle.'
    }
  ]
  
  return (
    <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
      {/* LinkedIn Header Banner Background */}
      <div className="absolute top-0 left-0 right-0 h-40 overflow-hidden opacity-10">
        <img 
          src="/images/workflo-linkedin-header.jpg"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              {language === 'nl' ? 'Exclusief Aanbod' : 'Exclusive Offer'}
            </Badge>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {language === 'nl' 
                ? 'Ontdek de Kracht van Jouw IT met Onze Gratis Netwerk-Scan' 
                : 'Discover Your IT\'s Potential with Our Free Network Scan'}
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {language === 'nl'
                ? 'Krijg volledig inzicht in jouw IT-infrastructuur met onze professionele netwerk-scan. Ontvang een uitgebreid rapport met concrete verbeterpunten - geheel vrijblijvend en zonder verplichtingen.'
                : 'Get complete insight into your IT infrastructure with our professional network scan. Receive a comprehensive report with concrete improvements - completely free and without obligations.'}
            </p>
          </motion.div>
          
          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left: Process */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold mb-6">
                {language === 'nl' ? 'Zo werkt het - In 3 simpele stappen naar zorgeloze IT' : 'How it works - In 3 simple steps to worry-free IT'}
              </h3>
              
              {process.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
                      <step.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">{index + 1}</span>
                      <h4 className="font-semibold text-lg">{step.title}</h4>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
              
              {/* Special Note */}
              <Card className="p-6 bg-primary/5 border-primary/20 mt-8">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm">
                      <span className="font-semibold">
                        {language === 'nl' ? 'Eerlijke Deal: ' : 'Fair Deal: '}
                      </span>
                      {language === 'nl'
                        ? 'Kies je ervoor om ons advies door een andere partij te laten uitvoeren? Dan rekenen we slechts 2 uurtjes voor onze tijd en expertise. Ga je met ons in zee? Dan vervallen deze kosten volledig en tillen we samen jouw IT naar een hoger niveau.'
                        : 'Choose to have our advice implemented by another party? We only charge 2 hours for our time and expertise. Partner with us? These costs are completely waived and we\'ll elevate your IT together.'}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            {/* Right: Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <Network className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-bold">
                  {language === 'nl' ? 'Wat Je Krijgt' : 'What You Get'}
                </h3>
              </div>
              
              <ul className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
              
              <div className="bg-primary/10 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardCheck className="w-5 h-5 text-primary" />
                  <span className="font-semibold">
                    {language === 'nl' ? 'Inclusief:' : 'Includes:'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'nl'
                    ? 'Uitgebreid rapport (15-20 pagina\'s) met hardware inventaris, software licenties, beveiligingsstatus, prestatie-analyse en concrete verbetervoorstellen met ROI-berekening.'
                    : 'Comprehensive report (15-20 pages) with hardware inventory, software licenses, security status, performance analysis and concrete improvement proposals with ROI calculation.'}
                </p>
              </div>
              
              <Button asChild size="lg" className="w-full">
                <Link href="/contact">
                  {language === 'nl' ? 'Vraag Gratis Scan Aan' : 'Request Free Scan'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
          
          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-4">
              {language === 'nl' 
                ? 'Klaar om Jouw IT-Potentieel te Ontdekken?' 
                : 'Ready to Discover Your IT Potential?'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {language === 'nl'
                ? 'Sluit je aan bij 100+ Amsterdamse bedrijven die al profiteren van geoptimaliseerde IT. Start vandaag nog met jouw gratis netwerk-scan.'
                : 'Join 100+ Amsterdam businesses already benefiting from optimized IT. Start with your free network scan today.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="default">
                <Link href="/contact">
                  {language === 'nl' ? 'Start Gratis Scan' : 'Start Free Scan'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/diensten">
                  {language === 'nl' ? 'Bekijk Onze Diensten' : 'View Our Services'}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
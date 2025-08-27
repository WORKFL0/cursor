'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle, Shield, Monitor, Headphones, Calendar, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { homePageData } from '@/lib/data/workflo-data'
import { useLanguage, useLocalizedContent } from '@/lib/contexts/language-context'
import ClientLogos from '@/components/sections/ClientLogos'
import { TestimonialsCarousel } from '@/components/testimonials/testimonials-carousel'
import { getFeaturedTestimonials } from '@/lib/data/testimonials-data'
import DangerTape, { DangerTapeSection, EmergencyAlert } from '@/components/shared/danger-tape'
import { VideoBackground, VideoSets } from '@/components/shared/video-background'

export default function HomePage() {
  const { language } = useLanguage()
  const { getLocalizedValue } = useLocalizedContent()

  const services = [
    {
      title: 'Je computers werken',
      titleEN: 'Your computers work',
      description: 'Laptops, computers en printers die gewoon doen wat ze moeten doen. Zonder crashes, zonder gedoe.',
      descriptionEN: 'Laptops, computers and printers that simply do what they should. No crashes, no hassle.',
      icon: Monitor,
      features: [
        { nl: 'Updates automatisch', en: 'Automatic updates' },
        { nl: 'Problemen oplossen voordat je ze merkt', en: 'Solve problems before you notice them' }
      ]
    },
    {
      title: 'Je gegevens zijn veilig', 
      titleEN: 'Your data is secure',
      description: 'Automatische backups en bescherming tegen virussen. Je belangrijke bestanden zijn altijd veilig.',
      descriptionEN: 'Automatic backups and virus protection. Your important files are always safe.',
      icon: Shield,
      features: [
        { nl: 'Dagelijkse backup van je bestanden', en: 'Daily backup of your files' },
        { nl: 'Bescherming tegen virussen', en: 'Virus protection' }
      ]
    },
    {
      title: 'Hulp als je het nodig hebt',
      titleEN: 'Help when you need it', 
      description: 'Een probleem? Wij lossen het op. Vaak op afstand, soms komen we langs. Altijd snel.',
      descriptionEN: 'A problem? We solve it. Often remotely, sometimes we visit. Always fast.',
      icon: Headphones,
      features: [
        { nl: 'Hulp binnen 1 uur', en: 'Help within 1 hour' },
        { nl: 'Geen ingewikkelde taal', en: 'No complicated language' }
      ]
    }
  ]

  const steps = [
    {
      number: 1,
      title: 'Wij maken een afspraak voor een netwerk-scan',
      titleEN: 'We make an appointment for a network scan',
      description: 'We komen langs voor een gratis gesprek. Geen verplichtingen. We kijken naar je huidige situatie en maken een netwerk-scan om te zien wat voor vlees jullie in de kuip hebben.',
      descriptionEN: 'We visit for a free consultation. No obligations. We look at your current situation and perform a network scan to assess your current IT setup.',
      icon: 'calendar'
    },
    {
      number: 2,
      title: 'Wij maken een advies aan de hand van onze scan',
      titleEN: 'We create advice based on our scan', 
      description: 'Ga je met dit advies liever naar een ander, geen probleem! Dan rekenen we 2 uur voor de moeite van het maken van dit rapport en het gemaakte advies. Als je akkoord gaat, vervallen deze kosten en regelen wij alles. Nieuwe apparaten, software, beveiliging. Je hoeft je nergens zorgen over te maken.',
      descriptionEN: 'Prefer to take our advice to someone else? No problem! We charge 2 hours for the effort of creating the report and advice. If you agree to work with us, these costs are waived and we arrange everything. New devices, software, security. You don\'t have to worry about anything.',
      icon: 'filetext'
    },
    {
      number: 3,
      title: 'Je werkt zorgeloos verder!',
      titleEN: 'You work worry-free!',
      description: 'Vanaf dat moment zorgen wij dat alles werkt. Zorgen wij dat alles veilig is en blijft. Voor een vaste prijs per maand. Geen verrassingen, geen gedoe.',
      descriptionEN: 'From that moment we ensure everything works. We ensure everything stays safe and secure. For a fixed price per month. No surprises, no hassle.',
      icon: 'checkcircle'
    }
  ]

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-workflo-yellow-light via-yellow-50 to-background overflow-hidden min-h-[60vh] sm:min-h-[70vh] flex items-center">
        {/* Background Video */}
        <VideoBackground 
          videos={VideoSets.hero} 
          opacity={0.1} 
          overlay={true}
        />
        
        {/* Yellow accent gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-workflo-yellow/10 via-transparent to-yellow-100/20 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 w-full">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 text-foreground leading-tight">
              {language === 'nl' ? 'Wij regelen je IT' : 'We handle your IT'}
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
              {language === 'nl' 
                ? 'Zodat je je kunt focussen op je bedrijf. Simpel, betrouwbaar, zonder gedoe.'
                : 'So you can focus on your business. Simple, reliable, hassle-free.'
              }
            </p>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2">
              {language === 'nl'
                ? 'Geen ingewikkelde verhalen. Wij zorgen dat je computers, internet en systemen gewoon werken. Altijd. Voor een vaste prijs per maand.'
                : 'No complicated stories. We ensure your computers, internet and systems just work. Always. For a fixed price per month.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button size="lg" asChild variant="workflo" className="w-full sm:w-auto text-sm sm:text-base shadow-xl shadow-workflo-yellow/30 hover:shadow-2xl hover:shadow-workflo-yellow/40 transition-all duration-300">
                <Link href="/contact">
                  {language === 'nl' ? 'Plan mijn gratis IT-scan' : 'Schedule my free IT assessment'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" asChild variant="outline" className="w-full sm:w-auto text-sm sm:text-base border-workflo-yellow/50 hover:bg-workflo-yellow/10 hover:border-workflo-yellow transition-all duration-300">
                <Link href="/prijzen">
                  {language === 'nl' ? 'Bekijk prijzen' : 'View pricing'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos Section */}
      <ClientLogos />

      {/* Services Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-workflo-yellow-light/30 via-yellow-50/20 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {language === 'nl' ? 'Wat wij voor je doen' : 'What we do for you'}
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                {language === 'nl' 
                  ? 'Alles wat je nodig hebt om zorgeloos te kunnen werken'
                  : 'Everything you need to work worry-free'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((service, index) => (
                <Card key={index} className="bg-card/90 backdrop-blur-sm rounded-xl shadow-lg border-2 border-border hover:border-workflo-yellow hover:bg-workflo-yellow-light/20 transition-all duration-300 hover:shadow-xl hover:shadow-workflo-yellow/20 hover:-translate-y-1">
                  <CardHeader className="p-4 sm:p-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-workflo-yellow to-workflo-yellow-dark rounded-xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-workflo-yellow/30">
                      <service.icon className="w-6 h-6 sm:w-8 sm:h-8 text-workflo-black drop-shadow-sm" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-4 leading-tight">
                      {language === 'nl' ? service.title : service.titleEN}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
                      {language === 'nl' ? service.description : service.descriptionEN}
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{language === 'nl' ? feature.nl : feature.en}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency IT Alert */}
      <EmergencyAlert 
        message={language === 'nl' ? 'IT PROBLEMEN? DIRECT HULP BESCHIKBAAR' : 'IT PROBLEMS? IMMEDIATE HELP AVAILABLE'}
        action={
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => window.open('tel:+31203080465', '_self')}
            className="bg-card text-destructive hover:bg-muted font-bold"
          >
            {language === 'nl' ? 'BEL NU' : 'CALL NOW'}
          </Button>
        }
      />

      {/* How It Works Section */}
      <DangerTapeSection 
        title={language === 'nl' ? 'Zo werkt het' : 'How it works'}
        subtitle={language === 'nl' ? 'In 3 simpele stappen naar zorgeloze IT' : 'In 3 simple steps to worry-free IT'}
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            <div className="space-y-8">
              {steps.map((step, index) => {
                const iconMap = {
                  'calendar': Calendar,
                  'filetext': FileText,
                  'checkcircle': CheckCircle
                }
                const IconComponent = iconMap[step.icon as keyof typeof iconMap] || CheckCircle
                
                return (
                  <div key={index} className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-workflo-yellow to-workflo-yellow-dark rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-workflo-yellow/30">
                      <IconComponent className="w-8 h-8 text-workflo-black" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 bg-workflo-yellow rounded-full flex items-center justify-center text-workflo-black font-bold text-sm">{step.number}</span>
                        <h3 className="text-2xl font-bold text-foreground">
                          {language === 'nl' ? step.title : step.titleEN}
                        </h3>
                      </div>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {language === 'nl' ? step.description : step.descriptionEN}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" asChild variant="workflo" className="shadow-xl shadow-workflo-yellow/40 hover:shadow-2xl hover:shadow-workflo-yellow/50 font-semibold transition-all duration-300 hover:scale-105">
                <Link href="/contact">
                  {language === 'nl' ? 'Start gratis gesprek' : 'Start free consultation'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DangerTapeSection>

      {/* Tech Excellence Section */}
      <section className="relative py-20 bg-gradient-to-br from-workflo-yellow-light/20 via-yellow-100/30 to-workflo-yellow-light/10 overflow-hidden">
        <VideoBackground 
          videos={VideoSets.code} 
          opacity={0.08} 
          overlay={true}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              {language === 'nl' ? 'Technologie die Werkt' : 'Technology that Works'}
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              {language === 'nl' 
                ? 'Wij gebruiken de nieuwste technologieën om jouw IT-infrastructuur toekomstbestendig te maken'
                : 'We use the latest technologies to future-proof your IT infrastructure'
              }
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Proactieve Monitoring',
                  titleEN: 'Proactive Monitoring',
                  description: 'AI-gestuurde systemen die problemen oplossen voordat je ze merkt',
                  descriptionEN: 'AI-driven systems that solve problems before you notice them',
                  icon: '🤖'
                },
                {
                  title: 'Cloud-First Aanpak',
                  titleEN: 'Cloud-First Approach',
                  description: 'Moderne cloud oplossingen voor maximale flexibiliteit en schaalbaarheid',
                  descriptionEN: 'Modern cloud solutions for maximum flexibility and scalability',
                  icon: '☁️'
                },
                {
                  title: 'Zero-Trust Security',
                  titleEN: 'Zero-Trust Security',
                  description: 'Geavanceerde beveiliging die elke toegang verifieert en beschermt',
                  descriptionEN: 'Advanced security that verifies and protects every access',
                  icon: '🛡️'
                }
              ].map((feature, index) => (
                <Card key={index} className="bg-card/90 backdrop-blur-sm border-workflo-yellow/20 hover:border-workflo-yellow hover:bg-workflo-yellow-light/30 hover:shadow-xl hover:shadow-workflo-yellow/20 transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4 filter drop-shadow-sm">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {language === 'nl' ? feature.title : feature.titleEN}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'nl' ? feature.description : feature.descriptionEN}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-yellow-50/50 via-workflo-yellow-light/20 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {language === 'nl' ? 'Wat kost het?' : 'What does it cost?'}
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                {language === 'nl' ? 'Transparante prijzen per gebruiker/werkplek' : 'Transparent pricing per user/workplace'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
              {/* Remote Support Plan */}
              <div className="bg-card/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-workflo-yellow/30 hover:border-workflo-yellow hover:bg-workflo-yellow-light/10 hover:shadow-2xl hover:shadow-workflo-yellow/20 transition-all duration-300 hover:-translate-y-2">
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    {language === 'nl' ? 'Remote Support' : 'Remote Support'}
                  </h3>
                  <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                    €60
                    <span className="text-base sm:text-lg text-muted-foreground font-normal block sm:inline">
                      {language === 'nl' ? '/maand per gebruiker' : '/month per user'}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {language === 'nl' ? 'Ondersteuning op afstand' : 'Remote assistance'}
                  </p>
                </div>
                
                <div className="space-y-3 text-left mb-8">
                  {(language === 'nl' ? [
                    '24/7 monitoring',
                    'Onbeperkte remote support',
                    'Alle updates en patches',
                    'Virusbeveiliging',
                    'Backup van bestanden',
                    'Responstijd binnen 1 uur'
                  ] : [
                    '24/7 monitoring',
                    'Unlimited remote support',
                    'All updates and patches',
                    'Virus protection',
                    'File backup',
                    'Response time within 1 hour'
                  ]).map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button asChild className="w-full bg-gradient-to-r from-workflo-yellow to-workflo-yellow-dark text-workflo-black hover:from-workflo-yellow-dark hover:to-workflo-yellow shadow-lg shadow-workflo-yellow/30 hover:shadow-xl hover:shadow-workflo-yellow/40 font-semibold transition-all duration-300">
                  <Link href="/contact">
                    {language === 'nl' ? 'Kies Remote Support' : 'Choose Remote Support'}
                  </Link>
                </Button>
              </div>

              {/* Onsite Support Plan */}
              <div className="bg-gradient-to-br from-workflo-yellow-light/40 via-card/95 to-card/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-workflo-yellow relative hover:shadow-2xl hover:shadow-workflo-yellow/30 hover:-translate-y-2 transition-all duration-300">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-workflo-yellow text-foreground px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold border border-border">
                    <span>{language === 'nl' ? '★ POPULAIR' : '★ POPULAR'}</span>
                  </div>
                </div>
                <div className="relative z-10">
                
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    {language === 'nl' ? 'Onsite Support' : 'Onsite Support'}
                  </h3>
                  <div className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                    €90
                    <span className="text-base sm:text-lg text-muted-foreground font-normal block sm:inline">
                      {language === 'nl' ? '/maand per gebruiker' : '/month per user'}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {language === 'nl' ? 'Remote + locatiebezoeken' : 'Remote + on-site visits'}
                  </p>
                </div>
                
                <div className="space-y-3 text-left mb-8">
                  {(language === 'nl' ? [
                    'Alles van Remote Support',
                    'Locatiebezoeken indien nodig',
                    'Hardware onderhoud ter plaatse',
                    'Persoonlijke training',
                    'Prioriteit ondersteuning',
                    'Geen extra kosten voor bezoeken'
                  ] : [
                    'Everything from Remote Support',
                    'On-site visits when needed',
                    'On-site hardware maintenance',
                    'Personal training',
                    'Priority support',
                    'No extra costs for visits'
                  ]).map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button asChild className="w-full shadow-xl shadow-workflo-yellow/40 hover:shadow-2xl hover:shadow-workflo-yellow/50 font-semibold transition-all duration-300" variant="workflo">
                  <Link href="/contact">
                    {language === 'nl' ? 'Kies Onsite Support' : 'Choose Onsite Support'}
                  </Link>
                </Button>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-lg text-muted-foreground mb-4">
                {language === 'nl' 
                  ? 'Meer dan 5 gebruikers? Dan krijg je korting.'
                  : 'More than 5 users? You get a discount.'
                }
              </p>
              <Button variant="outline" asChild className="border-workflo-yellow/60 hover:bg-workflo-yellow/10 hover:border-workflo-yellow transition-all duration-300">
                <Link href="/contact">
                  {language === 'nl' ? 'Vraag offerte op maat aan' : 'Request custom quote'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-workflo-yellow-light/40 via-yellow-100/20 to-workflo-yellow-light/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {language === 'nl' ? 'Wat Onze Klanten Zeggen' : 'What Our Clients Say'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {language === 'nl' 
                ? 'Ontdek waarom bedrijven vertrouwen op Workflo voor hun IT-behoeften'
                : 'Discover why businesses trust Workflo for their IT needs'
              }
            </p>
            <Button asChild variant="outline" className="border-workflo-yellow/60 hover:bg-workflo-yellow/20 hover:border-workflo-yellow transition-all duration-300">
              <Link href="/testimonials">
                {language === 'nl' ? 'Bekijk alle reviews' : 'View all reviews'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <TestimonialsCarousel testimonials={getFeaturedTestimonials()} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-workflo-yellow via-workflo-yellow-dark to-workflo-yellow text-workflo-black">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {homePageData.stats.map((stat, index) => (
                <div key={index} className="hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl lg:text-5xl font-bold text-workflo-black drop-shadow-sm mb-2">{stat.value}</div>
                  <div className="text-sm font-medium opacity-90">
                    {language === 'nl' ? stat.labelNL : stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-workflo-yellow to-workflo-yellow-dark text-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'nl' ? 'Klaar om te beginnen?' : 'Ready to get started?'}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {language === 'nl' 
                ? 'Ontdek hoe wij je IT-partner kunnen worden'
                : 'Discover how we can become your IT partner'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-workflo-black border-workflo-black/20 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/contact">
                  {language === 'nl' ? 'Start een gesprek' : 'Start a conversation'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-workflo-black/30 hover:bg-workflo-black/10 text-workflo-black hover:border-workflo-black/50 font-medium transition-all duration-300">
                <Link href="/diensten">
                  {language === 'nl' ? 'Bekijk onze diensten' : 'View our services'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle, Shield, Monitor, Headphones, Calendar, FileText, Calculator, Bot, Cloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { homePageData } from '@/lib/data/workflo-data'
import { useLanguage, useLocalizedContent } from '@/lib/contexts/language-context'
import ClientLogos from '@/components/sections/ClientLogos'
import SectorExperience from '@/components/sections/SectorExperience'
import { TestimonialsCarousel } from '@/components/testimonials/testimonials-carousel'
import { getFeaturedTestimonials } from '@/lib/data/testimonials-data'
import DangerTape, { DangerTapeSection, EmergencyAlert } from '@/components/shared/danger-tape'
import { VideoBackground, VideoSets } from '@/components/shared/video-background'
import ModernHeroSection from '@/components/sections/ModernHeroSection'
import ModernServicesSection from '@/components/sections/ModernServicesSection'
import AnimatedStatsSection from '@/components/sections/AnimatedStatsSection'
import ProcessSection from '@/components/sections/ProcessSection'

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
      {/* Modern Hero Section */}
      <ModernHeroSection />

      {/* Client Logos Section */}
      <ClientLogos />

      {/* Sector Experience Section */}
      <SectorExperience />

      {/* Modern Services Section */}
      <ModernServicesSection />

      {/* Premium Support Banner - Art Director Design System */}
      <EmergencyAlert
        message={language === 'nl' ? 'Hulp nodig? Onze engineers staan voor je klaar' : 'Need help? Our engineers are ready for you'}
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open('tel:+31203080465', '_self')}
            className="text-workflo-black dark:text-white hover:text-workflo-yellow font-medium"
          >
            {language === 'nl' ? 'Bel 020-30 80 465' : 'Call 020-30 80 465'}
          </Button>
        }
      />

      {/* How It Works Section - New Premium Design */}
      <ProcessSection />

      {/* Tech Excellence Section */}
      <section className="relative workflo-section-spacing bg-gradient-to-br from-workflo-yellow-light/20 via-yellow-100/30 to-workflo-yellow-light/10 overflow-hidden">
        <VideoBackground
          videos={VideoSets.code}
          opacity={0.08}
          overlay={true}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="workflo-h2 text-workflo-navy dark:text-white workflo-block-spacing">
              {language === 'nl' ? 'Technologie die Werkt' : 'Technology that Works'}
            </h2>
            <p className="workflo-body text-workflo-gray dark:text-gray-300 mb-12">
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
                  icon: Bot
                },
                {
                  title: 'Cloud-First Aanpak',
                  titleEN: 'Cloud-First Approach',
                  description: 'Moderne cloud oplossingen voor maximale flexibiliteit en schaalbaarheid',
                  descriptionEN: 'Modern cloud solutions for maximum flexibility and scalability',
                  icon: Cloud
                },
                {
                  title: 'Zero-Trust Security',
                  titleEN: 'Zero-Trust Security',
                  description: 'Geavanceerde beveiliging die elke toegang verifieert en beschermt',
                  descriptionEN: 'Advanced security that verifies and protects every access',
                  icon: Shield
                }
              ].map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <Card key={index} className="bg-card/90 backdrop-blur-sm border-workflo-yellow/20 hover:border-workflo-yellow hover:bg-workflo-yellow-light/30 hover:shadow-xl hover:shadow-workflo-yellow/20 transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-workflo-yellow/10 rounded-2xl flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-workflo-yellow stroke-2" />
                      </div>
                      <h3 className="workflo-h3 text-workflo-navy dark:text-white mb-3">
                        {language === 'nl' ? feature.title : feature.titleEN}
                      </h3>
                      <p className="workflo-body text-workflo-gray dark:text-gray-300">
                        {language === 'nl' ? feature.description : feature.descriptionEN}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Calculator Section */}
      <section className="workflo-section-spacing bg-workflo-navy relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/10 via-transparent to-[#1E3A8A]/5"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="workflo-h2 text-[#f2f400] workflo-block-spacing">
              {language === 'nl' ? 'Wat kost het?' : 'What does it cost?'}
            </h2>
            <p className="workflo-body text-white/90 mb-8 max-w-2xl mx-auto">
              {language === 'nl'
                ? 'Transparante prijzen per gebruiker/werkplek. Bereken direct wat onze diensten voor jouw bedrijf kosten.'
                : 'Transparent pricing per user/workplace. Calculate immediately what our services cost for your company.'}
            </p>

            <div className="bg-[#1E3A8A]/20 backdrop-blur-sm rounded-2xl p-8 sm:p-10 border border-[#f2f400]/30 hover:border-[#f2f400] transition-all duration-300">
              <div className="mb-6">
                <Calculator className="w-16 h-16 text-[#f2f400] mx-auto mb-4" />
                <h3 className="workflo-h3 text-white mb-3">
                  {language === 'nl' ? 'Bereken je maandelijkse kosten' : 'Calculate your monthly costs'}
                </h3>
                <p className="workflo-body text-white/80">
                  {language === 'nl'
                    ? 'Gebruik onze calculator om direct te zien wat onze IT-ondersteuning kost'
                    : 'Use our calculator to immediately see what our IT support costs'}
                </p>
              </div>

              <Button
                asChild
                className="bg-[#f2f400] hover:bg-[#FFC107] text-[#0F172A] font-bold text-lg px-8 py-6 rounded-lg shadow-xl hover:shadow-2xl hover:shadow-[#f2f400]/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                <Link href="/calculator">
                  <Calculator className="mr-2 h-5 w-5" />
                  {language === 'nl' ? 'Open Prijscalculator' : 'Open Price Calculator'}
                </Link>
              </Button>

              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-white/70 mb-4">
                  {language === 'nl'
                    ? 'Meer dan 5 gebruikers? Dan krijg je automatisch korting!'
                    : 'More than 5 users? You automatically get a discount!'}
                </p>
                <Button
                  variant="outline"
                  asChild
                  className="border-[#f2f400] text-[#f2f400] hover:bg-[#f2f400] hover:text-[#0F172A] transition-all duration-300"
                >
                  <Link href="/contact">
                    {language === 'nl' ? 'Vraag offerte op maat aan' : 'Request custom quote'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="workflo-section-spacing bg-gradient-to-br from-workflo-yellow-light/40 via-yellow-100/20 to-workflo-yellow-light/30">
        <div className="container mx-auto px-4">
          <div className="text-center workflo-block-spacing">
            <h2 className="workflo-h2 text-workflo-navy dark:text-white mb-4">
              {language === 'nl' ? 'Wat Onze Klanten Zeggen' : 'What Our Clients Say'}
            </h2>
            <p className="workflo-body text-workflo-gray dark:text-gray-300 max-w-2xl mx-auto mb-8">
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

      {/* Animated Stats Section */}
      <AnimatedStatsSection />


      {/* CTA Section */}
      <section className="relative workflo-section-spacing bg-gradient-to-br from-workflo-yellow to-workflo-yellow-dark text-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="workflo-h2 text-workflo-navy mb-4">
              {language === 'nl' ? 'Klaar om te beginnen?' : 'Ready to get started?'}
            </h2>
            <p className="workflo-body text-workflo-navy mb-8 opacity-90">
              {language === 'nl'
                ? 'Ontdek hoe wij je IT-partner kunnen worden'
                : 'Discover how we can become your IT partner'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-workflo-black border-workflo-black/20 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/contact">
                  {language === 'nl' ? 'Plan gratis IT-scan' : 'Schedule free IT assessment'}
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
'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle, Monitor, Cloud, Shield, Network, Users, Calendar, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage, useLocalizedContent } from '@/lib/contexts/language-context'
import { servicesPageData, serviceCategories } from '@/lib/data/workflo-data'

export default function ServicesPage() {
  const { language } = useLanguage()
  const { getLocalizedValue } = useLocalizedContent()

  const iconMap = {
    'managed-it': Monitor,
    'cloud-solutions': Cloud, 
    'cybersecurity': Shield,
    'network': Network,
    'consultancy': Users
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {language === 'nl' ? 'Onze Diensten' : 'Our Services'}
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground">
              {language === 'nl' 
                ? 'Uitgebreide IT-diensten ontworpen om Amsterdamse bedrijven te laten groeien en bloeien'
                : 'Comprehensive IT services designed to help Amsterdam businesses grow and thrive'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {language === 'nl' ? 'Eén partner. Alle IT-oplossingen.' : 'One Partner. Every IT Solution.'}
              </h2>
              <p className="text-xl text-muted-foreground">
                {language === 'nl' 
                  ? 'Van managed IT tot cybersecurity, wij hebben alles wat je nodig hebt'
                  : 'From managed IT to cybersecurity, we have everything you need'
                }
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceCategories.map((category) => {
                const IconComponent = iconMap[category.id as keyof typeof iconMap] || Monitor
                
                return (
                  <Card key={category.id} className="bg-card rounded-xl shadow-lg border-2 border-border hover:border-primary transition-all group">
                    <CardHeader>
                      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl font-bold text-foreground mb-4">
                        {getLocalizedValue(category, 'name')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-6">
                        {getLocalizedValue(category, 'description')}
                      </p>
                      <Button asChild variant="outline" className="w-full group-hover:border-primary group-hover:text-primary">
                        <Link href={`/diensten/${category.slug}`}>
                          {language === 'nl' ? 'Meer informatie' : 'Learn more'}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {language === 'nl' ? 'Zo werkt het' : 'How it works'}
              </h2>
              <p className="text-xl text-muted-foreground">
                {language === 'nl' 
                  ? 'In 3 simpele stappen naar zorgeloze IT'
                  : 'In 3 simple steps to worry-free IT'
                }
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {servicesPageData.processes.map((process, index) => {
                const iconMap = [Calendar, FileText, CheckCircle]
                const IconComponent = iconMap[index] || CheckCircle
                
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-workflo-yellow to-workflo-yellow-dark rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-workflo-yellow/30">
                      <IconComponent className="w-8 h-8 text-workflo-black" />
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="w-8 h-8 bg-workflo-yellow rounded-full flex items-center justify-center text-workflo-black font-bold text-sm">{process.step}</span>
                      <h3 className="text-xl font-bold text-foreground">
                        {getLocalizedValue(process, 'title')}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {getLocalizedValue(process, 'description')}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              {getLocalizedValue(servicesPageData.pricing, 'title')}
            </h2>
            
            <div className="bg-card rounded-2xl shadow-xl p-8 border-4 border-primary mb-8">
              <div className="text-5xl font-bold text-foreground mb-4">
                €{servicesPageData.pricing.basePrice}
                <span className="text-lg text-muted-foreground font-normal">
                  {language === 'nl' ? '/maand per computer' : '/month per computer'}
                </span>
              </div>
              <p className="text-xl text-muted-foreground mb-6">
                {getLocalizedValue(servicesPageData.pricing, 'description')}
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                {(language === 'nl' ? servicesPageData.pricing.featuresNL : servicesPageData.pricing.features).map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/contact">
                {language === 'nl' ? 'Vraag offerte aan' : 'Request quote'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                {language === 'nl' ? 'Waarom kiezen voor Workflo?' : 'Why choose Workflo?'}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-sm opacity-90">
                  {language === 'nl' ? 'Uptime garantie' : 'Uptime guarantee'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm opacity-90">
                  {language === 'nl' ? 'Support beschikbaar' : 'Support available'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">1h</div>
                <div className="text-sm opacity-90">
                  {language === 'nl' ? 'Responstijd' : 'Response time'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">250+</div>
                <div className="text-sm opacity-90">
                  {language === 'nl' ? 'Tevreden klanten' : 'Happy clients'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-workflo-yellow text-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'nl' ? 'Klaar om te beginnen?' : 'Ready to get started?'}
            </h2>
            <p className="text-xl mb-8">
              {language === 'nl' 
                ? 'Plan een gratis gesprek en ontdek hoe wij je IT-partner kunnen worden'
                : 'Schedule a free consultation and discover how we can become your IT partner'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">
                  {language === 'nl' ? 'Plan gratis gesprek' : 'Schedule free consultation'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-foreground text-foreground hover:bg-foreground hover:text-primary">
                <Link href="/over-ons">
                  {language === 'nl' ? 'Over Workflo' : 'About Workflo'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
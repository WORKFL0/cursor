'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, Users, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from '@/lib/framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage, useLocalizedContent } from '@/lib/contexts/language-context'
import { contactPageData } from '@/lib/data/workflo-data'
import { HubSpotContactForm } from '@/components/forms/HubSpotContactForm'
import DangerTape from '@/components/shared/danger-tape'
import { PhoneLink } from '@/components/ui/phone-link'

export default function ContactPage() {
  const { language } = useLanguage()
  const { getLocalizedValue } = useLocalizedContent()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {getLocalizedValue(contactPageData.hero, 'title')}
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground">
              {getLocalizedValue(contactPageData.hero, 'subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Office Building Image Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/60 z-10" />
        <Image
          src="/images/workflo-building.jpg"
          alt="Workflo Amsterdam Office - Koivistokade 3"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white px-4"
          >
            <Building2 className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="text-4xl font-bold mb-2">Workflo Amsterdam</h2>
            <p className="text-xl mb-4">Koivistokade 3, 1013 AC Amsterdam</p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Ma-Vr: 8:00 - 23:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>020-30 80 465</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <HubSpotContactForm />
            </div>
            
            {/* Contact Information */}
            <div className="space-y-8">
              {/* Direct Contact Card with Danger Tape */}
              <div className="relative">
                <DangerTape variant="alert" className="absolute top-0 left-0 right-0 z-20" />
                <DangerTape variant="alert" className="absolute bottom-0 left-0 right-0 z-20" />
                <DangerTape variant="alert" className="absolute top-0 bottom-0 left-0 w-2 z-20" />
                <DangerTape variant="alert" className="absolute top-0 bottom-0 right-0 w-2 z-20" />
                <Card className="bg-card border-2 border-workflo-yellow relative overflow-hidden">
                  {/* Simple yellow accent stripe */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-workflo-yellow"></div>
                
                <CardHeader className="pt-6">
                  <CardTitle className="text-xl font-bold text-foreground">
                    {language === 'nl' ? 'Direct Contact' : 'Direct Contact'}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <PhoneLink 
                    phoneNumber={contactPageData.location.phone}
                    sublabel={language === 'nl' ? 'Bel ons direct' : 'Call us directly'}
                    label={contactPageData.location.phone}
                  />
                  
                  <a 
                    href={`mailto:${contactPageData.location.email}`}
                    className="flex items-center gap-3 hover:underline group"
                  >
                    <div className="p-3 bg-workflo-yellow/20 rounded-lg group-hover:bg-workflo-yellow/30 transition-colors">
                      <Mail className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        {language === 'nl' ? 'Email ons' : 'Email us'}
                      </div>
                      <div className="text-xl font-semibold text-foreground">{contactPageData.location.email}</div>
                    </div>
                  </a>
                  
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">
                      {language === 'nl' ? 'Spoed? Bel direct!' : 'Emergency? Call directly!'}
                    </p>
                    <p className="font-semibold text-foreground">
                      {language === 'nl' ? 'Reactie binnen 15 minuten' : 'Response within 15 minutes'}
                    </p>
                  </div>
                </CardContent>
                </Card>
              </div>
              
              {/* Office Info */}
              <Card className="bg-card shadow-xl">
                <div className="p-8">
                  {/* Address Section */}
                  <div className="mb-8">
                    <div className="p-6 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <MapPin className="w-6 h-6 text-primary" />
                        <h4 className="text-xl font-bold text-foreground">
                          {language === 'nl' ? 'Kantooradres' : 'Office address'}
                        </h4>
                      </div>
                      <div className="text-muted-foreground text-lg leading-relaxed">
                        <strong>{contactPageData.location.name}</strong><br />
                        {contactPageData.location.address}<br />
                        {contactPageData.location.postalCode} {contactPageData.location.city}<br />
                        {contactPageData.location.country}
                      </div>
                    </div>
                  </div>
                  
                  {/* Office Hours */}
                  <div className="mb-8">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-lg font-semibold text-foreground mb-2">
                          {language === 'nl' ? 'Bereikbaarheid' : 'Availability'}
                        </h5>
                        <div className="text-muted-foreground space-y-3">
                          <div className="border-l-4 border-primary pl-3">
                            <div className="text-sm font-medium text-foreground mb-1">
                              {language === 'nl' ? 'Kantoorbezoek' : 'Office visits'}
                            </div>
                            <div className="flex justify-between items-center">
                              <span>
                                {language === 'nl' ? 'Maandag - Vrijdag' : 'Monday - Friday'}
                              </span>
                              <span className="font-medium">09:00 - 17:00</span>
                            </div>
                          </div>
                          
                          <div className="border-l-4 border-workflo-yellow pl-3">
                            <div className="text-sm font-medium text-foreground mb-1">
                              {language === 'nl' ? 'Telefonische bereikbaarheid' : 'Phone availability'}
                            </div>
                            <div className="flex justify-between items-center">
                              <span>
                                {language === 'nl' ? 'Maandag - Vrijdag' : 'Monday - Friday'}
                              </span>
                              <span className="font-medium">08:00 - 23:00</span>
                            </div>
                          </div>
                          
                          <div className="text-sm text-primary font-medium mt-2">
                            {language === 'nl' ? contactPageData.hours.supportNL : contactPageData.hours.support}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Google Maps Embed */}
                  <div className="mb-6">
                    <div className="bg-card rounded-xl overflow-hidden shadow-lg">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2435.603659021858!2d4.888571976608!3d52.38495507204196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c609c056f68039%3A0x3e5e04b602000000!2sKoivistokade%203%2C%201013%20AC%20Amsterdam%2C%20Netherlands!5e0!3m2!1sen!2snl!4v1735220000000!5m2!1sen!2snl"
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Workflo Kantoorlocatie - Koivistokade 3"
                      />
                    </div>
                  </div>
                  
                  {/* Navigate Button */}
                  <a 
                    href="https://maps.google.com/maps/dir/?api=1&destination=Koivistokade+3,1013+AC+Amsterdam,Netherlands" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    <MapPin className="w-6 h-6" />
                    {language === 'nl' ? 'Navigeer naar ons kantoor' : 'Navigate to our office'}
                  </a>
                </div>
              </Card>
              
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {language === 'nl' ? 'Praktische Informatie' : 'Practical Information'}
              </h2>
              <p className="text-lg text-muted-foreground">
                {language === 'nl' 
                  ? 'Alles wat je moet weten voor een bezoek aan ons kantoor'
                  : 'Everything you need to know for visiting our office'
                }
              </p>
            </div>

            {/* Location Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'nl' ? 'Bereikbaarheid' : 'Accessibility'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'nl' 
                      ? '30+ minuten lopen van Amsterdam Centraal Station of eindhalte van bus 48 stopt voor de deur'
                      : '30+ minutes walk from Amsterdam Central Station or bus 48 terminus stops right in front'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'nl' ? 'Kantoorbezoek' : 'Office Visits'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'nl' ? 'Ma-Vr: 09:00 - 17:00' : 'Mon-Fri: 09:00 - 17:00'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === 'nl' ? 'Op afspraak' : 'By appointment'}
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'nl' ? 'Telefonisch' : 'By Phone'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'nl' ? 'Ma-Vr: 08:00 - 23:00' : 'Mon-Fri: 08:00 - 23:00'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === 'nl' ? 'Direct bereikbaar' : 'Directly available'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {language === 'nl' ? 'Veelgestelde Vragen' : 'Frequently Asked Questions'}
              </h2>
              <p className="text-lg text-muted-foreground">
                {language === 'nl' 
                  ? 'Antwoorden op de meest gestelde vragen over onze diensten'
                  : 'Answers to the most common questions about our services'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'nl' ? 'Hoe snel kunnen jullie beginnen?' : 'How quickly can you start?'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {language === 'nl' 
                      ? 'Voor urgente situaties kunnen we binnen 24 uur starten. Voor geplande projecten hanteren we meestal een doorlooptijd van 1-2 weken.'
                      : 'For urgent situations we can start within 24 hours. For planned projects we usually have a lead time of 1-2 weeks.'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'nl' ? 'Werken jullie ook buiten Amsterdam?' : 'Do you work outside Amsterdam?'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {language === 'nl' 
                      ? 'Ja, we bedienen klanten in heel Nederland. Voor locaties buiten de Randstad rekenen we reiskosten.'
                      : 'Yes, we serve clients throughout the Netherlands. For locations outside the Randstad we charge travel costs.'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'nl' ? 'Bieden jullie 24/7 ondersteuning?' : 'Do you offer 24/7 support?'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {language === 'nl' 
                      ? 'Voor managed service klanten bieden we 24/7 monitoring en ondersteuning. Voor andere klanten zijn we bereikbaar tijdens kantooruren.'
                      : 'For managed service clients we offer 24/7 monitoring and support. For other clients we are available during business hours.'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'nl' ? 'Wat zijn de kosten?' : 'What are the costs?'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {language === 'nl' 
                      ? 'Kosten variëren per project. We bieden altijd een gratis intake en offerte aan. Neem contact op voor een persoonlijk gesprek.'
                      : 'Costs vary per project. We always offer a free intake and quote. Contact us for a personal consultation.'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link href="/faq">
                  {language === 'nl' ? 'Alle FAQ\'s bekijken' : 'View all FAQs'}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
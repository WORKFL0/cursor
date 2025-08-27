'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Users, CheckCircle, ArrowLeft, Briefcase, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useLanguage } from '@/lib/contexts/language-context'
import { externalLinks } from '@/lib/config/external-links'

export default function AppointmentPage() {
  const { language } = useLanguage()
  const [showInstructions, setShowInstructions] = useState(false)
  const [appointmentType, setAppointmentType] = useState<'onboarding' | 'engineer' | 'kennismaking30' | 'kennismaking15' | 'stage' | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <Badge className="mb-4" variant="outline">
              <Calendar className="h-3 w-3 mr-1" />
              {language === 'nl' ? 'Online Afspraak Maken' : 'Book Online'}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === 'nl' 
                ? 'Plan je afspraak met Workflo' 
                : 'Schedule your appointment with Workflo'}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {language === 'nl'
                ? 'Kies een moment dat je uitkomt. We bespreken jouw IT-uitdagingen en hoe Workflo je kan helpen.'
                : 'Choose a time that works for you. We\'ll discuss your IT challenges and how Workflo can help.'}
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{language === 'nl' ? '30 minuten' : '30 minutes'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>{language === 'nl' ? 'Microsoft Teams of bij jou op locatie' : 'Microsoft Teams or on-site'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>{language === 'nl' ? 'Gratis & vrijblijvend' : 'Free & no obligation'}</span>
              </div>
            </div>
          </motion.div>

          {/* Benefits Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-8"
          >
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'nl' ? 'IT-analyse' : 'IT Analysis'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {language === 'nl' 
                    ? 'We bekijken jouw huidige IT-situatie en identificeren verbeterpunten'
                    : 'We review your current IT situation and identify improvements'}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'nl' ? 'Kostenbesparing' : 'Cost Savings'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {language === 'nl' 
                    ? 'Ontdek hoe je tot 35% kunt besparen op jouw IT-kosten'
                    : 'Discover how to save up to 35% on your IT costs'}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'nl' ? 'Maatwerk advies' : 'Custom Advice'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {language === 'nl' 
                    ? 'Persoonlijk advies afgestemd op jouw bedrijf en doelen'
                    : 'Personal advice tailored to your business and goals'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Back Button */}
          <div className="mb-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/contact">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {language === 'nl' ? 'Terug naar contact' : 'Back to contact'}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Microsoft Bookings Section */}
      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card rounded-xl shadow-xl overflow-hidden"
          >
            <div className="text-center py-16 px-8">
              {!appointmentType ? (
                <>
                  <div className="w-20 h-20 bg-black/90 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-workflo-yellow">
                    <Calendar className="h-10 w-10 text-workflo-yellow" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-6">
                    {language === 'nl' 
                      ? 'Kies het type afspraak'
                      : 'Choose appointment type'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-all hover:border-primary border-2 group"
                      onClick={() => setAppointmentType('onboarding')}
                    >
                      <CardHeader className="text-center pb-2">
                        <Briefcase className="h-10 w-10 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <CardTitle className="text-lg">
                          {language === 'nl' ? 'Onboarding Gesprek' : 'Onboarding Meeting'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground text-center mb-3">
                          {language === 'nl' 
                            ? 'Kennismaking voor nieuwe klanten met je IT-behoeften.'
                            : 'Introduction for new clients with your IT needs.'}
                        </p>
                        <Badge variant="secondary" className="w-full justify-center text-xs">
                          {language === 'nl' ? 'Voor nieuwe klanten' : 'For new clients'}
                        </Badge>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-all hover:border-primary border-2 group"
                      onClick={() => setAppointmentType('engineer')}
                    >
                      <CardHeader className="text-center pb-2">
                        <Wrench className="h-10 w-10 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <CardTitle className="text-lg">
                          {language === 'nl' ? 'Engineer Afspraak' : 'Engineer Appointment'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground text-center mb-3">
                          {language === 'nl' 
                            ? 'Direct met onze engineer voor technische zaken.'
                            : 'Direct with our engineer for technical matters.'}
                        </p>
                        <Badge variant="secondary" className="w-full justify-center text-xs">
                          {language === 'nl' ? 'Met Florian' : 'With Florian'}
                        </Badge>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-all hover:border-primary border-2 group"
                      onClick={() => setAppointmentType('kennismaking30')}
                    >
                      <CardHeader className="text-center pb-2">
                        <Users className="h-10 w-10 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <CardTitle className="text-lg">
                          {language === 'nl' ? 'Kennismaking 30 min' : 'Introduction 30 min'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground text-center mb-3">
                          {language === 'nl' 
                            ? 'Uitgebreide kennismaking om elkaar beter te leren kennen.'
                            : 'Extended introduction to get to know each other better.'}
                        </p>
                        <Badge variant="secondary" className="w-full justify-center text-xs">
                          30 {language === 'nl' ? 'minuten' : 'minutes'}
                        </Badge>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-all hover:border-primary border-2 group"
                      onClick={() => setAppointmentType('kennismaking15')}
                    >
                      <CardHeader className="text-center pb-2">
                        <Clock className="h-10 w-10 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <CardTitle className="text-lg">
                          {language === 'nl' ? 'Kennismaking 15 min' : 'Introduction 15 min'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground text-center mb-3">
                          {language === 'nl' 
                            ? 'Korte kennismaking voor een eerste indruk.'
                            : 'Brief introduction for a first impression.'}
                        </p>
                        <Badge variant="secondary" className="w-full justify-center text-xs">
                          15 {language === 'nl' ? 'minuten' : 'minutes'}
                        </Badge>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-all hover:border-primary border-2 group"
                      onClick={() => setAppointmentType('stage')}
                    >
                      <CardHeader className="text-center pb-2">
                        <Users className="h-10 w-10 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <CardTitle className="text-lg">
                          {language === 'nl' ? 'Stage Gesprek' : 'Internship Interview'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground text-center mb-3">
                          {language === 'nl' 
                            ? 'Voor studenten die stage willen lopen bij Workflo.'
                            : 'For students interested in an internship at Workflo.'}
                        </p>
                        <Badge variant="secondary" className="w-full justify-center text-xs">
                          {language === 'nl' ? 'Voor studenten' : 'For students'}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setAppointmentType(null)
                      setShowInstructions(false)
                    }}
                    className="mb-6"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {language === 'nl' ? 'Terug naar keuze' : 'Back to selection'}
                  </Button>
                  
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 ${
                    appointmentType === 'onboarding' || appointmentType === 'stage'
                      ? 'bg-blue-500/10 border-blue-500' 
                      : appointmentType === 'engineer'
                      ? 'bg-green-500/10 border-green-500'
                      : 'bg-purple-500/10 border-purple-500'
                  }`}>
                    {appointmentType === 'onboarding' && <Briefcase className="h-10 w-10 text-blue-500" />}
                    {appointmentType === 'engineer' && <Wrench className="h-10 w-10 text-green-500" />}
                    {(appointmentType === 'kennismaking30' || appointmentType === 'kennismaking15') && <Users className="h-10 w-10 text-purple-500" />}
                    {appointmentType === 'stage' && <Users className="h-10 w-10 text-blue-500" />}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">
                    {appointmentType === 'onboarding' && (language === 'nl' ? 'Plan je onboarding gesprek' : 'Schedule onboarding meeting')}
                    {appointmentType === 'engineer' && (language === 'nl' ? 'Plan afspraak met engineer Florian' : 'Schedule appointment with engineer Florian')}
                    {appointmentType === 'kennismaking30' && (language === 'nl' ? 'Plan een kennismaking van 30 minuten' : 'Schedule a 30 minute introduction')}
                    {appointmentType === 'kennismaking15' && (language === 'nl' ? 'Plan een kennismaking van 15 minuten' : 'Schedule a 15 minute introduction')}
                    {appointmentType === 'stage' && (language === 'nl' ? 'Plan je stage gesprek' : 'Schedule your internship interview')}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    {language === 'nl'
                      ? 'Kies direct een geschikt moment uit onze beschikbare tijdsloten.'
                      : 'Choose a suitable time from our available time slots.'}
                  </p>

                  {/* Microsoft Bookings iframe */}
                  <div className="w-full max-w-4xl mx-auto">
                    <div className="relative rounded-lg overflow-hidden shadow-2xl border border-border" style={{ paddingBottom: '100%' }}>
                      <iframe
                        src={(() => {
                          switch(appointmentType) {
                            case 'onboarding':
                              return externalLinks.bookings.onboarding
                            case 'engineer':
                              return externalLinks.bookings.engineer
                            case 'kennismaking30':
                              return externalLinks.bookings.kennismaking30min
                            case 'kennismaking15':
                              return externalLinks.bookings.kennismaking15min
                            case 'stage':
                              return externalLinks.bookings.stageGesprek
                            default:
                              return ''
                          }
                        })()}
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0"
                        scrolling="yes"
                        title={language === 'nl' ? 'Microsoft Bookings Afspraak Planner' : 'Microsoft Bookings Appointment Scheduler'}
                      />
                    </div>
                    
                    {/* Fallback link */}
                    <div className="text-center mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          let bookingUrl = ''
                          switch(appointmentType) {
                            case 'onboarding':
                              bookingUrl = externalLinks.bookings.onboarding
                              break
                            case 'engineer':
                              bookingUrl = externalLinks.bookings.engineer
                              break
                            case 'kennismaking30':
                              bookingUrl = externalLinks.bookings.kennismaking30min
                              break
                            case 'kennismaking15':
                              bookingUrl = externalLinks.bookings.kennismaking15min
                              break
                            case 'stage':
                              bookingUrl = externalLinks.bookings.stageGesprek
                              break
                          }
                          window.open(bookingUrl, '_blank')
                        }}
                        className="text-xs"
                      >
                        {language === 'nl' 
                          ? 'Lukt het niet? Open in een nieuw tabblad →' 
                          : 'Having issues? Open in a new tab →'}
                      </Button>
                    </div>
                  </div>

                  {showInstructions && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg max-w-md mx-auto"
                    >
                      <h4 className="font-semibold mb-3 text-primary">
                        {language === 'nl' ? '✓ Bookings geopend!' : '✓ Bookings opened!'}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {language === 'nl' 
                          ? 'We hebben de Microsoft Bookings pagina voor je geopend in een nieuw tabblad.'
                          : 'We have opened the Microsoft Bookings page for you in a new tab.'}
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-2 text-left">
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold">1.</span>
                          <span>
                            {language === 'nl' 
                              ? 'Kies een beschikbare datum in de kalender'
                              : 'Choose an available date in the calendar'}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold">2.</span>
                          <span>
                            {language === 'nl' 
                              ? 'Selecteer een tijdslot dat je uitkomt'
                              : 'Select a time slot that suits you'}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold">3.</span>
                          <span>
                            {language === 'nl' 
                              ? 'Vul je contactgegevens in'
                              : 'Fill in your contact details'}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold">4.</span>
                          <span>
                            {language === 'nl' 
                              ? 'Bevestig je afspraak'
                              : 'Confirm your appointment'}
                          </span>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </>
              )}

              {!appointmentType && (
                <div className="mt-8 p-6 bg-muted/50 rounded-lg max-w-md mx-auto">
                  <h4 className="font-semibold mb-2">
                    {language === 'nl' ? 'Niet zeker welke afspraak je nodig hebt?' : 'Not sure which appointment you need?'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'nl' 
                      ? 'Kies voor een onboarding gesprek als je nieuw bent bij Workflo. Voor bestaande klanten of specifieke technische vragen, kies een afspraak met onze engineer.'
                      : 'Choose an onboarding meeting if you\'re new to Workflo. For existing clients or specific technical questions, choose an appointment with our engineer.'}
                  </p>
                </div>
              )}

              {!showInstructions && appointmentType && (
                <div className="mt-8 p-6 bg-muted/50 rounded-lg max-w-md mx-auto">
                  <h4 className="font-semibold mb-2">
                    {language === 'nl' ? 'Wat gebeurt er na het boeken?' : 'What happens after booking?'}
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span>
                        {language === 'nl' 
                          ? 'Je ontvangt direct een bevestiging per e-mail'
                          : 'You will receive an immediate email confirmation'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span>
                        {language === 'nl' 
                          ? 'Een dag vooraf krijg je een herinnering'
                          : 'You will get a reminder one day before'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span>
                        {appointmentType === 'onboarding'
                          ? (language === 'nl' 
                            ? 'Je ontvangt een Teams link voor het online gesprek'
                            : 'You will receive a Teams link for the online meeting')
                          : (language === 'nl'
                            ? 'Florian neemt contact op voor de technische details'
                            : 'Florian will contact you for the technical details')
                        }
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </motion.div>

          {/* Alternative Contact Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-muted-foreground mb-4">
              {language === 'nl' 
                ? 'Liever direct contact? Geen probleem!'
                : 'Prefer direct contact? No problem!'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <a href="tel:+31203080465">
                  {language === 'nl' ? 'Bel 020-30 80 465' : 'Call 020-30 80 465'}
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:info@workflo.it">
                  {language === 'nl' ? 'Mail naar info@workflo.it' : 'Email info@workflo.it'}
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
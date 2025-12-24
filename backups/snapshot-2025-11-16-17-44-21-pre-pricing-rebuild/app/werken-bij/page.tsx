'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import ApplicationForm from '@/components/careers/ApplicationForm'
import { 
  ArrowRight, 
  Users, 
  Rocket, 
  Heart, 
  Coffee, 
  GraduationCap, 
  Trophy,
  MapPin,
  Briefcase,
  Clock,
  Euro,
  CheckCircle,
  Send,
  Music,
  Sparkles
} from 'lucide-react'

// Metadata moved to layout or separate metadata file for client component

const internshipPositions = [
  {
    title: 'Allround Medewerker IT Systems and Devices',
    department: 'IT Support & Infrastructure',
    location: 'Amsterdam',
    type: 'MBO Niveau 3',
    duration: '32-40 uur per week',
    description: 'Als Allround Medewerker IT Systems and Devices werk je mee aan het onderhouden en beheren van IT-systemen bij onze klanten. Je leert alles over hardware, software, netwerken en het oplossen van IT-problemen.',
    requirements: [
      'MBO niveau 3 opleiding ICT (lopend)',
      'Interesse in hardware en software',
      'Klantgerichte instelling',
      'Hands-on mentaliteit',
      'Goede communicatieve vaardigheden in Nederlands'
    ],
    tasks: [
      'Installeren en configureren van computers en randapparatuur',
      'Eerste- en tweedelijns support aan gebruikers',
      'Beheren van gebruikersaccounts en toegangsrechten',
      'Uitvoeren van preventief onderhoud',
      'Documenteren van IT-processen en procedures'
    ],
    compensation: 'Stagevergoeding + reiskostenvergoeding + laptop + doorgroeimogelijkheden'
  },
  {
    title: 'IT Expert Systems and Devices',
    department: 'IT Infrastructure & Security',
    location: 'Amsterdam',
    type: 'MBO Niveau 4',
    duration: '32-40 uur per week',
    description: 'Als IT Expert Systems and Devices werk je op een hoger niveau aan complexe IT-vraagstukken. Je bent betrokken bij het ontwerpen, implementeren en beheren van IT-infrastructuren en security oplossingen.',
    requirements: [
      'MBO niveau 4 opleiding ICT (lopend)',
      'Affiniteit met netwerken en security',
      'Analytisch denkvermogen',
      'Zelfstandig kunnen werken',
      'Interesse in cloud technologieën (Azure/Microsoft 365)'
    ],
    tasks: [
      'Ontwerpen en implementeren van netwerkomgevingen',
      'Beheren van servers en virtualisatie platforms',
      'Implementeren van security maatregelen',
      'Troubleshooting van complexe IT-problemen',
      'Adviseren van klanten over IT-oplossingen',
      'Werken met cloud diensten zoals Microsoft 365 en Azure'
    ],
    compensation: 'Stagevergoeding + reiskostenvergoeding + laptop + certificeringen + baangarantie bij goed functioneren'
  }
]

const benefits = [
  {
    icon: Euro,
    title: 'Stagevergoeding',
    description: 'Marktconforme stagevergoeding plus reiskostenvergoeding'
  },
  {
    icon: GraduationCap,
    title: 'Leren & Ontwikkeling',
    description: 'Persoonlijke begeleiding en mogelijkheid tot certificeringen'
  },
  {
    icon: Coffee,
    title: 'Gezellig Team',
    description: 'Jong team, vrijdagmiddagborrels en teamuitjes'
  },
  {
    icon: Trophy,
    title: 'Doorgroeikansen',
    description: 'Kans op contract na succesvolle stage'
  },
  {
    icon: Heart,
    title: 'Goede Sfeer',
    description: 'No-nonsense cultuur met ruimte voor humor'
  },
  {
    icon: Rocket,
    title: 'Innovatie',
    description: 'Werk met de nieuwste technologieën en tools'
  }
]

const companyValues = [
  {
    title: 'No-Nonsense',
    description: 'We zijn direct, eerlijk en transparant in alles wat we doen.'
  },
  {
    title: 'Klant Centraal',
    description: 'De tevredenheid van onze klanten staat altijd voorop.'
  },
  {
    title: 'Continu Verbeteren',
    description: 'We blijven leren, groeien en innoveren.'
  },
  {
    title: 'Teamwork',
    description: 'Samen bereiken we meer dan alleen.'
  }
]

export default function WerkenBijPage() {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleApply = (positionTitle: string) => {
    setSelectedPosition(positionTitle)
    setIsDialogOpen(true)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Rihanna joke */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 via-white to-primary-100 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 text-9xl font-bold text-primary-200 rotate-12">Work</div>
          <div className="absolute bottom-20 right-10 text-9xl font-bold text-primary-200 -rotate-12">Work</div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Animated Work text with Rihanna reference */}
            <div className="mb-8">
              <div className="flex justify-center items-center gap-2 mb-4">
                <Music className="w-8 h-8 text-primary-500 animate-pulse" />
                <span className="text-5xl md:text-6xl font-bold text-primary-500 animate-pulse">
                  Work Work Work Work Work
                </span>
                <Music className="w-8 h-8 text-primary-500 animate-pulse" />
              </div>
              <p className="text-sm text-muted-foreground italic">
                🎵 Zoals Rihanna zegt, maar dan met meer kabels en minder glamour
              </p>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              MBO Stage bij Workflo Amsterdam
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Wij zijn een officieel SBB erkend leerbedrijf voor MBO niveau 3 en 4! 
              Leer het vak in de praktijk bij dé IT-specialist van Amsterdam.
            </p>
            
            {/* SBB Logo */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-4 bg-card rounded-lg p-6 shadow-xl border-2 border-primary-200">
                <img 
                  src="/images/sbb-logo.png" 
                  alt="SBB Erkend Leerbedrijf" 
                  className="h-20 object-contain"
                />
                <div className="text-left">
                  <p className="text-lg font-bold text-foreground">Erkend Leerbedrijf</p>
                  <p className="text-sm text-muted-foreground">
                    Officieel gecertificeerd voor<br/>
                    stageplekken en leerwerktrajecten
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg"
                onClick={() => document.getElementById('stageplekken')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Bekijk Stageplekken
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-foreground border-foreground hover:bg-foreground hover:text-background">
                Stuur Open Sollicitatie
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values with dark background */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Onze Waarden</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Dit is waar we voor staan en wat je van ons kunt verwachten
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyValues.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-workflo-yellow text-black rounded-lg p-6 h-full hover:bg-workflo-yellow-dark transition-all transform hover:scale-105 shadow-xl">
                  <h3 className="font-bold text-lg mb-2 text-black">{value.title}</h3>
                  <p className="text-gray-900 font-medium">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section with gradient */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Waarom stage lopen bij Workflo?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We investeren in onze stagiaires omdat zij de toekomst zijn
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internship Positions with dark background */}
      <section id="stageplekken" className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">MBO Stageplekken</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Kies de opleiding die bij jou past - wij hebben voor beide niveaus een perfecte stageplek
            </p>
          </div>
          <div className="grid gap-6 max-w-5xl mx-auto">
            {internshipPositions.map((position, index) => (
              <Card key={index} className="hover:shadow-xl transition-all transform hover:-translate-y-1 bg-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{position.title}</CardTitle>
                      <CardDescription className="mt-2">
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {position.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {position.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {position.duration}
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {position.type}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{position.description}</p>
                  
                  {position.tasks && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground mb-2">Wat ga je doen:</h4>
                      <ul className="space-y-1">
                        {position.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <ArrowRight className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-2">Wat we vragen:</h4>
                    <ul className="space-y-1">
                      {position.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {position.compensation && (
                    <div className="mb-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
                      <p className="text-sm font-medium text-primary-900">
                        <Sparkles className="inline w-4 h-4 mr-1" />
                        {position.compensation}
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => handleApply(position.title)}
                    className="w-full sm:w-auto bg-primary-400 text-black hover:bg-primary-500 font-bold"
                  >
                    Solliciteer Nu
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Culture with gradient */}
      <section className="py-16 bg-gradient-to-br from-primary-100 via-white to-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ons Team</h2>
              <p className="text-xl text-muted-foreground">
                Een hecht team van 4 IT professionals in het hart van Amsterdam
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card rounded-lg p-6 shadow-lg">
                <Users className="w-12 h-12 text-primary-500 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Jong & Dynamisch</h3>
                <p className="text-muted-foreground">
                  Ons team bestaat uit jonge professionals die elkaar helpen groeien. 
                  Perfecte plek voor stagiaires om te leren!
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 shadow-lg">
                <Rocket className="w-12 h-12 text-primary-500 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Innovatief & Vooruitstrevend</h3>
                <p className="text-muted-foreground">
                  We omarmen nieuwe technologieën en methodieken. Bij Workflo blijf je aan de voorhoede 
                  van IT-ontwikkelingen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with yellow background */}
      <section className="py-20 bg-primary-400 text-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Geen passende stage gevonden?
          </h2>
          <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
            We zijn altijd op zoek naar enthousiaste stagiaires! 
            Stuur ons jouw open sollicitatie en wie weet ben jij onze volgende collega.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 font-bold" asChild>
              <a href="mailto:work@workflo.nl?subject=Open Sollicitatie&body=Beste Workflo team,%0D%0A%0D%0AIk ben geïnteresseerd in een stage of functie bij jullie bedrijf.%0D%0A%0D%0AMet vriendelijke groet,">
                <Send className="mr-2 h-4 w-4" />
                Stuur Open Sollicitatie
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-foreground border-foreground hover:bg-foreground hover:text-primary font-bold" asChild>
              <Link href="/contact">
                Neem Contact Op
              </Link>
            </Button>
          </div>
          <div className="mt-12 text-gray-800">
            <p>Of mail direct naar: <a href="mailto:work@workflo.nl" className="text-foreground underline hover:text-muted-foreground font-semibold">work@workflo.nl</a></p>
          </div>
        </div>
      </section>

      {/* Application Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Sollicitatieformulier</DialogTitle>
            <DialogDescription>
              Vul het formulier in om te solliciteren
            </DialogDescription>
          </DialogHeader>
          {selectedPosition && (
            <ApplicationForm 
              position={selectedPosition} 
              onClose={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
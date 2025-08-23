'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Users, Award, Target, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage, useLocalizedContent } from '@/lib/contexts/language-context'
import { aboutPageData, companyInfo } from '@/lib/data/workflo-data'

export default function AboutPage() {
  const { language } = useLanguage()
  const { getLocalizedValue } = useLocalizedContent()

  const valueIcons = {
    'Reliability': Award,
    'Betrouwbaarheid': Award,
    'Expertise': Target,
    'Proactivity': Users,
    'Proactiviteit': Users,
    'Partnership': Heart
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {getLocalizedValue(aboutPageData.hero, 'title')}
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground">
              {getLocalizedValue(aboutPageData.hero, 'subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              {getLocalizedValue(aboutPageData.story, 'title')}
            </h2>
            <div className="text-lg text-foreground leading-relaxed space-y-6">
              <p>{getLocalizedValue(aboutPageData.story, 'content')}</p>
              <p className="text-xl text-primary font-semibold text-center py-8">
                {language === 'nl' 
                  ? '"IT dat gewoon werkt, zonder gedoe."'
                  : '"IT that simply works, without hassle."'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {aboutPageData.stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm opacity-90">
                    {language === 'nl' ? stat.labelNL : stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {language === 'nl' ? 'Onze Waarden' : 'Our Values'}
              </h2>
              <p className="text-xl text-muted-foreground">
                {language === 'nl' 
                  ? 'De principes die ons dagelijks werk leiden'
                  : 'The principles that guide our daily work'
                }
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {companyInfo.values.map((value, index) => {
                const IconComponent = valueIcons[getLocalizedValue(value, 'title') as keyof typeof valueIcons] || Users
                
                return (
                  <Card key={index} className="bg-card shadow-lg border-2 border-border hover:border-primary transition-all text-center">
                    <CardHeader>
                      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl font-bold text-foreground">
                        {getLocalizedValue(value, 'title')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {getLocalizedValue(value, 'description')}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>


      {/* Team Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {language === 'nl' ? 'Ons Team' : 'Our Team'}
              </h2>
              <p className="text-xl text-muted-foreground">
                {language === 'nl' 
                  ? 'Ontmoet de experts die jouw IT-uitdagingen oplossen'
                  : 'Meet the experts who solve your IT challenges'
                }
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {aboutPageData.team.map((member, index) => (
                <Card key={member.id} className="bg-card shadow-lg border-2 border-border hover:border-primary transition-all text-center">
                  <CardHeader>
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      {member.name}
                    </CardTitle>
                    <p className="text-primary font-semibold">
                      {language === 'nl' ? member.titleNL : member.title}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {language === 'nl' ? member.bioNL : member.bio}
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-foreground">
                        {language === 'nl' ? 'Specialiteiten:' : 'Specialties:'}
                      </h4>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {(language === 'nl' ? member.specialtiesNL : member.specialties).map((specialty, i) => (
                          <span 
                            key={i} 
                            className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-primary text-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              {language === 'nl' ? 'Onze Missie' : 'Our Mission'}
            </h2>
            <p className="text-xl leading-relaxed mb-8">
              {language === 'nl' ? companyInfo.missionNL : companyInfo.mission}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">
                  {language === 'nl' ? 'Neem contact op' : 'Get in touch'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-foreground text-foreground hover:bg-foreground hover:text-primary">
                <Link href="/diensten">
                  {language === 'nl' ? 'Onze diensten' : 'Our services'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {language === 'nl' ? 'Certificeringen & Partnerships' : 'Certifications & Partnerships'}
              </h2>
              <p className="text-xl text-muted-foreground">
                {language === 'nl' 
                  ? 'Erkend door de beste in de branche'
                  : 'Recognized by the best in the industry'
                }
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {companyInfo.certifications.map((cert, index) => (
                <Card key={index} className="bg-card shadow-lg text-center p-6 hover:shadow-xl transition-shadow">
                  <div className="text-lg font-semibold text-foreground">{cert}</div>
                </Card>
              ))}
            </div>

            <div className="mt-16">
              <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
                {language === 'nl' ? 'Technology Partners' : 'Technology Partners'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {companyInfo.partnerships.map((partner, index) => (
                  <Card key={index} className="bg-card shadow-lg text-center p-6 hover:shadow-xl transition-shadow">
                    <div className="text-lg font-semibold text-foreground">{partner}</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {language === 'nl' ? 'Amsterdam is onze thuis' : 'Amsterdam is our home'}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {language === 'nl' 
                ? 'Sinds 2015 bedienen wij bedrijven in Amsterdam en omgeving met persoonlijke aandacht en lokale expertise.'
                : 'Since 2015, we have served businesses in Amsterdam and surrounding areas with personal attention and local expertise.'
              }
            </p>
            <div className="bg-card rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{companyInfo.location.city}</div>
                  <div className="text-muted-foreground">
                    {language === 'nl' ? 'Onze thuisbasis' : 'Our home base'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{companyInfo.founded}</div>
                  <div className="text-muted-foreground">
                    {language === 'nl' ? 'Opgericht' : 'Founded'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{companyInfo.employees}</div>
                  <div className="text-muted-foreground">
                    {language === 'nl' ? 'Medewerkers' : 'Employees'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
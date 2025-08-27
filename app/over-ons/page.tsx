'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Users, Award, Target, Heart, MapPin, Calendar, CheckCircle, Shield, Zap, Building2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage, useLocalizedContent } from '@/lib/contexts/language-context'
import { aboutPageData, companyInfo } from '@/lib/data/workflo-data'
import { motion } from 'framer-motion'
import Head from 'next/head'

export default function AboutPage() {
  const { language } = useLanguage()
  const { getLocalizedValue } = useLocalizedContent()

  const valueIcons = {
    'Reliability': Shield,
    'Betrouwbaarheid': Shield,
    'Expertise': Target,
    'Proactivity': Zap,
    'Proactiviteit': Zap,
    'Partnership': Heart
  }

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  // Why choose us data
  const whyChooseData = [
    {
      icon: Shield,
      titleNL: 'Betrouwbare Partner sinds 2014',
      title: 'Trusted Partner since 2014',
      descriptionNL: 'Al 10+ jaar dé IT-partner voor Amsterdam. Bewezen track record met 50+ tevreden klanten.',
      description: '10+ years as Amsterdam\'s IT partner. Proven track record with 50+ satisfied clients.'
    },
    {
      icon: Star,
      titleNL: '99.9% Uptime Garantie',
      title: '99.9% Uptime Guarantee',
      descriptionNL: 'Jouw systemen draaien altijd. Onze proactieve monitoring voorkomt problemen.',
      description: 'Your systems always running. Our proactive monitoring prevents issues.'
    },
    {
      icon: Users,
      titleNL: 'Persoonlijke Aanpak',
      title: 'Personal Approach',
      descriptionNL: 'Geen call centers, maar directe toegang tot je vaste IT-specialist. Echt persoonlijk contact.',
      description: 'No call centers, direct access to your dedicated IT specialist. Truly personal contact.'
    },
    {
      icon: CheckCircle,
      titleNL: 'Transparante Prijzen',
      title: 'Transparent Pricing',
      descriptionNL: 'Vaste maandprijzen, geen verborgen kosten. Je weet precies waar je aan toe bent.',
      description: 'Fixed monthly prices, no hidden costs. You know exactly where you stand.'
    }
  ]

  return (
    <>
      <Head>
        <title>Over Ons - Workflo B.V. | Amsterdam&apos;s Vertrouwde IT-Partner sinds 2015</title>
        <meta 
          name="description" 
          content="Leer Workflo kennen: Amsterdam's meest vertrouwde IT-partner sinds 2014. Ontmoet ons team van experts en ontdek waarom 50+ bedrijven hun IT aan ons toevertrouwen."
        />
        <meta 
          name="keywords" 
          content="over workflo, it bedrijf amsterdam, managed it services amsterdam, it ondersteuning amsterdam, workflo team, it partner nederland, microsoft partner amsterdam, bedrijfs it amsterdam"
        />
        
        {/* Open Graph */}
        <meta property="og:title" content="Over Ons - Workflo B.V. | Amsterdam's Vertrouwde IT-Partner" />
        <meta property="og:description" content="Ontdek waarom 50+ bedrijven hun IT aan Workflo toevertrouwen. Leer ons team kennen en onze reis van startup tot Amsterdam's meest vertrouwde IT-partner." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="nl_NL" />
        <meta property="og:url" content="https://workflo.it/over-ons" />
        <meta property="og:site_name" content="Workflo B.V." />
        <meta property="og:image" content="https://workflo.it/images/workflo-building.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Workflo kantoor Amsterdam" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Over Workflo - Amsterdam's IT-Partner sinds 2015" />
        <meta name="twitter:description" content="Ontmoet het team achter 50+ tevreden klanten. Van startup tot vertrouwde IT-partner in Amsterdam." />
        <meta name="twitter:image" content="https://workflo.it/images/workflo-building.jpg" />
        
        {/* Canonical */}
        <link rel="canonical" href="https://workflo.it/over-ons" />
      </Head>
      
      <div className="flex flex-col overflow-hidden">
        {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-workflo-yellow/10 via-background to-workflo-yellow/5 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-72 h-72 bg-workflo-yellow/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-workflo-yellow/5 rounded-full blur-3xl animate-blob" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center"
            >
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight"
              >
                {getLocalizedValue(aboutPageData.hero, 'title')}
              </motion.h1>
              <motion.p 
                variants={fadeInUp}
                className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
              >
                {getLocalizedValue(aboutPageData.hero, 'subtitle')}
              </motion.p>
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Button size="lg" asChild className="bg-workflo-yellow hover:bg-workflo-yellow/90 text-black">
                  <Link href="/contact">
                    {language === 'nl' ? 'Leer ons kennen' : 'Get to know us'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/diensten">
                    {language === 'nl' ? 'Onze diensten' : 'Our services'}
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid lg:grid-cols-2 gap-16 items-center"
            >
              <motion.div variants={fadeInUp}>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">
                  {getLocalizedValue(aboutPageData.story, 'title')}
                </h2>
                <div className="text-lg text-muted-foreground leading-relaxed space-y-6">
                  <p>{getLocalizedValue(aboutPageData.story, 'content')}</p>
                </div>
                <div className="mt-8 p-6 bg-workflo-yellow/10 rounded-2xl border border-workflo-yellow/20">
                  <p className="text-xl font-semibold text-center text-foreground">
                    {language === 'nl' 
                      ? '"IT dat gewoon werkt, zonder gedoe."'
                      : '"IT that simply works, without hassle."'
                    }
                  </p>
                </div>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="relative">
                <div className="relative z-10">
                  <Image
                    src="/images/workflo-building.jpg"
                    alt="Workflo office Amsterdam"
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl"
                  />
                </div>
                <div className="absolute inset-0 bg-workflo-yellow/20 rounded-2xl blur-2xl transform translate-x-4 translate-y-4" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-foreground to-foreground/95 text-background relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
              {aboutPageData.stats.map((stat, index) => (
                <motion.div key={index} variants={scaleIn} className="group">
                  <div className="text-4xl lg:text-5xl font-bold text-workflo-yellow mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm lg:text-base text-background/90">
                    {language === 'nl' ? stat.labelNL : stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {language === 'nl' ? 'Onze Waarden' : 'Our Values'}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {language === 'nl' 
                  ? 'De principes die ons dagelijks werk leiden en onze relatie met klanten bepalen'
                  : 'The principles that guide our daily work and shape our client relationships'
                }
              </motion.p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {companyInfo.values.map((value, index) => {
                const IconComponent = valueIcons[getLocalizedValue(value, 'title') as keyof typeof valueIcons] || Users
                
                return (
                  <motion.div key={index} variants={fadeInUp}>
                    <Card className="bg-card shadow-lg border-2 border-border hover:border-workflo-yellow/50 hover:shadow-xl transition-all duration-300 text-center group h-full">
                      <CardHeader>
                        <div className="w-16 h-16 bg-workflo-yellow/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-workflo-yellow/20 transition-colors duration-300">
                          <IconComponent className="w-8 h-8 text-workflo-yellow-dark group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <CardTitle className="text-xl font-bold text-foreground">
                          {getLocalizedValue(value, 'title')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {getLocalizedValue(value, 'description')}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>
      {/* Why Choose Workflo Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-workflo-yellow/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {language === 'nl' ? 'Waarom kiezen voor Workflo?' : 'Why choose Workflo?'}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {language === 'nl' 
                  ? 'Ontdek waarom 50+ bedrijven in Amsterdam en omgeving hun IT aan ons toevertrouwen'
                  : 'Discover why 50+ businesses in Amsterdam and surroundings trust us with their IT'
                }
              </motion.p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 gap-8"
            >
              {whyChooseData.map((item, index) => {
                const IconComponent = item.icon
                
                return (
                  <motion.div key={index} variants={fadeInUp}>
                    <Card className="bg-card shadow-lg border border-border hover:border-workflo-yellow/50 hover:shadow-xl transition-all duration-300 p-6 h-full group">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-workflo-yellow/10 rounded-lg flex items-center justify-center group-hover:bg-workflo-yellow/20 transition-colors duration-300 flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-workflo-yellow-dark group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-3">
                            {language === 'nl' ? item.titleNL : item.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {language === 'nl' ? item.descriptionNL : item.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {language === 'nl' ? 'Onze Reis' : 'Our Journey'}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {language === 'nl' 
                  ? 'Van startup tot vertrouwde IT-partner: onze groei in cijfers'
                  : 'From startup to trusted IT partner: our growth in numbers'
                }
              </motion.p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="relative"
            >
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-workflo-yellow/30 md:transform md:-translate-x-px" />
              
              <div className="space-y-12">
                {aboutPageData.timeline.map((item, index) => (
                  <motion.div 
                    key={item.year}
                    variants={fadeInUp}
                    className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-workflo-yellow rounded-full md:transform md:-translate-x-2 z-10" />
                    
                    {/* Content */}
                    <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 pl-20' : 'md:pl-12 pl-20'}`}>
                      <Card className="bg-card shadow-lg border border-border hover:border-workflo-yellow/50 hover:shadow-xl transition-all duration-300 p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Calendar className="w-5 h-5 text-workflo-yellow-dark" />
                          <span className="text-2xl font-bold text-workflo-yellow-dark">{item.year}</span>
                        </div>
                        <p className="text-foreground font-medium">
                          {language === 'nl' ? item.eventNL : item.event}
                        </p>
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {language === 'nl' ? 'Ons Team' : 'Our Team'}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {language === 'nl' 
                  ? 'Ontmoet de experts die jouw IT-uitdagingen oplossen met persoonlijke aandacht en jarenlange ervaring'
                  : 'Meet the experts who solve your IT challenges with personal attention and years of experience'
                }
              </motion.p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12"
            >
              {aboutPageData.team.map((member, index) => (
                <motion.div key={member.id} variants={fadeInUp}>
                  <Card className="bg-card shadow-lg border border-border hover:border-workflo-yellow/50 hover:shadow-xl transition-all duration-300 group h-full">
                    <CardHeader className="pb-8 px-8 pt-8">
                      <div className="relative w-40 h-40 mx-auto mb-8 group-hover:scale-105 transition-transform duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-workflo-yellow/20 to-transparent rounded-full" />
                        <Image
                          src={member.photo}
                          alt={member.name}
                          fill
                          className="rounded-full object-cover border-4 border-background shadow-lg"
                        />
                      </div>
                      <CardTitle className="text-xl font-bold text-foreground text-center mb-2">
                        {member.name}
                      </CardTitle>
                      <p className="text-base text-workflo-yellow-dark font-medium text-center">
                        {language === 'nl' ? member.titleNL.split('/')[0] : member.title.split('/')[0]}
                      </p>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col px-8 pb-8">
                      <p className="text-base text-muted-foreground mb-6 leading-relaxed flex-1 text-center">
                        {language === 'nl' ? member.bioNL : member.bio}
                      </p>
                      <div className="pt-6 border-t border-border/50">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4 text-center">
                          {language === 'nl' ? 'Specialiteiten' : 'Specialties'}
                        </h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {(language === 'nl' ? member.specialtiesNL : member.specialties).map((specialty, i) => (
                            <span 
                              key={i} 
                              className="inline-block bg-muted text-foreground text-sm px-3 py-1.5 rounded-lg font-medium"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-workflo-yellow to-workflo-yellow/90 text-black relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-bold mb-8">
                {language === 'nl' ? 'Onze Missie' : 'Our Mission'}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl lg:text-2xl leading-relaxed mb-12 font-medium">
                {language === 'nl' ? companyInfo.missionNL : companyInfo.mission}
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild className="bg-black hover:bg-black/90 text-white">
                  <Link href="/contact">
                    {language === 'nl' ? 'Neem contact op' : 'Get in touch'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-black text-black hover:bg-black hover:text-workflo-yellow">
                  <Link href="/diensten">
                    {language === 'nl' ? 'Onze diensten' : 'Our services'}
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Location Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid lg:grid-cols-2 gap-16 items-center"
            >
              <motion.div variants={fadeInUp}>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  {language === 'nl' ? 'Amsterdam is onze thuis' : 'Amsterdam is our home'}
                </h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {language === 'nl' 
                    ? 'Sinds 2015 bedienen wij bedrijven in Amsterdam en omgeving met persoonlijke aandacht en lokale expertise. We kennen de uitdagingen van het Amsterdamse bedrijfsleven en bieden oplossingen die écht passen.'
                    : 'Since 2015, we have served businesses in Amsterdam and surrounding areas with personal attention and local expertise. We understand Amsterdam business challenges and offer solutions that truly fit.'
                  }
                </p>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-workflo-yellow/10 rounded-xl">
                    <MapPin className="w-6 h-6 text-workflo-yellow-dark mx-auto mb-2" />
                    <div className="text-2xl font-bold text-workflo-yellow-dark">{companyInfo.location.city}</div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'nl' ? 'Onze thuisbasis' : 'Our home base'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-workflo-yellow/10 rounded-xl">
                    <Calendar className="w-6 h-6 text-workflo-yellow-dark mx-auto mb-2" />
                    <div className="text-2xl font-bold text-workflo-yellow-dark">{companyInfo.founded}</div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'nl' ? 'Opgericht' : 'Founded'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-workflo-yellow/10 rounded-xl">
                    <Users className="w-6 h-6 text-workflo-yellow-dark mx-auto mb-2" />
                    <div className="text-2xl font-bold text-workflo-yellow-dark">{companyInfo.employees}</div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'nl' ? 'Experts' : 'Experts'}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <Card className="bg-card shadow-2xl border border-workflo-yellow/20 p-8 hover:shadow-3xl transition-shadow duration-300">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <MapPin className="w-8 h-8 text-workflo-yellow-dark" />
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {language === 'nl' ? 'Bezoek ons kantoor' : 'Visit our office'}
                        </h3>
                        <p className="text-muted-foreground">
                          {language === 'nl' ? 'Altijd welkom voor een kop koffie' : 'Always welcome for a cup of coffee'}
                        </p>
                      </div>
                    </div>
                    <div className="pl-12 space-y-2 text-muted-foreground">
                      <p className="font-medium">{companyInfo.location.address}</p>
                      <p>{companyInfo.location.postalCode} {companyInfo.location.city}</p>
                      <p className="font-medium text-workflo-yellow-dark">
                        {companyInfo.location.phone}
                      </p>
                    </div>
                    <div className="pl-12">
                      <Button asChild className="bg-workflo-yellow hover:bg-workflo-yellow/90 text-black">
                        <Link href="/contact">
                          {language === 'nl' ? 'Plan een bezoek' : 'Plan a visit'}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}
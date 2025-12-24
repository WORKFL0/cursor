'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import { TestimonialsCarousel } from '@/components/testimonials/testimonials-carousel'
import { TestimonialCard } from '@/components/testimonials/testimonial-card'
import { testimonials } from '@/lib/data/testimonials-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useLanguage } from '@/lib/contexts/language-context'
import Link from 'next/link'
import { motion } from '@/lib/framer-motion'
import { Search, Star, Filter, Users, Building2, Quote, Award } from 'lucide-react'

const companyLogos = [
  { name: 'doctorfeelgood', logo: '/images/logos/doctorfeelgood.jpg' },
  { name: 'Havas Media', logo: '/images/logos/havas-media.png' },
  { name: 'Winix', logo: '/images/logos/winix.jpg' },
  { name: 'iO', logo: '/images/logos/io_Logo.png' },
  { name: 'Cogonez', logo: '/images/logos/workflo-logo.png' }, // Placeholder
  { name: 'LaDress', logo: '/images/logos/ladress.png' },
  { name: 'Hoen', logo: '/images/logos/workflo-logo.png' }, // Placeholder
  { name: 'Grabo', logo: '/images/logos/workflo-logo.png' }, // Placeholder
  { name: 'Koschuch', logo: '/images/logos/koschuch.png' },
  { name: 'John Doornik Casting', logo: '/images/logos/john-doornik.png' }
]

const services = [
  'All', 'Managed IT Services', 'Cybersecurity', 'Cloud Solutions', 
  'Microsoft 365', 'VoIP Services', 'Backup & Recovery', 'Hardware as a Service'
]

export default function TestimonialsPage() {
  const { language } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedService, setSelectedService] = useState('All')

  // Filter testimonials
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (language === 'nl' ? testimonial.quoteNL : testimonial.quote).toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesService = selectedService === 'All' || 
                          testimonial.service === selectedService ||
                          testimonial.serviceNL === selectedService
    
    return matchesSearch && matchesService
  })

  const featuredTestimonials = testimonials.filter(t => t.featured)
  const averageRating = testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length
  const totalReviews = 250 // Realistische aantal klanten voor Workflo

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-background py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg"
            >
              <Quote className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl lg:text-6xl font-bold text-foreground mb-6"
            >
              {language === 'nl' ? 'Klantverhalen' : 'Client Success Stories'}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-muted-foreground mb-8"
            >
              {language === 'nl' 
                ? 'Ontdek waarom bedrijven in Amsterdam Workflo vertrouwen voor hun IT-behoeften'
                : 'Discover why businesses across Amsterdam trust Workflo for their IT needs'
              }
            </motion.p>
            
            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-8 text-center"
            >
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-workflo-yellow fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-lg">{averageRating.toFixed(1)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold">{totalReviews} {language === 'nl' ? 'Reviews' : 'Reviews'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <span className="font-semibold">{language === 'nl' ? '100% Tevredenheid' : '100% Satisfaction'}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Logos Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {language === 'nl' ? 'Vertrouwd door toonaangevende bedrijven' : 'Trusted by leading companies'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'nl' 
                ? 'Van startups tot enterprise - wij ondersteunen bedrijven van elke grootte'
                : 'From startups to enterprise - we support businesses of every size'
              }
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-70 hover:opacity-100 transition-opacity">
            {companyLogos.map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              >
                <Image
                  src={company.logo}
                  alt={`${company.name} logo`}
                  width={120}
                  height={60}
                  className="object-contain max-h-12 w-auto"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonials Carousel */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {language === 'nl' ? 'Uitgelichte Verhalen' : 'Featured Stories'}
            </h2>
            <p className="text-xl text-muted-foreground">
              {language === 'nl' 
                ? 'Onze meest impactvolle klantervaringen'
                : 'Our most impactful client experiences'
              }
            </p>
          </div>
          <TestimonialsCarousel testimonials={featuredTestimonials} />
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {language === 'nl' ? 'Alle Klantbeoordelingen' : 'All Client Reviews'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'nl' 
                  ? 'Zoek en filter door onze reviews om ervaringen te vinden die bij jouw situatie passen'
                  : 'Search and filter through our reviews to find experiences that match your situation'
                }
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder={language === 'nl' ? 'Zoek op naam, bedrijf of review...' : 'Search by name, company or review...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Service Filter */}
              <div className="lg:w-64">
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                >
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service === 'All' 
                        ? (language === 'nl' ? 'Alle Diensten' : 'All Services')
                        : service
                      }
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {language === 'nl' 
                  ? `${filteredTestimonials.length} van ${testimonials.length} weergegeven reviews`
                  : `${filteredTestimonials.length} of ${testimonials.length} displayed reviews`
                }
              </p>
              
              {selectedService !== 'All' && (
                <Badge variant="outline" className="gap-1">
                  <Filter className="w-3 h-3" />
                  {selectedService}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* All Testimonials Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredTestimonials.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {language === 'nl' ? 'Geen reviews gevonden' : 'No reviews found'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {language === 'nl' 
                  ? 'Probeer een andere zoekterm of filter'
                  : 'Try a different search term or filter'
                }
              </p>
              <Button 
                variant="outline" 
                onClick={() => { setSearchTerm(''); setSelectedService('All') }}
              >
                {language === 'nl' ? 'Wis filters' : 'Clear filters'}
              </Button>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {filteredTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <TestimonialCard testimonial={testimonial} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="w-16 h-16 bg-black/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-8 h-8" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {language === 'nl' ? 'Klaar om je IT te transformeren?' : 'Ready to Transform Your IT?'}
            </h2>
            
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {language === 'nl' 
                ? 'Sluit je aan bij honderden tevreden bedrijven die Workflo vertrouwen met hun technologiebehoeften'
                : 'Join hundreds of satisfied businesses that trust Workflo with their technology needs'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                <Link href="/contact">
                  {language === 'nl' ? 'Neem Contact Op' : 'Get Started'}
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link href="/tevredenheidscheck">
                  {language === 'nl' ? 'Gratis IT-check' : 'Free IT Health Check'}
                </Link>
              </Button>
            </div>
            
            <div className="mt-12 pt-12 border-t border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">{totalReviews}+</div>
                  <div className="text-sm opacity-80">
                    {language === 'nl' ? 'Tevreden Klanten' : 'Happy Clients'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">99.9%</div>
                  <div className="text-sm opacity-80">
                    {language === 'nl' ? 'Uptime Garantie' : 'Uptime Guarantee'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">24/7</div>
                  <div className="text-sm opacity-80">
                    {language === 'nl' ? 'Support & Monitoring' : 'Support & Monitoring'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
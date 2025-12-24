'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { motion } from '@/lib/framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '@/lib/contexts/language-context'
import { getPublishedCases } from '@/lib/cases-api'
import type { CaseStudy } from '@/types/cases'
import {
  Clock,
  Users,
  Building2,
  CheckCircle,
  ArrowRight,
  Filter,
  Target,
  TrendingUp,
  Award,
  Quote
} from 'lucide-react'

export default function CaseStudiesPage() {
  const { language } = useLanguage()
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [selectedService, setSelectedService] = useState('all')

  useEffect(() => {
    async function loadCases() {
      try {
        const response = await getPublishedCases({ limit: 100 })
        setCaseStudies(response.cases)
      } catch (error) {
        console.error('Error loading case studies:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCases()
  }, [])

  const filteredCaseStudies = useMemo(() => {
    let filtered = caseStudies

    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(cs => cs.client_industry === selectedIndustry)
    }

    if (selectedService !== 'all') {
      filtered = filtered.filter(cs => cs.services_used?.includes(selectedService))
    }

    return filtered
  }, [caseStudies, selectedIndustry, selectedService])

  const featuredCaseStudy = caseStudies.find(cs => cs.is_featured)

  // Extract unique industries and services from the data
  const industries = Array.from(new Set(caseStudies.map(cs => cs.client_industry).filter(Boolean)))
  const services = Array.from(new Set(caseStudies.flatMap(cs => cs.services_used || []).filter(Boolean)))

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-primary/5 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
                {language === 'nl' ? 'Case Studies' : 'Case Studies'}
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground mb-8">
                {language === 'nl'
                  ? 'Ontdek hoe we bedrijven transformeren met innovatieve IT-oplossingen'
                  : 'Discover how we transform businesses with innovative IT solutions'
                }
              </p>
              {!loading && (
                <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    <span>{caseStudies.length}+ {language === 'nl' ? 'Succesvolle projecten' : 'Successful projects'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span>{language === 'nl' ? '99%+ Klanttevredenheid' : '99%+ Client satisfaction'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    <span>{language === 'nl' ? 'Meetbare resultaten' : 'Measurable results'}</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Case Study */}
      {featuredCaseStudy && (
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-12">
                <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
                  {language === 'nl' ? 'Uitgelicht' : 'Featured'}
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {language === 'nl' ? 'Uitgelichte Case Study' : 'Featured Case Study'}
                </h2>
              </div>

              <Card className="overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="grid lg:grid-cols-2">
                  <div className="relative h-64 lg:h-auto bg-gradient-to-br from-primary/10 to-primary/5">
                    {featuredCaseStudy.featured_image_url ? (
                      <img
                        src={featuredCaseStudy.featured_image_url}
                        alt={featuredCaseStudy.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-24 h-24 text-primary/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-8 lg:p-12">
                    <div className="mb-6">
                      <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                        {featuredCaseStudy.title}
                      </h3>
                      {featuredCaseStudy.tagline && (
                        <p className="text-lg text-primary font-medium mb-2">
                          {featuredCaseStudy.tagline}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          <span>{featuredCaseStudy.client_name}</span>
                        </div>
                        {featuredCaseStudy.client_industry && (
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            <span className="capitalize">{featuredCaseStudy.client_industry}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          {language === 'nl' ? 'Resultaten' : 'Results'}
                        </h4>
                        <p className="text-muted-foreground line-clamp-3">
                          {featuredCaseStudy.results}
                        </p>
                      </div>

                      {featuredCaseStudy.testimonial && (
                        <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                          <Quote className="w-6 h-6 text-primary mb-2" />
                          <p className="text-sm text-foreground italic mb-2">
                            "{featuredCaseStudy.testimonial}"
                          </p>
                          {featuredCaseStudy.testimonial_author && (
                            <p className="text-xs text-muted-foreground">
                              — {featuredCaseStudy.testimonial_author}
                              {featuredCaseStudy.testimonial_role && `, ${featuredCaseStudy.testimonial_role}`}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <Button asChild className="mt-6 w-full">
                      <Link href={`/case-studies/${featuredCaseStudy.slug}`}>
                        {language === 'nl' ? 'Lees het volledige verhaal' : 'Read full story'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {language === 'nl' ? 'Filter resultaten' : 'Filter results'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={language === 'nl' ? 'Alle sectoren' : 'All industries'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'nl' ? 'Alle sectoren' : 'All industries'}</SelectItem>
                    {industries.map(industry => (
                      <SelectItem key={industry} value={industry!} className="capitalize">
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {services.length > 0 && (
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder={language === 'nl' ? 'Alle diensten' : 'All services'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'nl' ? 'Alle diensten' : 'All services'}</SelectItem>
                      {services.map(service => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : filteredCaseStudies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {language === 'nl'
                    ? 'Geen case studies gevonden met de geselecteerde filters.'
                    : 'No case studies found with the selected filters.'}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCaseStudies
                  .filter(cs => !cs.is_featured) // Don't show featured case in grid
                  .map((caseStudy) => (
                    <motion.div
                      key={caseStudy.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Card className="h-full hover:shadow-xl transition-all group">
                        <CardHeader>
                          {caseStudy.featured_image_url && (
                            <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-lg">
                              <img
                                src={caseStudy.featured_image_url}
                                alt={caseStudy.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{caseStudy.client_name}</span>
                          </div>
                          <CardTitle className="group-hover:text-primary transition-colors">
                            {caseStudy.title}
                          </CardTitle>
                          {caseStudy.tagline && (
                            <p className="text-sm text-muted-foreground mt-2">{caseStudy.tagline}</p>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                            {caseStudy.challenge}
                          </p>

                          {caseStudy.services_used && caseStudy.services_used.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {caseStudy.services_used.slice(0, 3).map((service, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <Button asChild variant="outline" className="w-full group-hover:border-primary group-hover:text-primary">
                            <Link href={`/case-studies/${caseStudy.slug}`}>
                              {language === 'nl' ? 'Meer lezen' : 'Read more'}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              {language === 'nl' ? 'Klaar voor jouw succes verhaal?' : 'Ready for your success story?'}
            </h2>
            <p className="text-xl opacity-90 mb-8">
              {language === 'nl'
                ? 'Neem vandaag nog contact met ons op en ontdek hoe we jouw bedrijf kunnen transformeren'
                : 'Contact us today and discover how we can transform your business'
              }
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                {language === 'nl' ? 'Neem contact op' : 'Get in touch'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
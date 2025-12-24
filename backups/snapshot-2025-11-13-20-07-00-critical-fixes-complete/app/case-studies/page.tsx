'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from '@/lib/framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '@/lib/contexts/language-context'
import { caseStudies, industries, serviceTypes, type CaseStudy } from '@/lib/data/case-studies-data'
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
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [selectedService, setSelectedService] = useState('all')

  const filteredCaseStudies = useMemo(() => {
    let filtered = caseStudies

    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(cs => cs.industry === selectedIndustry)
    }

    if (selectedService !== 'all') {
      filtered = filtered.filter(cs => cs.tags.includes(selectedService))
    }

    return filtered
  }, [selectedIndustry, selectedService])

  const featuredCaseStudy = caseStudies.find(cs => cs.featured)

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

              <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-gray-50 to-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="p-8 lg:p-12">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">{featuredCaseStudy.clientName}</h3>
                        <p className="text-muted-foreground">
                          {language === 'nl' ? featuredCaseStudy.industryNL : featuredCaseStudy.industry}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-foreground mb-2">
                          {language === 'nl' ? 'Uitdaging' : 'Challenge'}
                        </h4>
                        <p className="text-muted-foreground">
                          {language === 'nl' ? featuredCaseStudy.challengeNL : featuredCaseStudy.challenge}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-foreground mb-2">
                          {language === 'nl' ? 'Oplossing' : 'Solution'}
                        </h4>
                        <p className="text-muted-foreground">
                          {language === 'nl' ? featuredCaseStudy.solutionNL : featuredCaseStudy.solution}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {featuredCaseStudy.technologies.map((tech, index) => (
                          <Badge key={index} variant="outline" className="border-primary text-primary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-8 lg:p-12 bg-primary/5">
                    <h4 className="text-lg font-semibold text-foreground mb-6">
                      {language === 'nl' ? 'Resultaten' : 'Results'}
                    </h4>
                    <div className="space-y-4 mb-8">
                      {(language === 'nl' ? featuredCaseStudy.resultsNL : featuredCaseStudy.results).map((result, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{result}</span>
                        </div>
                      ))}
                    </div>

                    {featuredCaseStudy.testimonial && (
                      <div className="bg-card p-6 rounded-lg border-l-4 border-primary">
                        <Quote className="w-6 h-6 text-primary mb-3" />
                        <p className="text-muted-foreground italic mb-4">
                          &ldquo;{language === 'nl' ? featuredCaseStudy.testimonial.quoteNL : featuredCaseStudy.testimonial.quote}&rdquo;
                        </p>
                        <div className="text-sm">
                          <p className="font-semibold text-foreground">{featuredCaseStudy.testimonial.author}</p>
                          <p className="text-muted-foreground">
                            {language === 'nl' ? featuredCaseStudy.testimonial.roleNL : featuredCaseStudy.testimonial.role}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-card rounded-lg">
                        <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">{language === 'nl' ? 'Duur' : 'Duration'}</p>
                        <p className="font-semibold">
                          {language === 'nl' ? featuredCaseStudy.durationNL : featuredCaseStudy.duration}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-card rounded-lg">
                        <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">{language === 'nl' ? 'Team' : 'Team'}</p>
                        <p className="font-semibold">{featuredCaseStudy.teamSize} {language === 'nl' ? 'experts' : 'experts'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="py-8 bg-muted/50 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground">
                {language === 'nl' ? 'Filter case studies' : 'Filter case studies'}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  {language === 'nl' ? 'Sector' : 'Industry'}
                </label>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry.value} value={industry.value}>
                        {language === 'nl' ? industry.labelNL : industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  {language === 'nl' ? 'Service' : 'Service'}
                </label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((service) => (
                      <SelectItem key={service.value} value={service.value}>
                        {language === 'nl' ? service.labelNL : service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              {language === 'nl' 
                ? `${filteredCaseStudies.length} van ${caseStudies.length} case studies weergegeven`
                : `Showing ${filteredCaseStudies.length} of ${caseStudies.length} case studies`
              }
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCaseStudies.map((caseStudy, index) => (
                <motion.div
                  key={caseStudy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <CaseStudyCard caseStudy={caseStudy} language={language} />
                </motion.div>
              ))}
            </div>

            {filteredCaseStudies.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {language === 'nl' ? 'Geen case studies gevonden' : 'No case studies found'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {language === 'nl' 
                    ? 'Probeer je filters aan te passen om meer resultaten te zien.'
                    : 'Try adjusting your filters to see more results.'
                  }
                </p>
                <Button 
                  onClick={() => {
                    setSelectedIndustry('all')
                    setSelectedService('all')
                  }}
                  variant="outline"
                >
                  {language === 'nl' ? 'Filters wissen' : 'Clear filters'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              {language === 'nl' 
                ? 'Klaar om je IT-uitdagingen op te lossen?'
                : 'Ready to solve your IT challenges?'
              }
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              {language === 'nl' 
                ? 'Laat ons je helpen dezelfde resultaten te behalen als onze andere klanten.'
                : 'Let us help you achieve the same results as our other clients.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/contact">
                  {language === 'nl' ? 'Start gesprek' : 'Start conversation'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link href="/tevredenheidscheck">
                  {language === 'nl' ? 'Gratis IT-check' : 'Free IT check'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function CaseStudyCard({ caseStudy, language }: { caseStudy: CaseStudy; language: string }) {
  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {caseStudy.clientName}
            </CardTitle>
            <p className="text-sm text-muted-foreground capitalize">
              {language === 'nl' ? caseStudy.industryNL : caseStudy.industry}
            </p>
          </div>
        </div>
        
        <Badge variant="outline" className="w-fit border-primary text-primary">
          {language === 'nl' ? caseStudy.projectTypeNL : caseStudy.projectType}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm line-clamp-3">
          {language === 'nl' ? caseStudy.challengeNL : caseStudy.challenge}
        </p>

        <div className="space-y-2">
          <h4 className="font-semibold text-foreground text-sm">
            {language === 'nl' ? 'Belangrijkste resultaten:' : 'Key results:'}
          </h4>
          <div className="space-y-1">
            {(language === 'nl' ? caseStudy.resultsNL : caseStudy.results).slice(0, 2).map((result, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{result}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {caseStudy.technologies.slice(0, 3).map((tech, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {caseStudy.technologies.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{caseStudy.technologies.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {language === 'nl' ? caseStudy.durationNL : caseStudy.duration}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {caseStudy.teamSize}
            </div>
          </div>
          
          <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  )
}
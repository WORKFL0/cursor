'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLanguage } from '@/lib/contexts/language-context'
import { projects, projectCategories, technologyTags, getFeaturedProjects, type Project } from '@/lib/data/portfolio-data'
import { 
  Clock, 
  Users, 
  Monitor, 
  CheckCircle, 
  ArrowRight, 
  Filter,
  Target,
  Layers,
  Award,
  ExternalLink,
  Github,
  Calendar,
  Tag,
  Zap,
  TrendingUp
} from 'lucide-react'

export default function PortfolioPage() {
  const { language } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTechnology, setSelectedTechnology] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'detailed'>('grid')

  const filteredProjects = useMemo(() => {
    let filtered = projects

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    if (selectedTechnology !== 'all') {
      filtered = filtered.filter(p => p.tags.includes(selectedTechnology))
    }

    return filtered
  }, [selectedCategory, selectedTechnology])

  const featuredProjects = getFeaturedProjects()

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
                {language === 'nl' ? 'Ons Portfolio' : 'Our Portfolio'}
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground mb-8">
                {language === 'nl' 
                  ? 'Ontdek onze innovatieve IT-projecten en technische oplossingen'
                  : 'Discover our innovative IT projects and technical solutions'
                }
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span>{projects.length}+ {language === 'nl' ? 'Afgeronde projecten' : 'Completed projects'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  <span>{language === 'nl' ? 'Diverse technologieën' : 'Diverse technologies'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span>{language === 'nl' ? 'Bewezen resultaten' : 'Proven results'}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
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
                {language === 'nl' ? 'Uitgelichte Projecten' : 'Featured Projects'}
              </h2>
              <p className="text-lg text-muted-foreground">
                {language === 'nl' 
                  ? 'Onze meest impactvolle en innovatieve IT-oplossingen'
                  : 'Our most impactful and innovative IT solutions'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <FeaturedProjectCard project={project} language={language} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters and View Toggle */}
      <section className="py-8 bg-muted/50 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground">
                  {language === 'nl' ? 'Filter projecten' : 'Filter projects'}
                </h3>
              </div>

              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'detailed')}>
                <TabsList>
                  <TabsTrigger value="grid" className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    {language === 'nl' ? 'Grid' : 'Grid'}
                  </TabsTrigger>
                  <TabsTrigger value="detailed" className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    {language === 'nl' ? 'Gedetailleerd' : 'Detailed'}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  {language === 'nl' ? 'Categorie' : 'Category'}
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projectCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {language === 'nl' ? category.labelNL : category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  {language === 'nl' ? 'Technologie' : 'Technology'}
                </label>
                <Select value={selectedTechnology} onValueChange={setSelectedTechnology}>
                  <SelectTrigger className="bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {technologyTags.map((tech) => (
                      <SelectItem key={tech.value} value={tech.value}>
                        {language === 'nl' ? tech.labelNL : tech.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              {language === 'nl' 
                ? `${filteredProjects.length} van ${projects.length} projecten weergegeven`
                : `Showing ${filteredProjects.length} of ${projects.length} projects`
              }
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid/List */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <ProjectCard project={project} language={language} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <DetailedProjectCard project={project} language={language} />
                  </motion.div>
                ))}
              </div>
            )}

            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {language === 'nl' ? 'Geen projecten gevonden' : 'No projects found'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {language === 'nl' 
                    ? 'Probeer je filters aan te passen om meer resultaten te zien.'
                    : 'Try adjusting your filters to see more results.'
                  }
                </p>
                <Button 
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedTechnology('all')
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

      {/* Technology Stack Carousel */}
      <section className="py-16 bg-gradient-to-br from-muted/50 via-background to-muted/50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4" variant="outline">
                <Zap className="w-3 h-3 mr-1" />
                Technology Partners
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                {language === 'nl' ? 'Onze Technologie Stack' : 'Our Technology Stack'}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {language === 'nl' 
                  ? 'We werken met de nieuwste technologieën en best practices'
                  : 'We work with the latest technologies and best practices'
                }
              </p>
            </motion.div>
            
            {/* Infinite Scroll Carousel */}
            <div className="relative">
              {/* First Row - Scrolling Left */}
              <div className="flex overflow-hidden mb-8">
                <motion.div
                  className="flex gap-8 items-center"
                  animate={{
                    x: [0, -2400],
                  }}
                  transition={{
                    x: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 40,
                      ease: "linear",
                    },
                  }}
                >
                  {[...Array(2)].map((_, setIndex) => (
                    <div key={setIndex} className="flex gap-8">
                      {['Microsoft', 'Office 365', 'Google', 'G-Suite', 'Apple', 'Adobe', 'HP', 'Dell'].map((tech, index) => (
                        <div
                          key={`${setIndex}-${index}`}
                          className="flex-shrink-0 w-40 h-20 bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center p-4 group hover:scale-105"
                        >
                          <div className="text-center">
                            <p className="font-bold text-foreground group-hover:text-primary transition-colors">{tech}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Second Row - Scrolling Right */}
              <div className="flex overflow-hidden mb-8">
                <motion.div
                  className="flex gap-8 items-center"
                  animate={{
                    x: [-2400, 0],
                  }}
                  transition={{
                    x: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 45,
                      ease: "linear",
                    },
                  }}
                >
                  {[...Array(2)].map((_, setIndex) => (
                    <div key={setIndex} className="flex gap-8">
                      {['Cisco', 'Meraki', 'Sophos', 'Ruckus', 'FortiNet', 'Ubiquiti', 'AWS', 'Synology', 'Dropbox'].map((tech, index) => (
                        <div
                          key={`${setIndex}-${index}`}
                          className="flex-shrink-0 w-40 h-20 bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center p-4 group hover:scale-105"
                        >
                          <div className="text-center">
                            <p className="font-bold text-foreground group-hover:text-primary transition-colors">{tech}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* "And many more" text */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-center mt-8"
              >
                <p className="text-lg font-medium text-muted-foreground italic">
                  {language === 'nl' ? '...en vele anderen' : '...and many more'}
                </p>
              </motion.div>
            </div>

            {/* Partner Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto"
            >
              <div className="text-center p-4 bg-card rounded-lg">
                <div className="text-3xl font-bold text-primary mb-1">25+</div>
                <div className="text-sm text-muted-foreground">Technology Partners</div>
              </div>
              <div className="text-center p-4 bg-card rounded-lg">
                <div className="text-3xl font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Licensed Software</div>
              </div>
              <div className="text-center p-4 bg-card rounded-lg">
                <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Vendor Support</div>
              </div>
              <div className="text-center p-4 bg-card rounded-lg">
                <div className="text-3xl font-bold text-primary mb-1">10+</div>
                <div className="text-sm text-muted-foreground">Certifications</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              {language === 'nl' 
                ? 'Klaar voor je volgende project?'
                : 'Ready for your next project?'
              }
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              {language === 'nl' 
                ? 'Laat ons je helpen je IT-doelen te realiseren met bewezen oplossingen.'
                : 'Let us help you achieve your IT goals with proven solutions.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/contact">
                  {language === 'nl' ? 'Start je project' : 'Start your project'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link href="/case-studies">
                  {language === 'nl' ? 'Bekijk case studies' : 'View case studies'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeaturedProjectCard({ project, language }: { project: Project; language: string }) {
  return (
    <Card className="h-full overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group">
      <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <Monitor className="w-16 h-16 text-primary/60" />
        </div>
        <Badge className="absolute top-4 right-4 bg-primary text-black">
          {language === 'nl' ? 'Uitgelicht' : 'Featured'}
        </Badge>
      </div>

      <CardHeader>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {language === 'nl' ? project.titleNL : project.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {project.client} • {language === 'nl' ? project.categoryNL : project.category}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-3">
          {language === 'nl' ? project.descriptionNL : project.description}
        </p>

        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-2">
              {language === 'nl' ? 'Belangrijkste resultaten:' : 'Key results:'}
            </h4>
            <div className="space-y-1">
              {(language === 'nl' ? project.resultsNL : project.results).slice(0, 2).map((result, index) => (
                <div key={index} className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{result}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{project.technologies.length - 3}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {language === 'nl' ? project.durationNL : project.duration}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {project.teamSize}
            </div>
          </div>
          
          <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectCard({ project, language }: { project: Project; language: string }) {
  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer">
      <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-50">
        <div className="absolute inset-0 flex items-center justify-center">
          <Monitor className="w-12 h-12 text-muted-foreground" />
        </div>
        <Badge variant="outline" className="absolute top-3 right-3 text-xs border-primary text-primary">
          {language === 'nl' ? project.categoryNL : project.category}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
          {language === 'nl' ? project.titleNL : project.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{project.client}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm line-clamp-3">
          {language === 'nl' ? project.descriptionNL : project.description}
        </p>

        <div className="flex flex-wrap gap-1">
          {project.technologies.slice(0, 2).map((tech, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{project.technologies.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-center pt-3 border-t">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {language === 'nl' ? project.durationNL : project.duration}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {project.teamSize}
            </div>
          </div>
          
          <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  )
}

function DetailedProjectCard({ project, language }: { project: Project; language: string }) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        <div className="lg:col-span-1 relative h-64 lg:h-auto bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="absolute inset-0 flex items-center justify-center">
            <Monitor className="w-20 h-20 text-primary/40" />
          </div>
          <Badge className="absolute top-4 left-4 bg-primary text-black">
            {language === 'nl' ? project.categoryNL : project.category}
          </Badge>
        </div>

        <div className="lg:col-span-2 p-6 lg:p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {language === 'nl' ? project.titleNL : project.title}
              </h3>
              <p className="text-muted-foreground">{project.client}</p>
            </div>
            
            <div className="text-right text-sm text-muted-foreground">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="w-4 h-4" />
                {new Date(project.completedDate).getFullYear()}
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className={`text-xs ${
                  project.status === 'completed' ? 'border-green-500 text-green-700' : 
                  project.status === 'in-progress' ? 'border-blue-500 text-blue-700' : 
                  'border-gray-500 text-muted-foreground'
                }`}>
                  {language === 'nl' ? project.statusNL : project.status}
                </Badge>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground mb-6">
            {language === 'nl' ? project.descriptionNL : project.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                {language === 'nl' ? 'Belangrijkste functies:' : 'Key features:'}
              </h4>
              <div className="space-y-2">
                {(language === 'nl' ? project.featuresNL : project.features).slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">
                {language === 'nl' ? 'Resultaten:' : 'Results:'}
              </h4>
              <div className="space-y-2">
                {(language === 'nl' ? project.resultsNL : project.results).slice(0, 3).map((result, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{result}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech, index) => (
              <Badge key={index} variant="outline" className="border-primary text-primary">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{language === 'nl' ? project.durationNL : project.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{project.teamSize} {language === 'nl' ? 'experts' : 'experts'}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {project.projectUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {language === 'nl' ? 'Bekijk project' : 'View project'}
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
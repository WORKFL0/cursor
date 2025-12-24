'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, Search, HelpCircle, Phone, Mail, Filter, X, Star, MessageCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { motion, AnimatePresence } from '@/lib/framer-motion'
import { useLanguage, useLocalizedContent } from '@/lib/contexts/language-context'
import { faqData } from '@/lib/data/workflo-data'

export default function FAQPage() {
  const { language } = useLanguage()
  const { getLocalizedValue } = useLocalizedContent()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  // Memoized calculations for performance
  const { categories, filteredFaqs, featuredFaqs } = useMemo(() => {
    // Group FAQs by category
    const categories = [...new Set(faqData.map(faq => language === 'nl' ? faq.categoryNL : faq.category))]
    
    // Filter FAQs based on search term and category
    const filteredFaqs = faqData.filter(faq => {
      const question = language === 'nl' ? faq.questionNL : faq.question
      const answer = language === 'nl' ? faq.answerNL : faq.answer
      const category = language === 'nl' ? faq.categoryNL : faq.category
      
      const matchesSearch = !searchTerm || 
        question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        answer.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || category === selectedCategory
      
      return matchesSearch && matchesCategory
    })

    const featuredFaqs = faqData.filter(faq => faq.featured).slice(0, 6)
    
    return { categories, filteredFaqs, featuredFaqs }
  }, [language, searchTerm, selectedCategory])

  const getFaqsByCategory = (category: string) => {
    return filteredFaqs.filter(faq => {
      const faqCategory = language === 'nl' ? faq.categoryNL : faq.category
      return faqCategory === category
    }).sort((a, b) => a.order - b.order)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
  }

  const handleAccordionChange = (value: string) => {
    setOpenAccordion(openAccordion === value ? null : value)
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <HelpCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {language === 'nl' ? 'Veelgestelde Vragen' : 'Frequently Asked Questions'}
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8">
              {language === 'nl' 
                ? 'Vind snel antwoorden op je IT-vragen'
                : 'Find quick answers to your IT questions'
              }
            </p>
            
            {/* Search Bar */}
            <div className="max-w-lg mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder={language === 'nl' ? 'Zoek in vragen...' : 'Search questions...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured FAQs */}
      {!searchTerm && (
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {language === 'nl' ? 'Meestgestelde Vragen' : 'Most Popular Questions'}
                </h2>
                <p className="text-xl text-muted-foreground">
                  {language === 'nl' 
                    ? 'De vragen die we het vaakst krijgen'
                    : 'The questions we get asked most often'
                  }
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {featuredFaqs.map((faq) => (
                  <Card key={faq.id} className="bg-card shadow-lg border-2 border-border hover:border-primary transition-all">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {language === 'nl' ? faq.questionNL : faq.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {(language === 'nl' ? faq.answerNL : faq.answer).substring(0, 120)}...
                      </p>
                      <span className="inline-flex items-center text-sm font-medium text-primary">
                        {language === 'nl' ? 'Lees meer' : 'Read more'}
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {!searchTerm && (
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {language === 'nl' ? 'Alle Vragen' : 'All Questions'}
                </h2>
                <p className="text-xl text-muted-foreground">
                  {language === 'nl' 
                    ? 'Bekijk vragen per categorie'
                    : 'Browse questions by category'
                  }
                </p>
              </div>
            )}

            {searchTerm && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {language === 'nl' ? `Zoekresultaten voor "${searchTerm}"` : `Search results for "${searchTerm}"`}
                </h2>
                <p className="text-muted-foreground">
                  {filteredFaqs.length} {language === 'nl' ? 'resultaten gevonden' : 'results found'}
                </p>
              </div>
            )}

            <Tabs defaultValue={categories[0]} className="w-full">
              {!searchTerm && (
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="text-sm font-medium"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              )}

              {searchTerm ? (
                <div className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-6 mb-4">
                        <AccordionTrigger className="text-left hover:no-underline">
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground text-base">
                                {language === 'nl' ? faq.questionNL : faq.question}
                              </h3>
                              <span className="text-sm text-primary font-medium">
                                {language === 'nl' ? faq.categoryNL : faq.category}
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-4 text-muted-foreground leading-relaxed">
                            {language === 'nl' ? faq.answerNL : faq.answer}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ) : (
                categories.map((category) => (
                  <TabsContent key={category} value={category}>
                    <Accordion type="single" collapsible className="w-full">
                      {getFaqsByCategory(category).map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-6 mb-4">
                          <AccordionTrigger className="text-left hover:no-underline">
                            <h3 className="font-semibold text-foreground text-base">
                              {language === 'nl' ? faq.questionNL : faq.question}
                            </h3>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pt-4 text-muted-foreground leading-relaxed">
                              {language === 'nl' ? faq.answerNL : faq.answer}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>
                ))
              )}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-20 bg-primary text-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'nl' ? 'Nog vragen?' : 'Still have questions?'}
            </h2>
            <p className="text-xl mb-8">
              {language === 'nl' 
                ? 'Ons team staat klaar om al je IT-vragen te beantwoorden'
                : 'Our team is ready to answer all your IT questions'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  {language === 'nl' ? 'Bel ons' : 'Call us'}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-foreground text-foreground hover:bg-foreground hover:text-primary">
                <Link href="/contact">
                  <Mail className="mr-2 h-5 w-5" />
                  {language === 'nl' ? 'Stuur een mail' : 'Send us an email'}
                </Link>
              </Button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-black/20">
              <p className="text-lg font-semibold mb-4">
                {language === 'nl' ? 'Of plan een gratis gesprek' : 'Or schedule a free consultation'}
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">
                  {language === 'nl' ? 'Plan gratis gesprek' : 'Schedule free consultation'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
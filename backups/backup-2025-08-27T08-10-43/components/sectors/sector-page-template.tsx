'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle2, Quote } from 'lucide-react'
import type { SectorPageData } from '@/lib/types/sectors'
import { useLanguage } from '@/lib/contexts/language-context'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface SectorPageTemplateProps {
  data: SectorPageData
}

export default function SectorPageTemplate({ data }: SectorPageTemplateProps) {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4" variant="outline">
                <span className="text-primary">Sector Expertise</span>
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {data.hero.title}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-4">
                {data.hero.subtitle}
              </p>
              
              <p className="text-lg text-muted-foreground mb-8">
                {data.hero.description}
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Button asChild size="lg">
                  <Link href="/contact">
                    Gratis Adviesgesprek
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/diensten">
                    Bekijk Diensten
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.hero.stats?.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="text-center"
                  >
                    {stat.icon && <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />}
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                <div className="text-6xl opacity-50">🏢</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {data.challenges.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {data.challenges.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {data.challenges.items.map((challenge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <challenge.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
                      <p className="text-muted-foreground mb-3">{challenge.description}</p>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium">{challenge.solution}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {data.solutions.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {data.solutions.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.solutions.categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <ul className="space-y-2">
                    {category.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {data.benefits.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {data.benefits.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.benefits.items.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {data.testimonials && data.testimonials.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Wat Klanten Zeggen
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {data.testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full">
                    <Quote className="w-8 h-8 text-primary/20 mb-4" />
                    <p className="text-lg mb-6 italic">{testimonial.content}</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role} - {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Case Study */}
      {data.caseStudy && (
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 lg:p-12 max-w-5xl mx-auto">
                <Badge className="mb-4" variant="outline">Case Study</Badge>
                <h2 className="text-3xl font-bold mb-6">{data.caseStudy.title}</h2>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary">Uitdaging</h3>
                    <p className="text-muted-foreground">{data.caseStudy.challenge}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary">Oplossing</h3>
                    <p className="text-muted-foreground">{data.caseStudy.solution}</p>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold mb-4">Resultaten</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {data.caseStudy.results.map((result, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{result}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {data.caseStudy.quote && (
                  <blockquote className="border-l-4 border-primary pl-6">
                    <p className="text-lg italic mb-2">"{data.caseStudy.quote.content}"</p>
                    <cite className="text-sm text-muted-foreground">
                      — {data.caseStudy.quote.author}, {data.caseStudy.quote.role}
                    </cite>
                  </blockquote>
                )}
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Veelgestelde Vragen
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {data.faq.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {data.cta.title}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {data.cta.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" variant="secondary">
                <Link href={data.cta.primaryButton.href}>
                  {data.cta.primaryButton.text}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {data.cta.secondaryButton && (
                <Button asChild size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                  <Link href={data.cta.secondaryButton.href}>
                    {data.cta.secondaryButton.text}
                  </Link>
                </Button>
              )}
            </div>

            {data.cta.features && (
              <div className="flex flex-wrap justify-center gap-4">
                {data.cta.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
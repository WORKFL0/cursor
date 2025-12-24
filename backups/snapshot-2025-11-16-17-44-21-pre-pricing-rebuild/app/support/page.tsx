'use client'

import { useState } from 'react'
import { motion } from '@/lib/framer-motion'
import { 
  Phone, Mail, MessageCircle, Clock, MapPin, 
  Shield, FileText, HelpCircle, ArrowRight,
  Headphones, Zap, CheckCircle, AlertCircle,
  ExternalLink, Download, BookOpen, Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

export default function SupportPage() {
  const [urgency, setUrgency] = useState<'low' | 'normal' | 'high' | 'critical'>('normal')

  const supportChannels = [
    {
      icon: Phone,
      title: '24/7 Telefoon Support',
      description: 'Direct contact voor urgente zaken',
      contact: '020-30 80 465',
      availability: '24/7 beschikbaar',
      responseTime: 'Direct contact',
      priority: 'critical' as const,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
    },
    {
      icon: MessageCircle,
      title: 'ServiceDesk Portal',
      description: 'Online ticket systeem voor alle issues',
      contact: 'servicedesk.workflo.it',
      availability: 'Altijd toegankelijk',
      responseTime: '< 2 uur response',
      priority: 'high' as const,
      color: 'text-workflo-yellow-dark dark:text-workflo-yellow',
      bgColor: 'bg-workflo-yellow-light dark:bg-workflo-yellow/20',
      link: 'https://servicedesk.workflo.it',
    },
    {
      icon: Mail,
      title: 'E-mail Support',
      description: 'Voor niet-urgente vragen en verzoeken',
      contact: 'support@workflo.it',
      availability: 'Ma-Vr 8:00-18:00',
      responseTime: '< 4 uur response',
      priority: 'normal' as const,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      icon: Headphones,
      title: 'Remote Support',
      description: 'Directe schermovername voor snelle hulp',
      contact: 'Via TeamViewer/AnyDesk',
      availability: 'Op aanvraag',
      responseTime: 'Binnen 15 min',
      priority: 'high' as const,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
  ]

  const priorityGuide = [
    {
      level: 'critical',
      title: 'Kritiek - Bedrijf Stilstand',
      description: 'Complete uitval, geen werk mogelijk',
      examples: ['Netwerk volledig down', 'Alle systemen onbereikbaar', 'Data verlies risico'],
      response: '< 30 minuten',
      color: 'destructive',
    },
    {
      level: 'high',
      title: 'Hoog - Grote Impact',
      description: 'Belangrijk systeem werkt niet, werk gehinderd',
      examples: ['E-mail werkt niet', 'Belangrijke app down', 'Kan niet inloggen'],
      response: '< 2 uur',
      color: 'yellow',
    },
    {
      level: 'normal',
      title: 'Normaal - Beperkte Impact',
      description: 'Hinder maar werk kan doorgaan',
      examples: ['Printer probleem', 'Trage computer', 'Software vraag'],
      response: '< 4 uur',
      color: 'blue',
    },
    {
      level: 'low',
      title: 'Laag - Informatief',
      description: 'Vragen of kleine verbeteringen',
      examples: ['Training verzoek', 'Feature request', 'Algemene vraag'],
      response: '< 8 uur',
      color: 'secondary',
    },
  ]

  const resources = [
    {
      icon: BookOpen,
      title: 'Knowledge Base',
      description: 'Zelf oplossingen vinden',
      link: '/knowledge',
      items: ['How-to guides', 'FAQ\'s', 'Video tutorials'],
    },
    {
      icon: Download,
      title: 'Support Tools',
      description: 'Remote support software',
      link: '/downloads',
      items: ['TeamViewer', 'AnyDesk', 'Diagnostic tools'],
    },
    {
      icon: FileText,
      title: 'Documentatie',
      description: 'Technische documentatie',
      link: '/docs',
      items: ['API docs', 'User manuals', 'Best practices'],
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Gebruikers community',
      link: '/community',
      items: ['Forum', 'User groups', 'Events'],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border-green-300">
              <CheckCircle className="w-3 h-3 mr-1" />
              24/7 Support Beschikbaar
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Workflo Support Center
            </h1>
            <p className="text-xl text-muted-foreground">
              Professionele IT-support wanneer je het nodig hebt. 
              Wij staan klaar om je te helpen, 24 uur per dag, 7 dagen per week.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700"
              asChild
            >
              <Link href="tel:+31203080465">
                <Phone className="w-4 h-4 mr-2" />
                Bel Direct: 020-30 80 465
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              asChild
            >
              <a href="https://servicedesk.workflo.it" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open ServiceDesk Portal
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              asChild
            >
              <Link href="/downloads">
                <Download className="w-4 h-4 mr-2" />
                Download Support Tools
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Kies Je Support Kanaal</h2>
              <p className="text-lg text-muted-foreground">
                Verschillende manieren om hulp te krijgen, afhankelijk van je urgentie
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {supportChannels.map((channel, index) => (
                <motion.div
                  key={channel.title}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className={`h-full hover:shadow-lg transition-shadow ${channel.bgColor}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg bg-white dark:bg-gray-900 shadow-sm`}>
                            <channel.icon className={`w-6 h-6 ${channel.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{channel.title}</CardTitle>
                            <CardDescription>{channel.description}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Contact:</span>
                          <span className="font-medium">
                            {channel.link ? (
                              <a href={channel.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {channel.contact}
                              </a>
                            ) : (
                              channel.contact
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Beschikbaar:</span>
                          <span className="font-medium">{channel.availability}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Response tijd:</span>
                          <Badge variant="secondary">{channel.responseTime}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Priority Guide */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Prioriteit Richtlijnen</h2>
              <p className="text-lg text-muted-foreground">
                Help ons je sneller te helpen door de juiste prioriteit te kiezen
              </p>
            </div>

            <Tabs defaultValue="critical" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="critical" className="text-xs">Kritiek</TabsTrigger>
                <TabsTrigger value="high" className="text-xs">Hoog</TabsTrigger>
                <TabsTrigger value="normal" className="text-xs">Normaal</TabsTrigger>
                <TabsTrigger value="low" className="text-xs">Laag</TabsTrigger>
              </TabsList>
              
              {priorityGuide.map((priority) => (
                <TabsContent key={priority.level} value={priority.level}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {priority.level === 'critical' && <AlertCircle className="w-5 h-5 text-red-600" />}
                        {priority.title}
                      </CardTitle>
                      <CardDescription>{priority.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Voorbeelden:</p>
                          <ul className="space-y-1">
                            {priority.examples.map((example) => (
                              <li key={example} className="text-sm text-muted-foreground flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t">
                          <span className="text-sm text-muted-foreground">Response tijd:</span>
                          <Badge variant={priority.color as any}>{priority.response}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Self-Service Resources</h2>
              <p className="text-lg text-muted-foreground">
                Vind zelf snel antwoorden en oplossingen
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {resources.map((resource, index) => (
                <motion.div
                  key={resource.title}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <resource.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                          <CardDescription>{resource.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-4">
                        {resource.items.map((item) => (
                          <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                            <ArrowRight className="w-3 h-3" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={resource.link}>
                          Bekijk {resource.title}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Direct Contact</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div>
                <Phone className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Telefoon</h3>
                <p className="text-gray-300">24/7 Bereikbaar</p>
                <a href="tel:+31203080465" className="text-primary hover:underline">
                  020-30 80 465
                </a>
              </div>
              
              <div>
                <Mail className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">E-mail</h3>
                <p className="text-gray-300">Response &lt; 4 uur</p>
                <a href="mailto:support@workflo.it" className="text-primary hover:underline">
                  support@workflo.it
                </a>
              </div>
              
              <div>
                <MapPin className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Kantoor</h3>
                <p className="text-gray-300">Amsterdam</p>
                <p className="text-sm">Koivistokade 3, 1013 AC</p>
              </div>
            </div>

            <Alert className="bg-primary/10 border-primary/20 text-white">
              <Shield className="w-4 h-4" />
              <AlertDescription>
                <strong>SLA Garantie:</strong> Wij garanderen response tijden volgens je service level agreement. 
                Kritieke issues worden altijd met hoogste prioriteit behandeld.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>
    </div>
  )
}
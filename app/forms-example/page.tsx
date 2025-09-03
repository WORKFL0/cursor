/**
 * Example page showing the new HubSpot-integrated forms
 * This is for testing and demonstration purposes
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ContactForm } from '@/components/forms/ContactForm'
import { QuoteForm } from '@/components/forms/QuoteForm'
import { NewsletterForm, InlineNewsletterSignup } from '@/components/forms/NewsletterForm'
import { HubSpotContactForm } from '@/components/forms/HubSpotContactForm'
import { HubSpotNewsletterSignup } from '@/components/forms/HubSpotNewsletterSignup'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  AlertCircle, 
  Mail, 
  MessageSquare, 
  FileText,
  Shield,
  Zap,
  Database,
  Globe
} from 'lucide-react'

export default function FormsExamplePage() {
  const [activeTab, setActiveTab] = useState('new-forms')
  const [formResults, setFormResults] = useState<Record<string, any>>({})

  const handleFormSuccess = (formType: string) => (data: any) => {
    setFormResults(prev => ({
      ...prev,
      [formType]: { success: true, data, timestamp: new Date().toLocaleString() }
    }))
    console.log(`${formType} form success:`, data)
  }

  const handleFormError = (formType: string) => (error: string) => {
    setFormResults(prev => ({
      ...prev,
      [formType]: { success: false, error, timestamp: new Date().toLocaleString() }
    }))
    console.error(`${formType} form error:`, error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            HubSpot Forms Integration Demo
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Showcase van de nieuwe formulieren met HubSpot integratie, validatie, en graceful degradation.
          </p>
          
          {/* Status indicators */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="outline" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              GDPR Compliant
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Real-time Validation
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              HubSpot Integration
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Graceful Fallback
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="new-forms">Nieuwe Formulieren</TabsTrigger>
            <TabsTrigger value="legacy-forms">Legacy HubSpot</TabsTrigger>
            <TabsTrigger value="comparison">Vergelijking</TabsTrigger>
            <TabsTrigger value="results">Resultaten</TabsTrigger>
          </TabsList>

          <TabsContent value="new-forms" className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Contact Formulier
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Volledig gevalideerd contact formulier met HubSpot integratie
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ContactForm
                      onSuccess={handleFormSuccess('contact')}
                      onError={handleFormError('contact')}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Newsletter Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Nieuwsbrief Aanmelding
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Eenvoudige nieuwsbrief signup met marketing automation
                    </p>
                  </CardHeader>
                  <CardContent>
                    <NewsletterForm
                      variant="default"
                      onSuccess={handleFormSuccess('newsletter')}
                      onError={handleFormError('newsletter')}
                      showBenefits={true}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quote Form - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Offerte Aanvraag Formulier
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Uitgebreid formulier voor offerte aanvragen met service selectie
                  </p>
                </CardHeader>
                <CardContent>
                  <QuoteForm
                    onSuccess={handleFormSuccess('quote')}
                    onError={handleFormError('quote')}
                    preselectedServices={['IT Beheer & Support', 'Cybersecurity']}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Inline Newsletter Demo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Inline Nieuwsbrief Varianten</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Verschillende stijlen voor nieuwsbrief integratie
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Compact Variant</h4>
                    <NewsletterForm variant="compact" showBenefits={true} />
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Inline Variant</h4>
                    <InlineNewsletterSignup />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="legacy-forms" className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Legacy HubSpot Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Legacy HubSpot Contact
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Originele HubSpot embedded form
                    </p>
                  </CardHeader>
                  <CardContent>
                    <HubSpotContactForm />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Legacy Newsletter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Legacy Newsletter Signup
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Originele HubSpot newsletter form
                    </p>
                  </CardHeader>
                  <CardContent>
                    <HubSpotNewsletterSignup variant="full" />
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-700">Nieuwe Formulieren</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Real-time validatie
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Graceful degradation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Analytics integratie
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Error handling & retry logic
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Rate limiting
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Honeypot spam protection
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Progress indicators
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Email fallback systeem
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-700">Legacy HubSpot</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Directe HubSpot integratie
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Automatische styling
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      Beperkte error handling
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      Geen fallback bij uitval
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      Beperkte validatie opties
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      Geen analytics integratie
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      Styling beperkingen
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Formulier Resultaten</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Real-time resultaten van formulier submissions
                </p>
              </CardHeader>
              <CardContent>
                {Object.keys(formResults).length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Geen resultaten nog. Probeer een formulier in te vullen!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(formResults).map(([formType, result]) => (
                      <motion.div
                        key={formType}
                        className="p-4 border rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium capitalize">{formType} Form</h4>
                          <div className="flex items-center gap-2">
                            {result.success ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-sm text-muted-foreground">
                              {result.timestamp}
                            </span>
                          </div>
                        </div>
                        <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clear Results</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setFormResults({})}
                  variant="outline"
                  className="w-full"
                >
                  Clear All Results
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Deze formulieren werken met en zonder HubSpot credentials. 
            Fallback naar e-mail notificaties wanneer HubSpot niet beschikbaar is.
          </p>
        </div>
      </div>
    </div>
  )
}
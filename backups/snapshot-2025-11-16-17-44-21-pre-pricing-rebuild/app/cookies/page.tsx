'use client'

import Link from 'next/link'
import { ArrowLeft, Cookie, Settings, BarChart3, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/lib/contexts/language-context'
import { companyInfo } from '@/lib/data/workflo-data'

export default function CookiePolicyPage() {
  const { language } = useLanguage()

  const lastUpdated = new Date('2025-01-01').toLocaleDateString(language === 'nl' ? 'nl-NL' : 'en-GB')

  const cookieTypes = [
    {
      icon: Shield,
      title: language === 'nl' ? 'Essentiële Cookies' : 'Essential Cookies',
      description: language === 'nl' 
        ? 'Noodzakelijk voor het functioneren van de website' 
        : 'Necessary for website functionality',
      duration: language === 'nl' ? 'Sessie/1 jaar' : 'Session/1 year',
      canDisable: false,
      examples: ['Inlogstatus', 'Winkelwagen', 'Beveiligingstokens']
    },
    {
      icon: BarChart3,
      title: language === 'nl' ? 'Analytische Cookies' : 'Analytics Cookies',
      description: language === 'nl' 
        ? 'Helpen ons begrijpen hoe bezoekers onze site gebruiken' 
        : 'Help us understand how visitors use our site',
      duration: language === 'nl' ? '2 jaar' : '2 years',
      canDisable: true,
      examples: ['Google Analytics', 'Hotjar', 'Microsoft Clarity']
    },
    {
      icon: Settings,
      title: language === 'nl' ? 'Functionele Cookies' : 'Functional Cookies',
      description: language === 'nl' 
        ? 'Onthouden je voorkeuren en instellingen' 
        : 'Remember your preferences and settings',
      duration: language === 'nl' ? '1 jaar' : '1 year',
      canDisable: true,
      examples: [language === 'nl' ? 'Taalkeuze' : 'Language preference', language === 'nl' ? 'Cookie voorkeuren' : 'Cookie preferences']
    }
  ]

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === 'nl' ? 'Terug naar home' : 'Back to home'}
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Cookie className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {language === 'nl' ? 'Cookiebeleid' : 'Cookie Policy'}
                </h1>
                <p className="text-muted-foreground">
                  {language === 'nl' ? `Laatst bijgewerkt: ${lastUpdated}` : `Last updated: ${lastUpdated}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Introduction */}
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-xl text-muted-foreground leading-relaxed">
                {language === 'nl' 
                  ? 'Deze cookieverklaring legt uit hoe Workflo B.V. cookies en vergelijkbare technologieën gebruikt op onze website om je de beste ervaring te bieden.'
                  : 'This cookie statement explains how Workflo B.V. uses cookies and similar technologies on our website to provide you with the best experience.'
                }
              </p>
            </div>

            {/* What are cookies */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {language === 'nl' ? 'Wat zijn cookies?' : 'What are cookies?'}
              </h2>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
                <p className="text-blue-800 text-lg">
                  {language === 'nl' 
                    ? 'Cookies zijn kleine tekstbestanden die op je apparaat worden opgeslagen wanneer je een website bezoekt. Ze helpen websites om je voorkeuren te onthouden en je ervaring te verbeteren.'
                    : 'Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your experience.'
                  }
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {language === 'nl' ? 'Voordelen van cookies' : 'Benefits of cookies'}
                  </h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>{language === 'nl' ? 'Snellere website prestaties' : 'Faster website performance'}</li>
                    <li>{language === 'nl' ? 'Gepersonaliseerde ervaring' : 'Personalized experience'}</li>
                    <li>{language === 'nl' ? 'Onthouden van instellingen' : 'Remembering settings'}</li>
                    <li>{language === 'nl' ? 'Betere website functionaliteit' : 'Better website functionality'}</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {language === 'nl' ? 'Jouw controle' : 'Your control'}
                  </h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>{language === 'nl' ? 'Je kunt cookies accepteren of weigeren' : 'You can accept or decline cookies'}</li>
                    <li>{language === 'nl' ? 'Browserinstellingen aanpassen' : 'Adjust browser settings'}</li>
                    <li>{language === 'nl' ? 'Cookies op elk moment verwijderen' : 'Delete cookies at any time'}</li>
                    <li>{language === 'nl' ? 'Voorkeuren wijzigen' : 'Change preferences'}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Cookie Types */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                {language === 'nl' ? 'Soorten cookies die we gebruiken' : 'Types of cookies we use'}
              </h2>
              
              <div className="space-y-6">
                {cookieTypes.map((cookieType, index) => (
                  <Card key={index} className="bg-card shadow-lg border-2 border-border">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <cookieType.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl font-bold text-foreground">
                            {cookieType.title}
                          </CardTitle>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-muted-foreground">
                              {language === 'nl' ? 'Bewaartijd:' : 'Duration:'} {cookieType.duration}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              cookieType.canDisable 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {cookieType.canDisable 
                                ? (language === 'nl' ? 'Optioneel' : 'Optional')
                                : (language === 'nl' ? 'Verplicht' : 'Required')
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {cookieType.description}
                      </p>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">
                          {language === 'nl' ? 'Voorbeelden:' : 'Examples:'}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {cookieType.examples.map((example, i) => (
                            <span key={i} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Detailed Cookie List */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {language === 'nl' ? 'Gedetailleerde cookie lijst' : 'Detailed cookie list'}
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 rounded-lg">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-foreground">
                        {language === 'nl' ? 'Cookie Naam' : 'Cookie Name'}
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-foreground">
                        {language === 'nl' ? 'Doel' : 'Purpose'}
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-foreground">
                        {language === 'nl' ? 'Type' : 'Type'}
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-foreground">
                        {language === 'nl' ? 'Vervaldatum' : 'Expiry'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-mono text-sm">_ga</td>
                      <td className="border border-gray-300 px-4 py-3">
                        {language === 'nl' ? 'Google Analytics - unieke gebruikers identificeren' : 'Google Analytics - identify unique users'}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <span className="px-2 py-1 bg-workflo-yellow/20 text-foreground font-medium rounded text-xs">
                          {language === 'nl' ? 'Analytisch' : 'Analytics'}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-3">{language === 'nl' ? '2 jaar' : '2 years'}</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-gray-300 px-4 py-3 font-mono text-sm">language_preference</td>
                      <td className="border border-gray-300 px-4 py-3">
                        {language === 'nl' ? 'Taalkeuze onthouden' : 'Remember language choice'}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {language === 'nl' ? 'Functioneel' : 'Functional'}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-3">{language === 'nl' ? '1 jaar' : '1 year'}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 font-mono text-sm">cookie_consent</td>
                      <td className="border border-gray-300 px-4 py-3">
                        {language === 'nl' ? 'Cookie voorkeuren opslaan' : 'Store cookie preferences'}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {language === 'nl' ? 'Essentieel' : 'Essential'}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-3">{language === 'nl' ? '1 jaar' : '1 year'}</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-gray-300 px-4 py-3 font-mono text-sm">_hjid</td>
                      <td className="border border-gray-300 px-4 py-3">
                        {language === 'nl' ? 'Hotjar - gebruikersgedrag tracking' : 'Hotjar - user behavior tracking'}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <span className="px-2 py-1 bg-workflo-yellow/20 text-foreground font-medium rounded text-xs">
                          {language === 'nl' ? 'Analytisch' : 'Analytics'}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-3">{language === 'nl' ? '1 jaar' : '1 year'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Third Party Cookies */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {language === 'nl' ? 'Cookies van derden' : 'Third-party cookies'}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-card shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Google Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">
                      {language === 'nl' 
                        ? 'Helpt ons te begrijpen hoe bezoekers onze website gebruiken'
                        : 'Helps us understand how visitors use our website'
                      }
                    </p>
                    <a 
                      href="https://policies.google.com/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      {language === 'nl' ? 'Google privacybeleid' : 'Google privacy policy'}
                    </a>
                  </CardContent>
                </Card>
                
                <Card className="bg-card shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Microsoft Clarity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">
                      {language === 'nl' 
                        ? 'Helpt ons de gebruikerservaring te verbeteren'
                        : 'Helps us improve user experience'
                      }
                    </p>
                    <a 
                      href="https://privacy.microsoft.com/privacystatement" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      {language === 'nl' ? 'Microsoft privacyverklaring' : 'Microsoft privacy statement'}
                    </a>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Managing Cookies */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {language === 'nl' ? 'Cookies beheren' : 'Managing cookies'}
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {language === 'nl' ? 'Browser instellingen' : 'Browser settings'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {language === 'nl' 
                      ? 'Je kunt cookies beheren via je browser instellingen:'
                      : 'You can manage cookies through your browser settings:'
                    }
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Chrome</h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'nl' 
                          ? 'Instellingen > Privacy en beveiliging > Cookies'
                          : 'Settings > Privacy and security > Cookies'
                        }
                      </p>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Firefox</h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'nl' 
                          ? 'Voorkeuren > Privacy & Beveiliging'
                          : 'Preferences > Privacy & Security'
                        }
                      </p>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Safari</h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'nl' 
                          ? 'Voorkeuren > Privacy > Cookies en websitegegevens'
                          : 'Preferences > Privacy > Cookies and website data'
                        }
                      </p>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Edge</h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'nl' 
                          ? 'Instellingen > Cookies en sitegegevens'
                          : 'Settings > Cookies and site data'
                        }
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-workflo-yellow/10 border-l-4 border-workflo-yellow p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    {language === 'nl' ? 'Let op' : 'Please note'}
                  </h3>
                  <p className="text-foreground">
                    {language === 'nl' 
                      ? 'Het uitschakelen van cookies kan de functionaliteit van onze website beperken.'
                      : 'Disabling cookies may limit the functionality of our website.'
                    }
                  </p>
                </div>
              </div>
            </section>

            {/* Updates to Policy */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {language === 'nl' ? 'Wijzigingen in dit cookiebeleid' : 'Changes to this cookie policy'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'nl' 
                  ? 'We kunnen dit cookiebeleid van tijd tot tijd bijwerken om wijzigingen in onze praktijken of om andere operationele, juridische of regelgevingredenen weer te geven. We raden je aan om dit beleid regelmatig te controleren.'
                  : 'We may update this cookie policy from time to time to reflect changes to our practices or for other operational, legal or regulatory reasons. We encourage you to review this policy periodically.'
                }
              </p>
            </section>

            {/* Contact Section */}
            <div className="bg-primary text-primary-foreground rounded-2xl p-8 text-center">
              <Cookie className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                {language === 'nl' ? 'Vragen over cookies?' : 'Questions about cookies?'}
              </h2>
              <p className="text-lg mb-6">
                {language === 'nl' 
                  ? 'Neem contact met ons op voor vragen over ons cookiegebruik'
                  : 'Contact us for questions about our cookie usage'
                }
              </p>
              <div className="space-y-2 mb-6">
                <p><strong>Email:</strong> <a href={`mailto:${companyInfo.location.email}`} className="hover:underline">{companyInfo.location.email}</a></p>
                <p><strong>{language === 'nl' ? 'Telefoon:' : 'Phone'}:</strong> <a href={`tel:${companyInfo.location.phone}`} className="hover:underline">{companyInfo.location.phone}</a></p>
              </div>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">
                  {language === 'nl' ? 'Neem contact op' : 'Contact us'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
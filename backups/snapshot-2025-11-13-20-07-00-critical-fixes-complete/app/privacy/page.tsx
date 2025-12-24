'use client'

import Link from 'next/link'
import { ArrowLeft, Shield, Eye, Database, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/lib/contexts/language-context'
import { companyInfo } from '@/lib/data/workflo-data'

export default function PrivacyPolicyPage() {
  const { language } = useLanguage()

  const lastUpdated = new Date('2025-01-01').toLocaleDateString(language === 'nl' ? 'nl-NL' : 'en-GB')

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === 'nl' ? 'Terug naar home' : 'Back to home'}
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {language === 'nl' ? 'Privacybeleid' : 'Privacy Policy'}
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
                  ? 'Workflo B.V. neemt je privacy serieus. In dit privacybeleid leggen we uit welke persoonsgegevens we verzamelen, hoe we deze gebruiken en welke rechten je hebt.'
                  : 'Workflo B.V. takes your privacy seriously. This privacy policy explains what personal data we collect, how we use it, and what rights you have.'
                }
              </p>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <Card className="bg-card shadow-lg border-2 border-border">
                <CardHeader>
                  <Eye className="w-8 h-8 text-primary mb-4" />
                  <CardTitle className="text-lg">
                    {language === 'nl' ? 'Wat we verzamelen' : 'What we collect'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {language === 'nl' 
                      ? 'Alleen gegevens die nodig zijn voor onze diensten'
                      : 'Only data necessary for our services'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-lg border-2 border-border">
                <CardHeader>
                  <Database className="w-8 h-8 text-primary mb-4" />
                  <CardTitle className="text-lg">
                    {language === 'nl' ? 'Hoe we het gebruiken' : 'How we use it'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {language === 'nl' 
                      ? 'Voor IT-support en service-verlening'
                      : 'For IT support and service delivery'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-lg border-2 border-border">
                <CardHeader>
                  <Lock className="w-8 h-8 text-primary mb-4" />
                  <CardTitle className="text-lg">
                    {language === 'nl' ? 'Hoe we het beschermen' : 'How we protect it'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {language === 'nl' 
                      ? 'Met state-of-the-art beveiliging'
                      : 'With state-of-the-art security'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Sections */}
            <div className="space-y-12">
              
              {/* Company Information */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {language === 'nl' ? '1. Verantwoordelijke voor gegevensverwerking' : '1. Data Controller'}
                </h2>
                <div className="bg-muted/50 rounded-xl p-6">
                  <div className="space-y-2">
                    <p><strong>{companyInfo.name}</strong></p>
                    <p>{companyInfo.location.address}</p>
                    <p>{companyInfo.location.postalCode} {companyInfo.location.city}</p>
                    <p>{companyInfo.location.country}</p>
                    <p>
                      {language === 'nl' ? 'Telefoon:' : 'Phone:'} <a href={`tel:${companyInfo.location.phone}`} className="text-primary hover:underline">{companyInfo.location.phone}</a>
                    </p>
                    <p>
                      {language === 'nl' ? 'E-mail:' : 'Email:'} <a href={`mailto:${companyInfo.location.email}`} className="text-primary hover:underline">{companyInfo.location.email}</a>
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Collection */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {language === 'nl' ? '2. Welke gegevens verzamelen we?' : '2. What data do we collect?'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {language === 'nl' ? 'Contactgegevens' : 'Contact Information'}
                    </h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>{language === 'nl' ? 'Naam en contactgegevens' : 'Name and contact details'}</li>
                      <li>{language === 'nl' ? 'E-mailadres' : 'Email address'}</li>
                      <li>{language === 'nl' ? 'Telefoonnummer' : 'Phone number'}</li>
                      <li>{language === 'nl' ? 'Bedrijfsgegevens' : 'Company information'}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {language === 'nl' ? 'Technische gegevens' : 'Technical Data'}
                    </h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>{language === 'nl' ? 'Systeeminformatie voor ondersteuning' : 'System information for support'}</li>
                      <li>{language === 'nl' ? 'Logbestanden' : 'Log files'}</li>
                      <li>{language === 'nl' ? 'Prestatiemetingen' : 'Performance metrics'}</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {language === 'nl' ? 'Website-gegevens' : 'Website Data'}
                    </h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>{language === 'nl' ? 'IP-adres' : 'IP address'}</li>
                      <li>{language === 'nl' ? 'Browserinformatie' : 'Browser information'}</li>
                      <li>{language === 'nl' ? 'Paginabezoeken' : 'Page visits'}</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Data Usage */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {language === 'nl' ? '3. Hoe gebruiken we je gegevens?' : '3. How do we use your data?'}
                </h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-3 ml-4">
                  <li>{language === 'nl' ? 'Het leveren van IT-diensten en support' : 'Providing IT services and support'}</li>
                  <li>{language === 'nl' ? 'Communicatie over onze diensten' : 'Communication about our services'}</li>
                  <li>{language === 'nl' ? 'Verbetering van onze dienstverlening' : 'Improving our service delivery'}</li>
                  <li>{language === 'nl' ? 'Voldoen aan wettelijke verplichtingen' : 'Complying with legal obligations'}</li>
                  <li>{language === 'nl' ? 'Monitoring en beveiliging van systemen' : 'System monitoring and security'}</li>
                </ul>
              </section>

              {/* Legal Basis */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {language === 'nl' ? '4. Rechtsgrondslag' : '4. Legal Basis'}
                </h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      {language === 'nl' ? 'Contractuele noodzaak' : 'Contractual Necessity'}
                    </h3>
                    <p className="text-blue-800">
                      {language === 'nl' 
                        ? 'Voor het uitvoeren van onze IT-diensten zoals overeengekomen in het contract.'
                        : 'For performing our IT services as agreed in the contract.'
                      }
                    </p>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-500 p-4">
                    <h3 className="font-semibold text-green-900 mb-2">
                      {language === 'nl' ? 'Gerechtvaardigd belang' : 'Legitimate Interest'}
                    </h3>
                    <p className="text-green-800">
                      {language === 'nl' 
                        ? 'Voor het verbeteren van onze diensten en het waarborgen van systeem-beveiliging.'
                        : 'For improving our services and ensuring system security.'
                      }
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">
                      {language === 'nl' ? 'Toestemming' : 'Consent'}
                    </h3>
                    <p className="text-purple-800">
                      {language === 'nl' 
                        ? 'Voor marketing-communicatie (alleen met je expliciete toestemming).'
                        : 'For marketing communications (only with your explicit consent).'
                      }
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Sharing */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {language === 'nl' ? '5. Delen van gegevens' : '5. Data Sharing'}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {language === 'nl' 
                    ? 'Wij delen je gegevens alleen in de volgende gevallen:'
                    : 'We only share your data in the following cases:'
                  }
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>{language === 'nl' ? 'Met vertrouwde partners voor het leveren van diensten' : 'With trusted partners for service delivery'}</li>
                  <li>{language === 'nl' ? 'Wanneer wettelijk vereist' : 'When legally required'}</li>
                  <li>{language === 'nl' ? 'Met je expliciete toestemming' : 'With your explicit consent'}</li>
                </ul>
              </section>

              {/* Data Security */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {language === 'nl' ? '6. Gegevensbeveiliging' : '6. Data Security'}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {language === 'nl' ? 'Technische maatregelen' : 'Technical Measures'}
                    </h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>{language === 'nl' ? 'Encryptie van gegevens' : 'Data encryption'}</li>
                      <li>{language === 'nl' ? 'Beveiligde servers' : 'Secure servers'}</li>
                      <li>{language === 'nl' ? 'Regelmatige security audits' : 'Regular security audits'}</li>
                      <li>{language === 'nl' ? 'Multi-factor authenticatie' : 'Multi-factor authentication'}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {language === 'nl' ? 'Organisatorische maatregelen' : 'Organizational Measures'}
                    </h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>{language === 'nl' ? 'Toegangscontrole' : 'Access control'}</li>
                      <li>{language === 'nl' ? 'Personeelstraining' : 'Staff training'}</li>
                      <li>{language === 'nl' ? 'Incident response plan' : 'Incident response plan'}</li>
                      <li>{language === 'nl' ? 'ISO 27001 gecertificeerd' : 'ISO 27001 certified'}</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Your Rights */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {language === 'nl' ? '7. Je rechten' : '7. Your Rights'}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-card shadow-lg">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-foreground mb-2">
                        {language === 'nl' ? 'Inzage' : 'Access'}
                      </h3>
                      <p className="text-muted-foreground">
                        {language === 'nl' 
                          ? 'Je hebt recht op inzage van je persoonsgegevens'
                          : 'You have the right to access your personal data'
                        }
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card shadow-lg">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-foreground mb-2">
                        {language === 'nl' ? 'Rectificatie' : 'Rectification'}
                      </h3>
                      <p className="text-muted-foreground">
                        {language === 'nl' 
                          ? 'Je kunt onjuiste gegevens laten corrigeren'
                          : 'You can have incorrect data corrected'
                        }
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card shadow-lg">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-foreground mb-2">
                        {language === 'nl' ? 'Verwijdering' : 'Erasure'}
                      </h3>
                      <p className="text-muted-foreground">
                        {language === 'nl' 
                          ? 'Je kunt verzoeken om verwijdering van je gegevens'
                          : 'You can request deletion of your data'
                        }
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card shadow-lg">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-foreground mb-2">
                        {language === 'nl' ? 'Overdraagbaarheid' : 'Portability'}
                      </h3>
                      <p className="text-muted-foreground">
                        {language === 'nl' 
                          ? 'Je kunt je gegevens in een gestructureerd formaat ontvangen'
                          : 'You can receive your data in a structured format'
                        }
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Retention */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {language === 'nl' ? '8. Bewaartermijnen' : '8. Data Retention'}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {language === 'nl' 
                    ? 'Wij bewaren je gegevens niet langer dan noodzakelijk:'
                    : 'We do not keep your data longer than necessary:'
                  }
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>{language === 'nl' ? 'Contractgegevens: 7 jaar na einde contract' : 'Contract data: 7 years after contract end'}</li>
                  <li>{language === 'nl' ? 'Technische logbestanden: 3 maanden' : 'Technical log files: 3 months'}</li>
                  <li>{language === 'nl' ? 'Marketing-communicatie: tot je je afmeldt' : 'Marketing communications: until you unsubscribe'}</li>
                  <li>{language === 'nl' ? 'Website-analytics: 26 maanden' : 'Website analytics: 26 months'}</li>
                </ul>
              </section>

              {/* Changes to Policy */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {language === 'nl' ? '9. Wijzigingen in dit beleid' : '9. Changes to This Policy'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'nl' 
                    ? 'Dit privacybeleid kan van tijd tot tijd worden bijgewerkt. Belangrijke wijzigingen zullen we je per e-mail meedelen of prominent op onze website plaatsen.'
                    : 'This privacy policy may be updated from time to time. We will notify you of significant changes by email or by placing a prominent notice on our website.'
                  }
                </p>
              </section>
            </div>

            {/* Contact Section */}
            <div className="mt-16 bg-primary text-black rounded-2xl p-8 text-center">
              <Mail className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                {language === 'nl' ? 'Vragen over privacy?' : 'Privacy questions?'}
              </h2>
              <p className="text-lg mb-6">
                {language === 'nl' 
                  ? 'Neem contact met ons op voor vragen over dit privacybeleid'
                  : 'Contact us for questions about this privacy policy'
                }
              </p>
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
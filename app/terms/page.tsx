'use client'

import Link from 'next/link'
import { ArrowLeft, FileText, Scale, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/lib/contexts/language-context'
import { companyInfo } from '@/lib/data/workflo-data'

export default function TermsOfServicePage() {
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
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {language === 'nl' ? 'Algemene Voorwaarden' : 'Terms of Service'}
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
                  ? 'Deze algemene voorwaarden zijn van toepassing op alle overeenkomsten tussen Workflo B.V. en haar klanten voor IT-diensten en gerelateerde services.'
                  : 'These terms of service apply to all agreements between Workflo B.V. and its customers for IT services and related services.'
                }
              </p>
            </div>

            {/* Key Points */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <Card className="bg-card shadow-lg border-2 border-border">
                <CardHeader>
                  <Scale className="w-8 h-8 text-primary mb-4" />
                  <CardTitle className="text-lg">
                    {language === 'nl' ? 'Transparante voorwaarden' : 'Transparent Terms'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {language === 'nl' 
                      ? 'Duidelijke afspraken over rechten en plichten'
                      : 'Clear agreements about rights and obligations'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-lg border-2 border-border">
                <CardHeader>
                  <Clock className="w-8 h-8 text-primary mb-4" />
                  <CardTitle className="text-lg">
                    {language === 'nl' ? 'Service garanties' : 'Service Guarantees'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {language === 'nl' 
                      ? '99.9% uptime en 1-uur responstijd'
                      : '99.9% uptime and 1-hour response time'
                    }
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card shadow-lg border-2 border-border">
                <CardHeader>
                  <AlertCircle className="w-8 h-8 text-primary mb-4" />
                  <CardTitle className="text-lg">
                    {language === 'nl' ? 'Beperkte aansprakelijkheid' : 'Limited Liability'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {language === 'nl' 
                      ? 'Aansprakelijkheid beperkt tot betaalde bedragen'
                      : 'Liability limited to amounts paid'
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
                  {language === 'nl' ? '1. Definities en toepasselijkheid' : '1. Definitions and Applicability'}
                </h2>
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-3">
                      {language === 'nl' ? 'Dienstverlener' : 'Service Provider'}
                    </h3>
                    <div className="space-y-1 text-muted-foreground">
                      <p><strong>{companyInfo.name}</strong></p>
                      <p>{companyInfo.location.address}</p>
                      <p>{companyInfo.location.postalCode} {companyInfo.location.city}</p>
                      <p>KvK-nummer: [Nummer]</p>
                      <p>BTW-nummer: [Nummer]</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground">
                    {language === 'nl' 
                      ? 'Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, offertes, overeenkomsten en leveringen van Workflo B.V., tenzij uitdrukkelijk schriftelijk anders overeengekomen.'
                      : 'These terms and conditions apply to all offers, quotations, agreements and deliveries by Workflo B.V., unless expressly agreed otherwise in writing.'
                    }
                  </p>
                </div>
              </section>

              {/* Services */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {language === 'nl' ? '2. Diensten' : '2. Services'}
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {language === 'nl' ? 'Managed IT Services' : 'Managed IT Services'}
                    </h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>{language === 'nl' ? '24/7 monitoring en ondersteuning' : '24/7 monitoring and support'}</li>
                      <li>{language === 'nl' ? 'Preventief onderhoud' : 'Preventive maintenance'}</li>
                      <li>{language === 'nl' ? 'Security updates en patches' : 'Security updates and patches'}</li>
                      <li>{language === 'nl' ? 'Backup en recovery diensten' : 'Backup and recovery services'}</li>
                      <li>{language === 'nl' ? 'Remote en on-site support' : 'Remote and on-site support'}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {language === 'nl' ? 'Cloud Services' : 'Cloud Services'}
                    </h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>{language === 'nl' ? 'Microsoft 365 implementatie en beheer' : 'Microsoft 365 implementation and management'}</li>
                      <li>{language === 'nl' ? 'Azure cloud infrastructuur' : 'Azure cloud infrastructure'}</li>
                      <li>{language === 'nl' ? 'Cloud migratie services' : 'Cloud migration services'}</li>
                      <li>{language === 'nl' ? 'Hybrid cloud oplossingen' : 'Hybrid cloud solutions'}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {language === 'nl' ? 'Cybersecurity' : 'Cybersecurity'}
                    </h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>{language === 'nl' ? 'Endpoint protection' : 'Endpoint protection'}</li>
                      <li>{language === 'nl' ? 'Email security' : 'Email security'}</li>
                      <li>{language === 'nl' ? 'Penetration testing' : 'Penetration testing'}</li>
                      <li>{language === 'nl' ? 'Security awareness training' : 'Security awareness training'}</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Obligations */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {language === 'nl' ? '3. Verplichtingen partijen' : '3. Obligations of Parties'}
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {language === 'nl' ? 'Verplichtingen Workflo' : 'Workflo Obligations'}
                    </h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>{language === 'nl' ? 'Diensten leveren conform de overeengekomen specificaties' : 'Deliver services according to agreed specifications'}</li>
                      <li>{language === 'nl' ? 'Responstijd van 1 uur tijdens kantooruren' : '1-hour response time during business hours'}</li>
                      <li>{language === 'nl' ? '99.9% uptime garantie voor managed services' : '99.9% uptime guarantee for managed services'}</li>
                      <li>{language === 'nl' ? 'Vertrouwelijke behandeling van klantgegevens' : 'Confidential treatment of client data'}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {language === 'nl' ? 'Verplichtingen klant' : 'Client Obligations'}
                    </h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>{language === 'nl' ? 'Tijdige betaling van facturen' : 'Timely payment of invoices'}</li>
                      <li>{language === 'nl' ? 'Verstrekking van benodigde toegang en informatie' : 'Provision of necessary access and information'}</li>
                      <li>{language === 'nl' ? 'Naleving van beveiligingsrichtlijnen' : 'Compliance with security guidelines'}</li>
                      <li>{language === 'nl' ? 'Melding van problemen via officiële kanalen' : 'Reporting issues through official channels'}</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Pricing and Payment */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {language === 'nl' ? '4. Prijzen en betaling' : '4. Pricing and Payment'}
                </h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      {language === 'nl' ? 'Vaste maandprijzen' : 'Fixed Monthly Rates'}
                    </h3>
                    <p className="text-blue-800">
                      {language === 'nl' 
                        ? 'Managed IT services hebben vaste maandprijzen per computer, geen verborgen kosten.'
                        : 'Managed IT services have fixed monthly rates per computer, no hidden costs.'
                      }
                    </p>
                  </div>
                  
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>{language === 'nl' ? 'Betalingstermijn: 30 dagen na factuurdatum' : 'Payment terms: 30 days from invoice date'}</li>
                    <li>{language === 'nl' ? 'Automatische incasso voor maandelijkse diensten' : 'Direct debit for monthly services'}</li>
                    <li>{language === 'nl' ? 'Prijswijzigingen met 3 maanden vooraf aangekondigd' : 'Price changes announced 3 months in advance'}</li>
                    <li>{language === 'nl' ? 'Rente op achterstallige betalingen: 1% per maand' : 'Interest on overdue payments: 1% per month'}</li>
                  </ul>
                </div>
              </section>

              {/* SLA */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {language === 'nl' ? '5. Service Level Agreement' : '5. Service Level Agreement'}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-green-900">
                        {language === 'nl' ? 'Uptime Garantie' : 'Uptime Guarantee'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-green-800">
                        <p className="text-2xl font-bold mb-2">99.9%</p>
                        <p>{language === 'nl' ? 'Maandelijkse uptime voor beheerde systemen' : 'Monthly uptime for managed systems'}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-900">
                        {language === 'nl' ? 'Responstijd' : 'Response Time'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-blue-800">
                        <p className="text-2xl font-bold mb-2">1 {language === 'nl' ? 'uur' : 'hour'}</p>
                        <p>{language === 'nl' ? 'Responstijd tijdens kantooruren (8-18u)' : 'Response time during business hours (8am-6pm)'}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {language === 'nl' ? 'Escalatieprocedure' : 'Escalation Procedure'}
                  </h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>{language === 'nl' ? 'Level 1: Binnen 1 uur (standaard support)' : 'Level 1: Within 1 hour (standard support)'}</li>
                    <li>{language === 'nl' ? 'Level 2: Binnen 15 minuten (kritieke problemen)' : 'Level 2: Within 15 minutes (critical issues)'}</li>
                    <li>{language === 'nl' ? 'Level 3: Onmiddellijk (systeemuitval)' : 'Level 3: Immediate (system failure)'}</li>
                  </ul>
                </div>
              </section>

              {/* Liability */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {language === 'nl' ? '6. Aansprakelijkheid' : '6. Liability'}
                </h2>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                    <h3 className="font-semibold text-yellow-900 mb-2">
                      {language === 'nl' ? 'Beperkte aansprakelijkheid' : 'Limited Liability'}
                    </h3>
                    <p className="text-yellow-800">
                      {language === 'nl' 
                        ? 'De aansprakelijkheid van Workflo is beperkt tot het bedrag van de in het betreffende jaar door de klant betaalde vergoedingen.'
                        : 'Workflo\'s liability is limited to the amount of fees paid by the client in the relevant year.'
                      }
                    </p>
                  </div>
                  
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>{language === 'nl' ? 'Geen aansprakelijkheid voor indirecte schade' : 'No liability for indirect damages'}</li>
                    <li>{language === 'nl' ? 'Uitgesloten: gevolgschade, verlies van winst, verlies van gegevens' : 'Excluded: consequential damages, loss of profit, data loss'}</li>
                    <li>{language === 'nl' ? 'Klant is verplicht adequate back-ups te maken' : 'Client is required to maintain adequate backups'}</li>
                    <li>{language === 'nl' ? 'Force majeure vrijstelling' : 'Force majeure exemption'}</li>
                  </ul>
                </div>
              </section>

              {/* Contract Duration */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {language === 'nl' ? '7. Contractduur en opzegging' : '7. Contract Duration and Termination'}
                </h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        {language === 'nl' ? 'Managed Services' : 'Managed Services'}
                      </h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                        <li>{language === 'nl' ? 'Minimale contractduur: 12 maanden' : 'Minimum contract duration: 12 months'}</li>
                        <li>{language === 'nl' ? 'Opzegtermijn: 3 maanden' : 'Termination notice: 3 months'}</li>
                        <li>{language === 'nl' ? 'Automatische verlenging: 12 maanden' : 'Automatic renewal: 12 months'}</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        {language === 'nl' ? 'Projecten' : 'Projects'}
                      </h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                        <li>{language === 'nl' ? 'Vast einddatum volgens project scope' : 'Fixed end date per project scope'}</li>
                        <li>{language === 'nl' ? 'Wijzigingen via change requests' : 'Changes via change requests'}</li>
                        <li>{language === 'nl' ? 'Garantieperiode: 6 maanden' : 'Warranty period: 6 months'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Intellectual Property */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {language === 'nl' ? '8. Intellectueel eigendom' : '8. Intellectual Property'}
                </h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>{language === 'nl' ? 'Klant behoudt eigendom van eigen gegevens en systemen' : 'Client retains ownership of their data and systems'}</li>
                  <li>{language === 'nl' ? 'Workflo behoudt eigendom van ontwikkelde tools en methodieken' : 'Workflo retains ownership of developed tools and methodologies'}</li>
                  <li>{language === 'nl' ? 'Licenties voor software blijven eigendom van oorspronkelijke leveranciers' : 'Software licenses remain property of original vendors'}</li>
                  <li>{language === 'nl' ? 'Confidentialiteit van bedrijfsinformatie gegarandeerd' : 'Confidentiality of business information guaranteed'}</li>
                </ul>
              </section>

              {/* Dispute Resolution */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {language === 'nl' ? '9. Geschillen en toepasselijk recht' : '9. Disputes and Applicable Law'}
                </h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {language === 'nl' 
                      ? 'Op alle overeenkomsten met Workflo B.V. is Nederlands recht van toepassing.'
                      : 'Dutch law applies to all agreements with Workflo B.V.'
                    }
                  </p>
                  
                  <div className="bg-muted/50 rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-3">
                      {language === 'nl' ? 'Geschillenregeling' : 'Dispute Resolution'}
                    </h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                      <li>{language === 'nl' ? 'Eerst poging tot onderling overleg' : 'First attempt at mutual consultation'}</li>
                      <li>{language === 'nl' ? 'Mediation via erkende instantie' : 'Mediation via recognized institution'}</li>
                      <li>{language === 'nl' ? 'Bij falen: bevoegde rechter te Amsterdam' : 'If failed: competent court in Amsterdam'}</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>

            {/* Contact Section */}
            <div className="mt-16 bg-primary text-black rounded-2xl p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                {language === 'nl' ? 'Vragen over deze voorwaarden?' : 'Questions about these terms?'}
              </h2>
              <p className="text-lg mb-6">
                {language === 'nl' 
                  ? 'Neem contact met ons op voor toelichting op deze algemene voorwaarden'
                  : 'Contact us for clarification on these terms of service'
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
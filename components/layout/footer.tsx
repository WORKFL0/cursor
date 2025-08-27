'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, Download, ExternalLink } from 'lucide-react'
import { useLanguage, useLocalizedContent } from '@/lib/contexts/language-context'
import { companyInfo, navigation } from '@/lib/data/workflo-data'
import { HubSpotNewsletterSignup } from '@/components/forms/HubSpotNewsletterSignup'
import { Button } from '@/components/ui/button'

export function Footer() {
  const { language } = useLanguage()
  const { getLocalizedValue } = useLocalizedContent()

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info & Contact */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-3">Workflo</h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {language === 'nl' 
                  ? 'Jouw betrouwbare IT-partner in Amsterdam. Wij zorgen ervoor dat jouw technologie gewoon werkt, zodat jij je kunt concentreren op wat echt belangrijk is voor jouw bedrijf.' 
                  : 'Your trusted IT partner in Amsterdam. We make sure your technology just works, so you can focus on what really matters for your business.'}
              </p>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground text-lg mb-4">
                {language === 'nl' ? 'Contact' : 'Get in Touch'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                  <div>
                    <a 
                      href={`tel:${companyInfo.location.phone.replace(/\s/g, '')}`} 
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {companyInfo.location.phone}
                    </a>
                    <p className="text-sm text-muted-foreground">
                      {language === 'nl' ? 'Ma-vr 9:00-17:00' : 'Mon-Fri 9:00-17:00'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                  <div>
                    <a 
                      href={`mailto:${companyInfo.location.email}`} 
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {companyInfo.location.email}
                    </a>
                    <p className="text-sm text-muted-foreground">
                      {language === 'nl' ? 'Binnen 24u reactie' : 'Reply within 24h'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">
                    {companyInfo.location.address}
                  </p>
                  <p className="text-muted-foreground">
                    {companyInfo.location.postalCode} {companyInfo.location.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Support Tool */}
            <div className="mt-8 p-4 bg-warning/10 rounded-lg border border-warning/20">
              <h5 className="font-semibold text-foreground mb-2 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                {language === 'nl' ? 'Hulp nodig?' : 'Need Help?'}
              </h5>
              <p className="text-sm text-muted-foreground mb-3">
                {language === 'nl' 
                  ? 'Download ons support tool voor directe hulp van onze specialisten.'
                  : 'Download our support tool for direct assistance from our specialists.'}
              </p>
              <Button 
                size="sm" 
                onClick={() => {
                  window.open('https://get.teamviewer.com/workflo', '_blank')
                }}
                className="text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                {language === 'nl' ? 'Download Support Tool' : 'Download Support Tool'}
              </Button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-foreground text-lg mb-6">
              {language === 'nl' ? 'Onze Diensten' : 'Our Services'}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/diensten" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  {language === 'nl' ? 'Alle Diensten' : 'All Services'}
                </Link>
              </li>
              <li>
                <Link href="/diensten/managed-it" className="text-muted-foreground hover:text-primary transition-colors">
                  Managed IT Services
                </Link>
              </li>
              <li>
                <Link href="/diensten/cloud" className="text-muted-foreground hover:text-primary transition-colors">
                  {language === 'nl' ? 'Cloud Oplossingen' : 'Cloud Solutions'}
                </Link>
              </li>
              <li>
                <Link href="/diensten/cybersecurity" className="text-muted-foreground hover:text-primary transition-colors">
                  Cybersecurity
                </Link>
              </li>
              <li>
                <Link href="/servicedesk" className="text-muted-foreground hover:text-primary transition-colors">
                  Servicedesk
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Resources */}
          <div>
            <h4 className="font-semibold text-foreground text-lg mb-6">
              {language === 'nl' ? 'Meer over Workflo' : 'More about Workflo'}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/over-ons" className="text-muted-foreground hover:text-primary transition-colors">
                  {language === 'nl' ? 'Over Ons' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-muted-foreground hover:text-primary transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/werken-bij" className="text-muted-foreground hover:text-primary transition-colors">
                  {language === 'nl' ? 'Werken Bij Workflo' : 'Careers'}
                </Link>
              </li>
              <li>
                <Link href="/referral" className="text-muted-foreground hover:text-primary transition-colors">
                  {language === 'nl' ? 'Referral Programma' : 'Referral Program'}
                </Link>
              </li>
              <li>
                <a 
                  href="https://uptime.workflo.it/status/workflo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  {language === 'nl' ? 'Status Pagina' : 'System Status'}
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-success rounded-full animate-pulse"></span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-border pt-12 mb-12">
          <div className="max-w-2xl">
            <h4 className="font-semibold text-foreground text-lg mb-3">
              {language === 'nl' ? 'Blijf op de hoogte' : 'Stay Updated'}
            </h4>
            <p className="text-muted-foreground mb-6">
              {language === 'nl' 
                ? 'Ontvang maandelijks tips, updates en inzichten over IT-beveiliging en productiviteit.'
                : 'Receive monthly tips, updates and insights about IT security and productivity.'}
            </p>
            <HubSpotNewsletterSignup variant="compact" />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <p className="text-muted-foreground text-sm mb-2">
                &copy; {currentYear} {companyInfo.name}. {language === 'nl' ? 'Alle rechten voorbehouden.' : 'All rights reserved.'}
              </p>
              <p className="text-xs text-muted-foreground">
                Workflo B.V. | KvK: 87460807 | BTW: NL864300852B01
              </p>
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <span className="hidden sm:inline">•</span>
              <Link href="/terms" className="hover:text-primary transition-colors">
                {language === 'nl' ? 'Algemene Voorwaarden' : 'Terms of Service'}
              </Link>
              <span className="hidden sm:inline">•</span>
              <Link href="/cookies" className="hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
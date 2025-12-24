'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Download, ExternalLink, Shield, Clock, Award } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/language-context'
import { companyInfo } from '@/lib/data/workflo-data'
import { HubSpotNewsletterSignup } from '@/components/forms/HubSpotNewsletterSignup'
import { ButtonPrimary } from '@/components/ui/button-v2'

export function FooterModern() {
  const { language } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-workflo-navy text-white">
      {/* Tier 1: USPs Section - Dark Navy Background */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* USP 1 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-workflo-yellow/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-workflo-yellow stroke-2" />
              </div>
              <div>
                <h3 className="workflo-h3 text-white mb-2">
                  {language === 'nl' ? 'Veiligheid Gegarandeerd' : 'Security Guaranteed'}
                </h3>
                <p className="workflo-caption text-white/70">
                  {language === 'nl'
                    ? 'ISO 27001 gecertificeerd met 24/7 monitoring'
                    : 'ISO 27001 certified with 24/7 monitoring'}
                </p>
              </div>
            </div>

            {/* USP 2 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-workflo-yellow/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-workflo-yellow stroke-2" />
              </div>
              <div>
                <h3 className="workflo-h3 text-white mb-2">
                  {language === 'nl' ? 'Snelle Reactietijd' : 'Fast Response'}
                </h3>
                <p className="workflo-caption text-white/70">
                  {language === 'nl'
                    ? 'Gemiddeld binnen 15 minuten online support'
                    : 'Average 15 minutes online support response'}
                </p>
              </div>
            </div>

            {/* USP 3 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-workflo-yellow/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-workflo-yellow stroke-2" />
              </div>
              <div>
                <h3 className="workflo-h3 text-white mb-2">
                  {language === 'nl' ? 'Lokale Expertise' : 'Local Expertise'}
                </h3>
                <p className="workflo-caption text-white/70">
                  {language === 'nl'
                    ? 'Amsterdam-based met persoonlijke service'
                    : 'Amsterdam-based with personal service'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tier 2: Navigation & Newsletter - Slightly Lighter Navy */}
      <div className="bg-workflo-slate/50 border-b border-white/10">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Left: Company Info & Logo */}
            <div>
              <Image
                src="/images/workflo-logo-new.png"
                alt="Workflo Logo"
                width={140}
                height={70}
                className="mb-6"
              />
              <p className="workflo-body text-white/80 mb-8 max-w-md">
                {language === 'nl'
                  ? 'Jouw betrouwbare IT-partner in Amsterdam. Wij zorgen ervoor dat jouw technologie gewoon werkt, zodat jij je kunt concentreren op wat echt belangrijk is.'
                  : 'Your trusted IT partner in Amsterdam. We make sure your technology just works, so you can focus on what really matters.'}
              </p>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-workflo-yellow flex-shrink-0 stroke-2" />
                  <div>
                    <a
                      href={`tel:${companyInfo.location.phone.replace(/\s/g, '')}`}
                      className="text-white hover:text-workflo-yellow transition-colors font-medium"
                    >
                      {companyInfo.location.phone}
                    </a>
                    <p className="workflo-caption text-white/60">
                      {language === 'nl' ? 'Ma-vr 9:00-17:00' : 'Mon-Fri 9:00-17:00'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-workflo-yellow flex-shrink-0 stroke-2" />
                  <div>
                    <a
                      href={`mailto:${companyInfo.location.email}`}
                      className="text-white hover:text-workflo-yellow transition-colors font-medium"
                    >
                      {companyInfo.location.email}
                    </a>
                    <p className="workflo-caption text-white/60">
                      {language === 'nl' ? 'Binnen 24u reactie' : 'Reply within 24h'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-workflo-yellow flex-shrink-0 mt-0.5 stroke-2" />
                  <div>
                    <p className="text-white font-medium">
                      {companyInfo.location.address}
                    </p>
                    <p className="text-white/70">
                      {companyInfo.location.postalCode} {companyInfo.location.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Support Tool CTA */}
              <div className="mt-8">
                <ButtonPrimary
                  onClick={() => window.open('https://get.teamviewer.com/workflo', '_blank')}
                  className="w-full sm:w-auto"
                >
                  <Download className="w-4 h-4" />
                  {language === 'nl' ? 'Download Support Tool' : 'Download Support Tool'}
                </ButtonPrimary>
              </div>
            </div>

            {/* Right: Navigation Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* Services Column */}
              <div>
                <h4 className="workflo-h3 text-white mb-6">
                  {language === 'nl' ? 'Diensten' : 'Services'}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/diensten/managed-it"
                      className="workflo-caption text-white/70 hover:text-workflo-yellow transition-colors"
                    >
                      Managed IT
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/diensten/cloud"
                      className="workflo-caption text-white/70 hover:text-workflo-yellow transition-colors"
                    >
                      {language === 'nl' ? 'Cloud' : 'Cloud'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/diensten/cybersecurity"
                      className="workflo-caption text-white/70 hover:text-workflo-yellow transition-colors"
                    >
                      Cybersecurity
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/servicedesk"
                      className="workflo-caption text-white/70 hover:text-workflo-yellow transition-colors"
                    >
                      Servicedesk
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company Column */}
              <div>
                <h4 className="workflo-h3 text-white mb-6">
                  {language === 'nl' ? 'Bedrijf' : 'Company'}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/over-ons"
                      className="workflo-caption text-white/70 hover:text-workflo-yellow transition-colors"
                    >
                      {language === 'nl' ? 'Over Ons' : 'About'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/case-studies"
                      className="workflo-caption text-white/70 hover:text-workflo-yellow transition-colors"
                    >
                      Cases
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/werken-bij"
                      className="workflo-caption text-white/70 hover:text-workflo-yellow transition-colors"
                    >
                      {language === 'nl' ? 'Werken Bij' : 'Careers'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/referral"
                      className="workflo-caption text-white/70 hover:text-workflo-yellow transition-colors"
                    >
                      Referral
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources Column */}
              <div>
                <h4 className="workflo-h3 text-white mb-6">
                  {language === 'nl' ? 'Resources' : 'Resources'}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/calculator"
                      className="workflo-caption text-white/70 hover:text-workflo-yellow transition-colors"
                    >
                      Calculator
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://uptime.workflo.it/status/workflo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="workflo-caption text-white/70 hover:text-workflo-yellow transition-colors inline-flex items-center gap-2"
                    >
                      Status
                      <span className="inline-flex items-center gap-1">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </a>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="workflo-caption text-white/70 hover:text-workflo-yellow transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="border-t border-white/10 pt-12">
            <div className="max-w-2xl">
              <h4 className="workflo-h3 text-white mb-3">
                {language === 'nl' ? 'Blijf op de hoogte' : 'Stay Updated'}
              </h4>
              <p className="workflo-body text-white/70 mb-6">
                {language === 'nl'
                  ? 'Ontvang maandelijks tips, updates en inzichten over IT-beveiliging en productiviteit.'
                  : 'Receive monthly tips, updates and insights about IT security and productivity.'}
              </p>
              <HubSpotNewsletterSignup variant="compact" />
            </div>
          </div>
        </div>
      </div>

      {/* Tier 3: Legal & Copyright - Darkest Navy */}
      <div className="bg-workflo-navy">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Left: Company Info */}
            <div>
              <p className="workflo-caption text-white/70 mb-2">
                &copy; {currentYear} {companyInfo.name}. {language === 'nl' ? 'Alle rechten voorbehouden.' : 'All rights reserved.'}
              </p>
              <p className="workflo-caption text-white/50">
                KvK: 87460807 | BTW: NL864300852B01
              </p>
            </div>

            {/* Right: Legal Links */}
            <div className="flex flex-wrap items-center gap-4 workflo-caption text-white/60">
              <Link href="/privacy" className="hover:text-workflo-yellow transition-colors">
                Privacy Policy
              </Link>
              <span className="hidden sm:inline text-white/30">•</span>
              <Link href="/terms" className="hover:text-workflo-yellow transition-colors">
                {language === 'nl' ? 'Algemene Voorwaarden' : 'Terms'}
              </Link>
              <span className="hidden sm:inline text-white/30">•</span>
              <Link href="/cookies" className="hover:text-workflo-yellow transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

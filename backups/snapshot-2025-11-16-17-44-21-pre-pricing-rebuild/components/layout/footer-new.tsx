'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, Award, Shield, Users, Building2, ExternalLink, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/language-context'
import { HubSpotNewsletterSignup } from '@/components/forms/HubSpotNewsletterSignup'
import { Button } from '@/components/ui/button'

export function Footer() {
  const { language } = useLanguage()
  const currentYear = new Date().getFullYear()

  // Cleaned up navigation structure
  const footerSections = {
    services: {
      title: language === 'nl' ? 'Diensten' : 'Services',
      links: [
        { name: 'Managed IT', href: '/diensten/managed-it' },
        { name: language === 'nl' ? 'Cloud Oplossingen' : 'Cloud Solutions', href: '/diensten/cloud' },
        { name: 'Cybersecurity', href: '/diensten/cybersecurity' },
        { name: 'Microsoft 365', href: '/diensten/microsoft-365' },
        { name: 'VoIP Telefonie', href: '/diensten/voip-telefonie' },
        { name: language === 'nl' ? 'Alle diensten' : 'All Services', href: '/diensten' }
      ]
    },
    company: {
      title: language === 'nl' ? 'Bedrijf' : 'Company',
      links: [
        { name: language === 'nl' ? 'Over Ons' : 'About Us', href: '/over-ons' },
        { name: language === 'nl' ? 'Case Studies' : 'Case Studies', href: '/case-studies' },
        { name: 'Portfolio', href: '/portfolio' },
        { name: 'Testimonials', href: '/testimonials' },
        { name: language === 'nl' ? 'Werken Bij Workflo' : 'Careers', href: '/werken-bij' },
        { name: language === 'nl' ? 'Nieuws' : 'News', href: '/nieuws' }
      ]
    },
    support: {
      title: language === 'nl' ? 'Support' : 'Support',
      links: [
        { name: 'FAQ', href: '/faq' },
        { name: language === 'nl' ? 'Tevredenheidscheck' : 'Satisfaction Check', href: '/tevredenheidscheck' },
        { name: language === 'nl' ? 'Prijzen' : 'Pricing', href: '/prijzen' },
        { name: 'Contact', href: '/contact' }
      ],
      external: [
        { name: 'System Status', href: 'https://uptime.workflo.it/status/workflo' }
      ]
    }
  }

  return (
    <footer className="bg-gradient-to-b from-workflo-yellow-light/30 via-yellow-50/20 to-background border-t border-workflo-yellow/20">
      {/* Newsletter Section - Simplified */}
      <div className="bg-gradient-to-r from-workflo-yellow-light/40 via-yellow-100/30 to-workflo-yellow-light/40 border-b border-workflo-yellow/30">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {language === 'nl' ? 'Blijf op de hoogte' : 'Stay Updated'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'nl' ? 'Ontvang IT-tips en bedrijfsupdates' : 'Get IT tips and company updates'}
            </p>
            <HubSpotNewsletterSignup variant="compact" />
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info - Prominent */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <Image
                src="/images/workflo-logo-dark.png"
                alt="Workflo"
                width={120}
                height={60}
                className="mb-4 dark:hidden"
              />
              <Image
                src="/images/workflo-logo-new.png"
                alt="Workflo"
                width={120}
                height={60}
                className="mb-4 hidden dark:block"
              />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {language === 'nl' 
                  ? 'Amsterdam\'s meest vertrouwde IT-partner sinds 2014. We zorgen dat je technologie je groei versnelt.'
                  : 'Amsterdam\'s most trusted IT partner since 2014. We ensure your technology accelerates your growth.'
                }
              </p>
            </div>
            
            {/* Contact Info - Simplified with link to contact page */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Amsterdam</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{language === 'nl' ? 'Ma-Vr: 9:00 - 17:00' : 'Mon-Fri: 9:00 - 17:00'}</span>
              </div>
              
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mt-3"
              >
                {language === 'nl' ? 'Contactgegevens' : 'Contact details'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{footerSections.services.title}</h3>
            <ul className="space-y-2">
              {footerSections.services.links.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{footerSections.company.title}</h3>
            <ul className="space-y-2">
              {footerSections.company.links.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{footerSections.support.title}</h3>
            <ul className="space-y-2 mb-4">
              {footerSections.support.links.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* External Support Links */}
            <div className="pt-3 border-t border-border space-y-2">
              {footerSections.support.external.map((link, index) => (
                <div key={index}>
                  <a 
                    href={link.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {link.name}
                    <ExternalLink className="w-3 h-3" />
                    {link.label && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded">
                        {link.label}
                      </span>
                    )}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Clean and minimal */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 text-sm text-muted-foreground">
          <div className="mb-4 md:mb-0">
            <p>&copy; {currentYear} Workflo B.V. - {language === 'nl' ? 'IT dat gewoon werkt' : 'IT that simply works'}.</p>
            <p className="text-xs opacity-75 mt-1">
              KvK: 87460807 | BTW: NL864300852B01
            </p>
          </div>
          
          {/* Legal Links - Subtle */}
          <div className="flex items-center gap-4 text-sm opacity-60 hover:opacity-100 transition-opacity">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-primary transition-colors">
              {language === 'nl' ? 'Voorwaarden' : 'Terms'}
            </Link>
            <span>•</span>
            <Link href="/disclaimer" className="hover:text-primary transition-colors">
              Disclaimer
            </Link>
            <span>•</span>
            <Link href="/cookies" className="hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
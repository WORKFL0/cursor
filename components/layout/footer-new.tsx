'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, Award, Shield, Users, ChevronRight, Star, Zap, Building2 } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/language-context'
import { NewsletterSignup } from '@/components/forms/newsletter-signup'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

export function Footer() {
  const { language } = useLanguage()
  const currentYear = new Date().getFullYear()

  const siteMap = {
    services: [
      { name: 'Managed IT Services', href: '/diensten/managed-it', badge: 'Populair' },
      { name: 'Cloud Oplossingen', href: '/diensten/cloud' },
      { name: 'Cybersecurity', href: '/diensten/cybersecurity', badge: 'Urgent' },
      { name: 'Microsoft 365', href: '/diensten/cloud#microsoft' },
      { name: 'Backup & Recovery', href: '/diensten/managed-it#backup' },
      { name: 'VoIP Telefonie', href: '/diensten/cloud#voip' },
    ],
    solutions: [
      { name: 'Voor Startups', href: '/oplossingen/startups' },
      { name: 'Voor MKB', href: '/oplossingen/mkb' },
      { name: 'Voor Enterprises', href: '/oplossingen/enterprise' },
      { name: 'Remote Werken', href: '/oplossingen/remote' },
      { name: 'Hybrid Cloud', href: '/oplossingen/hybrid-cloud' },
    ],
    company: [
      { name: 'Over Workflo', href: '/over-ons' },
      { name: 'Ons Team', href: '/over-ons#team' },
      { name: 'Werken Bij', href: '/werken-bij', badge: 'Vacatures' },
      { name: 'Case Studies', href: '/case-studies' },
      { name: 'Portfolio', href: '/portfolio' },
      { name: 'Testimonials', href: '/testimonials' },
    ],
    support: [
      { name: '🚨 Servicedesk', href: 'https://servicedesk.workflo.it/portal', external: true, badge: '24/7' },
      { name: '📥 Support Tool', href: 'https://get.teamviewer.com/workflo', external: true },
      { name: '❓ FAQ', href: '/faq' },
      { name: '📊 System Status', href: 'https://uptime.workflo.it/status/workflo', external: true },
      { name: '📞 Noodhulp', href: 'tel:+31203080465', badge: 'Direct' },
      { name: '💬 WhatsApp', href: 'https://wa.me/31203080465?text=Hallo%20Workflo,%20ik%20heb%20een%20vraag', external: true },
    ],
    resources: [
      { name: 'IT Tevredenheidscheck', href: '/tevredenheidscheck', badge: 'Gratis' },
      { name: 'Prijzen Calculator', href: '/prijzen' },
      { name: 'Blog & Nieuws', href: '/nieuws' },
      { name: 'IT Tips', href: '/blog' },
      { name: 'Referral Programma', href: '/referral', badge: '€50+' },
      { name: 'Contact', href: '/contact' },
    ]
  }

  const stats = [
    { icon: Users, value: '250+', label: 'Tevreden Klanten' },
    { icon: Shield, value: '99.9%', label: 'Uptime Garantie' },
    { icon: Clock, value: '24/7', label: 'Support Beschikbaar' },
    { icon: Award, value: '10+', label: 'Jaar Ervaring' },
  ]

  return (
    <footer className="relative bg-gradient-to-b from-muted/30 to-background">
      {/* Newsletter Section */}
      <div className="border-y border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <NewsletterSignup variant="full" />
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Simplified Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Diensten</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/diensten/managed-it" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Managed IT Services
                </Link>
              </li>
              <li>
                <Link href="/diensten/cloud" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cloud Oplossingen
                </Link>
              </li>
              <li>
                <Link href="/diensten/cybersecurity" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cybersecurity
                </Link>
              </li>
              <li>
                <Link href="/prijzen" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Prijzen
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Bedrijf</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/over-ons" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Over Workflo
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/nieuws" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Nieuws
                </Link>
              </li>
              <li>
                <Link href="/werken-bij" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Werken Bij
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://servicedesk.workflo.it/portal" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Servicedesk
                </a>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="tel:+31203080465" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  020-30 80 465
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Contact</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <strong className="text-foreground">Workflo B.V.</strong>
              </div>
              <div>
                Koivistokade 3<br />
                1013 AC Amsterdam
              </div>
              <div>
                <a href="tel:+31203080465" className="hover:text-primary transition-colors">
                  020-30 80 465
                </a>
              </div>
              <div>
                <a href="mailto:info@workflo.it" className="hover:text-primary transition-colors">
                  info@workflo.it
                </a>
              </div>
              <div>
                <span>Ma-Vr: 8:00 - 18:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Stats */}
        <div className="py-8 border-y border-border mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar with Legal Links */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <div className="mb-4 md:mb-0">
            <p>&copy; {currentYear} Workflo B.V. - IT dat gewoon werkt.</p>
            <p className="mt-1 opacity-75">KvK: 87460807 | BTW: NL864300852B01</p>
          </div>
          
          {/* Subtle Legal Links */}
          <div className="flex items-center gap-4 text-xs opacity-75 hover:opacity-100 transition-opacity">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Voorwaarden
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
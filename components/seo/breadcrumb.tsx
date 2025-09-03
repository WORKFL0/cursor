'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { getBreadcrumbSchema } from '@/lib/seo/structured-data'
import { useLanguage } from '@/lib/contexts/language-context'

export interface BreadcrumbItem {
  name: string
  nameNL: string
  href: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  showHome?: boolean
}

export function Breadcrumb({ items, className = '', showHome = true }: BreadcrumbProps) {
  const { language } = useLanguage()
  
  const breadcrumbItems = showHome 
    ? [{ 
        name: 'Home', 
        nameNL: 'Home', 
        href: '/', 
        current: false 
      }, ...items]
    : items

  // Generate structured data for breadcrumbs
  const structuredData = getBreadcrumbSchema(
    breadcrumbItems.map(item => ({
      name: language === 'nl' ? item.nameNL : item.name,
      url: `https://workflo.it${item.href}`
    }))
  )

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      {/* Breadcrumb Navigation */}
      <nav 
        className={`flex ${className}`} 
        aria-label={language === 'nl' ? 'Navigatie pad' : 'Breadcrumb navigation'}
      >
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          {breadcrumbItems.map((item, index) => (
            <li key={item.href} className="inline-flex items-center">
              {index > 0 && (
                <ChevronRight 
                  className="w-4 h-4 text-gray-400 mx-1" 
                  aria-hidden="true"
                />
              )}
              
              {item.current ? (
                <span 
                  className="text-gray-500 text-sm font-medium"
                  aria-current="page"
                >
                  {index === 0 && showHome ? (
                    <Home className="w-4 h-4" aria-label={language === 'nl' ? 'Home' : 'Home'} />
                  ) : (
                    language === 'nl' ? item.nameNL : item.name
                  )}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={`inline-flex items-center text-sm font-medium transition-colors duration-200 ${
                    index === 0 && showHome
                      ? 'text-gray-700 hover:text-workflo-yellow-dark'
                      : 'text-gray-700 hover:text-workflo-yellow-dark'
                  }`}
                  {...(index === 0 && showHome && {
                    'aria-label': language === 'nl' ? 'Terug naar home' : 'Back to home'
                  })}
                >
                  {index === 0 && showHome ? (
                    <Home className="w-4 h-4" />
                  ) : (
                    language === 'nl' ? item.nameNL : item.name
                  )}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

// Utility function to generate breadcrumbs from pathname
export function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(segment => segment !== '')
  const breadcrumbs: BreadcrumbItem[] = []
  
  // Define path mappings for better breadcrumb names
  const pathMappings: Record<string, { name: string; nameNL: string }> = {
    'diensten': { name: 'Services', nameNL: 'Diensten' },
    'managed-it': { name: 'Managed IT', nameNL: 'Managed IT' },
    'cybersecurity': { name: 'Cybersecurity', nameNL: 'Cybersecurity' },
    'cloud': { name: 'Cloud Solutions', nameNL: 'Cloud-oplossingen' },
    'cloud-oplossingen': { name: 'Cloud Solutions', nameNL: 'Cloud-oplossingen' },
    'microsoft-365': { name: 'Microsoft 365', nameNL: 'Microsoft 365' },
    'backup-disaster-recovery': { name: 'Backup & Disaster Recovery', nameNL: 'Backup & Disaster Recovery' },
    'hardware-as-a-service': { name: 'Hardware as a Service', nameNL: 'Hardware as a Service' },
    'voip-telefonie': { name: 'VoIP Telephony', nameNL: 'VoIP Telefonie' },
    'sectoren': { name: 'Sectors', nameNL: 'Sectoren' },
    'architecten': { name: 'Architects', nameNL: 'Architecten' },
    'divers': { name: 'Various', nameNL: 'Divers' },
    'financiele-sector': { name: 'Financial Sector', nameNL: 'Financiële Sector' },
    'gezondheidszorg': { name: 'Healthcare', nameNL: 'Gezondheidszorg' },
    'marketing-reclame': { name: 'Marketing & Advertising', nameNL: 'Marketing & Reclame' },
    'media': { name: 'Media', nameNL: 'Media' },
    'non-profit': { name: 'Non-Profit', nameNL: 'Non-Profit' },
    'retail': { name: 'Retail', nameNL: 'Retail' },
    'zzp': { name: 'Freelancers', nameNL: 'ZZP' },
    'over-ons': { name: 'About Us', nameNL: 'Over Ons' },
    'tarieven': { name: 'Rates', nameNL: 'Tarieven' },
    'contact': { name: 'Contact', nameNL: 'Contact' },
    'nieuws': { name: 'News', nameNL: 'Nieuws' },
    'faq': { name: 'FAQ', nameNL: 'Veelgestelde Vragen' },
    'werken-bij': { name: 'Careers', nameNL: 'Werken bij Workflo' },
    'careers': { name: 'Careers', nameNL: 'Carrières' },
    'portfolio': { name: 'Portfolio', nameNL: 'Portfolio' },
    'case-studies': { name: 'Case Studies', nameNL: 'Casestudies' },
    'testimonials': { name: 'Testimonials', nameNL: 'Testimonials' },
    'prijzen': { name: 'Pricing', nameNL: 'Prijzen' },
    'referral': { name: 'Referral Program', nameNL: 'Referral Programma' },
    'tevredenheidscheck': { name: 'Satisfaction Check', nameNL: 'Tevredenheidscheck' },
    'servicedesk': { name: 'Service Desk', nameNL: 'Servicedesk' },
    'support': { name: 'Support', nameNL: 'Support' },
    'privacy': { name: 'Privacy Policy', nameNL: 'Privacy Beleid' },
    'terms': { name: 'Terms & Conditions', nameNL: 'Algemene Voorwaarden' },
    'cookies': { name: 'Cookie Policy', nameNL: 'Cookie Beleid' },
    'disclaimer': { name: 'Disclaimer', nameNL: 'Disclaimer' },
  }
  
  let currentPath = ''
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === pathSegments.length - 1
    
    const mapping = pathMappings[segment]
    if (mapping) {
      breadcrumbs.push({
        name: mapping.name,
        nameNL: mapping.nameNL,
        href: currentPath,
        current: isLast
      })
    } else {
      // Fallback: capitalize the segment
      const name = segment.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
      
      breadcrumbs.push({
        name,
        nameNL: name,
        href: currentPath,
        current: isLast
      })
    }
  })
  
  return breadcrumbs
}
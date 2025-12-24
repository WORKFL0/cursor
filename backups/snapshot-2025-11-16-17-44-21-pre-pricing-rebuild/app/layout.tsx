import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { HeaderNew } from '@/components/layout/header-new'
import { EnterpriseHeader } from '@/components/layout/enterprise-header'
import { ModernHeader } from '@/components/navigation/modern-header'
import { SimpleHeader } from '@/components/navigation/simple-header'
import { FooterModern } from '@/components/layout/footer-modern'
import { Toaster } from '@/components/ui/toaster'
import { LanguageProvider } from '@/lib/contexts/language-context'
import { ThemeProvider } from '@/lib/contexts/theme-context'
import { CookieConsentBanner } from '@/components/shared/cookie-consent'
import DangerTape from '@/components/shared/danger-tape'
import { siteConfig } from '@/lib/data/workflo-data'
import { AnalyticsProvider } from '@/components/analytics/analytics-provider'
import { AIChatbot } from '@/components/ai/AIChatbot'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import BottomNavigation from '@/components/BottomNavigation'
import LoadingProgressBar from '@/components/LoadingProgressBar'
import PageTransition from '@/components/PageTransition'
// import { TestClientInteraction } from '@/components/test-client-interaction'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Workflo | Amsterdam IT Services - Managed IT, Cloud & Cybersecurity',
    template: '%s | Workflo IT Amsterdam',
  },
  description: 'Workflo provides comprehensive IT services in Amsterdam: managed IT support, cloud solutions, cybersecurity & Microsoft 365. Fixed monthly pricing, 24/7 support. Contact us today!',
  applicationName: 'Workflo IT Services',
  keywords: [
    'IT Services Amsterdam', 'Managed IT Amsterdam', 'IT ondersteuning Nederland',
    'Cloud oplossingen Amsterdam', 'Microsoft 365 Amsterdam', 'IT support 24/7',
    'Cybersecurity Amsterdam', 'GDPR compliance IT', 'Azure cloud services',
    'IT partner Amsterdam', 'Helpdesk Amsterdam', 'IT abonnement bedrijven',
    'Computer reparatie Amsterdam', 'Backup disaster recovery', 'VoIP telefonie',
    'Hardware as a Service', 'IT outsourcing Amsterdam', 'Werkplek beheer'
  ],
  referrer: 'origin-when-cross-origin',
  generator: 'Next.js 15',
  authors: [{ name: 'Workflo B.V.', url: 'https://workflo.it' }],
  creator: 'Workflo B.V.',
  publisher: 'Workflo B.V.',
  category: 'Technology',
  classification: 'Business Services',
  manifest: '/manifest.json',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '',
    bing: process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
  },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: siteConfig.url,
    siteName: 'Workflo',
    title: 'Workflo | Amsterdam\'s Premier IT Services Provider',
    description: 'Professional IT services in Amsterdam: managed IT, cloud solutions, cybersecurity & 24/7 support. Trusted by 500+ businesses. Contact us for a free consultation.',
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: 'Workflo IT Services Amsterdam - Managed IT, Cloud Solutions & Cybersecurity',
        type: 'image/jpeg',
      },
      {
        url: `${siteConfig.url}/images/og/workflo-services-overview.jpg`,
        width: 1200,
        height: 630,
        alt: 'Workflo IT Services Overview - Amsterdam IT Support',
        type: 'image/jpeg',
      },
    ],
    countryName: 'Netherlands',
    emails: ['info@workflo.it'],
    phoneNumbers: ['+31-20-308-0465'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@workflo_it',
    creator: '@workflo_it',
    title: 'Workflo | Amsterdam\'s Premier IT Services Provider',
    description: 'Professional IT services in Amsterdam: managed IT, cloud solutions, cybersecurity & 24/7 support. Trusted by 500+ businesses.',
    images: [`${siteConfig.url}/images/twitter-card.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
      noimageindex: false,
    },
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'nl-NL': `${siteConfig.url}`,
      'en-US': `${siteConfig.url}/en`,
    },
    types: {
      'application/rss+xml': `${siteConfig.url}/feed.xml`,
      'application/atom+xml': `${siteConfig.url}/atom.xml`,
    },
  },
  other: {
    'geo.region': 'NL-NH',
    'geo.placename': 'Amsterdam',
    'geo.position': '52.38495;4.88857',
    'ICBM': '52.38495, 4.88857',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=yes',
    'mobile-web-app-capable': 'yes',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteConfig.url}/#organization`,
        name: 'Workflo B.V.',
        legalName: 'Workflo B.V.',
        alternateName: ['Workflo', 'Workflo IT', 'Workflo Amsterdam'],
        url: siteConfig.url,
        logo: {
          '@type': 'ImageObject',
          url: `${siteConfig.url}/images/logos/workflo-logo.png`,
          width: 200,
          height: 60,
          caption: 'Workflo IT Services Logo'
        },
        image: [
          {
            '@type': 'ImageObject',
            url: `${siteConfig.url}/images/logos/workflo-logo.png`,
            width: 200,
            height: 60
          },
          {
            '@type': 'ImageObject',
            url: `${siteConfig.url}/images/og/workflo-office.jpg`,
            width: 1200,
            height: 630
          }
        ],
        description: 'Professional IT services provider in Amsterdam offering managed IT support, cloud solutions, cybersecurity, and Microsoft 365 services to businesses across the Netherlands.',
        foundingDate: '2015',
        numberOfEmployees: {
          '@type': 'QuantitativeValue',
          value: 25
        },
        naics: '541511', // Custom Computer Programming Services
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Koivistokade 3',
          addressLocality: 'Amsterdam',
          addressRegion: 'Noord-Holland',
          postalCode: '1013 AC',
          addressCountry: 'NL'
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+31-20-308-0465',
            contactType: 'customer service',
            email: 'info@workflo.it',
            availableLanguage: ['Dutch', 'English'],
            hoursAvailable: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '08:00',
              closes: '18:00'
            }
          },
          {
            '@type': 'ContactPoint',
            contactType: 'technical support',
            email: 'support@workflo.it',
            availableLanguage: ['Dutch', 'English'],
            hoursAvailable: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
              opens: '00:00',
              closes: '23:59'
            }
          }
        ],
        sameAs: [
          'https://linkedin.com/company/workflo-it',
          'https://www.kvk.nl/orderstraat/product-kiezen/?kvknummer=63542536'
        ],
        serviceArea: [
          {
            '@type': 'Place',
            name: 'Amsterdam Metropolitan Area'
          },
          {
            '@type': 'Place',
            name: 'Netherlands'
          }
        ],
        award: 'Microsoft Partner',
        certification: [
          'ISO 27001 Certified',
          'Microsoft Gold Partner',
          'GDPR Compliance Specialist'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: 'Workflo',
        description: 'Professional IT services in Amsterdam: managed IT, cloud solutions, cybersecurity & 24/7 support.',
        publisher: {
          '@id': `${siteConfig.url}/#organization`
        },
        inLanguage: ['nl-NL', 'en-US'],
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteConfig.url}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': ['LocalBusiness', 'ProfessionalService'],
        '@id': `${siteConfig.url}/#localbusiness`,
        name: 'Workflo B.V.',
        image: [
          `${siteConfig.url}/images/logos/workflo-logo.png`,
          `${siteConfig.url}/images/og/workflo-office.jpg`
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Koivistokade 3',
          addressLocality: 'Amsterdam',
          addressRegion: 'Noord-Holland',
          postalCode: '1013 AC',
          addressCountry: 'NL'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 52.38495507204196,
          longitude: 4.888571976608
        },
        telephone: '+31-20-308-0465',
        email: 'info@workflo.it',
        url: siteConfig.url,
        priceRange: '€150-€500',
        paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer', 'Invoice'],
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00',
            closes: '18:00'
          }
        ],
        description: 'Professional IT services provider offering managed IT support, cloud solutions, cybersecurity, and Microsoft 365 services to businesses in Amsterdam and throughout the Netherlands.',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '150',
          bestRating: '5',
          worstRating: '1'
        },
        review: [
          {
            '@type': 'Review',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: '5',
              bestRating: '5'
            },
            author: {
              '@type': 'Person',
              name: 'Anonymous Client'
            },
            reviewBody: 'Excellent IT support and proactive management. Workflo has transformed our IT infrastructure.'
          }
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'IT Services Portfolio',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Managed IT Services',
                description: 'Complete IT management, 24/7 monitoring, and proactive maintenance for business continuity.',
                provider: {
                  '@id': `${siteConfig.url}/#organization`
                },
                areaServed: 'Netherlands',
                category: 'IT Management'
              },
              price: '150',
              priceCurrency: 'EUR',
              priceSpecification: {
                '@type': 'PriceSpecification',
                price: '150',
                priceCurrency: 'EUR',
                billingIncrement: 'monthly'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Cloud Solutions',
                description: 'Microsoft 365, Azure cloud migration, and cloud infrastructure management.',
                provider: {
                  '@id': `${siteConfig.url}/#organization`
                },
                areaServed: 'Netherlands',
                category: 'Cloud Computing'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Cybersecurity Services',
                description: 'Comprehensive security solutions, GDPR compliance, and threat protection.',
                provider: {
                  '@id': `${siteConfig.url}/#organization`
                },
                areaServed: 'Netherlands',
                category: 'Information Security'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Hardware as a Service',
                description: 'Complete hardware lifecycle management including procurement, deployment, and support.',
                provider: {
                  '@id': `${siteConfig.url}/#organization`
                },
                areaServed: 'Netherlands',
                category: 'Hardware Management'
              }
            }
          ]
        }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${siteConfig.url}/#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteConfig.url
          }
        ]
      }
    ]
  }

  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        {/* Performance and Resource Hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//workflo.it" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="preconnect" href="https://api.workflo.it" />
        
        {/* Theme and App Configuration */}
        <meta name="theme-color" content="#f2f400" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)" />
        <meta name="msapplication-TileColor" content="#f2f400" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Viewport and Compatibility */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, shrink-to-fit=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        
        {/* Apple Touch Icons and PWA */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#f2f400" />
      </head>
      <body className={`${inter.variable} font-sans antialiased pb-safe-bottom`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <LanguageProvider defaultLanguage="nl">
            <AnalyticsProvider>
              <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-workflo-yellow-light/5 via-transparent to-yellow-50/10">
                {/* NEW HEADER WITH CSS-ONLY HOVER DROPDOWNS */}
                <Header />
                <main className="flex-1 pt-16">{children}</main>
                <FooterModern />
              </div>
              <Toaster />
              <CookieConsentBanner />
              <AIChatbot />
              {/* <TestClientInteraction /> */}
            </AnalyticsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer-new'
import { Toaster } from '@/components/ui/toaster'
import { LanguageProvider } from '@/lib/contexts/language-context'
import { ThemeProvider } from '@/lib/contexts/theme-context'
import { CookieConsentBanner } from '@/components/shared/cookie-consent'
import DangerTape from '@/components/shared/danger-tape'
import { siteConfig } from '@/lib/data/workflo-data'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: {
    default: 'Workflo | Amsterdam\'s Trusted IT Growth Partner - Managed IT, Cloud & Cybersecurity',
    template: '%s | Workflo - Amsterdam IT Services',
  },
  description: siteConfig.description,
  keywords: [
    'IT Services Amsterdam', 'Managed IT Netherlands', 'Cloud Solutions Amsterdam', 
    'Cybersecurity Netherlands', 'SME IT Support', 'Microsoft 365 Migration Amsterdam',
    'Azure Cloud Services', 'IT Helpdesk Amsterdam', 'Network Security Netherlands',
    'Business IT Support', 'IT Consultancy Amsterdam', 'Managed Service Provider',
    'IT Infrastructure Amsterdam', 'Cloud Migration Netherlands', 'Backup Solutions',
    'VoIP Telefonie', 'Hardware as a Service', 'IT Outsourcing Amsterdam'
  ],
  authors: [{ name: 'Workflo B.V.', url: 'https://workflo.it' }],
  creator: 'Workflo B.V.',
  publisher: 'Workflo B.V.',
  category: 'Technology',
  classification: 'Business Services',
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: siteConfig.url,
    siteName: 'Workflo',
    title: 'Workflo | Amsterdam\'s Trusted IT Growth Partner',
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: 'Workflo IT Services Amsterdam - Managed IT, Cloud Solutions & Cybersecurity',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@workflo_it',
    creator: '@workflo_it',
    title: 'Workflo | Amsterdam\'s Trusted IT Growth Partner',
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/twitter-card.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'nl-NL': `${siteConfig.url}`,
      'en-US': `${siteConfig.url}/en`,
    },
  },
  other: {
    'geo.region': 'NL-NH',
    'geo.placename': 'Amsterdam',
    'geo.position': '52.3676;4.9041',
    'ICBM': '52.3676, 4.9041',
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
        alternateName: 'Workflo',
        url: siteConfig.url,
        logo: {
          '@type': 'ImageObject',
          url: `${siteConfig.url}/images/logos/workflo-logo.png`,
          width: 200,
          height: 60
        },
        image: {
          '@type': 'ImageObject',
          url: `${siteConfig.url}/images/logos/workflo-logo.png`
        },
        description: siteConfig.description,
        foundingDate: '2015',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Koivistokade 3',
          addressLocality: 'Amsterdam',
          postalCode: '1013 AC',
          addressCountry: 'NL'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+31-20-308-0465',
          contactType: 'customer service',
          email: 'info@workflo.it',
          availableLanguage: ['Dutch', 'English']
        },
        sameAs: [
          'https://linkedin.com/company/workflo-it'
        ],
        serviceArea: {
          '@type': 'Place',
          name: 'Amsterdam Metropolitan Area'
        }
      },
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: 'Workflo',
        description: siteConfig.description,
        publisher: {
          '@id': `${siteConfig.url}/#organization`
        },
        inLanguage: 'nl-NL'
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${siteConfig.url}/#localbusiness`,
        name: 'Workflo B.V.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Koivistokade 3',
          addressLocality: 'Amsterdam',
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
        openingHours: 'Mo-Fr 08:00-18:00',
        description: siteConfig.description,
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'IT Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Managed IT Services',
                description: 'Complete IT management and 24/7 monitoring'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Cloud Solutions',
                description: 'Microsoft 365 and Azure cloud services'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Cybersecurity',
                description: 'Comprehensive security solutions and GDPR compliance'
              }
            }
          ]
        }
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//workflo.it" />
        <meta name="theme-color" content="#f59e0b" />
        <meta name="msapplication-TileColor" content="#f59e0b" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <LanguageProvider defaultLanguage="nl">
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
            <CookieConsentBanner />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

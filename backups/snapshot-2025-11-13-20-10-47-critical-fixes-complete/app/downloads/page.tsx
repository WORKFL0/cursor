'use client'

import { motion } from '@/lib/framer-motion'
import { Download, FileText, Shield, Monitor, Smartphone, HelpCircle, ArrowRight, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/lib/contexts/language-context'

const downloads = {
  nl: {
    title: 'Support Tools & Downloads',
    subtitle: 'Direct hulp nodig? Download onze support tool voor snelle ondersteuning',
    categories: [
      {
        title: 'Remote Support Tools',
        icon: Monitor,
        items: [
          {
            name: 'Workflo Support Tool (TeamViewer)',
            description: 'Download deze tool voor directe hulp van ons support team - geen installatie nodig!',
            url: 'https://get.teamviewer.com/workflo-support',
            size: 'Quick Support - Geen installatie',
            badge: 'DIRECT HULP'
          },
          {
            name: 'ServiceDesk Portal',
            description: 'Direct toegang tot onze support tickets en kennisbank',
            url: 'https://servicedesk.workflo.it/portal',
            size: 'Web portal',
            badge: 'ONLINE'
          },
          {
            name: 'Documentatie',
            description: 'Technische documentatie en handleidingen',
            url: 'https://docs.workflo.it',
            size: 'Knowledge base'
          }
        ]
      },
      {
        title: 'Security Tools',
        icon: Shield,
        items: [
          {
            name: 'OpenVPN Client',
            description: 'Veilige VPN verbinding voor remote werken',
            url: 'https://openvpn.net/client/',
            size: 'Alle platformen',
            badge: 'VPN'
          },
          {
            name: 'Microsoft Security Scanner',
            description: 'Scan je systeem op malware',
            url: 'https://www.microsoft.com/security/scanner',
            size: 'Gratis tool'
          },
          {
            name: 'Cybersecurity Checklist',
            description: 'Basis beveiliging voor jouw bedrijf',
            url: '/api/download/security-checklist',
            size: 'PDF - 2 MB',
            type: 'document'
          }
        ]
      },
      {
        title: 'Mobile Apps',
        icon: Smartphone,
        items: [
          {
            name: 'Microsoft Authenticator',
            description: 'Voor veilige twee-factor authenticatie',
            url: 'https://www.microsoft.com/authenticator',
            size: 'iOS & Android',
            badge: 'Vereist voor MFA'
          },
          {
            name: 'Microsoft Teams',
            description: 'Voor communicatie en samenwerking',
            url: 'https://www.microsoft.com/microsoft-teams/download-app',
            size: 'Alle platformen'
          }
        ]
      },
      {
        title: 'Documentatie',
        icon: FileText,
        items: [
          {
            name: 'IT Onboarding Guide',
            description: 'Voor nieuwe medewerkers',
            url: '/api/download/onboarding-guide',
            size: 'PDF - 1.5 MB',
            type: 'document'
          },
          {
            name: 'Backup Best Practices',
            description: 'Hoe je jouw data veilig houdt',
            url: '/api/download/backup-guide',
            size: 'PDF - 800 KB',
            type: 'document'
          },
          {
            name: '10 IT-tips voor MKB',
            description: 'Praktische tips om je IT-kosten te verlagen',
            url: '/downloads/10-it-tips-mkb.pdf',
            size: 'PDF - 2.3 MB',
            type: 'document',
            badge: 'GRATIS E-BOOK'
          }
        ]
      }
    ]
  },
  en: {
    title: 'Support Tools & Downloads',
    subtitle: 'Need help now? Download our support tool for immediate assistance',
    categories: [
      {
        title: 'Remote Support Tools',
        icon: Monitor,
        items: [
          {
            name: 'TeamViewer QuickSupport',
            description: 'For direct support from our team',
            url: 'https://get.teamviewer.com/workflo-support',
            size: 'Web installer',
            badge: 'Recommended'
          },
          {
            name: 'ServiceDesk Portal',
            description: 'Direct access to support tickets and knowledge base',
            url: 'https://servicedesk.workflo.it/portal',
            size: 'Web portal',
            badge: 'ONLINE'
          },
          {
            name: 'Documentation',
            description: 'Technical documentation and guides',
            url: 'https://docs.workflo.it',
            size: 'Knowledge base'
          }
        ]
      },
      {
        title: 'Security Tools',
        icon: Shield,
        items: [
          {
            name: 'OpenVPN Client',
            description: 'Secure VPN connection for remote work',
            url: 'https://openvpn.net/client/',
            size: 'All platforms',
            badge: 'VPN'
          },
          {
            name: 'Microsoft Security Scanner',
            description: 'Scan your system for malware',
            url: 'https://www.microsoft.com/security/scanner',
            size: 'Free tool'
          },
          {
            name: 'Cybersecurity Checklist',
            description: 'Basic security for your business',
            url: '/api/download/security-checklist',
            size: 'PDF - 2 MB',
            type: 'document'
          }
        ]
      },
      {
        title: 'Mobile Apps',
        icon: Smartphone,
        items: [
          {
            name: 'Microsoft Authenticator',
            description: 'For secure two-factor authentication',
            url: 'https://www.microsoft.com/authenticator',
            size: 'iOS & Android',
            badge: 'Required for MFA'
          },
          {
            name: 'Microsoft Teams',
            description: 'For communication and collaboration',
            url: 'https://www.microsoft.com/microsoft-teams/download-app',
            size: 'All platforms'
          }
        ]
      },
      {
        title: 'Documentation',
        icon: FileText,
        items: [
          {
            name: 'IT Onboarding Guide',
            description: 'For new employees',
            url: '/api/download/onboarding-guide',
            size: 'PDF - 1.5 MB',
            type: 'document'
          },
          {
            name: 'Backup Best Practices',
            description: 'How to keep your data safe',
            url: '/api/download/backup-guide',
            size: 'PDF - 800 KB',
            type: 'document'
          },
          {
            name: '10 IT Tips for SMB',
            description: 'Practical tips to reduce your IT costs',
            url: '/downloads/10-it-tips-mkb.pdf',
            size: 'PDF - 2.3 MB',
            type: 'document',
            badge: 'FREE E-BOOK'
          }
        ]
      }
    ]
  }
}

export default function DownloadsPage() {
  const { language } = useLanguage()
  const content = downloads[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4" variant="outline">
              <Download className="h-3 w-3 mr-1" />
              Resources
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {content.title}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {content.subtitle}
            </p>
          </motion.div>

          {/* Categories */}
          <div className="space-y-12">
            {content.categories.map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {category.items.map((item) => (
                      <Card key={item.name} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-lg">{item.name}</CardTitle>
                              <CardDescription>{item.description}</CardDescription>
                            </div>
                            {item.badge && (
                              <Badge variant="default" className="bg-workflo-yellow text-black">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{item.size}</span>
                            <Button
                              size="sm"
                              variant={item.type === 'document' ? 'default' : 'outline'}
                              asChild
                            >
                              <a 
                                href={item.url} 
                                target={item.type === 'document' ? '_self' : '_blank'}
                                rel={item.type === 'document' ? undefined : 'noopener noreferrer'}
                              >
                                {item.type === 'document' ? (
                                  <>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </>
                                ) : (
                                  <>
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    {language === 'nl' ? 'Ga naar' : 'Go to'}
                                  </>
                                )}
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 bg-card rounded-xl p-8 text-center"
          >
            <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">
              {language === 'nl' ? 'Hulp nodig?' : 'Need help?'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {language === 'nl'
                ? 'Ons support team staat klaar om je te helpen met installatie of vragen over deze tools.'
                : 'Our support team is ready to help you with installation or questions about these tools.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <a href="https://servicedesk.workflo.it/portal" target="_blank" rel="noopener noreferrer">
                  {language === 'nl' ? 'Open Servicedesk' : 'Open Service Desk'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = 'tel:+31203080465'}
              >
                {language === 'nl' ? 'Bel 020-30 80 465' : 'Call 020-30 80 465'}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
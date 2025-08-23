'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Shield, Lock, Eye, TrendingUp, AlertCircle, ChevronRight, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useLanguage } from '@/lib/contexts/language-context'
import DangerTape, { DangerTapeSection } from '@/components/shared/danger-tape'

export function SecurityAlert() {
  const { language } = useLanguage()

  const recentBreaches = [
    {
      company: 'Gemeente Amsterdam',
      date: '2024',
      impact: '100.000+ burgers',
      type: 'Ransomware'
    },
    {
      company: 'UMC Utrecht',
      date: '2024',
      impact: 'Patiëntgegevens',
      type: 'Data lek'
    },
    {
      company: 'Nederlandse MKB',
      date: 'Dagelijks',
      impact: '43% getroffen',
      type: 'Phishing/Malware'
    }
  ]

  const stats = [
    {
      icon: TrendingUp,
      value: '+300%',
      label: language === 'nl' ? 'Toename cyberaanvallen 2024' : 'Increase in cyberattacks 2024',
      color: 'text-destructive'
    },
    {
      icon: Users,
      value: '87%',
      label: language === 'nl' ? 'Bedrijven onvoldoende beveiligd' : 'Companies insufficiently protected',
      color: 'text-warning'
    },
    {
      icon: AlertCircle,
      value: '€2.4M',
      label: language === 'nl' ? 'Gemiddelde schade per hack' : 'Average damage per hack',
      color: 'text-destructive'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-destructive/5 via-background to-warning/5">
      <div className="container mx-auto px-4">
        {/* Urgent Alert Banner with Danger Tape */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="bg-destructive text-destructive-foreground rounded-lg p-4 flex items-center justify-between shadow-xl relative overflow-hidden">
            <DangerTape variant="warning" className="absolute top-0 left-0 right-0" />
            <DangerTape variant="warning" className="absolute bottom-0 left-0 right-0" />
            
            <div className="flex items-center gap-3 relative z-10">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
              <div>
                <p className="font-bold text-lg">
                  {language === 'nl' 
                    ? '⚠️ WAARSCHUWING: Nederlandse bedrijven massaal doelwit van hackers'
                    : '⚠️ WARNING: Dutch companies massively targeted by hackers'
                  }
                </p>
                <p className="text-sm opacity-90">
                  {language === 'nl'
                    ? 'Elke 11 seconden wordt een bedrijf gehackt. Is jouw bedrijf de volgende?'
                    : 'Every 11 seconds a company gets hacked. Is your company next?'
                  }
                </p>
              </div>
            </div>
            <div className="relative z-10">
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-card text-destructive hover:bg-muted font-bold border-2 border-destructive-foreground">
                asChild
              >
                <Link href="/diensten/cybersecurity">
                  {language === 'nl' ? 'Test Je Beveiliging' : 'Test Your Security'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Recent Breaches */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-destructive text-destructive-foreground">
              {language === 'nl' ? 'Actueel Nieuws' : 'Breaking News'}
            </Badge>
            
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              {language === 'nl'
                ? 'Recente Cyber Aanvallen in Nederland'
                : 'Recent Cyber Attacks in The Netherlands'
              }
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              {language === 'nl'
                ? 'Dit zijn geen verhalen uit het buitenland. Dit gebeurt NU, hier in Nederland, bij bedrijven zoals die van jou.'
                : 'These are not foreign stories. This is happening NOW, here in the Netherlands, to companies like yours.'
              }
            </p>

            <div className="space-y-4 mb-8">
              {recentBreaches.map((breach, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-l-4 border-l-destructive hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{breach.company}</h3>
                          <p className="text-sm text-muted-foreground">
                            {breach.type} • {breach.impact}
                          </p>
                        </div>
                        <Badge variant="destructive">{breach.date}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
              <p className="text-sm font-medium text-warning">
                💡 <strong>{language === 'nl' ? 'Wist je dat?' : 'Did you know?'}</strong>
                {language === 'nl'
                  ? ' 95% van de hacks had voorkomen kunnen worden met basis cybersecurity maatregelen.'
                  : ' 95% of hacks could have been prevented with basic cybersecurity measures.'
                }
              </p>
            </div>
          </motion.div>

          {/* Right: Protection Offer */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-2 border-primary shadow-2xl relative overflow-hidden">
              <DangerTape variant="alert" className="absolute top-0 left-0 right-0 z-30" />
              <CardHeader className="bg-gradient-to-r from-secondary to-muted text-foreground relative">
                <div className="flex items-center gap-3 relative z-10">
                  <div className="relative">
                    <Shield className="w-8 h-8 text-primary" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl flex items-center">
                      <span className="text-warning mr-2">⚠️</span>
                      {language === 'nl' ? 'Bescherm Je Bedrijf NU' : 'Protect Your Business NOW'}
                      <span className="text-warning ml-2">⚠️</span>
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">
                      {language === 'nl' 
                        ? 'Voordat het te laat is'
                        : 'Before it\'s too late'
                      }
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="space-y-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className={`p-2 bg-muted rounded-lg ${stat.color}`}>
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-xl">{stat.value}</p>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* What We Offer */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-lg">
                      {language === 'nl' ? 'Workflo Cybersecurity:' : 'Workflo Cybersecurity:'}
                    </h4>
                    <ul className="space-y-2">
                      {[
                        language === 'nl' ? '24/7 Threat Monitoring' : '24/7 Threat Monitoring',
                        language === 'nl' ? 'Advanced Firewall & Antivirus' : 'Advanced Firewall & Antivirus',
                        language === 'nl' ? 'Ransomware Bescherming' : 'Ransomware Protection',
                        language === 'nl' ? 'Email Security & Phishing Filter' : 'Email Security & Phishing Filter',
                        language === 'nl' ? 'Security Awareness Training' : 'Security Awareness Training',
                        language === 'nl' ? 'Incident Response Team' : 'Incident Response Team'
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-success" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Button 
                        size="lg" 
                        className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground relative z-10"
                        asChild
                      >
                        <Link href="/contact">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          {language === 'nl' ? 'Vraag Gratis Security Scan Aan' : 'Request Free Security Scan'}
                        </Link>
                      </Button>
                      <DangerTape variant="warning" className="absolute -bottom-1 left-0 right-0" animate />
                    </div>
                    
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <Link href="/diensten/cybersecurity">
                        <Eye className="w-4 h-4 mr-2" />
                        {language === 'nl' ? 'Bekijk Onze Security Oplossingen' : 'View Our Security Solutions'}
                      </Link>
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      {language === 'nl'
                        ? '⚡ Binnen 24 uur volledig beveiligd • Geen setup kosten'
                        : '⚡ Fully protected within 24 hours • No setup costs'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-lg font-medium text-foreground">
            {language === 'nl'
              ? '\"De vraag is niet OF je gehackt wordt, maar WANNEER.\"'
              : '\"The question is not IF you will be hacked, but WHEN.\"'
            }
          </p>
          <p className="text-muted-foreground mt-2">
            {language === 'nl'
              ? '- Nederlandse Cybersecurity Raad, 2024'
              : '- Dutch Cybersecurity Council, 2024'
            }
          </p>
        </motion.div>
      </div>
    </section>
  )
}
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  Monitor, 
  HeadphonesIcon, 
  Cloud, 
  Lock, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Zap,
  Database,
  Mail,
  Phone,
  FileText,
  Settings,
  RefreshCw,
  CheckCircle,
  Clock,
  Car,
  Home,
  Wrench,
  HardDrive,
  Network,
  Bug,
  BarChart,
  UserCheck,
  FolderSync,
  Smartphone,
  Laptop,
  Server,
  Briefcase
} from 'lucide-react'

interface ServiceFeature {
  icon: React.ReactNode
  title: string
  description: string
  included: boolean
}

interface ServicePackage {
  type: 'remote' | 'onsite'
  features: ServiceFeature[]
}

export function MSPServicesBreakdown({ language }: { language: string }) {
  const remoteServices: ServiceFeature[] = [
    {
      icon: <Monitor className="w-5 h-5" />,
      title: language === 'nl' ? '24/7 Monitoring' : '24/7 Monitoring',
      description: language === 'nl' 
        ? 'Continue bewaking van al je systemen, servers en netwerkapparatuur. We detecteren problemen voordat ze impact hebben.'
        : 'Continuous monitoring of all your systems, servers and network equipment. We detect issues before they impact you.',
      included: true
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: language === 'nl' ? 'Cybersecurity Suite' : 'Cybersecurity Suite',
      description: language === 'nl'
        ? 'Complete bescherming met antivirus, anti-malware, firewall beheer, en email security. Inclusief alle security licenties!'
        : 'Complete protection with antivirus, anti-malware, firewall management, and email security. All security licenses included!',
      included: true
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: language === 'nl' ? 'Automatische Updates' : 'Automatic Updates',
      description: language === 'nl'
        ? 'Alle Windows updates, driver updates en software patches automatisch geïnstalleerd buiten kantooruren.'
        : 'All Windows updates, driver updates and software patches automatically installed outside office hours.',
      included: true
    },
    {
      icon: <FolderSync className="w-5 h-5" />,
      title: language === 'nl' ? 'Backup & Disaster Recovery' : 'Backup & Disaster Recovery',
      description: language === 'nl'
        ? 'Dagelijkse backups van kritieke data met 30 dagen retentie. Snelle restore bij calamiteiten.'
        : 'Daily backups of critical data with 30 day retention. Quick restore in case of disasters.',
      included: true
    },
    {
      icon: <HeadphonesIcon className="w-5 h-5" />,
      title: language === 'nl' ? 'Remote Helpdesk' : 'Remote Helpdesk',
      description: language === 'nl'
        ? 'Direct hulp via telefoon, chat of remote access. Gemiddelde responstijd: 5 minuten tijdens kantooruren.'
        : 'Instant help via phone, chat or remote access. Average response time: 5 minutes during office hours.',
      included: true
    },
    {
      icon: <UserCheck className="w-5 h-5" />,
      title: language === 'nl' ? 'Gebruikersbeheer' : 'User Management',
      description: language === 'nl'
        ? 'Volledige Active Directory/Azure AD beheer. Nieuwe accounts, wachtwoord resets, toegangsrechten - alles geregeld.'
        : 'Complete Active Directory/Azure AD management. New accounts, password resets, access rights - all handled.',
      included: true
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: language === 'nl' ? 'Email & Microsoft 365 Beheer' : 'Email & Microsoft 365 Management',
      description: language === 'nl'
        ? 'Complete email setup, spam filtering, mailbox beheer en Microsoft 365 optimalisatie.'
        : 'Complete email setup, spam filtering, mailbox management and Microsoft 365 optimization.',
      included: true
    },
    {
      icon: <Network className="w-5 h-5" />,
      title: language === 'nl' ? 'Netwerk Management' : 'Network Management',
      description: language === 'nl'
        ? 'WiFi configuratie, VPN setup, router/switch beheer en netwerk optimalisatie voor maximale performance.'
        : 'WiFi configuration, VPN setup, router/switch management and network optimization for maximum performance.',
      included: true
    },
    {
      icon: <Laptop className="w-5 h-5" />,
      title: language === 'nl' ? 'Asset Management' : 'Asset Management',
      description: language === 'nl'
        ? 'Inventarisatie van alle hardware en software. Licentie tracking en verloopdatum bewaking.'
        : 'Inventory of all hardware and software. License tracking and expiration monitoring.',
      included: true
    },
    {
      icon: <Bug className="w-5 h-5" />,
      title: language === 'nl' ? 'Proactief Onderhoud' : 'Proactive Maintenance',
      description: language === 'nl'
        ? 'Automatische schijfopruiming, defragmentatie, registry optimalisatie en performance tuning.'
        : 'Automatic disk cleanup, defragmentation, registry optimization and performance tuning.',
      included: true
    },
    {
      icon: <BarChart className="w-5 h-5" />,
      title: language === 'nl' ? 'Maandelijkse Rapportages' : 'Monthly Reports',
      description: language === 'nl'
        ? 'Gedetailleerde rapporten over systeem gezondheid, incidents, en verbeterpunten.'
        : 'Detailed reports on system health, incidents, and improvement points.',
      included: true
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: language === 'nl' ? 'Documentatie & Procedures' : 'Documentation & Procedures',
      description: language === 'nl'
        ? 'Complete IT documentatie, netwerk diagrammen en disaster recovery procedures.'
        : 'Complete IT documentation, network diagrams and disaster recovery procedures.',
      included: true
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: language === 'nl' ? 'Mobile Device Management' : 'Mobile Device Management',
      description: language === 'nl'
        ? 'Beheer van smartphones en tablets. Remote wipe bij verlies of diefstal.'
        : 'Management of smartphones and tablets. Remote wipe in case of loss or theft.',
      included: true
    },
    {
      icon: <Cloud className="w-5 h-5" />,
      title: language === 'nl' ? 'Cloud Services Beheer' : 'Cloud Services Management',
      description: language === 'nl'
        ? 'Setup en beheer van cloud diensten zoals SharePoint, OneDrive, Teams en andere SaaS applicaties.'
        : 'Setup and management of cloud services like SharePoint, OneDrive, Teams and other SaaS applications.',
      included: true
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: language === 'nl' ? 'Security Awareness Training' : 'Security Awareness Training',
      description: language === 'nl'
        ? 'Maandelijkse phishing simulaties en security trainingen voor je medewerkers.'
        : 'Monthly phishing simulations and security training for your employees.',
      included: true
    }
  ]

  const onsiteExtraServices: ServiceFeature[] = [
    {
      icon: <Car className="w-5 h-5" />,
      title: language === 'nl' ? 'On-site Bezoeken' : 'On-site Visits',
      description: language === 'nl'
        ? 'Wekelijkse on-site bezoeken voor hands-on support en hardware onderhoud. Binnen 4 uur ter plaatse bij urgente issues.'
        : 'Weekly on-site visits for hands-on support and hardware maintenance. On-site within 4 hours for urgent issues.',
      included: true
    },
    {
      icon: <Wrench className="w-5 h-5" />,
      title: language === 'nl' ? 'Hardware Installatie & Reparatie' : 'Hardware Installation & Repair',
      description: language === 'nl'
        ? 'Complete hardware setup, installatie van nieuwe werkplekken, printers, servers. Inclusief fysieke reparaties.'
        : 'Complete hardware setup, installation of new workstations, printers, servers. Including physical repairs.',
      included: true
    },
    {
      icon: <Server className="w-5 h-5" />,
      title: language === 'nl' ? 'Server Room Management' : 'Server Room Management',
      description: language === 'nl'
        ? 'Fysiek onderhoud serverruimte, kabelmanagement, temperatuur monitoring en UPS controles.'
        : 'Physical server room maintenance, cable management, temperature monitoring and UPS checks.',
      included: true
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: language === 'nl' ? 'Persoonlijke Training' : 'Personal Training',
      description: language === 'nl'
        ? 'On-site trainingen voor nieuwe software, best practices en persoonlijke begeleiding.'
        : 'On-site training for new software, best practices and personal guidance.',
      included: true
    },
    {
      icon: <Briefcase className="w-5 h-5" />,
      title: language === 'nl' ? 'VIP Support' : 'VIP Support',
      description: language === 'nl'
        ? 'Prioriteit support met dedicated engineer. Direct contact met je vaste technicus.'
        : 'Priority support with dedicated engineer. Direct contact with your dedicated technician.',
      included: true
    }
  ]

  return (
    <div className="space-y-12">
      {/* Introduction */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            {language === 'nl' ? 'Wat doet Workflo als jouw MSP?' : 'What does Workflo do as your MSP?'}
          </CardTitle>
          <CardDescription className="text-lg mt-4">
            {language === 'nl'
              ? 'Als Managed Service Provider (MSP) nemen wij de complete IT-verantwoordelijkheid van je over. Je krijgt een volledig IT-team voor een vaste prijs per maand. Geen verrassingen, geen extra kosten voor support tickets, gewoon alles geregeld.'
              : 'As a Managed Service Provider (MSP), we take complete IT responsibility off your hands. You get a complete IT team for a fixed monthly price. No surprises, no extra costs for support tickets, everything is simply handled.'
            }
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Service Packages */}
      <Tabs defaultValue="remote" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="remote" className="text-lg">
            <Home className="w-4 h-4 mr-2" />
            {language === 'nl' ? 'Remote Support (€60)' : 'Remote Support (€60)'}
          </TabsTrigger>
          <TabsTrigger value="onsite" className="text-lg">
            <Car className="w-4 h-4 mr-2" />
            {language === 'nl' ? 'Onsite Support (€90)' : 'Onsite Support (€90)'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="remote" className="mt-8">
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-3">
                {language === 'nl' ? 'Remote Support Pakket' : 'Remote Support Package'}
              </h3>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                {language === 'nl'
                  ? 'Perfect voor moderne bedrijven die vooral digitaal werken. Alle IT-ondersteuning op afstand met razendsnelle responstijden.'
                  : 'Perfect for modern businesses that work primarily digitally. All IT support remotely with lightning-fast response times.'
                }
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {remoteServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          {service.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            {service.title}
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="onsite" className="mt-8">
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-3">
                {language === 'nl' ? 'Onsite Support Pakket' : 'Onsite Support Package'}
              </h3>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                {language === 'nl'
                  ? 'De complete oplossing inclusief fysieke aanwezigheid. Alles van Remote Support PLUS wekelijkse bezoeken en hands-on ondersteuning.'
                  : 'The complete solution including physical presence. Everything from Remote Support PLUS weekly visits and hands-on support.'
                }
              </p>
              <Badge className="mt-4 bg-green-600 text-white">
                {language === 'nl' ? 'Inclusief ALLE Remote Services + Extra\'s' : 'Includes ALL Remote Services + Extras'}
              </Badge>
            </div>

            {/* All Remote Services */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4 text-center">
                {language === 'nl' ? '✅ Alle Remote Support diensten zijn inbegrepen' : '✅ All Remote Support services are included'}
              </h4>
              <div className="grid md:grid-cols-3 gap-3 mb-8">
                {remoteServices.map((service, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>{service.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Onsite Extras */}
            <div>
              <h4 className="text-xl font-semibold mb-6 text-center text-primary">
                {language === 'nl' ? '⭐ Exclusieve Onsite Extra\'s' : '⭐ Exclusive Onsite Extras'}
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {onsiteExtraServices.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full border-2 border-primary/20 hover:border-primary/40 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            {service.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              {service.title}
                              <Badge variant="default" className="text-xs">
                                {language === 'nl' ? 'Exclusief' : 'Exclusive'}
                              </Badge>
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Value Proposition */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/20">
        <CardContent className="p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              {language === 'nl' ? '💡 Waarom kiezen voor Workflo?' : '💡 Why choose Workflo?'}
            </h3>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">€0</div>
                <p className="text-sm text-muted-foreground">
                  {language === 'nl' ? 'Extra kosten voor support tickets' : 'Extra costs for support tickets'}
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">5 min</div>
                <p className="text-sm text-muted-foreground">
                  {language === 'nl' ? 'Gemiddelde responstijd' : 'Average response time'}
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <p className="text-sm text-muted-foreground">
                  {language === 'nl' ? 'Monitoring & bescherming' : 'Monitoring & protection'}
                </p>
              </div>
            </div>
            <p className="mt-8 text-lg font-medium">
              {language === 'nl'
                ? 'Je betaalt één vast bedrag per maand en krijgt er een compleet IT-team voor terug. Geen verborgen kosten, geen verrassingen.'
                : 'You pay one fixed amount per month and get a complete IT team in return. No hidden costs, no surprises.'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
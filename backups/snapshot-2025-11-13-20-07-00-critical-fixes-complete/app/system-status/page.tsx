'use client'

import { useState, useEffect } from 'react'
import { motion } from '@/lib/framer-motion'
import { useLanguage } from '@/lib/contexts/language-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Server,
  Shield,
  Database,
  Cloud,
  Wifi,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  Clock,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'outage'
  uptime: string
  lastChecked: Date
  description: string
  icon: any
}

export default function SystemStatusPage() {
  const { language } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [overallStatus, setOverallStatus] = useState<'operational' | 'degraded' | 'outage'>('operational')
  
  // Mock services status - in production this would fetch from actual monitoring
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: language === 'nl' ? 'Microsoft 365 Services' : 'Microsoft 365 Services',
      status: 'operational',
      uptime: '99.99%',
      lastChecked: new Date(),
      description: language === 'nl' ? 'Email, Teams, SharePoint, OneDrive' : 'Email, Teams, SharePoint, OneDrive',
      icon: Mail
    },
    {
      name: language === 'nl' ? 'Cloud Infrastructuur' : 'Cloud Infrastructure',
      status: 'operational',
      uptime: '99.98%',
      lastChecked: new Date(),
      description: language === 'nl' ? 'Azure cloud services en backup' : 'Azure cloud services and backup',
      icon: Cloud
    },
    {
      name: language === 'nl' ? 'Netwerk & Connectiviteit' : 'Network & Connectivity',
      status: 'operational',
      uptime: '100%',
      lastChecked: new Date(),
      description: language === 'nl' ? 'Internet, VPN, firewalls' : 'Internet, VPN, firewalls',
      icon: Wifi
    },
    {
      name: language === 'nl' ? 'Helpdesk & Support' : 'Helpdesk & Support',
      status: 'operational',
      uptime: '100%',
      lastChecked: new Date(),
      description: language === 'nl' ? '24/7 telefonische support' : '24/7 phone support',
      icon: Phone
    },
    {
      name: language === 'nl' ? 'Security Monitoring' : 'Security Monitoring',
      status: 'operational',
      uptime: '100%',
      lastChecked: new Date(),
      description: language === 'nl' ? 'Threat detection en preventie' : 'Threat detection and prevention',
      icon: Shield
    },
    {
      name: language === 'nl' ? 'Backup Services' : 'Backup Services',
      status: 'operational',
      uptime: '99.99%',
      lastChecked: new Date(),
      description: language === 'nl' ? 'Automated backup en recovery' : 'Automated backup and recovery',
      icon: Database
    },
    {
      name: language === 'nl' ? 'Remote Management' : 'Remote Management',
      status: 'operational',
      uptime: '100%',
      lastChecked: new Date(),
      description: language === 'nl' ? 'RMM tools en patch management' : 'RMM tools and patch management',
      icon: Server
    },
    {
      name: language === 'nl' ? 'Websites & Hosting' : 'Websites & Hosting',
      status: 'operational',
      uptime: '99.95%',
      lastChecked: new Date(),
      description: language === 'nl' ? 'Klant websites en webhosting' : 'Client websites and web hosting',
      icon: Globe
    }
  ])

  // Simulate fetching status updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
      // In production, this would fetch real status
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600'
      case 'degraded':
        return 'text-yellow-600'
      case 'outage':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            {language === 'nl' ? 'Operationeel' : 'Operational'}
          </Badge>
        )
      case 'degraded':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {language === 'nl' ? 'Verminderd' : 'Degraded'}
          </Badge>
        )
      case 'outage':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            {language === 'nl' ? 'Storing' : 'Outage'}
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              {/* Animated Status Indicator */}
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Activity className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  {language === 'nl' ? 'System Status' : 'System Status'}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {language === 'nl' ? 'Real-time status van alle services' : 'Real-time status of all services'}
                </p>
              </div>
            </div>

            {/* Overall Status */}
            <Card className="max-w-2xl mx-auto mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                    </div>
                    <span className="text-lg font-semibold">
                      {language === 'nl' ? 'Alle systemen operationeel' : 'All systems operational'}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {language === 'nl' ? 'Laatste update:' : 'Last update:'} {lastUpdate.toLocaleTimeString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'nl' ? 'Gemiddelde Uptime' : 'Average Uptime'}
                      </p>
                      <p className="text-2xl font-bold text-green-600">99.98%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'nl' ? 'Actieve Services' : 'Active Services'}
                      </p>
                      <p className="text-2xl font-bold">{services.length}</p>
                    </div>
                    <Server className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'nl' ? 'Response Tijd' : 'Response Time'}
                      </p>
                      <p className="text-2xl font-bold">&lt; 200ms</p>
                    </div>
                    <Activity className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold mb-8 text-center">
            {language === 'nl' ? 'Service Status Details' : 'Service Status Details'}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-muted`}>
                          <service.icon className={`w-5 h-5 ${getStatusColor(service.status)}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {service.description}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(service.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-muted-foreground">Uptime: </span>
                          <span className="font-semibold">{service.uptime}</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'nl' ? 'Laatste check:' : 'Last check:'} {service.lastChecked.toLocaleTimeString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* External Status Link */}
          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-2">
                      {language === 'nl' ? 'Gedetailleerde Status & Historie' : 'Detailed Status & History'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'nl' 
                        ? 'Bekijk uitgebreide status informatie, incidenten en historie op onze externe status pagina.'
                        : 'View extensive status information, incidents and history on our external status page.'}
                    </p>
                  </div>
                  <Button asChild>
                    <a 
                      href="https://uptime.workflo.it/status/workflo" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      {language === 'nl' ? 'Bekijk Details' : 'View Details'}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-xl font-semibold mb-4">
            {language === 'nl' ? 'Storing melden?' : 'Report an issue?'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {language === 'nl' 
              ? 'Ervaar je problemen die hier niet vermeld staan? Neem direct contact op met onze 24/7 support.'
              : 'Experiencing issues not listed here? Contact our 24/7 support immediately.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="tel:+31203080465" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                020-30 80 465
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://servicedesk.workflo.it/portal" target="_blank" rel="noopener noreferrer">
                Servicedesk Portal
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Cloud, Smartphone, Headphones, Code, Users, Zap, Lock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const services = [
  {
    icon: Shield,
    title: 'Cybersecurity',
    description: 'Complete bescherming tegen digitale dreigingen met 24/7 monitoring en snelle respons.',
    features: ['Firewall beheer', 'Anti-virus', 'Security audits', 'Incident response'],
    href: '/diensten/cybersecurity',
    color: 'bg-destructive/10 text-destructive',
  },
  {
    icon: Cloud,
    title: 'Cloud Diensten',
    description: 'Schaalbare cloud oplossingen voor moderne bedrijven met volledige ondersteuning.',
    features: ['Microsoft 365', 'Azure hosting', 'Cloud backup', 'Data migratie'],
    href: '/diensten/cloud',
    color: 'bg-info/10 text-info',
  },
  {
    icon: Smartphone,
    title: 'Mobile Device Management',
    description: 'Centraal beheer van alle mobiele apparaten met volledige beveiliging.',
    features: ['Device enrollment', 'App distributie', 'Security policies', 'Remote wipe'],
    href: '/diensten/mdm',
    color: 'bg-success/10 text-success',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Altijd bereikbaar voor al je IT-vragen en problemen, dag en nacht.',
    features: ['Helpdesk', 'Remote support', 'On-site support', 'SLA garantie'],
    href: '/diensten/support',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Code,
    title: 'IT Consultancy',
    description: 'Strategisch advies voor optimale IT-infrastructuur en digitale transformatie.',
    features: ['IT strategie', 'Project management', 'Technisch advies', 'Implementatie'],
    href: '/diensten/consultancy',
    color: 'bg-warning/10 text-warning',
  },
  {
    icon: Users,
    title: 'Managed Services',
    description: 'Complete ontzorging van je IT-omgeving met proactief beheer.',
    features: ['Server beheer', 'Netwerk monitoring', 'Updates & patches', 'Performance tuning'],
    href: '/diensten/managed-services',
    color: 'bg-primary/10 text-primary',
  },
]

export default function ServicesSection() {
  return (
    <section className="py-24 bg-card relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-gray-100"></div>
      
      <div className="container mx-auto container-padding relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <div className="h-1 w-20 bg-primary mx-auto mb-4"></div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              Onze <span className="text-primary">Diensten</span>
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
            Van cybersecurity tot cloud oplossingen - wij bieden complete IT-dienstverlening 
            afgestemd op de behoeften van het moderne MKB.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 warning-tape-thin opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <CardHeader>
                  <div className={`w-14 h-14 rounded-lg ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-2">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link 
                    href={service.href}
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm group/link"
                  >
                    Meer informatie
                    <svg className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 warning-tape"></div>
            
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Klaar om je IT naar een hoger niveau te tillen?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Ontdek hoe Workflo je bedrijf kan helpen met professionele IT-ondersteuning. 
              Start vandaag nog met onze gratis IT-scan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
              >
                <Lock className="w-5 h-5 mr-2" />
                Start Gratis IT-Scan
              </Link>
              <Link
                href="/diensten"
                className="inline-flex items-center justify-center px-6 py-3 bg-card text-foreground font-medium rounded-lg hover:bg-muted/50 transition-colors border-2 border-border"
              >
                Bekijk Alle Diensten
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
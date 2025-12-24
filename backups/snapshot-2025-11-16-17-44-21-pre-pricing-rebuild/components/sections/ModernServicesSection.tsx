'use client'

import { Monitor, Cloud, Shield, Headphones, Server, Lock } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/language-context'
import { motion } from 'framer-motion'
import { LinkTertiary } from '@/components/ui/button-art-director'

export default function ModernServicesSection() {
  const { language } = useLanguage()

  // 6 Core Services - Professional IT Services
  const services = [
    {
      title: 'Managed IT Support',
      titleNL: 'Managed IT-ondersteuning',
      description: '24/7 monitoring, unlimited remote support, and 1-hour response time.',
      descriptionNL: '24/7 monitoring, onbeperkte remote support en 1 uur responstijd.',
      icon: Monitor,
      href: '/diensten/managed-it',
    },
    {
      title: 'Cloud Solutions',
      titleNL: 'Cloud-oplossingen',
      description: 'Microsoft 365, email hosting, and secure cloud storage for your business.',
      descriptionNL: 'Microsoft 365, e-mailhosting en veilige cloudopslag voor je bedrijf.',
      icon: Cloud,
      href: '/diensten/cloud-solutions',
    },
    {
      title: 'Cybersecurity',
      titleNL: 'Cybersecurity',
      description: 'Advanced threat protection, firewalls, and security audits to keep you safe.',
      descriptionNL: 'Geavanceerde dreigingsbescherming, firewalls en beveiligingsaudits om je veilig te houden.',
      icon: Shield,
      href: '/diensten/cybersecurity',
    },
    {
      title: 'IT Helpdesk',
      titleNL: 'IT-helpdesk',
      description: 'Fast, friendly support when you need it. Remote and on-site assistance.',
      descriptionNL: 'Snelle, vriendelijke ondersteuning wanneer je het nodig hebt. Remote en on-site hulp.',
      icon: Headphones,
      href: '/diensten/it-support',
    },
    {
      title: 'Backup & Recovery',
      titleNL: 'Backup & herstel',
      description: 'Automatic daily backups and disaster recovery to protect your critical data.',
      descriptionNL: 'Automatische dagelijkse backups en noodherstel om je kritieke gegevens te beschermen.',
      icon: Server,
      href: '/diensten/backup-disaster-recovery',
    },
    {
      title: 'Network Security',
      titleNL: 'Netwerkbeveiliging',
      description: 'Secure network infrastructure with VPNs, firewalls, and access control.',
      descriptionNL: 'Veilige netwerkinfrastructuur met VPN\'s, firewalls en toegangscontrole.',
      icon: Lock,
      href: '/diensten/network-security',
    },
  ]

  return (
    <section className="workflo-section-spacing bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="workflo-h2 text-workflo-black mb-4">
            {language === 'nl' ? 'Wat wij voor je regelen' : 'What we handle for you'}
          </h2>
          <p className="workflo-body text-workflo-gray-600 max-w-3xl mx-auto">
            {language === 'nl'
              ? 'Complete IT-oplossingen zodat je je kunt focussen op je kernactiviteiten'
              : 'Complete IT solutions so you can focus on your core business'}
          </p>
        </motion.div>

        {/* Services Grid - 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <motion.div
                key={service.titleNL}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group"
              >
                <div className="h-full p-8 bg-workflo-gray-50 rounded-lg hover:bg-workflo-yellow-light/20 transition-all duration-300 border border-transparent hover:border-workflo-yellow">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-workflo-yellow group-hover:bg-workflo-yellow-dark transition-colors duration-300">
                      <IconComponent className="h-7 w-7 stroke-2 text-workflo-black" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="workflo-h3 text-workflo-black mb-3">
                    {language === 'nl' ? service.titleNL : service.title}
                  </h3>

                  {/* Description */}
                  <p className="workflo-body text-workflo-gray-600 mb-6">
                    {language === 'nl' ? service.descriptionNL : service.description}
                  </p>

                  {/* Link */}
                  <LinkTertiary href={service.href} className="text-workflo-black group-hover:text-workflo-yellow-dark">
                    {language === 'nl' ? 'Meer informatie' : 'Learn more'}
                  </LinkTertiary>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

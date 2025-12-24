'use client'

import { motion } from '@/lib/framer-motion'
import LogoCarousel from '@/components/ui/logo-carousel'
import { NumberStat } from '@/components/ui/number-stat'

// All 15 prominent clients - Art Director Design System
const clients = [
  // Tech & Digital
  { name: 'iO', logo: '/images/logos/io_Logo.png', sector: 'Digital Agency' },
  { name: 'Leyden Labs', logo: '/images/logos/leydenlabs_Logo.png', sector: 'Research' },
  { name: 'Hunt Amsterdam', logo: '/images/logos/huntamsterdam_logo.jpeg', sector: 'Creative Technology' },
  { name: 'Voice Industries', logo: '/images/logos/voice.industries_Logo.jpeg', sector: 'Voice Technology' },

  // Creative & Media
  { name: 'TBWA', logo: '/images/logos/tbwa_Logo.png', sector: 'Agency' },
  { name: 'Havas Media', logo: '/images/logos/havas-media.png', sector: 'Media' },
  { name: 'Greenpeace', logo: '/images/logos/greenpeace.png', sector: 'Non-Profit' },
  { name: 'Daily Paper', logo: '/images/logos/dailypaper_Logo.png', sector: 'Fashion' },
  { name: 'LaDress', logo: '/images/logos/ladress.png', sector: 'Fashion' },
  { name: 'Klaar', logo: '/images/logos/klaar.jpg', sector: 'Services' },

  // Professional Services & Healthcare
  { name: 'Aescap', logo: '/images/logos/aescap.png', sector: 'Finance' },
  { name: 'BLC FinanceView', logo: '/images/logos/blc-financeview.png', sector: 'Finance' },
  { name: 'HAP Elings', logo: '/images/logos/hap-elings.png', sector: 'Healthcare' },
  { name: 'Podimo', logo: '/images/logos/podimo.png', sector: 'Media' },
  { name: 'SENL', logo: '/images/logos/senl.png', sector: 'Energy' },
]

export default function ClientLogos() {
  return (
    <section className="workflo-section-spacing bg-gradient-to-br from-muted/50 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center workflo-block-spacing">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="workflo-h2 text-workflo-navy dark:text-white mb-4"
          >
            IT Partners van Toonaangevende Bedrijven
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="workflo-body text-workflo-gray dark:text-gray-300 max-w-2xl mx-auto"
          >
            Trots op alle succesvolle samenwerkingen die we hebben opgebouwd
          </motion.p>
        </div>

        {/* Animated Logo Carousel - All 15 logos with infinite scrolling */}
        <LogoCarousel logos={clients} speed={0.5} />

        {/* Stats - Using NumberStat component */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 max-w-4xl mx-auto">
          <NumberStat value="50+" label="Tevreden Klanten" />
          <NumberStat value="2014" label="Sinds" />
          <NumberStat value="24/7" label="Support" />
          <NumberStat value="99.9%" label="Uptime" />
        </div>
      </div>
    </section>
  )
}

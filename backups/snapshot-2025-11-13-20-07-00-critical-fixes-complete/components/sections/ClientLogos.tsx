'use client'

import { motion } from '@/lib/framer-motion'

// CLEANED: Removed all duplicates, kept only unique, high-quality client logos
const clients = [
  // Tech & Digital
  { name: 'iO', logo: '/images/logos/io_Logo.png', sector: 'Digital Agency' },
  { name: 'Leyden Labs', logo: '/images/logos/leydenlabs_Logo.png', sector: 'Research' },
  { name: 'Hunt Amsterdam', logo: '/images/logos/huntamsterdam_logo.jpeg', sector: 'Creative Technology' },
  { name: 'Voice Industries', logo: '/images/logos/voice.industries_Logo.jpeg', sector: 'Voice Technology' },
  { name: 'Daily Paper', logo: '/images/logos/dailypaper_Logo.png', sector: 'Fashion' },

  // Creative & Media
  { name: 'TBWA', logo: '/images/logos/tbwa_Logo.png', sector: 'Agency' },
  { name: 'Havas Media', logo: '/images/logos/havas-media.png', sector: 'Media' },
  { name: 'Greenpeace', logo: '/images/logos/greenpeace.png', sector: 'Non-Profit' },

  // Fashion & Retail
  { name: 'LaDress', logo: '/images/logos/ladress.png', sector: 'Fashion' },
  { name: 'Klaar', logo: '/images/logos/klaar.jpg', sector: 'Retail' },

  // Professional Services
  { name: 'Aescap', logo: '/images/logos/aescap.png', sector: 'Finance' },
  { name: 'BLC FinanceView', logo: '/images/logos/blc-financeview.png', sector: 'Finance' },

  // Healthcare
  { name: 'HAP Elings', logo: '/images/logos/hap-elings.png', sector: 'Healthcare' },

  // Media & Entertainment
  { name: 'Podimo', logo: '/images/logos/podimo.png', sector: 'Media' },

  // Other Services
  { name: 'SENL', logo: '/images/logos/senl.png', sector: 'Technology' },
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

        {/* Professional Static Logo Grid - No duplicates, no scrolling chaos */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-8 max-w-5xl mx-auto mb-12">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-center p-4 bg-card/50 rounded-lg hover:bg-card transition-all duration-300 group"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="max-h-12 max-w-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  filter: 'grayscale(100%) brightness(0) invert(1)',
                }}
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 workflo-element-gap mt-12 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="workflo-h3 text-primary">50+</div>
            <div className="workflo-caption text-workflo-gray dark:text-gray-300">Tevreden Klanten</div>
          </div>
          <div className="text-center">
            <div className="workflo-h3 text-primary">Sinds 2014</div>
            <div className="workflo-caption text-workflo-gray dark:text-gray-300">Ervaring</div>
          </div>
          <div className="text-center">
            <div className="workflo-h3 text-primary">24/7</div>
            <div className="workflo-caption text-workflo-gray dark:text-gray-300">Support</div>
          </div>
          <div className="text-center">
            <div className="workflo-h3 text-primary">99.9%</div>
            <div className="workflo-caption text-workflo-gray dark:text-gray-300">Uptime</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

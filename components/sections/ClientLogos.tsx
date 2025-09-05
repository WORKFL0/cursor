'use client'

import { motion } from '@/lib/framer-motion'

const clients = [
  // Tech & Digital
  { name: 'iO', logo: '/images/logos/io_Logo.png', sector: 'Digital Agency' },
  { name: 'Leyden Labs', logo: '/images/logos/leydenlabs_Logo.png', sector: 'Research' },
  { name: 'Hunt Amsterdam', logo: '/images/logos/huntamsterdam_logo.jpeg', sector: 'Creative Technology' },
  { name: 'Voice Industries', logo: '/images/logos/voice.industries_Logo.jpeg', sector: 'Voice Technology' },
  { name: 'Daily Paper', logo: '/images/logos/dailypaper_Logo.png', sector: 'Fashion Tech' },
  
  // Creative & Media
  { name: 'TBWA', logo: '/images/logos/tbwa_Logo.png', sector: 'Creative Agency' },
  { name: 'John Doornik Casting', logo: '/images/logos/john-doornik.png', sector: 'Casting' },
  { name: 'Havas Media', logo: '/images/logos/havas-media.png', sector: 'Media Agency' },
  { name: 'Greenpeace', logo: '/images/logos/greenpeace.png', sector: 'Non-Profit Media' },
  { name: 'JUMP', logo: '/images/logos/jump.jpg', sector: 'Creative Studio' },
  
  // Fashion & Retail  
  { name: 'LaDress', logo: '/images/logos/ladress.png', sector: 'Fashion' },
  { name: 'Bijvoorkeur', logo: '/images/logos/bijvoorkeur.jpg', sector: 'Retail' },
  { name: 'Klaar', logo: '/images/logos/klaar.jpg', sector: 'Fashion Retail' },
  { name: 'Workstuff', logo: '/images/logos/workstuff.jpg', sector: 'Fashion' },
  
  // Professional Services
  { name: 'Aescap', logo: '/images/logos/aescap.png', sector: 'Financial Services' },
  { name: 'BLC FinanceView', logo: '/images/logos/blc-financeview.png', sector: 'Finance' },
  { name: 'Koschuch', logo: '/images/logos/koschuch.png', sector: 'Consulting' },
  { name: 'DMC', logo: '/images/logos/dmc.png', sector: 'Business Services' },
  { name: 'PR Mansion', logo: '/images/logos/prmansion.png', sector: 'Public Relations' },
  { name: 'Highwood', logo: '/images/logos/highwood.png', sector: 'Management' },
  
  // Healthcare & Wellness
  { name: 'Doctor Feelgood', logo: '/images/logos/doctorfeelgood.jpg', sector: 'Healthcare' },
  { name: 'HAP Elings', logo: '/images/logos/hap-elings.png', sector: 'Healthcare' },
  
  // Media & Entertainment
  { name: 'Podimo', logo: '/images/logos/podimo.png', sector: 'Media Platform' },
  { name: 'Tonko', logo: '/images/logos/tonko.png', sector: 'Entertainment' },
  { name: 'Dag & Nacht', logo: '/images/logos/dagennacht.png', sector: 'Media' },
  
  // Other Services
  { name: 'Winix', logo: '/images/logos/winix.jpg', sector: 'Technology' },
  { name: 'Rademakkers', logo: '/images/logos/rademakkers.png', sector: 'Services' },
  { name: 'Open Boek', logo: '/images/logos/open-boek.png', sector: 'Publishing' },
  { name: 'SENL', logo: '/images/logos/senl.png', sector: 'Technology' },
]

export default function ClientLogos() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-muted/50 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            IT Partners van Toonaangevende Bedrijven
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Trots op alle succesvolle samenwerkingen die we hebben opgebouwd
          </motion.p>
        </div>

        {/* Logo Grid */}
        <div className="relative">
          {/* First Row - Scrolling Left */}
          <div className="flex overflow-hidden mb-8">
            <motion.div
              className="flex gap-8"
              animate={{
                x: [0, -1920],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 60,
                  ease: "linear",
                },
              }}
            >
              {[...clients.slice(0, 10), ...clients.slice(0, 10)].map((client, index) => (
                <div
                  key={`row1-${index}`}
                  className="flex-shrink-0 w-32 h-16 sm:w-40 sm:h-20 bg-card rounded-lg shadow-md flex items-center justify-center p-3 sm:p-4 hover:shadow-lg transition-shadow"
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Second Row - Scrolling Right */}
          <div className="flex overflow-hidden">
            <motion.div
              className="flex gap-8"
              animate={{
                x: [-1920, 0],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 60,
                  ease: "linear",
                },
              }}
            >
              {[...clients.slice(10, 20), ...clients.slice(10, 20)].map((client, index) => (
                <div
                  key={`row2-${index}`}
                  className="flex-shrink-0 w-32 h-16 sm:w-40 sm:h-20 bg-card rounded-lg shadow-md flex items-center justify-center p-3 sm:p-4 hover:shadow-lg transition-shadow"
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">50+</div>
            <div className="text-muted-foreground">Tevreden Klanten</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">Sinds 2014</div>
            <div className="text-muted-foreground">Ervaring</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">24/7</div>
            <div className="text-muted-foreground">Support</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">99.9%</div>
            <div className="text-muted-foreground">Uptime</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
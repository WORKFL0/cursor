'use client'

import { motion } from 'framer-motion'

const clients = [
  // Tech & Digital
  { name: 'iO', logo: '/images/logos/io.png', sector: 'Digital Agency' },
  { name: 'HowSmart.ai', logo: '/images/logos/howsmart-ai.png', sector: 'AI Technology' },
  { name: 'Layden Labs', logo: '/images/logos/layden-labs.png', sector: 'Research' },
  
  // Creative & Media
  { name: 'Cogonez', logo: '/images/logos/cogonez.png', sector: 'Creative Agency' },
  { name: 'Hoen', logo: '/images/logos/hoen.png', sector: 'Creative Studio' },
  { name: 'John Doornik Casting', logo: '/images/logos/john-doornik.png', sector: 'Casting' },
  { name: 'All Response Media', logo: '/images/logos/all-response-media.png', sector: 'Media' },
  { name: 'PR Mension', logo: '/images/logos/pr-mension.png', sector: 'Public Relations' },
  { name: 'Propaganda', logo: '/images/logos/propaganda.png', sector: 'Creative Agency' },
  
  // Fashion & Retail  
  { name: 'LaDress', logo: '/images/logos/ladress.png', sector: 'Fashion' },
  { name: 'tidee', logo: '/images/logos/tidee.png', sector: 'Creative Retail' },
  
  // Legal & Professional Services
  { name: 'Jager notarissen', logo: '/images/logos/jager-notarissen.png', sector: 'Legal Services' },
  { name: 'Grabo', logo: '/images/logos/grabo.png', sector: 'Business Services' },
  { name: 'Koschuch', logo: '/images/logos/koschuch.png', sector: 'Consulting' },
  
  // Healthcare & Wellness
  { name: 'doctorfeelgood', logo: '/images/logos/doctorfeelgood.png', sector: 'Healthcare' },
  { name: 'Apotheek Warande', logo: '/images/logos/apotheek-warande.png', sector: 'Pharmacy' },
  { name: 'HealthyWeightClinics', logo: '/images/logos/healthy-weight.png', sector: 'Medical' },
  { name: 'Kopzorgen haarverzorgening', logo: '/images/logos/kopzorgen.png', sector: 'Beauty & Health' },
  
  // Real Estate & Property
  { name: 'On(t)roerendgoed', logo: '/images/logos/ontroerendgoed.png', sector: 'Real Estate' },
  { name: 'CentraalHuizenbeheer', logo: '/images/logos/centraal-huizen.png', sector: 'Property Management' },
  
  // Logistics & Services
  { name: 'TakeCareCouriers', logo: '/images/logos/tcc.png', sector: 'Logistics' },
  { name: 'Walenpleintje', logo: '/images/logos/walenpleintje.png', sector: 'Hospitality' },
  
  // Existing Premium Clients
  { name: 'Havas Media', logo: '/images/logos/Havas_Media.png', sector: 'Media Agency' },
  { name: 'Winix', logo: '/images/logos/Winix_Logo.jpg', sector: 'Technology' },
]

export default function ClientLogos() {
  return (
    <section className="py-16 bg-gradient-to-br from-muted/50 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            IT Partners van Toonaangevende Bedrijven
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
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
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              {[...clients.slice(0, 10), ...clients.slice(0, 10)].map((client, index) => (
                <div
                  key={`row1-${index}`}
                  className="flex-shrink-0 w-40 h-20 bg-card rounded-lg shadow-md flex items-center justify-center p-4 hover:shadow-lg transition-shadow"
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
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
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              {[...clients.slice(10, 20), ...clients.slice(10, 20)].map((client, index) => (
                <div
                  key={`row2-${index}`}
                  className="flex-shrink-0 w-40 h-20 bg-card rounded-lg shadow-md flex items-center justify-center p-4 hover:shadow-lg transition-shadow"
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
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
            <div className="text-3xl font-bold text-primary">100+</div>
            <div className="text-muted-foreground">Tevreden Klanten</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">10+</div>
            <div className="text-muted-foreground">Jaar Ervaring</div>
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
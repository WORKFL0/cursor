'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/contexts/language-context'
import AnimatedCounter from '@/components/animations/AnimatedCounter'
import { homePageData } from '@/lib/data/workflo-data'
import ParticleBackground from '@/components/animations/ParticleBackground'

export default function AnimatedStatsSection() {
  const { language } = useLanguage()

  return (
    <section className="relative workflo-section-spacing bg-gradient-to-br from-[#f2f400] via-[#ffd700] to-[#f2f400] text-workflo-navy overflow-hidden">
      {/* Particle background */}
      <ParticleBackground
        particleCount={30}
        color="#0F172A"
        minSize={2}
        maxSize={4}
        speed={0.3}
      />

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center workflo-block-spacing"
        >
          <h2 className="workflo-h2 mb-4">
            {language === 'nl' ? 'Workflo in Cijfers' : 'Workflo in Numbers'}
          </h2>
          <p className="workflo-body opacity-90">
            {language === 'nl'
              ? 'Vertrouwd door bedrijven door heel Nederland'
              : 'Trusted by businesses throughout the Netherlands'}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 workflo-element-gap text-center">
            {homePageData.stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  type: 'spring',
                  stiffness: 100,
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.3 },
                }}
                className="relative group"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />

                <div className="relative">
                  <div className="text-5xl lg:text-6xl font-bold mb-2 drop-shadow-lg">
                    <AnimatedCounter
                      end={parseInt(stat.value.replace(/[^0-9]/g, ''))}
                      suffix={stat.value.replace(/[0-9]/g, '')}
                      duration={2}
                    />
                  </div>
                  <div className="workflo-caption font-medium opacity-90">
                    {language === 'nl' ? stat.labelNL : stat.label}
                  </div>
                </div>

                {/* Decorative corner */}
                <motion.div
                  className="absolute -top-2 -right-2 w-12 h-12 border-t-2 border-r-2 border-workflo-navy/20 rounded-tr-2xl"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-gray-50" />
    </section>
  )
}

'use client'

import { Monitor, Shield, Headphones, CheckCircle } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/language-context'
import { motion } from 'framer-motion'
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card'

export default function ModernServicesSection() {
  const { language } = useLanguage()

  const services = [
    {
      title: 'Je computers werken',
      titleEN: 'Your computers work',
      description: 'Laptops, computers en printers die gewoon doen wat ze moeten doen. Zonder crashes, zonder gedoe.',
      descriptionEN: 'Laptops, computers and printers that simply do what they should. No crashes, no hassle.',
      icon: Monitor,
      features: [
        { nl: 'Updates automatisch', en: 'Automatic updates' },
        { nl: 'Problemen oplossen voordat je ze merkt', en: 'Solve problems before you notice them' },
      ],
      color: 'from-blue-500/20 to-blue-600/20',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Je gegevens zijn veilig',
      titleEN: 'Your data is secure',
      description: 'Automatische backups en bescherming tegen virussen. Je belangrijke bestanden zijn altijd veilig.',
      descriptionEN: 'Automatic backups and virus protection. Your important files are always safe.',
      icon: Shield,
      features: [
        { nl: 'Dagelijkse backup van je bestanden', en: 'Daily backup of your files' },
        { nl: 'Bescherming tegen virussen', en: 'Virus protection' },
      ],
      color: 'from-green-500/20 to-green-600/20',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-500',
    },
    {
      title: 'Hulp als je het nodig hebt',
      titleEN: 'Help when you need it',
      description: 'Een probleem? Wij lossen het op. Vaak op afstand, soms komen we langs. Altijd snel.',
      descriptionEN: 'A problem? We solve it. Often remotely, sometimes we visit. Always fast.',
      icon: Headphones,
      features: [
        { nl: 'Hulp binnen 1 uur', en: 'Help within 1 hour' },
        { nl: 'Geen ingewikkelde taal', en: 'No complicated language' },
      ],
      color: 'from-purple-500/20 to-purple-600/20',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section className="relative workflo-section-spacing bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-[#f2f400]/5 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[#f2f400]/10 border border-[#f2f400]/20 backdrop-blur-sm"
            >
              <span className="text-sm font-medium text-[#f2f400]">
                {language === 'nl' ? 'Onze Diensten' : 'Our Services'}
              </span>
            </motion.div>

            <h2 className="workflo-h2 text-workflo-navy dark:text-white workflo-block-spacing">
              {language === 'nl' ? 'Wat wij voor je doen' : 'What we do for you'}
            </h2>
            <p className="workflo-body text-workflo-gray dark:text-gray-300 max-w-3xl mx-auto">
              {language === 'nl'
                ? 'Alles wat je nodig hebt om zorgeloos te kunnen werken'
                : 'Everything you need to work worry-free'}
            </p>
          </motion.div>

          {/* Services Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={itemVariants} className="group">
                <GlassCard
                  variant="default"
                  hover3d={true}
                  glowEffect={true}
                  className="h-full bg-white/60 dark:bg-gray-900/60 hover:bg-white/80 dark:hover:bg-gray-900/80"
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl`} />

                  <GlassCardHeader className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className={`w-16 h-16 sm:w-18 sm:h-18 ${service.iconBg} backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <service.icon className={`w-8 h-8 sm:w-9 sm:h-9 ${service.iconColor}`} />
                    </motion.div>

                    <GlassCardTitle className="workflo-h3 text-workflo-navy dark:text-white mb-4">
                      {language === 'nl' ? service.title : service.titleEN}
                    </GlassCardTitle>
                  </GlassCardHeader>

                  <GlassCardContent className="relative z-10">
                    <p className="workflo-body text-workflo-gray dark:text-gray-300 mb-6">
                      {language === 'nl' ? service.description : service.descriptionEN}
                    </p>

                    {/* Features List */}
                    <ul className="workflo-tight-gap flex flex-col">
                      {service.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 * i, duration: 0.4 }}
                          className="flex items-start gap-3 group/item"
                        >
                          <CheckCircle className="w-5 h-5 text-[#f2f400] flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                          <span className="workflo-caption text-workflo-navy dark:text-gray-300">
                            {language === 'nl' ? feature.nl : feature.en}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </GlassCardContent>

                  {/* Decorative corner element */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-[#f2f400]/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center mt-12 sm:mt-16"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {language === 'nl'
                ? 'Meer weten over onze diensten?'
                : 'Want to know more about our services?'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#f2f400] to-[#ffd700] text-gray-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {language === 'nl' ? 'Bekijk alle diensten' : 'View all services'}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

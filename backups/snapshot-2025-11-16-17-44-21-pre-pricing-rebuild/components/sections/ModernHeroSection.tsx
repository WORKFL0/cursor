'use client'

import Link from 'next/link'
import { ButtonPrimary, ButtonSecondary } from '@/components/ui/button-art-director'
import { useLanguage } from '@/lib/contexts/language-context'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export default function ModernHeroSection() {
  const { language } = useLanguage()

  return (
    <section className="relative bg-workflo-black text-white overflow-hidden min-h-[85vh] flex items-center">
      {/* Simple gradient background - cleaner than particles */}
      <div className="absolute inset-0 bg-gradient-to-br from-workflo-black via-workflo-gray-900 to-workflo-black" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Subtle yellow glow accent - minimal, professional */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-workflo-yellow/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-5xl mx-auto text-center"
        >
          {/* Small badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-workflo-yellow-light/10 border border-workflo-yellow-light/20"
          >
            <span className="h-2 w-2 bg-workflo-yellow rounded-full" />
            <span className="text-sm font-semibold text-workflo-yellow">
              {language === 'nl' ? 'Uw IT-Partner in Amsterdam' : 'Your IT Partner in Amsterdam'}
            </span>
          </motion.div>

          {/* Main Heading - Art Director H1 spec: 48-64px */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="workflo-h1 mb-6 text-white"
          >
            {language === 'nl' ? 'Wij regelen je IT' : 'We handle your IT'}
          </motion.h1>

          {/* Subtitle - Art Director H2 spec: 32-48px */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="workflo-h2 text-workflo-gray-100 mb-6 font-normal"
          >
            {language === 'nl'
              ? 'Zodat je je kunt focussen op je bedrijf'
              : 'So you can focus on your business'}
          </motion.p>

          {/* Description - Art Director Body spec: 18px */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="workflo-body text-workflo-gray-300 max-w-3xl mx-auto mb-12"
          >
            {language === 'nl'
              ? 'Geen ingewikkelde verhalen. Wij zorgen dat je computers, internet en systemen gewoon werken. Altijd. Voor een vaste prijs per maand.'
              : 'No complicated stories. We ensure your computers, internet and systems just work. Always. For a fixed price per month.'}
          </motion.p>

          {/* CTA Buttons - Using Art Director button components */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <ButtonPrimary href="/contact">
              {language === 'nl' ? 'Plan gratis IT-scan' : 'Schedule free IT assessment'}
            </ButtonPrimary>

            <ButtonSecondary href="/prijzen">
              {language === 'nl' ? 'Bekijk prijzen' : 'View pricing'}
            </ButtonSecondary>
          </motion.div>

          {/* Trust Indicators - Clean, professional */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 text-workflo-gray-300 text-sm"
          >
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 stroke-2 text-workflo-yellow" />
              <span>{language === 'nl' ? 'Geen setup kosten' : 'No setup costs'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 stroke-2 text-workflo-yellow" />
              <span>{language === 'nl' ? 'Maandelijks opzegbaar' : 'Cancel monthly'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 stroke-2 text-workflo-yellow" />
              <span>{language === 'nl' ? 'Hulp binnen 1 uur' : 'Help within 1 hour'}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

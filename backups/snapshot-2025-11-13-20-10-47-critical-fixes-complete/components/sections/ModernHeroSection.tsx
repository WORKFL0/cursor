'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/contexts/language-context'
import { motion } from 'framer-motion'
import { VideoBackground, VideoSets } from '@/components/shared/video-background'
import ParticleBackground from '@/components/animations/ParticleBackground'
import FloatingIcons from '@/components/animations/FloatingIcons'

export default function ModernHeroSection() {
  const { language } = useLanguage()

  // Floating animation variants
  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-20, 20, -20],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  const pulseVariants = {
    initial: { scale: 1, opacity: 0.5 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <section className="relative workflo-section-spacing bg-gradient-to-br from-workflo-navy via-workflo-slate to-workflo-navy overflow-hidden min-h-[70vh] sm:min-h-[80vh] flex items-center">
      {/* Animated Background Video */}
      <VideoBackground videos={VideoSets.hero} opacity={0.12} overlay={true} />

      {/* Particle System */}
      <ParticleBackground
        particleCount={60}
        color="#f2f400"
        minSize={2}
        maxSize={5}
        speed={0.4}
      />

      {/* Floating Tech Icons */}
      <FloatingIcons count={12} />

      {/* Dynamic Gradient Mesh Overlay */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <motion.div
          variants={pulseVariants}
          initial="initial"
          animate="animate"
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f2f400]/10 rounded-full blur-3xl"
        />
        <motion.div
          variants={pulseVariants}
          initial="initial"
          animate="animate"
          style={{ animationDelay: '1s' }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1E3A8A]/10 rounded-full blur-3xl"
        />
        <motion.div
          variants={pulseVariants}
          initial="initial"
          animate="animate"
          style={{ animationDelay: '2s' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#f2f400]/5 rounded-full blur-3xl"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Floating Elements */}
      <motion.div
        variants={floatingVariants}
        initial="initial"
        animate="animate"
        className="absolute top-20 right-20 w-24 h-24 border-2 border-[#f2f400]/20 rounded-lg rotate-12 hidden lg:block"
      />
      <motion.div
        variants={floatingVariants}
        initial="initial"
        animate="animate"
        style={{ animationDelay: '1s' }}
        className="absolute bottom-32 left-16 w-32 h-32 border-2 border-[#f2f400]/10 rounded-full hidden lg:block"
      />
      <motion.div
        variants={floatingVariants}
        initial="initial"
        animate="animate"
        style={{ animationDelay: '2s' }}
        className="absolute top-1/2 right-32 w-16 h-16 bg-gradient-to-br from-[#f2f400]/10 to-transparent rounded-lg rotate-45 hidden lg:block"
      />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-5xl mx-auto text-center"
        >
          {/* Small badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[#f2f400]/10 border border-[#f2f400]/20 backdrop-blur-sm"
          >
            <span className="w-2 h-2 bg-[#f2f400] rounded-full animate-pulse" />
            <span className="text-sm font-medium text-[#f2f400]">
              {language === 'nl' ? 'Uw IT-Partner in Amsterdam' : 'Your IT Partner in Amsterdam'}
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="workflo-h1 mb-6 sm:mb-8 px-4"
          >
            <span className="inline-block bg-gradient-to-r from-[#f2f400] via-[#ffd700] to-[#f2f400] bg-clip-text text-transparent drop-shadow-2xl">
              {language === 'nl' ? 'Wij regelen je IT' : 'We handle your IT'}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="workflo-h2 text-white/90 workflo-block-spacing font-light"
          >
            {language === 'nl'
              ? 'Zodat je je kunt focussen op je bedrijf'
              : 'So you can focus on your business'}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="workflo-body text-white/70 max-w-3xl mx-auto mb-8 sm:mb-12 px-4"
          >
            {language === 'nl'
              ? 'Geen ingewikkelde verhalen. Wij zorgen dat je computers, internet en systemen gewoon werken. Altijd. Voor een vaste prijs per maand.'
              : 'No complicated stories. We ensure your computers, internet and systems just work. Always. For a fixed price per month.'}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              asChild
              className="group w-full sm:w-auto text-base sm:text-lg px-8 py-6 bg-gradient-to-r from-[#f2f400] to-[#ffd700] hover:from-[#ffd700] hover:to-[#f2f400] text-[#0F172A] font-bold shadow-2xl shadow-[#f2f400]/40 hover:shadow-[#f2f400]/60 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              <Link href="/contact" className="flex items-center">
                {language === 'nl' ? 'Plan gratis IT-scan' : 'Schedule free IT assessment'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              size="lg"
              asChild
              variant="outline"
              className="group w-full sm:w-auto text-base sm:text-lg px-8 py-6 border-2 border-[#f2f400]/50 text-[#f2f400] hover:bg-[#f2f400]/10 hover:border-[#f2f400] backdrop-blur-sm font-semibold transition-all duration-300 hover:scale-105"
            >
              <Link href="/prijzen" className="flex items-center">
                {language === 'nl' ? 'Bekijk prijzen' : 'View pricing'}
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-white/60 text-sm"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#f2f400]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{language === 'nl' ? 'Geen setup kosten' : 'No setup costs'}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#f2f400]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{language === 'nl' ? 'Maandelijks opzegbaar' : 'Cancel monthly'}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#f2f400]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{language === 'nl' ? 'Hulp binnen 1 uur' : 'Help within 1 hour'}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-700 to-transparent pointer-events-none" />
    </section>
  )
}

'use client'

import { motion, useInView } from '@/lib/framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, Shield, Code2, Sparkles } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

// CountUp component for animated numbers
const CountUp = ({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!hasStarted) {
      setHasStarted(true)
      let startTime: number | null = null
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) {
          window.requestAnimationFrame(step)
        }
      }
      window.requestAnimationFrame(step)
    }
  }, [hasStarted, end, duration])

  return (
    <span>
      {count}{suffix}
    </span>
  )
}

// Types
interface HeroSectionProps {
  variant?: 'standard' | 'premium'
  
  // Content Configuration
  badge?: {
    text: string
    icon?: React.ComponentType<{ className?: string }>
  }
  title: string | React.ReactNode
  subtitle: string
  
  // Visual Configuration
  backgroundType?: 'animated-blobs' | 'video-background'
  videos?: string[]
  headerImage?: string
  
  // CTA Configuration
  primaryCta: {
    text: string
    href: string
    icon?: React.ComponentType<{ className?: string }>
  }
  secondaryCta?: {
    text: string
    href: string
    icon?: React.ComponentType<{ className?: string }>
  }
  
  // Stats Configuration
  stats?: Array<{
    value: string | number
    label: string
    description?: string
    icon?: React.ComponentType<{ className?: string }>
    suffix?: string
    animate?: boolean
  }>
  
  // Trust Indicators
  trustIndicators?: Array<{
    icon: React.ComponentType<{ className?: string }>
    text: string
  }>
  
  // Visual Content
  visualContent?: 'workflo-card' | 'video-player'
  
  // Feature Flags
  showLanguageSupport?: boolean
  showScrollIndicator?: boolean
  showProgressIndicator?: boolean
  
  // Language support
  language?: 'nl' | 'en'
}

// Default configurations for variants
const getVariantDefaults = (variant: 'standard' | 'premium'): Partial<HeroSectionProps> => {
  if (variant === 'standard') {
    return {
      badge: {
        text: 'No-nonsense ICT dienstverlening voor het MKB',
        icon: undefined
      },
      title: (
        <>
          Wij regelen <span className="text-foreground bg-workflo-yellow px-2 rounded">uw IT</span>,
          <br />zodat u kunt ondernemen
        </>
      ),
      subtitle: "Amsterdam's MKB vertrouwt sinds 2015 op Workflo voor betrouwbare IT-ondersteuning. Verminder IT-kosten met 35% terwijl u je productiviteit verhoogt.",
      backgroundType: 'animated-blobs',
      visualContent: 'workflo-card',
      stats: [
        { value: 35, label: 'Kostenbesparing', suffix: '%', animate: true },
        { value: 99.9, label: 'Uptime Garantie', suffix: '%', animate: true },
        { value: '24/7', label: 'Support', animate: false }
      ],
      trustIndicators: [
        { icon: CheckCircle, text: '50+ Bedrijven Vertrouwen Ons' },
        { icon: CheckCircle, text: 'Microsoft Partner' },
        { icon: CheckCircle, text: 'ISO Gecertificeerd' }
      ],
      primaryCta: {
        text: 'Start Gratis IT-Check',
        href: '/tevredenheidscheck',
        icon: ArrowRight
      },
      secondaryCta: {
        text: 'Bekijk Diensten',
        href: '/diensten'
      }
    }
  } else {
    return {
      badge: {
        text: 'Enterprise MSP • Microsoft Partner • Amsterdam',
        icon: Shield
      },
      backgroundType: 'video-background',
      visualContent: 'video-player',
      showScrollIndicator: true,
      showProgressIndicator: true,
      showLanguageSupport: true
    }
  }
}

export default function UnifiedHeroSection(props: HeroSectionProps) {
  const variant = props.variant || 'standard'
  const defaults = getVariantDefaults(variant)
  const config = { ...defaults, ...props } as Required<HeroSectionProps>
  const language = config.language || 'nl'
  
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  
  // Video cycling for premium variant
  useEffect(() => {
    if (variant === 'premium' && config.videos && config.videos.length > 1) {
      const interval = setInterval(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % config.videos!.length)
      }, 15000)
      return () => clearInterval(interval)
    }
    return () => {}
  }, [variant, config.videos])

  // Background rendering
  const renderBackground = () => {
    if (config.backgroundType === 'video-background') {
      return (
        <>
          {/* Professional Video Background */}
          <div className="absolute inset-0 z-0">
            {config.videos && config.videos[currentVideoIndex] && (
              <motion.video
                key={currentVideoIndex}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-8"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.08, scale: 1 }}
                transition={{ duration: 2 }}
              >
                <source src={config.videos[currentVideoIndex]} type="video/mp4" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-enterprise-blue/3" />
              </motion.video>
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/85 to-background/95" />
            <div className="absolute inset-0 bg-grid-enterprise opacity-40" />
          </div>
          
          {/* Subtle Brand Header */}
          {config.headerImage && (
            <motion.div 
              className="absolute top-0 left-0 right-0 h-24 overflow-hidden z-10"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: isInView ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative h-full">
                <img 
                  src={config.headerImage}
                  alt="Workflo Professional IT Services Amsterdam"
                  className="w-full h-full object-cover object-center opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background" />
              </div>
            </motion.div>
          )}
        </>
      )
    } else {
      return (
        <>
          {/* Animated Background Shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute top-40 left-1/2 w-80 h-80 bg-workflo-yellow/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
          
          {/* Subtle Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        </>
      )
    }
  }

  // Visual content rendering
  const renderVisualContent = () => {
    if (config.visualContent === 'video-player' && config.videos) {
      return (
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-workflo-yellow/10 to-workflo-yellow/5 border border-workflo-yellow/20 group">
          <div className="aspect-[4/3] relative">
            <motion.video
              key={`hero-${currentVideoIndex}`}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
            >
              <source src={config.videos[currentVideoIndex]} type="video/mp4" />
              <div className="absolute inset-0 bg-gradient-to-br from-workflo-yellow/20 via-workflo-yellow/10 to-transparent flex items-center justify-center">
                <div className="text-center text-muted-foreground p-8">
                  <Code2 className="w-16 h-16 mx-auto mb-4 text-workflo-yellow" />
                  <p>{language === 'nl' ? 'IT oplossingen worden geladen...' : 'Loading IT solutions...'}</p>
                </div>
              </div>
            </motion.video>
            
            {/* Improved Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            
            {/* Enhanced Floating Elements */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1.2, type: "spring", bounce: 0.3 }}
              className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm px-3 py-2 rounded-full border border-workflo-yellow shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-workflo-yellow animate-pulse" />
                <span className="text-xs font-semibold text-workflo-yellow">
                  {language === 'nl' ? 'Amsterdam IT' : 'Amsterdam IT'}
                </span>
              </div>
            </motion.div>
            
            {/* Progress indicator for video cycling */}
            {config.showProgressIndicator && config.videos && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {config.videos.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentVideoIndex ? 'bg-workflo-yellow w-6' : 'bg-white/40'
                    }`}
                    animate={{ opacity: isInView ? 1 : 0 }}
                    transition={{ delay: 1.5 + index * 0.1 }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )
    } else {
      // Workflo card visual
      return (
        <div className="bg-card rounded-2xl shadow-2xl p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-primary/20"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-primary/20"></div>
          
          <div className="text-center">
            <div className="text-6xl font-bold mb-4">
              <span className="text-foreground bg-workflo-yellow px-1 rounded">Work</span>
              <span className="text-foreground">flo</span>
            </div>
            <p className="text-muted-foreground text-lg mb-6">Een no-nonsense IT bedrijf</p>
            
            {/* Service Icons */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-xs text-muted-foreground">Security</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <span className="text-xs text-muted-foreground">Cloud</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs text-muted-foreground">Mobile</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  const isPremium = variant === 'premium'
  const containerClass = isPremium 
    ? "container mx-auto px-4 sm:px-6 lg:px-8 relative z-20"
    : "container mx-auto container-padding relative z-10"
  
  const gridClass = isPremium
    ? "max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12 items-center"
    : "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
  
  const contentClass = isPremium ? "lg:col-span-7" : ""
  const visualClass = isPremium ? "lg:col-span-5 relative order-first lg:order-last" : "relative"

  return (
    <section 
      ref={sectionRef}
      className={`relative min-h-screen flex items-center overflow-hidden ${
        isPremium 
          ? 'justify-center bg-gradient-to-br from-background via-neutral-50 to-primary-muted/20' 
          : 'bg-gradient-to-br from-background to-muted/30'
      }`}
    >
      {renderBackground()}

      <div className={containerClass}>
        <div className={gridClass}>
          {/* Content */}
          <motion.div
            className={contentClass}
            initial={{ opacity: 0, y: isPremium ? -30 : 20, x: isPremium ? -30 : 0 }}
            animate={{ 
              opacity: isPremium ? (isInView ? 1 : 0) : 1, 
              y: isPremium ? (isInView ? 0 : -30) : 0,
              x: isPremium ? (isInView ? 0 : -30) : 0
            }}
            transition={{ duration: isPremium ? 0.8 : 0.6, delay: isPremium ? 0.1 : 0 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isPremium ? (isInView ? 1 : 0) : 1, 
                y: isPremium ? (isInView ? 0 : 20) : 0 
              }}
              transition={{ delay: isPremium ? 0.3 : 0, duration: 0.6 }}
              className={isPremium 
                ? "inline-flex items-center gap-3 px-6 py-3 bg-primary/10 backdrop-blur-sm rounded-full mb-8 border border-primary/30 hover:bg-primary/15 transition-all duration-300"
                : "inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
              }
            >
              {config.badge?.icon && <config.badge.icon className="w-5 h-5 text-primary" />}
              {!config.badge?.icon && !isPremium && <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>}
              <span className={isPremium ? "text-sm font-semibold text-primary" : ""}>
                {config.badge?.text}
              </span>
              {isPremium && <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>}
            </motion.div>

            {/* Title */}
            <motion.h1 
              className={isPremium 
                ? "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-[1.05] text-balance"
                : "text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
              }
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isPremium ? (isInView ? 1 : 0) : 1, 
                y: isPremium ? (isInView ? 0 : 20) : 0 
              }}
              transition={{ delay: isPremium ? 0.4 : 0, duration: 0.8 }}
            >
              {isPremium ? (
                <span className="bg-gradient-to-r from-primary via-workflo-yellow to-workflo-yellow bg-clip-text text-transparent">
                  {typeof config.title === 'string' ? config.title : config.title}
                </span>
              ) : config.title}
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              className={isPremium
                ? "text-xl sm:text-2xl lg:text-3xl text-muted-foreground mb-6 leading-relaxed max-w-3xl text-balance font-medium"
                : "text-xl text-muted-foreground mb-8 leading-relaxed"
              }
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isPremium ? (isInView ? 1 : 0) : 1, 
                y: isPremium ? (isInView ? 0 : 20) : 0 
              }}
              transition={{ delay: isPremium ? 0.5 : 0, duration: 0.8 }}
            >
              {config.subtitle}
            </motion.p>

            {/* Stats - different layouts for variants */}
            {config.stats && config.stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: isPremium ? (isInView ? 1 : 0) : 1, 
                  y: isPremium ? (isInView ? 0 : 20) : 0 
                }}
                transition={{ delay: isPremium ? 0.6 : 0.2, duration: 0.8 }}
                className={isPremium 
                  ? "grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-2xl"
                  : "grid grid-cols-3 gap-6 mb-8"
                }
              >
                {config.stats.map((stat, index) => {
                  if (isPremium) {
                    return (
                      <div key={index} className="flex items-center gap-3 bg-background/80 backdrop-blur-sm rounded-lg px-4 py-3 border border-border/50">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm font-semibold text-foreground">
                          {stat.label}
                        </span>
                      </div>
                    )
                  } else {
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                        className="text-center lg:text-left"
                      >
                        <div className="text-3xl font-bold text-foreground">
                          {stat.animate && typeof stat.value === 'number' ? (
                            <CountUp end={stat.value} suffix={stat.suffix || ''} />
                          ) : (
                            `${stat.value}${stat.suffix || ''}`
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </motion.div>
                    )
                  }
                })}
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div 
              className={isPremium ? "flex flex-col sm:flex-row gap-4 mb-16" : "flex flex-col sm:flex-row gap-4 mb-8"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isPremium ? (isInView ? 1 : 0) : 1, 
                y: isPremium ? (isInView ? 0 : 20) : 0 
              }}
              transition={{ delay: isPremium ? 0.7 : 0, duration: 0.8 }}
            >
              <Button 
                asChild 
                size="lg" 
                variant="workflo"
                className={isPremium 
                  ? "shadow-xl hover:shadow-2xl group px-10 py-7 text-lg font-semibold transition-all duration-300 hover:scale-105"
                  : "font-bold shadow-lg"
                }
              >
                <Link href={config.primaryCta.href}>
                  {config.primaryCta.text}
                  {config.primaryCta.icon && (
                    <config.primaryCta.icon className={isPremium ? "ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" : "ml-2 h-4 w-4"} />
                  )}
                </Link>
              </Button>
              
              {config.secondaryCta && (
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline"
                  className={isPremium
                    ? "border-2 border-workflo-yellow/50 hover:border-workflo-yellow hover:bg-workflo-yellow/10 transition-all duration-300 px-10 py-7 text-lg group backdrop-blur-sm hover:shadow-lg"
                    : "border-2 border-workflo-yellow text-foreground hover:bg-workflo-yellow-light"
                  }
                >
                  <Link href={config.secondaryCta.href}>
                    {config.secondaryCta.icon && (
                      <config.secondaryCta.icon className={isPremium ? "mr-2 h-5 w-5 group-hover:text-primary transition-colors" : ""} />
                    )}
                    {config.secondaryCta.text}
                  </Link>
                </Button>
              )}
            </motion.div>

            {/* Trust Indicators */}
            {config.trustIndicators && config.trustIndicators.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: isPremium ? (isInView ? 1 : 0) : 1
                }}
                transition={{ delay: isPremium ? 0.8 : 0.6 }}
                className={isPremium ? "pt-10 border-t border-primary/20" : "flex flex-wrap items-center gap-6 text-sm text-muted-foreground"}
              >
                <div className={isPremium ? "grid grid-cols-2 lg:grid-cols-4 gap-8" : "contents"}>
                  {config.trustIndicators.map((indicator, index) => (
                    <div key={index} className={isPremium ? "text-center lg:text-left space-y-2" : "flex items-center gap-2"}>
                      <indicator.icon className={isPremium ? "w-5 h-5 text-success" : "w-5 h-5 text-success"} />
                      <span>{indicator.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Visual Content */}
          <motion.div
            className={visualClass}
            initial={{ opacity: 0, x: isPremium ? 30 : 20 }}
            animate={{ 
              opacity: isPremium ? (isInView ? 1 : 0) : 1, 
              x: isPremium ? (isInView ? 0 : 30) : 0 
            }}
            transition={{ duration: isPremium ? 0.8 : 0.6, delay: isPremium ? 0.3 : 0.2 }}
          >
            <div className="relative">
              {renderVisualContent()}
              
              {/* Decorative Elements */}
              {!isPremium && (
                <>
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl opacity-60"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/30 rounded-full blur-xl opacity-40"></div>
                </>
              )}
              
              {isPremium && (
                <>
                  <motion.div 
                    className="absolute -top-8 -right-8 w-32 h-32 bg-workflo-yellow/20 rounded-full blur-3xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div 
                    className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ 
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  />
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Premium-specific elements */}
      {isPremium && (
        <>
          {/* Professional Bottom Accent */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-1 z-10"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isInView ? 1 : 0 }}
            transition={{ duration: 2, delay: 1.5 }}
          >
            <div className="accent-line-primary" />
          </motion.div>
          
          {/* Enterprise Scroll Indicator */}
          {config.showScrollIndicator && (
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ delay: 2.5, duration: 0.8 }}
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-6 h-12 border-2 border-primary/40 rounded-full flex justify-center pt-2 bg-background/20 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ y: [0, 16, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1.5 h-4 bg-primary/60 rounded-full"
                />
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </section>
  )
}
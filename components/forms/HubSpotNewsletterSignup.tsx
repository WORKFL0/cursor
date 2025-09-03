'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/contexts/language-context'
import { Mail, Send, Loader2, CheckCircle, Sparkles, Shield, Gift, Zap, TrendingUp, Bell, Star, ArrowRight, Users, Globe, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DomErrorBoundary } from '@/components/shared/dom-error-boundary'

interface HubSpotNewsletterSignupProps {
  variant?: 'compact' | 'full'
  className?: string
}

// HubSpot newsletter form configuration
const HUBSPOT_NEWSLETTER_CONFIG = {
  region: 'eu1',
  portalId: '26510736',
  formId: 'e92de02c-71b0-4a68-aedd-3b6acb0f5f67' // Actual newsletter form ID
}

// Animation variants for micro-interactions
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
}

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 10
    }
  }
}

const floatingVariants = {
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

const glowVariants = {
  animate: {
    boxShadow: [
      '0 0 20px hsl(var(--workflo-yellow) / 0.3)',
      '0 0 40px hsl(var(--workflo-yellow) / 0.6)',
      '0 0 20px hsl(var(--workflo-yellow) / 0.3)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (config: {
          region: string
          portalId: string
          formId: string
          target: string
          onFormReady?: () => void
          onFormSubmit?: () => void
        }) => void
      }
    }
  }
}

export function HubSpotNewsletterSignup({ 
  variant = 'full', 
  className = '' 
}: HubSpotNewsletterSignupProps) {
  const { language } = useLanguage()
  const formRef = useRef<HTMLDivElement>(null)
  const portalContainerRef = useRef<HTMLDivElement | null>(null)
  const scriptLoadedRef = useRef(false)
  const hubspotFormRef = useRef<any>(null)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [formLoading, setFormLoading] = useState(true)
  const [useCustomForm, setUseCustomForm] = useState(false)
  const [hubspotError, setHubspotError] = useState<string | null>(null)
  const subscriberCount = 1427 // Fixed count to avoid hydration issues

  // Cleanup function to safely remove HubSpot form
  const cleanupHubSpotForm = useCallback(() => {
    if (hubspotFormRef.current) {
      try {
        // Try to destroy HubSpot form instance if it exists
        if (typeof hubspotFormRef.current.destroy === 'function') {
          hubspotFormRef.current.destroy()
        }
      } catch (error) {
        console.warn('Error destroying HubSpot form:', error)
      } finally {
        hubspotFormRef.current = null
      }
    }

    // Clean up portal container
    if (portalContainerRef.current && portalContainerRef.current.parentNode) {
      try {
        portalContainerRef.current.parentNode.removeChild(portalContainerRef.current)
      } catch (error) {
        // Ignore removeChild errors - this is what we're trying to fix
        console.warn('Portal cleanup warning (expected):', error instanceof Error ? error.message : 'Unknown error')
      } finally {
        portalContainerRef.current = null
      }
    }
  }, [])

  // Load HubSpot script and create form
  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout

    const loadHubSpotForm = async () => {
      try {
        // Create isolated container for HubSpot form using Portal
        if (!portalContainerRef.current && document.body) {
          portalContainerRef.current = document.createElement('div')
          portalContainerRef.current.id = `hubspot-form-portal-${HUBSPOT_NEWSLETTER_CONFIG.formId}`
          portalContainerRef.current.style.display = 'contents'
          document.body.appendChild(portalContainerRef.current)
        }

        // Check if HubSpot script is already loaded
        if (!window.hbspt) {
          const script = document.createElement('script')
          script.src = `https://js-${HUBSPOT_NEWSLETTER_CONFIG.region}.hsforms.net/forms/embed/v2.js`
          script.async = true
          script.onload = () => {
            if (mounted) {
              scriptLoadedRef.current = true
              // Small delay to ensure HubSpot is fully initialized
              timeoutId = setTimeout(() => {
                if (mounted) createForm()
              }, 100)
            }
          }
          script.onerror = () => {
            if (mounted) {
              console.error('Failed to load HubSpot script')
              setHubspotError('Failed to load form script')
              setUseCustomForm(true)
              setFormLoading(false)
            }
          }
          document.head.appendChild(script)
        } else {
          // HubSpot already loaded
          scriptLoadedRef.current = true
          if (mounted) {
            timeoutId = setTimeout(() => {
              if (mounted) createForm()
            }, 50)
          }
        }
      } catch (error) {
        console.error('Error loading HubSpot form:', error)
        if (mounted) {
          setHubspotError('Form initialization failed')
          setUseCustomForm(true)
          setFormLoading(false)
        }
      }
    }

    // Start loading process
    loadHubSpotForm()

    // Cleanup function
    return () => {
      mounted = false
      if (timeoutId) clearTimeout(timeoutId)
      cleanupHubSpotForm()
    }
  }, [])

  const createForm = useCallback(() => {
    if (!window.hbspt || !formRef.current) {
      console.warn('HubSpot not ready for form creation')
      setUseCustomForm(true)
      setFormLoading(false)
      return
    }

    try {
      // Check if form already exists
      if (formRef.current.querySelector('form')) {
        setFormLoading(false)
        return
      }

      // Create form with error handling
      hubspotFormRef.current = window.hbspt.forms.create({
        region: HUBSPOT_NEWSLETTER_CONFIG.region,
        portalId: HUBSPOT_NEWSLETTER_CONFIG.portalId,
        formId: HUBSPOT_NEWSLETTER_CONFIG.formId,
        target: `#hubspot-newsletter-form-${HUBSPOT_NEWSLETTER_CONFIG.formId}`,
        onFormReady: () => {
          try {
            setFormLoading(false)
            setHubspotError(null)
            applyFormStyling()
          } catch (error) {
            console.error('Error in onFormReady:', error)
            setUseCustomForm(true)
            setFormLoading(false)
          }
        },
        onFormSubmit: () => {
          try {
            setFormSubmitted(true)
            console.log('HubSpot newsletter form submitted')
            setTimeout(() => setFormSubmitted(false), 5000)
          } catch (error) {
            console.error('Error in onFormSubmit:', error)
            setHubspotError('Form submission failed')
          }
        }
      })
    } catch (error) {
      console.error('Failed to create HubSpot form:', error)
      setHubspotError('Form creation failed')
      setUseCustomForm(true)
      setFormLoading(false)
    }
  }, [variant, language])

  const applyFormStyling = useCallback(() => {
    const form = formRef.current?.querySelector('form')
    if (!form) return

    try {
      form.style.fontFamily = 'inherit'
      
      // Layout styling based on variant
      if (variant === 'compact') {
        const formFields = form.querySelector('.hs-form-field') as HTMLElement
        if (formFields) {
          Object.assign(formFields.style, {
            display: 'flex',
            gap: '8px',
            alignItems: 'end'
          })
        }
      } else {
        Object.assign(form.style, {
          display: 'flex',
          gap: '16px',
          alignItems: 'end',
          justifyContent: 'center',
          maxWidth: '500px',
          margin: '0 auto'
        })
      }
      
      // Style email inputs
      const inputs = form.querySelectorAll('input[type="email"]')
      inputs.forEach((input) => {
        const element = input as HTMLInputElement
        const styles = {
          borderRadius: variant === 'compact' ? '8px' : '12px',
          border: '2px solid hsl(var(--workflo-yellow) / 0.2)',
          backgroundColor: variant === 'full' ? 'rgba(255, 255, 255, 0.1)' : 'hsl(var(--background))',
          backdropFilter: variant === 'full' ? 'blur(10px)' : 'none',
          color: variant === 'full' ? 'white' : 'hsl(var(--foreground))',
          padding: variant === 'compact' ? '12px 16px' : '16px 20px',
          fontSize: variant === 'compact' ? '14px' : '16px',
          fontWeight: '500',
          flex: '1',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 20px hsl(var(--workflo-yellow) / 0.1)'
        }
        
        Object.assign(element.style, styles)
        element.placeholder = language === 'nl' ? 'Jouw e-mailadres' : 'Your email address'
        
        // Add focus/blur handlers
        element.addEventListener('focus', () => {
          Object.assign(element.style, {
            border: '2px solid hsl(var(--workflo-yellow))',
            boxShadow: '0 8px 30px hsl(var(--workflo-yellow) / 0.3)',
            transform: 'translateY(-2px)'
          })
        })
        
        element.addEventListener('blur', () => {
          Object.assign(element.style, {
            border: '2px solid hsl(var(--workflo-yellow) / 0.2)',
            boxShadow: '0 4px 20px hsl(var(--workflo-yellow) / 0.1)',
            transform: 'translateY(0)'
          })
        })
      })

      // Style submit button
      const submitBtn = form.querySelector('input[type="submit"]') as HTMLInputElement
      if (submitBtn) {
        const buttonStyles = {
          background: 'linear-gradient(135deg, hsl(var(--workflo-yellow)), hsl(var(--workflo-yellow-dark)))',
          color: 'hsl(var(--workflo-black))',
          border: 'none',
          borderRadius: variant === 'compact' ? '8px' : '12px',
          padding: variant === 'compact' ? '12px 20px' : '16px 32px',
          fontSize: variant === 'compact' ? '14px' : '16px',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          whiteSpace: 'nowrap',
          boxShadow: '0 8px 25px hsl(var(--workflo-yellow) / 0.4)',
          position: 'relative',
          overflow: 'hidden'
        }
        
        Object.assign(submitBtn.style, buttonStyles)
        submitBtn.value = language === 'nl' ? 'Inschrijven →' : 'Subscribe →'
        
        // Add hover effects
        submitBtn.addEventListener('mouseenter', () => {
          Object.assign(submitBtn.style, {
            background: 'linear-gradient(135deg, hsl(var(--workflo-yellow-dark)), hsl(var(--workflo-yellow)))',
            transform: 'translateY(-3px) scale(1.05)',
            boxShadow: '0 12px 40px hsl(var(--workflo-yellow) / 0.6)'
          })
        })
        
        submitBtn.addEventListener('mouseleave', () => {
          Object.assign(submitBtn.style, {
            background: 'linear-gradient(135deg, hsl(var(--workflo-yellow)), hsl(var(--workflo-yellow-dark)))',
            transform: 'translateY(0) scale(1)',
            boxShadow: '0 8px 25px hsl(var(--workflo-yellow) / 0.4)'
          })
        })
      }

      // Handle labels based on variant
      const labels = form.querySelectorAll('label')
      labels.forEach((label) => {
        if (variant === 'compact') {
          label.style.display = 'none'
        } else {
          Object.assign(label.style, {
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '4px',
            display: 'block'
          })
        }
      })
    } catch (error) {
      console.error('Error applying form styling:', error)
    }
  }, [variant, language])

  if (variant === 'compact') {
    return (
      <motion.div 
        className={`relative bg-gradient-to-br from-workflo-yellow-light/40 via-card/95 to-card rounded-2xl p-6 border-2 border-workflo-yellow/20 hover:border-workflo-yellow/60 hover:shadow-2xl hover:shadow-workflo-yellow/20 transition-all duration-500 group overflow-hidden ${className}`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -5, scale: 1.02 }}
      >
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-0 right-0 w-20 h-20 bg-workflo-yellow/10 rounded-full blur-xl"
          variants={floatingVariants as any}
          animate="animate"
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-16 h-16 bg-workflo-yellow/5 rounded-full blur-lg"
          variants={floatingVariants as any}
          animate="animate" 
          style={{ animationDelay: '1s' }}
        />
        
        {/* Header section with enhanced design */}
        <motion.div className="flex items-start gap-4 mb-6" variants={itemVariants}>
          <motion.div 
            className="relative w-14 h-14 bg-gradient-to-br from-workflo-yellow to-workflo-yellow-dark rounded-xl flex items-center justify-center shadow-lg shadow-workflo-yellow/30"
            variants={iconVariants as any}
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Mail className="w-7 h-7 text-workflo-black" />
            <motion.div 
              className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-workflo-yellow to-workflo-yellow-dark rounded-full flex items-center justify-center"
              variants={pulseVariants as any}
              animate="animate"
            >
              <Bell className="w-2 h-2 text-white" />
            </motion.div>
          </motion.div>
          
          <div className="flex-1">
            <motion.h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-2" variants={itemVariants}>
              <motion.div
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 0.6 }}
              >
                <Sparkles className="w-5 h-5 text-workflo-yellow" />
              </motion.div>
              {language === 'nl' ? 'IT Tips & Nieuws' : 'IT Tips & News'}
            </motion.h3>
            <motion.p className="text-sm text-muted-foreground leading-relaxed" variants={itemVariants}>
              {language === 'nl' ? 'Blijf voorop met de nieuwste IT-trends en cybersecurity tips' : 'Stay ahead with the latest IT trends and cybersecurity tips'}
            </motion.p>
            
            {/* Social proof */}
            <motion.div className="flex items-center gap-2 mt-2" variants={itemVariants}>
              <div className="flex -space-x-2">
                {[1,2,3].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-workflo-yellow to-workflo-yellow-dark border-2 border-white flex items-center justify-center">
                    <Users className="w-3 h-3 text-workflo-black" />
                  </div>
                ))}
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {subscriberCount}+ {language === 'nl' ? 'IT-professionals' : 'IT professionals'}
              </span>
            </motion.div>
          </div>
        </motion.div>
        
        <AnimatePresence mode="wait">
          {formSubmitted ? (
            <motion.div 
              className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30 backdrop-blur-sm"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 360] }}
                transition={{ duration: 0.6 }}
              >
                <CheckCircle className="w-8 h-8 text-green-500" />
              </motion.div>
              <div className="text-center">
                <span className="font-bold text-green-700 dark:text-green-400 block">
                  {language === 'nl' ? '🎉 Welkom aan boord!' : '🎉 Welcome aboard!'}
                </span>
                <span className="text-sm text-green-600 dark:text-green-300">
                  {language === 'nl' ? 'Je eerste tip komt binnen 24 uur!' : 'Your first tip arrives within 24 hours!'}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              ref={formRef}
              id={`hubspot-newsletter-form-${HUBSPOT_NEWSLETTER_CONFIG.formId}`}
              className="min-h-[80px] flex items-center justify-center"
              variants={itemVariants}
              suppressHydrationWarning
            >
              <DomErrorBoundary
                autoRecover={true}
                recoveryDelay={100}
                onError={(error) => {
                  console.warn('HubSpot form error caught by boundary:', error)
                  setHubspotError('Form display error')
                  setUseCustomForm(true)
                  setFormLoading(false)
                }}
              >
                {!formLoading && !useCustomForm && !hubspotError && (
                  <div 
                    id={`hubspot-newsletter-form-${HUBSPOT_NEWSLETTER_CONFIG.formId}`}
                    className="hubspot-form-container"
                  />
                )}
                
                {(useCustomForm || hubspotError) && (
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault()
                      const formData = new FormData(e.currentTarget)
                      const email = formData.get('email')
                      
                      try {
                        const response = await fetch('/api/newsletter', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email, language })
                        })
                        const data = await response.json()
                        if (data.success) {
                          setFormSubmitted(true)
                          setTimeout(() => setFormSubmitted(false), 5000)
                        } else {
                          console.error('Newsletter signup failed:', data.error)
                        }
                      } catch (error) {
                        console.error('Newsletter signup error:', error)
                      }
                    }}
                    className="flex gap-2 items-center"
                  >
                    <input
                      type="email"
                      name="email"
                      placeholder={language === 'nl' ? 'Je e-mailadres' : 'Your email address'}
                      required
                      className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-workflo-yellow/50"
                    />
                    <Button 
                      type="submit"
                      size="sm"
                      className="bg-workflo-yellow hover:bg-workflo-yellow-dark text-black"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                )}
              </DomErrorBoundary>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Trust indicators and benefits */}
        <motion.div className="space-y-3 mt-4" variants={itemVariants}>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Shield className="w-3 h-3 text-green-500" />
              <span>{language === 'nl' ? 'Geen spam' : 'No spam'}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3 text-blue-500" />
              <span>{language === 'nl' ? 'Wekelijks' : 'Weekly'}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <ArrowRight className="w-3 h-3 text-workflo-yellow-dark" />
              <span>{language === 'nl' ? 'Direct uit' : 'Easy out'}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              GDPR {language === 'nl' ? 'compliant' : 'compliant'}
            </span>
            <span className="flex items-center gap-1">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="w-2.5 h-2.5 text-workflo-yellow fill-current" />
              ))}
              <span className="ml-1">4.9/5</span>
            </span>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // Full variant for dedicated sections - STUNNING HERO DESIGN
  return (
    <motion.div 
      className={`relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl p-8 lg:p-16 overflow-hidden border border-workflo-yellow/20 ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear'
          }}
          style={{
            backgroundImage: `repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, hsl(var(--workflo-yellow) / 0.1) 45deg, transparent 90deg)`,
            backgroundSize: '200px 200px'
          }}
        />
      </div>
      
      {/* Multiple animated glow effects */}
      <motion.div 
        className="absolute top-1/4 left-1/3 w-80 h-80 bg-workflo-yellow/20 blur-3xl rounded-full"
        variants={floatingVariants as any}
        animate="animate"
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/3 w-60 h-60 bg-blue-500/10 blur-3xl rounded-full"
        variants={floatingVariants as any}
        animate="animate"
        style={{ animationDelay: '2s' }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-workflo-yellow/10 blur-3xl rounded-full"
        variants={glowVariants as any}
        animate="animate"
      />
      
      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Enhanced hero icon with multiple elements */}
        <motion.div className="flex items-center justify-center mb-8">
          <motion.div 
            className="relative w-20 h-20 bg-gradient-to-br from-workflo-yellow via-workflo-yellow-light to-workflo-yellow-dark rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-workflo-yellow/50"
            variants={iconVariants as any}
            whileHover={{ scale: 1.15, rotate: 10 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <Mail className="w-10 h-10 text-workflo-black" />
            
            {/* Floating notification badges */}
            <motion.div 
              className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
              variants={pulseVariants as any}
              animate="animate"
            >
              3
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-1 -left-2 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
              variants={floatingVariants as any}
              animate="animate"
            >
              <TrendingUp className="w-4 h-4 text-white" />
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.h3 
          className="text-3xl lg:text-5xl font-black text-white mb-6 leading-tight"
          variants={itemVariants}
        >
          <motion.span 
            className="inline-block bg-gradient-to-r from-workflo-yellow via-yellow-300 to-workflo-yellow bg-clip-text text-transparent"
            animate={{
              backgroundPosition: isHovered ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%'
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {language === 'nl' ? 'Blijf Voorop' : 'Stay Ahead'}
          </motion.span>
          <br />
          <span className="text-white">
            {language === 'nl' ? 'Met IT Expertise 🚀' : 'With IT Expertise 🚀'}
          </span>
        </motion.h3>
        
        {/* Enhanced value proposition */}
        <motion.div className="space-y-4 mb-10" variants={itemVariants}>
          <p className="text-xl text-gray-300 leading-relaxed">
            {language === 'nl' 
              ? 'Wekelijkse cybersecurity waarschuwingen, praktische IT-tips en exclusieve inzichten van Workflo experts.'
              : 'Weekly cybersecurity alerts, practical IT tips and exclusive insights from Workflo experts.'
            }
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
            {[
              { icon: Shield, text: language === 'nl' ? 'Cybersecurity Alerts' : 'Cybersecurity Alerts', color: 'text-green-400' },
              { icon: Zap, text: language === 'nl' ? 'IT Productiviteitstips' : 'IT Productivity Tips', color: 'text-yellow-400' },
              { icon: Gift, text: language === 'nl' ? 'Exclusieve Content' : 'Exclusive Content', color: 'text-purple-400' },
              { icon: TrendingUp, text: language === 'nl' ? 'Trend Analyses' : 'Trend Analysis', color: 'text-blue-400' }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="flex items-center gap-2 text-sm text-gray-300"
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <feature.icon className={`w-4 h-4 ${feature.color}`} />
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <AnimatePresence mode="wait">
          {formSubmitted ? (
            <motion.div 
              className="flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-green-600/20 rounded-3xl border border-green-500/30 backdrop-blur-sm"
              initial={{ scale: 0, opacity: 0, rotateX: -90 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0, opacity: 0, rotateX: 90 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1], 
                  rotate: [0, 360, 360],
                  filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)'] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CheckCircle className="w-16 h-16 text-green-400" />
              </motion.div>
              
              <div className="text-center space-y-2">
                <h4 className="text-2xl font-bold text-green-400">
                  {language === 'nl' ? '🎉 Fantastisch!' : '🎉 Awesome!'}
                </h4>
                <p className="text-lg text-green-300 font-semibold">
                  {language === 'nl' ? 'Je bent nu onderdeel van onze IT-community!' : 'You\'re now part of our IT community!'}
                </p>
                <p className="text-sm text-green-200 opacity-80">
                  {language === 'nl' ? 'Je eerste expert tip komt binnen 24 uur aan 📧' : 'Your first expert tip arrives within 24 hours 📧'}
                </p>
                
                {/* Social proof celebration */}
                <motion.div 
                  className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-green-500/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <Users className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-300">
                    {language === 'nl' ? `Welkom bij ${subscriberCount}+ IT-professionals!` : `Welcome to ${subscriberCount}+ IT professionals!`}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              ref={formRef}
              id={`hubspot-newsletter-form-${HUBSPOT_NEWSLETTER_CONFIG.formId}`}
              className="min-h-[120px] flex items-center justify-center"
              variants={itemVariants}
              suppressHydrationWarning
            >
              <DomErrorBoundary
                autoRecover={true}
                recoveryDelay={100}
                onError={(error) => {
                  console.warn('HubSpot form error caught by boundary:', error)
                  setHubspotError('Form display error')
                  setUseCustomForm(true)
                  setFormLoading(false)
                }}
              >
                {!formLoading && !useCustomForm && !hubspotError && (
                  <div 
                    id={`hubspot-newsletter-form-${HUBSPOT_NEWSLETTER_CONFIG.formId}`}
                    className="hubspot-form-container"
                  />
                )}
                
                {(useCustomForm || hubspotError) && (
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault()
                      const formData = new FormData(e.currentTarget)
                      const email = formData.get('email')
                      
                      try {
                        const response = await fetch('/api/newsletter', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email, language })
                        })
                        const data = await response.json()
                        if (data.success) {
                          setFormSubmitted(true)
                          setTimeout(() => setFormSubmitted(false), 5000)
                        } else {
                          console.error('Newsletter signup failed:', data.error)
                        }
                      } catch (error) {
                        console.error('Newsletter signup error:', error)
                      }
                    }}
                    className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                  >
                    <input
                      type="email"
                      name="email"
                      placeholder={language === 'nl' ? 'Je e-mailadres' : 'Your email address'}
                      required
                      className="flex-1 px-4 py-3 text-base bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-workflo-yellow/50 focus:border-transparent"
                    />
                    <Button 
                      type="submit"
                      size="lg"
                      className="bg-workflo-yellow hover:bg-workflo-yellow-dark text-black font-semibold px-8"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      {language === 'nl' ? 'Aanmelden' : 'Subscribe'}
                    </Button>
                  </form>
                )}
              </DomErrorBoundary>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Enhanced trust indicators and social proof */}
        <motion.div 
          className="mt-8 space-y-6"
          variants={itemVariants}
        >
          {/* Privacy and trust message */}
          <motion.p 
            className="text-gray-400 font-medium flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Shield className="w-4 h-4 text-green-400" />
            {language === 'nl' 
              ? 'Je privacy is heilig. GDPR-compliant & geen spam. Ooit.'
              : 'Your privacy is sacred. GDPR-compliant & no spam. Ever.'
            }
          </motion.p>
          
          {/* Enhanced benefit grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { 
                icon: Shield, 
                text: language === 'nl' ? 'Geen Spam' : 'No Spam', 
                detail: language === 'nl' ? '100% relevant' : '100% relevant',
                color: 'text-green-400' 
              },
              { 
                icon: Clock, 
                text: language === 'nl' ? 'Wekelijks' : 'Weekly', 
                detail: language === 'nl' ? 'Dinsdag 9:00' : 'Tuesday 9:00',
                color: 'text-blue-400' 
              },
              { 
                icon: ArrowRight, 
                text: language === 'nl' ? '1-Click Uit' : '1-Click Out', 
                detail: language === 'nl' ? 'Altijd mogelijk' : 'Always possible',
                color: 'text-workflo-yellow-dark' 
              },
              { 
                icon: Star, 
                text: '4.9/5 Rating', 
                detail: `${subscriberCount}+ ${language === 'nl' ? 'leden' : 'members'}`,
                color: 'text-yellow-400' 
              }
            ].map((benefit, index) => (
              <motion.div 
                key={index}
                className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-workflo-yellow/50 transition-all duration-300"
                whileHover={{ y: -5, scale: 1.05 }}
                variants={itemVariants}
              >
                <benefit.icon className={`w-6 h-6 ${benefit.color} mb-2`} />
                <span className="text-sm font-semibold text-white">{benefit.text}</span>
                <span className="text-xs text-gray-400">{benefit.detail}</span>
              </motion.div>
            ))}
          </div>
          
          {/* Social proof testimonial */}
          <motion.div 
            className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 max-w-2xl mx-auto"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-1 mb-3">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-300 italic mb-3 text-sm leading-relaxed">
              {language === 'nl' 
                ? '"Deze nieuwsbrief heeft mijn IT-kennis echt naar een hoger niveau getild. De cybersecurity tips zijn goud waard!"'
                : '"This newsletter has truly elevated my IT knowledge. The cybersecurity tips are worth their weight in gold!"'
              }
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-workflo-yellow to-workflo-yellow-dark rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-workflo-black">MK</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Mark K.</p>
                <p className="text-xs text-gray-400">IT Manager, Amsterdam</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
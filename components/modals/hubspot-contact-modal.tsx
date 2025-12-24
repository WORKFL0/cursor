'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/contexts/language-context'
import { X, Mail, Phone, MessageSquare, Building2, User, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface HubSpotContactModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  formId?: string // Custom form ID for specific forms like quote requests
}

// Default HubSpot contact form configuration
const HUBSPOT_CONTACT_CONFIG = {
  region: 'eu1',
  portalId: '26510736',
  // You can create a specific "quote request" form in HubSpot and use its ID here
  formId: 'e92de02c-71b0-4a68-aedd-3b6acb0f5f67' // For now using newsletter form, you'll replace with quote form
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

export function HubSpotContactModal({ 
  isOpen, 
  onClose, 
  title,
  formId
}: HubSpotContactModalProps) {
  const { language } = useLanguage()
  const formRef = useRef<HTMLDivElement>(null)
  const hubspotFormRef = useRef<any>(null)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formLoading, setFormLoading] = useState(true)
  const [useCustomForm, setUseCustomForm] = useState(false)
  const [hubspotError, setHubspotError] = useState<string | null>(null)

  const modalFormId = formId || HUBSPOT_CONTACT_CONFIG.formId
  const modalTitle = title || (language === 'nl' ? 'Vraag een offerte aan' : 'Request a Quote')

  // Cleanup function
  const cleanupHubSpotForm = useCallback(() => {
    if (hubspotFormRef.current) {
      try {
        if (typeof hubspotFormRef.current.destroy === 'function') {
          hubspotFormRef.current.destroy()
        }
      } catch (error) {
        // Silently catch cleanup errors - they're expected when DOM is already gone
        console.debug('HubSpot form cleanup (expected):', error)
      } finally {
        hubspotFormRef.current = null
      }
    }

    // Clear the form container safely
    if (formRef.current) {
      try {
        formRef.current.innerHTML = ''
      } catch (error) {
        console.debug('Form container cleanup:', error)
      }
    }
  }, [])

  // Load HubSpot form when modal opens
  useEffect(() => {
    if (!isOpen) {
      cleanupHubSpotForm()
      setFormSubmitted(false)
      setFormLoading(true)
      setUseCustomForm(false)
      setHubspotError(null)
      return
    }

    let mounted = true
    let timeoutId: NodeJS.Timeout

    const loadHubSpotForm = async () => {
      try {
        // Check if HubSpot script is already loaded
        if (!window.hbspt) {
          const script = document.createElement('script')
          script.src = `https://js-${HUBSPOT_CONTACT_CONFIG.region}.hsforms.net/forms/embed/v2.js`
          script.async = true
          script.onload = () => {
            if (mounted) {
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

    loadHubSpotForm()

    return () => {
      mounted = false
      if (timeoutId) clearTimeout(timeoutId)
      cleanupHubSpotForm()
    }
  }, [isOpen, modalFormId])

  const createForm = useCallback(() => {
    if (!window.hbspt || !formRef.current) {
      console.warn('HubSpot not ready for form creation')
      setUseCustomForm(true)
      setFormLoading(false)
      return
    }

    try {
      // Clear any existing content safely
      const container = formRef.current
      if (container && container.parentNode) {
        // Extra safety check: ensure container is still in DOM
        try {
          // Remove children one by one to avoid removeChild errors
          while (container.firstChild && container.contains(container.firstChild)) {
            container.removeChild(container.firstChild)
          }
        } catch (clearError) {
          // If clearing fails, try alternative method
          console.debug('Clearing via removeChild failed, using innerHTML:', clearError)
          try {
            container.innerHTML = ''
          } catch (innerError) {
            console.debug('innerHTML clear also failed:', innerError)
          }
        }
      }

      // Create form
      hubspotFormRef.current = window.hbspt.forms.create({
        region: HUBSPOT_CONTACT_CONFIG.region,
        portalId: HUBSPOT_CONTACT_CONFIG.portalId,
        formId: modalFormId,
        target: `#hubspot-contact-form-${modalFormId}`,
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
            console.log('HubSpot contact form submitted')
            // Auto close modal after 3 seconds
            setTimeout(() => {
              setFormSubmitted(false)
              onClose()
            }, 3000)
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
  }, [modalFormId, onClose])

  const applyFormStyling = useCallback(() => {
    const form = formRef.current?.querySelector('form')
    if (!form) return

    try {
      // Apply modern styling to the form
      form.style.fontFamily = 'inherit'
      
      // Style form fields
      const formFields = form.querySelectorAll('.hs-form-field')
      formFields.forEach((field) => {
        const fieldElement = field as HTMLElement
        fieldElement.style.marginBottom = '16px'
      })
      
      // Style inputs
      const inputs = form.querySelectorAll('input, textarea, select')
      inputs.forEach((input) => {
        const element = input as HTMLInputElement
        Object.assign(element.style, {
          width: '100%',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '2px solid hsl(var(--border))',
          backgroundColor: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          fontSize: '14px',
          fontFamily: 'inherit',
          transition: 'all 0.2s ease',
          outline: 'none'
        })
        
        // Add focus handlers
        element.addEventListener('focus', () => {
          element.style.border = '2px solid hsl(var(--workflo-yellow))'
          element.style.boxShadow = '0 0 0 3px hsl(var(--workflo-yellow) / 0.1)'
        })
        
        element.addEventListener('blur', () => {
          element.style.border = '2px solid hsl(var(--border))'
          element.style.boxShadow = 'none'
        })
      })

      // Style labels
      const labels = form.querySelectorAll('label')
      labels.forEach((label) => {
        Object.assign(label.style, {
          color: 'hsl(var(--foreground))',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '4px',
          display: 'block'
        })
      })

      // Style submit button
      const submitBtn = form.querySelector('input[type="submit"]') as HTMLInputElement
      if (submitBtn) {
        Object.assign(submitBtn.style, {
          background: 'linear-gradient(135deg, hsl(var(--workflo-yellow)), hsl(var(--workflo-yellow-dark)))',
          color: 'hsl(var(--workflo-black))',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          width: '100%'
        })
        
        submitBtn.value = language === 'nl' ? 'Verstuur aanvraag' : 'Send Request'
        
        // Add hover effects
        submitBtn.addEventListener('mouseenter', () => {
          submitBtn.style.transform = 'translateY(-2px)'
          submitBtn.style.boxShadow = '0 8px 25px hsl(var(--workflo-yellow) / 0.4)'
        })
        
        submitBtn.addEventListener('mouseleave', () => {
          submitBtn.style.transform = 'translateY(0)'
          submitBtn.style.boxShadow = 'none'
        })
      }
    } catch (error) {
      console.error('Error applying form styling:', error)
    }
  }, [language])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-workflo-yellow" />
            {modalTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <AnimatePresence mode="wait">
            {formSubmitted ? (
              <motion.div 
                className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 text-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 360] }}
                  transition={{ duration: 1 }}
                >
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold text-green-700 mb-2">
                    {language === 'nl' ? '🎉 Bedankt!' : '🎉 Thank you!'}
                  </h3>
                  <p className="text-green-600">
                    {language === 'nl' 
                      ? 'Je aanvraag is ontvangen. We nemen binnen 24 uur contact met je op!'
                      : 'Your request has been received. We\'ll contact you within 24 hours!'}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {/* Header info */}
                <div className="text-center p-4 bg-gradient-to-r from-workflo-yellow/10 to-blue-50 rounded-lg border">
                  <p className="text-sm text-muted-foreground">
                    {language === 'nl' 
                      ? 'Vul het formulier in en ontvang binnen 24 uur een persoonlijke offerte op maat.'
                      : 'Fill out the form and receive a personalized quote within 24 hours.'}
                  </p>
                </div>

                {/* HubSpot Form Container */}
                <div 
                  ref={formRef}
                  id={`hubspot-contact-form-${modalFormId}`}
                  className="min-h-[200px]"
                >
                  {formLoading && (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-workflo-yellow" />
                        <span className="text-sm text-muted-foreground">
                          {language === 'nl' ? 'Formulier wordt geladen...' : 'Loading form...'}
                        </span>
                      </div>
                    </div>
                  )}

                  {(useCustomForm || hubspotError) && (
                    <form 
                      onSubmit={async (e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        
                        // You can send this to your API endpoint
                        try {
                          const response = await fetch('/api/contact', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              name: formData.get('name'),
                              email: formData.get('email'),
                              company: formData.get('company'),
                              phone: formData.get('phone'),
                              message: formData.get('message'),
                              language
                            })
                          })
                          const data = await response.json()
                          if (data.success) {
                            setFormSubmitted(true)
                            setTimeout(() => {
                              setFormSubmitted(false)
                              onClose()
                            }, 3000)
                          } else {
                            console.error('Contact form failed:', data.error)
                          }
                        } catch (error) {
                          console.error('Contact form error:', error)
                        }
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          {language === 'nl' ? 'Naam *' : 'Name *'}
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-workflo-yellow/50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          {language === 'nl' ? 'E-mail *' : 'Email *'}
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-workflo-yellow/50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          {language === 'nl' ? 'Bedrijf' : 'Company'}
                        </label>
                        <input
                          type="text"
                          name="company"
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-workflo-yellow/50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          {language === 'nl' ? 'Telefoon' : 'Phone'}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-workflo-yellow/50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          {language === 'nl' ? 'Bericht' : 'Message'}
                        </label>
                        <textarea
                          name="message"
                          rows={4}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-workflo-yellow/50"
                          placeholder={language === 'nl' 
                            ? 'Vertel ons over je IT-behoeften...'
                            : 'Tell us about your IT needs...'
                          }
                        />
                      </div>
                      
                      <Button 
                        type="submit"
                        className="w-full bg-workflo-yellow hover:bg-workflo-yellow-dark text-black font-semibold"
                      >
                        {language === 'nl' ? 'Verstuur aanvraag' : 'Send Request'}
                      </Button>
                    </form>
                  )}
                </div>

                {/* Contact info */}
                <div className="text-center pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'nl' ? 'Of neem direct contact op:' : 'Or contact us directly:'}
                  </p>
                  <div className="flex justify-center gap-4 text-sm">
                    <a href="tel:+31203080465" className="flex items-center gap-1 text-workflo-yellow hover:underline">
                      <Phone className="w-4 h-4" />
                      020-30 80 465
                    </a>
                    <a href="mailto:info@workflo.it" className="flex items-center gap-1 text-workflo-yellow hover:underline">
                      <Mail className="w-4 h-4" />
                      info@workflo.it
                    </a>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
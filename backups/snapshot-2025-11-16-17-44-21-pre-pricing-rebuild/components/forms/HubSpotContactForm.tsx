'use client'

import { useEffect, useRef } from 'react'
import { useLanguage } from '@/lib/contexts/language-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoaderIcon } from 'lucide-react'

interface HubSpotContactFormProps {
  className?: string
}

// HubSpot form configuration from workflo-data.ts
const HUBSPOT_CONFIG = {
  region: 'eu1',
  portalId: '26510736',
  formId: 'acfec8fa-c596-4fe0-aa14-ed4bf42b6f73' // Actual contact form ID from handige links
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

export function HubSpotContactForm({ className = '' }: HubSpotContactFormProps) {
  const { language } = useLanguage()
  const formRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    // Load HubSpot script only once
    if (scriptLoadedRef.current) return

    console.log('[HubSpot Form] Initializing form component')

    const script = document.createElement('script')
    script.src = 'https://js.hsforms.net/forms/embed/v2.js'
    script.async = true
    script.charset = 'utf-8'
    script.type = 'text/javascript'

    script.onload = () => {
      console.log('[HubSpot Form] Script loaded successfully')
      scriptLoadedRef.current = true
      // Add a delay to ensure hbspt is fully loaded
      setTimeout(() => {
        console.log('[HubSpot Form] Attempting to create form...')
        console.log('[HubSpot Form] window.hbspt exists:', typeof window.hbspt !== 'undefined')
        console.log('[HubSpot Form] window.hbspt.forms exists:', typeof window.hbspt?.forms !== 'undefined')
        createForm()
      }, 500) // Increased delay to 500ms
    }

    script.onerror = (error) => {
      console.error('[HubSpot Form] Failed to load script:', error)
      if (formRef.current) {
        formRef.current.innerHTML = `
          <div class="text-center py-8">
            <p class="text-red-500 mb-4">${language === 'nl' ? 'Formulier kon niet worden geladen' : 'Form could not be loaded'}</p>
            <p class="text-muted-foreground">${language === 'nl' ? 'Neem contact met ons op via:' : 'Please contact us via:'}</p>
            <a href="mailto:info@workflo.it" class="text-primary hover:underline">info@workflo.it</a>
            <p class="mt-2">of bel <a href="tel:+31203080465" class="text-primary hover:underline">020-30 80 465</a></p>
          </div>
        `
      }
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="hsforms.net"]')
    if (existingScript) {
      console.log('[HubSpot Form] Script already exists in document')
      scriptLoadedRef.current = true
      setTimeout(() => {
        console.log('[HubSpot Form] Using existing script to create form')
        createForm()
      }, 500)
    } else {
      console.log('[HubSpot Form] Adding script to document')
      document.body.appendChild(script)
    }

    return () => {
      // Cleanup on unmount
      if (formRef.current) {
        formRef.current.innerHTML = ''
      }
    }
  }, [language])

  const createForm = () => {
    console.log('[HubSpot Form] createForm called')

    if (!window.hbspt) {
      console.error('[HubSpot Form] window.hbspt is not available')
      if (formRef.current) {
        formRef.current.innerHTML = `
          <div class="text-center py-8">
            <p class="text-red-500 mb-4">${language === 'nl' ? 'HubSpot API niet beschikbaar' : 'HubSpot API not available'}</p>
            <p class="text-muted-foreground">${language === 'nl' ? 'Neem contact met ons op via:' : 'Please contact us via:'}</p>
            <a href="mailto:info@workflo.it" class="text-primary hover:underline">info@workflo.it</a>
            <p class="mt-2">of bel <a href="tel:+31203080465" class="text-primary hover:underline">020-30 80 465</a></p>
          </div>
        `
      }
      return
    }

    if (!formRef.current) {
      console.error('[HubSpot Form] Form container ref is not available')
      return
    }

    console.log('[HubSpot Form] Creating form with config:', HUBSPOT_CONFIG)

    try {
      // Clear any existing form
      formRef.current.innerHTML = ''

      window.hbspt.forms.create({
        region: HUBSPOT_CONFIG.region,
        portalId: HUBSPOT_CONFIG.portalId,
        formId: HUBSPOT_CONFIG.formId,
        target: `#hubspot-form-${HUBSPOT_CONFIG.formId}`,
        onFormReady: () => {
          console.log('[HubSpot Form] Form ready')
          // Form is ready - can apply custom styling here
          const form = formRef.current?.querySelector('form')
          if (form) {
            form.style.fontFamily = 'inherit'

            // Style form fields to match the design
            const inputs = form.querySelectorAll('input, textarea, select')
            inputs.forEach((input) => {
              const element = input as HTMLElement
              element.style.borderRadius = '6px'
              element.style.border = '1px solid hsl(var(--border))'
              element.style.backgroundColor = 'hsl(var(--background))'
              element.style.color = 'hsl(var(--foreground))'
              element.style.padding = '8px 12px'
              element.style.fontSize = '14px'
            })

            // Style submit button
            const submitBtn = form.querySelector('input[type="submit"]') as HTMLElement
            if (submitBtn) {
              submitBtn.style.backgroundColor = 'hsl(var(--primary))'
              submitBtn.style.color = 'hsl(var(--primary-foreground))'
              submitBtn.style.border = 'none'
              submitBtn.style.borderRadius = '6px'
              submitBtn.style.padding = '10px 24px'
              submitBtn.style.fontSize = '14px'
              submitBtn.style.fontWeight = '600'
              submitBtn.style.cursor = 'pointer'
              submitBtn.style.transition = 'all 0.2s'

              submitBtn.addEventListener('mouseenter', () => {
                submitBtn.style.backgroundColor = 'hsl(var(--primary) / 0.9)'
              })
              submitBtn.addEventListener('mouseleave', () => {
                submitBtn.style.backgroundColor = 'hsl(var(--primary))'
              })
            }

            // Style labels
            const labels = form.querySelectorAll('label')
            labels.forEach((label) => {
              label.style.color = 'hsl(var(--foreground))'
              label.style.fontSize = '14px'
              label.style.fontWeight = '500'
              label.style.marginBottom = '4px'
              label.style.display = 'block'
            })
          }
        },
        onFormSubmit: () => {
          // Track form submission
          console.log('[HubSpot Form] Form submitted')
        }
      })
    } catch (error) {
      console.error('[HubSpot Form] Error creating form:', error)
      if (formRef.current) {
        formRef.current.innerHTML = `
          <div class="text-center py-8">
            <p class="text-red-500 mb-4">${language === 'nl' ? 'Fout bij laden formulier' : 'Error loading form'}</p>
            <p class="text-muted-foreground">${language === 'nl' ? 'Neem contact met ons op via:' : 'Please contact us via:'}</p>
            <a href="mailto:info@workflo.it" class="text-primary hover:underline">info@workflo.it</a>
            <p class="mt-2">of bel <a href="tel:+31203080465" class="text-primary hover:underline">020-30 80 465</a></p>
          </div>
        `
      }
    }
  }

  return (
    <Card className={`bg-card shadow-xl ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">
          {language === 'nl' ? 'Stuur ons een bericht' : 'Send us a message'}
        </CardTitle>
        <p className="text-muted-foreground">
          {language === 'nl' 
            ? 'Vul het formulier in en we nemen binnen 24 uur contact met je op.'
            : 'Fill out the form and we\'ll contact you within 24 hours.'
          }
        </p>
      </CardHeader>
      
      <CardContent>
        <div 
          ref={formRef}
          id={`hubspot-form-${HUBSPOT_CONFIG.formId}`}
          className="min-h-[400px] flex items-center justify-center"
        >
          {/* Loading state */}
          <div className="flex items-center gap-3 text-muted-foreground">
            <LoaderIcon className="w-5 h-5 animate-spin" />
            <span>{language === 'nl' ? 'Formulier laden...' : 'Loading form...'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
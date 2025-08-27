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
    
    const script = document.createElement('script')
    script.src = '//js.hsforms.net/forms/embed/v2.js'
    script.async = true
    script.onload = () => {
      scriptLoadedRef.current = true
      createForm()
    }
    
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="hsforms.net"]')
    if (existingScript) {
      scriptLoadedRef.current = true
      createForm()
    } else {
      document.body.appendChild(script)
    }

    return () => {
      // Cleanup on unmount
      if (formRef.current) {
        formRef.current.innerHTML = ''
      }
    }
  }, [])

  const createForm = () => {
    if (window.hbspt && formRef.current) {
      // Clear any existing form
      formRef.current.innerHTML = ''
      
      window.hbspt.forms.create({
        region: HUBSPOT_CONFIG.region,
        portalId: HUBSPOT_CONFIG.portalId,
        formId: HUBSPOT_CONFIG.formId,
        target: `#hubspot-form-${HUBSPOT_CONFIG.formId}`,
        onFormReady: () => {
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
          console.log('HubSpot contact form submitted')
        }
      })
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
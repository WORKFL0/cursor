'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/contexts/language-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { loadHubSpotScript, createHubSpotForm } from '@/lib/hubspot-loader'

interface HubSpotContactFormProps {
  className?: string
}

export function HubSpotContactForm({ className = '' }: HubSpotContactFormProps) {
  const { language } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let mounted = true

    async function initForm() {
      try {
        const success = await loadHubSpotScript()

        if (!mounted) return

        if (success) {
          const formCreated = createHubSpotForm({
            region: 'eu1',
            portalId: '26510736',
            formId: 'acfec8fa-c596-4fe0-aa14-ed4bf42b6f73',
            target: '#hubspot-contact-form'
          })

          if (formCreated) {
            setIsLoading(false)
          } else {
            setError(true)
            setIsLoading(false)
          }
        } else {
          setError(true)
          setIsLoading(false)
        }
      } catch (e) {
        console.error('[HubSpot Contact Form] Error:', e)
        if (mounted) {
          setError(true)
          setIsLoading(false)
        }
      }
    }

    initForm()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <Card className={`bg-card shadow-xl relative z-10 ${className}`}>
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
        {isLoading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                {language === 'nl' ? 'Formulier laden...' : 'Loading form...'}
              </p>
            </div>
          </div>
        )}
        {error && (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-4">
                {language === 'nl' ? 'Formulier kon niet worden geladen' : 'Form could not be loaded'}
              </p>
              <p className="text-muted-foreground mb-2">
                {language === 'nl' ? 'Neem direct contact met ons op:' : 'Contact us directly:'}
              </p>
              <a href="mailto:info@workflo.it" className="text-primary hover:underline">
                info@workflo.it
              </a>
              <p className="mt-2">
                {language === 'nl' ? 'of bel' : 'or call'}{' '}
                <a href="tel:+31203080465" className="text-primary hover:underline">
                  020-30 80 465
                </a>
              </p>
            </div>
          </div>
        )}
        <div id="hubspot-contact-form" className={`min-h-[500px] ${isLoading || error ? 'hidden' : ''}`} />
      </CardContent>
    </Card>
  )
}
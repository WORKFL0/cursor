'use client'

import React from 'react'
import { WorkfloForm, FormConfig } from './WorkfloForm'
import { NewsletterFormValidator } from '@/lib/utils/form-validation'
import { Mail, Shield, TrendingUp } from 'lucide-react'

const newsletterFormConfig: FormConfig = {
  type: 'newsletter',
  title: 'Blijf op de hoogte',
  description: 'Ontvang wekelijkse IT-tips, cybersecurity waarschuwingen en exclusieve inzichten.',
  apiEndpoint: '/api/newsletter',
  submitButtonText: 'Aanmelden voor nieuwsbrief',
  successMessage: 'Welkom bij onze nieuwsbrief! Je eerste IT-tip komt binnen 24 uur.',
  validator: NewsletterFormValidator,
  fields: [
    {
      name: 'email',
      type: 'email',
      label: 'E-mailadres',
      placeholder: 'je@bedrijf.nl',
      required: true,
      icon: <Mail className="w-4 h-4" />,
      description: 'We versturen wekelijks op dinsdag om 9:00'
    }
  ]
}

export interface NewsletterFormProps {
  className?: string
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
  variant?: 'default' | 'compact' | 'inline'
  showBenefits?: boolean
}

export function NewsletterForm({ 
  className, 
  onSuccess, 
  onError, 
  variant = 'default',
  showBenefits = true
}: NewsletterFormProps) {
  
  const handleSuccess = (data: any) => {
    // Track successful newsletter signup
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'newsletter_signup', {
        event_category: 'engagement',
        event_label: 'newsletter_form',
        value: 1
      })
    }
    
    onSuccess?.(data)
  }

  if (variant === 'compact') {
    return (
      <div className={`max-w-md ${className}`}>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-workflo-yellow rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-black stroke-2" />
            </div>
            <h3 className="font-semibold text-lg">IT Tips & Nieuws</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Wekelijkse cybersecurity tips en IT-trends
          </p>
        </div>
        
        <WorkfloForm
          config={{
            ...newsletterFormConfig,
            title: '',
            description: '',
          }}
          onSubmitSuccess={handleSuccess}
          onSubmitError={onError}
          showPrivacyNotice={false}
          enableProgressIndicator={false}
        />
        
        {showBenefits && (
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Geen spam</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Wekelijks</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-workflo-yellow rounded-full"></span>
              <span>Gratis</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
        <div className="flex-1">
          <input
            type="email"
            placeholder="Je e-mailadres"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-workflo-yellow focus:border-transparent"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                // Handle form submission
              }
            }}
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-workflo-yellow hover:bg-workflo-yellow-dark text-black font-semibold rounded-lg transition-colors"
        >
          Aanmelden
        </button>
      </div>
    )
  }

  return (
    <div className={className}>
      {showBenefits && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gradient-to-r from-workflo-yellow-light/20 to-workflo-yellow/10 rounded-lg">
          <div className="text-center">
            <div className="w-12 h-12 bg-workflo-yellow rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-black" />
            </div>
            <h4 className="font-semibold mb-1">Wekelijkse Tips</h4>
            <p className="text-sm text-muted-foreground">
              Praktische IT-tips elke dinsdag
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-white stroke-2" />
            </div>
            <h4 className="font-semibold mb-1">Security Alerts</h4>
            <p className="text-sm text-muted-foreground">
              Directe waarschuwingen bij dreigingen
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white stroke-2" />
            </div>
            <h4 className="font-semibold mb-1">Trend Analyses</h4>
            <p className="text-sm text-muted-foreground">
              Exclusieve marktinzichten
            </p>
          </div>
        </div>
      )}

      <WorkfloForm
        config={newsletterFormConfig}
        onSubmitSuccess={handleSuccess}
        onSubmitError={onError}
        showPrivacyNotice={true}
        enableProgressIndicator={false}
      />

      {showBenefits && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>1.400+ IT-professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-workflo-yellow rounded-full"></span>
              <span>4.9/5 sterren</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>GDPR compliant</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Export a simple inline newsletter signup for use in headers/footers
export function InlineNewsletterSignup({ className }: { className?: string }) {
  return <NewsletterForm variant="inline" className={className} showBenefits={false} />
}
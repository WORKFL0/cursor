'use client'

import React from 'react'
import { WorkfloForm, FormConfig } from './WorkfloForm'
import { QuoteFormValidator } from '@/lib/utils/form-validation'
import { User, Mail, Phone, Building, FileText, Euro, Clock, Zap } from 'lucide-react'

const quoteFormConfig: FormConfig = {
  type: 'quote',
  title: 'Vraag een offerte aan',
  description: 'Vertel ons over je project en ontvang binnen 24 uur een gepersonaliseerde offerte.',
  apiEndpoint: '/api/quote',
  submitButtonText: 'Offerte aanvragen',
  successMessage: 'Je offerteverzoek is ontvangen! We nemen binnen 24 uur contact met je op met een gepersonaliseerde offerte.',
  validator: QuoteFormValidator,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Voor- en achternaam',
      placeholder: 'Je volledige naam',
      required: true,
      icon: <User className="w-4 h-4" />,
      maxLength: 100
    },
    {
      name: 'email',
      type: 'email',
      label: 'E-mailadres',
      placeholder: 'je@bedrijf.nl',
      required: true,
      icon: <Mail className="w-4 h-4" />,
      description: 'We sturen de offerte naar dit adres'
    },
    {
      name: 'phone',
      type: 'tel',
      label: 'Telefoonnummer',
      placeholder: '06-12345678 (aanbevolen)',
      required: false,
      icon: <Phone className="w-4 h-4" />,
      description: 'Voor vragen over je offerte'
    },
    {
      name: 'company',
      type: 'text',
      label: 'Bedrijf',
      placeholder: 'Je bedrijfsnaam',
      required: false,
      icon: <Building className="w-4 h-4" />,
      maxLength: 100,
      description: 'Helpt ons de offerte beter af te stemmen'
    },
    {
      name: 'services',
      type: 'multi-select',
      label: 'Gewenste diensten',
      required: true,
      icon: <FileText className="w-4 h-4" />,
      description: 'Selecteer alle diensten die je interesseren (meerdere mogelijk)',
      options: [
        { value: 'IT Beheer & Support', label: 'IT Beheer & Support' },
        { value: 'Microsoft 365', label: 'Microsoft 365 (Office, Teams, SharePoint)' },
        { value: 'Cybersecurity', label: 'Cybersecurity & Beveiliging' },
        { value: 'Cloud Migratie', label: 'Cloud Migratie & Modernisering' },
        { value: 'IT Consultancy', label: 'IT Strategie & Consultancy' },
        { value: 'Backup & Herstel', label: 'Backup & Disaster Recovery' },
        { value: 'Hardware & Software', label: 'Hardware & Software Inkoop' },
        { value: 'Compliance & AVG', label: 'Compliance & AVG/GDPR' },
        { value: 'Anders', label: 'Anders (specificeer in beschrijving)' }
      ]
    },
    {
      name: 'budget',
      type: 'select',
      label: 'Indicatief budget',
      placeholder: 'Selecteer budget range (optioneel)',
      required: false,
      icon: <Euro className="w-4 h-4" />,
      description: 'Helpt ons een passende oplossing voor te stellen',
      options: [
        { value: '< €5.000', label: '< €5.000 (klein project)' },
        { value: '€5.000 - €15.000', label: '€5.000 - €15.000 (gemiddeld project)' },
        { value: '€15.000 - €50.000', label: '€15.000 - €50.000 (groot project)' },
        { value: '> €50.000', label: '> €50.000 (enterprise project)' },
        { value: 'Nog niet bepaald', label: 'Nog niet bepaald' }
      ]
    },
    {
      name: 'timeline',
      type: 'select',
      label: 'Gewenste timeline',
      placeholder: 'Wanneer moet het klaar zijn? (optioneel)',
      required: false,
      icon: <Clock className="w-4 h-4" />,
      options: [
        { value: 'Direct', label: 'Zo snel mogelijk (urgent)' },
        { value: '1-3 maanden', label: 'Binnen 1-3 maanden' },
        { value: '3-6 maanden', label: 'Binnen 3-6 maanden' },
        { value: '6+ maanden', label: 'Over 6+ maanden' },
        { value: 'Nog niet bepaald', label: 'Nog niet bepaald' }
      ]
    },
    {
      name: 'urgency',
      type: 'select',
      label: 'Urgentie',
      placeholder: 'Hoe urgent is dit project?',
      required: false,
      icon: <Zap className="w-4 h-4" />,
      description: 'Helpt ons prioriteit te geven aan je aanvraag',
      options: [
        { value: 'low', label: 'Laag - Ik oriënteer me nog' },
        { value: 'medium', label: 'Gemiddeld - Wil graag binnen een week antwoord' },
        { value: 'high', label: 'Hoog - Urgente situatie, snel contact gewenst' }
      ]
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Projectbeschrijving',
      placeholder: 'Beschrijf je project, huidige situatie, gewenste resultaat en eventuele specifieke eisen...\n\nBijvoorbeeld:\n- Huidige IT-infrastructuur\n- Aantal gebruikers/werkplekken\n- Specifieke software/systemen\n- Uitdagingen die je ondervindt\n- Doelstellingen van het project',
      required: true,
      icon: <FileText className="w-4 h-4" />,
      maxLength: 1500,
      description: 'Hoe gedetailleerder je beschrijving, des te accurater onze offerte'
    }
  ]
}

export interface QuoteFormProps {
  className?: string
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
  showPrivacyNotice?: boolean
  preselectedServices?: string[]
}

export function QuoteForm({ 
  className, 
  onSuccess, 
  onError, 
  showPrivacyNotice = true,
  preselectedServices = []
}: QuoteFormProps) {
  // Modify config to include preselected services
  const configWithPreselected = {
    ...quoteFormConfig,
    fields: quoteFormConfig.fields.map(field => {
      if (field.name === 'services' && preselectedServices.length > 0) {
        return {
          ...field,
          // We'll handle preselection in the WorkfloForm component
        }
      }
      return field
    })
  }

  const handleSuccess = (data: any) => {
    // Track successful quote request
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'quote_request', {
        event_category: 'engagement',
        event_label: data.services?.join(',') || 'unknown',
        value: 1
      })
    }
    
    onSuccess?.(data)
  }

  return (
    <div>
      {preselectedServices.length > 0 && (
        <div className="mb-6 p-4 bg-workflo-yellow-light/20 border border-workflo-yellow-light rounded-lg">
          <p className="text-sm font-medium text-workflo-black mb-2">
            Voorgeselecteerde diensten:
          </p>
          <div className="flex flex-wrap gap-2">
            {preselectedServices.map((service) => (
              <span
                key={service}
                className="px-3 py-1 bg-workflo-yellow text-workflo-black text-sm rounded-full font-medium"
              >
                {service}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Je kunt deze aanpassen in het formulier hieronder.
          </p>
        </div>
      )}
      
      <WorkfloForm
        config={configWithPreselected}
        className={className}
        onSubmitSuccess={handleSuccess}
        onSubmitError={onError}
        showPrivacyNotice={showPrivacyNotice}
        enableProgressIndicator={true}
      />
    </div>
  )
}
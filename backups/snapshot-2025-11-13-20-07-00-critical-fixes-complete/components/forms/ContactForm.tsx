'use client'

import React from 'react'
import { WorkfloForm, FormConfig } from './WorkfloForm'
import { ContactFormValidator } from '@/lib/utils/form-validation'
import { User, Mail, Phone, Building, FileText, MessageSquare } from 'lucide-react'

const contactFormConfig: FormConfig = {
  type: 'contact',
  title: 'Neem contact met ons op',
  description: 'Stel je vraag en we nemen binnen 4 uur contact met je op.',
  apiEndpoint: '/api/contact',
  submitButtonText: 'Verstuur bericht',
  successMessage: 'Bedankt voor je bericht! We nemen binnen 4 werkuren contact met je op.',
  validator: ContactFormValidator,
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
      description: 'We gebruiken dit om contact met je op te nemen'
    },
    {
      name: 'phone',
      type: 'tel',
      label: 'Telefoonnummer',
      placeholder: '06-12345678 (optioneel)',
      required: false,
      icon: <Phone className="w-4 h-4" />,
      description: 'Voor urgente zaken bellen we je direct'
    },
    {
      name: 'company',
      type: 'text',
      label: 'Bedrijf',
      placeholder: 'Je bedrijfsnaam (optioneel)',
      required: false,
      icon: <Building className="w-4 h-4" />,
      maxLength: 100
    },
    {
      name: 'subject',
      type: 'select',
      label: 'Onderwerp',
      placeholder: 'Waar gaat je vraag over?',
      required: true,
      icon: <FileText className="w-4 h-4" />,
      options: [
        { value: 'algemene-vraag', label: 'Algemene vraag' },
        { value: 'it-support', label: 'IT Support nodig' },
        { value: 'cybersecurity', label: 'Cybersecurity vraag' },
        { value: 'microsoft-365', label: 'Microsoft 365' },
        { value: 'cloud-migratie', label: 'Cloud migratie' },
        { value: 'compliance-avg', label: 'Compliance & AVG' },
        { value: 'offerte-aanvraag', label: 'Offerte aanvraag' },
        { value: 'technisch-probleem', label: 'Technisch probleem' },
        { value: 'partnership', label: 'Partnership / Samenwerking' },
        { value: 'anders', label: 'Anders' }
      ]
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Bericht',
      placeholder: 'Beschrijf je vraag, probleem of project zo duidelijk mogelijk...',
      required: true,
      icon: <MessageSquare className="w-4 h-4" />,
      maxLength: 2000,
      description: 'Hoe meer details je geeft, des te beter kunnen we je helpen'
    }
  ]
}

export interface ContactFormProps {
  className?: string
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
  showPrivacyNotice?: boolean
}

export function ContactForm({ 
  className, 
  onSuccess, 
  onError, 
  showPrivacyNotice = true 
}: ContactFormProps) {
  return (
    <WorkfloForm
      config={contactFormConfig}
      className={className}
      onSubmitSuccess={onSuccess}
      onSubmitError={onError}
      showPrivacyNotice={showPrivacyNotice}
      enableProgressIndicator={true}
    />
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useLanguage } from '@/lib/contexts/language-context'
import { CheckCircle, AlertCircle, Send, Loader2, Shield } from 'lucide-react'

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  subject: string
  message: string
  services: string[]
  honeypot: string // Honeypot field for spam protection
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  company?: string
  subject?: string
  message?: string
}

const subjectOptions = [
  { value: 'general-inquiry', nlLabel: 'Algemene vraag', enLabel: 'General Inquiry' },
  { value: 'managed-it', nlLabel: 'Managed IT Services', enLabel: 'Managed IT Services' },
  { value: 'cloud-migration', nlLabel: 'Cloud Migratie', enLabel: 'Cloud Migration' },
  { value: 'cybersecurity', nlLabel: 'Cyberbeveiliging', enLabel: 'Cybersecurity' },
  { value: 'backup-recovery', nlLabel: 'Backup & Recovery', enLabel: 'Backup & Recovery' },
  { value: 'support-request', nlLabel: 'Ondersteuningsverzoek', enLabel: 'Support Request' },
  { value: 'quote-request', nlLabel: 'Offerte aanvragen', enLabel: 'Quote Request' },
  { value: 'partnership', nlLabel: 'Partnerschap', enLabel: 'Partnership' },
  { value: 'other', nlLabel: 'Anders', enLabel: 'Other' }
]

const services = [
  { id: 'managed-it', nlLabel: 'Managed IT Services', enLabel: 'Managed IT Services' },
  { id: 'cloud-migration', nlLabel: 'Cloud Migratie', enLabel: 'Cloud Migration' },
  { id: 'cybersecurity', nlLabel: 'Cyberbeveiliging', enLabel: 'Cybersecurity' },
  { id: 'backup-recovery', nlLabel: 'Backup & Recovery', enLabel: 'Backup & Recovery' },
  { id: 'network-setup', nlLabel: 'Netwerk Installatie', enLabel: 'Network Setup' },
  { id: 'hardware-support', nlLabel: 'Hardware Ondersteuning', enLabel: 'Hardware Support' },
  { id: 'software-licensing', nlLabel: 'Software Licenties', enLabel: 'Software Licensing' },
  { id: 'it-consulting', nlLabel: 'IT Consultancy', enLabel: 'IT Consulting' },
  { id: 'voip-services', nlLabel: 'VoIP Services', enLabel: 'VoIP Services' },
  { id: 'microsoft-365', nlLabel: 'Microsoft 365', enLabel: 'Microsoft 365' }
]

export function ContactForm() {
  const { language } = useLanguage()
  const { toast } = useToast()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    services: [],
    honeypot: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = language === 'nl' ? 'Naam is verplicht' : 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = language === 'nl' ? 'Naam moet minimaal 2 karakters bevatten' : 'Name must be at least 2 characters'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = language === 'nl' ? 'E-mail is verplicht' : 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = language === 'nl' ? 'Voer een geldig e-mailadres in' : 'Please enter a valid email address'
    }

    // Phone validation (optional but if provided must be valid)
    if (formData.phone.trim()) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = language === 'nl' ? 'Voer een geldig telefoonnummer in' : 'Please enter a valid phone number'
      }
    }

    // Company validation (optional)
    if (formData.company.trim() && formData.company.trim().length < 2) {
      newErrors.company = language === 'nl' ? 'Bedrijfsnaam moet minimaal 2 karakters bevatten' : 'Company name must be at least 2 characters'
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = language === 'nl' ? 'Onderwerp is verplicht' : 'Subject is required'
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = language === 'nl' ? 'Bericht is verplicht' : 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = language === 'nl' ? 'Bericht moet minimaal 10 karakters bevatten' : 'Message must be at least 10 characters'
    } else if (formData.message.trim().length > 2000) {
      newErrors.message = language === 'nl' ? 'Bericht mag maximaal 2000 karakters bevatten' : 'Message must not exceed 2000 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check honeypot field (should be empty)
    if (formData.honeypot) {
      // This is likely spam, silently ignore
      console.log('Spam detected via honeypot field')
      return
    }
    
    if (!validateForm()) {
      toast({
        title: language === 'nl' ? 'Formulier onvolledig' : 'Form incomplete',
        description: language === 'nl' 
          ? 'Corrigeer de aangegeven fouten en probeer opnieuw.'
          : 'Please correct the highlighted errors and try again.',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would typically send the data to your backend or email service
      const submissionData = {
        ...formData,
        honeypot: undefined, // Remove honeypot from actual submission
        submittedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      }
      console.log('Form data:', submissionData)
      
      toast({
        title: language === 'nl' ? 'Bericht verzonden!' : 'Message sent!',
        description: language === 'nl' 
          ? 'Bedankt voor je bericht. We nemen binnen 24 uur contact met je op.'
          : 'Thank you for your message. We will contact you within 24 hours.',
      })

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        services: [],
        honeypot: ''
      })
      
    } catch (error) {
      console.error('Form submission error:', error)
      toast({
        title: language === 'nl' ? 'Fout opgetreden' : 'Error occurred',
        description: language === 'nl' 
          ? 'Er ging iets mis bij het verzenden. Probeer het later opnieuw of neem direct contact met ons op.'
          : 'Something went wrong while sending. Please try again later or contact us directly.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-card shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">
          {language === 'nl' ? 'Stuur ons een bericht' : 'Send us a message'}
        </CardTitle>
        <p className="text-muted-foreground">
          {language === 'nl' 
            ? 'Vul het formulier in en we nemen binnen 24 uur contact met u op.'
            : 'Fill out the form and we\'ll contact you within 24 hours.'
          }
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              {language === 'nl' ? 'Naam' : 'Name'} *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`mt-1 ${errors.name ? 'border-destructive focus:ring-destructive' : 'focus:ring-primary focus:border-primary'}`}
              placeholder={language === 'nl' ? 'Uw volledige naam' : 'Your full name'}
            />
            {errors.name && (
              <div className="flex items-center gap-2 mt-1 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{errors.name}</span>
              </div>
            )}
          </div>

          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              {language === 'nl' ? 'E-mail' : 'Email'} *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`mt-1 ${errors.email ? 'border-destructive focus:ring-destructive' : 'focus:ring-primary focus:border-primary'}`}
              placeholder={language === 'nl' ? 'uw@email.nl' : 'your@email.com'}
            />
            {errors.email && (
              <div className="flex items-center gap-2 mt-1 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{errors.email}</span>
              </div>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-foreground">
              {language === 'nl' ? 'Telefoon' : 'Phone'}
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`mt-1 ${errors.phone ? 'border-destructive focus:ring-destructive' : 'focus:ring-primary focus:border-primary'}`}
              placeholder={language === 'nl' ? 'Uw telefoonnummer' : 'Your phone number'}
            />
            {errors.phone && (
              <div className="flex items-center gap-2 mt-1 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{errors.phone}</span>
              </div>
            )}
          </div>

          {/* Company Field */}
          <div>
            <Label htmlFor="company" className="text-sm font-medium text-foreground">
              {language === 'nl' ? 'Bedrijf' : 'Company'}
            </Label>
            <Input
              id="company"
              type="text"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className={`mt-1 ${errors.company ? 'border-destructive focus:ring-destructive' : 'focus:ring-primary focus:border-primary'}`}
              placeholder={language === 'nl' ? 'Uw bedrijfsnaam' : 'Your company name'}
            />
            {errors.company && (
              <div className="flex items-center gap-2 mt-1 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{errors.company}</span>
              </div>
            )}
          </div>

          {/* Subject Field */}
          <div>
            <Label htmlFor="subject" className="text-sm font-medium text-foreground">
              {language === 'nl' ? 'Onderwerp' : 'Subject'} *
            </Label>
            <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
              <SelectTrigger className={`mt-1 ${errors.subject ? 'border-destructive focus:ring-destructive' : 'focus:ring-primary focus:border-primary'}`}>
                <SelectValue placeholder={language === 'nl' ? 'Selecteer een onderwerp' : 'Select a subject'} />
              </SelectTrigger>
              <SelectContent>
                {subjectOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {language === 'nl' ? option.nlLabel : option.enLabel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject && (
              <div className="flex items-center gap-2 mt-1 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{errors.subject}</span>
              </div>
            )}
          </div>

          {/* Services Interest */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">
              {language === 'nl' ? 'Interesse in diensten' : 'Service interest'}
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((service) => (
                <div key={service.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={service.id}
                    checked={formData.services.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                    className="w-4 h-4 text-primary border-input rounded focus:ring-primary"
                  />
                  <Label 
                    htmlFor={service.id}
                    className="text-sm text-foreground cursor-pointer"
                  >
                    {language === 'nl' ? service.nlLabel : service.enLabel}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Honeypot Field (hidden) */}
          <input
            type="text"
            name="website"
            value={formData.honeypot}
            onChange={(e) => handleInputChange('honeypot', e.target.value)}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Message Field */}
          <div>
            <Label htmlFor="message" className="text-sm font-medium text-foreground">
              {language === 'nl' ? 'Bericht' : 'Message'} *
            </Label>
            <Textarea
              id="message"
              rows={6}
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className={`mt-1 resize-none ${errors.message ? 'border-destructive focus:ring-destructive' : 'focus:ring-primary focus:border-primary'}`}
              placeholder={language === 'nl' ? 'Vertel ons over je IT-uitdagingen, gewenste oplossingen, of stel je vraag...' : 'Tell us about your IT challenges, desired solutions, or ask your question...'}
              maxLength={2000}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.message ? (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{errors.message}</span>
                </div>
              ) : (
                <div></div>
              )}
              <span className="text-xs text-muted-foreground">
                {formData.message.length}/2000
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {language === 'nl' ? 'Bezig met verzenden...' : 'Sending...'}
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {language === 'nl' ? 'Verstuur bericht' : 'Send message'}
              </>
            )}
          </Button>

          {/* Security Notice */}
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border">
            <Shield className="w-5 h-5 text-success flex-shrink-0" />
            <div className="text-sm text-foreground">
              <p className="font-medium mb-1">
                {language === 'nl' ? 'Je privacy is belangrijk' : 'Your privacy matters'}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === 'nl' 
                  ? 'We behandelen je gegevens vertrouwelijk en gebruiken ze alleen om contact met je op te nemen. Meer info in ons privacybeleid.'
                  : 'We treat your data confidentially and use it only to contact you. More info in our privacy policy.'}
              </p>
            </div>
          </div>

          {/* Required fields note */}
          <p className="text-sm text-muted-foreground text-center">
            * {language === 'nl' ? 'Verplichte velden' : 'Required fields'}
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
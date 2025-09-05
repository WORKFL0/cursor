'use client'

import { useState } from 'react'
import { motion } from '@/lib/framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Send, CheckCircle, AlertCircle, Phone, Mail } from 'lucide-react'
import { servicesData } from '@/lib/data/services-data'

interface QuoteFormProps {
  initialService?: string
  initialUsers?: number
  initialSupportType?: 'remote' | 'onsite'
}

interface FormData {
  serviceSlug: string
  users: string
  supportType: 'remote' | 'onsite'
  companyName: string
  contactEmail: string
  phone: string
  message: string
}

interface FormState {
  isSubmitting: boolean
  isSuccess: boolean
  error: string | null
}

export default function QuoteForm({ 
  initialService = '',
  initialUsers = 10,
  initialSupportType = 'remote'
}: QuoteFormProps) {
  const [formData, setFormData] = useState<FormData>({
    serviceSlug: initialService,
    users: initialUsers.toString(),
    supportType: initialSupportType,
    companyName: '',
    contactEmail: '',
    phone: '',
    message: ''
  })

  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSuccess: false,
    error: null
  })

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear any existing errors when user starts typing
    if (formState.error) {
      setFormState(prev => ({ ...prev, error: null }))
    }
  }

  const validateForm = (): string | null => {
    if (!formData.serviceSlug) return 'Selecteer een service'
    if (!formData.users || parseInt(formData.users) < 1) return 'Voer een geldig aantal gebruikers in'
    if (!formData.companyName.trim()) return 'Bedrijfsnaam is verplicht'
    if (!formData.contactEmail.trim()) return 'E-mailadres is verplicht'
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.contactEmail)) return 'Voer een geldig e-mailadres in'

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setFormState(prev => ({ ...prev, error: validationError }))
      return
    }

    setFormState(prev => ({
      ...prev,
      isSubmitting: true,
      error: null
    }))

    try {
      const response = await fetch('/api/services/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Er is een fout opgetreden')
      }

      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        isSuccess: true
      }))

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          serviceSlug: initialService,
          users: initialUsers.toString(),
          supportType: initialSupportType,
          companyName: '',
          contactEmail: '',
          phone: '',
          message: ''
        })
        setFormState({
          isSubmitting: false,
          isSuccess: false,
          error: null
        })
      }, 3000)

    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        error: error instanceof Error ? error.message : 'Er is een onbekende fout opgetreden'
      }))
    }
  }

  if (formState.isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-2">
              Bedankt voor je aanvraag!
            </h3>
            <p className="text-green-700 dark:text-green-300 mb-4">
              We hebben je offerte-aanvraag ontvangen en nemen binnen 24 uur contact met je op.
            </p>
            <div className="space-y-2 text-sm text-green-600">
              <p className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                Je ontvangt een bevestiging op {formData.contactEmail}
              </p>
              {formData.phone && (
                <p className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  We bellen je op {formData.phone}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Offerte Aanvragen</CardTitle>
          <CardDescription>
            Vul onderstaande gegevens in en ontvang binnen 24 uur een persoonlijke offerte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {formState.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formState.error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Selection */}
              <div className="space-y-2">
                <Label htmlFor="service">Service *</Label>
                <Select 
                  value={formData.serviceSlug} 
                  onValueChange={(value) => handleInputChange('serviceSlug', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer een service" />
                  </SelectTrigger>
                  <SelectContent>
                    {servicesData.map((service) => (
                      <SelectItem key={service.slug} value={service.slug}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{service.icon}</span>
                          <span>{service.title}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Number of Users */}
              <div className="space-y-2">
                <Label htmlFor="users">Aantal Gebruikers *</Label>
                <Input
                  id="users"
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.users}
                  onChange={(e) => handleInputChange('users', e.target.value)}
                  placeholder="Bijv. 10"
                />
              </div>
            </div>

            {/* Support Type (only for managed IT) */}
            {formData.serviceSlug === 'managed-it' && (
              <div className="space-y-2">
                <Label htmlFor="supportType">Support Type</Label>
                <Select 
                  value={formData.supportType} 
                  onValueChange={(value: 'remote' | 'onsite') => handleInputChange('supportType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">
                      Remote Support - €60/gebruiker per maand
                    </SelectItem>
                    <SelectItem value="onsite">
                      Onsite Support - €90/gebruiker per maand
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName">Bedrijfsnaam *</Label>
                <Input
                  id="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Jouw Bedrijf B.V."
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="contactEmail">E-mailadres *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="naam@bedrijf.nl"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Telefoonnummer</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="020 123 45 67"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Bericht (optioneel)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Vertel ons meer over je specifieke wensen of vragen..."
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Bezig met verzenden...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Offerte Aanvragen
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Door dit formulier in te dienen ga je akkoord met onze{' '}
              <a href="/privacy" className="underline hover:no-underline">
                privacyverklaring
              </a>
              . We nemen binnen 24 uur contact met je op.
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
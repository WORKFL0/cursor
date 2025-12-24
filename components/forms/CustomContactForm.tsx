'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/lib/contexts/language-context'
import { contactFormSchema, ContactFormData } from '@/lib/validations/forms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface CustomContactFormProps {
  className?: string
}

export function CustomContactForm({ className = '' }: CustomContactFormProps) {
  const { language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [csrfToken, setCsrfToken] = useState<string>('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: '',
      honeypot: ''
    }
  })

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/csrf-token')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.token) {
            setCsrfToken(data.token)
          }
        }
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error)
      }
    }

    fetchCsrfToken()
  }, [])

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/contact-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Er is iets misgegaan')
      }

      setSubmitSuccess(true)
      reset()
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitError(
        error instanceof Error
          ? error.message
          : language === 'nl'
            ? 'Er is een onverwachte fout opgetreden. Probeer het later opnieuw.'
            : 'An unexpected error occurred. Please try again later.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <Card className={`bg-card shadow-xl border-green-500/20 ${className}`}>
        <CardContent className="pt-10 pb-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {language === 'nl' ? 'Bericht verstuurd!' : 'Message sent!'}
          </h3>
          <p className="text-muted-foreground max-w-md mb-6">
            {language === 'nl'
              ? 'Bedankt voor je bericht. We hebben een bevestiging naar je e-mailadres gestuurd en nemen zo snel mogelijk contact met je op.'
              : 'Thanks for your message. We sent a confirmation to your email address and will contact you as soon as possible.'
            }
          </p>
          <Button
            onClick={() => setSubmitSuccess(false)}
            variant="outline"
          >
            {language === 'nl' ? 'Nog een bericht sturen' : 'Send another message'}
          </Button>
        </CardContent>
      </Card>
    )
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
        {submitError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{language === 'nl' ? 'Fout' : 'Error'}</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Honeypot field - hidden from users */}
          <input
            type="text"
            className="hidden"
            autoComplete="off"
            tabIndex={-1}
            {...register('honeypot')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {language === 'nl' ? 'Naam' : 'Name'} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder={language === 'nl' ? 'Jouw naam' : 'Your name'}
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">
                {language === 'nl' ? 'Bedrijf' : 'Company'}
              </Label>
              <Input
                id="company"
                placeholder={language === 'nl' ? 'Bedrijfsnaam (optioneel)' : 'Company name (optional)'}
                {...register('company')}
                className={errors.company ? 'border-red-500' : ''}
              />
              {errors.company && (
                <p className="text-sm text-red-500">{errors.company.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                {language === 'nl' ? 'E-mailadres' : 'Email address'} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="naam@bedrijf.nl"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                {language === 'nl' ? 'Telefoonnummer' : 'Phone number'}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="06 12345678"
                {...register('phone')}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">
              {language === 'nl' ? 'Onderwerp' : 'Subject'} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              placeholder={language === 'nl' ? 'Waar gaat het over?' : 'What is it about?'}
              {...register('subject')}
              className={errors.subject ? 'border-red-500' : ''}
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">
              {language === 'nl' ? 'Bericht' : 'Message'} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder={language === 'nl' ? 'Typ hier je bericht...' : 'Type your message here...'}
              rows={5}
              {...register('message')}
              className={errors.message ? 'border-red-500' : ''}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === 'nl' ? 'Verzenden...' : 'Sending...'}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {language === 'nl' ? 'Verstuur bericht' : 'Send message'}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            {language === 'nl'
              ? 'Door dit formulier te versturen ga je akkoord met onze privacyverklaring.'
              : 'By submitting this form you agree to our privacy policy.'}
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

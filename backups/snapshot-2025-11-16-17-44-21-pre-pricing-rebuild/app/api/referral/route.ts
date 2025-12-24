import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { emailService, ReferralFormData } from '@/lib/services/email-service'
import { hubspotService } from '@/lib/services/hubspot-service'
import { checkRateLimit, addRateLimitHeaders } from '@/lib/middleware/rate-limiter'
import { checkCSRF } from '@/lib/middleware/csrf-protection'

// Zod validation schema for referral form
const referralFormSchema = z.object({
  // Referrer information (person making the referral)
  referrerName: z.string().min(2, 'Naam moet minimaal 2 karakters bevatten').max(100),
  referrerEmail: z.string().email('Ongeldig e-mailadres'),
  referrerPhone: z.string().optional(),
  referrerCompany: z.string().optional(),

  // Referred company information (the lead)
  referredName: z.string().min(2, 'Naam moet minimaal 2 karakters bevatten').max(100),
  referredEmail: z.string().email('Ongeldig e-mailadres'),
  referredPhone: z.string().optional(),
  referredCompany: z.string().min(2, 'Bedrijfsnaam moet minimaal 2 karakters bevatten').max(100),

  // Additional information
  relationship: z.string().max(200).optional(),
  message: z.string().max(1000).optional(),

  // Honeypot for spam prevention
  honeypot: z.string().optional()
})

interface ServiceResult {
  success: boolean
  error?: string
  type?: string
  contactId?: string
}

/**
 * Handles referral form submissions with multi-service processing.
 *
 * @param {NextRequest} request - The incoming referral form submission request
 * @returns {NextResponse} JSON response with submission status
 * @description Validates referral form, sends email notifications to team and referrer,
 * sends introduction email to referred company, and updates HubSpot CRM
 *
 * @throws {Error} For invalid input or service integration failures
 * @see emailService
 * @see hubspotService
 */
export async function POST(request: NextRequest) {
  try {
    // CSRF Protection
    const csrfResult = checkCSRF(request, {
      allowedOrigins: ['http://localhost:3000', 'https://workflo.nl', 'https://www.workflo.nl']
    })

    if (!csrfResult.valid) {
      console.warn('CSRF validation failed for referral:', csrfResult.error)
      return NextResponse.json(
        {
          success: false,
          error: 'Beveiligingsvalidatie mislukt. Vernieuw de pagina en probeer opnieuw.',
          code: csrfResult.code || 'CSRF_ERROR'
        },
        { status: 403 }
      )
    }

    // Rate limiting check (stricter than contact form to prevent abuse)
    const rateLimitResult = checkRateLimit(request, {
      windowMs: 60 * 60 * 1000, // 1 hour window
      maxRequests: 3 // Max 3 referrals per hour per IP
    }, 'referral')

    if (!rateLimitResult.allowed) {
      console.warn('Rate limit exceeded for referral form')
      return NextResponse.json(
        {
          success: false,
          error: 'Te veel referral aanvragen. Probeer het later opnieuw.',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: rateLimitResult.retryAfter
        },
        {
          status: 429,
          headers: addRateLimitHeaders(rateLimitResult)
        }
      )
    }

    const body = await request.json()

    // Honeypot check
    if (body.honeypot) {
      console.warn('Honeypot triggered on referral form, potential spam:', {
        referrerEmail: body.referrerEmail,
        referredEmail: body.referredEmail
      })
      // Return success to avoid revealing the honeypot
      return NextResponse.json({ success: true })
    }

    // Validate request body with Zod
    const validationResult = referralFormSchema.safeParse(body)

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))

      console.warn('Referral form validation failed:', errors)

      return NextResponse.json(
        {
          success: false,
          error: 'Validatiefout: Controleer of alle velden correct zijn ingevuld.',
          code: 'VALIDATION_ERROR',
          details: errors
        },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    // Additional phone validation if provided
    if (validatedData.referrerPhone && validatedData.referrerPhone.trim()) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/
      if (!phoneRegex.test(validatedData.referrerPhone)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Voer een geldig telefoonnummer in voor verwijzer.',
            code: 'INVALID_REFERRER_PHONE'
          },
          { status: 400 }
        )
      }
    }

    if (validatedData.referredPhone && validatedData.referredPhone.trim()) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/
      if (!phoneRegex.test(validatedData.referredPhone)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Voer een geldig telefoonnummer in voor verwezen bedrijf.',
            code: 'INVALID_REFERRED_PHONE'
          },
          { status: 400 }
        )
      }
    }

    // Sanitize and prepare form data
    const formData: ReferralFormData = {
      referrerName: validatedData.referrerName.trim(),
      referrerEmail: validatedData.referrerEmail.trim().toLowerCase(),
      referrerPhone: validatedData.referrerPhone?.trim() || undefined,
      referrerCompany: validatedData.referrerCompany?.trim() || undefined,
      referredName: validatedData.referredName.trim(),
      referredEmail: validatedData.referredEmail.trim().toLowerCase(),
      referredPhone: validatedData.referredPhone?.trim() || undefined,
      referredCompany: validatedData.referredCompany.trim(),
      relationship: validatedData.relationship?.trim() || undefined,
      message: validatedData.message?.trim() || undefined,
      submittedAt: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || '',
      referrer: request.headers.get('referer') || ''
    }

    // Parallel execution of all email and CRM operations
    const promises: Promise<ServiceResult>[] = []

    // 1. Send notification email to Workflo team
    if (emailService.isAvailable()) {
      promises.push(
        emailService.sendReferralNotification(formData).catch(error => ({
          success: false,
          error: error.message,
          type: 'notification'
        }))
      )

      // 2. Send thank you email to referrer
      promises.push(
        emailService.sendReferralThankYou(formData).catch(error => ({
          success: false,
          error: error.message,
          type: 'thank-you'
        }))
      )

      // 3. Send introduction email to referred company
      promises.push(
        emailService.sendReferralIntroduction(formData).catch(error => ({
          success: false,
          error: error.message,
          type: 'introduction'
        }))
      )
    }

    // 4. Create/update HubSpot contacts for both referrer and referred
    if (hubspotService.isAvailable()) {
      // Create/update referrer contact
      const referrerHubspotData = {
        email: formData.referrerEmail,
        firstname: formData.referrerName.split(' ')[0],
        lastname: formData.referrerName.split(' ').slice(1).join(' ') || undefined,
        company: formData.referrerCompany || undefined,
        phone: formData.referrerPhone || undefined,
        lifecyclestage: 'customer', // Assuming referrer is existing customer
        hs_language: 'nl'
      }

      promises.push(
        hubspotService.createOrUpdateContact(referrerHubspotData).catch(error => ({
          success: false,
          error: error.message,
          type: 'hubspot-referrer'
        }))
      )

      // Create/update referred company contact
      const referredHubspotData = {
        email: formData.referredEmail,
        firstname: formData.referredName.split(' ')[0],
        lastname: formData.referredName.split(' ').slice(1).join(' ') || undefined,
        company: formData.referredCompany,
        phone: formData.referredPhone || undefined,
        lifecyclestage: 'lead',
        lead_source: `Referral - ${formData.referrerName}`,
        hs_language: 'nl'
      }

      promises.push(
        hubspotService.createOrUpdateContact(referredHubspotData).catch(error => ({
          success: false,
          error: error.message,
          type: 'hubspot-referred'
        }))
      )

      // Track referral as engagement
      promises.push(
        hubspotService.trackFormSubmission(formData.referrerEmail, 'referral-form', {
          referred_company: formData.referredCompany,
          referred_contact: formData.referredName,
          referred_email: formData.referredEmail,
          relationship: formData.relationship || 'Not specified',
          source: 'website-referral'
        }).catch(error => ({
          success: false,
          error: error.message,
          type: 'tracking'
        }))
      )
    }

    // Execute all promises in parallel
    const results: ServiceResult[] = await Promise.all(promises)

    // Log results for debugging and monitoring
    console.log('Referral form submission results:', {
      referrerEmail: formData.referrerEmail,
      referredCompany: formData.referredCompany,
      referredEmail: formData.referredEmail,
      results: results.map(r => ({
        success: r.success,
        type: r.type || 'unknown',
        error: r.error
      }))
    })

    // Check if critical operations succeeded
    const notificationResult = results.find(r => r.type === 'notification')
    const emailSuccess = !emailService.isAvailable() || (notificationResult && notificationResult.success)

    if (emailSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Bedankt voor je referral! We nemen binnen 24 uur contact op met het verwezen bedrijf.',
        details: {
          notificationSent: emailService.isAvailable() && notificationResult?.success,
          thankYouSent: emailService.isAvailable() && results.find(r => r.type === 'thank-you')?.success,
          introductionSent: emailService.isAvailable() && results.find(r => r.type === 'introduction')?.success,
          hubspotUpdated: hubspotService.isAvailable() && results.find(r => r.type === 'hubspot-referred')?.success,
          tracked: hubspotService.isAvailable() && results.find(r => r.type === 'tracking')?.success
        }
      }, {
        headers: addRateLimitHeaders(rateLimitResult)
      })
    } else {
      // Log the error but don't expose internal details to user
      console.error('Critical: Referral notification email failed', notificationResult?.error)

      return NextResponse.json(
        {
          success: false,
          error: 'Er ging iets mis bij het verzenden. Neem direct contact met ons op via 020-30 80 465.',
          code: 'EMAIL_SEND_FAILED'
        },
        { status: 500 }
      )
    }

  } catch (error: unknown) {
    console.error('Referral form submission error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Er is een onverwachte fout opgetreden. Probeer het later opnieuw.',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  }
}

/**
 * Provides health check information for the Referral API.
 *
 * @returns {NextResponse} JSON with API status and service availability
 * @description Returns current timestamp and status of integrated services
 */
export async function GET() {
  return NextResponse.json(
    {
      message: 'Referral API is active',
      timestamp: new Date().toISOString(),
      services: {
        email: emailService.isAvailable(),
        hubspot: hubspotService.isAvailable()
      },
      rateLimit: {
        windowMs: 60 * 60 * 1000,
        maxRequests: 3
      }
    },
    { status: 200 }
  )
}

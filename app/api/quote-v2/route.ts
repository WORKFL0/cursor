import { NextRequest, NextResponse } from 'next/server'
import { hubspotService, QuoteRequest } from '@/lib/services/hubspot-service'
import { emailService, QuoteRequestData as EmailQuoteRequestData } from '@/lib/services/email-service'
import { checkRateLimit, defaultRateLimits, addRateLimitHeaders } from '@/lib/middleware/rate-limiter'
import { checkCSRF } from '@/lib/middleware/csrf-protection'
import { quoteRequestSchema, validateSchema, validationError, VALID_SERVICES, VALID_BUDGETS, VALID_TIMELINES } from '@/lib/validations/forms'

interface ServiceResult {
  success: boolean
  error?: string
  type?: string
  fallbackUsed?: boolean
}

/**
 * Quote request endpoint with Zod validation
 *
 * @param {NextRequest} request - The incoming quote request
 * @returns {NextResponse} JSON response with submission status
 * @description Validates quote request using Zod, sends email notifications, updates HubSpot
 */
export async function POST(request: NextRequest) {
  try {
    // CSRF Protection
    const csrfResult = checkCSRF(request, {
      allowedOrigins: ['http://localhost:3000', 'https://workflo.nl', 'https://www.workflo.nl']
    })

    if (!csrfResult.valid) {
      console.warn('Quote CSRF validation failed:', csrfResult.error)
      return NextResponse.json(
        {
          success: false,
          error: 'Beveiligingsvalidatie mislukt. Vernieuw de pagina en probeer opnieuw.',
          code: csrfResult.code || 'CSRF_ERROR'
        },
        { status: 403 }
      )
    }

    // Rate limiting check - stricter for quote requests
    const rateLimitResult = checkRateLimit(request, {
      windowMs: 60 * 1000, // 1 minute
      max: 2 // max 2 requests per minute
    }, 'quote')

    if (!rateLimitResult.allowed) {
      console.warn('Quote request rate limit exceeded')
      return NextResponse.json(
        {
          success: false,
          error: 'Te veel offerteverzoeken. Probeer het over een minuut opnieuw.',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: rateLimitResult.retryAfter
        },
        {
          status: 429,
          headers: addRateLimitHeaders(rateLimitResult)
        }
      )
    }

    // Parse and validate request body with Zod
    const body = await request.json()
    const validation = validateSchema(quoteRequestSchema, body)

    if (!validation.success) {
      return NextResponse.json(
        validationError(validation.errors),
        { status: 400 }
      )
    }

    const formData = validation.data

    // Honeypot check
    if (formData.honeypot) {
      console.warn('Honeypot triggered in quote request:', { email: formData.email, name: formData.name })
      return NextResponse.json({ success: true }) // Return success to avoid revealing honeypot
    }

    // Prepare quote request data for HubSpot
    const quoteRequest: QuoteRequest = {
      name: formData.name,
      email: formData.email,
      company: formData.company,
      phone: formData.phone,
      services: formData.services,
      budget: formData.budget,
      timeline: formData.timeline,
      description: formData.description,
      urgency: formData.urgency
    }

    // Prepare email data
    const emailData: EmailQuoteRequestData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '',
      company: formData.company || '',
      subject: `Offerte verzoek - ${formData.services.join(', ')}`,
      message: formData.description,
      services: formData.services,
      budget: formData.budget,
      timeline: formData.timeline,
      urgency: formData.urgency,
      submittedAt: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || '',
      referrer: request.headers.get('referer') || ''
    }

    // Parallel execution of HubSpot integration and email notifications
    const promises: Promise<ServiceResult>[] = []

    // Submit to HubSpot
    if (hubspotService.isAvailable()) {
      promises.push(
        hubspotService.submitQuoteRequest(quoteRequest).then(result => ({
          ...result,
          type: 'hubspot'
        })).catch(error => ({
          success: false,
          error: error.message,
          type: 'hubspot',
          fallbackUsed: true
        }))
      )
    }

    // Send notification email to Workflo team
    if (emailService.isAvailable()) {
      promises.push(
        emailService.sendQuoteRequestNotification(emailData).then(result => ({
          ...result,
          type: 'notification'
        }))
      )

      // Send confirmation email to user
      promises.push(
        emailService.sendQuoteRequestConfirmation(emailData).then(result => ({
          ...result,
          type: 'confirmation'
        }))
      )
    }

    // Execute all promises
    const results = await Promise.all(promises)

    // Log results for debugging
    console.log('Quote request submission results:', {
      email: quoteRequest.email,
      services: quoteRequest.services,
      urgency: quoteRequest.urgency,
      results: results.map(r => ({
        success: r.success,
        type: r.type || 'unknown',
        error: r.error,
        fallbackUsed: r.fallbackUsed
      }))
    })

    // Check if at least email notification was sent OR HubSpot was successful
    const notificationResult = results.find(r => r.type === 'notification')
    const hubspotResult = results.find(r => r.type === 'hubspot')
    const emailSuccess = !emailService.isAvailable() || (notificationResult && notificationResult.success)
    const hubspotSuccess = !hubspotService.isAvailable() || (hubspotResult && hubspotResult.success)

    if (emailSuccess || hubspotSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Offerteverzoek succesvol verzonden. We nemen binnen 24 uur contact met je op met een gepersonaliseerde offerte.',
        details: {
          emailSent: emailService.isAvailable() && notificationResult?.success,
          confirmationSent: emailService.isAvailable() && results.find(r => r.type === 'confirmation')?.success,
          hubspotSubmitted: hubspotService.isAvailable() && hubspotResult?.success,
          fallbackUsed: hubspotResult?.fallbackUsed || false,
          urgency: formData.urgency
        }
      }, {
        headers: addRateLimitHeaders(rateLimitResult)
      })
    } else {
      // Both systems failed
      console.error('Critical: Quote request failed on all systems', {
        email: notificationResult?.error,
        hubspot: hubspotResult?.error
      })

      return NextResponse.json(
        {
          success: false,
          error: 'Er ging iets mis bij het verzenden. Neem direct contact met ons op via 020-30 80 465 of info@workflo.nl.',
          code: 'SUBMISSION_FAILED'
        },
        { status: 500 }
      )
    }

  } catch (error: unknown) {
    console.error('Quote request submission error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Er is een onverwachte fout opgetreden. Probeer het later opnieuw.',
        code: 'INTERNAL_ERROR',
        details: error instanceof Error ? { message: error.message } : undefined
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint returns valid options for the quote form
 */
export async function GET() {
  return NextResponse.json(
    {
      message: 'Quote API (v2 with Zod validation) is active',
      timestamp: new Date().toISOString(),
      services: {
        email: emailService.isAvailable(),
        hubspot: hubspotService.isAvailable()
      },
      validation: {
        schema: 'Zod',
        features: ['honeypot', 'rate-limiting', 'CSRF protection', 'urgency levels', 'retry logic']
      },
      formOptions: {
        validServices: VALID_SERVICES,
        validBudgets: VALID_BUDGETS,
        validTimelines: VALID_TIMELINES,
        urgencyLevels: ['low', 'medium', 'high']
      }
    },
    { status: 200 }
  )
}

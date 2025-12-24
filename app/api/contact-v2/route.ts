import { NextRequest, NextResponse } from 'next/server'
import { emailService, ContactFormData as EmailContactFormData } from '@/lib/services/email-service'
import { hubspotService } from '@/lib/services/hubspot-service'
import { checkRateLimit, defaultRateLimits, addRateLimitHeaders } from '@/lib/middleware/rate-limiter'
import { checkCSRF } from '@/lib/middleware/csrf-protection'
import { contactFormSchema, validateSchema, validationError } from '@/lib/validations/forms'

interface ServiceResult {
  success: boolean
  error?: string
  type?: string
}

/**
 * Handles contact form submissions with Zod validation and multi-service processing.
 *
 * @param {NextRequest} request - The incoming contact form submission request
 * @returns {NextResponse} JSON response with submission status
 * @description Validates contact form using Zod, sends email notifications, updates HubSpot, and handles rate limiting
 *
 * @throws {Error} For invalid input or service integration failures
 * @see emailService
 * @see hubspotService
 * @see contactFormSchema
 */
export async function POST(request: NextRequest) {
  try {
    // CSRF Protection
    const csrfResult = checkCSRF(request, {
      allowedOrigins: ['http://localhost:3000', 'https://workflo.nl', 'https://www.workflo.nl', 'https://workflo.it', 'https://www.workflo.it']
    })

    if (!csrfResult.valid) {
      console.warn('CSRF validation failed:', csrfResult.error)
      return NextResponse.json(
        {
          success: false,
          error: 'Beveiligingsvalidatie mislukt. Vernieuw de pagina en probeer opnieuw.',
          code: csrfResult.code || 'CSRF_ERROR'
        },
        { status: 403 }
      )
    }

    // Rate limiting check
    const rateLimitResult = checkRateLimit(request, defaultRateLimits.contact, 'contact')

    if (!rateLimitResult.allowed) {
      console.warn('Rate limit exceeded for contact form')
      return NextResponse.json(
        {
          success: false,
          error: 'Te veel verzoeken. Probeer het over een minuut opnieuw.',
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
    const validation = validateSchema(contactFormSchema, body)

    if (!validation.success) {
      return NextResponse.json(
        validationError(validation.errors),
        { status: 400 }
      )
    }

    const formData = validation.data

    // Honeypot check
    if (formData.honeypot) {
      console.warn('Honeypot triggered, potential spam:', { email: formData.email, name: formData.name })
      // Return success to avoid revealing the honeypot
      return NextResponse.json({ success: true })
    }

    // Prepare email form data
    const emailFormData: EmailContactFormData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '',
      company: formData.company || '',
      subject: formData.subject,
      message: formData.message,
      services: formData.services || [],
      submittedAt: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || '',
      referrer: request.headers.get('referer') || ''
    }

    // Parallel execution of email sending and HubSpot integration
    const promises: Promise<ServiceResult>[] = []

    // Send notification email to Workflo team
    if (emailService.isAvailable()) {
      promises.push(
        emailService.sendContactFormNotification(emailFormData).then(result => ({
          ...result,
          type: 'notification'
        }))
      )

      // Send confirmation email to user
      promises.push(
        emailService.sendContactFormConfirmation(emailFormData).then(result => ({
          ...result,
          type: 'confirmation'
        }))
      )
    }

    // Create/update HubSpot contact
    if (hubspotService.isAvailable()) {
      const hubspotData = {
        email: emailFormData.email,
        firstname: emailFormData.name.split(' ')[0],
        lastname: emailFormData.name.split(' ').slice(1).join(' ') || undefined,
        company: emailFormData.company || undefined,
        phone: emailFormData.phone || undefined,
        lifecyclestage: 'lead',
        lead_source: 'Website Contact Form',
        hs_language: 'nl'
      }

      promises.push(
        hubspotService.createOrUpdateContact(hubspotData).then(result => ({
          ...result,
          type: 'hubspot'
        })).catch(error => ({
          success: false,
          error: error.message,
          type: 'hubspot'
        }))
      )

      // Track form submission
      promises.push(
        hubspotService.trackFormSubmission(emailFormData.email, 'contact-form', {
          subject: emailFormData.subject,
          services: emailFormData.services,
          source: 'website'
        }).then(result => ({
          ...result,
          type: 'tracking'
        })).catch(error => ({
          success: false,
          error: error.message,
          type: 'tracking'
        }))
      )
    }

    // Execute all promises
    const results: ServiceResult[] = await Promise.all(promises)

    // Log results for debugging
    console.log('Contact form submission results:', {
      email: emailFormData.email,
      subject: emailFormData.subject,
      results: results.map(r => ({ success: r.success, type: r.type || 'unknown', error: r.error }))
    })

    // DEBUG LOGGING
    try {
      const fs = require('fs');
      const path = require('path');
      const logPath = '/Users/florian/.gemini/antigravity/brain/2d275344-298b-4ec0-b294-4174c24b8d66/api_error.log';

      results.forEach(result => {
        if (!result.success && result.error) {
          fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${result.type} failed: ${JSON.stringify(result.error)}\n`);
        }
      });

      if (!emailService.isAvailable()) {
        fs.appendFileSync(logPath, `[${new Date().toISOString()}] Email service not available\n`);
      }
      if (!hubspotService.isAvailable()) {
        fs.appendFileSync(logPath, `[${new Date().toISOString()}] HubSpot service not available\n`);
      }
    } catch (e) { console.error('Failed to write log', e) }

    // Check if at least email notification was sent OR HubSpot was updated
    const notificationResult = results.find(r => r.type === 'notification')
    const emailSuccess = !emailService.isAvailable() || (notificationResult && notificationResult.success)
    const hubspotResult = results.find(r => r.type === 'hubspot')
    const hubspotSuccess = !hubspotService.isAvailable() || (hubspotResult && hubspotResult.success)

    if (emailSuccess || hubspotSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Bericht succesvol verzonden. We nemen binnen 24 uur contact met je op.',
        details: {
          emailSent: emailService.isAvailable() && notificationResult?.success,
          confirmationSent: emailService.isAvailable() && results.find(r => r.type === 'confirmation')?.success,
          hubspotUpdated: hubspotService.isAvailable() && hubspotResult?.success,
          tracked: hubspotService.isAvailable() && results.find(r => r.type === 'tracking')?.success
        }
      }, {
        headers: addRateLimitHeaders(rateLimitResult)
      })
    } else {
      // Log the error but don't expose internal details to user
      console.error('Critical: Contact form notification failed', notificationResult?.error)

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
    console.error('Contact form submission error:', error)

    // DEBUG LOGGING
    try {
      const fs = require('fs');
      const path = require('path');
      const logPath = '/Users/florian/.gemini/antigravity/brain/2d275344-298b-4ec0-b294-4174c24b8d66/api_error.log';
      fs.appendFileSync(logPath, `[${new Date().toISOString()}] Catch error: ${error instanceof Error ? error.message : String(error)}\nStack: ${error instanceof Error ? error.stack : ''}\n`);
    } catch (e) { console.error('Failed to write log', e) }

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
 * Provides health check information for the Contact API.
 *
 * @returns {NextResponse} JSON with API status and service availability
 * @description Returns current timestamp and status of integrated services
 */
export async function GET() {
  return NextResponse.json(
    {
      message: 'Contact API (v2 with Zod validation) is active',
      timestamp: new Date().toISOString(),
      services: {
        email: emailService.isAvailable(),
        hubspot: hubspotService.isAvailable()
      },
      validation: {
        schema: 'Zod',
        features: ['honeypot', 'rate-limiting', 'CSRF protection', 'retry logic']
      }
    },
    { status: 200 }
  )
}

import { NextRequest, NextResponse } from 'next/server'
import { emailService, ContactFormData } from '@/lib/services/email-service'
import { hubspotService } from '@/lib/services/hubspot-service'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 5 // 5 requests per minute per IP

interface ServiceResult {
  success: boolean;
  error?: string;
  type?: string;
}

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return `contact:${ip}`
}

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(key)
  
  if (!entry || now - entry.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(key, { count: 1, timestamp: now })
    return false
  }
  
  if (entry.count >= RATE_LIMIT_MAX) {
    return true
  }
  
  entry.count++
  return false
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const rateLimitKey = getRateLimitKey(request)
    if (isRateLimited(rateLimitKey)) {
      console.warn('Rate limit exceeded for:', rateLimitKey)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Te veel verzoeken. Probeer het over een minuut opnieuw.',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    const { name, email, subject, message, honeypot } = body
    
    // Honeypot check
    if (honeypot) {
      console.warn('Honeypot triggered, potential spam:', { email, name })
      // Return success to avoid revealing the honeypot
      return NextResponse.json({ success: true })
    }
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Alle verplichte velden moeten worden ingevuld.',
          code: 'MISSING_REQUIRED_FIELDS'
        },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Voer een geldig e-mailadres in.',
          code: 'INVALID_EMAIL'
        },
        { status: 400 }
      )
    }

    // Phone validation (if provided)
    if (body.phone && body.phone.trim()) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/
      if (!phoneRegex.test(body.phone)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Voer een geldig telefoonnummer in.',
            code: 'INVALID_PHONE'
          },
          { status: 400 }
        )
      }
    }

    // Message length validation
    if (message.length < 10) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Het bericht moet minimaal 10 karakters bevatten.',
          code: 'MESSAGE_TOO_SHORT'
        },
        { status: 400 }
      )
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Het bericht mag maximaal 2000 karakters bevatten.',
          code: 'MESSAGE_TOO_LONG'
        },
        { status: 400 }
      )
    }

    // Prepare form data
    const formData: ContactFormData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: body.phone?.trim() || '',
      company: body.company?.trim() || '',
      subject: subject.trim(),
      message: message.trim(),
      services: body.services || [],
      submittedAt: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || '',
      referrer: request.headers.get('referer') || ''
    }

    // Parallel execution of email sending and HubSpot integration
    const promises = []
    
    // Send notification email to Workflo team
    if (emailService.isAvailable()) {
      promises.push(
        emailService.sendContactFormNotification(formData).catch(error => ({
          success: false,
          error: error.message,
          type: 'notification'
        }))
      )
      
      // Send confirmation email to user
      promises.push(
        emailService.sendContactFormConfirmation(formData).catch(error => ({
          success: false,
          error: error.message,
          type: 'confirmation'
        }))
      )
    }

    // Create/update HubSpot contact
    if (hubspotService.isAvailable()) {
      const hubspotData = {
        email: formData.email,
        firstname: formData.name.split(' ')[0],
        lastname: formData.name.split(' ').slice(1).join(' ') || undefined,
        company: formData.company || undefined,
        phone: formData.phone || undefined,
        lifecyclestage: 'lead',
        lead_source: 'Website Contact Form',
        hs_language: 'nl'
      }

      promises.push(
        hubspotService.createOrUpdateContact(hubspotData).catch(error => ({
          success: false,
          error: error.message,
          type: 'hubspot'
        }))
      )

      // Track form submission
      promises.push(
        hubspotService.trackFormSubmission(formData.email, 'contact-form', {
          subject: formData.subject,
          services: formData.services,
          source: 'website'
        }).catch(error => ({
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
      email: formData.email,
      subject: formData.subject,
      results: results.map(r => ({ success: r.success, type: r.type || 'unknown', error: r.error }))
    })

    // Check if at least email notification was sent
    const notificationResult = results.find(r => r.type === 'notification')
    const emailSuccess = !emailService.isAvailable() || (notificationResult && notificationResult.success)

    if (emailSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Bericht succesvol verzonden. We nemen binnen 24 uur contact met je op.',
        details: {
          emailSent: emailService.isAvailable() && notificationResult?.success,
          confirmationSent: emailService.isAvailable() && results.find(r => r.type === 'confirmation')?.success,
          hubspotUpdated: hubspotService.isAvailable() && results.find(r => r.type === 'hubspot')?.success,
          tracked: hubspotService.isAvailable() && results.find(r => r.type === 'tracking')?.success
        }
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

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Contact API is active',
      timestamp: new Date().toISOString(),
      services: {
        email: emailService.isAvailable(),
        hubspot: hubspotService.isAvailable()
      }
    },
    { status: 200 }
  )
}
import { NextRequest, NextResponse } from 'next/server'
import { hubspotService, QuoteRequest } from '@/lib/services/hubspot-service'
import { emailService } from '@/lib/services/email-service'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 2 // 2 quote requests per minute per IP

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return `quote:${ip}`
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
      console.warn('Quote request rate limit exceeded for:', rateLimitKey)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Te veel offerteverzoeken. Probeer het over een minuut opnieuw.',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    const { name, email, services, description, honeypot } = body
    
    // Honeypot check
    if (honeypot) {
      console.warn('Honeypot triggered in quote request:', { email, name })
      return NextResponse.json({ success: true }) // Return success to avoid revealing honeypot
    }
    
    if (!name || !email || !services || !Array.isArray(services) || services.length === 0 || !description) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Naam, e-mail, diensten en beschrijving zijn verplicht.',
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

    // Description validation
    if (description.length < 20) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'De beschrijving moet minimaal 20 karakters bevatten.',
          code: 'DESCRIPTION_TOO_SHORT'
        },
        { status: 400 }
      )
    }

    if (description.length > 1500) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'De beschrijving mag maximaal 1500 karakters bevatten.',
          code: 'DESCRIPTION_TOO_LONG'
        },
        { status: 400 }
      )
    }

    // Services validation
    const validServices = [
      'IT Beheer & Support',
      'Microsoft 365',
      'Cybersecurity',
      'Cloud Migratie',
      'IT Consultancy',
      'Backup & Herstel',
      'Hardware & Software',
      'Compliance & AVG',
      'Anders'
    ]

    const invalidServices = services.filter(service => !validServices.includes(service))
    if (invalidServices.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Een of meer geselecteerde diensten zijn ongeldig.',
          code: 'INVALID_SERVICES'
        },
        { status: 400 }
      )
    }

    // Budget validation (if provided)
    const validBudgets = ['< €5.000', '€5.000 - €15.000', '€15.000 - €50.000', '> €50.000', 'Nog niet bepaald']
    if (body.budget && !validBudgets.includes(body.budget)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Geselecteerd budget is ongeldig.',
          code: 'INVALID_BUDGET'
        },
        { status: 400 }
      )
    }

    // Timeline validation (if provided)
    const validTimelines = ['Direct', '1-3 maanden', '3-6 maanden', '6+ maanden', 'Nog niet bepaald']
    if (body.timeline && !validTimelines.includes(body.timeline)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Geselecteerde timeline is ongeldig.',
          code: 'INVALID_TIMELINE'
        },
        { status: 400 }
      )
    }

    // Prepare quote request data
    const quoteRequest: QuoteRequest = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: body.company?.trim() || undefined,
      phone: body.phone?.trim() || undefined,
      services: services,
      budget: body.budget || undefined,
      timeline: body.timeline || undefined,
      description: description.trim(),
      urgency: body.urgency || 'medium'
    }

    // Parallel execution of HubSpot integration and email notifications
    const promises: Promise<any>[] = []
    
    // Submit to HubSpot
    if (hubspotService.isAvailable()) {
      promises.push(
        hubspotService.submitQuoteRequest(quoteRequest).catch(error => ({
          success: false,
          error: error.message,
          type: 'hubspot',
          fallbackUsed: true
        }))
      )
    }

    // Send notification email to Workflo team
    if (emailService.isAvailable()) {
      const emailData = {
        name: quoteRequest.name,
        email: quoteRequest.email,
        phone: quoteRequest.phone || '',
        company: quoteRequest.company || '',
        subject: `Offerte verzoek - ${services.join(', ')}`,
        message: quoteRequest.description,
        services: quoteRequest.services,
        submittedAt: new Date().toISOString(),
        userAgent: request.headers.get('user-agent') || '',
        referrer: request.headers.get('referer') || ''
      }

      promises.push(
        emailService.sendQuoteRequestNotification({
          ...emailData,
          budget: quoteRequest.budget,
          timeline: quoteRequest.timeline,
          urgency: quoteRequest.urgency
        }).catch(error => ({
          success: false,
          error: error.message,
          type: 'notification'
        }))
      )
      
      // Send confirmation email to user
      promises.push(
        emailService.sendQuoteRequestConfirmation(emailData).catch(error => ({
          success: false,
          error: error.message,
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
          fallbackUsed: hubspotResult?.fallbackUsed || false
        }
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
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Quote API is active',
      timestamp: new Date().toISOString(),
      services: {
        email: emailService.isAvailable(),
        hubspot: hubspotService.isAvailable()
      },
      validServices: [
        'IT Beheer & Support',
        'Microsoft 365',
        'Cybersecurity',
        'Cloud Migratie',
        'IT Consultancy',
        'Backup & Herstel',
        'Hardware & Software',
        'Compliance & AVG',
        'Anders'
      ],
      validBudgets: ['< €5.000', '€5.000 - €15.000', '€15.000 - €50.000', '> €50.000', 'Nog niet bepaald'],
      validTimelines: ['Direct', '1-3 maanden', '3-6 maanden', '6+ maanden', 'Nog niet bepaald']
    },
    { status: 200 }
  )
}
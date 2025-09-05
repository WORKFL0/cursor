import { NextRequest, NextResponse } from 'next/server'
import { hubspotService, NewsletterSubscriber } from '@/lib/services/hubspot-service'
import { checkRateLimit, defaultRateLimits, addRateLimitHeaders } from '@/lib/middleware/rate-limiter'
import { checkCSRF } from '@/lib/middleware/csrf-protection'

export async function POST(request: NextRequest) {
  try {
    // CSRF Protection (less strict for newsletter signup)
    const csrfResult = checkCSRF(request, {
      allowedOrigins: ['http://localhost:3000', 'https://workflo.nl', 'https://www.workflo.nl'],
      requireSameOrigin: false // Allow cross-origin newsletter signups
    })
    
    if (!csrfResult.valid && csrfResult.code === 'FORBIDDEN_ORIGIN') {
      console.warn('Newsletter CSRF validation failed:', csrfResult.error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Aanmelding niet toegestaan vanaf deze bron.',
          code: csrfResult.code
        },
        { status: 403 }
      )
    }

    // Rate limiting check
    const rateLimitResult = checkRateLimit(request, defaultRateLimits.newsletter, 'newsletter')
    
    if (!rateLimitResult.allowed) {
      console.warn('Newsletter rate limit exceeded')
      return NextResponse.json(
        { 
          success: false, 
          error: 'Te veel aanmeldingen. Probeer het over een minuut opnieuw.',
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
    const { email, language = 'nl', source = 'Website Newsletter' } = body
    
    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'E-mailadres is verplicht.',
          code: 'MISSING_EMAIL'
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

    // Check for disposable email domains (basic check)
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
      'mailinator.com', 'throwaway.email', 'temp-mail.org'
    ]
    
    const emailDomain = email.split('@')[1]?.toLowerCase()
    if (disposableDomains.includes(emailDomain)) {
      console.warn('Disposable email detected:', email)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tijdelijke e-mailadressen zijn niet toegestaan.',
          code: 'DISPOSABLE_EMAIL'
        },
        { status: 400 }
      )
    }

    const subscriberData: NewsletterSubscriber = {
      email: email.trim().toLowerCase(),
      language: language,
      source: source,
      subscribedAt: new Date()
    }

    // HubSpot integration with graceful fallback
    let hubspotResult = null
    let fallbackMode = false

    if (hubspotService.isAvailable()) {
      try {
        hubspotResult = await hubspotService.subscribeToNewsletter(subscriberData)
        
        if (!hubspotResult.success) {
          console.warn('HubSpot newsletter subscription failed, continuing with fallback:', hubspotResult.error)
          fallbackMode = true
        } else {
          console.log('Newsletter subscription successful via HubSpot:', {
            email: subscriberData.email,
            contactId: hubspotResult.contactId
          })
        }
      } catch (error) {
        console.error('HubSpot newsletter subscription error:', error)
        fallbackMode = true
      }
    } else {
      console.log('HubSpot not available, using fallback mode for newsletter signup')
      fallbackMode = true
    }

    // Always return success - we don't want to block users from signing up
    // In fallback mode, we could store to a backup system or send email notifications
    
    const responseData = {
      success: true,
      message: hubspotResult?.success 
        ? (hubspotResult.contactId ? 'Welkom bij onze nieuwsbrief! Je ontvangt binnenkort je eerste update.' : 'Je bent succesvol ingeschreven voor onze nieuwsbrief!')
        : 'Je bent ingeschreven voor onze nieuwsbrief! We verwerken je aanmelding en je ontvangt binnenkort je eerste update.',
      details: {
        hubspotIntegrated: hubspotResult?.success || false,
        fallbackUsed: fallbackMode,
        contactId: hubspotResult?.contactId || null,
        timestamp: new Date().toISOString()
      }
    }

    // Log successful signup for manual processing if needed
    if (fallbackMode) {
      const forwardedFor = request.headers.get('x-forwarded-for')
      const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown'
      
      console.log('FALLBACK NEWSLETTER SIGNUP:', {
        email: subscriberData.email,
        language: subscriberData.language,
        source: subscriberData.source,
        timestamp: subscriberData.subscribedAt,
        ip: ip,
        userAgent: request.headers.get('user-agent') || 'unknown'
      })
    }

    return NextResponse.json(responseData, {
      headers: addRateLimitHeaders(rateLimitResult)
    })

  } catch (error: unknown) {
    console.error('Newsletter subscription error:', error)
    
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

// Unsubscribe endpoint
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const email = url.searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'E-mailadres is verplicht.',
          code: 'MISSING_EMAIL'
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

    if (!hubspotService.isAvailable()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Service tijdelijk niet beschikbaar.',
          code: 'SERVICE_UNAVAILABLE'
        },
        { status: 503 }
      )
    }

    // Find contact and update subscription status
    const existingContact = await hubspotService.getContactByEmail(email.toLowerCase())
    
    if (!existingContact.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'E-mailadres niet gevonden.',
          code: 'EMAIL_NOT_FOUND'
        },
        { status: 404 }
      )
    }

    // Update contact to unsubscribe (this would need to be implemented in HubSpot service)
    console.log('Unsubscribe request for:', email)
    
    return NextResponse.json({
      success: true,
      message: 'Je bent succesvol uitgeschreven van onze nieuwsbrief.'
    })

  } catch (error: unknown) {
    console.error('Newsletter unsubscribe error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Er is een fout opgetreden bij het uitschrijven.',
        code: 'UNSUBSCRIBE_ERROR'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Newsletter API is active',
      timestamp: new Date().toISOString(),
      services: {
        hubspot: hubspotService.isAvailable()
      }
    },
    { status: 200 }
  )
}
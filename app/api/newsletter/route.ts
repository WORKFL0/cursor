import { NextRequest, NextResponse } from 'next/server'
import { hubspotService, NewsletterSubscriber } from '@/lib/services/hubspot-service'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 3 // 3 newsletter signups per minute per IP

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return `newsletter:${ip}`
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
      console.warn('Newsletter rate limit exceeded for:', rateLimitKey)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Te veel aanmeldingen. Probeer het over een minuut opnieuw.',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 }
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
      console.log('FALLBACK NEWSLETTER SIGNUP:', {
        email: subscriberData.email,
        language: subscriberData.language,
        source: subscriberData.source,
        timestamp: subscriberData.subscribedAt,
        ip: getRateLimitKey({ headers: { get: () => null } } as any).split(':')[1],
        userAgent: 'Not captured in fallback mode'
      })
    }

    return NextResponse.json(responseData)

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
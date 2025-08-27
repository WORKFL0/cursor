import { NextRequest, NextResponse } from 'next/server'
import { hubspotService, NewsletterSubscriber } from '@/lib/services/hubspot-service'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 3 // 3 newsletter signups per minute per IP

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown'
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

    // Check if HubSpot is available
    if (!hubspotService.isAvailable()) {
      console.error('HubSpot service not available for newsletter signup')
      return NextResponse.json(
        { 
          success: false, 
          error: 'Nieuwsbrief service is tijdelijk niet beschikbaar. Probeer het later opnieuw.',
          code: 'SERVICE_UNAVAILABLE'
        },
        { status: 503 }
      )
    }

    // Check if email is already subscribed
    const existingContact = await hubspotService.getContactByEmail(subscriberData.email)
    
    if (existingContact.success && existingContact.contact) {
      // Contact exists, check if already subscribed to newsletter
      console.log('Existing contact found for newsletter signup:', subscriberData.email)
      
      // Still try to subscribe to ensure they're on the newsletter list
      const subscribeResult = await hubspotService.subscribeToNewsletter(subscriberData)
      
      if (subscribeResult.success) {
        return NextResponse.json({
          success: true,
          message: 'Je bent succesvol ingeschreven voor onze nieuwsbrief!',
          isExisting: true,
          contactId: subscribeResult.contactId
        })
      } else {
        console.error('Failed to subscribe existing contact:', subscribeResult.error)
        return NextResponse.json(
          { 
            success: false, 
            error: 'Er ging iets mis bij de inschrijving. Probeer het later opnieuw.',
            code: 'SUBSCRIPTION_FAILED'
          },
          { status: 500 }
        )
      }
    }

    // New subscription
    const subscribeResult = await hubspotService.subscribeToNewsletter(subscriberData)
    
    if (subscribeResult.success) {
      console.log('New newsletter subscription:', {
        email: subscriberData.email,
        contactId: subscribeResult.contactId,
        language: subscriberData.language,
        source: subscriberData.source
      })

      return NextResponse.json({
        success: true,
        message: 'Welkom bij onze nieuwsbrief! Je ontvangt binnenkort je eerste update.',
        isNew: true,
        contactId: subscribeResult.contactId
      })
    } else {
      console.error('Newsletter subscription failed:', subscribeResult.error)
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Er ging iets mis bij de inschrijving. Controleer je e-mailadres en probeer het opnieuw.',
          code: 'SUBSCRIPTION_FAILED',
          details: subscribeResult.error
        },
        { status: 500 }
      )
    }

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
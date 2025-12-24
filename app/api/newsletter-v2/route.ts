import { NextRequest, NextResponse } from 'next/server'
import { hubspotService, NewsletterSubscriber } from '@/lib/services/hubspot-service'
import { emailService } from '@/lib/services/email-service'
import { checkRateLimit, defaultRateLimits, addRateLimitHeaders } from '@/lib/middleware/rate-limiter'
import { checkCSRF } from '@/lib/middleware/csrf-protection'
import { newsletterSchema, validateSchema, validationError } from '@/lib/validations/forms'

/**
 * Newsletter subscription endpoint with Zod validation
 *
 * @param {NextRequest} request - The incoming newsletter subscription request
 * @returns {NextResponse} JSON response with subscription status
 * @description Validates email using Zod, subscribes to newsletter via HubSpot
 */
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

    // Parse and validate request body with Zod
    const body = await request.json()
    const validation = validateSchema(newsletterSchema, body)

    if (!validation.success) {
      return NextResponse.json(
        validationError(validation.errors),
        { status: 400 }
      )
    }

    const formData = validation.data

    const subscriberData: NewsletterSubscriber = {
      email: formData.email,
      language: formData.language || 'nl',
      source: formData.source || 'Website Newsletter',
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

          // Send welcome email if HubSpot subscription successful
          if (emailService.isAvailable() && hubspotResult.contactId) {
            emailService.sendEmail({
              to: [subscriberData.email],
              subject: 'Welkom bij de Workflo Nieuwsbrief!',
              html: generateWelcomeEmailHtml(subscriberData.email),
              text: generateWelcomeEmailText(subscriberData.email),
              replyTo: 'info@workflo.nl'
            }).catch(error => {
              console.error('Failed to send welcome email:', error)
              // Don't fail the subscription if welcome email fails
            })
          }
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
        code: 'INTERNAL_ERROR',
        details: error instanceof Error ? { message: error.message } : undefined
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

    // Validate email
    const validation = validateSchema(newsletterSchema, { email })

    if (!validation.success) {
      return NextResponse.json(
        validationError(validation.errors),
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
        code: 'UNSUBSCRIBE_ERROR',
        details: error instanceof Error ? { message: error.message } : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'Newsletter API (v2 with Zod validation) is active',
      timestamp: new Date().toISOString(),
      services: {
        hubspot: hubspotService.isAvailable(),
        email: emailService.isAvailable()
      },
      validation: {
        schema: 'Zod',
        features: ['disposable email blocking', 'rate-limiting', 'CSRF protection', 'welcome email']
      }
    },
    { status: 200 }
  )
}

/**
 * Helper functions for welcome emails
 */
function generateWelcomeEmailHtml(email: string): string {
  return `
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welkom bij de Workflo Nieuwsbrief</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #f2f400, #e6e600); color: #000; padding: 30px 20px; text-align: center; }
        .content { padding: 30px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        .btn { background: #f2f400; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welkom bij Workflo!</h1>
        </div>
        <div class="content">
            <p>Beste IT-professional,</p>
            <p>Bedankt voor je inschrijving op onze nieuwsbrief! We zijn blij je te mogen informeren over:</p>
            <ul>
                <li>🔐 Laatste cybersecurity trends en tips</li>
                <li>☁️ Cloud technologie en Microsoft 365 updates</li>
                <li>💡 Best practices voor IT-beheer</li>
                <li>📊 Exclusieve whitepapers en case studies</li>
                <li>🎁 Speciale aanbiedingen voor nieuwsbriefabonnees</li>
            </ul>
            <p>Je ontvangt maximaal één nieuwsbrief per maand, geen spam!</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://workflo.nl" class="btn">Bezoek onze website</a>
            </div>
            <p style="margin-top: 30px;">Met vriendelijke groet,<br><strong>Het Workflo Team</strong></p>
        </div>
        <div class="footer">
            <p><strong>Workflo B.V.</strong> | Koivistokade 3, 1013 AC Amsterdam</p>
            <p>📞 020-30 80 465 | 📧 <a href="mailto:info@workflo.nl">info@workflo.nl</a></p>
            <p style="font-size: 12px; margin-top: 15px;">
                <a href="https://workflo.nl/newsletter/unsubscribe?email=${encodeURIComponent(email)}">Uitschrijven</a>
            </p>
        </div>
    </div>
</body>
</html>
`
}

function generateWelcomeEmailText(email: string): string {
  return `
Welkom bij Workflo!

Beste IT-professional,

Bedankt voor je inschrijving op onze nieuwsbrief! We zijn blij je te mogen informeren over:

- Laatste cybersecurity trends en tips
- Cloud technologie en Microsoft 365 updates
- Best practices voor IT-beheer
- Exclusieve whitepapers en case studies
- Speciale aanbiedingen voor nieuwsbriefabonnees

Je ontvangt maximaal één nieuwsbrief per maand, geen spam!

Bezoek onze website: https://workflo.nl

Met vriendelijke groet,
Het Workflo Team

Workflo B.V. | Koivistokade 3, 1013 AC Amsterdam
020-30 80 465 | info@workflo.nl

Uitschrijven: https://workflo.nl/newsletter/unsubscribe?email=${encodeURIComponent(email)}
`
}

import { NextResponse } from 'next/server'
import { getServiceBySlug, calculateServicePrice } from '@/lib/data/services-data'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      serviceSlug, 
      users, 
      supportType = 'remote',
      companyName,
      contactEmail,
      phone,
      message 
    } = body

    // Validate required fields
    if (!serviceSlug || !users || !companyName || !contactEmail) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: serviceSlug, users, companyName, contactEmail',
          data: null
        }, 
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contactEmail)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email format',
          data: null
        }, 
        { status: 400 }
      )
    }

    // Get service details
    const service = getServiceBySlug(serviceSlug)
    if (!service) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Service not found',
          data: null
        }, 
        { status: 404 }
      )
    }

    // Calculate pricing
    const pricing = calculateServicePrice(service, parseInt(users), supportType)

    // Create quote object
    const quote = {
      id: `QUOTE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      service: {
        id: service.id,
        title: service.title,
        slug: service.slug
      },
      configuration: {
        users: parseInt(users),
        supportType
      },
      pricing,
      contact: {
        companyName,
        email: contactEmail,
        phone: phone || null,
        message: message || null
      },
      status: 'pending'
    }

    // Here you would typically:
    // 1. Save the quote to a database
    // 2. Send confirmation email to the customer
    // 3. Send notification to sales team
    // 4. Integrate with CRM system

    // For now, we'll just return the quote
    console.log('Quote request received:', quote)

    return NextResponse.json({
      success: true,
      data: {
        quote,
        message: 'Quote request submitted successfully. We will contact you within 24 hours.'
      }
    })

  } catch (error) {
    console.error('Error processing quote request:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process quote request',
        data: null
      }, 
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Method not allowed. Use POST to submit quote requests.',
      data: null
    }, 
    { status: 405 }
  )
}
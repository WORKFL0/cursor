import { NextRequest, NextResponse } from 'next/server'
import { generateSimpleCSRFToken, createCSRFHeaders } from '@/lib/middleware/csrf-protection'
import { checkRateLimit, defaultRateLimits, addRateLimitHeaders } from '@/lib/middleware/rate-limiter'

/**
 * Generate and return a CSRF token for form protection
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limit CSRF token requests to prevent abuse
    const rateLimitResult = checkRateLimit(request, {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10 // 10 tokens per minute per client
    }, 'csrf')
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many token requests. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: rateLimitResult.retryAfter
        },
        { 
          status: 429,
          headers: addRateLimitHeaders(rateLimitResult)
        }
      )
    }

    // Generate CSRF token
    const token = generateSimpleCSRFToken()
    const csrfHeaders = createCSRFHeaders(token)
    
    // Combine headers
    const responseHeaders = {
      ...addRateLimitHeaders(rateLimitResult),
      ...csrfHeaders,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    }

    return NextResponse.json(
      { 
        success: true,
        token,
        expiresIn: 3600, // 1 hour
        timestamp: new Date().toISOString()
      },
      { headers: responseHeaders }
    )

  } catch (error: unknown) {
    console.error('CSRF token generation error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate security token.',
        code: 'TOKEN_GENERATION_ERROR'
      },
      { status: 500 }
    )
  }
}

/**
 * Validate an existing CSRF token
 */
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = checkRateLimit(request, {
      windowMs: 60 * 1000, // 1 minute  
      maxRequests: 20 // 20 validations per minute
    }, 'csrf-validate')
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many validation requests.',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { 
          status: 429,
          headers: addRateLimitHeaders(rateLimitResult)
        }
      )
    }

    const body = await request.json()
    const { token } = body
    
    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Token is required.',
          code: 'MISSING_TOKEN' 
        },
        { status: 400 }
      )
    }

    // Basic token validation (for demonstration)
    const isValid = token.length >= 16 && /^[a-f0-9]+$/i.test(token)
    
    return NextResponse.json(
      {
        success: true,
        valid: isValid,
        timestamp: new Date().toISOString()
      },
      { headers: addRateLimitHeaders(rateLimitResult) }
    )

  } catch (error: unknown) {
    console.error('CSRF token validation error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Token validation failed.',
        code: 'VALIDATION_ERROR'
      },
      { status: 500 }
    )
  }
}
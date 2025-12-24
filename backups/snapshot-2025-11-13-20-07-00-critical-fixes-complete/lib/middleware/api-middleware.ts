/**
 * API Middleware
 * 
 * Comprehensive middleware for LinkedIn posts API
 * Handles CORS, rate limiting, authentication, and error handling
 * Optimized for n8n integration and production use
 */

import { NextRequest, NextResponse } from 'next/server'
import { RateLimitInfo, RateLimitResponse, ApiError } from '../types/linkedin-api'

// Rate limiting store (in production, use Redis or database)
interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class ApiMiddleware {
  private static instance: ApiMiddleware
  private rateLimitStore: RateLimitStore = {}
  
  // Configuration
  private readonly config = {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100, // per window
      skipSuccessfulRequests: false,
      skipFailedRequests: false
    },
    cors: {
      origin: [
        'http://localhost:3000',
        'https://workflo.it',
        'https://www.workflo.it',
        'https://*.n8n.cloud',
        'https://*.n8n.io',
        // Add your n8n instance domains here
      ],
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-API-Key',
        'X-Requested-With',
        'X-User-Agent',
        'Origin',
        'Accept'
      ],
      credentials: true
    },
    auth: {
      apiKeyHeader: 'X-API-Key',
      bearerPrefix: 'Bearer ',
      requiredForPost: true,
      requiredForGet: false
    }
  }

  private constructor() {
    // Clean up rate limit store every hour
    setInterval(() => {
      this.cleanupRateLimitStore()
    }, 60 * 60 * 1000)
  }

  public static getInstance(): ApiMiddleware {
    if (!ApiMiddleware.instance) {
      ApiMiddleware.instance = new ApiMiddleware()
    }
    return ApiMiddleware.instance
  }

  /**
   * Apply CORS headers to response
   */
  public applyCors(request: NextRequest, response: NextResponse): NextResponse {
    const origin = request.headers.get('origin')
    const userAgent = request.headers.get('user-agent') || ''
    
    // Check if origin is allowed
    const isAllowedOrigin = this.isOriginAllowed(origin)
    
    // Special handling for n8n requests
    const isN8NRequest = userAgent.includes('n8n') || 
                        userAgent.includes('axios') || 
                        request.headers.get('x-user-agent')?.includes('n8n')

    if (isAllowedOrigin || isN8NRequest) {
      response.headers.set('Access-Control-Allow-Origin', origin || '*')
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }

    response.headers.set(
      'Access-Control-Allow-Methods',
      this.config.cors.methods.join(', ')
    )
    
    response.headers.set(
      'Access-Control-Allow-Headers',
      this.config.cors.allowedHeaders.join(', ')
    )

    // Preflight cache
    response.headers.set('Access-Control-Max-Age', '86400')

    return response
  }

  /**
   * Handle preflight OPTIONS requests
   */
  public handlePreflight(request: NextRequest): NextResponse {
    const response = new NextResponse(null, { status: 204 })
    return this.applyCors(request, response)
  }

  /**
   * Apply rate limiting
   */
  public async applyRateLimit(request: NextRequest): Promise<{
    allowed: boolean
    rateLimitInfo: RateLimitInfo
    response?: NextResponse
  }> {
    const clientId = this.getClientId(request)
    const now = Date.now()
    const windowStart = now - this.config.rateLimit.windowMs

    // Clean old entries
    if (this.rateLimitStore[clientId]) {
      if (this.rateLimitStore[clientId].resetTime <= now) {
        delete this.rateLimitStore[clientId]
      }
    }

    // Initialize or get current count
    if (!this.rateLimitStore[clientId]) {
      this.rateLimitStore[clientId] = {
        count: 0,
        resetTime: now + this.config.rateLimit.windowMs
      }
    }

    const rateLimitData = this.rateLimitStore[clientId]

    // Check if rate limit exceeded
    if (rateLimitData.count >= this.config.rateLimit.maxRequests) {
      const retryAfter = Math.ceil((rateLimitData.resetTime - now) / 1000)
      
      const rateLimitInfo: RateLimitInfo = {
        limit: this.config.rateLimit.maxRequests,
        remaining: 0,
        resetTime: rateLimitData.resetTime,
        retryAfter
      }

      const errorResponse: RateLimitResponse = {
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
        rateLimit: rateLimitInfo
      }

      const response = NextResponse.json(errorResponse, { status: 429 })
      
      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', String(this.config.rateLimit.maxRequests))
      response.headers.set('X-RateLimit-Remaining', '0')
      response.headers.set('X-RateLimit-Reset', String(rateLimitData.resetTime))
      response.headers.set('Retry-After', String(retryAfter))

      return {
        allowed: false,
        rateLimitInfo,
        response
      }
    }

    // Increment counter
    rateLimitData.count++

    const rateLimitInfo: RateLimitInfo = {
      limit: this.config.rateLimit.maxRequests,
      remaining: this.config.rateLimit.maxRequests - rateLimitData.count,
      resetTime: rateLimitData.resetTime
    }

    return {
      allowed: true,
      rateLimitInfo
    }
  }

  /**
   * Add rate limit headers to response
   */
  public addRateLimitHeaders(response: NextResponse, rateLimitInfo: RateLimitInfo): NextResponse {
    response.headers.set('X-RateLimit-Limit', String(rateLimitInfo.limit))
    response.headers.set('X-RateLimit-Remaining', String(rateLimitInfo.remaining))
    response.headers.set('X-RateLimit-Reset', String(rateLimitInfo.resetTime))
    
    if (rateLimitInfo.retryAfter) {
      response.headers.set('Retry-After', String(rateLimitInfo.retryAfter))
    }

    return response
  }

  /**
   * Authenticate request
   */
  public authenticateRequest(request: NextRequest, requireAuth: boolean): {
    authenticated: boolean
    user?: string
    error?: string
  } {
    if (!requireAuth) {
      return { authenticated: true }
    }

    const apiKey = request.headers.get(this.config.auth.apiKeyHeader)
    const authHeader = request.headers.get('authorization')

    // Check API key (primary method for n8n)
    if (apiKey) {
      if (this.isValidApiKey(apiKey)) {
        return { authenticated: true, user: 'api-key-user' }
      }
      return { authenticated: false, error: 'Invalid API key' }
    }

    // Check Bearer token
    if (authHeader?.startsWith(this.config.auth.bearerPrefix)) {
      const token = authHeader.substring(this.config.auth.bearerPrefix.length)
      if (this.isValidBearerToken(token)) {
        return { authenticated: true, user: 'bearer-user' }
      }
      return { authenticated: false, error: 'Invalid bearer token' }
    }

    return { authenticated: false, error: 'Authentication required' }
  }

  /**
   * Create standardized error response
   */
  public createErrorResponse(
    error: string,
    statusCode: number,
    code: string,
    validation?: any[]
  ): NextResponse {
    const errorResponse: ApiError = {
      success: false,
      error,
      code,
      statusCode,
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId(),
      ...(validation && { validation })
    }

    return NextResponse.json(errorResponse, { status: statusCode })
  }

  /**
   * Handle uncaught errors
   */
  public handleError(error: Error, request: NextRequest): NextResponse {
    console.error('API Error:', error)

    // Log error details for monitoring
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      timestamp: new Date().toISOString()
    }

    console.error('Error details:', errorDetails)

    return this.createErrorResponse(
      'Internal server error',
      500,
      'INTERNAL_ERROR'
    )
  }

  // Private helper methods

  private isOriginAllowed(origin: string | null): boolean {
    if (!origin) return false
    
    return this.config.cors.origin.some(allowedOrigin => {
      if (allowedOrigin === '*') return true
      if (allowedOrigin.includes('*')) {
        const pattern = allowedOrigin.replace(/\*/g, '.*')
        return new RegExp(pattern).test(origin)
      }
      return allowedOrigin === origin
    })
  }

  private getClientId(request: NextRequest): string {
    // In production, use IP address and additional headers
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const clientIp = forwarded?.split(',')[0] || realIp || 'unknown'
    
    // Add user agent to make rate limiting more granular
    const userAgent = request.headers.get('user-agent') || ''
    
    return `${clientIp}-${Buffer.from(userAgent).toString('base64').slice(0, 10)}`
  }

  private isValidApiKey(apiKey: string): boolean {
    // In production, validate against database or environment variable
    const validApiKeys = [
      process.env.LINKEDIN_API_KEY,
      process.env.N8N_API_KEY,
      'workflo-api-key-dev' // Development only
    ].filter(Boolean)

    return validApiKeys.includes(apiKey)
  }

  private isValidBearerToken(token: string): boolean {
    // In production, validate JWT token
    // For now, accept any non-empty token
    return token.length > 0
  }

  private cleanupRateLimitStore(): void {
    const now = Date.now()
    Object.keys(this.rateLimitStore).forEach(key => {
      const entry = this.rateLimitStore[key]
      if (entry && entry.resetTime <= now) {
        delete this.rateLimitStore[key]
      }
    })
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }
}

// Export singleton instance
export const apiMiddleware = ApiMiddleware.getInstance()

/**
 * Middleware wrapper function for API routes
 */
export async function withApiMiddleware(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean
    skipRateLimit?: boolean
  } = {}
): Promise<NextResponse> {
  try {
    const { requireAuth = false, skipRateLimit = false } = options

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return apiMiddleware.handlePreflight(request)
    }

    // Apply rate limiting
    if (!skipRateLimit) {
      const rateLimitResult = await apiMiddleware.applyRateLimit(request)
      if (!rateLimitResult.allowed && rateLimitResult.response) {
        return apiMiddleware.applyCors(request, rateLimitResult.response)
      }
    }

    // Authentication
    const authResult = apiMiddleware.authenticateRequest(request, requireAuth)
    if (!authResult.authenticated) {
      const errorResponse = apiMiddleware.createErrorResponse(
        authResult.error || 'Authentication failed',
        401,
        'UNAUTHORIZED'
      )
      return apiMiddleware.applyCors(request, errorResponse)
    }

    // Call the actual handler
    const response = await handler(request)

    // Apply CORS and rate limit headers
    let finalResponse = apiMiddleware.applyCors(request, response)
    
    if (!skipRateLimit) {
      const rateLimitResult = await apiMiddleware.applyRateLimit(request)
      finalResponse = apiMiddleware.addRateLimitHeaders(
        finalResponse, 
        rateLimitResult.rateLimitInfo
      )
    }

    return finalResponse

  } catch (error) {
    const errorResponse = apiMiddleware.handleError(error as Error, request)
    return apiMiddleware.applyCors(request, errorResponse)
  }
}
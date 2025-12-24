/**
 * Authentication Middleware for Workflo CMS API
 * Handles JWT token validation, role-based access control, and rate limiting
 * Author: Claude Code - Workflo Backend System
 * Date: 2025-09-04
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import type { Database, UserRole } from '../database.types'

// Types
interface AuthenticatedUser {
  id: string
  email: string
  role: UserRole
  username: string
}

interface AuthMiddlewareOptions {
  requiredRole?: UserRole
  allowAnonymous?: boolean
  rateLimit?: {
    requests: number
    windowMs: number
  }
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production'

// Supabase client
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

/**
 * Extract JWT token from request headers
 */
function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null

  // Support both 'Bearer token' and 'token' formats
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return authHeader
}

/**
 * Validate JWT token and get user information
 */
async function validateToken(token: string): Promise<AuthenticatedUser | null> {
  try {
    // First, try to verify as a JWT token (for API keys or custom tokens)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    if (decoded.userId) {
      // Fetch user from database
      const { data: user, error } = await supabase
        .from('cms_users')
        .select('id, email, role, username, is_active')
        .eq('id', decoded.userId)
        .single()

      if (error || !user || !user.is_active) {
        return null
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username
      }
    }
  } catch (jwtError) {
    // If JWT verification fails, try Supabase session verification
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token)
      if (error || !user) return null

      // Get user details from cms_users table
      const { data: cmsUser, error: cmsError } = await supabase
        .from('cms_users')
        .select('id, email, role, username, is_active')
        .eq('email', user.email)
        .single()

      if (cmsError || !cmsUser || !cmsUser.is_active) {
        return null
      }

      return {
        id: cmsUser.id,
        email: cmsUser.email,
        role: cmsUser.role,
        username: cmsUser.username
      }
    } catch (supabaseError) {
      return null
    }
  }

  return null
}

/**
 * Check if user has required role
 */
function hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    'viewer': 1,
    'editor': 2,
    'admin': 3
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

/**
 * Rate limiting implementation
 */
function checkRateLimit(
  identifier: string,
  options: { requests: number; windowMs: number }
): { allowed: boolean; remainingRequests: number; resetTime: number } {
  const now = Date.now()
  const key = identifier
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetTime) {
    // Create new window
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + options.windowMs
    }
    rateLimitStore.set(key, newEntry)
    
    return {
      allowed: true,
      remainingRequests: options.requests - 1,
      resetTime: newEntry.resetTime
    }
  }

  if (entry.count >= options.requests) {
    return {
      allowed: false,
      remainingRequests: 0,
      resetTime: entry.resetTime
    }
  }

  // Increment count
  entry.count++
  rateLimitStore.set(key, entry)

  return {
    allowed: true,
    remainingRequests: options.requests - entry.count,
    resetTime: entry.resetTime
  }
}

/**
 * Log API usage for monitoring and analytics
 */
async function logApiUsage(request: NextRequest, user: AuthenticatedUser | null, statusCode: number, startTime: number) {
  const responseTime = Date.now() - startTime
  const url = new URL(request.url)
  
  try {
    await supabase
      .from('api_usage_logs')
      .insert({
        endpoint: url.pathname,
        method: request.method,
        status_code: statusCode,
        response_time_ms: responseTime,
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1',
        user_agent: request.headers.get('user-agent'),
        user_id: user?.id || null,
        request_size: parseInt(request.headers.get('content-length') || '0')
      })
  } catch (error) {
    console.error('Failed to log API usage:', error)
  }
}

/**
 * Main authentication middleware
 */
export function withAuth(options: AuthMiddlewareOptions = {}) {
  return function authMiddleware(
    handler: (req: NextRequest, context: { user: AuthenticatedUser | null }) => Promise<NextResponse>
  ) {
    return async function authenticatedHandler(req: NextRequest): Promise<NextResponse> {
      const startTime = Date.now()
      let user: AuthenticatedUser | null = null
      let statusCode = 200

      try {
        // Rate limiting
        if (options.rateLimit) {
          const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1'
          const rateCheck = checkRateLimit(clientIp, options.rateLimit)
          
          if (!rateCheck.allowed) {
            statusCode = 429
            const response = NextResponse.json(
              {
                success: false,
                error: 'Rate limit exceeded',
                message: 'Too many requests. Please try again later.',
                rateLimitReset: new Date(rateCheck.resetTime).toISOString()
              },
              { status: 429 }
            )

            response.headers.set('X-RateLimit-Limit', options.rateLimit.requests.toString())
            response.headers.set('X-RateLimit-Remaining', '0')
            response.headers.set('X-RateLimit-Reset', new Date(rateCheck.resetTime).toISOString())

            await logApiUsage(req, user, statusCode, startTime)
            return response
          }

          // Add rate limit headers to response
          const response = new NextResponse()
          response.headers.set('X-RateLimit-Limit', options.rateLimit.requests.toString())
          response.headers.set('X-RateLimit-Remaining', rateCheck.remainingRequests.toString())
          response.headers.set('X-RateLimit-Reset', new Date(rateCheck.resetTime).toISOString())
        }

        // Authentication
        const token = extractToken(req)
        
        if (token) {
          user = await validateToken(token)
        }

        // Check if authentication is required
        if (!options.allowAnonymous && !user) {
          statusCode = 401
          const response = NextResponse.json(
            {
              success: false,
              error: 'Authentication required',
              message: 'Please provide a valid authentication token.'
            },
            { status: 401 }
          )

          await logApiUsage(req, user, statusCode, startTime)
          return response
        }

        // Check role requirements
        if (options.requiredRole && user && !hasRequiredRole(user.role, options.requiredRole)) {
          statusCode = 403
          const response = NextResponse.json(
            {
              success: false,
              error: 'Insufficient permissions',
              message: `This endpoint requires ${options.requiredRole} role or higher.`
            },
            { status: 403 }
          )

          await logApiUsage(req, user, statusCode, startTime)
          return response
        }

        // Call the original handler
        const response = await handler(req, { user })
        statusCode = response.status

        // Log API usage
        await logApiUsage(req, user, statusCode, startTime)

        return response

      } catch (error) {
        console.error('Auth middleware error:', error)
        statusCode = 500
        
        const response = NextResponse.json(
          {
            success: false,
            error: 'Internal server error',
            message: 'An unexpected error occurred.'
          },
          { status: 500 }
        )

        await logApiUsage(req, user, statusCode, startTime)
        return response
      }
    }
  }
}

/**
 * Generate JWT token for user (for API keys)
 */
export async function generateApiToken(userId: string, expiresInDays: number = 30): Promise<string> {
  const payload = {
    userId,
    type: 'api',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (expiresInDays * 24 * 60 * 60)
  }

  return jwt.sign(payload, JWT_SECRET)
}

/**
 * Verify API key and return user
 */
export async function verifyApiKey(apiKey: string): Promise<AuthenticatedUser | null> {
  return validateToken(apiKey)
}

/**
 * Create CSRF token
 */
export function generateCsrfToken(): string {
  return jwt.sign(
    {
      type: 'csrf',
      random: Math.random().toString(36).substring(2),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
    },
    JWT_SECRET
  )
}

/**
 * Verify CSRF token
 */
export function verifyCsrfToken(token: string): boolean {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded.type === 'csrf' && decoded.exp > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}

// Pre-configured middleware functions
export const requireAdmin = withAuth({ requiredRole: 'admin' })
export const requireEditor = withAuth({ requiredRole: 'editor' })
export const requireAuth = withAuth({ allowAnonymous: false })
export const allowAnonymous = withAuth({ allowAnonymous: true })

// Rate limited endpoints
export const rateLimitedAuth = withAuth({ 
  allowAnonymous: true, 
  rateLimit: { requests: 100, windowMs: 15 * 60 * 1000 } // 100 requests per 15 minutes
})

export const strictRateLimit = withAuth({ 
  allowAnonymous: true, 
  rateLimit: { requests: 10, windowMs: 60 * 1000 } // 10 requests per minute
})
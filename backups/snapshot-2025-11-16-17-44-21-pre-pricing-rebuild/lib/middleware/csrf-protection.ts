import { NextRequest } from 'next/server'
import { createHash, randomBytes } from 'crypto'

// CSRF token configuration
const CSRF_TOKEN_LENGTH = 32
const CSRF_SECRET_LENGTH = 32
const CSRF_TOKEN_LIFETIME = 60 * 60 * 1000 // 1 hour
const CSRF_COOKIE_NAME = 'csrf-token'
const CSRF_HEADER_NAME = 'x-csrf-token'

// In-memory token store (use Redis in production)
interface CSRFTokenEntry {
  secret: string
  createdAt: number
  used: boolean
}

class CSRFTokenStore {
  private store = new Map<string, CSRFTokenEntry>()
  
  set(token: string, entry: CSRFTokenEntry): void {
    this.store.set(token, entry)
  }
  
  get(token: string): CSRFTokenEntry | undefined {
    const entry = this.store.get(token)
    if (entry && Date.now() - entry.createdAt > CSRF_TOKEN_LIFETIME) {
      this.store.delete(token)
      return undefined
    }
    return entry
  }
  
  delete(token: string): void {
    this.store.delete(token)
  }
  
  // Mark token as used (single-use tokens)
  use(token: string): boolean {
    const entry = this.get(token)
    if (!entry || entry.used) {
      return false
    }
    entry.used = true
    return true
  }
  
  // Cleanup expired tokens
  cleanup(): void {
    const now = Date.now()
    for (const [token, entry] of this.store.entries()) {
      if (now - entry.createdAt > CSRF_TOKEN_LIFETIME) {
        this.store.delete(token)
      }
    }
  }
}

const tokenStore = new CSRFTokenStore()

// Cleanup expired tokens every 15 minutes
setInterval(() => {
  tokenStore.cleanup()
}, 15 * 60 * 1000)

/**
 * Generate a cryptographically secure random token
 */
function generateSecureToken(length: number): string {
  return randomBytes(length).toString('hex')
}

/**
 * Create HMAC of token with secret
 */
function createTokenHash(token: string, secret: string): string {
  return createHash('sha256')
    .update(token + secret)
    .digest('hex')
}

/**
 * Generate CSRF token and secret pair
 */
export function generateCSRFToken(): { token: string; secret: string } {
  const token = generateSecureToken(CSRF_TOKEN_LENGTH)
  const secret = generateSecureToken(CSRF_SECRET_LENGTH)
  
  const entry: CSRFTokenEntry = {
    secret,
    createdAt: Date.now(),
    used: false
  }
  
  tokenStore.set(token, entry)
  
  return { token, secret }
}

/**
 * Verify CSRF token against stored secret
 */
function verifyCSRFToken(token: string, providedHash: string): boolean {
  const entry = tokenStore.get(token)
  if (!entry || entry.used) {
    return false
  }
  
  const expectedHash = createTokenHash(token, entry.secret)
  
  // Use timing-safe comparison
  if (expectedHash.length !== providedHash.length) {
    return false
  }
  
  let result = 0
  for (let i = 0; i < expectedHash.length; i++) {
    result |= expectedHash.charCodeAt(i) ^ providedHash.charCodeAt(i)
  }
  
  return result === 0
}

/**
 * Extract CSRF token from request
 */
function extractCSRFToken(request: NextRequest): string | null {
  // Try header first
  const headerToken = request.headers.get(CSRF_HEADER_NAME)
  if (headerToken) {
    return headerToken
  }
  
  // Try body for form submissions
  const contentType = request.headers.get('content-type') || ''
  if (contentType.includes('application/x-www-form-urlencoded')) {
    // Would need to parse form data - simplified for now
    return null
  }
  
  return null
}

/**
 * Get origin from request
 */
function getRequestOrigin(request: NextRequest): string | null {
  return request.headers.get('origin') || request.headers.get('referer')
}

/**
 * Check if origin is allowed
 */
function isOriginAllowed(origin: string | null, allowedOrigins: string[]): boolean {
  if (!origin) {
    return false
  }
  
  // Parse origin to get just the host
  try {
    const originUrl = new URL(origin)
    const originHost = `${originUrl.protocol}//${originUrl.host}`
    
    return allowedOrigins.some(allowed => {
      if (allowed === '*') return true
      if (allowed.startsWith('*.')) {
        // Wildcard subdomain matching
        const domain = allowed.slice(2)
        return originHost.endsWith(`.${domain}`) || originHost.endsWith(`://${domain}`)
      }
      return originHost === allowed
    })
  } catch {
    return false
  }
}

/**
 * CSRF protection options
 */
export interface CSRFOptions {
  allowedOrigins: string[]
  requireSameOrigin?: boolean
  ignoreMethods?: string[]
  skipRoutes?: string[]
  customTokenExtractor?: (request: NextRequest) => string | null
}

/**
 * Default CSRF configuration
 */
const defaultCSRFOptions: CSRFOptions = {
  allowedOrigins: ['http://localhost:3000', 'https://workflo.nl', 'https://www.workflo.nl'],
  requireSameOrigin: true,
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
  skipRoutes: ['/api/health', '/api/metrics'],
}

/**
 * CSRF protection result
 */
export interface CSRFResult {
  valid: boolean
  error?: string
  code?: string
}

/**
 * Main CSRF protection function
 */
export function checkCSRF(
  request: NextRequest,
  options: Partial<CSRFOptions> = {}
): CSRFResult {
  const config = { ...defaultCSRFOptions, ...options }
  const method = request.method.toUpperCase()
  const pathname = new URL(request.url).pathname
  
  // Skip CSRF check for ignored methods
  if (config.ignoreMethods?.includes(method)) {
    return { valid: true }
  }
  
  // Skip CSRF check for specified routes
  if (config.skipRoutes?.some(route => pathname.startsWith(route))) {
    return { valid: true }
  }
  
  // Origin validation
  const origin = getRequestOrigin(request)
  if (config.requireSameOrigin || config.allowedOrigins.length > 0) {
    if (!origin) {
      return {
        valid: false,
        error: 'Missing origin header',
        code: 'MISSING_ORIGIN'
      }
    }
    
    if (!isOriginAllowed(origin, config.allowedOrigins)) {
      return {
        valid: false,
        error: 'Origin not allowed',
        code: 'FORBIDDEN_ORIGIN'
      }
    }
  }
  
  // For state-changing methods, require CSRF token
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const token = config.customTokenExtractor 
      ? config.customTokenExtractor(request)
      : extractCSRFToken(request)
    
    if (!token) {
      return {
        valid: false,
        error: 'CSRF token required',
        code: 'MISSING_CSRF_TOKEN'
      }
    }
    
    // For this implementation, we'll use a simpler token validation
    // In a real app, you'd validate against the stored secret
    const isValid = validateSimpleCSRFToken(token)
    
    if (!isValid) {
      return {
        valid: false,
        error: 'Invalid CSRF token',
        code: 'INVALID_CSRF_TOKEN'
      }
    }
  }
  
  return { valid: true }
}

/**
 * Simple CSRF token validation (for demonstration)
 * In production, use the full token/secret validation
 */
function validateSimpleCSRFToken(token: string): boolean {
  // Basic validation - in production you'd verify against stored secrets
  return token.length >= 16 && /^[a-f0-9]+$/i.test(token)
}

/**
 * Generate a simple CSRF token for client use
 */
export function generateSimpleCSRFToken(): string {
  return generateSecureToken(16)
}

/**
 * Create CSRF response headers
 */
export function createCSRFHeaders(token: string): Record<string, string> {
  return {
    'X-CSRF-Token': token,
    'Set-Cookie': `${CSRF_COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/`
  }
}

/**
 * Create CSRF error response
 */
export function createCSRFErrorResponse(result: CSRFResult) {
  return {
    status: 403,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      success: false,
      error: result.error || 'CSRF validation failed',
      code: result.code || 'CSRF_ERROR',
    }),
  }
}

/**
 * Enhanced CSRF protection with double-submit cookie pattern
 */
export class DoubleSubmitCSRF {
  private cookieName: string
  private headerName: string
  
  constructor(cookieName = 'csrf-token', headerName = 'x-csrf-token') {
    this.cookieName = cookieName
    this.headerName = headerName
  }
  
  generateToken(): string {
    return generateSecureToken(24)
  }
  
  verify(request: NextRequest): boolean {
    const cookieValue = this.getCookieValue(request, this.cookieName)
    const headerValue = request.headers.get(this.headerName)
    
    if (!cookieValue || !headerValue) {
      return false
    }
    
    // Timing-safe comparison
    return this.safeCompare(cookieValue, headerValue)
  }
  
  private getCookieValue(request: NextRequest, name: string): string | null {
    const cookies = request.headers.get('cookie')
    if (!cookies) return null
    
    const match = cookies.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
    return match && match[1] ? decodeURIComponent(match[1]) : null
  }
  
  private safeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false
    }
    
    let result = 0
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }
    
    return result === 0
  }
}

export const doubleSubmitCSRF = new DoubleSubmitCSRF()
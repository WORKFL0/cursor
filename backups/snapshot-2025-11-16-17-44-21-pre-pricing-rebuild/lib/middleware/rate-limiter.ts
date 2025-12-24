import { NextRequest } from 'next/server'

// Rate limiting configuration per endpoint
export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds  
  maxRequests: number // Maximum requests per window
  skipSuccessfulRequests?: boolean // Don't count successful requests
  skipFailedRequests?: boolean // Don't count failed requests
  keyGenerator?: (request: NextRequest) => string // Custom key generation
}

// Default configurations for different endpoint types
export const defaultRateLimits = {
  contact: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
  },
  newsletter: {
    windowMs: 60 * 1000, // 1 minute  
    maxRequests: 3,
  },
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
  strict: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
  }
} as const

// In-memory store for development (use Redis in production)
interface RateLimitEntry {
  count: number
  resetTime: number
  firstRequest: number
}

class MemoryStore {
  private store = new Map<string, RateLimitEntry>()
  
  get(key: string): RateLimitEntry | undefined {
    const entry = this.store.get(key)
    if (entry && Date.now() > entry.resetTime) {
      this.store.delete(key)
      return undefined
    }
    return entry
  }
  
  set(key: string, value: RateLimitEntry): void {
    this.store.set(key, value)
  }
  
  increment(key: string, windowMs: number): RateLimitEntry {
    const now = Date.now()
    const existing = this.get(key)
    
    if (existing) {
      existing.count++
      return existing
    }
    
    const entry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs,
      firstRequest: now
    }
    
    this.set(key, entry)
    return entry
  }
  
  // Cleanup expired entries (call periodically)
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key)
      }
    }
  }
}

// Global store instance
const store = new MemoryStore()

// Cleanup expired entries every 5 minutes
setInterval(() => {
  store.cleanup()
}, 5 * 60 * 1000)

/**
 * Extract client identifier for rate limiting
 */
export function getClientKey(request: NextRequest, prefix = 'api'): string {
  // Try to get real IP from headers (for deployments behind proxies)
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  let ip = 'unknown'
  
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first (original client)
    const firstIp = forwardedFor.split(',')[0]?.trim()
    if (firstIp) {
      ip = firstIp
    }
  } else if (realIp) {
    ip = realIp
  } else if (cfConnectingIp) {
    ip = cfConnectingIp
  }
  
  // Add user agent for additional uniqueness (helps prevent simple IP spoofing)
  const userAgent = request.headers.get('user-agent')?.slice(0, 50) || 'unknown'
  const userAgentHash = simpleHash(userAgent)
  
  return `${prefix}:${ip}:${userAgentHash}`
}

/**
 * Simple hash function for generating short user agent fingerprints
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36).slice(0, 8)
}

export interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  resetTime: number
  retryAfter?: number
}

/**
 * Check rate limit for a request
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  customPrefix?: string
): RateLimitResult {
  const key = config.keyGenerator 
    ? config.keyGenerator(request) 
    : getClientKey(request, customPrefix)
  
  const entry = store.increment(key, config.windowMs)
  const allowed = entry.count <= config.maxRequests
  const remaining = Math.max(0, config.maxRequests - entry.count)
  
  const result: RateLimitResult = {
    allowed,
    limit: config.maxRequests,
    remaining,
    resetTime: entry.resetTime,
  }
  
  if (!allowed) {
    result.retryAfter = Math.ceil((entry.resetTime - Date.now()) / 1000)
  }
  
  return result
}

/**
 * Middleware function that returns rate limit response headers
 */
export function addRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetTime.toString(),
  }
  
  if (result.retryAfter) {
    headers['Retry-After'] = result.retryAfter.toString()
  }
  
  return headers
}

/**
 * Helper function to create rate limit response
 */
export function createRateLimitResponse(result: RateLimitResult, message?: string) {
  return {
    status: 429,
    headers: {
      ...addRateLimitHeaders(result),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      success: false,
      error: message || 'Rate limit exceeded. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: result.retryAfter,
    }),
  }
}

/**
 * Advanced rate limiting with different strategies
 */
export class AdvancedRateLimiter {
  private store = new MemoryStore()
  
  /**
   * Sliding window rate limiter
   */
  slidingWindow(
    key: string, 
    windowMs: number, 
    maxRequests: number
  ): RateLimitResult {
    const entry = this.store.increment(key, windowMs)
    const allowed = entry.count <= maxRequests
    const remaining = Math.max(0, maxRequests - entry.count)
    
    return {
      allowed,
      limit: maxRequests,
      remaining,
      resetTime: entry.resetTime,
      retryAfter: allowed ? undefined : Math.ceil((entry.resetTime - Date.now()) / 1000)
    }
  }
  
  /**
   * Token bucket rate limiter (for burst handling)
   */
  tokenBucket(
    key: string,
    capacity: number,
    refillRate: number, // tokens per second
    requestedTokens = 1
  ): RateLimitResult {
    const now = Date.now()
    const existing = this.store.get(`bucket:${key}`)
    
    let tokens: number
    let lastRefill: number
    
    if (existing) {
      const timePassed = (now - existing.firstRequest) / 1000
      tokens = Math.min(capacity, existing.count + (timePassed * refillRate))
      lastRefill = now
    } else {
      tokens = capacity
      lastRefill = now
    }
    
    const allowed = tokens >= requestedTokens
    
    if (allowed) {
      tokens -= requestedTokens
    }
    
    // Store updated bucket state
    this.store.set(`bucket:${key}`, {
      count: tokens,
      resetTime: now + (capacity / refillRate * 1000),
      firstRequest: lastRefill
    })
    
    return {
      allowed,
      limit: capacity,
      remaining: Math.floor(tokens),
      resetTime: now + ((capacity - tokens) / refillRate * 1000)
    }
  }
}

export const advancedLimiter = new AdvancedRateLimiter()
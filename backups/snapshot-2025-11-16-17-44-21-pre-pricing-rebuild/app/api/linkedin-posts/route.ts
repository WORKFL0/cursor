/**
 * LinkedIn Posts API Endpoint
 * 
 * Comprehensive REST API for LinkedIn posts with n8n integration support
 * 
 * GET /api/linkedin-posts
 * - Retrieve LinkedIn posts with filtering, pagination, and sorting
 * - Supports query parameters: limit, offset, sort, author, from, to, includeMetrics, format
 * - CORS enabled for n8n integration
 * - Rate limiting: 100 requests per 15 minutes per client
 * 
 * POST /api/linkedin-posts
 * - Create new LinkedIn posts
 * - Requires authentication (API key or Bearer token)
 * - Comprehensive validation
 * 
 * Examples:
 * - GET /api/linkedin-posts?limit=10&sort=newest
 * - GET /api/linkedin-posts?author=Workflo&includeMetrics=true&format=full
 * - GET /api/linkedin-posts?from=2025-08-01&to=2025-08-31
 * - POST /api/linkedin-posts (with JSON body and authentication)
 */

import { NextRequest, NextResponse } from 'next/server'
import { withApiMiddleware } from '@/lib/middleware/api-middleware'
import { linkedInPostsService } from '@/lib/services/linkedin-posts-service'
import { LinkedInPostsQueryParams, CreateLinkedInPostRequest } from '@/lib/types/linkedin-api'

/**
 * GET /api/linkedin-posts
 * 
 * Retrieve LinkedIn posts with comprehensive filtering and pagination
 * 
 * Query Parameters:
 * - limit: Number of posts to return (1-100, default: 10)
 * - offset: Pagination offset (default: 0)
 * - sort: Sort order - 'newest', 'oldest', 'engagement' (default: 'newest')
 * - author: Filter by author name (partial match, case-insensitive)
 * - from: Filter posts from this date (ISO string)
 * - to: Filter posts until this date (ISO string)
 * - includeMetrics: Include engagement metrics (true/false, default: false)
 * - format: Response format - 'summary' or 'full' (default: 'summary')
 * 
 * Response Format:
 * {
 *   "success": true,
 *   "data": [...posts],
 *   "pagination": {
 *     "offset": 0,
 *     "limit": 10,
 *     "total": 25,
 *     "hasMore": true
 *   },
 *   "meta": {
 *     "requestId": "req_1234567890_abc123",
 *     "timestamp": "2025-08-28T10:00:00.000Z",
 *     "processingTime": 15,
 *     "filters": { ... }
 *   }
 * }
 * 
 * Error Response:
 * {
 *   "success": false,
 *   "error": "Error message",
 *   "code": "ERROR_CODE",
 *   "statusCode": 400,
 *   "timestamp": "2025-08-28T10:00:00.000Z",
 *   "requestId": "req_1234567890_abc123"
 * }
 */
async function handleGet(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const queryParams: LinkedInPostsQueryParams = {
      limit: searchParams.get('limit') || undefined,
      offset: searchParams.get('offset') || undefined,
      sort: searchParams.get('sort') as any || undefined,
      author: searchParams.get('author') || undefined,
      from: searchParams.get('from') || undefined,
      to: searchParams.get('to') || undefined,
      includeMetrics: searchParams.get('includeMetrics') || undefined,
      format: searchParams.get('format') as any || undefined
    }

    // Log request for monitoring (in production, use proper logging service)
    console.log('LinkedIn Posts API - GET Request:', {
      params: queryParams,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    })

    // Get posts using service
    const result = await linkedInPostsService.getPosts(queryParams)

    // Special handling for n8n requests - format data appropriately
    const userAgent = request.headers.get('user-agent') || ''
    const isN8NRequest = userAgent.includes('n8n') || request.headers.get('x-user-agent')?.includes('n8n')
    
    if (isN8NRequest && result.success && Array.isArray(result.data)) {
      // Format data specifically for n8n consumption
      const n8nFormattedData = linkedInPostsService.formatForN8N(
        result.data.map(post => ({
          ...post,
          type: 'linkedin' as const,
          isExternal: true
        }))
      )

      return NextResponse.json({
        ...result,
        data: n8nFormattedData,
        meta: {
          ...result.meta,
          n8nFormatted: true,
          integrationType: 'n8n'
        }
      })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('LinkedIn Posts API - GET Error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve LinkedIn posts',
      code: 'GET_POSTS_ERROR',
      statusCode: 500,
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    }, { status: 500 })
  }
}

/**
 * POST /api/linkedin-posts
 * 
 * Create a new LinkedIn post
 * 
 * Authentication Required:
 * - Header: X-API-Key: your-api-key
 * - OR Header: Authorization: Bearer your-token
 * 
 * Request Body:
 * {
 *   "author": "Workflo B.V.",
 *   "content": "Your LinkedIn post content...",
 *   "url": "https://www.linkedin.com/posts/...",
 *   "publishedAt": "2025-08-28T10:00:00.000Z", // optional
 *   "likes": 10, // optional
 *   "comments": 2, // optional
 *   "shares": 1 // optional
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "id": "li-1234567890-abc123",
 *     "message": "LinkedIn post created successfully",
 *     "post": { ...full post data }
 *   }
 * }
 * 
 * Validation Errors:
 * {
 *   "success": false,
 *   "error": "Validation failed",
 *   "validation": [
 *     {
 *       "field": "content",
 *       "message": "Content is required",
 *       "code": "REQUIRED"
 *     }
 *   ]
 * }
 */
async function handlePost(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as CreateLinkedInPostRequest

    // Log request for monitoring
    console.log('LinkedIn Posts API - POST Request:', {
      hasContent: !!body.content,
      author: body.author,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString()
    })

    // Create post using service
    const result = await linkedInPostsService.createPost(body)

    // Return appropriate status code
    const statusCode = result.success ? 201 : 400

    return NextResponse.json(result, { status: statusCode })

  } catch (error) {
    console.error('LinkedIn Posts API - POST Error:', error)

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON in request body',
        code: 'INVALID_JSON',
        statusCode: 400,
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create LinkedIn post',
      code: 'CREATE_POST_ERROR',
      statusCode: 500,
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    }, { status: 500 })
  }
}

/**
 * Main API route handlers with middleware
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  return withApiMiddleware(
    request,
    handleGet,
    { requireAuth: false, skipRateLimit: false }
  )
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return withApiMiddleware(
    request,
    handlePost,
    { requireAuth: true, skipRateLimit: false }
  )
}

/**
 * Handle OPTIONS requests for CORS preflight
 * This is handled automatically by the middleware
 */
export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  return withApiMiddleware(
    request,
    async () => new NextResponse(null, { status: 204 }),
    { requireAuth: false, skipRateLimit: true }
  )
}

/**
 * API Documentation
 * 
 * This endpoint provides comprehensive LinkedIn posts management for n8n integration.
 * 
 * Features:
 * - GET: Retrieve posts with filtering, pagination, and sorting
 * - POST: Create new posts with authentication
 * - CORS support for cross-origin requests
 * - Rate limiting: 100 requests per 15 minutes
 * - Comprehensive error handling and validation
 * - Special n8n formatting for workflow integration
 * 
 * Rate Limits:
 * - 100 requests per 15 minutes per client
 * - Rate limit headers included in responses
 * - 429 status code when limit exceeded
 * 
 * CORS Policy:
 * - Supports localhost, workflo.it, and n8n domains
 * - Credentials supported for authenticated requests
 * - Preflight requests handled automatically
 * 
 * Authentication (POST only):
 * - API Key: X-API-Key header
 * - Bearer Token: Authorization header
 * - Environment variables: LINKEDIN_API_KEY, N8N_API_KEY
 * 
 * Error Codes:
 * - GET_POSTS_ERROR: Failed to retrieve posts
 * - CREATE_POST_ERROR: Failed to create post
 * - VALIDATION_ERROR: Request validation failed
 * - RATE_LIMIT_ERROR: Too many requests
 * - UNAUTHORIZED: Authentication required/failed
 * - INVALID_JSON: Malformed JSON in request body
 * 
 * For n8n Integration:
 * 1. Use GET endpoint with desired parameters
 * 2. Set User-Agent header to include 'n8n' for optimized formatting
 * 3. Add API key for POST requests: X-API-Key header
 * 4. Handle rate limiting with exponential backoff
 * 
 * Example n8n HTTP Request Node:
 * - URL: https://your-domain.com/api/linkedin-posts
 * - Method: GET
 * - Parameters: ?limit=20&sort=newest&includeMetrics=true&format=full
 * - Headers: { "User-Agent": "n8n-workflow" }
 */
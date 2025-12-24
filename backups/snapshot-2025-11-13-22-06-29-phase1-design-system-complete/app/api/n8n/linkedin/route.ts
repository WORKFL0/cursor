/**
 * n8n LinkedIn Webhook Integration Endpoint
 * 
 * This endpoint receives LinkedIn posts from n8n workflows and imports them into the CMS
 * 
 * Features:
 * - Accepts LinkedIn post data from n8n
 * - Transforms LinkedIn posts to CMS article format
 * - Handles duplicate detection via LinkedIn post ID
 * - Automatic category assignment and tagging
 * - Comprehensive error handling and logging
 * 
 * Webhook URL: POST /api/n8n/linkedin
 * 
 * Expected Payload Structure:
 * {
 *   "linkedinId": "urn:li:share:1234567890",
 *   "author": "Workflo B.V.",
 *   "content": "Post content...",
 *   "url": "https://www.linkedin.com/posts/...",
 *   "publishedAt": "2025-08-28T10:00:00.000Z",
 *   "imageUrl": "https://media.licdn.com/...",
 *   "likes": 42,
 *   "comments": 5,
 *   "shares": 3,
 *   "hashtags": ["#tech", "#innovation"]
 * }
 * 
 * Author: Claude Code - Workflo n8n Integration
 * Date: 2025-09-04
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import type { Database } from '@/lib/database.types'

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET || 'workflo-n8n-secret-2025'

// Supabase client
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

/**
 * LinkedIn Post Interface
 */
interface LinkedInWebhookPayload {
  linkedinId?: string
  author?: string
  content?: string
  url?: string
  publishedAt?: string
  imageUrl?: string
  likes?: number
  comments?: number
  shares?: number
  hashtags?: string[]
  companyPage?: string
  postType?: 'text' | 'image' | 'video' | 'article' | 'poll'
  metrics?: {
    impressions?: number
    clicks?: number
    engagementRate?: number
  }
}

/**
 * Transform LinkedIn hashtags to article tags
 */
function transformHashtags(hashtags?: string[]): string[] {
  if (!hashtags || hashtags.length === 0) {
    return ['LinkedIn', 'Social Media']
  }
  
  // Clean hashtags (remove # symbol) and add default tags
  const cleanedTags = hashtags.map(tag => tag.replace(/^#/, '').trim())
  return [...new Set(['LinkedIn', 'Social Media', ...cleanedTags])]
}

/**
 * Generate article slug from LinkedIn post
 */
function generateSlugFromContent(content: string, linkedinId?: string): string {
  // Take first 50 characters of content for slug
  const baseSlug = content
    .toLowerCase()
    .substring(0, 50)
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
  
  // Add unique identifier if LinkedIn ID is available
  if (linkedinId) {
    const idSuffix = linkedinId.split(':').pop() || Date.now().toString()
    return `linkedin-${baseSlug}-${idSuffix}`
  }
  
  // Fallback to timestamp
  return `linkedin-${baseSlug}-${Date.now()}`
}

/**
 * Extract excerpt from LinkedIn content
 */
function extractExcerpt(content: string, maxLength: number = 200): string {
  // Remove URLs and clean up content
  const cleanContent = content
    .replace(/https?:\/\/[^\s]+/g, '') // Remove URLs
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
  
  if (cleanContent.length <= maxLength) {
    return cleanContent
  }
  
  // Find last complete word within limit
  const truncated = cleanContent.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  return truncated.substring(0, lastSpace) + '...'
}

/**
 * Format LinkedIn content for article
 */
function formatContentForArticle(payload: LinkedInWebhookPayload): string {
  let formattedContent = payload.content || ''
  
  // Add LinkedIn post metadata section
  const metadataSection = `
<div class="linkedin-post-metadata">
  <p><strong>Originally posted on LinkedIn</strong></p>
  ${payload.url ? `<p><a href="${payload.url}" target="_blank" rel="noopener noreferrer">View original post</a></p>` : ''}
  ${payload.publishedAt ? `<p>Published: ${new Date(payload.publishedAt).toLocaleDateString('nl-NL', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}</p>` : ''}
  ${payload.likes !== undefined || payload.comments !== undefined || payload.shares !== undefined ? `
    <div class="engagement-metrics">
      ${payload.likes !== undefined ? `<span>👍 ${payload.likes} likes</span>` : ''}
      ${payload.comments !== undefined ? `<span>💬 ${payload.comments} comments</span>` : ''}
      ${payload.shares !== undefined ? `<span>🔄 ${payload.shares} shares</span>` : ''}
    </div>
  ` : ''}
</div>
<hr />
`
  
  // Convert hashtags to links
  if (payload.hashtags && payload.hashtags.length > 0) {
    payload.hashtags.forEach(tag => {
      const cleanTag = tag.replace(/^#/, '')
      formattedContent = formattedContent.replace(
        new RegExp(`#${cleanTag}\\b`, 'gi'),
        `<a href="https://www.linkedin.com/feed/hashtag/?keywords=${cleanTag}" target="_blank" rel="noopener noreferrer">#${cleanTag}</a>`
      )
    })
  }
  
  // Convert URLs to links
  formattedContent = formattedContent.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  )
  
  // Convert line breaks to paragraphs
  const paragraphs = formattedContent
    .split(/\n\n+/)
    .filter(p => p.trim())
    .map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`)
    .join('\n')
  
  return metadataSection + paragraphs
}

/**
 * Check if article already exists for LinkedIn post
 */
async function checkDuplicatePost(linkedinId?: string): Promise<boolean> {
  if (!linkedinId) return false
  
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('id')
      .eq('external_url', `linkedin:${linkedinId}`)
      .single()
    
    return !!data && !error
  } catch {
    return false
  }
}

/**
 * Verify webhook signature (optional security)
 */
function verifyWebhookSignature(request: NextRequest, body: string): boolean {
  const signature = request.headers.get('x-n8n-signature')
  if (!signature) {
    // If no signature provided, check for basic auth or skip verification
    return true // For development, you might want to make this stricter
  }
  
  const expectedSignature = crypto
    .createHmac('sha256', N8N_WEBHOOK_SECRET)
    .update(body)
    .digest('hex')
  
  return signature === expectedSignature
}

/**
 * Track webhook analytics
 */
async function trackWebhookEvent(
  eventName: string,
  success: boolean,
  linkedinId?: string,
  error?: string
) {
  // Temporarily disabled - analytics_events table needs schema update
  console.log('Webhook event:', {
    eventName,
    success,
    linkedinId,
    error,
    source: 'n8n',
    integration: 'linkedin'
  })
  
  // TODO: Re-enable when analytics_events table is properly configured
  /*
  try {
    await supabase
      .from('analytics_events')
      .insert({
        event_type: 'page_view' as any, // Using existing type
        event_name: `n8n_webhook_${eventName}`,
        properties: {
          success,
          linkedin_id: linkedinId,
          error,
          source: 'n8n',
          integration: 'linkedin'
        }
      })
  } catch (error) {
    console.error('Failed to track webhook event:', error)
  }
  */
}

// ================================================================
// POST /api/n8n/linkedin - Receive LinkedIn posts from n8n
// ================================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = `n8n_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  
  try {
    // Parse request body
    const bodyText = await request.text()
    let payload: LinkedInWebhookPayload
    
    try {
      payload = JSON.parse(bodyText)
    } catch (error) {
      console.error(`[${requestId}] Invalid JSON payload:`, error)
      await trackWebhookEvent('invalid_json', false)
      
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON payload',
          message: 'The request body must be valid JSON',
          requestId,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }
    
    // Verify webhook signature (optional)
    if (!verifyWebhookSignature(request, bodyText)) {
      console.error(`[${requestId}] Invalid webhook signature`)
      await trackWebhookEvent('invalid_signature', false)
      
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid signature',
          message: 'Webhook signature verification failed',
          requestId,
          timestamp: new Date().toISOString()
        },
        { status: 401 }
      )
    }
    
    // Log incoming webhook
    console.log(`[${requestId}] n8n LinkedIn webhook received:`, {
      linkedinId: payload.linkedinId,
      author: payload.author,
      hasContent: !!payload.content,
      hasImage: !!payload.imageUrl,
      hashtags: payload.hashtags?.length || 0,
      timestamp: new Date().toISOString()
    })
    
    // Validate required fields
    if (!payload.content || !payload.author) {
      await trackWebhookEvent('validation_failed', false, payload.linkedinId)
      
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Content and author fields are required',
          requestId,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }
    
    // Check for duplicate post
    if (payload.linkedinId) {
      const isDuplicate = await checkDuplicatePost(payload.linkedinId)
      if (isDuplicate) {
        console.log(`[${requestId}] Duplicate LinkedIn post detected:`, payload.linkedinId)
        await trackWebhookEvent('duplicate_detected', true, payload.linkedinId)
        
        return NextResponse.json(
          {
            success: true,
            message: 'LinkedIn post already exists in the system',
            duplicate: true,
            linkedinId: payload.linkedinId,
            requestId,
            timestamp: new Date().toISOString()
          },
          { status: 200 } // Return 200 to prevent n8n retry
        )
      }
    }
    
    // Generate article data from LinkedIn post
    const articleTitle = extractExcerpt(payload.content, 100).replace('...', '') || 'LinkedIn Post'
    const articleSlug = generateSlugFromContent(payload.content, payload.linkedinId)
    const articleExcerpt = extractExcerpt(payload.content, 200)
    const articleContent = formatContentForArticle(payload)
    const articleTags = transformHashtags(payload.hashtags)
    
    // Prepare article data
    const articleData = {
      title: `LinkedIn: ${articleTitle}`,
      slug: articleSlug,
      excerpt: articleExcerpt,
      content: articleContent,
      author: payload.author || 'Workflo B.V.',
      category: 'Social Media',
      tags: articleTags,
      image_url: payload.imageUrl || null,
      published: true, // Auto-publish LinkedIn posts
      featured: false,
      source: 'linkedin' as any,
      external_url: payload.linkedinId ? `linkedin:${payload.linkedinId}` : payload.url || null,
      published_at: payload.publishedAt || new Date().toISOString()
    }
    
    // Insert article into database
    const { data: newArticle, error: insertError } = await supabase
      .from('articles')
      .insert(articleData as any) // Type assertion needed due to Supabase types issue
      .select()
      .single()
    
    if (insertError) {
      console.error(`[${requestId}] Failed to insert article:`, insertError)
      await trackWebhookEvent('insert_failed', false, payload.linkedinId, insertError.message)
      
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: 'Failed to save LinkedIn post to database',
          details: insertError.message,
          requestId,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }
    
    // Store LinkedIn-specific metadata
    if (newArticle && (payload.likes !== undefined || payload.comments !== undefined || payload.shares !== undefined)) {
      // Temporarily disabled - analytics_events table needs schema update
      console.log(`[${requestId}] LinkedIn metrics:`, {
        article_id: (newArticle as any)?.id,
        linkedin_id: payload.linkedinId,
        likes: payload.likes || 0,
        comments: payload.comments || 0,
        shares: payload.shares || 0,
        impressions: payload.metrics?.impressions || 0,
        engagement_rate: payload.metrics?.engagementRate || 0
      })
      
      // TODO: Re-enable when analytics_events table is properly configured
      /*
      try {
        await supabase
          .from('analytics_events')
          .insert({
            event_type: 'article_view' as any,
            event_name: 'linkedin_metrics',
            properties: {
              article_id: (newArticle as any).id,
              linkedin_id: payload.linkedinId,
              likes: payload.likes || 0,
              comments: payload.comments || 0,
              shares: payload.shares || 0,
              impressions: payload.metrics?.impressions || 0,
              engagement_rate: payload.metrics?.engagementRate || 0
            }
          })
      } catch (metricsError) {
        console.error(`[${requestId}] Failed to store LinkedIn metrics:`, metricsError)
        // Don't fail the request if metrics storage fails
      }
      */
    }
    
    // Track successful import
    await trackWebhookEvent('post_imported', true, payload.linkedinId)
    
    const processingTime = Date.now() - startTime
    
    console.log(`[${requestId}] LinkedIn post successfully imported:`, {
      articleId: (newArticle as any)?.id,
      articleSlug: (newArticle as any)?.slug,
      processingTime,
      timestamp: new Date().toISOString()
    })
    
    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'LinkedIn post successfully imported',
        data: {
          articleId: (newArticle as any)?.id,
          articleSlug: (newArticle as any)?.slug,
          articleUrl: `/nieuws/${(newArticle as any)?.slug}`,
          linkedinId: payload.linkedinId,
          title: (newArticle as any)?.title
        },
        meta: {
          requestId,
          processingTime,
          timestamp: new Date().toISOString()
        }
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error(`[${requestId}] Unexpected error in n8n webhook:`, error)
    await trackWebhookEvent('unexpected_error', false, undefined, error instanceof Error ? error.message : 'Unknown error')
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred while processing the webhook',
        requestId,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// ================================================================
// GET /api/n8n/linkedin - Health check and configuration info
// ================================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const showConfig = searchParams.get('config') === 'true'
  
  // Basic health check
  const healthCheck = {
    status: 'healthy',
    endpoint: '/api/n8n/linkedin',
    method: 'POST',
    timestamp: new Date().toISOString(),
    documentation: '/docs/N8N_INTEGRATION.md'
  }
  
  if (showConfig) {
    // Return configuration information (useful for n8n setup)
    return NextResponse.json({
      ...healthCheck,
      configuration: {
        expectedPayload: {
          linkedinId: 'string (optional) - LinkedIn post unique identifier',
          author: 'string (required) - Post author name',
          content: 'string (required) - Post content text',
          url: 'string (optional) - LinkedIn post URL',
          publishedAt: 'string (optional) - ISO date string',
          imageUrl: 'string (optional) - Post image URL',
          likes: 'number (optional) - Number of likes',
          comments: 'number (optional) - Number of comments',
          shares: 'number (optional) - Number of shares',
          hashtags: 'array (optional) - Array of hashtags'
        },
        authentication: {
          required: false,
          method: 'HMAC-SHA256 signature (optional)',
          header: 'x-n8n-signature'
        },
        response: {
          success: {
            status: 201,
            body: {
              success: true,
              message: 'string',
              data: {
                articleId: 'string',
                articleSlug: 'string',
                articleUrl: 'string'
              }
            }
          },
          duplicate: {
            status: 200,
            body: {
              success: true,
              duplicate: true,
              message: 'string'
            }
          },
          error: {
            status: '400/401/500',
            body: {
              success: false,
              error: 'string',
              message: 'string'
            }
          }
        }
      }
    })
  }
  
  return NextResponse.json(healthCheck)
}
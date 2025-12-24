/**
 * Webhooks API - v1
 * Manage webhook endpoints and deliveries
 * Author: Claude Code - Workflo Backend System
 * Date: 2025-09-04
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin, allowAnonymous } from '@/lib/middleware/auth'
import type { 
  Database, 
  WebhookEndpoint, 
  WebhookDelivery, 
  ApiResponse,
  WebhookEvent 
} from '@/lib/database.types'
import crypto from 'crypto'

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Supabase client
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

/**
 * Generate HMAC signature for webhook payload
 */
function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
}

/**
 * Deliver webhook to endpoint
 */
async function deliverWebhook(delivery: WebhookDelivery, endpoint: WebhookEndpoint): Promise<{
  success: boolean
  statusCode?: number
  responseBody?: string
  error?: string
}> {
  try {
    const payload = JSON.stringify(delivery.payload)
    const signature = generateSignature(payload, endpoint.secret_key)
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Webhook-Signature': `sha256=${signature}`,
      'X-Webhook-Event': delivery.event_type,
      'X-Webhook-Delivery': delivery.id,
      'User-Agent': 'Workflo-Webhooks/1.0',
      ...JSON.parse(endpoint.headers as string || '{}')
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), endpoint.timeout_seconds * 1000)

    const response = await fetch(endpoint.url, {
      method: 'POST',
      headers,
      body: payload,
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    const responseText = await response.text().catch(() => '')

    return {
      success: response.ok,
      statusCode: response.status,
      responseBody: responseText
    }

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// ================================================================
// GET /api/v1/webhooks - List webhook endpoints and deliveries (requires admin)
// ================================================================

export const GET = requireAdmin(async (req: NextRequest, { user }) => {
  try {
    const url = new URL(req.url)
    const searchParams = url.searchParams
    
    const type = searchParams.get('type') || 'endpoints'
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200)
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    switch (type) {
      case 'endpoints':
        return await getWebhookEndpoints()
      
      case 'deliveries':
        return await getWebhookDeliveries(limit, offset)
      
      case 'stats':
        return await getWebhookStats()
      
      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid type',
            message: 'Valid types: endpoints, deliveries, stats'
          },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('GET /api/v1/webhooks error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch webhooks',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
})

// ================================================================
// POST /api/v1/webhooks - Create webhook endpoint or trigger delivery (requires admin)
// ================================================================

export const POST = requireAdmin(async (req: NextRequest, { user }) => {
  try {
    const body = await req.json()
    
    if (body.action === 'trigger') {
      return await triggerWebhookDelivery(body)
    } else {
      return await createWebhookEndpoint(body)
    }

  } catch (error) {
    console.error('POST /api/v1/webhooks error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process webhook request',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
})

// ================================================================
// WEBHOOK MANAGEMENT FUNCTIONS
// ================================================================

async function getWebhookEndpoints() {
  const { data: endpoints, error } = await supabase
    .from('webhook_endpoints')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch webhook endpoints: ${error.message}`)
  }

  // Don't expose secret keys in the response
  const sanitizedEndpoints = endpoints?.map(endpoint => ({
    ...endpoint,
    secret_key: '***hidden***'
  }))

  return NextResponse.json({
    success: true,
    data: sanitizedEndpoints,
    timestamp: new Date().toISOString()
  })
}

async function getWebhookDeliveries(limit: number, offset: number) {
  const { data: deliveries, error } = await supabase
    .from('webhook_deliveries')
    .select(`
      *,
      webhook_endpoints(id, name, url, is_active)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    throw new Error(`Failed to fetch webhook deliveries: ${error.message}`)
  }

  // Get total count
  const { count } = await supabase
    .from('webhook_deliveries')
    .select('*', { count: 'exact', head: true })

  return NextResponse.json({
    success: true,
    data: {
      deliveries,
      pagination: {
        total: count || 0,
        page: Math.floor(offset / limit) + 1,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    },
    timestamp: new Date().toISOString()
  })
}

async function getWebhookStats() {
  // Get delivery stats for the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data: recentDeliveries } = await supabase
    .from('webhook_deliveries')
    .select('status, created_at, event_type')
    .gte('created_at', sevenDaysAgo)

  const stats = {
    total_deliveries: recentDeliveries?.length || 0,
    successful_deliveries: recentDeliveries?.filter(d => d.status === 'success').length || 0,
    failed_deliveries: recentDeliveries?.filter(d => d.status === 'failed').length || 0,
    pending_deliveries: recentDeliveries?.filter(d => d.status === 'pending').length || 0,
    success_rate: 0
  }

  if (stats.total_deliveries > 0) {
    stats.success_rate = (stats.successful_deliveries / stats.total_deliveries) * 100
  }

  // Group by event type
  const eventTypeStats = recentDeliveries?.reduce((acc: any, delivery) => {
    if (!acc[delivery.event_type]) {
      acc[delivery.event_type] = { total: 0, success: 0, failed: 0 }
    }
    acc[delivery.event_type].total++
    if (delivery.status === 'success') acc[delivery.event_type].success++
    if (delivery.status === 'failed') acc[delivery.event_type].failed++
    return acc
  }, {})

  // Get active endpoints count
  const { count: activeEndpoints } = await supabase
    .from('webhook_endpoints')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  return NextResponse.json({
    success: true,
    data: {
      period: { days: 7, from: sevenDaysAgo },
      overview: stats,
      event_types: eventTypeStats,
      active_endpoints: activeEndpoints || 0
    },
    timestamp: new Date().toISOString()
  })
}

async function createWebhookEndpoint(body: any) {
  // Validate required fields
  const requiredFields = ['name', 'url', 'events']
  for (const field of requiredFields) {
    if (!body[field]) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: `Field '${field}' is required`
        },
        { status: 400 }
      )
    }
  }

  // Validate URL
  try {
    new URL(body.url)
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid URL',
        message: 'Please provide a valid webhook URL'
      },
      { status: 400 }
    )
  }

  // Generate secret key if not provided
  const secretKey = body.secret_key || crypto.randomBytes(32).toString('hex')

  const webhookData = {
    name: body.name,
    url: body.url,
    secret_key: secretKey,
    events: body.events,
    is_active: body.is_active !== undefined ? body.is_active : true,
    retry_config: body.retry_config || { max_retries: 3, backoff_multiplier: 2 },
    headers: body.headers || {},
    timeout_seconds: body.timeout_seconds || 30
  }

  const { data: newEndpoint, error } = await supabase
    .from('webhook_endpoints')
    .insert(webhookData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create webhook endpoint: ${error.message}`)
  }

  return NextResponse.json({
    success: true,
    data: {
      ...newEndpoint,
      secret_key: '***hidden***' // Don't expose secret key in response
    },
    message: 'Webhook endpoint created successfully',
    timestamp: new Date().toISOString()
  }, { status: 201 })
}

async function triggerWebhookDelivery(body: any) {
  const { delivery_id } = body

  if (!delivery_id) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation error',
        message: 'delivery_id is required'
      },
      { status: 400 }
    )
  }

  // Get delivery and endpoint
  const { data: delivery, error: deliveryError } = await supabase
    .from('webhook_deliveries')
    .select(`
      *,
      webhook_endpoints(*)
    `)
    .eq('id', delivery_id)
    .single()

  if (deliveryError || !delivery) {
    return NextResponse.json(
      {
        success: false,
        error: 'Delivery not found',
        message: 'The specified webhook delivery was not found'
      },
      { status: 404 }
    )
  }

  const endpoint = delivery.webhook_endpoints as any

  if (!endpoint || !endpoint.is_active) {
    return NextResponse.json(
      {
        success: false,
        error: 'Endpoint inactive',
        message: 'The webhook endpoint is not active'
      },
      { status: 400 }
    )
  }

  // Update status to processing
  await supabase
    .from('webhook_deliveries')
    .update({ status: 'processing' })
    .eq('id', delivery_id)

  // Attempt delivery
  const deliveryResult = await deliverWebhook(delivery, endpoint)

  // Update delivery status
  const updateData: any = {
    status: deliveryResult.success ? 'success' : 'failed',
    http_status_code: deliveryResult.statusCode,
    response_body: deliveryResult.responseBody,
    error_message: deliveryResult.error,
    delivered_at: deliveryResult.success ? new Date().toISOString() : null
  }

  // Handle retry logic for failed deliveries
  if (!deliveryResult.success) {
    const retryConfig = endpoint.retry_config || { max_retries: 3, backoff_multiplier: 2 }
    const currentRetryCount = delivery.retry_count + 1

    if (currentRetryCount < retryConfig.max_retries) {
      // Schedule retry
      const backoffMinutes = Math.pow(retryConfig.backoff_multiplier, currentRetryCount)
      const nextRetryAt = new Date(Date.now() + backoffMinutes * 60000)

      updateData.status = 'retry'
      updateData.retry_count = currentRetryCount
      updateData.next_retry_at = nextRetryAt.toISOString()
    } else {
      updateData.retry_count = currentRetryCount
    }
  }

  await supabase
    .from('webhook_deliveries')
    .update(updateData)
    .eq('id', delivery_id)

  return NextResponse.json({
    success: true,
    data: {
      delivery_id,
      delivery_success: deliveryResult.success,
      status_code: deliveryResult.statusCode,
      error: deliveryResult.error
    },
    message: deliveryResult.success ? 'Webhook delivered successfully' : 'Webhook delivery failed',
    timestamp: new Date().toISOString()
  })
}

// ================================================================
// WEBHOOK PROCESSING ENDPOINT (for background processing)
// ================================================================

/**
 * Process pending webhook deliveries
 * This can be called by a cron job or background worker
 */
// Helper function - not exported
async function processWebhookQueue() {
  // Get pending deliveries
  const { data: pendingDeliveries, error } = await supabase
    .from('webhook_deliveries')
    .select(`
      *,
      webhook_endpoints(*)
    `)
    .in('status', ['pending', 'retry'])
    .lte('next_retry_at', new Date().toISOString())
    .order('created_at')
    .limit(20) // Process 20 at a time

  if (error || !pendingDeliveries || pendingDeliveries.length === 0) {
    return
  }

  for (const delivery of pendingDeliveries) {
    const endpoint = delivery.webhook_endpoints as any

    if (!endpoint || !endpoint.is_active) {
      // Mark as failed if endpoint is inactive
      await supabase
        .from('webhook_deliveries')
        .update({ 
          status: 'failed',
          error_message: 'Webhook endpoint is inactive'
        })
        .eq('id', delivery.id)
      continue
    }

    // Update status to processing
    await supabase
      .from('webhook_deliveries')
      .update({ status: 'processing' })
      .eq('id', delivery.id)

    // Attempt delivery
    const deliveryResult = await deliverWebhook(delivery, endpoint)

    // Update delivery status (similar logic as in triggerWebhookDelivery)
    const updateData: any = {
      status: deliveryResult.success ? 'success' : 'failed',
      http_status_code: deliveryResult.statusCode,
      response_body: deliveryResult.responseBody,
      error_message: deliveryResult.error,
      delivered_at: deliveryResult.success ? new Date().toISOString() : null
    }

    if (!deliveryResult.success) {
      const retryConfig = endpoint.retry_config || { max_retries: 3, backoff_multiplier: 2 }
      const currentRetryCount = delivery.retry_count + 1

      if (currentRetryCount < retryConfig.max_retries) {
        const backoffMinutes = Math.pow(retryConfig.backoff_multiplier, currentRetryCount)
        const nextRetryAt = new Date(Date.now() + backoffMinutes * 60000)

        updateData.status = 'retry'
        updateData.retry_count = currentRetryCount
        updateData.next_retry_at = nextRetryAt.toISOString()
      } else {
        updateData.retry_count = currentRetryCount
      }
    }

    await supabase
      .from('webhook_deliveries')
      .update(updateData)
      .eq('id', delivery.id)
  }
}
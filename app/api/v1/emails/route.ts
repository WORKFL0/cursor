/**
 * Email Queue API - v1
 * Manage email templates, queue, and sending
 * Author: Claude Code - Workflo Backend System
 * Date: 2025-09-04
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireEditor, requireAdmin, allowAnonymous } from '@/lib/middleware/auth'
import type { 
  Database, 
  EmailQueue, 
  EmailTemplate, 
  ApiResponse,
  EmailTemplateVariables 
} from '@/lib/database.types'

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Supabase client
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

/**
 * Process template variables in email content
 */
function processTemplate(template: string, variables: EmailTemplateVariables): string {
  let processed = template
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    processed = processed.replace(regex, value || '')
  })
  
  return processed
}

/**
 * Send email using configured service (placeholder - implement with your email service)
 */
async function sendEmail(emailData: {
  to_email: string
  to_name?: string
  from_email: string
  from_name: string
  subject: string
  body_html?: string
  body_text?: string
}): Promise<{ success: boolean; provider_id?: string; error?: string }> {
  // This is a placeholder implementation
  // In production, integrate with your email service (SendGrid, AWS SES, etc.)
  
  console.log('📧 Email would be sent:', {
    to: `${emailData.to_name} <${emailData.to_email}>`,
    from: `${emailData.from_name} <${emailData.from_email}>`,
    subject: emailData.subject,
    hasHtml: !!emailData.body_html,
    hasText: !!emailData.body_text
  })
  
  // Simulate success for now
  return {
    success: true,
    provider_id: `mock_${Date.now()}`
  }
}

// ================================================================
// GET /api/v1/emails - Get email queue or templates (requires editor role)
// ================================================================

export const GET = requireEditor(async (req: NextRequest, { user }) => {
  try {
    const url = new URL(req.url)
    const searchParams = url.searchParams
    
    const type = searchParams.get('type') || 'queue'
    const status = searchParams.get('status')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200)
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    switch (type) {
      case 'queue':
        return await getEmailQueue(status, limit, offset)
      
      case 'templates':
        return await getEmailTemplates()
      
      case 'logs':
        return await getEmailLogs(limit, offset)
      
      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid type',
            message: 'Valid types: queue, templates, logs'
          },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('GET /api/v1/emails error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch emails',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
})

// ================================================================
// POST /api/v1/emails - Queue new email
// ================================================================

export const POST = allowAnonymous(async (req: NextRequest, { user }) => {
  try {
    const body = await req.json()
    
    // Different handling based on whether it's template-based or direct email
    if (body.template_name) {
      return await queueTemplateEmail(body, user)
    } else {
      return await queueDirectEmail(body, user)
    }

  } catch (error) {
    console.error('POST /api/v1/emails error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to queue email',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
})

// ================================================================
// EMAIL PROCESSING FUNCTIONS
// ================================================================

async function getEmailQueue(status?: string | null, limit: number = 50, offset: number = 0) {
  let query = supabase
    .from('email_queue')
    .select(`
      *,
      email_templates(name, type)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) {
    query = query.eq('status', status)
  }

  const { data: emails, error } = await query

  if (error) {
    throw new Error(`Failed to fetch email queue: ${error.message}`)
  }

  // Get total count
  let countQuery = supabase
    .from('email_queue')
    .select('*', { count: 'exact', head: true })

  if (status) {
    countQuery = countQuery.eq('status', status)
  }

  const { count } = await countQuery

  return NextResponse.json({
    success: true,
    data: {
      emails,
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

async function getEmailTemplates() {
  const { data: templates, error } = await supabase
    .from('email_templates')
    .select('*')
    .order('name')

  if (error) {
    throw new Error(`Failed to fetch email templates: ${error.message}`)
  }

  return NextResponse.json({
    success: true,
    data: templates,
    timestamp: new Date().toISOString()
  })
}

async function getEmailLogs(limit: number = 50, offset: number = 0) {
  const { data: logs, error } = await supabase
    .from('email_delivery_logs')
    .select(`
      *,
      email_queue(to_email, subject, status)
    `)
    .order('timestamp', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    throw new Error(`Failed to fetch email logs: ${error.message}`)
  }

  return NextResponse.json({
    success: true,
    data: logs,
    timestamp: new Date().toISOString()
  })
}

async function queueTemplateEmail(body: any, user: any) {
  // Validate required fields
  if (!body.template_name || !body.to_email) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation error',
        message: 'template_name and to_email are required'
      },
      { status: 400 }
    )
  }

  // Get email template
  const { data: template, error: templateError } = await supabase
    .from('email_templates')
    .select('*')
    .eq('name', body.template_name)
    .eq('is_active', true)
    .single()

  if (templateError || !template) {
    return NextResponse.json(
      {
        success: false,
        error: 'Template not found',
        message: `Email template '${body.template_name}' not found or inactive`
      },
      { status: 404 }
    )
  }

  // Process template with variables
  const variables = body.variables || {}
  const processedSubject = processTemplate(template.subject, variables)
  const processedBodyHtml = template.body_html ? processTemplate(template.body_html, variables) : null
  const processedBodyText = template.body_text ? processTemplate(template.body_text, variables) : null

  // Queue email
  const emailData = {
    template_id: template.id,
    to_email: body.to_email,
    to_name: body.to_name || null,
    from_email: body.from_email || 'noreply@workflo.it',
    from_name: body.from_name || 'Workflo',
    subject: processedSubject,
    body_html: processedBodyHtml,
    body_text: processedBodyText,
    variables: variables,
    priority: body.priority || 5,
    scheduled_for: body.scheduled_for || new Date().toISOString()
  }

  const { data: queuedEmail, error } = await supabase
    .from('email_queue')
    .insert(emailData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to queue email: ${error.message}`)
  }

  // If immediate sending is requested, try to send now
  if (body.send_immediately) {
    await processPendingEmails([queuedEmail.id])
  }

  return NextResponse.json({
    success: true,
    data: queuedEmail,
    message: 'Email queued successfully',
    timestamp: new Date().toISOString()
  })
}

async function queueDirectEmail(body: any, user: any) {
  // Validate required fields
  const requiredFields = ['to_email', 'subject']
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

  if (!body.body_html && !body.body_text) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation error',
        message: 'Either body_html or body_text is required'
      },
      { status: 400 }
    )
  }

  // Queue email
  const emailData = {
    template_id: null,
    to_email: body.to_email,
    to_name: body.to_name || null,
    from_email: body.from_email || 'noreply@workflo.it',
    from_name: body.from_name || 'Workflo',
    subject: body.subject,
    body_html: body.body_html || null,
    body_text: body.body_text || null,
    variables: body.variables || {},
    priority: body.priority || 5,
    scheduled_for: body.scheduled_for || new Date().toISOString()
  }

  const { data: queuedEmail, error } = await supabase
    .from('email_queue')
    .insert(emailData)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to queue email: ${error.message}`)
  }

  // If immediate sending is requested, try to send now
  if (body.send_immediately) {
    await processPendingEmails([queuedEmail.id])
  }

  return NextResponse.json({
    success: true,
    data: queuedEmail,
    message: 'Email queued successfully',
    timestamp: new Date().toISOString()
  })
}

/**
 * Process pending emails (can be called by cron job)
 */
async function processPendingEmails(specificIds?: string[]) {
  let query = supabase
    .from('email_queue')
    .select('*')
    .eq('status', 'queued')
    .lte('scheduled_for', new Date().toISOString())
    .order('priority')
    .order('created_at')
    .limit(10) // Process 10 at a time

  if (specificIds && specificIds.length > 0) {
    query = query.in('id', specificIds)
  }

  const { data: pendingEmails, error } = await query

  if (error || !pendingEmails || pendingEmails.length === 0) {
    return
  }

  for (const email of pendingEmails) {
    try {
      // Update status to sending
      await supabase
        .from('email_queue')
        .update({ status: 'sending' })
        .eq('id', email.id)

      // Attempt to send email
      const sendResult = await sendEmail({
        to_email: email.to_email,
        to_name: email.to_name || undefined,
        from_email: email.from_email,
        from_name: email.from_name,
        subject: email.subject,
        body_html: email.body_html || undefined,
        body_text: email.body_text || undefined
      })

      if (sendResult.success) {
        // Update status to sent
        await supabase
          .from('email_queue')
          .update({ 
            status: 'sent',
            sent_at: new Date().toISOString(),
            error_message: null
          })
          .eq('id', email.id)

        // Log successful delivery
        await supabase
          .from('email_delivery_logs')
          .insert({
            email_queue_id: email.id,
            event_type: 'sent',
            provider_id: sendResult.provider_id,
            provider_response: { success: true }
          })
      } else {
        // Handle failure
        const retryCount = email.retry_count + 1
        const maxRetries = email.max_retries

        if (retryCount >= maxRetries) {
          // Max retries reached, mark as failed
          await supabase
            .from('email_queue')
            .update({ 
              status: 'failed',
              error_message: sendResult.error,
              retry_count: retryCount
            })
            .eq('id', email.id)
        } else {
          // Schedule retry
          const nextRetryTime = new Date(Date.now() + Math.pow(2, retryCount) * 60000) // Exponential backoff
          
          await supabase
            .from('email_queue')
            .update({ 
              status: 'queued',
              error_message: sendResult.error,
              retry_count: retryCount,
              scheduled_for: nextRetryTime.toISOString()
            })
            .eq('id', email.id)
        }

        // Log failure
        await supabase
          .from('email_delivery_logs')
          .insert({
            email_queue_id: email.id,
            event_type: 'failed',
            provider_response: { 
              success: false, 
              error: sendResult.error 
            }
          })
      }
    } catch (processingError) {
      console.error(`Failed to process email ${email.id}:`, processingError)
      
      // Mark as failed
      await supabase
        .from('email_queue')
        .update({ 
          status: 'failed',
          error_message: processingError instanceof Error ? processingError.message : 'Unknown error'
        })
        .eq('id', email.id)
    }
  }
}
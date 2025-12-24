import { getServerSupabaseClient } from '@/lib/supabase'
import { Resend } from 'resend'

/**
 * Email Queue Service
 * Reliable email delivery with retry logic and prioritization
 */

export interface QueuedEmail {
  toEmail: string
  fromEmail?: string
  replyTo?: string
  subject: string
  htmlBody: string
  textBody?: string
  emailType: EmailType
  priority?: number // 1=highest, 10=lowest
  scheduledFor?: Date
  formData?: Record<string, any>
  metadata?: Record<string, any>
}

export type EmailType =
  | 'contact_notification'
  | 'contact_confirmation'
  | 'quote_notification'
  | 'quote_confirmation'
  | 'newsletter_welcome'
  | 'referral_notification'
  | 'admin_alert'
  | 'system_notification'

export type EmailStatus = 'pending' | 'processing' | 'sent' | 'failed' | 'cancelled'

interface ProcessResult {
  success: boolean
  processed: number
  failed: number
  errors: string[]
}

class EmailQueueService {
  private resend: Resend | null = null
  private processing = false
  private readonly fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@workflo.it'

  constructor() {
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      this.resend = new Resend(apiKey)
    }
  }

  /**
   * Add email to queue
   */
  async enqueue(email: QueuedEmail): Promise<string | null> {
    try {
      const supabase = getServerSupabaseClient()

      const { data, error } = await supabase
        .from('email_queue')
        .insert([{
          to_email: email.toEmail,
          from_email: email.fromEmail || this.fromEmail,
          reply_to: email.replyTo,
          subject: email.subject,
          html_body: email.htmlBody,
          text_body: email.textBody,
          email_type: email.emailType,
          priority: email.priority || 5,
          scheduled_for: email.scheduledFor?.toISOString() || new Date().toISOString(),
          form_data: email.formData || {},
          metadata: email.metadata || {},
          status: 'pending',
        }])
        .select('id')
        .single()

      if (error) {
        console.error('Failed to enqueue email:', error)
        return null
      }

      console.log(`Email queued successfully: ${data.id}`)
      return data.id
    } catch (error) {
      console.error('Error enqueuing email:', error)
      return null
    }
  }

  /**
   * Process pending emails in queue
   */
  async processQueue(limit: number = 10): Promise<ProcessResult> {
    if (this.processing) {
      console.log('Queue processor already running')
      return { success: false, processed: 0, failed: 0, errors: ['Already processing'] }
    }

    if (!this.resend) {
      console.error('Resend not initialized')
      return { success: false, processed: 0, failed: 0, errors: ['Resend not configured'] }
    }

    this.processing = true
    let processed = 0
    let failed = 0
    const errors: string[] = []

    try {
      const supabase = getServerSupabaseClient()

      // Get pending emails, prioritized and scheduled
      const { data: emails, error: fetchError } = await supabase
        .from('email_queue')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_for', new Date().toISOString())
        .order('priority', { ascending: true })
        .order('scheduled_for', { ascending: true })
        .limit(limit)

      if (fetchError) {
        throw new Error(`Failed to fetch emails: ${fetchError.message}`)
      }

      if (!emails || emails.length === 0) {
        console.log('No pending emails in queue')
        return { success: true, processed: 0, failed: 0, errors: [] }
      }

      console.log(`Processing ${emails.length} emails from queue`)

      // Process each email
      for (const email of emails) {
        try {
          // Mark as processing
          await supabase
            .from('email_queue')
            .update({ status: 'processing', last_attempted_at: new Date().toISOString() })
            .eq('id', email.id)

          // Send email via Resend
          const result = await this.resend.emails.send({
            from: email.from_email,
            to: email.to_email,
            replyTo: email.reply_to || undefined,
            subject: email.subject,
            html: email.html_body,
            text: email.text_body || undefined,
          })

          // Mark as sent
          await supabase
            .from('email_queue')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString(),
              message_id: result.id,
              provider: 'resend',
            })
            .eq('id', email.id)

          processed++
          console.log(`Email sent successfully: ${email.id} (${email.email_type})`)
        } catch (error: any) {
          // Handle send failure
          const newRetryCount = (email.retry_count || 0) + 1
          const maxRetries = email.max_retries || 3
          const newStatus = newRetryCount >= maxRetries ? 'failed' : 'pending'

          await supabase
            .from('email_queue')
            .update({
              status: newStatus,
              retry_count: newRetryCount,
              last_error: error.message || 'Unknown error',
              last_attempted_at: new Date().toISOString(),
            })
            .eq('id', email.id)

          failed++
          errors.push(`${email.id}: ${error.message}`)
          console.error(`Failed to send email ${email.id}:`, error)

          // Log critical email failures
          if (newStatus === 'failed') {
            await this.logError({
              errorType: 'email_delivery_failed',
              errorMessage: `Failed to send ${email.email_type} to ${email.to_email} after ${maxRetries} attempts`,
              severity: email.email_type.includes('admin') ? 'high' : 'medium',
              serviceName: 'email',
              metadata: { emailId: email.id, lastError: error.message },
            })
          }
        }
      }

      return { success: true, processed, failed, errors }
    } catch (error: any) {
      console.error('Queue processing error:', error)
      return { success: false, processed, failed, errors: [...errors, error.message] }
    } finally {
      this.processing = false
    }
  }

  /**
   * Retry failed emails
   */
  async retryFailed(): Promise<number> {
    try {
      const supabase = getServerSupabaseClient()

      const { data } = await supabase.rpc('retry_failed_emails')

      console.log(`Retrying ${data || 0} failed emails`)
      return data || 0
    } catch (error) {
      console.error('Error retrying failed emails:', error)
      return 0
    }
  }

  /**
   * Get queue statistics
   */
  async getStats(): Promise<{
    pending: number
    processing: number
    sent: number
    failed: number
    total: number
  }> {
    try {
      const supabase = getServerSupabaseClient()

      const [pending, processing, sent, failed] = await Promise.all([
        supabase.from('email_queue').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('email_queue').select('id', { count: 'exact', head: true }).eq('status', 'processing'),
        supabase.from('email_queue').select('id', { count: 'exact', head: true }).eq('status', 'sent'),
        supabase.from('email_queue').select('id', { count: 'exact', head: true }).eq('status', 'failed'),
      ])

      return {
        pending: pending.count || 0,
        processing: processing.count || 0,
        sent: sent.count || 0,
        failed: failed.count || 0,
        total: (pending.count || 0) + (processing.count || 0) + (sent.count || 0) + (failed.count || 0),
      }
    } catch (error) {
      console.error('Error fetching queue stats:', error)
      return { pending: 0, processing: 0, sent: 0, failed: 0, total: 0 }
    }
  }

  /**
   * Cancel a queued email
   */
  async cancel(emailId: string): Promise<boolean> {
    try {
      const supabase = getServerSupabaseClient()

      const { error } = await supabase
        .from('email_queue')
        .update({ status: 'cancelled' })
        .eq('id', emailId)
        .in('status', ['pending', 'failed'])

      if (error) {
        console.error('Failed to cancel email:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error cancelling email:', error)
      return false
    }
  }

  /**
   * Clean up old queue entries
   */
  async cleanup(): Promise<number> {
    try {
      const supabase = getServerSupabaseClient()

      const { data } = await supabase.rpc('cleanup_old_queue_entries')

      console.log(`Cleaned up ${data || 0} old queue entries`)
      return data || 0
    } catch (error) {
      console.error('Error cleaning up queue:', error)
      return 0
    }
  }

  /**
   * Log error to error_notifications table
   */
  private async logError(error: {
    errorType: string
    errorMessage: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    serviceName?: string
    endpoint?: string
    metadata?: Record<string, any>
  }): Promise<void> {
    try {
      const supabase = getServerSupabaseClient()

      await supabase.from('error_notifications').insert([{
        error_type: error.errorType,
        error_message: error.errorMessage,
        severity: error.severity,
        service_name: error.serviceName,
        endpoint: error.endpoint,
        metadata: error.metadata || {},
        occurred_at: new Date().toISOString(),
      }])
    } catch (err) {
      console.error('Failed to log error:', err)
    }
  }
}

// Export singleton instance
export const emailQueueService = new EmailQueueService()

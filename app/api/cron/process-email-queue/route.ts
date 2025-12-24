import { NextRequest, NextResponse } from 'next/server'
import { emailQueueService } from '@/lib/services/email-queue-service'

/**
 * Cron Job: Process Email Queue
 * Should be called every 1-5 minutes via Vercel Cron or external scheduler
 *
 * Setup in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/process-email-queue",
 *     "schedule": "* * * * *"  // Every minute
 *   }]
 * }
 */

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn('Unauthorized cron job attempt')
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('[CRON] Processing email queue...')

    // Process up to 20 emails per run
    const result = await emailQueueService.processQueue(20)

    // Also retry failed emails
    const retriedCount = await emailQueueService.retryFailed()

    // Get queue stats
    const stats = await emailQueueService.getStats()

    console.log('[CRON] Email queue processed:', {
      processed: result.processed,
      failed: result.failed,
      retried: retriedCount,
      stats,
    })

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      result: {
        processed: result.processed,
        failed: result.failed,
        retried: retriedCount,
        errors: result.errors,
      },
      stats,
    })
  } catch (error: any) {
    console.error('[CRON] Email queue processing failed:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

/**
 * Manual trigger (for testing/admin)
 * POST /api/cron/process-email-queue
 */
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication for manual triggers
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (token !== process.env.ADMIN_SECRET_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const result = await emailQueueService.processQueue(20)
    const stats = await emailQueueService.getStats()

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      result,
      stats,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}

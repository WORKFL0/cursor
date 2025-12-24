import { NextRequest, NextResponse } from 'next/server'
import { rssService } from '@/lib/services/rss-service'

// This endpoint provides RSS management functionality
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'stats':
        const stats = await rssService.getFeedStats()
        return NextResponse.json({
          success: true,
          data: stats
        })

      case 'items':
        const category = searchParams.get('category') || undefined
        const includeExternal = searchParams.get('external') !== 'false'
        const language = (searchParams.get('lang') as 'nl' | 'en') || 'nl'
        const maxItems = searchParams.get('maxItems') ? parseInt(searchParams.get('maxItems')!) : 20

        const items = await rssService.getCombinedFeed({
          category,
          includeExternal,
          language,
          maxItems
        })

        return NextResponse.json({
          success: true,
          data: {
            items,
            count: items.length,
            filters: { category, includeExternal, language, maxItems }
          }
        })

      default:
        return NextResponse.json({
          success: true,
          message: 'RSS Management API',
          availableActions: [
            'stats - Get RSS feed statistics',
            'items - Get RSS feed items with filtering'
          ],
          example: '/api/rss/manage?action=stats'
        })
    }
  } catch (error: unknown) {
    console.error('RSS management error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'RSS management operation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Clear RSS cache
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'clear-cache') {
      rssService.clearCache()
      
      return NextResponse.json({
        success: true,
        message: 'RSS cache cleared successfully',
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action',
        availableActions: ['clear-cache']
      },
      { status: 400 }
    )
  } catch (error: unknown) {
    console.error('RSS cache clear error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clear RSS cache',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Update RSS feed configuration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { feedUrl, updates } = body

    if (!feedUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Feed URL is required'
        },
        { status: 400 }
      )
    }

    const result = rssService.updateFeedConfig(feedUrl, updates)

    if (result) {
      return NextResponse.json({
        success: true,
        message: 'Feed configuration updated successfully',
        feedUrl,
        updates
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Feed not found'
        },
        { status: 404 }
      )
    }
  } catch (error: unknown) {
    console.error('RSS feed configuration update error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update feed configuration',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
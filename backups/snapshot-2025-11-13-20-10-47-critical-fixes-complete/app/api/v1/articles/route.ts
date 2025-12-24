/**
 * Enhanced Articles API - v1
 * Comprehensive CRUD operations with pagination, filtering, and analytics
 * Author: Claude Code - Workflo Backend System
 * Date: 2025-09-04
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { allowAnonymous, requireEditor } from '@/lib/middleware/auth'
import type { 
  Database, 
  Article, 
  PaginatedResponse, 
  ApiResponse,
  FilterOptions,
  CreateArticleData 
} from '@/lib/database.types'

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Supabase client
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

/**
 * Build filter query for articles
 */
function buildFilterQuery(filters: FilterOptions) {
  let query = supabase
    .from('articles')
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      author,
      category,
      tags,
      image_url,
      published,
      featured,
      source,
      external_url,
      views_count,
      published_at,
      created_at,
      updated_at
    `)

  // Apply filters
  if (filters.published !== undefined) {
    query = query.eq('published', filters.published)
  }

  if (filters.featured !== undefined) {
    query = query.eq('featured', filters.featured)
  }

  if (filters.category) {
    query = query.ilike('category', `%${filters.category}%`)
  }

  if (filters.author) {
    query = query.ilike('author', `%${filters.author}%`)
  }

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`)
  }

  if (filters.tags && filters.tags.length > 0) {
    query = query.overlaps('tags', filters.tags)
  }

  if (filters.dateFrom) {
    query = query.gte('published_at', filters.dateFrom)
  }

  if (filters.dateTo) {
    query = query.lte('published_at', filters.dateTo)
  }

  return query
}

/**
 * Track article analytics
 */
async function trackAnalytics(request: NextRequest, eventName: string, articleId?: string) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1'
  const userAgent = request.headers.get('user-agent') || ''
  
  try {
    await supabase
      .from('analytics_events')
      .insert({
        event_type: eventName.startsWith('article') ? 'article_view' : 'page_view',
        event_name: eventName,
        page_url: request.url,
        ip_address: ip,
        user_agent: userAgent,
        properties: articleId ? { article_id: articleId } : {},
      } as any)
  } catch (error) {
    console.error('Analytics tracking failed:', error)
  }
}

/**
 * Generate article slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

// ================================================================
// GET /api/v1/articles - List articles with pagination and filtering
// ================================================================

export const GET = allowAnonymous(async (req: NextRequest, { user }) => {
  try {
    const url = new URL(req.url)
    const searchParams = url.searchParams

    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 100) // Max 100 items per page
    const offset = (page - 1) * limit

    // Parse sorting parameters
    const sortBy = searchParams.get('sortBy') || 'published_at'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    // Parse filter parameters
    const filters: FilterOptions = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      author: searchParams.get('author') || undefined,
      published: searchParams.get('published') === 'true' ? true : searchParams.get('published') === 'false' ? false : undefined,
      featured: searchParams.get('featured') === 'true' ? true : searchParams.get('featured') === 'false' ? false : undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
    }

    // If no user is authenticated, only show published articles
    if (!user) {
      filters.published = true
    }

    // Build and execute query
    let query = buildFilterQuery(filters)

    // Add sorting
    const validSortFields = ['title', 'published_at', 'created_at', 'updated_at', 'views_count', 'author']
    if (validSortFields.includes(sortBy)) {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })
    }

    // Get total count for pagination
    const countQuery = buildFilterQuery(filters)
    const { count, error: countError } = await (countQuery as any).select('*', { count: 'exact', head: true })

    if (countError) {
      throw new Error(`Count query failed: ${countError.message}`)
    }

    // Get paginated data
    const { data: articles, error } = await query
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Articles query failed: ${error.message}`)
    }

    // Track analytics
    await trackAnalytics(req, 'articles_list_viewed')

    // Calculate pagination info
    const totalPages = Math.ceil((count || 0) / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    const response: PaginatedResponse<Article> = {
      success: true,
      data: articles || [],
      count: count || 0,
      limit,
      offset,
      totalPages,
      currentPage: page
    }

    return NextResponse.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('GET /api/v1/articles error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch articles',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
})

// ================================================================
// POST /api/v1/articles - Create new article (requires editor role)
// ================================================================

export const POST = requireEditor(async (req: NextRequest, { user }) => {
  try {
    const body = await req.json()

    // Validate required fields
    const requiredFields = ['title', 'content']
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

    // Generate slug if not provided
    let slug = body.slug
    if (!slug) {
      slug = generateSlug(body.title)
    }

    // Check if slug is unique
    const { data: existingArticle } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingArticle) {
      // Append timestamp to make unique
      slug = `${slug}-${Date.now()}`
    }

    // Prepare article data
    const articleData: CreateArticleData = {
      title: body.title,
      slug,
      excerpt: body.excerpt || null,
      content: body.content,
      author: user?.username || body.author || 'Unknown',
      category: body.category || 'Nieuws',
      tags: body.tags || [],
      image_url: body.image_url || null,
      published: body.published || false,
      featured: body.featured || false,
      source: body.source || 'cms',
      external_url: body.external_url || null
    }

    // Insert article with published_at handled separately
    const insertData: any = {
      ...articleData,
      published_at: body.published && body.published_at ? body.published_at : (body.published ? new Date().toISOString() : null)
    }

    const { data: newArticle, error } = await supabase
      .from('articles')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create article: ${error.message}`)
    }

    // Track analytics
    const articleId = (newArticle as any)?.id
    await trackAnalytics(req, 'article_created', articleId)

    // Trigger webhook for article creation (if configured)
    try {
      await triggerWebhook('article.created', { article: newArticle })
    } catch (webhookError) {
      console.error('Webhook trigger failed:', webhookError)
      // Don't fail the request if webhook fails
    }

    const response: ApiResponse<Article> = {
      success: true,
      data: newArticle,
      message: 'Article created successfully',
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('POST /api/v1/articles error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create article',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
})

// ================================================================
// UTILITY FUNCTIONS
// ================================================================

/**
 * Trigger webhook for article events
 */
async function triggerWebhook(event: string, data: any) {
  // Get active webhook endpoints for this event
  const { data: webhooks } = await supabase
    .from('webhook_endpoints')
    .select('*')
    .eq('is_active', true)
    .contains('events', [event])

  if (!webhooks || webhooks.length === 0) return

  // Queue webhook deliveries
  for (const webhook of webhooks) {
    try {
      const wh = webhook as any
      await supabase
        .from('webhook_deliveries')
        .insert({
          endpoint_id: wh.id,
          event_type: event as any,
          payload: {
            event,
            timestamp: new Date().toISOString(),
            data
          },
          status: 'pending'
        } as any)
    } catch (error) {
      const wh = webhook as any
      console.error(`Failed to queue webhook for ${wh.name}:`, error)
    }
  }
}
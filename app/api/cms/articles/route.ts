import { NextRequest, NextResponse } from 'next/server'
import { CMSAuthService } from '@/lib/auth/cms-auth'
import SupabaseArticleService from '@/lib/services/supabase-article-service'
import { ArticleInsert, ArticleUpdate, ArticleFilters } from '@/lib/types/database'
import { getMockArticles } from '@/lib/data/mock-articles'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const published = searchParams.get('published')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const author = searchParams.get('author')
    const tags = searchParams.get('tags')?.split(',').filter(Boolean)
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    const orderBy = searchParams.get('orderBy') || 'created_at'
    const orderDirection = (searchParams.get('orderDirection') || 'desc') as 'asc' | 'desc'

    const filters: ArticleFilters = {
      published: published === 'true' ? true : published === 'false' ? false : undefined,
      category: category || undefined,
      search: search || undefined,
      featured: featured === 'true' ? true : undefined,
      author: author || undefined,
      tags: tags || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      limit,
      offset,
      orderBy,
      orderDirection
    }

    const result = await SupabaseArticleService.getArticles(filters)
    
    if (!result.success) {
      // Fall back to mock data if database fails
      const mockFilters = {
        published: filters.published,
        featured: filters.featured,
        category: filters.category,
        limit: filters.limit,
        offset: filters.offset
      }
      
      const mockArticles = getMockArticles(mockFilters)
      
      return NextResponse.json({
        success: true,
        data: mockArticles,
        count: mockArticles.length,
        limit,
        offset,
        message: 'Using mock data - database unavailable'
      })
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in GET /api/cms/articles:', error)
    
    // Always fall back to mock data on error
    const mockArticles = getMockArticles({ 
      published: true, 
      limit: 10 
    })
    
    return NextResponse.json({
      success: true,
      data: mockArticles,
      count: mockArticles.length,
      limit: 10,
      offset: 0,
      message: 'Using mock data due to server error'
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and permissions
    const authResult = await CMSAuthService.requireAuth(request, ['admin', 'editor'])
    if (authResult instanceof NextResponse) {
      return authResult // Auth failed
    }

    const { user } = authResult
    const body: ArticleInsert = await request.json()
    
    // Validate required fields
    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!body.excerpt || !body.excerpt.trim()) {
      return NextResponse.json(
        { success: false, error: 'Excerpt is required' },
        { status: 400 }
      )
    }

    const result = await SupabaseArticleService.createArticle(body, user.id)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create article' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Article created successfully'
    })
  } catch (error: any) {
    console.error('Error in POST /api/cms/articles:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication and permissions
    const authResult = await CMSAuthService.requireAuth(request, ['admin', 'editor'])
    if (authResult instanceof NextResponse) {
      return authResult // Auth failed
    }

    const { user } = authResult
    const body = await request.json()
    const { id, ...updateData }: { id: string } & ArticleUpdate = body
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      )
    }
    
    // Validate title if provided
    if (updateData.title && !updateData.title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title cannot be empty' },
        { status: 400 }
      )
    }

    const result = await SupabaseArticleService.updateArticle(id, updateData, user.id)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to update article' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Article updated successfully'
    })
  } catch (error: any) {
    console.error('Error in PUT /api/cms/articles:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication and permissions - only admin can delete
    const authResult = await CMSAuthService.requireAuth(request, 'admin')
    if (authResult instanceof NextResponse) {
      return authResult // Auth failed
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      )
    }
    
    const result = await SupabaseArticleService.deleteArticle(id)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to delete article' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: result.message || 'Article deleted successfully'
    })
  } catch (error: any) {
    console.error('Error in DELETE /api/cms/articles:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
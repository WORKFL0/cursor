import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/services/database-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const published = searchParams.get('published')
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined

    // Build options object
    const options: { published?: boolean; category?: string; limit?: number; offset?: number } = {}
    
    if (published === 'true') {
      options.published = true
    } else if (published === 'false') {
      options.published = false
    }

    if (category) options.category = category
    if (search) options.search = search
    if (featured === 'true') options.featured = true
    if (featured === 'false') options.featured = false
    if (limit) options.limit = limit
    if (offset) options.offset = offset

    const result = await databaseService.getArticles(options)
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      articles: result.data,
      count: result.count,
      success: true
    })
  } catch (error: unknown) {
    console.error('Error in GET /api/cms/articles:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'excerpt', 'content']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field '${field}' is required` },
          { status: 400 }
        )
      }
    }

    // Create article data
    const articleData = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      author: body.author || 'Workflo Team',
      category: body.category || 'Nieuws',
      tags: body.tags || [],
      image: body.image,
      published: body.published || false,
      meta_title: body.meta_title,
      meta_description: body.meta_description,
      featured: body.featured || false
    }

    const result = await databaseService.createArticle(articleData)
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      article: result.data,
      success: true
    })
  } catch (error: unknown) {
    console.error('Error in POST /api/cms/articles:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      )
    }

    const result = await databaseService.updateArticle(body)
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error.includes('not found') ? 404 : 400 }
      )
    }

    return NextResponse.json({
      article: result.data,
      success: true
    })
  } catch (error: unknown) {
    console.error('Error in PUT /api/cms/articles:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      )
    }

    const result = await databaseService.deleteArticle(id)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error?.includes('not found') ? 404 : 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Error in DELETE /api/cms/articles:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
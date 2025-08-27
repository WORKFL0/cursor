import { NextRequest, NextResponse } from 'next/server'
import { Article } from '@/lib/supabase/client'
import { ArticleService } from '@/lib/services/article-service'
import { getMockArticles } from '@/lib/data/mock-articles'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const published = searchParams.get('published')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0

    const filters = {
      published: published === 'true' ? true : published === 'false' ? false : undefined,
      category: category || undefined,
      search: search || undefined,
      featured: featured === 'true' ? true : undefined,
      limit,
      offset
    }

    const result = await ArticleService.getArticles(filters)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in GET /api/cms/articles:', error)
    // Always fall back to mock data on error
    const articles = getMockArticles({ limit: 10 })
    return NextResponse.json({
      articles: articles,
      count: articles.length,
      success: true,
      warning: 'Using mock data due to server error'
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Article = await request.json()
    
    const result = await ArticleService.createArticle(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.warning || 'Failed to create article' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      article: result.articles[0],
      success: result.success,
      useClientStorage: result.useClientStorage,
      warning: result.warning
    })
  } catch (error: any) {
    console.error('Error in POST /api/cms/articles:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create article' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: Article = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      )
    }
    
    const result = await ArticleService.updateArticle(id, updateData)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.warning || 'Failed to update article' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      article: result.articles[0],
      success: result.success,
      useClientStorage: result.useClientStorage,
      warning: result.warning
    })
  } catch (error: any) {
    console.error('Error in PUT /api/cms/articles:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update article' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      )
    }
    
    const result = await ArticleService.deleteArticle(id)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.warning || 'Failed to delete article' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: result.success,
      useClientStorage: result.useClientStorage,
      warning: result.warning
    })
  } catch (error: any) {
    console.error('Error in DELETE /api/cms/articles:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete article' },
      { status: 500 }
    )
  }
}
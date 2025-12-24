import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase'

/**
 * GET /api/public/blog - Get published blog posts (public access)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')

    const supabase = getServerSupabaseClient()

    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(name, slug, color),
        author:blog_authors(display_name, avatar_url, bio)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    // Filter by category if provided
    if (category) {
      const { data: categoryData } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('slug', category)
        .single()

      if (categoryData) {
        query = query.eq('category_id', categoryData.id)
      }
    }

    // Filter by tag if provided
    if (tag) {
      query = query.contains('tags', [tag])
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching blog posts:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      posts: data || [],
      total: count || 0,
      limit,
      offset
    })
  } catch (error: any) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

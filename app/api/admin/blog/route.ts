import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase'
import type { CreateBlogPostInput } from '@/types/blog'

/**
 * Validate admin authentication
 */
async function validateAdminAuth(request: NextRequest): Promise<boolean> {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return false
    }

    const supabase = getServerSupabaseClient()

    const { data: session } = await supabase
      .from('admin_sessions')
      .select('*')
      .eq('token', token)
      .single()

    if (!session) {
      return false
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      return false
    }

    return true
  } catch {
    return false
  }
}

/**
 * POST /api/admin/blog - Create a new blog post
 */
export async function POST(request: NextRequest) {
  try {
    // Validate admin authentication
    const isAuthenticated = await validateAdminAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = getServerSupabaseClient()
    const body: CreateBlogPostInput = await request.json()

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', body.slug || '')
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'A post with this slug already exists', code: 'DUPLICATE_SLUG' },
        { status: 409 }
      )
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('Error creating blog post:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create blog post' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/blog - List all blog posts (admin view)
 */
export async function GET(request: NextRequest) {
  try {
    // Validate admin authentication
    const isAuthenticated = await validateAdminAuth(request)
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = getServerSupabaseClient()

    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(name, color),
        author:blog_authors(display_name)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching blog posts:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ posts: data || [] })
  } catch (error: any) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

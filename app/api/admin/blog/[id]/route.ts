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
 * GET /api/admin/blog/[id] - Get a single blog post by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params

    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:blog_authors(*),
        category:blog_categories(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching blog post:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/blog/[id] - Update a blog post
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params
    const body: Partial<CreateBlogPostInput> = await request.json()

    const { data, error } = await supabase
      .from('blog_posts')
      .update(body)
      .eq('id', id)
      .select(`
        *,
        author:blog_authors(*),
        category:blog_categories(*)
      `)
      .single()

    if (error) {
      console.error('Error updating blog post:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/blog/[id] - Delete a blog post
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting blog post:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}

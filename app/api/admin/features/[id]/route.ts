import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase'
import type { CreateFeatureInput } from '@/types/features'

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
 * GET /api/admin/features/[id] - Get a single feature by ID
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
      .from('features')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching feature:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Feature not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching feature:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch feature' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/features/[id] - Update a feature
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
    const body: Partial<CreateFeatureInput> = await request.json()

    const { data, error } = await supabase
      .from('features')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating feature:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error updating feature:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update feature' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/features/[id] - Delete a feature
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
      .from('features')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting feature:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting feature:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete feature' },
      { status: 500 }
    )
  }
}

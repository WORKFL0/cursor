import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase'
import type { CreateCaseStudyInput } from '@/types/cases'

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
 * GET /api/admin/cases/[id] - Get a single case study by ID
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
      .from('case_studies')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching case study:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Case study not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching case study:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch case study' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/cases/[id] - Update a case study
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
    const body: Partial<CreateCaseStudyInput> = await request.json()

    const { data, error } = await supabase
      .from('case_studies')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating case study:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error updating case study:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update case study' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/cases/[id] - Delete a case study
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
      .from('case_studies')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting case study:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting case study:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete case study' },
      { status: 500 }
    )
  }
}

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
 * GET /api/admin/features - Get all features (for admin)
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')

    let query = supabase
      .from('features')
      .select('*', { count: 'exact' })
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      features: data || [],
      total: count || 0,
    })
  } catch (error: any) {
    console.error('Error fetching features:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch features' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/features - Create a new feature
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
    const body: CreateFeatureInput = await request.json()

    const { data, error } = await supabase
      .from('features')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('Error creating feature:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error creating feature:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create feature' },
      { status: 500 }
    )
  }
}

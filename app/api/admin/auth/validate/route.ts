import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase'
import type { ValidateSessionResponse, AdminUser } from '@/types/admin'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json<ValidateSessionResponse>(
        { valid: false, error: 'Geen token gevonden' },
        { status: 401 }
      )
    }

    const supabase = getServerSupabaseClient()

    // Get session
    const { data: session, error: sessionError } = await supabase
      .from('admin_sessions')
      .select('*')
      .eq('token', token)
      .single()

    if (sessionError || !session) {
      return NextResponse.json<ValidateSessionResponse>(
        { valid: false, error: 'Ongeldige sessie' },
        { status: 401 }
      )
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      // Delete expired session
      await supabase.from('admin_sessions').delete().eq('id', session.id)

      return NextResponse.json<ValidateSessionResponse>(
        { valid: false, error: 'Sessie verlopen' },
        { status: 401 }
      )
    }

    // Get user
    const { data: user, error: userError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', session.user_id)
      .single()

    if (userError || !user) {
      return NextResponse.json<ValidateSessionResponse>(
        { valid: false, error: 'Gebruiker niet gevonden' },
        { status: 401 }
      )
    }

    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json<ValidateSessionResponse>(
        { valid: false, error: 'Account is gedeactiveerd' },
        { status: 401 }
      )
    }

    // Remove password_hash from response
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json<ValidateSessionResponse>({
      valid: true,
      user: userWithoutPassword as AdminUser,
    })
  } catch (error) {
    console.error('Validate error:', error)
    return NextResponse.json<ValidateSessionResponse>(
      { valid: false, error: 'Er is een fout opgetreden' },
      { status: 500 }
    )
  }
}

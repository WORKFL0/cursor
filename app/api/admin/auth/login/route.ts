import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getServerSupabaseClient } from '@/lib/supabase'
import type { LoginRequest, LoginResponse, AdminUser } from '@/types/admin'

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json<LoginResponse>(
        { success: false, error: 'Email en wachtwoord zijn verplicht' },
        { status: 400 }
      )
    }

    const supabase = getServerSupabaseClient()

    // Get user by email
    const { data: user, error: userError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    if (userError || !user) {
      return NextResponse.json<LoginResponse>(
        { success: false, error: 'Ongeldige inloggegevens' },
        { status: 401 }
      )
    }

    // Check if user is active
    if (!(user as any).is_active) {
      return NextResponse.json<LoginResponse>(
        { success: false, error: 'Account is gedeactiveerd' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, (user as any).password_hash)

    if (!isValidPassword) {
      return NextResponse.json<LoginResponse>(
        { success: false, error: 'Ongeldige inloggegevens' },
        { status: 401 }
      )
    }

    // Generate session token
    const token = generateToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    // Create session
    const { error: sessionError } = await (supabase.from('admin_sessions') as any)
      .insert({
        user_id: (user as any).id,
        token,
        expires_at: expiresAt.toISOString(),
        ip_address: (request as any).ip || request.headers.get('x-forwarded-for'),
        user_agent: request.headers.get('user-agent'),
      } as any)

    if (sessionError) {
      console.error('Session creation error:', sessionError)
      return NextResponse.json<LoginResponse>(
        { success: false, error: 'Fout bij het aanmaken van sessie' },
        { status: 500 }
      )
    }

    // Update last login
    await (supabase.from('admin_users') as any)
      .update({
        last_login_at: new Date().toISOString(),
        login_count: (user as any).login_count + 1,
      } as any)
      .eq('id', (user as any).id)

    // Log activity
    await (supabase as any).rpc('log_admin_activity', {
      p_user_id: (user as any).id,
      p_action: 'login',
      p_ip_address: (request as any).ip || request.headers.get('x-forwarded-for'),
      p_user_agent: request.headers.get('user-agent'),
    })

    // Remove password_hash from response
    const { password_hash, ...userWithoutPassword } = user as any

    return NextResponse.json<LoginResponse>({
      success: true,
      token,
      user: userWithoutPassword as AdminUser,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json<LoginResponse>(
      { success: false, error: 'Er is een fout opgetreden' },
      { status: 500 }
    )
  }
}

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

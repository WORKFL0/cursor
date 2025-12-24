import { NextRequest, NextResponse } from 'next/server'
import { CMSAuthService } from '@/lib/auth/cms-auth'
import { LoginCredentials } from '@/lib/types/database'

export async function POST(request: NextRequest) {
  try {
    const body: LoginCredentials = await request.json()
    
    // Validate input
    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Attempt login
    const result = await CMSAuthService.login(body)
    
    if (!result.success || !result.session) {
      return NextResponse.json(
        { success: false, error: result.error || 'Login failed' },
        { status: 401 }
      )
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: result.user!.id,
        username: result.user!.username,
        email: result.user!.email,
        role: result.user!.role,
        first_name: result.user!.first_name,
        last_name: result.user!.last_name,
        avatar_url: result.user!.avatar_url,
        last_login_at: result.user!.last_login_at
      },
      message: 'Login successful'
    })

    // Set session cookie
    const maxAge = body.remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 days or 24 hours
    CMSAuthService.setSessionCookie(response, result.session.session_token, maxAge)

    return response
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
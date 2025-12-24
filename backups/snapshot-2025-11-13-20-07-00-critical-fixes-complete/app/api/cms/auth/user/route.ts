import { NextRequest, NextResponse } from 'next/server'
import { CMSAuthService } from '@/lib/auth/cms-auth'

export async function GET(request: NextRequest) {
  try {
    const authResult = await CMSAuthService.requireAuth(request)
    
    if (authResult instanceof NextResponse) {
      return authResult // Auth failed
    }

    const { user } = authResult

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar_url: user.avatar_url,
        last_login_at: user.last_login_at,
        is_active: user.is_active
      }
    })
  } catch (error) {
    console.error('Get user API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
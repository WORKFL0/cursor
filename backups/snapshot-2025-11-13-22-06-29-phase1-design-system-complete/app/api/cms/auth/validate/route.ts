import { NextRequest, NextResponse } from 'next/server'
import { CMSAuthService } from '@/lib/auth/cms-auth'

export async function GET(request: NextRequest) {
  try {
    const authResult = await CMSAuthService.requireAuth(request)
    
    if (authResult instanceof NextResponse) {
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    return NextResponse.json({ 
      valid: true,
      user: {
        id: authResult.user.id,
        username: authResult.user.username,
        role: authResult.user.role
      }
    })
  } catch (error) {
    console.error('Validate session API error:', error)
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}
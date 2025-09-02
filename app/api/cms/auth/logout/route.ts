import { NextRequest, NextResponse } from 'next/server'
import { CMSAuthService } from '@/lib/auth/cms-auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('cms-session')
    
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'No active session' },
        { status: 400 }
      )
    }

    // Logout user
    const result = await CMSAuthService.logout(sessionCookie.value)
    
    // Create response
    const response = NextResponse.json({
      success: result.success,
      message: result.success ? 'Logout successful' : result.error
    })

    // Clear session cookie
    if (result.success) {
      CMSAuthService.clearSessionCookie(response)
    }

    return response
  } catch (error) {
    console.error('Logout API error:', error)
    const response = NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
    
    // Always clear cookie on error
    CMSAuthService.clearSessionCookie(response)
    return response
  }
}
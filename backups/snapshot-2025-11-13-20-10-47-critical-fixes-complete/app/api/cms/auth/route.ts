import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// In production, use environment variables for credentials
const ADMIN_USERNAME = process.env.CMS_ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD || 'Workflo2024!' // Change this!

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Check credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Set authentication cookie
      const cookieStore = await cookies()
      cookieStore.set('cms-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/'
      })

      return NextResponse.json({ 
        success: true,
        user: {
          username: ADMIN_USERNAME,
          role: 'admin'
        }
      })
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  // Logout - remove cookie
  const cookieStore = await cookies()
  cookieStore.delete('cms-auth')
  
  return NextResponse.json({ success: true })
}

export async function GET() {
  // Check if authenticated
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('cms-auth')
  
  if (authCookie?.value === 'authenticated') {
    // Return user data along with authentication status
    return NextResponse.json({ 
      authenticated: true,
      user: {
        username: ADMIN_USERNAME,
        role: 'admin'
      }
    })
  }
  
  return NextResponse.json({ authenticated: false })
}
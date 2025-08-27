import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Protect CMS routes (except login page)
  if (request.nextUrl.pathname.startsWith('/cms') && 
      !request.nextUrl.pathname.startsWith('/cms/login')) {
    const authCookie = request.cookies.get('cms-auth')
    
    // If not authenticated, redirect to login
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/cms/login', request.url))
    }
  }

  // Protect CMS API routes (except auth and status)
  if (request.nextUrl.pathname.startsWith('/api/cms') && 
      !request.nextUrl.pathname.startsWith('/api/cms/auth') &&
      !request.nextUrl.pathname.startsWith('/api/cms/status')) {
    const authCookie = request.cookies.get('cms-auth')
    
    // If not authenticated, return 401
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/cms/:path*', '/api/cms/:path*']
}
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  console.log('Middleware called for path:', request.nextUrl.pathname)
  console.log('Token present:', !!token)

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      console.log('No token, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }
    console.log('Token present, allowing access to dashboard')
    return NextResponse.next()
  }

  if (request.nextUrl.pathname === '/login' && token) {
    console.log('Token present on login page, redirecting to dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
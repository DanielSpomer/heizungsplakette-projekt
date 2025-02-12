import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  console.log('Middleware called for path:', request.nextUrl.pathname) // Logging
  console.log('Token present:', !!token) // Logging

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      console.log('No token, redirecting to login') // Logging
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      jwt.verify(token, JWT_SECRET)
      console.log('Token verified, allowing access to dashboard') // Logging
      return NextResponse.next()
    } catch (error) {
      console.log('Invalid token, redirecting to login') // Logging
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (request.nextUrl.pathname === '/login' && token) {
    try {
      jwt.verify(token, JWT_SECRET)
      console.log('Valid token on login page, redirecting to dashboard') // Logging
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch (error) {
      console.log('Invalid token on login page') // Logging
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
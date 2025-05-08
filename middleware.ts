import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  console.log('Middleware called for path:', request.nextUrl.pathname)
  console.log('Token present:', !!token)
  const hostname = request.headers.get('host')

  if (hostname === 'finetuning.heizungsplakette.de') {
    // Create a new URL object from the request URL
    const url = new URL(request.url)
    
    // Change the pathname to /direct
    url.pathname = '/direct'
    
    // Return rewritten URL while preserving the original hostname
    return NextResponse.rewrite(url)
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Allow access to dashboard regardless of token
    console.log('Allowing access to dashboard')
    return NextResponse.next()
  }

  if (request.nextUrl.pathname === '/login') {
    // Redirect /login to /dashboard
    console.log('Redirecting /login to /dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'], // Keep /login in matcher to handle the redirect
}
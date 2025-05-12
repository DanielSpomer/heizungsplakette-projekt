import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// It's a good practice to get your JWT secret from environment variables
// const JWT_SECRET = process.env.JWT_SECRET;

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  console.log('Middleware called for path:', pathname)
  console.log('Token present:', !!token)
  const hostname = request.headers.get('host')

  // Handling for finetuning.heizungsplakette.de subdomain
  if (hostname === 'finetuning.heizungsplakette.de') {
    const url = new URL(request.url)
    url.pathname = '/direct'
    console.log(`Rewriting ${hostname} to /direct`)
    return NextResponse.rewrite(url)
  }

  // Protect the dashboard route
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      // No token, redirect to login
      console.log('No token, redirecting to /login from middleware for /dashboard access');
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectedFrom', pathname) // Optional: pass where the user was going
      return NextResponse.redirect(loginUrl)
    }
    // Token exists, allow access to dashboard (further verification can happen on the page or API if needed for token validity)
    console.log('Token exists, allowing access to /dashboard from middleware');
    return NextResponse.next()
  }

  // Handle the login page
  if (pathname === '/login') {
    if (token) {
      // Already has a token, redirect to dashboard
      console.log('Token exists, redirecting to /dashboard from middleware for /login access');
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // No token, allow access to login page
    console.log('No token, allowing access to /login from middleware');
    return NextResponse.next()
  }

  // For any other routes, allow access
  return NextResponse.next()
}

export const config = {
  // Apply middleware to /dashboard and /login paths
  // Removed /:path* as it was too broad if you have other top-level routes not needing this auth logic
  matcher: ['/dashboard/:path*', '/login'], 
}
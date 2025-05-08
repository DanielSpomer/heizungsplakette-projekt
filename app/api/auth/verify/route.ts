import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: Request) {
  const token = request.headers.get('Cookie')?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1]

  if (!token) {
    return NextResponse.json({ isAuthenticated: false, message: 'No token found' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return NextResponse.json({ isAuthenticated: true, user: decoded })
  } catch (error: unknown) {
    console.log('Token verification failed:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ isAuthenticated: false, message: 'Invalid token' })
  }
}
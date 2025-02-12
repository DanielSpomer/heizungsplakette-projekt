import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: Request) {
  const token = request.headers.get('Cookie')?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1]

  console.log('Checking auth status')
  console.log('Token present:', !!token)

  if (!token) {
    return NextResponse.json({ isAuthenticated: false, message: 'No token found' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log('Token verified:', decoded)
    return NextResponse.json({ isAuthenticated: true, user: decoded })
  } catch (error) {
    console.log('Token verification failed:', error.message)
    return NextResponse.json({ isAuthenticated: false, message: 'Invalid token' })
  }
}
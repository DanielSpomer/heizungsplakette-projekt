import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  console.log('Login attempt:', username) // Logging

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    console.log('Credentials correct, generating token') // Logging
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' })

    const response = NextResponse.json({ success: true, message: 'Login successful' })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
      path: '/',
    })

    console.log('Token generated and set in cookie') // Logging
    return response
  }

  console.log('Invalid credentials') // Logging
  return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
}
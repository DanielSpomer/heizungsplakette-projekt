import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  console.log('Login attempt:', username)
  console.log('ADMIN_USERNAME:', process.env.ADMIN_USERNAME)
  console.log('Password match:', password === process.env.ADMIN_PASSWORD)

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    console.log('Credentials correct, generating token')
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '30m' })

    const response = NextResponse.json({ success: true, message: 'Login successful' })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 900, // 15 minutes in seconds (changed from 3600)
      path: '/',
    })

    console.log('Token generated and set in cookie')
    return response
  }

  console.log('Invalid credentials')
  return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
}
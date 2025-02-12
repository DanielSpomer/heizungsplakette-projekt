import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: Request) {
  const token = request.headers.get('Cookie')?.split('; ').find(row => row.startsWith('token='))?.split('=')[1]

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  try {
    jwt.verify(token, JWT_SECRET)
    return NextResponse.json({ authenticated: true })
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
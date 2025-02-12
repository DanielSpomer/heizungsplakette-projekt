// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';

const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  // In a real application, you would validate against a database
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = sign(
      { username },
      process.env.JWT_SECRET!,
      { expiresIn: MAX_AGE }
    );

    const serialized = serialize('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: MAX_AGE,
      path: '/',
    });

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Set-Cookie': serialized },
    });
  }

  return new NextResponse(JSON.stringify({ success: false }), {
    status: 401,
  });
}
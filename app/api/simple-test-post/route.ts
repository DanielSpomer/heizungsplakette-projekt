import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('[DEBUG] POST request received for /api/simple-test-post');
  try {
    const body = await request.json().catch(() => ({})); // Try to parse body, default to empty if not JSON
    console.log('[DEBUG] /api/simple-test-post request body:', body);
    return NextResponse.json({ message: 'POST request to /api/simple-test-post was successful!', receivedBody: body });
  } catch (e) {
    console.error("[DEBUG] Error in /api/simple-test-post:", e);
    return NextResponse.json({ error: "Failed to process POST request in simple-test-post", details: (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
}

export async function GET(request: Request) {
  console.log('[DEBUG] GET request received for /api/simple-test-post');
  return NextResponse.json({ message: 'GET request to /api/simple-test-post was successful!' });
} 
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const timestamp = new Date().toISOString();
  console.log(`[API STATIC TEST GET] Received GET request at ${timestamp}`);
  return NextResponse.json({
    message: "GET request successfully received for static-test-pdf-update route",
    timestamp: timestamp
  });
}

// Placeholder for PUT if GET works
export async function PUT(request: Request) {
  const timestamp = new Date().toISOString();
  console.log(`[API STATIC TEST PUT] Received PUT request at ${timestamp}`);
  try {
    const body = await request.json();
    console.log("[API STATIC TEST PUT] Parsed body:", body);
    return NextResponse.json({
      message: "PUT request successfully received for static-test-pdf-update route",
      receivedData: body,
      timestamp: timestamp
    });
  } catch (error: unknown) {
    console.error('[API STATIC TEST PUT] Error parsing request body:', error);
    if (error instanceof SyntaxError) {
         return NextResponse.json({ error: 'Ungültiger JSON-Body oder leerer Body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Fehler beim Parsen der Anfrage', details: (error instanceof Error) ? error.message : String(error) }, { status: 400 });
  }
} 
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  console.log(`[DEBUG] POST request received for /api/heizungsplakette/${id}/update-pdf-url`);
  try {
    const body = await request.json();
    console.log(`[DEBUG] Request body:`, body);
    return NextResponse.json({ message: `POST request received for ID ${id}`, receivedBody: body });
  } catch (e) {
    console.error("[DEBUG] Error parsing JSON body or processing request:", e);
    return NextResponse.json({ error: "Failed to process POST request", details: (e instanceof Error ? e.message : String(e)) }, { status: 400 });
  }
}

// You can add other methods if you want to test them too, e.g.:
// export async function GET(request: Request, { params }: { params: { id: string } }) {
//   const { id } = params;
//   console.log(`[DEBUG] GET request received for /api/heizungsplakette/${id}/update-pdf-url`);
//   return NextResponse.json({ message: `GET request received for ID ${id}` });
// } 
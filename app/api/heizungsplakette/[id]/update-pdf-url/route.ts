import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const timestamp = new Date().toISOString();
  console.log(`[NEW DYNAMIC ROUTE] GET request for ID: ${params.id} at ${timestamp}`);
  return NextResponse.json({
    message: `SUCCESS: GET for ID ${params.id}`,
    id: params.id,
    timestamp: timestamp
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const timestamp = new Date().toISOString();
  console.log(`[NEW DYNAMIC ROUTE] PUT request for ID: ${params.id} at ${timestamp}`);
  let bodyContent;
  try {
    bodyContent = await request.json();
    console.log('[NEW DYNAMIC ROUTE] Parsed PUT body:', bodyContent);
  } catch (e) {
    bodyContent = 'Could not parse PUT body or body was empty';
    console.log('[NEW DYNAMIC ROUTE] Error parsing PUT body or body empty.');
  }
  return NextResponse.json({
    message: `SUCCESS: PUT for ID ${params.id}`,
    receivedBody: bodyContent,
    timestamp: timestamp
  });
}

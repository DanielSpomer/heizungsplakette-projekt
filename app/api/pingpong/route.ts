import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const timestamp = new Date().toISOString();
  console.log(`[PINGPONG API] GET request received at ${timestamp}`);
  return NextResponse.json({
    message: 'Pong from GET!',
    timestamp: timestamp
  });
}

export async function PUT(request: Request) {
  const timestamp = new Date().toISOString();
  console.log(`[PINGPONG API] PUT request received at ${timestamp}`);
  let bodyContent;
  try {
    bodyContent = await request.json();
    console.log('[PINGPONG API] Parsed PUT body:', bodyContent);
  } catch (e) {
    bodyContent = 'Could not parse PUT body or body was empty';
    console.log('[PINGPONG API] Error parsing PUT body or body empty.');
  }
  return NextResponse.json({
    message: 'Pong from PUT!',
    receivedBody: bodyContent,
    timestamp: timestamp
  });
}

export async function POST(request: Request) {
  const timestamp = new Date().toISOString();
  console.log(`[PINGPONG API] POST request received at ${timestamp}`);
  let bodyContent;
  try {
    bodyContent = await request.json();
    console.log('[PINGPONG API] Parsed POST body:', bodyContent);
  } catch (e) {
    bodyContent = 'Could not parse POST body or body was empty';
    console.log('[PINGPONG API] Error parsing POST body or body empty.');
  }
  return NextResponse.json({
    message: 'Pong from POST!',
    receivedBody: bodyContent,
    timestamp: timestamp
  });
} 
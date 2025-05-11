// app/api/delete-blob/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';

export async function POST(req: NextRequest) {
  try {
    const { blobUrl } = await req.json();

    if (!blobUrl) {
      return NextResponse.json({ error: 'Missing blobUrl' }, { status: 400 });
    }

    await del(blobUrl);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json({ error: 'Failed to delete blob' }, { status: 500 });
  }
}

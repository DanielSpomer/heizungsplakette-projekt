import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      return NextResponse.json({ error: 'No BLOB_READ_WRITE_TOKEN in env' }, { status: 500 });
    }
    // Extract the pathname from the URL
    const match = url.match(/https:\/\/(.*?)\.blob\.vercel-storage\.com\/(.+)/);
    if (!match) {
      return NextResponse.json({ error: 'Invalid blob URL' }, { status: 400 });
    }
    const storeId = match[1];
    const pathname = match[2];
    const deleteUrl = `https://${storeId}.blob.vercel-storage.com/${pathname}`;
    const res = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${blobToken}`,
        'x-api-version': '6',
      },
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `Blob delete failed: ${text}` }, { status: res.status });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : 'Unknown error') }, { status: 500 });
  }
} 
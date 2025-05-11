import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs'; // Example for authentication

export async function POST(request: Request): Promise<NextResponse> {
  // Parse multipart/form-data
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const oldUrl = formData.get('oldUrl') as string | null;
  const pathname = formData.get('pathname') as string | null;

  if (!file || !pathname) {
    return NextResponse.json({ error: 'Missing file or pathname' }, { status: 400 });
  }

  // Handle old blob deletion if oldUrl is provided
  if (oldUrl) {
    try {
      const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
      if (!blobToken) {
        return NextResponse.json({ error: 'No BLOB_READ_WRITE_TOKEN in env' }, { status: 500 });
      }
      const match = oldUrl.match(/https:\/\/(.*?)\.blob\.vercel-storage\.com\/(.+)/);
      if (!match) {
        return NextResponse.json({ error: 'Invalid old blob URL' }, { status: 400 });
      }
      const storeId = match[1];
      const oldPathname = match[2];
      const deleteUrl = `https://${storeId}.blob.vercel-storage.com/${oldPathname}`;
      const res = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${blobToken}`,
          'x-api-version': '6',
        },
      });
      if (!res.ok && res.status !== 404 && res.status !== 405) {
        const text = await res.text();
        return NextResponse.json({ error: `Old blob delete failed: ${text}` }, { status: res.status });
      }
      // If 404 or 405, treat as success (idempotent delete)
    } catch (error) {
      return NextResponse.json({ error: (error instanceof Error ? error.message : 'Unknown error deleting old blob') }, { status: 500 });
    }
  }

  try {
    // Use Vercel Blob SDK's put function to upload the new file
    const blob = await put(pathname, file, { access: 'public' });
    return NextResponse.json(blob);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : 'Unknown error uploading blob') }, { status: 500 });
  }
} 
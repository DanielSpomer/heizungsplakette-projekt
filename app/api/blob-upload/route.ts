import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
// import { auth } from '@clerk/nextjs'; // Example for authentication

export async function POST(request: Request): Promise<NextResponse> {
  // Parse multipart/form-data
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const oldUrl = formData.get('oldUrl') as string | null;
  let pathname = formData.get('pathname') as string | null;
  const itemId = formData.get('itemId') as string | null;

  if (!file || !pathname) {
    return NextResponse.json({ error: 'Missing file or pathname' }, { status: 400 });
  }

  // Always use a unique filename for new PDFs
  if (itemId) {
    const timestamp = Date.now();
    pathname = `pdfs/heizungsplakette-${itemId}-${timestamp}.pdf`;
  }

  // Try to delete the old blob if oldUrl is provided
  if (oldUrl) {
    try {
      const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
      if (!blobToken) {
        throw new Error('No BLOB_READ_WRITE_TOKEN in env');
      }
      const match = oldUrl.match(/https:\/\/(.*?)\.blob\.vercel-storage\.com\/(.+)/);
      if (!match) {
        throw new Error('Invalid old blob URL');
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
      // If not ok and not 404/405, log but continue
      if (!res.ok && res.status !== 404 && res.status !== 405) {
        const text = await res.text();
        console.warn(`Old blob delete failed: ${text}`);
      }
    } catch (error) {
      console.warn('Error deleting old blob:', error);
      // Continue anyway
    }
  }

  try {
    // Upload the new file with the unique filename
    const blob = await put(pathname, file, { access: 'public', allowOverwrite: false });

    // Always update the database with the new PDF URL if itemId is provided
    if (itemId) {
      try {
        await sql`
          UPDATE "Heizungsplakette"
          SET "pdfUrl" = ${blob.url}
          WHERE id = ${itemId}
        `;
      } catch (dbError) {
        console.error('Error updating database with PDF URL:', dbError);
        // Don't fail the whole request if DB update fails
      }
    }

    return NextResponse.json(blob);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : 'Unknown error uploading blob') }, { status: 500 });
  }
} 
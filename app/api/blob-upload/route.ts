import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { deleteBlobByUrl } from '@/lib/deleteBlob';
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

  let blob;
  try {
    // Upload the new file with the unique filename
    blob = await put(pathname, file, { access: 'public', allowOverwrite: false });

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
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : 'Unknown error uploading blob') }, { status: 500 });
  }

  // Try to delete the old blob using the Vercel Blob SDK's del function
  if (oldUrl) {
    await deleteBlobByUrl(oldUrl); 
  }

  return NextResponse.json(blob);
} 
import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { deleteBlobByUrl } from '@/lib/deleteBlob';
// import { auth } from '@clerk/nextjs'; // Example for authentication



export async function POST(request: Request): Promise<NextResponse> {
  console.log('⏳ Received POST request for blob upload');

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const oldUrl = formData.get('oldUrl') as string | null;
  let pathname = formData.get('pathname') as string | null;
  const itemId = formData.get('itemId') as string | null;

  console.log(`📥 FormData received -> itemId: ${itemId}, oldUrl: ${oldUrl}`);

  if (!file || !pathname) {
    console.warn('⚠️ Missing file or pathname');
    return NextResponse.json({ error: 'Missing file or pathname' }, { status: 400 });
  }

  if (itemId) {
    const timestamp = Date.now();
    pathname = `pdfs/heizungsplakette-${itemId}-${timestamp}.pdf`;
    console.log(`📄 Generated unique pathname: ${pathname}`);
  }

  let blob;
  try {
    console.log('📤 Uploading new blob...');
    blob = await put(pathname, file, { access: 'public', allowOverwrite: false });
    console.log(`✅ Upload successful: ${blob.url}`);

    if (itemId) {
      try {
        console.log(`📝 Updating database for itemId=${itemId}`);
        await sql`
          UPDATE "Heizungsplakette"
          SET "pdfUrl" = ${blob.url}
          WHERE id = ${itemId}
        `;
        console.log('✅ Database updated successfully');
      } catch (dbError) {
        console.error('❌ Error updating database with PDF URL:', dbError);
      }
    }
  } catch (error) {
    console.error('❌ Error during upload:', error);
    return NextResponse.json({ error: (error instanceof Error ? error.message : 'Unknown error uploading blob') }, { status: 500 });
  }

  if (oldUrl) {
    try {
      console.log(`🗑️ Attempting to delete old blob: ${oldUrl}`);
      await deleteBlobByUrl(oldUrl);
      console.log('✅ Old blob deleted');
    } catch (deleteError) {
      console.warn('⚠️ Failed to delete old blob:', deleteError);
    }
  }

  return NextResponse.json(blob);
}

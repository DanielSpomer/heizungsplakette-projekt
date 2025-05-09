import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs'; // Example for authentication

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        _pathname: string,
        /* clientPayload?: string | null */
      ) => {
        // This is where you would add authentication and authorization.
        // For example, using Clerk:
        // const { userId } = auth();
        // if (!userId) {
        //   throw new Error('Not authenticated');
        // }
        // console.log(`User ${userId} is trying to upload to ${pathname}`);

        // ⚠️ IMPORTANT: Authenticate and authorize users before generating the token.
        // Otherwise, you're allowing anonymous uploads.
        // For now, we are allowing anonymous uploads for demonstration.
        // In a real application, ensure only authenticated users can upload.

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'],
          tokenPayload: JSON.stringify({
            // Store any additional information you want to associate with the blob.
            // For example, a user ID if you have authentication:
            // userId: userId,
            // source: 'blob-upload-page' 
          }),
          addRandomSuffix: true, // Ensures unique filenames
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This callback is triggered after the blob is successfully uploaded.
        console.log('Blob upload completed:', blob);
        console.log('Token payload:', tokenPayload);

        // ⚠️ This callback might not work reliably on `localhost` development environments
        // because Vercel Blob needs to send a webhook to your server.
        // For local testing of this callback, consider using a tunneling service like ngrok.

        try {
          // Example: Update your database with the blob URL
          // if (tokenPayload) {
          //   const { userId } = JSON.parse(tokenPayload);
          //   // await db.users.update({ where: { id: userId }, data: { avatarUrl: blob.url } });
          // }
          console.log(`File ${blob.pathname} uploaded. URL: ${blob.url}`);
        } catch (error) {
          console.error('Error in onUploadCompleted:', error);
          // Even if this part fails, the file is already in the blob store.
          // You might want to add retry logic or error reporting here.
          throw new Error('Could not process upload completion: ' + (error as Error).message);
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Error in POST /api/blob-upload:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // Bad request
    );
  }
} 
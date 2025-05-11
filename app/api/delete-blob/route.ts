import { deleteBlobByUrl } from '@/lib/deleteBlob';

export async function POST(req: Request): Promise<Response> {
  const { blobUrl } = await req.json();

  try {
    await deleteBlobByUrl(blobUrl);
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    let errorMessage = 'Unknown error';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

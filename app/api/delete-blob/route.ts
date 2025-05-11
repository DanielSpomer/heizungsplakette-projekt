import { deleteBlobByUrl } from '@/lib/deleteBlob';

export async function POST(req: Request) {
  const { blobUrl } = await req.json();
  try {
    await deleteBlobByUrl(blobUrl);
    return new Response(JSON.stringify({ success: true }));
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

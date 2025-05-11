// app/lib/blob/deleteBlob.ts
import { del } from '@vercel/blob';

export async function deleteBlobByUrl(blobUrl: string) {
  if (!blobUrl) throw new Error('Missing blob URL');
  return await del(blobUrl);
}

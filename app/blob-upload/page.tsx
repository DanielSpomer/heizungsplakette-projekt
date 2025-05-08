'use client';

import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';

export default function BlobUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Upload File to Vercel Blob</h1>

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null); // Clear previous errors

          if (!inputFileRef.current?.files) {
            setError('No file selected');
            throw new Error('No file selected');
          }

          const file = inputFileRef.current.files[0];

          try {
            const newBlob = await upload(file.name, file, {
              access: 'public', // Files will be publicly accessible
              handleUploadUrl: '/api/blob-upload', // Our new API route
            });
            setBlob(newBlob);
          } catch (e) {
            console.error('Upload failed:', e);
            setError((e as Error).message || 'An unknown error occurred during upload.');
          }
        }}
      >
        <input name="file" ref={inputFileRef} type="file" required 
               style={{ display: 'block', marginBottom: '10px' }} />
        <button type="submit" 
                style={{ padding: '10px 15px', cursor: 'pointer' }}>
          Upload
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <p>Upload Error: {error}</p>
        </div>
      )}

      {blob && (
        <div style={{ marginTop: '20px' }}>
          <p>Blob uploaded successfully!</p>
          <p>
            URL: <a href={blob.url} target="_blank" rel="noopener noreferrer">{blob.url}</a>
          </p>
          <p>Pathname: {blob.pathname}</p>
          <p>Content Type: {blob.contentType}</p>
          <p>Content Disposition: {blob.contentDisposition}</p>
        </div>
      )}
    </div>
  );
} 
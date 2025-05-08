from http.server import BaseHTTPRequestHandler
import json
import os
import requests
from urllib.parse import urlparse, parse_qs
from datetime import datetime

# --- Vercel Blob Upload Function (Adapted) --- #
def upload_to_vercel_blob(file_bytes, filename):
    blob_rw_token = os.environ.get("BLOB_READ_WRITE_TOKEN")
    if not blob_rw_token:
        raise ValueError("BLOB_READ_WRITE_TOKEN environment variable not set.")
    try:
        parts = blob_rw_token.split('_')
        if len(parts) < 4 or parts[0] != 'vercel' or parts[1] != 'blob' or parts[2] != 'rw':
            raise ValueError("Invalid BLOB_READ_WRITE_TOKEN format.")
        store_id = parts[3]
    except Exception as e:
        raise ValueError(f"Could not parse BLOB_READ_WRITE_TOKEN: {e}")
        
    upload_url = f"https://{store_id}.blob.vercel-storage.com/{filename}"
    headers = {
        "Authorization": f"Bearer {blob_rw_token}",
        "x-api-version": "6", 
        "x-content-type": "text/plain", # Content type for simple text file
    }
    try:
        print(f"Attempting to upload to: {upload_url}")
        response = requests.put(upload_url, data=file_bytes, headers=headers)
        response.raise_for_status()
        blob_data = response.json()
        print(f"Upload successful: {blob_data}")
        return blob_data.get("url")
    except requests.exceptions.RequestException as e:
        print(f"Error uploading to Vercel Blob: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Blob API Response Status: {e.response.status_code}")
            print(f"Blob API Response Body: {e.response.text}")
        raise

# --- Serverless Handler --- #
class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # 1. Create simple file content
            now = datetime.now().isoformat()
            file_content = f"Hello from Blob Test! Timestamp: {now}"
            file_bytes = file_content.encode('utf-8')
            
            # 2. Define filename in the desired path
            filename = f"test/blob_test_{now.replace(':', '-').replace('.', '-')}.txt"
            
            # 3. Upload to Blob
            print(f"Uploading test file: {filename}")
            blob_url = upload_to_vercel_blob(file_bytes, filename)
            
            # 4. Return success response
            if blob_url:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response_data = {'message': 'Test file uploaded successfully!', 'url': blob_url}
                self.wfile.write(json.dumps(response_data).encode('utf-8'))
            else:
                 raise Exception("Blob upload failed, no URL returned.")
                 
        except Exception as e:
            print(f"ERROR in blob_upload_test: {str(e)}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = {'error': f'Failed to upload test file: {str(e)}'}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
        return 
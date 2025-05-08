from http.server import BaseHTTPRequestHandler
import json
import os
import requests
from datetime import datetime

# --- Vercel Blob Upload Function (Adapted) --- #
def upload_text_to_vercel_blob(text_content, filename):
    blob_rw_token = os.environ.get("BLOB_READ_WRITE_TOKEN")
    print(f"DEBUG: Using BLOB_READ_WRITE_TOKEN: {blob_rw_token[:20]}..." if blob_rw_token else "DEBUG: BLOB_READ_WRITE_TOKEN not found!")
    if not blob_rw_token:
        raise ValueError("BLOB_READ_WRITE_TOKEN environment variable not set.")
    try:
        parts = blob_rw_token.split('_')
        if len(parts) < 4 or parts[0] != 'vercel' or parts[1] != 'blob' or parts[2] != 'rw':
            raise ValueError("Invalid BLOB_READ_WRITE_TOKEN format.")
        store_id_original = parts[3] 
        store_id = store_id_original.lower() # Keep lowercase as per last attempt
        print(f"DEBUG: Extracted Store ID (Original): {store_id_original}") 
        print(f"DEBUG: Using Store ID (Lowercase): {store_id}")
    except Exception as e:
        raise ValueError(f"Could not parse BLOB_READ_WRITE_TOKEN: {e}")
        
    upload_url = f"https://{store_id}.blob.vercel-storage.com/{filename}"
    headers = {
        "Authorization": f"Bearer {blob_rw_token}",
        "x-api-version": "6", 
        "x-content-type": "text/plain",
    }
    try:
        print(f"Attempting to upload text to: {upload_url}")
        file_bytes = text_content.encode('utf-8')
        response = requests.put(upload_url, data=file_bytes, headers=headers)
        response.raise_for_status()
        blob_data = response.json()
        print(f"Text upload successful: {blob_data}")
        return blob_data.get("url")
    except requests.exceptions.RequestException as e:
        print(f"Error uploading text to Vercel Blob: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Blob API Response Status: {e.response.status_code}")
            print(f"Blob API Response Body: {e.response.text}")
        raise

# --- Serverless Handler --- #
class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # --- Network Sanity Check --- START ---
        try:
            print("DEBUG: Attempting network sanity check (google.com)")
            sanity_check = requests.get('https://google.com', timeout=5) # Short timeout
            sanity_check.raise_for_status()
            print(f"DEBUG: Network sanity check successful (Status: {sanity_check.status_code})")
        except Exception as sanity_e:
            print(f"ERROR: Network sanity check failed: {sanity_e}")
            # Optional: Decide if you want to fail the whole request here
            # self.send_response(500) ... etc ... return
        # --- Network Sanity Check --- END ---
        
        try:
            # 1. Create simple file content
            now = datetime.now().isoformat()
            file_content = f"Hello from Blob Test! Timestamp: {now}"
            
            # 2. Define filename in the desired path
            filename = f"test/simple_blob_test_{now.replace(':', '-').replace('.', '-')}.txt"
            
            # 3. Upload to Blob
            print(f"Uploading test file: {filename}")
            blob_url = upload_text_to_vercel_blob(file_content, filename)
            
            # 4. Return success response
            if blob_url:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response_data = {'message': 'Simple test file uploaded successfully!', 'url': blob_url}
                self.wfile.write(json.dumps(response_data).encode('utf-8'))
            else:
                 raise Exception("Simple blob upload failed, no URL returned.")
                 
        except Exception as e:
            print(f"ERROR in simple_blob_upload_test: {str(e)}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = {'error': f'Failed to upload simple test file: {str(e)}'}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
        return 
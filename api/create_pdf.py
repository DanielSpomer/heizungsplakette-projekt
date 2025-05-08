from http.server import BaseHTTPRequestHandler
import json
from urllib.parse import urlparse, parse_qs

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        query_params = parse_qs(parsed_path.query)
        
        item_id = "N/A"
        if 'id' in query_params:
            item_id = query_params['id'][0]

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        response_data = {'message': f'Minimal API /api/create_pdf reached successfully for ID: {item_id}'}
        self.wfile.write(json.dumps(response_data).encode('utf-8'))
        return 
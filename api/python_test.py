from http.server import BaseHTTPRequestHandler
import json
from urllib.parse import urlparse, parse_qs

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        query_params = parse_qs(parsed_path.query)
        
        name = "World" # Default name
        if 'name' in query_params:
            name = query_params['name'][0]
            
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        response_data = {'message': f'Hello, {name}, from your Python script!'}
        self.wfile.write(json.dumps(response_data).encode('utf-8'))
        return 
from http.server import BaseHTTPRequestHandler
import json
import os

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-API-Key')
        self.end_headers()
        return

    def do_POST(self):
        # Get API key from environment
        GARDEN_API_KEY = os.environ.get('GARDEN_API_KEY', '')
        
        # Check API key
        api_key = self.headers.get('X-API-Key', '')
        
        if not api_key or api_key != GARDEN_API_KEY:
            self.send_response(401)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "error": "Unauthorized",
                "message": "Valid API key required in X-API-Key header"
            }).encode())
            return
        
        # Parse request body
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length) if content_length > 0 else b'{}'
        
        try:
            data = json.loads(body)
            query_type = data.get('type', 'schema')
            
            # Mock GARDEN structure
            if query_type == 'schema':
                result = {
                    "schema": {
                        "nodes": ["contexts", "toolshed", "users", "projects"],
                        "relationships": ["CREATED", "USES", "DEPENDS_ON", "FORKED_FROM"]
                    }
                }
            else:
                result = {"message": f"Received query type: {query_type}"}
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

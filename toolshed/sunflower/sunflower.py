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
                "message": "Valid API key required"
            }).encode())
            return
        
        # Mock patterns
        PATTERNS = {
            "tool_cluster": "Groups of tools frequently used together",
            "user_journey": "Common paths through GARDEN tools",
            "cognitive_alignment": "Tools matching thinking patterns"
        }
        
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length) if content_length > 0 else b'{}'
        
        try:
            data = json.loads(body)
            pattern = data.get('pattern')
            
            if pattern and pattern in PATTERNS:
                result = {
                    "pattern": pattern,
                    "description": PATTERNS[pattern],
                    "status": "Analysis complete"
                }
            else:
                result = {"patterns": list(PATTERNS.keys())}
            
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

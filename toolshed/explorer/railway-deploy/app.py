"""
GARDEN Explorer API - Clean Railway Deployment
Always-on graph navigation service
"""

from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# Mock GARDEN data for proof of concept
GARDEN_DATA = {
    "schema": {
        "nodes": ["contexts", "toolshed", "patterns", "projects"],
        "relationships": ["CREATES", "USES", "CONTAINS", "DEPENDS_ON"]
    },
    "stats": {
        "node_count": 42,
        "relationship_count": 78,
        "last_updated": "2025-06-18T14:00:00Z"
    }
}

@app.route('/')
def health():
    return jsonify({
        "service": "GARDEN Explorer API",
        "status": "running",
        "version": "1.0"
    })

@app.route('/debug')
def debug():
    return jsonify({
        "env_api_key": os.environ.get('GARDEN_API_KEY', 'NOT_SET'),
        "all_env_vars": {k: v for k, v in os.environ.items() if 'GARDEN' in k}
    })

@app.route('/api/explorer', methods=['POST'])
def explorer():
    # Simple API key check
    api_key = request.headers.get('X-API-Key')
    expected_key = os.environ.get('GARDEN_API_KEY')
    
    # Debug info
    debug_info = {
        "received_key": api_key,
        "expected_key": expected_key,
        "match": api_key == expected_key if api_key and expected_key else False
    }
    
    if not api_key or api_key != expected_key:
        return jsonify({"error": "Invalid API key", "debug": debug_info}), 401
    
    data = request.get_json() or {}
    query_type = data.get('type', 'schema')
    
    if query_type == 'schema':
        return jsonify({
            "success": True,
            "data": GARDEN_DATA["schema"]
        })
    elif query_type == 'stats':
        return jsonify({
            "success": True, 
            "data": GARDEN_DATA["stats"]
        })
    else:
        return jsonify({
            "success": True,
            "message": f"Explorer received: {query_type}",
            "available_types": ["schema", "stats"]
        })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

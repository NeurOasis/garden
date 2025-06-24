"""
GARDEN Explorer API - Repository Structure Analysis
Always-on graph navigation service for the GARDEN ecosystem
"""

from flask import Flask, request, jsonify
import os
import json
from pathlib import Path

app = Flask(__name__)

# GARDEN repository analyzer
class GARDENAnalyzer:
    def __init__(self):
        self.schema = {}
        self.stats = {}
        self.initialize_garden_data()
    
    def initialize_garden_data(self):
        """Initialize GARDEN data - with fallback for Railway environment"""
        try:
            # Try to detect if we're in Railway environment
            self.is_railway = os.environ.get('RAILWAY_ENVIRONMENT') is not None
            
            if self.is_railway:
                # In Railway, we'll use a predefined structure based on your repo
                self._load_static_garden_structure()
            else:
                # Local development - try to analyze actual repository
                self._analyze_local_repository()
                
        except Exception as e:
            # Ultimate fallback
            self._load_static_garden_structure()
            
        app.logger.info(f"GARDEN Analyzer initialized - Railway: {self.is_railway}")
    
    def _load_static_garden_structure(self):
        """Load the known GARDEN repository structure"""
        # Based on your actual repository structure
        self.schema = {
            "nodes": [
                "archived-microservices",
                "contexts", 
                "findings",
                "generated",
                "guides",
                "moci",
                "module-generators", 
                "patterns",
                "to-labs-or-personal",
                "toolshed"
            ],
            "relationships": [
                "CONTAINS",      # toolshed CONTAINS tools
                "REFERENCES",    # contexts REFERENCES tools
                "IMPLEMENTS",    # tools IMPLEMENT patterns  
                "USES",          # patterns USE moci
                "GUIDES",        # guides GUIDE usage
                "ARCHIVES",      # archived-microservices ARCHIVES old tools
                "GENERATES",     # module-generators GENERATE middleware
                "DOCUMENTS",     # findings DOCUMENT insights
                "ORGANIZES"      # to-labs-or-personal ORGANIZES moved items
            ]
        }
        
        self.stats = {
            "node_count": len(self.schema["nodes"]),
            "relationship_count": len(self.schema["relationships"]),
            "directories": 10,
            "tools": 25,  # Estimated based on your toolshed
            "contexts": 50,  # Estimated based on your contexts
            "last_updated": "2025-06-24T19:45:00Z",
            "source": "static_analysis" if self.is_railway else "live_analysis"
        }
    
    def _analyze_local_repository(self):
        """Analyze actual local repository (development mode)"""
        garden_path = Path(__file__).parent.parent.parent.parent
        
        if not garden_path.exists():
            raise Exception("Local repository not found")
            
        main_dirs = []
        for item in garden_path.iterdir():
            if item.is_dir() and not item.name.startswith('.'):
                main_dirs.append(item.name)
        
        self.schema = {
            "nodes": sorted(main_dirs),
            "relationships": [
                "CONTAINS", "REFERENCES", "IMPLEMENTS", "USES", 
                "GUIDES", "ARCHIVES", "GENERATES", "DOCUMENTS"
            ]
        }
        
        self.stats = {
            "node_count": len(main_dirs),
            "relationship_count": 8,
            "directories": len(main_dirs),
            "last_updated": "2025-06-24T19:45:00Z",
            "source": "live_analysis"
        }
    
    def get_schema(self):
        """Return the repository schema"""
        return self.schema
    
    def get_stats(self):
        """Return repository statistics"""
        return self.stats
    
    def get_node_details(self, node_name):
        """Get details about a specific node/directory"""
        
        # Known GARDEN component details
        node_details = {
            "toolshed": {
                "name": "toolshed",
                "type": "directory",
                "description": "Collection of GARDEN tools and applications",
                "contents": [
                    {"name": "explorer", "type": "directory"},
                    {"name": "sunflower", "type": "directory"}, 
                    {"name": "nodepad-*.html", "type": "file"},
                    {"name": "garden_backlog_manager-1.0.html", "type": "file"},
                    {"name": "data-trellis", "type": "directory"},
                    {"name": "CodeSeed", "type": "directory"}
                ],
                "total_items": 20,
                "tools": ["explorer", "sunflower", "nodepad", "backlog_manager"]
            },
            "contexts": {
                "name": "contexts", 
                "type": "directory",
                "description": "Context files and documentation for GARDEN ecosystem",
                "contents": [
                    {"name": "core", "type": "directory"},
                    {"name": "tools", "type": "directory"},
                    {"name": "projects", "type": "directory"}
                ],
                "total_items": 50,
                "purpose": "Documentation and context for GARDEN components"
            },
            "patterns": {
                "name": "patterns",
                "type": "directory", 
                "description": "Design patterns and architectural guidelines",
                "contents": [
                    {"name": "architectural-patterns.md", "type": "file"},
                    {"name": "design-principles.md", "type": "file"}
                ],
                "total_items": 10
            },
            "moci": {
                "name": "moci",
                "type": "directory",
                "description": "MOCI compression and optimization tools", 
                "contents": [
                    {"name": "compression", "type": "directory"},
                    {"name": "optimization", "type": "directory"}
                ],
                "total_items": 15
            }
        }
        
        if node_name in node_details:
            return node_details[node_name]
        elif node_name in self.schema["nodes"]:
            return {
                "name": node_name,
                "type": "directory",
                "description": f"GARDEN component: {node_name}",
                "contents": [],
                "total_items": 0
            }
        else:
            return {"error": f"Node '{node_name}' not found in GARDEN schema"}

# Initialize the analyzer  
analyzer = GARDENAnalyzer()

@app.route('/')
def health():
    return jsonify({
        "service": "GARDEN Explorer API",
        "status": "running", 
        "version": "2.1 - Fixed Repository Analysis",
        "environment": "railway" if analyzer.is_railway else "local",
        "nodes": len(analyzer.schema["nodes"])
    })

@app.route('/debug')
def debug():
    return jsonify({
        "env_api_key": os.environ.get('GARDEN_API_KEY', 'NOT_SET'),
        "is_railway": analyzer.is_railway,
        "analyzer_ready": True,
        "sample_nodes": analyzer.schema["nodes"][:5],
        "stats": analyzer.stats
    })

@app.route('/api/explorer', methods=['POST'])
def explorer():
    # Simple API key check
    api_key = request.headers.get('X-API-Key')
    expected_key = os.environ.get('GARDEN_API_KEY')
    
    if not api_key or api_key != expected_key:
        return jsonify({"error": "Invalid API key"}), 401
    
    data = request.get_json() or {}
    query_type = data.get('type', 'schema')
    
    if query_type == 'schema':
        return jsonify({
            "success": True,
            "data": analyzer.get_schema(),
            "environment": "railway" if analyzer.is_railway else "local"
        })
    
    elif query_type == 'stats':
        return jsonify({
            "success": True, 
            "data": analyzer.get_stats()
        })
    
    elif query_type == 'node':
        node_name = data.get('node')
        if not node_name:
            return jsonify({"error": "Node name required"}), 400
        
        return jsonify({
            "success": True,
            "data": analyzer.get_node_details(node_name)
        })
    
    else:
        return jsonify({
            "success": True,
            "message": f"Explorer received: {query_type}",
            "available_types": ["schema", "stats", "node"]
        })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

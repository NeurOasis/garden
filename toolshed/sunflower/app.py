"""
Sunflower - Graph Database Visualization and Exploration
Part of the G.A.R.D.E.N. ecosystem

This application provides an interactive interface for visualizing
and exploring Neo4j graph databases that have been processed by
the Grasshopper Module Generator.
"""

import os
import sys
from flask import Flask, render_template, request, jsonify, redirect, url_for, session

# Add the module-generators/neo4j directory to the path
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
module_dir = os.path.join(parent_dir, 'generated')
sys.path.append(module_dir)

# Add PWD environment variable for Windows compatibility
if 'PWD' not in os.environ:
    os.environ['PWD'] = os.getcwd()

# Make utils directory accessible
utils_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'utils')
sys.path.append(utils_dir)

# Try to import the database manager
try:
    from db_manager import db_manager
    print("Successfully imported Database Manager")
except ImportError as e:
    print(f"Warning: Could not import Database Manager: {e}")
    print("Make sure you've created the db_manager.py file in the utils directory")
    sys.exit(1)

# Try to import the modulegenerator
try:
    # First make sure neo4j is installed
    import neo4j
    # Then import the generator
    from modulegenerator_claude import generate_module
    print("Successfully imported Module Generator")
    module_generator_available = True
except ImportError as e:
    print(f"Warning: Could not import Module Generator: {e}")
    print("Please make sure the 'neo4j' package is installed using 'pip install neo4j'")
    module_generator_available = False

# Initialize Flask application
app = Flask(__name__, 
            static_folder='static',
            template_folder='templates')

# Set a secret key for session management
app.secret_key = 'sunflower-secret-key'  # In production, use a proper secret key

# Home page route
@app.route('/')
def home():
    """Render the home page"""
    return render_template('index.html', title="Sunflower - Graph Explorer")

# Database connection settings route    
@app.route('/connect', methods=['GET', 'POST'])
def connect():
    if request.method == 'POST':
        uri = request.form.get('uri', 'bolt://localhost:7687')
        username = request.form.get('username', 'neo4j')
        password = request.form.get('password', 'sunflower')
        
        print(f"Form submitted with: URI={uri}, username={username}, password=****")
        
        try:
            # Try direct connection first
            from neo4j import GraphDatabase
            
            # Print the exact credentials we're using
            print(f"Attempting direct connection with: {uri}, {username}, password of length {len(password)}")
            
            driver = GraphDatabase.driver(uri, auth=(username, password))
            with driver.session() as neo4j_session:
                result = neo4j_session.run("RETURN 'Connected!' AS message")
                message = result.single()["message"]
                print(f"Direct connection succeeded: {message}")
            
            # Generate a connection name
            connection_name = f"connection_{uri.replace('://', '_').replace(':', '_').replace('/', '_')}"
            
            # Connect using the db_manager's connect method if module generator is available
            if module_generator_available:
                result = db_manager.connect(
                    uri=uri,
                    username=username,
                    password=password,
                    name=connection_name,
                    module_generator=generate_module
                )
                if not result['success']:
                    print(f"Warning: Module generation failed: {result['message']}")
                    # Continue anyway, we'll use direct database access
            
            # Store the connection name in the session
            session['current_connection'] = connection_name
            
            # Also store connection details in the session for direct access if needed
            session['connection_details'] = {
                'uri': uri,
                'username': username,
                'password': password
            }
            
            return jsonify({
                'success': True,
                'message': 'Connected successfully!',
                'redirect_url': '/dashboard'
            })
            
        except Exception as e:
            print(f"Connection error: {type(e).__name__}: {str(e)}")
            return jsonify({
                'success': False,
                'message': f'Connection failed: {str(e)}'
            })
    
    return render_template('connect.html', title="Connect to Database")

# Add this new method to get database info directly using connection details
def get_database_info_direct(connection_details):
    """Get database information directly using connection details."""
    try:
        from neo4j import GraphDatabase
        
        uri = connection_details['uri']
        username = connection_details['username']
        password = connection_details['password']
        
        driver = GraphDatabase.driver(uri, auth=(username, password))
        
        with driver.session() as session:
            # Get node count
            result = session.run("MATCH (n) RETURN count(n) AS node_count")
            node_count = result.single()["node_count"]
            
            # Get relationship count
            result = session.run("MATCH ()-[r]->() RETURN count(r) AS rel_count")
            rel_count = result.single()["rel_count"]
            
            # Get node labels
            result = session.run("CALL db.labels() YIELD label RETURN label")
            node_labels = [record["label"] for record in result]
            
            # Get relationship types
            result = session.run("CALL db.relationshipTypes() YIELD relationshipType RETURN relationshipType")
            relationship_types = [record["relationshipType"] for record in result]
            
            # Node count by label
            node_count_by_label = {}
            for label in node_labels:
                try:
                    query = f"MATCH (n:{label}) RETURN count(n) AS count"
                    result = session.run(query)
                    node_count_by_label[label] = result.single()["count"]
                except:
                    node_count_by_label[label] = 0
            
            # Relationship count by type
            rel_count_by_type = {}
            for rel_type in relationship_types:
                try:
                    query = f"MATCH ()-[r:{rel_type}]->() RETURN count(r) AS count"
                    result = session.run(query)
                    rel_count_by_type[rel_type] = result.single()["count"]
                except Exception as e:
                    print(f"Error counting relationship type {rel_type}: {str(e)}")
                    rel_count_by_type[rel_type] = 0
            
            # Combine total and type-specific counts
            relationship_counts = {'total': rel_count}
            relationship_counts.update(rel_count_by_type)
            
            return {
                'node_labels': node_labels,
                'relationship_types': relationship_types,
                'node_count': node_count_by_label,
                'relationship_count': relationship_counts
            }
    except Exception as e:
        print(f"Error getting direct database info: {str(e)}")
        return None

# Dashboard route
@app.route('/dashboard')
def dashboard():
    """Display the database dashboard"""
    current_connection = session.get('current_connection')
    connection_details = session.get('connection_details')
    
    if not current_connection and not connection_details:
        # No connection, redirect to connect page
        return redirect(url_for('connect'))
    
    # Try to get database info from the module first
    db_info = db_manager.get_database_info(current_connection)
    
    # If that fails, try direct database access
    if not db_info and connection_details:
        db_info = get_database_info_direct(connection_details)
    
    if not db_info:
        # Failed to get info, redirect to connect page
        return redirect(url_for('connect'))
    
    # Render the dashboard
    return render_template(
        'dashboard.html',
        title="Sunflower - Dashboard",
        connection=current_connection,
        db_info=db_info
    )
    
@app.route('/api/graph_data')
def api_graph_data():
    """Get data for graph visualization"""
    # Get parameters
    limit = request.args.get('limit', 100, type=int)
    node_labels = request.args.getlist('node_label') or []
    
    # Get current connection details
    connection_details = session.get('connection_details')
    if not connection_details:
        return jsonify({'success': False, 'message': 'No active connection'})
    
    try:
        # Connect to Neo4j
        from neo4j import GraphDatabase
        
        # Use stored connection details
        uri = connection_details.get('uri', 'bolt://localhost:7687')
        username = connection_details.get('username', 'neo4j')
        password = connection_details.get('password', '')
        
        driver = GraphDatabase.driver(uri, auth=(username, password))
        
        with driver.session() as db_session:
            # Build query based on selected labels
            if node_labels:
                where_clause = "WHERE " + " OR ".join([f"n:{label}" for label in node_labels])
            else:
                where_clause = ""
            
            # Query to get nodes and relationships with limit
            query = f"""
            MATCH (n)
            {where_clause}
            WITH n LIMIT {limit}
            MATCH (n)-[r]-(m)
            RETURN n, r, m
            LIMIT {limit * 3}
            """
            
            result = db_session.run(query)
            
            # Process results into graph data structure
            nodes = {}
            links = []
            
            for record in result:
                # Process source node
                source_node = record["n"]
                source_id = str(source_node.id)
                
                if source_id not in nodes:
                    nodes[source_id] = {
                        "id": source_id,
                        "labels": list(source_node.labels),
                        "properties": dict(source_node)
                    }
                
                # Process target node
                target_node = record["m"]
                target_id = str(target_node.id)
                
                if target_id not in nodes:
                    nodes[target_id] = {
                        "id": target_id,
                        "labels": list(target_node.labels),
                        "properties": dict(target_node)
                    }
                
                # Process relationship
                rel = record["r"]
                links.append({
                    "source": source_id,
                    "target": target_id,
                    "type": rel.type,
                    "properties": dict(rel)
                })
        
        # Convert nodes dictionary to list
        nodes_list = list(nodes.values())
        
        return jsonify({
            'success': True, 
            'data': {
                'nodes': nodes_list,
                'links': links
            }
        })
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': f'Error getting graph data: {str(e)}'})
        
@app.route('/patterns')
def patterns():
    """Display the pattern catalog"""
    connection_details = session.get('connection_details')
    
    if not connection_details:
        return redirect(url_for('connect'))
    
    # Use cached patterns if available
    if 'patterns' not in session or request.args.get('refresh') == 'true':
        from utils.pattern_detector import PatternDetector
        
        detector = PatternDetector(
            connection_details['uri'],
            connection_details['username'],
            connection_details['password']
        )
        
        try:
            patterns = detector.detect_all_patterns()
            session['patterns'] = patterns
        except Exception as e:
            print(f"Error detecting patterns: {str(e)}")
            return render_template(
                'error.html', 
                title="Error", 
                message=f"Error detecting patterns: {str(e)}"
            )
        finally:
            detector.close()
    else:
        patterns = session['patterns']
    
    return render_template(
        'patterns.html',
        title="Sunflower - Pattern Explorer",
        connection=connection_details['uri'],
        patterns=patterns
    )

@app.route('/patterns/<pattern_id>')
def pattern_detail(pattern_id):
    """Show details for a specific pattern"""
    connection_details = session.get('connection_details')
    
    if not connection_details or 'patterns' not in session:
        return redirect(url_for('patterns'))
    
    patterns = session.get('patterns', {})
    
    if pattern_id not in patterns:
        return redirect(url_for('patterns'))
    
    return render_template(
        'pattern_detail.html',
        title=f"Sunflower - {patterns[pattern_id]['name']}",
        pattern_id=pattern_id,
        pattern=patterns[pattern_id]
    )

@app.route('/api/pattern/<pattern_id>/<instance_id>')
def api_pattern_visualization(pattern_id, instance_id):
    """Get visualization data for a specific pattern instance"""
    connection_details = session.get('connection_details')
    
    if not connection_details:
        return jsonify({'success': False, 'message': 'No active connection'})
    
    from utils.pattern_detector import PatternDetector
    
    detector = PatternDetector(
        connection_details['uri'],
        connection_details['username'],
        connection_details['password']
    )
    
    try:
        result = detector.get_pattern_visualization_data(pattern_id, instance_id)
        return jsonify(result)
    finally:
        detector.close()

# API to get database info
@app.route('/api/database_info')
def api_database_info():
    """Get information about the connected database"""
    current_connection = session.get('current_connection')
    connection_details = session.get('connection_details')
    
    if not current_connection and not connection_details:
        return jsonify({'success': False, 'message': 'No active connection'})
    
    # Try to get database info from the module first
    db_info = db_manager.get_database_info(current_connection)
    
    # If that fails, try direct database access
    if not db_info and connection_details:
        db_info = get_database_info_direct(connection_details)
    
    if not db_info:
        return jsonify({'success': False, 'message': 'Failed to get database info'})
    
    return jsonify({'success': True, 'data': db_info})

if __name__ == '__main__':
    # Start the development server
    app.run(debug=True, port=5001)
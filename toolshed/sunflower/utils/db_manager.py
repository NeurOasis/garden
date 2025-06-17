"""
Database Manager Utility for Sunflower

Handles Neo4j database connections and module loading.
"""

import os
import sys
import importlib.util
import json

class DatabaseManager:
    """Manages database connections and generated modules."""
    
    def __init__(self):
        """Initialize the database manager."""
        self.connections = {}
        self.current_connection = None
        self.current_module = None
        
        # Load saved connections if available
        self.connections_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                                            'utils', 'connections.json')
        self.load_connections()
    
    def load_connections(self):
        """Load saved database connections."""
        try:
            if os.path.exists(self.connections_file):
                with open(self.connections_file, 'r') as f:
                    self.connections = json.load(f)
                print(f"Loaded {len(self.connections)} saved connections")
            else:
                print("No saved connections found")
        except Exception as e:
            print(f"Error loading connections: {e}")
    
    def save_connections(self):
        """Save database connections for future use."""
        try:
            with open(self.connections_file, 'w') as f:
                # Don't save passwords in plaintext for security
                safe_connections = {}
                for name, conn in self.connections.items():
                    safe_conn = conn.copy()
                    if 'password' in safe_conn:
                        safe_conn['password'] = '********'  # Mask password
                    safe_connections[name] = safe_conn
                
                json.dump(safe_connections, f, indent=4)
            print("Connections saved successfully")
        except Exception as e:
            print(f"Error saving connections: {e}")
    
    def connect(self, uri, username, password, name=None, module_generator=None):
        """
        Connect to a Neo4j database and generate a module.
        
        Parameters:
        -----------
        uri : str
            The URI for the Neo4j database
        username : str
            Username for authentication
        password : str
            Password for authentication
        name : str, optional
            Name for this connection
        module_generator : function, optional
            The generate_module function from the module generator
            
        Returns:
        --------
        dict
            Result with success status and message
        """
        try:
            if module_generator is None:
                return {
                    'success': False,
                    'message': 'Module Generator not available'
                }
            
            # Use a default name if none provided
            if name is None:
                name = f"connection_{len(self.connections) + 1}"
            
            # Create the module
            module_path = module_generator(
                uri=uri,
                username=username,
                password=password,
                graph=f"sunflower_{name.replace(' ', '_').lower()}"
            )
            
            # Store connection info
            self.connections[name] = {
                'uri': uri,
                'username': username,
                'password': password,  # In a production app, encrypt this!
                'module_path': module_path,
                'created': os.path.getmtime(module_path) if os.path.exists(module_path) else None
            }
            
            # Save connections
            self.save_connections()
            
            # Set as current connection
            self.current_connection = name
            
            return {
                'success': True,
                'message': f'Connected to database as "{name}"',
                'module_path': module_path
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Connection failed: {str(e)}'
            }
    
    def load_module(self, connection_name=None):
        """
        Load a generated module for a connection.
        
        Parameters:
        -----------
        connection_name : str, optional
            Name of the connection to load. If None, uses current connection.
            
        Returns:
        --------
        module or None
            The loaded module if successful, None otherwise
        """
        if connection_name is None:
            connection_name = self.current_connection
        
        if connection_name is None or connection_name not in self.connections:
            print(f"Connection {connection_name} not found")
            return None
        
        conn = self.connections[connection_name]
        if 'module_path' not in conn or not os.path.exists(conn['module_path']):
            print(f"Module not found for connection {connection_name}")
            return None
        
        try:
            # Import the module dynamically
            module_name = os.path.basename(conn['module_path'])[:-3]  # Remove .py extension
            spec = importlib.util.spec_from_file_location(module_name, conn['module_path'])
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            
            # Store as current module
            self.current_module = module
            return module
        except Exception as e:
            print(f"Error loading module: {e}")
            return None
    
    def get_database_info(self, connection_name=None):
        """Get information about the database schema."""
        module = self.load_module(connection_name)
        if not module:
            return None
        
        try:
            # Extract information from the module's metadata
            info = {
                'node_labels': module.METADATA.get('node_labels', []),
                'relationship_types': module.METADATA.get('edge_types', []),
                'node_count': {},
                'relationship_count': {}
            }
            
            # Get node counts
            nodes = module.nodes
            for label in info['node_labels']:
                try:
                    # This will depend on how the generated module works
                    method_name = label.lower().replace(':', '_').replace('-', '_')
                    if hasattr(nodes, method_name):
                        method = getattr(nodes, method_name)
                        count = len(method())
                        info['node_count'][label] = count
                except Exception as e:
                    print(f"Error getting count for {label}: {e}")
                    info['node_count'][label] = -1
            
            return info
        except Exception as e:
            print(f"Error getting database info: {e}")
            return None

# Create a singleton instance
db_manager = DatabaseManager()

# Notebook 8: API and Reference Guide

## Learning Objectives

By the end of this notebook, you will be able to:
1. Navigate the API reference for G.A.R.D.E.N. Explorer components
2. Understand the middleware adapter's interface
3. Reference the common patterns in the generated middleware
4. Use helper functions effectively in your applications
5. Identify configuration options for customization

## 1. G.A.R.D.E.N. Explorer Architecture Overview

Before diving into specific APIs, let's review the overall architecture of G.A.R.D.E.N. Explorer to understand how the components fit together.

### 1.1 Component Structure

G.A.R.D.E.N. Explorer consists of four main components:

1. **Flask Application (`garden_explorer.py`)**: The web application that provides the user interface and handles HTTP requests.
2. **Middleware Adapter (`middleware_adapter.py`)**: A component that provides a consistent interface to the generated middleware.
3. **Generated Middleware (e.g., `newgraph.py`)**: A Python module created by the Module Generator, tailored to your Neo4j database schema.
4. **Helper Functions (`helpers.py`)**: Utilities for data processing, formatting, and display.

The interaction flow is as follows:
1. User interacts with the Flask application through a web browser
2. Flask routes process requests and call middleware adapter methods
3. The middleware adapter calls appropriate methods in the generated middleware
4. The generated middleware executes Neo4j queries and returns results
5. Helper functions process and format data for display
6. Flask renders templates with the processed data

### 1.2 Data Flow

The flow of data through G.A.R.D.E.N. Explorer follows this pattern:

1. **Request Initiation**: The user sends a request to a specific route
2. **Route Processing**: The Flask route function handles the request and determines what data is needed
3. **Middleware Interaction**: The route function calls middleware adapter methods to retrieve data
4. **Database Query**: The middleware executes one or more Neo4j queries
5. **Result Processing**: The query results are processed into a standardized format
6. **Data Formatting**: Helper functions format the data for display
7. **Template Rendering**: The route function renders a template with the formatted data
8. **Response Delivery**: The rendered HTML is returned to the user

This architecture provides a clean separation of concerns and a flexible foundation for extension and customization.

## 2. Flask Application API Reference

The Flask application provides the user interface and handles HTTP requests. It defines routes, processes form submissions, and renders templates.

### 2.1 Route Functions

G.A.R.D.E.N. Explorer defines the following routes:

#### 2.1.1 `index()`

The main dashboard that serves as the entry point for both Grassroots and Grasshopper approaches.

```python
@app.route('/')
@login_required
def index():
    # Implementation details
    return render_template(
        'dashboard.html',
        node_labels=node_labels,
        featured_movies=featured_movies,
        featured_people=featured_people,
        get_node_display_name=get_node_display_name
    )
```

**URL**: `/`
**Method**: GET
**Authentication Required**: Yes
**Parameters**: None
**Returns**: The dashboard page with entry points for exploration

#### 2.1.2 `login()`

Handle user login with a simple form.

```python
@app.route('/login', methods=['GET', 'POST'])
def login():
    # Implementation details
    if request.method == 'POST':
        # Process form submission
        # ...
    return render_template('login.html', error=error)
```

**URL**: `/login`
**Methods**: GET, POST
**Authentication Required**: No
**GET Parameters**: None
**POST Parameters**:
- `username`: The username for authentication
- `password`: The password for authentication
**Returns**: The login form (GET) or redirects to the dashboard after successful login (POST)

#### 2.1.3 `logout()`

Handle user logout by clearing the session.

```python
@app.route('/logout')
def logout():
    # Implementation details
    return redirect(url_for('login'))
```

**URL**: `/logout`
**Method**: GET
**Authentication Required**: No
**Parameters**: None
**Returns**: Redirects to the login page

#### 2.1.4 `schema_overview()`

Provide an overview of the database schema (Grassroots entry point).

```python
@app.route('/schema')
@login_required
def schema_overview():
    # Implementation details
    return render_template(
        'schema.html',
        node_labels=node_labels,
        relationship_types=relationship_types,
        label_counts=label_counts
    )
```

**URL**: `/schema`
**Method**: GET
**Authentication Required**: Yes
**Parameters**: None
**Returns**: A page showing all node labels and relationship types

#### 2.1.5 `list_nodes(label)`

List all nodes with a specific label (Grassroots navigation).

```python
@app.route('/labels/<label>')
@login_required
def list_nodes(label):
    # Implementation details
    return render_template(
        'nodes_list.html',
        label=label,
        nodes=nodes,
        display_properties=display_properties,
        get_node_display_name=get_node_display_name,
        format_property_value=format_property_value
    )
```

**URL**: `/labels/<label>`
**Method**: GET
**Authentication Required**: Yes
**URL Parameters**:
- `label`: The node label to list
**Returns**: A page listing all nodes with the specified label

#### 2.1.6 `view_node(label, node_id)`

View details of a specific node and its relationships (Grasshopper navigation).

```python
@app.route('/nodes/<label>/<node_id>')
@login_required
def view_node(label, node_id):
    # Implementation details
    return render_template(
        'node_detail.html',
        node=node,
        label=label,
        incoming_relationships=incoming_relationships,
        outgoing_relationships=outgoing_relationships,
        get_node_display_name=get_node_display_name,
        format_property_value=format_property_value
    )
```

**URL**: `/nodes/<label>/<node_id>`
**Method**: GET
**Authentication Required**: Yes
**URL Parameters**:
- `label`: The node label
- `node_id`: The node ID
**Returns**: A page showing the node's details and relationships

#### 2.1.7 `search()`

Simple search functionality to find nodes by property values.

```python
@app.route('/search', methods=['GET'])
@login_required
def search():
    # Implementation details
    return render_template(
        'search.html',
        results=results,
        query=query,
        get_node_display_name=get_node_display_name
    )
```

**URL**: `/search`
**Method**: GET
**Authentication Required**: Yes
**Query Parameters**:
- `query`: The search term
**Returns**: A page with search results

#### 2.1.8 `debug_middleware()`

Debug route to examine the middleware structure.

```python
@app.route('/debug/middleware')
@login_required
def debug_middleware():
    # Implementation details
    return render_template('debug_middleware.html', info=middleware_info)
```

**URL**: `/debug/middleware`
**Method**: GET
**Authentication Required**: Yes
**Parameters**: None
**Returns**: A page with middleware structure information

### 2.2 Decorator Functions

G.A.R.D.E.N. Explorer defines the following decorator functions:

#### 2.2.1 `login_required(view_function)`

Decorator that ensures a user is logged in before accessing a route.

```python
def login_required(view_function):
    """
    Decorator that ensures a user is logged in before accessing a route.
    If not logged in, redirects to the login page.
    """
    def wrapped_view(*args, **kwargs):
        if 'username' not in session:
            # Store the requested URL for redirect after login
            session['next'] = request.url
            flash('Please log in to access this page', 'warning')
            return redirect(url_for('login'))
        return view_function(*args, **kwargs)
    # This is needed to preserve the function name, which Flask's routing uses
    wrapped_view.__name__ = view_function.__name__
    return wrapped_view
```

**Parameters**:
- `view_function`: The view function to protect
**Returns**: A wrapped view function that checks for authentication

### 2.3 Helper Functions

G.A.R.D.E.N. Explorer defines the following helper functions:

#### 2.3.1 `get_node_display_name(node)`

Gets a human-readable display name for a node based on common properties.

```python
def get_node_display_name(node):
    """
    Gets a human-readable display name for a node based on common properties.
    This helps create more user-friendly links and titles.
    """
    props = node['props']
    
    # Try common name properties in order of preference
    for prop in ['title', 'name', 'fullName', 'displayName']:
        if prop in props and props[prop]:
            return props[prop]
    
    # Fall back to UUID if no name property is found
    return f"Node {node['uuid'][:8]}..."
```

**Parameters**:
- `node`: The node object (a dictionary with 'props', 'uuid', and 'labels' keys)
**Returns**: A string with a human-readable name for the node

#### 2.3.2 `format_property_value(value, max_length=100)`

Format a property value for display, handling different types appropriately.

```python
def format_property_value(value, max_length=100):
    """
    Format a property value for display, handling different types appropriately.
    """
    if value is None:
        return "<empty>"
    
    # For lists, format each item
    if isinstance(value, list):
        if len(value) > 3:
            return f"List with {len(value)} items"
        return ", ".join(str(item) for item in value)
    
    # For dictionaries, summarize content
    if isinstance(value, dict):
        return f"Object with {len(value)} properties"
    
    # For strings, truncate if too long
    value_str = str(value)
    if len(value_str) > max_length:
        return value_str[:max_length] + "..."
    
    return value_str
```

**Parameters**:
- `value`: The property value to format
- `max_length`: (Optional) The maximum length for string values before truncation
**Returns**: A formatted string representation of the value

#### 2.3.3 `get_relationship_display(relationship)`

Creates a user-friendly display string for a relationship.

```python
def get_relationship_display(relationship):
    """
    Creates a user-friendly display string for a relationship.
    """
    rel_type = relationship.get('type', '')
    props = relationship.get('relationship', {}).get('props', {})
    
    # Add key properties to the display if they exist
    property_text = ''
    for key_prop in ['since', 'role', 'year']:
        if key_prop in props:
            property_text = f" ({key_prop}: {props[key_prop]})"
            break
    
    return f"{rel_type}{property_text}"
```

**Parameters**:
- `relationship`: The relationship object (a dictionary with 'type', 'relationship', etc. keys)
**Returns**: A string with a human-readable description of the relationship

#### 2.3.4 `log_activity(activity_type, details=None)`

Log user activity for audit purposes.

```python
def log_activity(activity_type, details=None):
    """
    Log user activity for audit purposes.
    In a production system, this would write to a secure log.
    """
    timestamp = datetime.datetime.now().isoformat()
    username = session.get('username', 'anonymous')
    activity = {
        'timestamp': timestamp,
        'username': username,
        'activity_type': activity_type,
        'details': details or {}
    }
    # In a real system, we'd write this to a log file or database
    print(f"ACTIVITY: {activity}")
```

**Parameters**:
- `activity_type`: The type of activity being logged
- `details`: (Optional) Additional details about the activity
**Returns**: None

#### 2.3.5 `inspect_middleware(middleware_module)`

Inspect the structure of the middleware module to help with debugging.

```python
def inspect_middleware(middleware_module):
    """
    Inspect the structure of the middleware module to help with debugging.
    
    This function examines the middleware module to determine its structure,
    which helps diagnose issues with middleware integration.
    
    Parameters
    ----------
    middleware_module:
        The imported middleware module
        
    Returns
    -------
    Dict:
        Information about the middleware structure
    """
    info = {
        'has_nodes_attr': hasattr(middleware_module, 'nodes'),
        'has_edges_attr': hasattr(middleware_module, 'edges'),
        'has_execute_query': hasattr(middleware_module, 'execute_query'),
        'has_metadata': hasattr(middleware_module, 'METADATA'),
        'types': {}
    }
    
    # ... implementation details ...
    
    return info
```

**Parameters**:
- `middleware_module`: The imported middleware module
**Returns**: A dictionary with information about the middleware structure

## 3. Middleware Adapter API Reference

The middleware adapter provides a consistent interface to the generated middleware, abstracting away differences in middleware implementations.

### 3.1 Core Methods

#### 3.1.1 `get_node_labels()`

Get all node labels from the database.

```python
def get_node_labels(self):
    """
    Get all node labels from the database.
    
    Returns
    -------
    List[str]:
        List of node labels
    """
    if hasattr(self.middleware, 'METADATA'):
        return self.middleware.METADATA.get('node_labels', [])
    return []
```

**Parameters**: None
**Returns**: A list of node labels

#### 3.1.2 `get_relationship_types()`

Get all relationship types from the database.

```python
def get_relationship_types(self):
    """
    Get all relationship types from the database.
    
    Returns
    -------
    List[str]:
        List of relationship types
    """
    if hasattr(self.middleware, 'METADATA'):
        return self.middleware.METADATA.get('edge_types', [])
    return []
```

**Parameters**: None
**Returns**: A list of relationship types

#### 3.1.3 `get_nodes_by_label(label)`

Get all nodes with a specific label.

```python
def get_nodes_by_label(self, label):
    """
    Get all nodes with a specific label.
    
    Parameters
    ----------
    label: str
        The node label to query
            
    Returns
    -------
    List[Dict]:
        List of nodes with the specified label
    """
    # Try to get the nodes using different approaches
    try:
        # ... implementation details ...
    except Exception as e:
        print(f"Error getting nodes by label {label}: {e}")
        return []
```

**Parameters**:
- `label`: The node label to query
**Returns**: A list of nodes with the specified label

#### 3.1.4 `get_node_by_id(label, node_id)`

Get a specific node by its ID.

```python
def get_node_by_id(self, label, node_id):
    """
    Get a specific node by its ID.
    
    Parameters
    ----------
    label: str
        The node label
    node_id: str
        The node ID
            
    Returns
    -------
    Dict or None:
        The node if found, None otherwise
    """
    try:
        # ... implementation details ...
    except Exception as e:
        print(f"Error getting node by ID {node_id}: {e}")
        return None
```

**Parameters**:
- `label`: The node label
- `node_id`: The node ID
**Returns**: The node if found, None otherwise

#### 3.1.5 `get_incoming_relationships(node_id)`

Get all relationships where the specified node is the target.

```python
def get_incoming_relationships(self, node_id):
    """
    Get all relationships where the specified node is the target.
    
    Parameters
    ----------
    node_id: str
        The node ID
            
    Returns
    -------
    List[Dict]:
        List of relationship information
    """
    incoming = []
    
    try:
        # ... implementation details ...
    except Exception as e:
        print(f"Error getting incoming relationships for node {node_id}: {e}")
    
    return incoming
```

**Parameters**:
- `node_id`: The node ID
**Returns**: A list of relationship information

#### 3.1.6 `get_outgoing_relationships(node_id)`

Get all relationships where the specified node is the source.

```python
def get_outgoing_relationships(self, node_id):
    """
    Get all relationships where the specified node is the source.
    
    Parameters
    ----------
    node_id: str
        The node ID
            
    Returns
    -------
    List[Dict]:
        List of relationship information
    """
    outgoing = []
    
    try:
        # ... implementation details ...
    except Exception as e:
        print(f"Error getting outgoing relationships for node {node_id}: {e}")
    
    return outgoing
```

**Parameters**:
- `node_id`: The node ID
**Returns**: A list of relationship information

### 3.2 Internal Methods

#### 3.2.1 `_process_node_result(node)`

Process a node result from a query to ensure it has the expected structure.

```python
def _process_node_result(self, node):
    """
    Process a node result from a query to ensure it has the expected structure.
    
    Parameters
    ----------
    node: Any
        The node result from a query
            
    Returns
    -------
    Dict:
        A dictionary with keys 'uuid', 'labels', and 'props'
    """
    # ... implementation details ...
```

**Parameters**:
- `node`: The node result from a query
**Returns**: A dictionary with keys 'uuid', 'labels', and 'props'

#### 3.2.2 `_process_relationship_result(rel)`

Process a relationship result from a query to ensure it has the expected structure.

```python
def _process_relationship_result(self, rel):
    """
    Process a relationship result from a query to ensure it has the expected structure.
    
    Parameters
    ----------
    rel: Any
        The relationship result from a query
            
    Returns
    -------
    Dict:
        A dictionary with keys 'uuid', 'relType', and 'props'
    """
    # ... implementation details ...
```

**Parameters**:
- `rel`: The relationship result from a query
**Returns**: A dictionary with keys 'uuid', 'relType', and 'props'

### 3.3 Factory Function

#### 3.3.1 `create_middleware_adapter(middleware)`

Create a middleware adapter for the specified middleware module.

```python
def create_middleware_adapter(middleware):
    """
    Create a middleware adapter for the specified middleware module.
    
    Parameters
    ----------
    middleware:
        The imported middleware module
        
    Returns
    -------
    MiddlewareAdapter:
        An adapter that provides a consistent interface to the middleware
    """
    return MiddlewareAdapter(middleware)
```

**Parameters**:
- `middleware`: The imported middleware module
**Returns**: A middleware adapter instance

## 4. Generated Middleware API Reference

The generated middleware provides a type-safe interface to the Neo4j database, tailored to your specific schema. The exact structure will depend on your database, but here's a reference for common patterns.

### 4.1 Module-Level Variables and Functions

#### 4.1.1 `NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`, `NEO4J_DATABASE`

Configuration variables for connecting to Neo4j.

```python
# Neo4j connection details
NEO4J_URI = "bolt://localhost:7687"
NEO4J_USERNAME = "neo4j"
NEO4J_PASSWORD = "password"
NEO4J_DATABASE = "neo4j"
```

#### 4.1.2 `METADATA`

Information about the Neo4j graph structure.

```python
# Metadata about the Neo4j graph
METADATA = {
    'node_labels': ['Movie', 'Person', 'Studio'],
    'node_properties': {
        'Movie': {'title': 'STRING', 'released': 'INTEGER', 'tagline': 'STRING'},
        'Person': {'name': 'STRING', 'born': 'INTEGER'},
        'Studio': {'name': 'STRING', 'founded': 'INTEGER'}
    },
    'edge_types': ['ACTED_IN', 'DIRECTED', 'PRODUCED'],
    'edge_properties': {
        'ACTED_IN': {'roles': 'LIST'},
        'DIRECTED': {'year': 'INTEGER'},
        'PRODUCED': {'year': 'INTEGER'}
    },
    'edge_endpoints': {
        'ACTED_IN': [['Person'], ['Movie']],
        'DIRECTED': [['Person'], ['Movie']],
        'PRODUCED': [['Studio'], ['Movie']]
    }
}
```

#### 4.1.3 `nodes` and `edges`

Module-level instances of the `Nodes` and `Edges` classes.

```python
nodes = Nodes()
edges = Edges()
```

#### 4.1.4 `connect()`

Create a new authenticated driver connection to the Neo4j database.

```python
def connect():
    """
    Create a new authenticated driver connection to the Neo4j database.
    
    Returns
    -------
    neo4j.Driver:
        A connected Neo4j driver instance
    """
    return _authenticated_driver(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD)
```

**Parameters**: None
**Returns**: A connected Neo4j driver instance

#### 4.1.5 `execute_query(query, params=None)`

Execute a raw Cypher query against the Neo4j database.

```python
def execute_query(query, params=None):
    """
    Execute a raw Cypher query against the Neo4j database.
    
    Parameters
    ----------
    query: str
        The Cypher query to execute
    params: Dict, optional
        Parameters for the query
        
    Returns
    -------
    List[Dict]:
        Results from the query
    """
    return _query(query, params)
```

**Parameters**:
- `query`: The Cypher query to execute
- `params`: (Optional) Parameters for the query
**Returns**: Results from the query

#### 4.1.6 `server_timestamp()`

Get the current timestamp from the Neo4j server.

```python
def server_timestamp():
    """
    Get the current timestamp from the Neo4j server.
    
    Returns
    -------
    str:
        ISO-formatted timestamp
    """
    return _server_timestamp()
```

**Parameters**: None
**Returns**: ISO-formatted timestamp from the Neo4j server

### 4.2 The `Nodes` Class

The `Nodes` class provides methods for accessing nodes by label. The exact methods depend on your database schema, but here's a pattern for a Movie graph:

#### 4.2.1 `movie(uuid=None, **props)`

Find nodes with label Movie matching the given properties.

```python
def movie(uuid=None, **props):
    """
    Find nodes with label Movie matching the given properties.
    
    Parameters
    ----------
    uuid: str, optional
        The UUID of the node to find
    **props: Dict
        Additional properties to search for
        
    Returns
    -------
    List[Dict]:
        A list of matching nodes as dictionaries with keys 'uuid', 'labels', and 'props'
    """
    search_props = props.copy()
    if uuid is not None:
        search_props['uuid'] = uuid
        
    # Type checking for known properties
    # ... type checking code ...
    
    # Construct and execute the query
    query, params = Queries.node(label="Movie", **search_props)
    results = _query(query, params)
    return [_neo4j_node_to_dict(result['n']) for result in results]
```

**Parameters**:
- `uuid`: (Optional) The UUID of the node to find
- `**props`: Additional properties to search for
**Returns**: A list of matching nodes

#### 4.2.2 `person(uuid=None, **props)`

Find nodes with label Person matching the given properties.

```python
def person(uuid=None, **props):
    """
    Find nodes with label Person matching the given properties.
    
    Parameters
    ----------
    uuid: str, optional
        The UUID of the node to find
    **props: Dict
        Additional properties to search for
        
    Returns
    -------
    List[Dict]:
        A list of matching nodes as dictionaries with keys 'uuid', 'labels', and 'props'
    """
    # ... implementation similar to movie() ...
```

**Parameters**:
- `uuid`: (Optional) The UUID of the node to find
- `**props`: Additional properties to search for
**Returns**: A list of matching nodes

### 4.3 The `Edges` Class

The `Edges` class provides methods for accessing relationships by type. The exact methods depend on your database schema, but here's a pattern for a Movie graph:

#### 4.3.1 `acted_in(uuid=None, start_node_uuid=None, end_node_uuid=None, **props)`

Find relationships of type ACTED_IN matching the given properties.

```python
def acted_in(uuid=None, start_node_uuid=None, end_node_uuid=None, **props):
    """
    Find relationships of type ACTED_IN matching the given properties.
    
    Parameters
    ----------
    uuid: str, optional
        The UUID of the relationship to find
    start_node_uuid: str, optional
        The UUID of the source node
    end_node_uuid: str, optional
        The UUID of the target node
    **props: Dict
        Additional properties to search for
        
    Returns
    -------
    List[Tuple[Dict, Dict, Dict]]:
        A list of tuples containing (source_node, relationship, target_node)
    """
    search_props = props.copy()
    if uuid is not None:
        search_props['uuid'] = uuid
        
    # Type checking for known properties
    # ... type checking code ...
    
    # Build the query
    if start_node_uuid is not None and end_node_uuid is not None:
        query = f"""
            MATCH (source)-[r:ACTED_IN]->(target)
            WHERE source.uuid = $start_node_uuid AND target.uuid = $end_node_uuid
            RETURN source, r, target
        """
        params = {"start_node_uuid": start_node_uuid, "end_node_uuid": end_node_uuid}
    elif start_node_uuid is not None:
        query = f"""
            MATCH (source)-[r:ACTED_IN]->(target)
            WHERE source.uuid = $start_node_uuid
            RETURN source, r, target
        """
        params = {"start_node_uuid": start_node_uuid}
    elif end_node_uuid is not None:
        query = f"""
            MATCH (source)-[r:ACTED_IN]->(target)
            WHERE target.uuid = $end_node_uuid
            RETURN source, r, target
        """
        params = {"end_node_uuid": end_node_uuid}
    else:
        query, params = Queries.edge(type="ACTED_IN", **search_props)
    
    # Execute the query
    results = _query(query, params)
    return [(_neo4j_node_to_dict(r['source']), _neo4j_relationship_to_dict(r['r']), _neo4j_node_to_dict(r['target'])) for r in results]
```

**Parameters**:
- `uuid`: (Optional) The UUID of the relationship to find
- `start_node_uuid`: (Optional) The UUID of the source node
- `end_node_uuid`: (Optional) The UUID of the target node
- `**props`: Additional properties to search for
**Returns**: A list of tuples containing (source_node, relationship, target_node)

#### 4.3.2 `directed(uuid=None, start_node_uuid=None, end_node_uuid=None, **props)`

Find relationships of type DIRECTED matching the given properties.

```python
def directed(uuid=None, start_node_uuid=None, end_node_uuid=None, **props):
    """
    Find relationships of type DIRECTED matching the given properties.
    
    Parameters
    ----------
    uuid: str, optional
        The UUID of the relationship to find
    start_node_uuid: str, optional
        The UUID of the source node
    end_node_uuid: str, optional
        The UUID of the target node
    **props: Dict
        Additional properties to search for
        
    Returns
    -------
    List[Tuple[Dict, Dict, Dict]]:
        A list of tuples containing (source_node, relationship, target_node)
    """
    # ... implementation similar to acted_in() ...
```

**Parameters**:
- `uuid`: (Optional) The UUID of the relationship to find
- `start_node_uuid`: (Optional) The UUID of the source node
- `end_node_uuid`: (Optional) The UUID of the target node
- `**props`: Additional properties to search for
**Returns**: A list of tuples containing (source_node, relationship, target_node)

### 4.4 The `Queries` Class

The `Queries` class provides methods for constructing Cypher queries.

#### 4.4.1 `server_timestamp()`

Creates a query to get the current timestamp from the Neo4j server.

```python
def server_timestamp():
    text = 'RETURN datetime() AS timestamp;'
    params = None
    return text, params
```

**Parameters**: None
**Returns**: A tuple of (query_text, query_params)

#### 4.4.2 `node(label, **props)`

Constructs a query to find nodes with a specific label and properties.

```python
def node(label, **props):
    """
    Node interface cypher -- given a neo4j label (can be a multi-
    label separated by colons, e.g., Label1:Label2) and a dictionary
    of propNames and propValues, construct a parameterized Cypher query 
    to return a list of nodes with that label matching those properties.
    """        
    text = f"""MATCH 
        (n:{label} 
        {'{' if props else ''} 
        {', '.join(f"{prop}: ${prop}" for prop in props)}
        {'}' if props else ''}) 
        RETURN n;"""

    return text, props
```

**Parameters**:
- `label`: The node label to query
- `**props`: Properties to filter by
**Returns**: A tuple of (query_text, query_params)

#### 4.4.3 `edge(type, **props)`

Constructs a query to find relationships with a specific type and properties.

```python
def edge(type, **props):
    """
    Edge interface cypher -- given a neo4j relationship type and a dictionary
    of propNames and propValues, construct a parameterized Cypher query 
    to return a list of relationships with that type matching those properties.
    """
    text = f"""MATCH 
        (source)-[r:{type} 
        {'{' if props else ''} 
        {', '.join(f"{prop}: ${prop}" for prop in props)}
        {'}' if props else ''}]->(target) 
        RETURN source, r, target;"""

    return text, props
```

**Parameters**:
- `type`: The relationship type to query
- `**props`: Properties to filter by
**Returns**: A tuple of (query_text, query_params)

### 4.5 Internal Utility Functions

#### 4.5.1 `_authenticated_driver(uri=NEO4J_URI, username=NEO4J_USERNAME, password=NEO4J_PASSWORD)`

Internal method to set up an authenticated driver.

```python
def _authenticated_driver(uri=NEO4J_URI, username=NEO4J_USERNAME, password=NEO4J_PASSWORD):
    """
    Internal method to set up an authenticated driver.

    Parameters
    ----------
    uri: str
        neo4j connection string
    username: str
        username for the neo4j account
    password: str
        password for the neo4j account
    
    Returns
    -------
    neo4j.GraphDatabase.Driver instance to connect to the database.
    """
    return GraphDatabase.driver(uri, auth=(username, password))
```

**Parameters**:
- `uri`: Neo4j connection string
- `username`: Username for the Neo4j account
- `password`: Password for the Neo4j account
**Returns**: A Neo4j driver instance

#### 4.5.2 `_query(query_text=None, query_params=None)`

Submits a parameterized Cypher query to Neo4j.

```python
def _query(query_text=None, query_params=None):
    """
    Submits a parameterized Cypher query to Neo4j.

    Parameters
    ----------
    query_text: str
        A valid Cypher query string.
    query_params: list(str)
        A list of parameters to be passed along with the query_text.

    Returns
    -------
    A tuple of dictionaries, representing entities returned by the query.
    """
    with _authenticated_driver().session() as session:
        return session.run(query_text, query_params).data()
```

**Parameters**:
- `query_text`: A valid Cypher query string
- `query_params`: Parameters for the query
**Returns**: Results from the query

#### 4.5.3 `_neo4j_node_to_dict(node)`

Convert a neo4j Node or dictionary to a standardized Python dictionary.

```python
def _neo4j_node_to_dict(node):
    """
    Convert a neo4j Node or dictionary to a standardized Python dictionary.
    
    Parameters
    ----------
    node: neo4j.Node or dict
        The Neo4j node or dictionary to convert
        
    Returns
    -------
    Dict:
        A dictionary with keys 'uuid', 'labels', and 'props'
    """
    # ... implementation details ...
```

**Parameters**:
- `node`: The Neo4j node or dictionary to convert
**Returns**: A dictionary with keys 'uuid', 'labels', and 'props'

#### 4.5.4 `_neo4j_relationship_to_dict(rel)`

Convert a neo4j Relationship to a standardized Python dictionary.

```python
def _neo4j_relationship_to_dict(rel):
    """
    Convert a neo4j Relationship to a standardized Python dictionary.

    Unlike nodes, relationships in neo4j can only have a single type.
    
    Parameters
    ----------
    rel: neo4j.Relationship
        The Neo4j relationship to convert
        
    Returns
    -------
    Dict:
        A dictionary with keys 'uuid', 'type', and 'props'
    """
    # ... implementation details ...
```

**Parameters**:
- `rel`: The Neo4j relationship to convert
**Returns**: A dictionary with keys 'uuid', 'type', and 'props'

## 5. Helpers API Reference

The `helpers.py` module provides utility functions for G.A.R.D.E.N. Explorer, particularly for creating mock data when the real middleware isn't available.

### 5.1 Mock Middleware Functions

#### 5.1.1 `create_mock_middleware()`

Create a mock middleware for demonstration purposes.

```python
def create_mock_middleware():
    """
    Create a mock middleware for demonstration purposes.
    
    This function is used when the real middleware generated by the Module Generator
    is not available. It creates a simplified mock that mimics the structure and
    functionality of the real middleware, using the movie graph schema.
    
    Returns:
        An object that mimics the middleware interface
    """
    # ... implementation details ...
```

**Parameters**: None
**Returns**: A mock middleware object

### 5.2 Formatting Functions

#### 5.2.1 `format_datetime(dt)`

Format a datetime object for display.

```python
def format_datetime(dt):
    """Format a datetime object for display."""
    if isinstance(dt, datetime):
        return dt.strftime('%Y-%m-%d %H:%M:%S')
    return str(dt)
```

**Parameters**:
- `dt`: A datetime object or other value
**Returns**: A formatted string

#### 5.2.2 `format_list(lst, max_items=3)`

Format a list for display, showing only a few items if the list is long.

```python
def format_list(lst, max_items=3):
    """Format a list for display, showing only a few items if the list is long."""
    if not lst:
        return "[]"
    
    if len(lst) <= max_items:
        return str(lst)
    
    return f"[{', '.join(str(item) for item in lst[:max_items])}, ... and {len(lst) - max_items} more]"
```

**Parameters**:
- `lst`: The list to format
- `max_items`: (Optional) The maximum number of items to show
**Returns**: A formatted string representation of the list

## 6. Configuration Reference

G.A.R.D.E.N. Explorer includes several configuration options that can be customized.

### 6.1 Flask Application Configuration

The Flask application configuration is set in `garden_explorer.py`:

```python
# Configuration
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev_key_for_testing')
app.config['PERMANENT_SESSION_LIFETIME'] = 3600  # 1 hour
```

Options:
- `app.secret_key`: The secret key used for session encryption (should be set via environment variable in production)
- `app.config['PERMANENT_SESSION_LIFETIME']`: The lifetime of a permanent session in seconds

### 6.2 Database Configuration

The Neo4j database configuration is set in the generated middleware:

```python
# Neo4j connection details
NEO4J_URI = "bolt://localhost:7687"
NEO4J_USERNAME = "neo4j"
NEO4J_PASSWORD = "password"
NEO4J_DATABASE = "neo4j"
```

Options:
- `NEO4J_URI`: The URI for connecting to the Neo4j database
- `NEO4J_USERNAME`: The username for Neo4j authentication
- `NEO4J_PASSWORD`: The password for Neo4j authentication
- `NEO4J_DATABASE`: The name of the Neo4j database to use

### 6.3 User Configuration

The user configuration is set in `garden_explorer.py`:

```python
# Simple user database - in a real application, this would come from a secure database
# Format: { username: { 'password': 'password_value', 'display_name': 'Display Name' } }
USERS = {
    'demo': {
        'password': 'demo123',
        'display_name': 'Demo User'
    }
}
```

Options:
- `USERS`: A dictionary mapping usernames to user information
  - `password`: The user's password
  - `display_name`: The user's display name

### 6.4 Module Generator Configuration

The Module Generator configuration is set in `modulegenerator-claude.py`:

```python
profile = {
    'uri': 'bolt://localhost:7687',
    'database': 'neo4j',
    'username': 'neo4j',
    'password': 'neo4j-dev'
}
```

Options:
- `profile['uri']`: The URI for connecting to the Neo4j database
- `profile['database']`: The name of the Neo4j database to use
- `profile['username']`: The username for Neo4j authentication
- `profile['password']`: The password for Neo4j authentication

## 7. Template Reference

G.A.R.D.E.N. Explorer uses Jinja2 templates for rendering HTML. Here's a reference for the templates.

### 7.1 Base Template

The `base.html` template provides the basic layout and structure for all pages.

```html
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}G.A.R.D.E.N. Explorer{% endblock %}</title>
    <style>
        /* ... CSS styles ... */
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>G.A.R.D.E.N. Explorer</h1>
            {% if session.username %}
            <div>
                Welcome, {{ session.display_name }} | 
                <a href="{{ url_for('logout') }}">Logout</a>
            </div>
            {% endif %}
        </div>
        
        {% if session.username %}
        <div class="navigation">
            <a href="{{ url_for('index') }}">Dashboard</a> |
            <a href="{{ url_for('schema_overview') }}">Schema</a> |
            <a href="{{ url_for('search') }}">Search</a>
        </div>
        {% endif %}
        
        {% with messages = get_flashed_messages(with_categories=true) %}
            {% if messages %}
                {% for category, message in messages %}
                    <div class="flash {{ category }}">{{ message }}</div>
                {% endfor %}
            {% endif %}
        {% endwith %}
        
        {% block content %}{% endblock %}
        
        <div class="footer">
            G.A.R.D.E.N. Explorer | <a href="https://github.com/danhales/garden">GitHub</a>
        </div>
    </div>
</body>
</html>
```

Blocks:
- `title`: The page title
- `content`: The main content area

Context Variables:
- `session.username`: The username of the logged-in user
- `session.display_name`: The display name of the logged-in user

### 7.2 Dashboard Template

The `dashboard.html` template provides the main dashboard view.

```html
{% extends 'base.html' %}

{% block title %}Dashboard - G.A.R.D.E.N. Explorer{% endblock %}

{% block content %}
<h2>Welcome to G.A.R.D.E.N. Explorer</h2>

<div class="card">
    <h3>About This Explorer</h3>
    <p>
        This application provides two complementary ways to explore your graph data:
    </p>
    <ul>
        <li><strong>Grassroots</strong>: Start with the schema (labels, relationships) and drill down to specific instances</li>
        <li><strong>Grasshopper</strong>: Start with specific entities and "hop" between connected entities</li>
    </ul>
    <p>
        Use the navigation links at the top, or choose one of the entry points below to get started.
    </p>
</div>

<div style="display: flex; gap: 20px;">
    <!-- Grassroots (Schema-First) Section -->
    <div style="flex: 1;">
        <h3>Grassroots Exploration</h3>
        <p>Start by exploring the schema structure:</p>
        
        <div class="card">
            <h4>Node Labels</h4>
            <ul>
                {% for label in node_labels %}
                <li><a href="{{ url_for('list_nodes', label=label) }}">{{ label }}</a></li>
                {% endfor %}
            </ul>
            
            <a href="{{ url_for('schema_overview') }}">View full schema</a>
        </div>
    </div>
    
    <!-- Grasshopper (Entity-First) Section -->
    <div style="flex: 1;">
        <h3>Grasshopper Exploration</h3>
        <p>Start by exploring specific entities:</p>
        
        <div class="card">
            <h4>Featured Movies</h4>
            <ul>
                {% for movie in featured_movies %}
                <li>
                    <a href="{{ url_for('view_node', label='Movie', node_id=movie.uuid) }}">
                        {{ get_node_display_name(movie) }}
                    </a>
                </li>
                {% endfor %}
            </ul>
        </div>
        
        <div class="card">
            <h4>Featured People</h4>
            <ul>
                {% for person in featured_people %}
                <li>
                    <a href="{{ url_for('view_node', label='Person', node_id=person.uuid) }}">
                        {{ get_node_display_name(person) }}
                    </a>
                </li>
                {% endfor %}
            </ul>
        </div>
    </div>
</div>

<!-- Search Form -->
<div class="card">
    <h3>Search</h3>
    <form action="{{ url_for('search') }}" method="get" class="search-box">
        <input type="text" name="query" placeholder="Search for movies, people, etc.">
        <button type="submit">Search</button>
    </form>
</div>
{% endblock %}
```

Context Variables:
- `node_labels`: A list of node labels in the database
- `featured_movies`: A list of featured movie nodes
- `featured_people`: A list of featured person nodes
- `get_node_display_name`: A function to get a display name for a node

### 7.3 Schema Template

The `schema.html` template provides an overview of the database schema.

```html
{% extends 'base.html' %}

{% block title %}Schema Overview - G.A.R.D.E.N. Explorer{% endblock %}

{% block content %}
<h2>Schema Overview</h2>

<p>
    This page shows the structure of the graph database, including all node labels and relationship types.
    Click on a label to view all nodes with that label.
</p>

<div class="card">
    <h3>Node Labels</h3>
    <table>
        <thead>
            <tr>
                <th>Label</th>
                <th>Count</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {% for label in node_labels %}
            <tr>
                <td>{{ label }}</td>
                <td>{{ label_counts.get(label, '?') }}</td>
                <td><a href="{{ url_for('list_nodes', label=label) }}">View All</a></td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
</div>

<div class="card">
    <h3>Relationship Types</h3>
    <ul>
        {% for rel_type in relationship_types %}
        <li>{{ rel_type }}</li>
        {% endfor %}
    </ul>
</div>

<div class="navigation">
    <a href="{{ url_for('index') }}">&larr; Back to Dashboard</a>
</div>
{% endblock %}
```

Context Variables:
- `node_labels`: A list of node labels in the database
- `relationship_types`: A list of relationship types in the database
- `label_counts`: A dictionary mapping node labels to counts

### 7.4 Node List Template

The `nodes_list.html` template lists all nodes with a specific label.

```html
{% extends 'base.html' %}

{% block title %}{{ label }} Nodes - G.A.R.D.E.N. Explorer{% endblock %}

{% block content %}
<h2>{{ label }} Nodes</h2>

<p>Found {{ nodes|length }} nodes with label "{{ label }}"</p>

{% if nodes %}
<table>
    <thead>
        <tr>
            <th>Name</th>
            {% for prop in display_properties %}
            <th>{{ prop }}</th>
            {% endfor %}
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        {% for node in nodes %}
        <tr>
            <td>{{ get_node_display_name(node) }}</td>
            {% for prop in display_properties %}
            <td>{{ format_property_value(node.props.get(prop)) }}</td>
            {% endfor %}
            <td>
                <a href="{{ url_for('view_node', label=label, node_id=node.uuid) }}">View Details</a>
            </td>
        </tr>
        {% endfor %}
    </tbody>
</table>
{% else %}
<p>No nodes found with this label.</p>
{% endif %}

<div class="navigation">
    <a href="{{ url_for('schema_overview') }}">&larr; Back to Schema</a> |
    <a href="{{ url_for('index') }}">&larr; Back to Dashboard</a>
</div>
{% endblock %}
```

Context Variables:
- `label`: The node label being displayed
- `nodes`: A list of nodes with the specified label
- `display_properties`: A list of properties to display in the table
- `get_node_display_name`: A function to get a display name for a node
- `format_property_value`: A function to format property values for display

### 7.5 Node Detail Template

The `node_detail.html` template shows details of a specific node and its relationships.

```html
{% extends 'base.html' %}

{% block title %}{{ get_node_display_name(node) }} - G.A.R.D.E.N. Explorer{% endblock %}

{% block content %}
<h2>{{ get_node_display_name(node) }}</h2>

<div class="navigation">
    <a href="{{ url_for('list_nodes', label=label) }}">&larr; Back to {{ label }} Nodes</a> |
    <a href="{{ url_for('index') }}">&larr; Back to Dashboard</a>
</div>

<!-- Node Properties -->
<div class="card">
    <h3>Properties</h3>
    <table class="property-table">
        <tbody>
            {% for key, value in node.props.items() %}
            <tr>
                <th>{{ key }}</th>
                <td>{{ format_property_value(value) }}</td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
</div>

<!-- Outgoing Relationships -->
{% if outgoing_relationships %}
<div class="card">
    <h3>Outgoing Relationships ({{ outgoing_relationships|length }})</h3>
    <table>
        <thead>
            <tr>
                <th>Relationship</th>
                <th>To</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {% for relationship in outgoing_relationships %}
            <tr>
                <td>{{ get_relationship_display(relationship) }}</td>
                <td>
                    {{ get_node_display_name(relationship.target) }}
                </td>
                <td>
                    <a href="{{ url_for('view_node', label=relationship.target.labels[0], node_id=relationship.target.uuid) }}">View</a>
                </td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
</div>
{% endif %}

<!-- Incoming Relationships -->
{% if incoming_relationships %}
<div class="card">
    <h3>Incoming Relationships ({{ incoming_relationships|length }})</h3>
    <table>
        <thead>
            <tr>
                <th>From</th>
                <th>Relationship</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {% for relationship in incoming_relationships %}
            <tr>
                <td>
                    {{ get_node_display_name(relationship.source) }}
                </td>
                <td>{{ get_relationship_display(relationship) }}</td>
                <td>
                    <a href="{{ url_for('view_node', label=relationship.source.labels[0], node_id=relationship.source.uuid) }}">View</a>
                </td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
</div>
{% endif %}
{% endblock %}
```

Context Variables:
- `node`: The node being displayed
- `label`: The node's label
- `incoming_relationships`: A list of relationships where the node is the target
- `outgoing_relationships`: A list of relationships where the node is the source
- `get_node_display_name`: A function to get a display name for a node
- `format_property_value`: A function to format property values for display
- `get_relationship_display`: A function to create a display string for a relationship

## 8. Summary

In this notebook, we've provided a comprehensive reference for the G.A.R.D.E.N. Explorer API and components, including:

1. **Flask Application API**: The routes, decorators, and helper functions that make up the web application
2. **Middleware Adapter API**: The adapter that provides a consistent interface to the middleware
3. **Generated Middleware API**: The patterns and structures found in the middleware generated by the Module Generator
4. **Helpers API**: The utility functions for data processing, formatting, and mocking
5. **Configuration Reference**: The configuration options available in G.A.R.D.E.N. Explorer
6. **Template Reference**: The Jinja2 templates used for rendering HTML

This reference serves as a guide for working with G.A.R.D.E.N. Explorer, whether you're using it as-is, extending it with new features, or implementing similar patterns in your own applications.

By understanding the APIs and components of G.A.R.D.E.N. Explorer, you can more effectively navigate, enhance, and customize the application to suit your specific needs.

## 9. Further Reading

- [Flask API Documentation](https://flask.palletsprojects.com/en/2.0.x/api/)
- [Neo4j Python Driver API](https://neo4j.com/docs/api/python-driver/current/)
- [Jinja2 Template Documentation](https://jinja.palletsprojects.com/en/3.0.x/templates/)
- [Neo4j Cypher Manual](https://neo4j.com/docs/cypher-manual/current/)
- [Python Design Patterns](https://python-patterns.guide/)
- [Adapter Pattern](https://refactoring.guru/design-patterns/adapter)
- [Python Documentation Standards](https://numpydoc.readthedocs.io/en/latest/format.html)

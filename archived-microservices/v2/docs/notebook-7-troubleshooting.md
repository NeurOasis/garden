# Notebook 7: Troubleshooting Common Issues

## Learning Objectives

By the end of this notebook, you will be able to:
1. Diagnose and resolve common Neo4j connection issues
2. Troubleshoot middleware integration problems
3. Address Flask application errors
4. Solve authentication and session challenges
5. Fix template rendering problems
6. Resolve performance bottlenecks
7. Use debugging tools effectively with G.A.R.D.E.N. Explorer

## 1. Understanding Error Handling in G.A.R.D.E.N. Explorer

G.A.R.D.E.N. Explorer implements several error handling mechanisms to provide a better user experience and facilitate troubleshooting. Before diving into specific issues, it's important to understand how errors are handled throughout the application.

### 1.1 Application-Level Error Handling

At the application level, G.A.R.D.E.N. Explorer uses Flask's error handlers for common HTTP errors:

```python
# From garden_explorer.py
@app.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors with a user-friendly page."""
    return render_template('404.html'), 404

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors with a user-friendly page."""
    return render_template('500.html'), 500
```

These handlers capture application-level errors and render user-friendly error pages instead of the default Flask error pages.

### 1.2 View-Level Error Handling

Most view functions in G.A.R.D.E.N. Explorer use try-except blocks to catch and handle errors:

```python
# From garden_explorer.py
@app.route('/labels/<label>')
@login_required
def list_nodes(label):
    """
    List all nodes with a specific label (Grassroots navigation).
    """
    log_activity('list_nodes', {'label': label})
    
    try:
        nodes = middleware.get_nodes_by_label(label)
        
        # Get properties for display
        if nodes:
            # Use the first node to determine which properties to show
            display_properties = list(nodes[0]['props'].keys())[:5]  # First 5 properties
        else:
            display_properties = []
        
        return render_template(
            'nodes_list.html',
            label=label,
            nodes=nodes,
            display_properties=display_properties,
            get_node_display_name=get_node_display_name,
            format_property_value=format_property_value
        )
    except Exception as e:
        flash(f"Error listing nodes: {str(e)}", "error")
        return redirect(url_for('index'))
```

This approach:
1. Attempts to execute the view logic
2. Catches any exceptions that occur
3. Flashes an error message with details about the exception
4. Redirects to a safe page (usually the dashboard)

The error message is displayed to the user through Flask's flash message system, which is rendered in the base template:

```html
<!-- From base.html -->
{% with messages = get_flashed_messages(with_categories=true) %}
    {% if messages %}
        {% for category, message in messages %}
            <div class="flash {{ category }}">{{ message }}</div>
        {% endfor %}
    {% endif %}
{% endwith %}
```

### 1.3 Middleware Error Handling

The middleware adapter includes its own error handling for database operations:

```python
# From middleware_adapter.py
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

This approach:
1. Attempts to execute the database operation
2. Catches any exceptions that occur
3. Logs the error to the console
4. Returns a safe default value (often an empty list or None)

This multi-layered error handling helps prevent crashes and provides useful information for troubleshooting.

## 2. Neo4j Connection Issues

One of the most common categories of issues involves connecting to the Neo4j database. Let's explore common Neo4j connection problems and their solutions.

### 2.1 Connection Refused

**Symptom**: When starting G.A.R.D.E.N. Explorer or generating middleware, you see an error like:
```
Connection refused: connect
```

**Possible Causes**:
1. Neo4j server is not running
2. Neo4j server is running on a different host or port
3. Firewall is blocking the connection
4. Neo4j server is configured to only accept connections from specific hosts

**Solutions**:

1. Verify that Neo4j is running:
   ```bash
   # Check Neo4j status on Linux/macOS
   systemctl status neo4j
   
   # Or if you're using Neo4j Desktop, check the status in the interface
   ```

2. Verify the connection URI in your middleware:
   ```python
   # From the generated middleware
   NEO4J_URI = "bolt://localhost:7687"
   ```
   Ensure that the host and port match your Neo4j configuration.

3. Check if you can connect to Neo4j with the browser interface (typically at http://localhost:7474).

4. Check Neo4j configuration in `neo4j.conf` to ensure it allows connections from your application:
   ```
   # In neo4j.conf
   dbms.default_listen_address=0.0.0.0  # Listen on all interfaces
   ```

5. Check firewall settings to ensure ports 7474 (HTTP) and 7687 (Bolt) are open.

### 2.2 Authentication Failure

**Symptom**: When connecting to Neo4j, you see an error like:
```
The client is unauthorized due to authentication failure.
```

**Possible Causes**:
1. Incorrect username or password
2. Neo4j requires a password change on first login
3. Authentication is disabled in Neo4j, but credentials are provided
4. Authentication is enabled in Neo4j, but no credentials are provided

**Solutions**:

1. Verify your Neo4j credentials:
   ```python
   # From the generated middleware
   NEO4J_USERNAME = "neo4j"
   NEO4J_PASSWORD = "password"
   ```
   Ensure these match the credentials configured in Neo4j.

2. If you're using Neo4j for the first time, you might need to change the default password through the Neo4j Browser.

3. Check Neo4j authentication settings in `neo4j.conf`:
   ```
   # In neo4j.conf
   dbms.security.auth_enabled=true
   ```

4. Manually connect to Neo4j using the Neo4j Browser to verify your credentials.

### 2.3 Database Not Found

**Symptom**: When connecting to Neo4j, you see an error like:
```
Requested database not found: <database_name>
```

**Possible Causes**:
1. The specified database doesn't exist in your Neo4j instance
2. You're using Neo4j Community Edition, which only supports a single database
3. The database name is misspelled

**Solutions**:

1. Check your middleware configuration for the database name:
   ```python
   # From the generated middleware
   NEO4J_DATABASE = "neo4j"
   ```
   The default database name in Neo4j is "neo4j".

2. Verify available databases in Neo4j through the Neo4j Browser by running:
   ```cypher
   SHOW DATABASES
   ```

3. If you're using Neo4j Community Edition, ensure you're using the default database.

4. Create the database if it doesn't exist (requires Neo4j Enterprise Edition):
   ```cypher
   CREATE DATABASE your_database_name
   ```

### 2.4 Connection Timeout

**Symptom**: When connecting to Neo4j, you see an error like:
```
Connection timed out after 30000ms
```

**Possible Causes**:
1. Neo4j server is overloaded
2. Network latency is high
3. Connection parameters are not optimized

**Solutions**:

1. Increase the connection timeout in your middleware:
   ```python
   # Modify _authenticated_driver in the generated middleware
   def _authenticated_driver(uri=NEO4J_URI, username=NEO4J_USERNAME, password=NEO4J_PASSWORD):
       return GraphDatabase.driver(
           uri,
           auth=(username, password),
           connection_timeout=60  # Increase to 60 seconds
       )
   ```

2. Check Neo4j server resource usage (CPU, memory, disk I/O) to ensure it's not overloaded.

3. If possible, reduce network latency by placing your application closer to the Neo4j server.

4. Optimize Neo4j configuration for your environment in `neo4j.conf`.

## 3. Middleware Integration Issues

Another common category of issues involves the integration between G.A.R.D.E.N. Explorer and the generated middleware. Let's explore these issues and their solutions.

### 3.1 Middleware Import Errors

**Symptom**: When starting G.A.R.D.E.N. Explorer, you see an error like:
```
Error importing middleware: No module named 'newgraph'
```

**Possible Causes**:
1. The middleware module hasn't been generated yet
2. The middleware module has a different name than expected
3. The middleware module isn't in the Python path
4. The middleware module has syntax errors

**Solutions**:

1. Generate the middleware using the Module Generator:
   ```bash
   python modulegenerator-claude.py -u "bolt://localhost:7687" -n "neo4j" -p "your_password" -g "newgraph"
   ```

2. Ensure the middleware filename matches the import statement in G.A.R.D.E.N. Explorer:
   ```python
   # From garden_explorer.py
   try:
       # Import the middleware - normally this would be generated with the Module Generator
       import newgraph as graph_db
       # ...
   ```
   If your middleware has a different name, update this import statement accordingly.

3. Ensure the middleware file is in the same directory as `garden_explorer.py` or in a directory that's in the Python path.

4. Check for syntax errors in the generated middleware by trying to import it directly:
   ```bash
   python -c "import newgraph"
   ```

### 3.2 Middleware Structure Mismatches

**Symptom**: G.A.R.D.E.N. Explorer starts, but you see errors when trying to use it, such as:
```
'NoneType' object has no attribute 'nodes'
```

**Possible Causes**:
1. The middleware has a different structure than expected
2. The middleware was generated with a different version of the Module Generator
3. The middleware wasn't properly initialized

**Solutions**:

1. Use the debugging route to examine the middleware structure:
   ```
   http://localhost:5000/debug/middleware
   ```
   This will show you the actual structure of your middleware module.

2. Regenerate the middleware with the current version of the Module Generator.

3. Ensure the middleware is properly initialized with the expected attributes:
   ```python
   # In the generated middleware, at the module level
   # Create the interface instances
   nodes = Nodes()
   edges = Edges()
   ```

4. Check the middleware adapter to ensure it's handling your middleware structure:
   ```python
   # From middleware_adapter.py
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
   You may need to modify the adapter to match your middleware structure.

### 3.3 Middleware Type Errors

**Symptom**: When using G.A.R.D.E.N. Explorer, you see type-related errors like:
```
TypeError: Property released must be of type int, got str
```

**Possible Causes**:
1. Data in Neo4j doesn't match the expected types
2. Middleware type checking is too strict
3. Type conversion is failing

**Solutions**:

1. Modify the type checking code in the generated middleware to be more lenient:
   ```python
   # In the generated middleware, in a node method
   # Type check released (expected int)
   if "released" in props and props["released"] is not None:
       if not isinstance(props["released"], int):
           try:
               # Attempt to convert
               props["released"] = int(props["released"])
           except (ValueError, TypeError):
               # If conversion fails, just use the original value
               pass
   ```

2. Correct the data types in your Neo4j database to match the expected types.

3. Modify the middleware adapter to handle type mismatches:
   ```python
   # In middleware_adapter.py, add a helper method
   def _safe_convert(self, value, target_type):
       """Safely convert a value to a target type."""
       try:
           if target_type == int:
               return int(value)
           elif target_type == float:
               return float(value)
           elif target_type == str:
               return str(value)
           elif target_type == bool:
               return bool(value)
           else:
               return value
       except (ValueError, TypeError):
           return value
   ```

4. Regenerate the middleware with updated type mappings.

## 4. Flask Application Errors

G.A.R.D.E.N. Explorer is built on Flask, which introduces its own set of potential issues. Let's explore common Flask-related problems and their solutions.

### 4.1 Route Not Found (404 Errors)

**Symptom**: When accessing a URL, you see a "404 Page Not Found" error.

**Possible Causes**:
1. The URL doesn't match any defined route
2. The route exists but has a different URL pattern
3. The route is defined but has a typo
4. The route requires parameters that aren't provided

**Solutions**:

1. Check the defined routes in `garden_explorer.py`:
   ```python
   # View routes defined in garden_explorer.py
   @app.route('/')
   @app.route('/login', methods=['GET', 'POST'])
   @app.route('/logout')
   @app.route('/schema')
   @app.route('/labels/<label>')
   @app.route('/nodes/<label>/<node_id>')
   @app.route('/search', methods=['GET'])
   @app.route('/debug/middleware')
   ```
   Ensure the URL you're trying to access matches one of these patterns.

2. Check for any typos in the URL or route definition.

3. If the route requires parameters (e.g., `/labels/<label>`), ensure you're providing them correctly.

4. Consider using Flask's `url_for` function to generate URLs rather than hardcoding them:
   ```python
   url = url_for('view_node', label='Movie', node_id='123')
   ```

### 4.2 Method Not Allowed (405 Errors)

**Symptom**: When submitting a form, you see a "405 Method Not Allowed" error.

**Possible Causes**:
1. The route doesn't accept the HTTP method used (e.g., POST)
2. The form action URL is incorrect
3. The form method is incorrect

**Solutions**:

1. Check the route definition to ensure it accepts the appropriate methods:
   ```python
   @app.route('/login', methods=['GET', 'POST'])
   ```
   If a route needs to handle forms, it must include `'POST'` in the methods list.

2. Check the form action and method in the template:
   ```html
   <form method="post" action="{{ url_for('login') }}">
       <!-- form fields -->
   </form>
   ```
   Ensure the method is "post" and the action points to the correct route.

3. If the route should handle multiple methods, add them to the route definition:
   ```python
   @app.route('/search', methods=['GET', 'POST'])
   ```

### 4.3 Internal Server Error (500 Errors)

**Symptom**: When using the application, you see a "500 Internal Server Error".

**Possible Causes**:
1. An unhandled exception occurred in the application
2. A required dependency is missing
3. There's a configuration error
4. The database operation failed

**Solutions**:

1. Enable debug mode to see detailed error information:
   ```python
   app.debug = True
   ```
   (Note: Only do this in development, not in production.)

2. Check the Flask application logs for error details.

3. Wrap problematic code in try-except blocks to catch and handle exceptions:
   ```python
   try:
       # Potentially problematic code
       result = some_function()
   except Exception as e:
       app.logger.error(f"Error: {str(e)}")
       flash(f"An error occurred: {str(e)}", "error")
       return redirect(url_for('index'))
   ```

4. Ensure all required dependencies are installed:
   ```bash
   pip install -r requirements.txt
   ```

### 4.4 Template Rendering Errors

**Symptom**: When accessing a page, you see an error like:
```
jinja2.exceptions.UndefinedError: 'variable' is undefined
```

**Possible Causes**:
1. A template references a variable that wasn't passed to `render_template`
2. A variable is None or doesn't have the expected attributes
3. There's a typo in the variable name

**Solutions**:

1. Check the variables passed to `render_template`:
   ```python
   return render_template(
       'template.html',
       variable=variable,
       other_variable=other_variable
   )
   ```
   Ensure all variables used in the template are included.

2. Use Jinja2's conditional expressions to handle potential None values or missing attributes:
   ```html
   {% if variable %}
       {{ variable.attribute }}
   {% else %}
       No value available
   {% endif %}
   ```

3. Use the `default` filter to provide fallback values:
   ```html
   {{ variable | default('Default Value') }}
   ```

4. Check for typos in variable names in both the Python code and the template.

## 5. Authentication and Session Issues

G.A.R.D.E.N. Explorer includes a basic authentication system that can be the source of various issues. Let's explore common authentication and session problems and their solutions.

### 5.1 Login Failures

**Symptom**: You can't log in, even with correct credentials.

**Possible Causes**:
1. Incorrect username or password
2. Session configuration issues
3. Secret key changes between restarts
4. Cookies are blocked or disabled

**Solutions**:

1. Verify the user credentials in the `USERS` dictionary:
   ```python
   # From garden_explorer.py
   USERS = {
       'demo': {
           'password': 'demo123',
           'display_name': 'Demo User'
       }
   }
   ```
   Ensure you're using the correct username ('demo') and password ('demo123').

2. Check the session configuration:
   ```python
   app.secret_key = os.environ.get('SECRET_KEY', 'dev_key_for_testing')
   app.config['PERMANENT_SESSION_LIFETIME'] = 3600  # 1 hour
   ```
   Ensure the secret key is set and consistent between application restarts.

3. Check if cookies are enabled in your browser, as sessions rely on cookies.

4. Try clearing browser cookies and cache, then logging in again.

### 5.2 Premature Session Expiration

**Symptom**: You're frequently logged out, even during active use.

**Possible Causes**:
1. Short session lifetime
2. Secret key changes between requests
3. Server restarts
4. Multiple instances with different secret keys

**Solutions**:

1. Increase the session lifetime:
   ```python
   app.config['PERMANENT_SESSION_LIFETIME'] = 86400  # 24 hours
   ```

2. Ensure the secret key is constant and stored in an environment variable:
   ```python
   app.secret_key = os.environ.get('SECRET_KEY', 'dev_key_for_testing')
   ```
   In production, always set the `SECRET_KEY` environment variable to a fixed value.

3. Set sessions to permanent in the login route:
   ```python
   @app.route('/login', methods=['GET', 'POST'])
   def login():
       # ... authentication logic ...
       session.permanent = True
       # ... rest of the function ...
   ```

4. If running multiple instances, ensure they all use the same secret key.

### 5.3 Redirected to Login in a Loop

**Symptom**: After logging in, you're immediately redirected back to the login page.

**Possible Causes**:
1. Session isn't being saved correctly
2. Authentication check is failing
3. Login route has a bug
4. Cookies are not being set

**Solutions**:

1. Check the login route logic:
   ```python
   @app.route('/login', methods=['GET', 'POST'])
   def login():
       # ... authentication logic ...
       if username in USERS and USERS[username]['password'] == password:
           # Successful login
           session['username'] = username
           session['display_name'] = USERS[username]['display_name']
           session.permanent = True
           
           log_activity('login_success')
           
           # Redirect to the original requested URL or the dashboard
           next_url = session.pop('next', url_for('index'))
           return redirect(next_url)
       # ... rest of the function ...
   ```
   Ensure the username is correctly stored in the session.

2. Check the `login_required` decorator:
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
   Ensure it's checking for the correct session key ('username').

3. Add debug logging to trace session values:
   ```python
   @app.route('/')
   @login_required
   def index():
       app.logger.debug(f"Session: {session}")
       # ... rest of the function ...
   ```

4. Ensure cookies are not being blocked by browser settings or security policies.

## 6. Performance Issues

As you use G.A.R.D.E.N. Explorer with larger datasets, you might encounter performance issues. Let's explore common performance problems and their solutions.

### 6.1 Slow Page Loading

**Symptom**: Pages take a long time to load, especially those displaying lists of nodes.

**Possible Causes**:
1. Large number of nodes being retrieved
2. Complex queries without optimization
3. Inefficient template rendering
4. Middleware overhead

**Solutions**:

1. Implement pagination to limit the number of nodes loaded at once:
   ```python
   @app.route('/labels/<label>')
   @login_required
   def list_nodes(label):
       # ... existing code ...
       page = request.args.get('page', 1, type=int)
       per_page = 20
       
       # Get total count
       count_query = f"MATCH (n:{label}) RETURN count(n) AS count"
       count_result = middleware.middleware.execute_query(count_query)
       total_count = count_result[0]['count']
       
       # Get paginated nodes
       nodes_query = f"MATCH (n:{label}) RETURN n SKIP {(page - 1) * per_page} LIMIT {per_page}"
       nodes_result = middleware.middleware.execute_query(nodes_query)
       nodes = [middleware._process_node_result(result['n']) for result in nodes_result]
       
       # ... rest of the function ...
   ```

2. Add indexing to your Neo4j database for frequently queried properties:
   ```cypher
   CREATE INDEX ON :Label(property)
   ```

3. Add caching for frequently accessed data:
   ```python
   from functools import lru_cache
   
   @lru_cache(maxsize=100)
   def get_node_count(label):
       """Get the count of nodes with a specific label (cached)."""
       count_query = f"MATCH (n:{label}) RETURN count(n) AS count"
       count_result = middleware.middleware.execute_query(count_query)
       return count_result[0]['count']
   ```

4. Optimize middleware operations by implementing batch processing:
   ```python
   def get_nodes_by_ids(self, label, node_ids):
       """Get multiple nodes by IDs in a single query."""
       if not node_ids:
           return []
       
       query = f"MATCH (n:{label}) WHERE n.uuid IN $ids RETURN n"
       params = {"ids": list(node_ids)}
       results = self.middleware.execute_query(query, params)
       return [self._process_node_result(result['n']) for result in results]
   ```

### 6.2 Memory Usage Concerns

**Symptom**: The application uses excessive memory, especially with large datasets.

**Possible Causes**:
1. Loading too much data into memory
2. Not releasing references to large objects
3. Inefficient data structures
4. Memory leaks

**Solutions**:

1. Implement streaming for large results:
   ```python
   def stream_nodes(label):
       """Stream nodes instead of loading them all into memory."""
       query = f"MATCH (n:{label}) RETURN n"
       
       with middleware.middleware._authenticated_driver().session() as session:
           result = session.run(query)
           for record in result:
               yield middleware._process_node_result(record['n'])
   ```

2. Use generators and iterators instead of lists where possible:
   ```python
   def get_node_properties_generator(nodes):
       """Generate properties from nodes without creating a full list."""
       for node in nodes:
           yield node['props']
   ```

3. Implement efficient JSON serialization for large objects:
   ```python
   import orjson  # faster JSON library
   
   def serialize_nodes(nodes):
       """Efficiently serialize nodes to JSON."""
       return orjson.dumps([
           {
               'uuid': node['uuid'],
               'labels': node['labels'],
               'props': node['props']
           }
           for node in nodes
       ])
   ```

4. Add memory profiling for development:
   ```python
   from memory_profiler import profile
   
   @profile
   def memory_intensive_function():
       """Function to profile for memory usage."""
       # ... implementation ...
   ```

### 6.3 Database Timeouts

**Symptom**: Some operations time out, especially complex queries.

**Possible Causes**:
1. Complex queries without optimization
2. Database resource limitations
3. Connection pool exhaustion
4. Transaction timeouts

**Solutions**:

1. Optimize complex queries:
   ```cypher
   # Instead of this
   MATCH (a)-[*1..5]->(b) WHERE a.uuid = $uuid RETURN b
   
   # Use this, which specifies relationship types
   MATCH (a)-[:REL_TYPE1|:REL_TYPE2*1..5]->(b) WHERE a.uuid = $uuid RETURN b
   ```

2. Increase Neo4j's available resources (memory, CPU) if possible.

3. Configure the connection pool appropriately:
   ```python
   def _authenticated_driver(uri=NEO4J_URI, username=NEO4J_USERNAME, password=NEO4J_PASSWORD):
       return GraphDatabase.driver(
           uri,
           auth=(username, password),
           max_connection_lifetime=3600,  # 1 hour
           max_connection_pool_size=50,
           connection_acquisition_timeout=60
       )
   ```

4. Implement query timeouts and retry logic:
   ```python
   def _query_with_timeout(query_text, query_params, timeout=30):
       """Execute a query with a timeout."""
       with middleware.middleware._authenticated_driver().session() as session:
           result = session.run(
               f"CALL apoc.cypher.runTimeboxed({timeout}, $query, $params)",
               {"query": query_text, "params": query_params}
           )
           return result.data()
   ```
   Note: This requires the APOC plugin for Neo4j.

## 7. Debugging Techniques

Effective debugging is essential for resolving issues in G.A.R.D.E.N. Explorer. Let's explore techniques and tools that can help.

### 7.1 Flask Debug Mode

Flask's debug mode provides detailed error information and an interactive debugger:

```python
# Enable debug mode in garden_explorer.py
app.debug = True
```

With debug mode enabled:
1. Detailed error traceback is displayed in the browser
2. The interactive debugger allows examining variables at the point of failure
3. The application automatically reloads when code changes

Remember to disable debug mode in production, as it can expose sensitive information.

### 7.2 Middleware Inspection

G.A.R.D.E.N. Explorer includes a debugging route for middleware inspection:

```python
# From garden_explorer.py
@app.route('/debug/middleware')
@login_required
def debug_middleware():
    """
    Debug route to examine the middleware structure.
    This is helpful for understanding middleware integration issues.
    """
    try:
        middleware_info = inspect_middleware(graph_db)
        return render_template('debug_middleware.html', info=middleware_info)
    except Exception as e:
        return f"Error inspecting middleware: {str(e)}"
```

This route:
1. Inspects the middleware module structure
2. Displays information about nodes, edges, and metadata
3. Provides insights into how the middleware is organized

To access this route, navigate to `/debug/middleware` in your browser.

### 7.3 Logging for Debugging

Enhanced logging can provide valuable information for debugging:

```python
# Add to garden_explorer.py
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='garden_explorer.log'
)
logger = logging.getLogger(__name__)

# Use logger throughout the code
@app.route('/')
@login_required
def index():
    logger.debug("Rendering dashboard")
    # ... existing code ...
```

This logging configuration:
1. Sets the logging level to DEBUG for detailed information
2. Formats log messages with timestamp, logger name, level, and message
3. Writes logs to a file for easy reference

You can add log statements at key points in your code to track execution flow and variable values.

### 7.4 Database Query Logging

To debug database-related issues, it's helpful to log queries:

```python
# Modify _query in the generated middleware
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
    import logging
    logger = logging.getLogger(__name__)
    
    logger.debug(f"Executing query: {query_text}")
    logger.debug(f"With parameters: {query_params}")
    
    start_time = time.time()
    with _authenticated_driver().session() as session:
        result = session.run(query_text, query_params).data()
    end_time = time.time()
    
    duration = end_time - start_time
    logger.debug(f"Query completed in {duration:.2f}s with {len(result)} results")
    
    return result
```

This enhanced query function:
1. Logs the query text and parameters
2. Measures and logs the query execution time
3. Logs the number of results returned

This information can help identify slow or problematic queries.

### 7.5 Using Python Debuggers

For complex issues, interactive debuggers like pdb can be invaluable:

```python
# Add to a specific function you want to debug
import pdb

def problematic_function():
    # ... some code ...
    pdb.set_trace()  # Debugger will start here
    # ... more code ...
```

When the code reaches `pdb.set_trace()`, it will pause execution and start an interactive debugger. You can then:
1. Examine variable values
2. Step through code line by line
3. Execute expressions to test hypotheses
4. Continue execution or jump to different points

For a more user-friendly experience, consider using ipdb (improved pdb) or PyCharm's debugger.

## 8. Common Error Messages and Solutions

Let's examine some specific error messages you might encounter in G.A.R.D.E.N. Explorer and their solutions.

### 8.1 "ImportError: No module named 'newgraph'"

**Cause**: The middleware module couldn't be found in the Python path.

**Solution**:
1. Generate the middleware using the Module Generator:
   ```bash
   python modulegenerator-claude.py -g "newgraph"
   ```
2. Ensure the generated file is in the same directory as `garden_explorer.py`.
3. Verify the import statement in `garden_explorer.py` matches the filename.

### 8.2 "TypeError: 'NoneType' object is not subscriptable"

**Cause**: Attempting to access an index or key of a `None` value.

**Solution**:
1. Add null checks before accessing data:
   ```python
   if result and 'key' in result:
       value = result['key']
   else:
       value = default_value
   ```
2. Use the `get` method with a default:
   ```python
   value = result.get('key', default_value) if result else default_value
   ```
3. Identify why the value is `None` and fix the root cause.

### 8.3 "OperationalError: Connection refused"

**Cause**: Unable to connect to the Neo4j database.

**Solution**:
1. Verify Neo4j is running.
2. Check connection parameters (host, port).
3. Ensure network connectivity between the application and Neo4j.
4. See Section 2.1 for detailed solutions.

### 8.4 "jinja2.exceptions.UndefinedError: 'get_node_display_name' is undefined"

**Cause**: A function used in a template isn't available in the template context.

**Solution**:
1. Pass the function to the template in `render_template`:
   ```python
   render_template('template.html', get_node_display_name=get_node_display_name)
   ```
2. Add the function to the global Jinja2 environment:
   ```python
   app.jinja_env.globals.update(get_node_display_name=get_node_display_name)
   ```

### 8.5 "SyntaxError: invalid syntax" in the Generated Middleware

**Cause**: The Module Generator produced invalid Python code.

**Solution**:
1. Check for syntax errors in the generated middleware:
   ```bash
   python -m py_compile newgraph.py
   ```
2. Regenerate the middleware with the current version of the Module Generator.
3. Manually fix any syntax errors in the generated file.

### 8.6 "CypherSyntaxError: Invalid input"

**Cause**: A Cypher query has syntax errors.

**Solution**:
1. Test the query in Neo4j Browser to identify syntax issues.
2. Check for proper escaping of special characters in labels and properties.
3. Verify parameter substitution is working correctly.
4. Ensure relationship types and node labels match those in the database.

### 8.7 "RuntimeError: Working outside of request context"

**Cause**: Attempting to access Flask's request, session, or g objects outside of a request context.

**Solution**:
1. Ensure the code accessing these objects is within a route function.
2. If needed, create a request context manually:
   ```python
   with app.test_request_context():
       # Code that uses request, session, or g
   ```
3. Restructure your code to avoid needing request context outside of routes.

## 9. Summary

In this notebook, we've explored common issues you might encounter when working with G.A.R.D.E.N. Explorer and provided practical solutions for each. We've covered:

1. **Understanding Error Handling**: How G.A.R.D.E.N. Explorer handles errors at different levels
2. **Neo4j Connection Issues**: Problems connecting to the database and their solutions
3. **Middleware Integration Issues**: Challenges with the middleware architecture and how to resolve them
4. **Flask Application Errors**: Common Flask-related problems and their fixes
5. **Authentication and Session Issues**: Solutions for login and session problems
6. **Performance Issues**: Techniques for improving application performance
7. **Debugging Techniques**: Tools and approaches for effective debugging
8. **Common Error Messages**: Specific error messages you might encounter and their solutions

With these troubleshooting techniques, you should be well-equipped to diagnose and resolve most issues that arise when working with G.A.R.D.E.N. Explorer.

Remember that debugging is often an iterative process. Start by identifying the symptoms, form hypotheses about possible causes, test those hypotheses, and implement solutions. With patience and a systematic approach, you can resolve even the most challenging issues.

## 10. Further Reading

- [Flask Debugging Documentation](https://flask.palletsprojects.com/en/2.0.x/debugging/)
- [Neo4j Troubleshooting Guide](https://neo4j.com/docs/operations-manual/current/troubleshooting/)
- [Python Debugging Techniques](https://realpython.com/python-debugging-pdb/)
- [Jinja2 Template Debugging](https://jinja.palletsprojects.com/en/3.0.x/templates/#debugging)
- [Neo4j Python Driver Error Reference](https://neo4j.com/docs/api/python-driver/current/api.html#error-reference)
- [Flask Error Handling Best Practices](https://flask.palletsprojects.com/en/2.0.x/errorhandling/)
- [Logging in Python](https://docs.python.org/3/library/logging.html)

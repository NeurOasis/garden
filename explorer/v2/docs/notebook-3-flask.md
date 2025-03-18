# Notebook 3: Understanding the Flask Application

## Learning Objectives

By the end of this notebook, you will be able to:
1. Understand the core concepts of Flask web applications
2. Identify the routes and views in G.A.R.D.E.N. Explorer
3. Understand Jinja2 templating and how it's used in the application
4. Recognize how session management and authentication work
5. Modify and extend the Flask application for your needs

## 1. Introduction to Flask

G.A.R.D.E.N. Explorer is built using Flask, a lightweight web framework for Python. Before diving into the specific implementation, let's understand some fundamental Flask concepts.

### 1.1 What is Flask?

Flask is a micro web framework written in Python. It's designed to make getting started with web development quick and easy, with the ability to scale up to complex applications. Flask is considered a "micro" framework because it doesn't include many tools or libraries by default. Instead, it focuses on providing the core functionality, allowing developers to add the components they need.

In G.A.R.D.E.N. Explorer, Flask is used to:
- Handle HTTP requests and responses
- Render HTML templates with data
- Manage user sessions and authentication
- Provide routing for different application pages

### 1.2 Flask Application Setup

Let's examine how G.A.R.D.E.N. Explorer sets up the Flask application:

```python
# From garden_explorer.py
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev_key_for_testing')
app.config['PERMANENT_SESSION_LIFETIME'] = 3600  # 1 hour
```

This code:
1. Creates a new Flask application instance
2. Sets a secret key for secure sessions (preferably from an environment variable)
3. Configures the session lifetime to 1 hour

The `__name__` parameter tells Flask where to look for templates, static files, and so on. In most cases, `__name__` is set to the name of the current module.

### 1.3 Running the Flask Application

At the end of the `garden_explorer.py` file, you'll find the code that starts the Flask development server:

```python
# From garden_explorer.py
if __name__ == '__main__':
    print(f"Starting G.A.R.D.E.N. Explorer...")
    print(f"Open your browser and go to: http://localhost:5000")
    app.run(debug=True)
```

This code:
1. Checks if the script is being run directly (not imported as a module)
2. Prints a startup message
3. Starts the Flask development server
4. Enables debug mode, which provides helpful error messages and auto-reloads when code changes

In a production environment, you would typically use a more robust server setup, but the development server is perfect for learning and exploring.

## 2. Routes and Views

In Flask, routes define the URLs that your application responds to, and views are the functions that handle those routes. Let's examine how routes and views are implemented in G.A.R.D.E.N. Explorer.

### 2.1 Basic Route Structure

A basic Flask route looks like this:

```python
@app.route('/path')
def view_function():
    return 'Response'
```

The `@app.route` decorator specifies the URL path, and the function below it handles requests to that path. The function can return a string, a template, a redirect, or various other responses.

### 2.2 The Index Route

Let's examine the index route in G.A.R.D.E.N. Explorer:

```python
# From garden_explorer.py
@app.route('/')
@login_required
def index():
    """
    Main dashboard that serves as the entry point for both Grassroots and Grasshopper approaches.
    """
    log_activity('view_dashboard')
    
    # Get the schema information for the Grassroots approach
    node_labels = middleware.get_node_labels()
    
    # For the Grasshopper approach, we'll prepare curated entry points
    # These are examples from the movie graph
    featured_movies = []
    featured_people = []
    
    try:
        # Get some featured movies
        movies = middleware.get_nodes_by_label('Movie')
        if movies:
            featured_movies = movies[:5]  # First 5 movies
        
        # Get some featured people
        people = middleware.get_nodes_by_label('Person')
        if people:
            featured_people = people[:5]  # First 5 people
    except Exception as e:
        flash(f"Error loading featured content: {str(e)}", "error")
    
    return render_template(
        'dashboard.html',
        node_labels=node_labels,
        featured_movies=featured_movies,
        featured_people=featured_people,
        get_node_display_name=get_node_display_name
    )
```

This route:
1. Responds to requests for the root URL (`/`)
2. Requires the user to be logged in (`@login_required` decorator)
3. Logs the activity
4. Gets data from the middleware (node labels, featured movies, featured people)
5. Renders the `dashboard.html` template with the data

The `render_template` function is a key part of Flask. It takes a template file name and a set of variables, renders the template with those variables, and returns the resulting HTML.

### 2.3 Dynamic Routes

Flask also supports dynamic routes, where part of the URL is a variable. G.A.R.D.E.N. Explorer uses this for viewing specific nodes:

```python
# From garden_explorer.py
@app.route('/nodes/<label>/<node_id>')
@login_required
def view_node(label, node_id):
    """
    View details of a specific node and its relationships (Grasshopper navigation).
    This is the heart of the "hopping" navigation pattern.
    """
    log_activity('view_node', {'label': label, 'node_id': node_id})
    
    try:
        # Find the specific node by ID
        node = middleware.get_node_by_id(label, node_id)
        
        if not node:
            flash(f"Node not found: {node_id}", "error")
            return redirect(url_for('index'))
        
        # Find all relationships connected to this node
        incoming_relationships = middleware.get_incoming_relationships(node_id)
        outgoing_relationships = middleware.get_outgoing_relationships(node_id)
        
        return render_template(
            'node_detail.html',
            node=node,
            label=label,
            incoming_relationships=incoming_relationships,
            outgoing_relationships=outgoing_relationships,
            get_node_display_name=get_node_display_name,
            format_property_value=format_property_value
        )
    
    except Exception as e:
        flash(f"Error viewing node: {str(e)}", "error")
        return redirect(url_for('index'))
```

This route:
1. Responds to URLs like `/nodes/Movie/123` where `Movie` is the label and `123` is the node_id
2. Uses the label and node_id parameters to retrieve the specific node
3. Gets the node's relationships
4. Renders the `node_detail.html` template with the node and relationship data

Dynamic routes allow you to create more flexible and expressive URLs that handle various types of data.

### 2.4 HTTP Methods

Flask routes can specify which HTTP methods they accept. G.A.R.D.E.N. Explorer uses this for the login form:

```python
# From garden_explorer.py
@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    Handle user login with a simple form.
    GET: Display the login form
    POST: Process the login form submission
    """
    error = None
    
    if request.method == 'POST':
        username = request.form.get('username', '')
        password = request.form.get('password', '')
        
        if username in USERS and USERS[username]['password'] == password:
            # Successful login
            session['username'] = username
            session['display_name'] = USERS[username]['display_name']
            session.permanent = True
            
            log_activity('login_success')
            
            # Redirect to the original requested URL or the dashboard
            next_url = session.pop('next', url_for('index'))
            return redirect(next_url)
        else:
            # Failed login
            error = "Invalid username or password"
            log_activity('login_failure', {'username': username})
    
    return render_template('login.html', error=error)
```

This route:
1. Responds to both GET and POST requests to `/login`
2. For GET requests, it simply renders the login form
3. For POST requests, it processes the form submission and performs authentication
4. After successful login, it redirects to the dashboard or the originally requested URL

Specifying HTTP methods allows you to handle different types of requests to the same URL in different ways.

### 2.5 URL Generation with url_for

Flask provides the `url_for` function to generate URLs for routes. G.A.R.D.E.N. Explorer uses this extensively in its templates:

```html
<!-- From dashboard.html -->
<a href="{{ url_for('list_nodes', label=label) }}">{{ label }}</a>
```

```python
# From garden_explorer.py
next_url = session.pop('next', url_for('index'))
return redirect(next_url)
```

The `url_for` function takes a view function name and any parameters needed for the route. It generates the correct URL, handling any escaping or path construction. This is more maintainable than hardcoding URLs, as it automatically adapts if routes change.

## 3. Templates and Jinja2

Flask uses the Jinja2 templating engine to render HTML templates. Let's explore how templates are used in G.A.R.D.E.N. Explorer.

### 3.1 Template Basics

Templates in Flask are HTML files with embedded Jinja2 code. Jinja2 allows you to include dynamic content, control structures, and more in your HTML.

A simple example from `dashboard.html`:

```html
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
```

This is mostly standard HTML, which Jinja2 will pass through unchanged.

### 3.2 Template Variables

Templates can include variables passed from the view function. G.A.R.D.E.N. Explorer uses this to display dynamic data:

```html
<!-- From node_detail.html -->
<h2>{{ get_node_display_name(node) }}</h2>
```

```python
# From garden_explorer.py
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

The `{{ ... }}` syntax in the template is replaced with the value of the expression inside. In this case, `get_node_display_name(node)` calls a function passed to the template with the node data.

### 3.3 Control Structures

Jinja2 includes control structures like loops and conditionals. G.A.R.D.E.N. Explorer uses these to handle lists of nodes, relationships, and more:

```html
<!-- From nodes_list.html -->
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
```

This template uses:
- `{% if nodes %} ... {% else %} ... {% endif %}` to conditionally display content based on whether nodes were found
- `{% for prop in display_properties %} ... {% endfor %}` to loop through properties and create table headers
- `{% for node in nodes %} ... {% endfor %}` to loop through nodes and create table rows

Control structures make templates dynamic and adaptable to different data.

### 3.4 Template Inheritance

Jinja2 supports template inheritance, where a child template can extend a parent template and override specific blocks. G.A.R.D.E.N. Explorer uses this to maintain a consistent layout across pages:

```html
<!-- From base.html -->
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}G.A.R.D.E.N. Explorer{% endblock %}</title>
    <style>
        /* ... (styles omitted for brevity) ... */
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

```html
<!-- From dashboard.html -->
{% extends 'base.html' %}

{% block title %}Dashboard - G.A.R.D.E.N. Explorer{% endblock %}

{% block content %}
<h2>Welcome to G.A.R.D.E.N. Explorer</h2>

<!-- ... (content omitted for brevity) ... -->
{% endblock %}
```

The `base.html` template defines the overall structure of the page, including the header, navigation, and footer. It also defines blocks that child templates can override: `title` and `content`.

The `dashboard.html` template extends `base.html` and overrides these blocks with specific content for the dashboard page. This approach ensures a consistent look and feel across all pages while avoiding code duplication.

### 3.5 Template Functions and Filters

Jinja2 allows you to pass functions to templates and also provides built-in filters for transforming data. G.A.R.D.E.N. Explorer uses both:

```html
<!-- From node_detail.html -->
<td>{{ get_node_display_name(relationship.target) }}</td>
```

```html
<!-- From schema.html -->
<p>Found {{ nodes|length }} nodes with label "{{ label }}"</p>
```

In the first example, `get_node_display_name` is a function passed to the template that generates a display name for a node.

In the second example, `|length` is a filter that returns the length of a list or string. Filters are applied using the pipe (`|`) syntax.

These features make templates more powerful and expressive, allowing complex data transformations and formatting within the template itself.

## 4. Session Management and Authentication

G.A.R.D.E.N. Explorer includes a simple authentication system to protect access to the application. Let's examine how it works.

### 4.1 Session Configuration

Flask provides a `session` object for storing data between requests. G.A.R.D.E.N. Explorer configures the session as follows:

```python
# From garden_explorer.py
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev_key_for_testing')
app.config['PERMANENT_SESSION_LIFETIME'] = 3600  # 1 hour
```

The `secret_key` is used to securely sign the session cookie, preventing tampering. In a production environment, you should set this to a strong, random value using an environment variable.

The `PERMANENT_SESSION_LIFETIME` setting determines how long a session lasts before expiring. In this case, it's set to 1 hour.

### 4.2 User Authentication

G.A.R.D.E.N. Explorer uses a simple in-memory user database for authentication:

```python
# From garden_explorer.py
# Simple user database - in a real application, this would come from a secure database
# Format: { username: { 'password': 'password_value', 'display_name': 'Display Name' } }
USERS = {
    'demo': {
        'password': 'demo123',
        'display_name': 'Demo User'
    }
}
```

The login process checks credentials against this database:

```python
# From garden_explorer.py
@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    Handle user login with a simple form.
    GET: Display the login form
    POST: Process the login form submission
    """
    error = None
    
    if request.method == 'POST':
        username = request.form.get('username', '')
        password = request.form.get('password', '')
        
        if username in USERS and USERS[username]['password'] == password:
            # Successful login
            session['username'] = username
            session['display_name'] = USERS[username]['display_name']
            session.permanent = True
            
            log_activity('login_success')
            
            # Redirect to the original requested URL or the dashboard
            next_url = session.pop('next', url_for('index'))
            return redirect(next_url)
        else:
            # Failed login
            error = "Invalid username or password"
            log_activity('login_failure', {'username': username})
    
    return render_template('login.html', error=error)
```

When a user submits the login form:
1. The view function retrieves the username and password from the form
2. It checks if the username exists in the USERS dictionary and if the password matches
3. If authentication succeeds, it stores the username and display name in the session
4. It marks the session as permanent (it will last until PERMANENT_SESSION_LIFETIME)
5. It redirects to the originally requested URL or the dashboard

For a production application, you would typically use a more robust authentication system with a proper database, password hashing, and possibly integration with external authentication providers.

### 4.3 Access Control with login_required

G.A.R.D.E.N. Explorer uses a decorator to protect routes that require authentication:

```python
# From garden_explorer.py
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

This decorator:
1. Checks if 'username' is in the session (indicating the user is logged in)
2. If not, it stores the requested URL in the session for later redirect
3. It flashes a warning message
4. It redirects to the login page
5. If the user is logged in, it calls the original view function

The decorator is applied to routes that require authentication:

```python
@app.route('/')
@login_required
def index():
    # ...
```

This ensures that only authenticated users can access protected routes.

### 4.4 Logging Out

G.A.R.D.E.N. Explorer also provides a logout function to end the user's session:

```python
# From garden_explorer.py
@app.route('/logout')
def logout():
    """
    Handle user logout by clearing the session.
    """
    log_activity('logout')
    session.clear()
    flash('You have been logged out', 'info')
    return redirect(url_for('login'))
```

This function:
1. Logs the logout activity
2. Clears the session, removing all stored data
3. Flashes an informational message
4. Redirects to the login page

### 4.5 Using Flash Messages

Flask provides a `flash` function for passing temporary messages to the next request. G.A.R.D.E.N. Explorer uses this for notifications:

```python
# From garden_explorer.py
flash('Please log in to access this page', 'warning')
```

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

The `flash` function adds a message to the flash message queue, which is stored in the session. The template retrieves and displays these messages using `get_flashed_messages`, then they are automatically cleared.

Each message can have a category ('warning', 'error', 'info', etc.) which allows for different styling based on the type of message.

## 5. Activity Logging

G.A.R.D.E.N. Explorer includes a simple activity logging system to track user actions. Let's examine how it works.

### 5.1 The log_activity Function

The core of the logging system is the `log_activity` function:

```python
# From garden_explorer.py
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

This function:
1. Creates a timestamp for the activity
2. Gets the username from the session (or 'anonymous' if not logged in)
3. Creates an activity record with the timestamp, username, activity type, and optional details
4. Prints the activity to the console (in a production system, this would be written to a log file or database)

### 5.2 Logging Different Activities

G.A.R.D.E.N. Explorer logs various activities throughout the application:

```python
# Login success
log_activity('login_success')

# Login failure
log_activity('login_failure', {'username': username})

# Viewing the dashboard
log_activity('view_dashboard')

# Viewing a specific node
log_activity('view_node', {'label': label, 'node_id': node_id})

# Searching
log_activity('search', {'query': query})
```

Each activity is logged with a specific type and relevant details, providing a comprehensive audit trail of user actions.

In a production system, you would typically enhance this logging system to write to a secure log file or database, include more detailed information, and possibly implement log rotation and other management features.

## 6. Error Handling

G.A.R.D.E.N. Explorer includes error handling to provide a better user experience when things go wrong. Let's examine how it handles errors.

### 6.1 Try-Except Blocks

Many view functions include try-except blocks to handle errors gracefully:

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

This function:
1. Attempts to retrieve and process nodes
2. If an error occurs, it flashes an error message with the exception details
3. It redirects to the dashboard, allowing the user to continue using the application

This pattern is used throughout G.A.R.D.E.N. Explorer to handle errors at the view level.

### 6.2 Custom Error Pages

G.A.R.D.E.N. Explorer also includes custom error handlers for common HTTP errors:

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

These handlers:
1. Catch specific HTTP errors (404 for Page Not Found, 500 for Server Error)
2. Render custom templates for these errors
3. Return the appropriate HTTP status code

Custom error pages provide a more user-friendly experience than the default error pages, helping users understand what went wrong and what they can do next.

### 6.3 Fallback Middleware

G.A.R.D.E.N. Explorer includes a fallback mechanism for when the real middleware can't be imported:

```python
# From garden_explorer.py
try:
    # Import the middleware - normally this would be generated with the Module Generator
    import newgraph as graph_db
    
    # Create a middleware adapter to handle different middleware structures
    from middleware_adapter import create_middleware_adapter
    middleware = create_middleware_adapter(graph_db)
except ImportError as e:
    print(f"Error importing middleware: {e}")
    # For demonstration purposes, we'll use a simplified mock if the real middleware isn't available
    from helpers import create_mock_middleware
    graph_db = create_mock_middleware()
    middleware = graph_db  # Mock middleware already has the right structure
```

This code:
1. Attempts to import the generated middleware
2. If it can't be imported, it falls back to a simplified mock middleware
3. This allows the application to run with sample data even if the real middleware isn't available

This fallback mechanism makes the application more robust and easier to get started with, as it can run without a properly configured middleware.

## 7. Extending the Flask Application

Now that you understand the core components of the Flask application, let's explore how you might extend it for your own needs.

### 7.1 Adding a New Route

To add a new route to G.A.R.D.E.N. Explorer, you would follow this pattern:

```python
@app.route('/new-route')
@login_required
def new_route():
    """
    Description of the new route.
    """
    log_activity('view_new_route')
    
    try:
        # Get data from the middleware
        data = middleware.get_some_data()
        
        # Process the data
        processed_data = process_data(data)
        
        # Render a template with the data
        return render_template(
            'new_route.html',
            data=processed_data
        )
    except Exception as e:
        flash(f"Error in new route: {str(e)}", "error")
        return redirect(url_for('index'))
```

You would also need to create a template for the new route, extending the base template:

```html
{% extends 'base.html' %}

{% block title %}New Route - G.A.R.D.E.N. Explorer{% endblock %}

{% block content %}
<h2>New Route</h2>

<!-- Display the data -->
<div class="card">
    <h3>Data</h3>
    <pre>{{ data }}</pre>
</div>
{% endblock %}
```

### 7.2 Adding a New Helper Function

To add a new helper function for use in your routes or templates, you would define it in `garden_explorer.py`:

```python
def new_helper_function(data):
    """
    Description of the new helper function.
    
    Parameters
    ----------
    data: Any
        The data to process
        
    Returns
    -------
    Any:
        The processed data
    """
    # Process the data
    processed_data = process_data(data)
    
    return processed_data
```

If you want to use this function in your templates, you would need to add it to the global Jinja2 environment:

```python
# Make helper functions available to all templates
app.jinja_env.globals.update(
    get_relationship_display=get_relationship_display,
    new_helper_function=new_helper_function
)
```

### 7.3 Modifying Authentication

If you want to use a different authentication system, you would need to modify the `login` route and the `login_required` decorator. For example, to use a database instead of the in-memory user store:

```python
# Database connection
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy(app)

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    display_name = db.Column(db.String(80), nullable=False)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Modified login route
@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    Handle user login with database authentication.
    """
    error = None
    
    if request.method == 'POST':
        username = request.form.get('username', '')
        password = request.form.get('password', '')
        
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            # Successful login
            session['username'] = user.username
            session['display_name'] = user.display_name
            session.permanent = True
            
            log_activity('login_success')
            
            # Redirect to the original requested URL or the dashboard
            next_url = session.pop('next', url_for('index'))
            return redirect(next_url)
        else:
            # Failed login
            error = "Invalid username or password"
            log_activity('login_failure', {'username': username})
    
    return render_template('login.html', error=error)
```

This is just a sketch of how you might modify the authentication system. A full implementation would include database setup, password hashing, user management routes, and more.

### 7.4 Adding a New Template

To add a new template, you would create a `.html` file in the `templates` directory, extending the base template:

```html
{% extends 'base.html' %}

{% block title %}New Template - G.A.R.D.E.N. Explorer{% endblock %}

{% block content %}
<h2>New Template</h2>

<!-- Add your content here -->
<div class="card">
    <h3>Content</h3>
    <p>This is a new template.</p>
</div>
{% endblock %}
```

You would then render this template from a view function:

```python
@app.route('/new-template')
@login_required
def new_template():
    """
    Render the new template.
    """
    return render_template('new_template.html')
```

## 8. Summary

In this notebook, we've explored the Flask-based architecture of G.A.R.D.E.N. Explorer, understanding:

1. Core Flask concepts and application setup
2. Routes and views for handling HTTP requests
3. Templates and Jinja2 for rendering HTML
4. Session management and authentication for user access control
5. Activity logging for tracking user actions
6. Error handling for a better user experience
7. Extension points for customizing the application

Flask provides a flexible, lightweight framework for web applications, and G.A.R.D.E.N. Explorer demonstrates how to build a functional application with it. The modular design allows for easy extension and customization to meet your specific needs.

In the next notebook, we'll dive deeper into the middleware integration, understanding how G.A.R.D.E.N. Explorer connects to Neo4j and abstracts away the complexity of graph database queries.

## 9. Further Reading

- [Flask Documentation](https://flask.palletsprojects.com/) - The official Flask documentation
- [Jinja2 Documentation](https://jinja.palletsprojects.com/) - The official Jinja2 documentation
- [Flask Mega-Tutorial](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world) - A comprehensive tutorial on Flask
- [Flask Web Development](https://www.oreilly.com/library/view/flask-web-development/9781491991725/) - A book by Miguel Grinberg on Flask
- [Flask Extensions](https://flask.palletsprojects.com/en/2.0.x/extensions/) - Official Flask extensions for additional functionality

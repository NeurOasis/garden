# Notebook 5: Customizing and Extending G.A.R.D.E.N. Explorer

## Learning Objectives

By the end of this notebook, you will be able to:
1. Customize the appearance of G.A.R.D.E.N. Explorer through CSS and templates
2. Add new routes and views for custom functionality
3. Extend the middleware adapter for specialized database operations
4. Implement custom helper functions for data processing and display
5. Create new templates for specialized data visualization

## 1. Understanding the Extension Points

G.A.R.D.E.N. Explorer is designed to be customizable and extensible at various levels. Before diving into specific customizations, let's identify the main extension points:

### 1.1 Extension Points Overview

1. **Templates**: Modify or create HTML templates to change the appearance and layout
2. **CSS**: Customize the visual styling through CSS in the base template
3. **Routes**: Add new routes and views for custom functionality
4. **Helper Functions**: Create new helper functions for data processing and display
5. **Middleware Adapter**: Extend the middleware adapter for specialized database operations
6. **Authentication**: Enhance the authentication system for production use

### 1.2 Files to Modify

When customizing G.A.R.D.E.N. Explorer, you'll typically modify these files:

- `garden_explorer.py`: The main application file containing routes, views, and helper functions
- `middleware_adapter.py`: The middleware adapter for database interactions
- `templates/*.html`: The HTML templates for the user interface
- `helpers.py`: Helper functions for various tasks

Let's examine each extension point in detail.

## 2. Customizing the Appearance

### 2.1 Modifying CSS

G.A.R.D.E.N. Explorer includes CSS directly in the `base.html` template. To customize the appearance, you can modify this CSS:

```html
<!-- From base.html -->
<style>
    /* Simple, clean styling */
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        background-color: #f5f5f5;
        line-height: 1.6;
    }
    .container {
        max-width: 1200px;
        margin: 0 auto;
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        margin-bottom: 20px;
    }
    /* ... more styles ... */
</style>
```

To customize the appearance:

1. Open `templates/base.html`
2. Modify the CSS within the `<style>` tag
3. Save the file and restart the Flask application

You can customize various aspects of the appearance:

- Colors and background
- Typography and fonts
- Layout and spacing
- Card and table styles
- Navigation and header/footer

For example, to change the primary color from green to blue:

```css
h1, h2, h3 {
    color: #336699; /* Changed from #336633 (green) to #336699 (blue) */
}

a {
    color: #336699; /* Changed from #336633 (green) to #336699 (blue) */
    text-decoration: none;
}

.search-box button {
    padding: 8px 15px;
    background-color: #336699; /* Changed from #336633 (green) to #336699 (blue) */
    color: white;
    border: none;
    cursor: pointer;
}
```

### 2.2 Customizing Templates

You can also modify the HTML templates to change the layout and content. Each page in G.A.R.D.E.N. Explorer has its own template:

- `base.html`: The base template with common structure and styles
- `dashboard.html`: The main dashboard
- `schema.html`: The schema overview
- `nodes_list.html`: The list of nodes for a specific label
- `node_detail.html`: The details of a specific node
- `search.html`: The search interface
- `login.html`: The login form
- `404.html` and `500.html`: Error pages

To customize a template:

1. Open the template file in the `templates` directory
2. Modify the HTML as needed
3. Save the file and restart the Flask application

For example, to customize the dashboard layout:

```html
<!-- Modified dashboard.html -->
{% extends 'base.html' %}

{% block title %}Dashboard - G.A.R.D.E.N. Explorer{% endblock %}

{% block content %}
<h2>Welcome to Your Custom G.A.R.D.E.N. Explorer</h2>

<div class="card">
    <h3>About This Explorer</h3>
    <p>
        This customized application provides enhanced ways to explore your graph data:
    </p>
    <ul>
        <li><strong>Grassroots</strong>: Start with the schema and drill down to instances</li>
        <li><strong>Grasshopper</strong>: Start with specific entities and hop between connections</li>
        <li><strong>New Feature</strong>: A custom feature you've added</li>
    </ul>
</div>

<!-- Modified layout with a single column -->
<div>
    <h3>Explore Your Data</h3>
    
    <div class="card">
        <h4>Node Labels</h4>
        <ul>
            {% for label in node_labels %}
            <li><a href="{{ url_for('list_nodes', label=label) }}">{{ label }}</a></li>
            {% endfor %}
        </ul>
    </div>
    
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

This modified template:
- Changes the welcome message
- Adds a mention of a new feature
- Modifies the layout from two columns to a single column
- Keeps the same functionality but with a different presentation

### 2.3 Creating New Templates

You can also create entirely new templates for custom pages. For example, to create a template for a statistics page:

```html
<!-- New file: templates/statistics.html -->
{% extends 'base.html' %}

{% block title %}Statistics - G.A.R.D.E.N. Explorer{% endblock %}

{% block content %}
<h2>Graph Statistics</h2>

<div class="card">
    <h3>Node Counts</h3>
    <table>
        <thead>
            <tr>
                <th>Label</th>
                <th>Count</th>
            </tr>
        </thead>
        <tbody>
            {% for label, count in node_counts.items() %}
            <tr>
                <td>{{ label }}</td>
                <td>{{ count }}</td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
</div>

<div class="card">
    <h3>Relationship Counts</h3>
    <table>
        <thead>
            <tr>
                <th>Type</th>
                <th>Count</th>
            </tr>
        </thead>
        <tbody>
            {% for type, count in relationship_counts.items() %}
            <tr>
                <td>{{ type }}</td>
                <td>{{ count }}</td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
</div>

<div class="navigation">
    <a href="{{ url_for('index') }}">&larr; Back to Dashboard</a>
</div>
{% endblock %}
```

This new template:
- Extends the base template
- Defines a title and content
- Displays statistical information about the graph
- Includes navigation back to the dashboard

## 3. Adding New Routes and Views

To add new functionality to G.A.R.D.E.N. Explorer, you'll often need to create new routes and views. Let's explore how to do this.

### 3.1 Creating a Statistics Route

To create a route for the statistics template we just created:

```python
# Add to garden_explorer.py
@app.route('/statistics')
@login_required
def statistics():
    """
    View statistics about the graph.
    """
    log_activity('view_statistics')
    
    try:
        # Get node counts
        node_counts = {}
        for label in middleware.get_node_labels():
            nodes = middleware.get_nodes_by_label(label)
            node_counts[label] = len(nodes)
        
        # Get relationship counts
        relationship_counts = {}
        for rel_type in middleware.get_relationship_types():
            # This is a simplified approach; in a real application,
            # you might want to use a more efficient query
            count = 0
            for label in middleware.get_node_labels():
                nodes = middleware.get_nodes_by_label(label)
                for node in nodes:
                    outgoing = middleware.get_outgoing_relationships_by_type(node['uuid'], rel_type)
                    count += len(outgoing)
            relationship_counts[rel_type] = count
        
        return render_template(
            'statistics.html',
            node_counts=node_counts,
            relationship_counts=relationship_counts
        )
    except Exception as e:
        flash(f"Error generating statistics: {str(e)}", "error")
        return redirect(url_for('index'))
```

This route:
1. Requires authentication
2. Logs the activity
3. Calculates node counts for each label
4. Calculates relationship counts for each type
5. Renders the statistics template with the data

However, there's a problem: the `get_outgoing_relationships_by_type` method doesn't exist in our middleware adapter. Let's add it.

### 3.2 Extending the Middleware Adapter

To add the new method to the middleware adapter:

```python
# Add to middleware_adapter.py
def get_outgoing_relationships_by_type(self, node_id, rel_type):
    """
    Get outgoing relationships of a specific type for a node.
    
    Parameters
    ----------
    node_id: str
        The node ID
    rel_type: str
        The relationship type
            
    Returns
    -------
    List[Dict]:
        List of relationship information
    """
    outgoing = []
    
    try:
        # Approach 1: Using edges.rel_type() method
        if hasattr(self.middleware, 'edges'):
            func_name = rel_type.lower().replace(':', '_').replace('-', '_')
            rel_func = getattr(self.middleware.edges, func_name, None)
            if rel_func and callable(rel_func):
                rels = rel_func(start_node_uuid=node_id)
                for source, rel, target in rels:
                    outgoing.append({
                        'source': source,
                        'relationship': rel,
                        'target': target,
                        'type': rel_type
                    })
        
        # Approach 2: Direct query
        elif hasattr(self.middleware, 'execute_query'):
            results = self.middleware.execute_query(
                f"MATCH (source)-[r:{rel_type}]->(target) WHERE source.uuid = $uuid RETURN source, r, target",
                {"uuid": node_id}
            )
            for result in results:
                outgoing.append({
                    'source': self._process_node_result(result['source']),
                    'relationship': self._process_relationship_result(result['r']),
                    'target': self._process_node_result(result['target']),
                    'type': rel_type
                })
    except Exception as e:
        print(f"Error getting outgoing relationships of type {rel_type} for node {node_id}: {e}")
    
    return outgoing
```

This method is similar to `get_outgoing_relationships`, but it filters by relationship type. Now our statistics route can use this method to count relationships by type.

### 3.3 Adding Navigation Links

To make our new statistics page accessible, we should add a link to it in the navigation:

```html
<!-- Modify base.html -->
<div class="navigation">
    <a href="{{ url_for('index') }}">Dashboard</a> |
    <a href="{{ url_for('schema_overview') }}">Schema</a> |
    <a href="{{ url_for('search') }}">Search</a> |
    <a href="{{ url_for('statistics') }}">Statistics</a>
</div>
```

This adds a link to our statistics page in the main navigation bar.

## 4. Creating Custom Helper Functions

G.A.R.D.E.N. Explorer uses helper functions for various tasks, from formatting data to generating display names. Let's explore how to create custom helper functions.

### 4.1 Adding a Helper Function to garden_explorer.py

Let's create a helper function for calculating the centrality of a node (a measure of its importance in the graph):

```python
# Add to garden_explorer.py
def calculate_node_centrality(node_id):
    """
    Calculate the centrality of a node based on its relationships.
    
    This is a simple measure: the total number of incoming and outgoing relationships.
    In a real application, you might use more sophisticated measures.
    
    Parameters
    ----------
    node_id: str
        The node ID
        
    Returns
    -------
    int:
        The centrality value
    """
    try:
        incoming = middleware.get_incoming_relationships(node_id)
        outgoing = middleware.get_outgoing_relationships(node_id)
        return len(incoming) + len(outgoing)
    except Exception as e:
        print(f"Error calculating centrality for node {node_id}: {e}")
        return 0
```

This helper function:
1. Takes a node ID as input
2. Gets the incoming and outgoing relationships for the node
3. Returns the total number of relationships as a simple centrality measure

Now we can use this function in our routes and templates.

### 4.2 Using the Helper Function in a Route

Let's modify the `view_node` route to include centrality information:

```python
# Modify view_node in garden_explorer.py
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
        
        # Calculate the node's centrality
        centrality = calculate_node_centrality(node_id)
        
        return render_template(
            'node_detail.html',
            node=node,
            label=label,
            incoming_relationships=incoming_relationships,
            outgoing_relationships=outgoing_relationships,
            centrality=centrality,
            get_node_display_name=get_node_display_name,
            format_property_value=format_property_value
        )
    
    except Exception as e:
        flash(f"Error viewing node: {str(e)}", "error")
        return redirect(url_for('index'))
```

We've added:
1. A call to our `calculate_node_centrality` function
2. The centrality value to the template context

### 4.3 Modifying the Template to Use the Helper Function

Now let's modify the `node_detail.html` template to display the centrality information:

```html
<!-- Modify node_detail.html -->
<h2>{{ get_node_display_name(node) }}</h2>

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

<!-- Centrality Information -->
<div class="card">
    <h3>Centrality</h3>
    <p>
        This node has a centrality value of <strong>{{ centrality }}</strong>.
        {% if centrality > 10 %}
        <span style="color: #336633;">This is a highly connected node.</span>
        {% elif centrality > 5 %}
        <span style="color: #666633;">This is a moderately connected node.</span>
        {% else %}
        <span style="color: #663333;">This is a sparsely connected node.</span>
        {% endif %}
    </p>
</div>

<!-- ... rest of the template ... -->
```

We've added a new card that displays:
1. The centrality value
2. A qualitative description based on the value
3. Color-coding to highlight the significance

### 4.4 Making Helper Functions Available to Templates

To make a helper function directly available in templates, you can add it to the Jinja2 environment:

```python
# Add to garden_explorer.py after defining the helper function
app.jinja_env.globals.update(
    get_relationship_display=get_relationship_display,
    get_node_display_name=get_node_display_name,
    format_property_value=format_property_value,
    calculate_node_centrality=calculate_node_centrality
)
```

This makes the `calculate_node_centrality` function available directly in templates, along with the other helper functions.

## 5. Implementing Advanced Visualization

G.A.R.D.E.N. Explorer's default visualization is table-based, but you might want to add more advanced visualizations for your data. Let's explore how to do this.

### 5.1 Creating a Path Visualization Page

Let's create a page that visualizes paths between nodes. First, we'll add a route:

```python
# Add to garden_explorer.py
@app.route('/paths/<start_label>/<start_id>/<end_label>/<end_id>')
@login_required
def view_paths(start_label, start_id, end_label, end_id):
    """
    View all paths between two nodes.
    """
    log_activity('view_paths', {
        'start_label': start_label,
        'start_id': start_id,
        'end_label': end_label,
        'end_id': end_id
    })
    
    try:
        # Get the start and end nodes
        start_node = middleware.get_node_by_id(start_label, start_id)
        end_node = middleware.get_node_by_id(end_label, end_id)
        
        if not start_node or not end_node:
            flash("One or both nodes not found", "error")
            return redirect(url_for('index'))
        
        # Find paths between the nodes (simplified approach for demonstration)
        paths = find_paths(start_node, end_node)
        
        return render_template(
            'paths.html',
            start_node=start_node,
            end_node=end_node,
            paths=paths,
            get_node_display_name=get_node_display_name,
            get_relationship_display=get_relationship_display
        )
    except Exception as e:
        flash(f"Error finding paths: {str(e)}", "error")
        return redirect(url_for('index'))
```

Now we need to implement the `find_paths` helper function:

```python
# Add to garden_explorer.py
def find_paths(start_node, end_node, max_depth=3):
    """
    Find paths between two nodes.
    
    This is a simplified implementation that only works for short paths.
    In a real application, you would typically use Neo4j's path finding algorithms.
    
    Parameters
    ----------
    start_node: Dict
        The starting node
    end_node: Dict
        The ending node
    max_depth: int
        The maximum path length
        
    Returns
    -------
    List[List[Dict]]:
        A list of paths, where each path is a list of nodes and relationships
    """
    # For demonstration purposes, we'll use a direct Cypher query
    # This requires the middleware to have an execute_query method
    if not hasattr(middleware.middleware, 'execute_query'):
        return []
    
    try:
        # Execute a Cypher query to find paths
        query = f"""
        MATCH path = (start)-[*1..{max_depth}]->(end)
        WHERE start.uuid = $start_id AND end.uuid = $end_id
        RETURN path
        LIMIT 10
        """
        
        params = {
            'start_id': start_node['uuid'],
            'end_id': end_node['uuid']
        }
        
        results = middleware.middleware.execute_query(query, params)
        
        # Process the results into a list of paths
        paths = []
        for result in results:
            path = result['path']
            # Process the path based on the format returned by Neo4j
            # This is a simplified example; you would need to adapt this to your actual data structure
            processed_path = []
            for i, node in enumerate(path.nodes):
                processed_path.append({
                    'type': 'node',
                    'data': middleware._process_node_result(node)
                })
                if i < len(path.relationships):
                    processed_path.append({
                        'type': 'relationship',
                        'data': middleware._process_relationship_result(path.relationships[i])
                    })
            paths.append(processed_path)
        
        return paths
    except Exception as e:
        print(f"Error finding paths: {e}")
        return []
```

This function:
1. Takes start and end nodes as input
2. Executes a Cypher query to find paths between them
3. Processes the results into a format suitable for visualization
4. Handles errors gracefully

Now let's create the template for visualizing these paths:

```html
<!-- New file: templates/paths.html -->
{% extends 'base.html' %}

{% block title %}Paths - G.A.R.D.E.N. Explorer{% endblock %}

{% block content %}
<h2>Paths from {{ get_node_display_name(start_node) }} to {{ get_node_display_name(end_node) }}</h2>

{% if paths %}
    {% for path in paths %}
    <div class="card">
        <h3>Path {{ loop.index }}</h3>
        <div class="path-visualization">
            {% for element in path %}
                {% if element.type == 'node' %}
                    <div class="node">
                        <div class="node-content">
                            {{ get_node_display_name(element.data) }}
                        </div>
                    </div>
                {% else %}
                    <div class="relationship">
                        <div class="relationship-line"></div>
                        <div class="relationship-content">
                            {{ get_relationship_display(element.data) }}
                        </div>
                        <div class="relationship-line"></div>
                    </div>
                {% endif %}
            {% endfor %}
        </div>
    </div>
    {% endfor %}
{% else %}
    <div class="card">
        <p>No paths found between these nodes within the maximum path length.</p>
    </div>
{% endif %}

<div class="navigation">
    <a href="{{ url_for('view_node', label=start_node.labels[0], node_id=start_node.uuid) }}">&larr; Back to {{ get_node_display_name(start_node) }}</a> |
    <a href="{{ url_for('view_node', label=end_node.labels[0], node_id=end_node.uuid) }}">Back to {{ get_node_display_name(end_node) }} &rarr;</a> |
    <a href="{{ url_for('index') }}">&larr; Back to Dashboard</a>
</div>
{% endblock %}

{% block extra_styles %}
<style>
    .path-visualization {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        overflow-x: auto;
        padding: 20px 0;
    }
    
    .node {
        background-color: #e8f5e9;
        border: 1px solid #336633;
        border-radius: 5px;
        padding: 10px;
        margin: 0 5px;
        min-width: 100px;
        text-align: center;
    }
    
    .relationship {
        display: flex;
        align-items: center;
        margin: 0 5px;
    }
    
    .relationship-line {
        height: 2px;
        width: 20px;
        background-color: #336633;
    }
    
    .relationship-content {
        font-size: 0.8em;
        color: #666;
        margin: 0 5px;
    }
</style>
{% endblock %}
```

This template:
1. Displays the start and end nodes
2. Visualizes each path as a horizontal sequence of nodes and relationships
3. Includes custom CSS for the visualization
4. Provides navigation back to the node detail pages and dashboard

Finally, let's add links to this visualization from the node detail page:

```html
<!-- Modify node_detail.html -->
<!-- Add after the relationship tables -->
<div class="card">
    <h3>Path Finding</h3>
    <p>Find paths from this node to another node:</p>
    <form action="{{ url_for('search') }}" method="get" class="search-box">
        <input type="hidden" name="path_start_label" value="{{ label }}">
        <input type="hidden" name="path_start_id" value="{{ node.uuid }}">
        <input type="text" name="query" placeholder="Search for a destination node">
        <button type="submit">Search</button>
    </form>
</div>
```

And modify the search route to handle path finding:

```python
# Modify search in garden_explorer.py
@app.route('/search', methods=['GET'])
@login_required
def search():
    """
    Simple search functionality to find nodes by property values.
    Also handles destination search for path finding.
    """
    query = request.args.get('query', '').strip()
    
    # Check if this is a path finding search
    path_start_label = request.args.get('path_start_label')
    path_start_id = request.args.get('path_start_id')
    is_path_search = path_start_label and path_start_id
    
    if not query:
        return render_template(
            'search.html',
            results=None,
            query=None,
            is_path_search=is_path_search,
            path_start_label=path_start_label,
            path_start_id=path_start_id
        )
    
    log_activity('search', {'query': query, 'is_path_search': is_path_search})
    
    results = {}
    
    try:
        # Search across all node labels
        for label in middleware.get_node_labels():
            nodes = middleware.get_nodes_by_label(label)
            
            # Simple client-side filtering - in a real application, this would use a proper search query
            label_results = []
            for node in nodes:
                for prop, value in node['props'].items():
                    if isinstance(value, str) and query.lower() in value.lower():
                        label_results.append(node)
                        break
            
            if label_results:
                results[label] = label_results
        
        return render_template(
            'search.html',
            results=results,
            query=query,
            is_path_search=is_path_search,
            path_start_label=path_start_label,
            path_start_id=path_start_id,
            get_node_display_name=get_node_display_name
        )
    
    except Exception as e:
        flash(f"Error performing search: {str(e)}", "error")
        return render_template(
            'search.html',
            results=None,
            query=query,
            is_path_search=is_path_search,
            path_start_label=path_start_label,
            path_start_id=path_start_id
        )
```

Finally, modify the search template to display path links:

```html
<!-- Modify search.html -->
{% if is_path_search %}
<h3>Select a destination node for path finding:</h3>
{% endif %}

{% if not results or results|length == 0 %}
<p>No results found.</p>
{% else %}
{% for label, nodes in results.items() %}
<div class="card">
    <h4>{{ label }} ({{ nodes|length }})</h4>
    <ul>
        {% for node in nodes %}
        <li>
            {% if is_path_search %}
            <a href="{{ url_for('view_paths', start_label=path_start_label, start_id=path_start_id, end_label=label, end_id=node.uuid) }}">
                {{ get_node_display_name(node) }}
            </a>
            {% else %}
            <a href="{{ url_for('view_node', label=label, node_id=node.uuid) }}">
                {{ get_node_display_name(node) }}
            </a>
            {% endif %}
        </li>
        {% endfor %}
    </ul>
</div>
{% endfor %}
{% endif %}
```

This implementation allows users to:
1. Start from a node's detail page
2. Search for a destination node
3. Select a destination node from the search results
4. View all paths between the two nodes

## 6. Enhancing Authentication for Production

G.A.R.D.E.N. Explorer includes a simple authentication system using an in-memory user database. For production use, you'll likely want to enhance this system.

### 6.1 Using Flask-Login

Let's modify G.A.R.D.E.N. Explorer to use [Flask-Login](https://flask-login.readthedocs.io/), a popular Flask extension for user session management:

```python
# Add to the top of garden_explorer.py
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
```

```python
# Add after Flask app initialization
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
```

Now let's create a User class that works with Flask-Login:

```python
# Add to garden_explorer.py
class User(UserMixin):
    def __init__(self, id, username, display_name):
        self.id = id
        self.username = username
        self.display_name = display_name

# User loader function for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    if user_id in USERS:
        return User(user_id, user_id, USERS[user_id]['display_name'])
    return None
```

Now let's modify the login and logout routes to use Flask-Login:

```python
# Modify login in garden_explorer.py
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
            user = User(username, username, USERS[username]['display_name'])
            login_user(user, remember=True)
            
            log_activity('login_success')
            
            # Redirect to the original requested URL or the dashboard
            next_url = request.args.get('next') or url_for('index')
            return redirect(next_url)
        else:
            # Failed login
            error = "Invalid username or password"
            log_activity('login_failure', {'username': username})
    
    return render_template('login.html', error=error)

# Modify logout in garden_explorer.py
@app.route('/logout')
def logout():
    """
    Handle user logout by clearing the session.
    """
    log_activity('logout')
    logout_user()
    flash('You have been logged out', 'info')
    return redirect(url_for('login'))
```

Now let's modify the base template to use the current_user:

```html
<!-- Modify base.html -->
<div class="header">
    <h1>G.A.R.D.E.N. Explorer</h1>
    {% if current_user.is_authenticated %}
    <div>
        Welcome, {{ current_user.display_name }} | 
        <a href="{{ url_for('logout') }}">Logout</a>
    </div>
    {% endif %}
</div>

{% if current_user.is_authenticated %}
<div class="navigation">
    <a href="{{ url_for('index') }}">Dashboard</a> |
    <a href="{{ url_for('schema_overview') }}">Schema</a> |
    <a href="{{ url_for('search') }}">Search</a> |
    <a href="{{ url_for('statistics') }}">Statistics</a>
</div>
{% endif %}
```

This implementation:
1. Uses Flask-Login for user session management
2. Creates a User class compatible with Flask-Login
3. Modifies the login and logout routes to use Flask-Login
4. Updates the template to use the current_user object

### 6.2 Using a Database for User Management

For production use, you'll likely want to store users in a database rather than in memory. Let's modify our implementation to use SQLAlchemy for this:

```python
# Add to the top of garden_explorer.py
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
```

```python
# Add after Flask app initialization
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
```

Now let's create a User model:

```python
# Add to garden_explorer.py
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    display_name = db.Column(db.String(80), nullable=False)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# User loader function for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
```

Now let's modify the login route to use the database:

```python
# Modify login in garden_explorer.py
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
            login_user(user, remember=True)
            
            log_activity('login_success')
            
            # Redirect to the original requested URL or the dashboard
            next_url = request.args.get('next') or url_for('index')
            return redirect(next_url)
        else:
            # Failed login
            error = "Invalid username or password"
            log_activity('login_failure', {'username': username})
    
    return render_template('login.html', error=error)
```

Finally, let's add a function to initialize the database with a demo user:

```python
# Add to garden_explorer.py
def init_db():
    """
    Initialize the database with a demo user.
    """
    db.create_all()
    
    # Check if the demo user already exists
    if not User.query.filter_by(username='demo').first():
        user = User(username='demo', display_name='Demo User')
        user.set_password('demo123')
        db.session.add(user)
        db.session.commit()
        print("Created demo user")
```

```python
# Add before app.run()
init_db()
```

This implementation:
1. Uses SQLAlchemy for database ORM
2. Creates a User model with secure password hashing
3. Modifies the login route to use the database
4. Includes a function to initialize the database with a demo user

### 6.3 Adding User Management Routes

For a complete authentication system, you'll want to add routes for user management:

```python
# Add to garden_explorer.py
@app.route('/users')
@login_required
def list_users():
    """
    List all users (admin only).
    """
    # Check if the current user is an admin
    if current_user.username != 'admin':
        flash("You don't have permission to view this page", "error")
        return redirect(url_for('index'))
    
    users = User.query.all()
    return render_template('users.html', users=users)

@app.route('/users/add', methods=['GET', 'POST'])
@login_required
def add_user():
    """
    Add a new user (admin only).
    """
    # Check if the current user is an admin
    if current_user.username != 'admin':
        flash("You don't have permission to view this page", "error")
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        display_name = request.form.get('display_name')
        
        # Check if the username is already taken
        if User.query.filter_by(username=username).first():
            flash("Username already taken", "error")
            return render_template('user_form.html')
        
        # Create the new user
        user = User(username=username, display_name=display_name)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        flash("User created successfully", "success")
        return redirect(url_for('list_users'))
    
    return render_template('user_form.html')

@app.route('/users/<int:user_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_user(user_id):
    """
    Edit a user (admin only, or the user themselves).
    """
    user = User.query.get_or_404(user_id)
    
    # Check permissions
    if current_user.username != 'admin' and current_user.id != user.id:
        flash("You don't have permission to edit this user", "error")
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        # Update the user
        user.display_name = request.form.get('display_name')
        
        # Only update the password if a new one is provided
        password = request.form.get('password')
        if password:
            user.set_password(password)
        
        db.session.commit()
        
        flash("User updated successfully", "success")
        if current_user.username == 'admin':
            return redirect(url_for('list_users'))
        else:
            return redirect(url_for('index'))
    
    return render_template('user_form.html', user=user)

@app.route('/users/<int:user_id>/delete', methods=['POST'])
@login_required
def delete_user(user_id):
    """
    Delete a user (admin only).
    """
    # Check if the current user is an admin
    if current_user.username != 'admin':
        flash("You don't have permission to delete users", "error")
        return redirect(url_for('index'))
    
    user = User.query.get_or_404(user_id)
    
    # Don't allow deleting the admin user
    if user.username == 'admin':
        flash("Cannot delete the admin user", "error")
        return redirect(url_for('list_users'))
    
    db.session.delete(user)
    db.session.commit()
    
    flash("User deleted successfully", "success")
    return redirect(url_for('list_users'))
```

And create templates for these routes:

```html
<!-- New file: templates/users.html -->
{% extends 'base.html' %}

{% block title %}Users - G.A.R.D.E.N. Explorer{% endblock %}

{% block content %}
<h2>Users</h2>

<div class="card">
    <a href="{{ url_for('add_user') }}" class="button">Add User</a>
</div>

<div class="card">
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Display Name</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {% for user in users %}
            <tr>
                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.display_name }}</td>
                <td>
                    <a href="{{ url_for('edit_user', user_id=user.id) }}">Edit</a>
                    {% if user.username != 'admin' %}
                    <form method="post" action="{{ url_for('delete_user', user_id=user.id) }}" style="display: inline;">
                        <button type="submit" onclick="return confirm('Are you sure you want to delete this user?')">Delete</button>
                    </form>
                    {% endif %}
                </td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
</div>

<div class="navigation">
    <a href="{{ url_for('index') }}">&larr; Back to Dashboard</a>
</div>
{% endblock %}
```

```html
<!-- New file: templates/user_form.html -->
{% extends 'base.html' %}

{% block title %}{{ 'Edit User' if user else 'Add User' }} - G.A.R.D.E.N. Explorer{% endblock %}

{% block content %}
<h2>{{ 'Edit User' if user else 'Add User' }}</h2>

<div class="card">
    <form method="post">
        <div style="margin-bottom: 15px;">
            <label for="username" style="display: block; margin-bottom: 5px;">Username:</label>
            <input type="text" id="username" name="username" style="width: 100%; padding: 8px;" {% if user %}value="{{ user.username }}" readonly{% else %}required{% endif %}>
        </div>
        
        <div style="margin-bottom: 15px;">
            <label for="display_name" style="display: block; margin-bottom: 5px;">Display Name:</label>
            <input type="text" id="display_name" name="display_name" style="width: 100%; padding: 8px;" {% if user %}value="{{ user.display_name }}"{% endif %} required>
        </div>
        
        <div style="margin-bottom: 15px;">
            <label for="password" style="display: block; margin-bottom: 5px;">Password{% if user %} (leave blank to keep current){% endif %}:</label>
            <input type="password" id="password" name="password" style="width: 100%; padding: 8px;" {% if not user %}required{% endif %}>
        </div>
        
        <button type="submit" style="padding: 8px 15px; background-color: #336633; color: white; border: none; cursor: pointer;">{{ 'Update User' if user else 'Add User' }}</button>
    </form>
</div>

<div class="navigation">
    <a href="{{ url_for('list_users') if current_user.username == 'admin' else url_for('index') }}">&larr; Back</a>
</div>
{% endblock %}
```

This implementation:
1. Provides routes for listing, adding, editing, and deleting users
2. Includes permission checks to restrict access to admins
3. Creates templates for the user management interface
4. Handles password updates securely

## 7. Summary

In this notebook, we've explored various ways to customize and extend G.A.R.D.E.N. Explorer for your specific needs:

1. **Customizing Appearance**: Modifying CSS and templates to change the look and feel
2. **Adding New Routes and Views**: Creating new functionality with custom routes and views
3. **Extending the Middleware Adapter**: Adding methods to support specialized database operations
4. **Creating Custom Helper Functions**: Adding utility functions for data processing and display
5. **Implementing Advanced Visualization**: Creating custom visualizations for graph data
6. **Enhancing Authentication**: Improving the authentication system for production use

G.A.R.D.E.N. Explorer is designed to be flexible and extensible, and these customizations allow you to tailor it to your specific needs and use cases. Whether you're adding new features, improving existing ones, or adapting it to a different database schema, the modular architecture makes it easy to extend.

In the next notebook, we'll explore production deployment considerations for G.A.R.D.E.N. Explorer.

## 8. Further Reading

- [Flask Documentation](https://flask.palletsprojects.com/) - The official Flask documentation
- [Jinja2 Templates](https://jinja.palletsprojects.com/en/3.0.x/templates/) - Documentation for Jinja2 templates
- [Flask-Login](https://flask-login.readthedocs.io/) - Documentation for Flask-Login
- [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/) - Documentation for Flask-SQLAlchemy
- [Neo4j Browser Guides](https://neo4j.com/developer/guide-create-neo4j-browser-guide/) - Creating custom Neo4j Browser guides
- [D3.js](https://d3js.org/) - A JavaScript library for advanced graph visualization

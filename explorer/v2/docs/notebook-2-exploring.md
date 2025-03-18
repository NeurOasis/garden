# Notebook 2: Exploring Your Graph Data

## Learning Objectives

By the end of this notebook, you will be able to:
1. Navigate your graph data using both Grassroots and Grasshopper patterns
2. Understand how to search for specific entities in your graph
3. Interpret node and relationship visualizations in the interface
4. Recognize patterns and structures in your graph data
5. Use G.A.R.D.E.N. Explorer to answer specific questions about your data

## 1. The G.A.R.D.E.N. Explorer Interface

Before diving into exploration patterns, let's familiarize ourselves with the G.A.R.D.E.N. Explorer interface. After logging in, you're presented with the dashboard, which serves as your entry point for exploration.

### 1.1 The Dashboard

The dashboard provides an overview of your graph data and entry points for exploration. Let's look at the code that generates this dashboard:

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

The dashboard is divided into several sections:

1. **About This Explorer**: An introduction to G.A.R.D.E.N. Explorer and its exploration patterns
2. **Grassroots Exploration**: Entry points for schema-based exploration
3. **Grasshopper Exploration**: Entry points for entity-based exploration
4. **Search**: A form for finding specific entities

The template for this dashboard is in `dashboard.html`:

```html
<!-- From dashboard.html -->
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
```

This template creates a two-column layout with Grassroots exploration on the left and Grasshopper exploration on the right, providing clear entry points for both patterns.

### 1.2 Navigation Elements

The navigation bar at the top of the page provides quick access to key sections of the application:

```html
<!-- From base.html -->
<div class="navigation">
    <a href="{{ url_for('index') }}">Dashboard</a> |
    <a href="{{ url_for('schema_overview') }}">Schema</a> |
    <a href="{{ url_for('search') }}">Search</a>
</div>
```

These links allow you to:
- Return to the dashboard at any time
- View the overall schema of your graph
- Search for specific entities

Additionally, most pages include contextual navigation. For example, when viewing a specific node, you'll see links to return to the list of nodes or the dashboard:

```html
<!-- From node_detail.html -->
<div class="navigation">
    <a href="{{ url_for('list_nodes', label=label) }}">&larr; Back to {{ label }} Nodes</a> |
    <a href="{{ url_for('index') }}">&larr; Back to Dashboard</a>
</div>
```

These contextual links help you maintain your orientation as you explore the graph.

## 2. Grassroots Exploration: Schema-First Navigation

The Grassroots pattern starts with the database schema and drills down to specific instances. This approach is especially useful when you're new to a dataset and want to understand its structure.

### 2.1 Schema Overview

The schema overview page provides a high-level view of your graph structure, showing all node labels and relationship types. Let's examine the code that generates this view:

```python
# From garden_explorer.py
@app.route('/schema')
@login_required
def schema_overview():
    """
    Provide an overview of the database schema (Grassroots entry point).
    Shows all node labels and relationship types.
    """
    log_activity('view_schema')
    
    node_labels = middleware.get_node_labels()
    relationship_types = middleware.get_relationship_types()
    
    # Count instances of each label
    label_counts = {}
    for label in node_labels:
        try:
            nodes = middleware.get_nodes_by_label(label)
            label_counts[label] = len(nodes)
        except Exception:
            label_counts[label] = "Error"
    
    return render_template(
        'schema.html',
        node_labels=node_labels,
        relationship_types=relationship_types,
        label_counts=label_counts
    )
```

This function:
1. Retrieves all node labels from the database
2. Retrieves all relationship types
3. Counts the number of instances for each node label
4. Renders the schema template with this information

The template for this view is in `schema.html`:

```html
<!-- From schema.html -->
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
```

This template presents two key pieces of information:
1. A table of node labels with their counts and links to view all instances
2. A list of relationship types

The schema overview provides a roadmap of your graph, showing what types of entities and relationships exist.

### 2.2 Exploring Node Labels

From the schema overview, you can click on a node label to see all instances of that type. Let's examine the code that handles this:

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
1. Retrieves all nodes with the specified label
2. Determines which properties to display (first 5 properties of the first node)
3. Renders the node list template with this information

The template for this view is in `nodes_list.html`:

```html
<!-- From nodes_list.html -->
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
```

This template presents a table of all nodes with the specified label, showing:
1. A human-readable name for each node
2. Selected properties for each node
3. A link to view the full details of each node

This view allows you to browse all instances of a particular entity type, providing a structured way to explore your data.

## 3. Grasshopper Exploration: Entity-First Navigation

The Grasshopper pattern starts with specific entities and "hops" between connected entities. This approach is especially useful when you're interested in the relationships between entities.

### 3.1 Viewing a Specific Node

The node detail view is the heart of the Grasshopper pattern. It shows all the information about a specific entity and its relationships. Let's examine the code that generates this view:

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

This function:
1. Retrieves the specific node by its ID
2. Finds all incoming and outgoing relationships for the node
3. Renders the node detail template with this information

The template for this view is in `node_detail.html`:

```html
<!-- From node_detail.html -->
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
```

This template presents three key pieces of information:
1. All properties of the node in a table
2. Outgoing relationships, showing the relationship type and target node
3. Incoming relationships, showing the source node and relationship type

Each relationship includes a "View" link that allows you to "hop" to the connected node, continuing your exploration.

### 3.2 Relationship Display

Relationships in a graph database often have their own properties. G.A.R.D.E.N. Explorer includes a helper function to create a human-readable display for relationships:

```python
# From garden_explorer.py
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

This function creates a display string that includes:
- The relationship type (e.g., "ACTED_IN")
- Key properties if they exist (e.g., "role: Neo")

This helps users understand not just that entities are connected, but how they are connected.

## 4. Searching Your Graph

In addition to structured exploration, G.A.R.D.E.N. Explorer includes a search feature to help you find specific entities. Let's examine the code that handles search:

```python
# From garden_explorer.py
@app.route('/search', methods=['GET'])
@login_required
def search():
    """
    Simple search functionality to find nodes by property values.
    """
    query = request.args.get('query', '').strip()
    
    if not query:
        return render_template('search.html', results=None, query=None)
    
    log_activity('search', {'query': query})
    
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
            get_node_display_name=get_node_display_name
        )
    
    except Exception as e:
        flash(f"Error performing search: {str(e)}", "error")
        return render_template('search.html', results=None, query=query)
```

This function:
1. Gets the search query from the request parameters
2. Searches for the query string in all string properties of all nodes
3. Organizes the results by node label
4. Renders the search template with the results

The template for this view is in `search.html`:

```html
<!-- From search.html -->
<h2>Search</h2>

<form action="{{ url_for('search') }}" method="get" class="search-box">
    <input type="text" name="query" placeholder="Enter search term" value="{{ query or '' }}">
    <button type="submit">Search</button>
</form>

{% if query %}
<h3>Search Results for "{{ query }}"</h3>

{% if not results or results|length == 0 %}
<p>No results found.</p>
{% else %}
{% for label, nodes in results.items() %}
<div class="card">
    <h4>{{ label }} ({{ nodes|length }})</h4>
    <ul>
        {% for node in nodes %}
        <li>
            <a href="{{ url_for('view_node', label=label, node_id=node.uuid) }}">
                {{ get_node_display_name(node) }}
            </a>
        </li>
        {% endfor %}
    </ul>
</div>
{% endfor %}
{% endif %}
{% endif %}
```

This template presents:
1. A search form at the top
2. Search results organized by node label
3. Links to view the details of each matching node

The search feature provides a quick way to find specific entities when you know what you're looking for.

## 5. Understanding Formatting and Display Helpers

G.A.R.D.E.N. Explorer includes several helper functions to format and display data in a user-friendly way. Let's examine some of these helpers:

### 5.1 Displaying Node Names

Nodes in a graph database may have different properties that represent their "name" or primary identifier. G.A.R.D.E.N. Explorer includes a helper function to find the most appropriate property to display:

```python
# From garden_explorer.py
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

This function tries several common name properties in order of preference:
1. `title` (common for movies, articles, etc.)
2. `name` (common for people, organizations, etc.)
3. `fullName` (common for people)
4. `displayName` (a generic display name)

If none of these properties exist, it falls back to a truncated UUID.

### 5.2 Formatting Property Values

Property values in a graph database can be of various types and lengths. G.A.R.D.E.N. Explorer includes a helper function to format these values for display:

```python
# From garden_explorer.py
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

This function handles different types of values:
- Lists: Shows the first few items or a summary if the list is long
- Dictionaries: Shows a summary of the object's properties
- Strings: Truncates long strings to a manageable length
- Other types: Converts to a string representation

These formatting helpers ensure that the data is presented in a user-friendly way, even when it's complex or verbose.

## 6. Exploring Common Graph Patterns

As you explore your graph data, you'll likely encounter common patterns that represent important relationships in your domain. Let's examine how G.A.R.D.E.N. Explorer helps you identify and understand these patterns.

### 6.1 One-to-Many Relationships

One-to-many relationships are common in graph databases, such as a director who has directed multiple movies. When viewing a node with many outgoing relationships of the same type, G.A.R.D.E.N. Explorer groups them together:

```html
<!-- From node_detail.html -->
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
```

This view makes it easy to see all the entities connected to the current node, helping you identify one-to-many relationships.

### 6.2 Many-to-Many Relationships

Many-to-many relationships, such as actors appearing in multiple movies and movies having multiple actors, are visible when you see the same relationship type with different targets. The bidirectional navigation allows you to explore both sides of these relationships:

```html
<!-- From node_detail.html (partial) -->
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
```

By showing both incoming and outgoing relationships, G.A.R.D.E.N. Explorer helps you understand the full context of an entity in the graph.

### 6.3 Hierarchical Relationships

Hierarchical relationships, such as categories and subcategories, are visible when you see self-referential relationships (relationships between nodes of the same type). G.A.R.D.E.N. Explorer's navigation makes it easy to traverse these hierarchies:

1. Start at a parent node
2. Click on a relationship to a child node of the same type
3. Repeat to navigate down the hierarchy
4. Use the "Back" links to navigate up the hierarchy

This exploration pattern allows you to understand and navigate hierarchical structures in your data.

## 7. Sample Exploration Scenarios

Let's walk through some specific exploration scenarios to demonstrate how G.A.R.D.E.N. Explorer can help you answer questions about your data.

### 7.1 Finding All Movies by a Director

To find all movies directed by a specific director:

1. Use the search feature to find the director by name
2. Click on the director in the search results
3. In the director's detail view, look for outgoing relationships of type "DIRECTED"
4. Each relationship will point to a movie directed by this person
5. Click on a movie to view its details

This exploration path shows how you can use the Grasshopper pattern to navigate from a person to their related movies.

### 7.2 Discovering Common Actors Between Movies

To find actors who have appeared in multiple specific movies:

1. Use the search feature to find the first movie
2. In the movie's detail view, look for incoming relationships of type "ACTED_IN"
3. Make note of the actors who appeared in this movie
4. Use the search feature to find the second movie
5. Compare the actors in the second movie with your list from the first movie
6. Actors who appear in both lists have appeared in both movies

This scenario demonstrates how you can use G.A.R.D.E.N. Explorer to compare entities and find common relationships.

### 7.3 Exploring a Movie's Production Network

To explore the full production network of a movie:

1. Find the movie using search or Grassroots navigation
2. In the movie's detail view, look at all incoming relationships
3. These relationships will show actors, directors, producers, etc.
4. Click on each person to view their details
5. For each person, look at their outgoing relationships to find other movies they've worked on
6. Continue this exploration to map out the broader production network

This scenario shows how you can use G.A.R.D.E.N. Explorer for more complex exploration tasks, discovering indirect relationships and broader patterns in your data.

## 8. Summary

In this notebook, we've explored how to use G.A.R.D.E.N. Explorer to navigate and understand your graph data. We've covered:

1. The G.A.R.D.E.N. Explorer interface and its key components
2. Grassroots exploration: starting with the schema and drilling down to instances
3. Grasshopper exploration: starting with specific entities and navigating connections
4. Searching for specific entities in your graph
5. Helper functions for formatting and displaying data
6. Common graph patterns and how to identify them
7. Sample exploration scenarios for answering specific questions

G.A.R.D.E.N. Explorer provides a flexible, intuitive interface for exploring graph data, whether you're new to the dataset or looking for specific information. By combining both Grassroots and Grasshopper patterns, you can develop a comprehensive understanding of your data's structure and connections.

## 9. Further Reading

- [Neo4j Cypher Query Language](https://neo4j.com/docs/cypher-manual/current/) - If you want to learn the underlying query language
- [Graph Data Modeling](https://neo4j.com/developer/data-modeling/) - Understanding common patterns in graph databases
- [Graph Algorithms](https://neo4j.com/docs/graph-data-science/current/algorithms/) - For more advanced graph analysis
- [Data Visualization Techniques](https://neo4j.com/developer/graph-visualization/) - For exploring alternative ways to visualize graph data

# G.A.R.D.E.N. Explorer: Getting Started

Welcome to the G.A.R.D.E.N. Explorer project! This guide will help you set up your development environment and complete your first development task.

## What is G.A.R.D.E.N. Explorer?

G.A.R.D.E.N. Explorer (**G**raph **A**ccess and **R**etrieval with **D**eveloper-friendly **E**xploration **N**avigation) is a web application that makes it easy to explore Neo4j graph databases. It offers two complementary exploration patterns:

- **Grassroots**: Start with the schema and drill down to specific instances
- **Grasshopper**: Start with specific entities and "hop" between connected entities

## Project Structure

Here's an overview of the key files and directories:

- `garden_explorer.py` - The main Flask application
- `helpers.py` - Utility functions
- `middleware_adapter.py` - Adapter for interacting with Neo4j
- `newgraph.py` - Generated middleware (or mock middleware) for Neo4j
- `templates/` - HTML templates for the user interface
- `docs/` - Documentation in markdown format (the notebooks)

## Prerequisites

Before you start, you'll need:

- Python 3.6 or newer
- pip (Python package installer)
- A text editor or IDE
- Git (for version control)
- Neo4j database (optional - we can use mock data without it)

## Setting Up Your Environment

### Step 1: Create a Virtual Environment

First, let's create a virtual environment to keep our dependencies isolated:

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### Step 2: Install Dependencies

Now, let's install the required packages:

```bash
pip install flask neo4j markdown
```

## Running the Application (No Neo4j Required)

You can run G.A.R.D.E.N. Explorer without a Neo4j database using the mock middleware:

```bash
python garden_explorer.py
```

Once the application starts, you should see output like:

```
Starting G.A.R.D.E.N. Explorer...
Open your browser and go to: http://localhost:5000
```

Open your web browser and navigate to http://localhost:5000/login.

Use these credentials to log in:
- Username: `demo`
- Password: `demo123`

You should now be able to explore the mock movie graph data!

## Running with a Real Neo4j Database (Optional)

If you have a Neo4j database:

1. Generate the middleware for your database:
   ```bash
   python modulegenerator-claude.py -u "bolt://localhost:7687" -n "neo4j" -p "your_password" -g "newgraph"
   ```

2. Make sure `newgraph.py` is in the same directory as `garden_explorer.py`

3. Run the application:
   ```bash
   python garden_explorer.py
   ```

## Your First Development Task: Adding Documentation Endpoint

Now for your first task! Let's add an endpoint to serve the markdown notebooks as live documentation within the application.

### Step 1: Add a New Route to garden_explorer.py

Open `garden_explorer.py` in your editor and add these imports at the top (with the other imports):

```python
import markdown
import os
```

Now, add a new route for documentation:

```python
@app.route('/docs')
@login_required
def documentation_index():
    """
    Show a list of documentation notebooks.
    """
    log_activity('view_documentation_index')
    
    # Get a list of documentation notebooks from the docs directory
    docs_dir = os.path.join(os.path.dirname(__file__), 'docs')
    notebooks = []
    
    if os.path.exists(docs_dir):
        for filename in sorted(os.listdir(docs_dir)):
            if filename.endswith('.md'):
                notebook_id = filename.replace('.md', '')
                title = notebook_id.replace('-', ' ').title()
                notebooks.append({
                    'id': notebook_id,
                    'title': title,
                    'filename': filename
                })
    
    return render_template(
        'docs_index.html',
        notebooks=notebooks
    )

@app.route('/docs/<notebook_id>')
@login_required
def documentation_notebook(notebook_id):
    """
    Show a specific documentation notebook.
    """
    log_activity('view_documentation_notebook', {'notebook_id': notebook_id})
    
    # Load and convert the markdown file to HTML
    docs_dir = os.path.join(os.path.dirname(__file__), 'docs')
    filename = f"{notebook_id}.md"
    filepath = os.path.join(docs_dir, filename)
    
    if not os.path.exists(filepath):
        flash(f"Documentation not found: {notebook_id}", "error")
        return redirect(url_for('documentation_index'))
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Convert markdown to HTML
    html_content = markdown.markdown(
        content,
        extensions=['extra', 'codehilite']
    )
    
    # Get the title from the first heading
    title = notebook_id.replace('-', ' ').title()
    if content.startswith('# '):
        title = content.split('\n', 1)[0].lstrip('# ')
    
    return render_template(
        'docs_notebook.html',
        title=title,
        html_content=html_content,
        notebook_id=notebook_id
    )
```

### Step 2: Create the Templates

Now, let's create two new templates in the `templates` directory.

First, create `docs_index.html`:

```html
{% extends 'base.html' %}

{% block title %}Documentation - G.A.R.D.E.N. Explorer{% endblock %}

{% block content %}
<h2>Documentation</h2>

<p>
    Welcome to the G.A.R.D.E.N. Explorer documentation. Please select a notebook below:
</p>

<div class="card">
    <h3>Notebooks</h3>
    {% if notebooks %}
    <ul>
        {% for notebook in notebooks %}
        <li>
            <a href="{{ url_for('documentation_notebook', notebook_id=notebook.id) }}">
                {{ notebook.title }}
            </a>
        </li>
        {% endfor %}
    </ul>
    {% else %}
    <p>No documentation notebooks found.</p>
    {% endif %}
</div>

<div class="navigation">
    <a href="{{ url_for('index') }}">&larr; Back to Dashboard</a>
</div>
{% endblock %}
```

Next, create `docs_notebook.html`:

```html
{% extends 'base.html' %}

{% block title %}{{ title }} - Documentation - G.A.R.D.E.N. Explorer{% endblock %}

{% block content %}
<h2>{{ title }}</h2>

<div class="navigation">
    <a href="{{ url_for('documentation_index') }}">&larr; Back to Documentation Index</a> |
    <a href="{{ url_for('index') }}">&larr; Back to Dashboard</a>
</div>

<div class="card documentation-content">
    {{ html_content|safe }}
</div>

<div class="navigation">
    <a href="{{ url_for('documentation_index') }}">&larr; Back to Documentation Index</a> |
    <a href="{{ url_for('index') }}">&larr; Back to Dashboard</a>
</div>
{% endblock %}
```

### Step 3: Add a Link to the Navigation

Add a link to the documentation in the navigation bar. Find this section in `base.html`:

```html
{% if session.username %}
<div class="navigation">
    <a href="{{ url_for('index') }}">Dashboard</a> |
    <a href="{{ url_for('schema_overview') }}">Schema</a> |
    <a href="{{ url_for('search') }}">Search</a>
</div>
{% endif %}
```

And add a link to the documentation:

```html
{% if session.username %}
<div class="navigation">
    <a href="{{ url_for('index') }}">Dashboard</a> |
    <a href="{{ url_for('schema_overview') }}">Schema</a> |
    <a href="{{ url_for('search') }}">Search</a> |
    <a href="{{ url_for('documentation_index') }}">Documentation</a>
</div>
{% endif %}
```

### Step 4: Add Some CSS for Documentation

Add these styles to the `<style>` section in `base.html` to make the documentation look nicer:

```css
.documentation-content {
    line-height: 1.6;
}
.documentation-content h1,
.documentation-content h2,
.documentation-content h3,
.documentation-content h4 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
}
.documentation-content p {
    margin-bottom: 1em;
}
.documentation-content code {
    background-color: #f5f5f5;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: monospace;
}
.documentation-content pre {
    background-color: #f5f5f5;
    padding: 1em;
    border-radius: 5px;
    overflow-x: auto;
    margin: 1em 0;
}
```

## Test Your Changes

1. Restart the Flask application:
   ```bash
   python garden_explorer.py
   ```

2. Log in with the demo credentials:
   - Username: `demo`
   - Password: `demo123`

3. Click on the "Documentation" link in the navigation bar.

4. You should see a list of the markdown notebooks. Click on one to view it as HTML.

## Troubleshooting

If you encounter errors:

- Check that the `docs` directory exists and contains the markdown files
- Make sure you've installed the `markdown` package (`pip install markdown`)
- Verify that your template files are in the correct location
- Check the console for error messages

## Next Steps

Now that you've successfully added the documentation endpoint, here are some ideas for further improvements:

1. Add navigation between notebooks (previous/next links)
2. Add a table of contents for each notebook
3. Improve the styling of the documentation
4. Add search functionality for the documentation

Congratulations on completing your first development task with G.A.R.D.E.N. Explorer! Keep exploring and happy coding!

# Notebook 1: Setting Up Your Environment

## Learning Objectives

By the end of this notebook, you will be able to:
1. Set up the necessary prerequisites for running G.A.R.D.E.N. Explorer
2. Connect to a Neo4j database instance
3. Generate middleware using the Module Generator
4. Configure and run the G.A.R.D.E.N. Explorer application
5. Troubleshoot common setup issues

## 1. Prerequisites

Before you can run G.A.R.D.E.N. Explorer, you need to set up your development environment. This section walks you through the necessary prerequisites.

### 1.1 Python Environment

G.A.R.D.E.N. Explorer requires Python 3.6 or newer. Let's check your Python version using the command line:

```bash
python --version
```

If your version is Python 3.6 or newer, you're good to go. If not, you'll need to install a newer version of Python.

Next, it's a good practice to create a virtual environment for your project. This keeps your dependencies isolated and prevents conflicts with other projects.

```bash
# Create a virtual environment named 'garden_env'
python -m venv garden_env

# Activate the virtual environment
# On Windows:
garden_env\Scripts\activate
# On macOS/Linux:
source garden_env/bin/activate
```

When activated, your command prompt will be prefixed with `(garden_env)`, indicating that you're working within the virtual environment.

### 1.2 Installing Required Packages

G.A.R.D.E.N. Explorer depends on several Python packages. Let's install them:

```bash
pip install flask neo4j
```

This installs:
- Flask: A lightweight web framework
- Neo4j: The official Python driver for Neo4j

Let's verify the installed packages:

```bash
pip list
```

You should see both Flask and Neo4j listed in the output.

### 1.3 Neo4j Database

G.A.R.D.E.N. Explorer requires a running Neo4j database instance. You can:
- Use a local Neo4j instance
- Connect to a remote Neo4j instance
- Use Neo4j Desktop (a convenient GUI application)

For a local installation, download Neo4j from the [official website](https://neo4j.com/download/) and follow the installation instructions for your operating system.

Once installed, start the Neo4j server:
- Neo4j Desktop: Click on the database and then "Start"
- Command line: `neo4j start`

By default, Neo4j runs on:
- HTTP port: 7474 (web interface)
- Bolt port: 7687 (driver connection)

Make sure you can access the Neo4j Browser at `http://localhost:7474/browser/` to verify your installation is working.

### 1.4 Setting Up Sample Data (Optional)

If you don't have your own data, Neo4j comes with several sample datasets that you can use to explore G.A.R.D.E.N. Explorer's functionality.

In the Neo4j Browser, you can run this command to install the Movies sample dataset:

```cypher
:play movies
```

Then follow the browser guide to create the sample movie graph.

## 2. Setting Up G.A.R.D.E.N. Explorer

Now that you have the prerequisites installed, let's set up G.A.R.D.E.N. Explorer.

### 2.1 Getting the Code

Download or clone the G.A.R.D.E.N. Explorer repository to your local machine.

Create a project directory structure as follows:

```
garden_explorer/
├── garden_explorer.py
├── middleware_adapter.py
├── helpers.py
└── templates/
    ├── base.html
    ├── dashboard.html
    ├── login.html
    └── ... (other template files)
```

### 2.2 Understanding the Configuration

Let's take a look at the configuration section in `garden_explorer.py`:

```python
# Configuration
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev_key_for_testing')
app.config['PERMANENT_SESSION_LIFETIME'] = 3600  # 1 hour

# Simple user database - in a real application, this would come from a secure database
# Format: { username: { 'password': 'password_value', 'display_name': 'Display Name' } }
USERS = {
    'demo': {
        'password': 'demo123',
        'display_name': 'Demo User'
    }
}
```

This code configures:
- A Flask application instance
- A secret key for session encryption (using an environment variable or falling back to a default)
- Session lifetime (1 hour)
- A simple in-memory user database with a demo account

For a production environment, you would want to:
1. Set a secure `SECRET_KEY` environment variable
2. Use a proper database for user authentication
3. Implement more sophisticated session management

For now, the default configuration is sufficient for exploration and learning.

## 3. Generating Your Middleware

The Module Generator is a key component of the G.A.R.D.E.N. system. It analyzes your Neo4j database schema and generates a Python module (middleware) tailored to your specific data model.

### 3.1 Understanding the Module Generator

Let's examine the main function of the Module Generator:

```python
# From modulegenerator-claude.py
def generate_module(uri=None, username=None, password=None, graph=None, output_directory=os.environ['PWD']):
    """
    Assembler function collects strings containing valid Python code
    into a list, then writes the list to a new python module (a file
    ending in .py) in a single write operation.

    Parameters
    ----------
    uri: str
        A connection string for the neo4j instance.
    username: str
        The user name for the neo4j account. This account needs read access.
    password: str
        The password for the neo4j account.
    graph: str
        The name of the graph for the generated module, e.g. name="demo" 
        results in demograph.py.
    output_directory: str
        The directory to write the generated module to.

    Returns
    -------
    str:
        The filepath to the generated module.
    """
```

This function:
1. Connects to your Neo4j database
2. Analyzes the schema (labels, relationships, properties)
3. Generates a Python module with custom interfaces for your data
4. Writes the module to a file in the specified directory

### 3.2 Running the Module Generator

To generate middleware for your Neo4j database, run the Module Generator with the appropriate parameters:

```bash
python modulegenerator-claude.py -u "bolt://localhost:7687" -n "neo4j" -p "your_password" -g "newgraph"
```

Let's break down these parameters:
- `-u` or `--uri`: The URI of your Neo4j database (`bolt://localhost:7687` is the default)
- `-n` or `--name`: The username for Neo4j authentication (default is `neo4j`)
- `-p` or `--password`: The password for Neo4j authentication
- `-g` or `--graph`: The name for the generated module (without the `.py` extension)
- `-o` or `--output`: (Optional) The directory where the module should be saved

When run successfully, you should see output similar to:

```
Generating: newgraph.py
At: bolt://localhost:7687
For database: neo4j
Username: neo4j
Password: ******
Generated module will be written to: current directory
```

The Module Generator will create a file named `newgraph.py` (or whatever name you specified with the `-g` flag) in the current directory.

### 3.3 Examining the Generated Middleware

Let's take a look at what's in the generated middleware:

```python
# Excerpt from a generated middleware module
class Nodes:
    """
    Interface for working with nodes in the Neo4j graph.
    Each method corresponds to a node label in the graph.
    """
    
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
        # ... (type checking code) ...
        
        # Construct and execute the query
        query, params = Queries.node(label="Movie", **search_props)
        results = _query(query, params)
        return [_neo4j_node_to_dict(result['n']) for result in results]
```

The generated middleware includes:
- A `Nodes` class with methods for each node label in your database
- An `Edges` class with methods for each relationship type
- Type checking for properties based on your database schema
- Functions for executing queries and processing results
- Metadata about your database structure

### 3.4 Customization Options

The Module Generator has several customization options that you can explore:

```bash
python modulegenerator-claude.py --help
```

This will show all available options, including:
- `-d` or `--database`: The specific Neo4j database to query (for multi-database setups)
- `-o` or `--output`: Directory to write the generated module to

For most use cases, the default options with your specific connection details will be sufficient.

## 4. Running G.A.R.D.E.N. Explorer

Now that you have generated your middleware, let's run G.A.R.D.E.N. Explorer.

### 4.1 Configuring G.A.R.D.E.N. Explorer

First, ensure that the generated middleware file (`newgraph.py` or whatever you named it) is in the same directory as `garden_explorer.py`.

The import statement in `garden_explorer.py` should match your middleware name:

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

If you named your middleware something other than `newgraph.py`, update the import statement accordingly.

### 4.2 Starting the Application

Now you can start the G.A.R.D.E.N. Explorer application:

```bash
python garden_explorer.py
```

You should see output similar to:

```
Starting G.A.R.D.E.N. Explorer...
Open your browser and go to: http://localhost:5000
```

This indicates that the Flask development server is running and G.A.R.D.E.N. Explorer is available at `http://localhost:5000`.

### 4.3 Accessing the Web Interface

Open your web browser and navigate to:

```
http://localhost:5000/login
```

You should see a login page. Use the default credentials:
- Username: `demo`
- Password: `demo123`

After logging in, you'll be redirected to the dashboard, where you can start exploring your graph data.

### 4.4 The G.A.R.D.E.N. Explorer Dashboard

The dashboard is the main entry point for exploring your data. Let's look at the code that generates it:

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

The dashboard provides:
- An introduction to G.A.R.D.E.N. Explorer
- Entry points for the Grassroots approach (schema-first navigation)
- Entry points for the Grasshopper approach (entity-first navigation)
- A search form for finding specific entities

## 5. Troubleshooting Common Setup Issues

Let's address some common issues you might encounter when setting up G.A.R.D.E.N. Explorer.

### 5.1 Neo4j Connection Issues

If the Module Generator or G.A.R.D.E.N. Explorer can't connect to your Neo4j database, check:

1. **Is Neo4j running?** Make sure your Neo4j server is running and accessible.
   
2. **Are the connection details correct?** Verify the URI, username, and password.
   
3. **Firewall issues?** Make sure your firewall allows connections to the Neo4j ports (7474 for HTTP, 7687 for Bolt).

4. **Authentication enabled?** Some Neo4j installations require authentication. If you're unsure about your credentials, check the Neo4j Browser settings.

### 5.2 Middleware Import Errors

If G.A.R.D.E.N. Explorer can't import your middleware, check:

1. **Is the middleware file in the correct location?** It should be in the same directory as `garden_explorer.py`.

2. **Does the import statement match your middleware name?** If you named your middleware something other than `newgraph.py`, update the import statement.

3. **Did the Module Generator run successfully?** Check for any error messages during middleware generation.

4. **Python path issues?** Make sure your Python environment can find the middleware file.

The error handling in G.A.R.D.E.N. Explorer includes a fallback to a mock middleware if the real middleware can't be imported:

```python
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

This allows the application to run with sample data even if your middleware isn't available.

### 5.3 Flask Application Issues

If the Flask application fails to start, check:

1. **Are all dependencies installed?** Make sure Flask is installed in your environment.

2. **Port conflicts?** If port 5000 is already in use, Flask will fail to start. You can change the port:

```python
# At the bottom of garden_explorer.py
if __name__ == '__main__':
    print(f"Starting G.A.R.D.E.N. Explorer...")
    print(f"Open your browser and go to: http://localhost:8080")  # Changed port
    app.run(debug=True, port=8080)  # Changed port
```

3. **Environment issues?** Make sure your virtual environment is activated if you're using one.

### 5.4 Authentication Issues

If you can't log in to G.A.R.D.E.N. Explorer, check:

1. **Are you using the correct credentials?** The default is username `demo` and password `demo123`.

2. **Are you accessing the login page directly?** Try navigating to `http://localhost:5000/login` explicitly.

3. **Session issues?** Clear your browser cookies and try again.

The authentication logic is relatively simple:

```python
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

### 5.5 Data Display Issues

If your data isn't displaying correctly, check:

1. **Does your database have the expected structure?** The middleware is generated based on your database schema. If the schema changes, you'll need to regenerate the middleware.

2. **Are you using the correct node labels and relationship types?** The dashboard is configured for a movie graph by default. You may need to update it for your specific data.

3. **Do your nodes have the expected properties?** G.A.R.D.E.N. Explorer looks for properties like `name`, `title`, etc. to display. If your nodes use different properties, you may need to update the `get_node_display_name` function.

## 6. Next Steps

Now that you have G.A.R.D.E.N. Explorer up and running, it's time to start exploring your data! In the next notebook, we'll dive deeper into the different ways you can navigate and explore your graph data using G.A.R.D.E.N. Explorer.

## 7. Summary

In this notebook, we've walked through the process of setting up your environment for G.A.R.D.E.N. Explorer. We've covered:

1. Installing the necessary prerequisites (Python, Flask, Neo4j)
2. Setting up a Neo4j database (with optional sample data)
3. Generating middleware using the Module Generator
4. Configuring and running G.A.R.D.E.N. Explorer
5. Troubleshooting common setup issues

With your environment set up, you're now ready to start exploring your graph data using G.A.R.D.E.N. Explorer's intuitive web interface.

## 8. Further Reading

- [Neo4j Installation Guide](https://neo4j.com/docs/operations-manual/current/installation/)
- [Flask Deployment Options](https://flask.palletsprojects.com/en/2.0.x/deploying/)
- [Neo4j Bolt Driver Documentation](https://neo4j.com/docs/api/python-driver/current/api.html)
- [Python Virtual Environments](https://docs.python.org/3/tutorial/venv.html)

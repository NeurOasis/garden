document.addEventListener('DOMContentLoaded', function() {
    // Select the visualization form
    const visualizationForm = document.getElementById('visualizationForm');
    
    // Add event listener for form submission
    visualizationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        renderVisualization();
    });
});

function renderVisualization() {
    // Get selected node labels
    const selectedLabels = [];
    const checkboxes = document.querySelectorAll('input[name="node_label"]:checked');
    checkboxes.forEach(checkbox => {
        selectedLabels.push(checkbox.value);
    });
    
    // Show loading indicator
    const visualizationContainer = document.getElementById('visualization-container');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const graphVisualization = document.getElementById('graph-visualization');
    
    loadingIndicator.style.display = 'block';
    errorMessage.style.display = 'none';
    graphVisualization.innerHTML = '';
    
    // Build URL with selected labels
    let url = '/api/graph_data?limit=50';
    selectedLabels.forEach(label => {
        url += `&node_label=${encodeURIComponent(label)}`;
    });
    
    // Fetch graph data
    fetch(url)
        .then(response => response.json())
        .then(result => {
            loadingIndicator.style.display = 'none';
            
            if (result.success) {
                createForceGraph(result.data);
            } else {
                errorMessage.textContent = result.message;
                errorMessage.style.display = 'block';
            }
        })
        .catch(error => {
            loadingIndicator.style.display = 'none';
            errorMessage.textContent = 'Error fetching graph data: ' + error.message;
            errorMessage.style.display = 'block';
        });
}

function createForceGraph(data) {
    // Get container dimensions
    const container = document.getElementById('graph-visualization');
    const width = container.clientWidth || 800;
    const height = 600;
    
    // Clear previous visualization
    container.innerHTML = '';
    
    // Check if we have data
    if (!data.nodes.length) {
        container.innerHTML = '<p>No data available for the selected criteria.</p>';
        return;
    }
    
    // Create SVG container
    const svg = d3.select('#graph-visualization')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height]);
    
    // Add zoom functionality
    const g = svg.append('g');
    
    svg.call(d3.zoom()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        }));
    
    // Create color scale for node types
    const nodeTypes = [...new Set(data.nodes.map(node => node.labels[0]))];
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(nodeTypes);
    
    // Create force simulation
    const simulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide().radius(30));
    
    // Create links
    const link = g.append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(data.links)
        .join('line');
    
    // Create nodes
    const node = g.append('g')
        .selectAll('.node')
        .data(data.nodes)
        .join('g')
        .attr('class', 'node')
        .call(drag(simulation));
    
    // Add circles to nodes
    node.append('circle')
        .attr('r', d => getNodeSize(d))
        .attr('fill', d => colorScale(d.labels[0]))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .append('title')
        .text(d => getNodeTooltip(d));
    
    // Add text labels
    node.append('text')
        .attr('dx', 12)
        .attr('dy', '.35em')
        .text(d => getNodeLabel(d))
        .attr('fill', '#333')
        .style('font-size', '10px')
        .style('pointer-events', 'none');
    
    // Update positions on tick
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        node
            .attr('transform', d => `translate(${d.x},${d.y})`);
    });
    
    // Add legend
    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(20, 20)');
    
    nodeTypes.forEach((type, i) => {
        const legendRow = legend.append('g')
            .attr('transform', `translate(0, ${i * 20})`);
        
        legendRow.append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', colorScale(type));
        
        legendRow.append('text')
            .attr('x', 15)
            .attr('y', 10)
            .text(type)
            .style('font-size', '12px');
    });
    
    // Helper function for drag behavior
    function drag(simulation) {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        
        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        
        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }
    
    // Helper function to determine node size
    function getNodeSize(d) {
        if (d.labels.includes('Movie')) return 15;
        if (d.labels.includes('Person')) return 10;
        return 8;
    }
    
    // Helper function to create node label
    function getNodeLabel(d) {
        if (d.labels.includes('Movie')) return d.properties.title || 'Movie';
        if (d.labels.includes('Person')) return d.properties.name || 'Person';
        
        // Try to find a good property to use as label
        const props = d.properties;
        for (const key of ['name', 'title', 'id', 'label']) {
            if (props[key]) return props[key];
        }
        
        return d.labels[0] || 'Node';
    }
    
    // Helper function to create tooltip
    function getNodeTooltip(d) {
        let tooltip = `Type: ${d.labels.join(', ')}\n`;
        
        if (d.labels.includes('Movie')) {
            tooltip += `Title: ${d.properties.title || 'Unknown'}\n`;
            if (d.properties.released) tooltip += `Released: ${d.properties.released}\n`;
            if (d.properties.tagline) tooltip += `Tagline: ${d.properties.tagline}\n`;
        } else if (d.labels.includes('Person')) {
            tooltip += `Name: ${d.properties.name || 'Unknown'}\n`;
            if (d.properties.born) tooltip += `Born: ${d.properties.born}\n`;
        } else {
            // For other node types, show all properties
            for (const [key, value] of Object.entries(d.properties)) {
                tooltip += `${key}: ${value}\n`;
            }
        }
        
        return tooltip;
    }
}

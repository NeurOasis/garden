document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to all visualize buttons
    const visualizeButtons = document.querySelectorAll('.visualize-button');
    
    visualizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const patternType = this.getAttribute('data-pattern');
            const instanceId = this.getAttribute('data-id');
            
            visualizePattern(patternType, instanceId);
            
            // Highlight the selected instance
            document.querySelectorAll('.instance-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            this.closest('.instance-card').classList.add('selected');
        });
    });
});

function visualizePattern(patternType, instanceId) {
    // Show loading indicator
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const graphVisualization = document.getElementById('graph-visualization');
    const patternLegend = document.getElementById('pattern-legend');
    const selectPrompt = document.querySelector('.select-prompt');
    
    loadingIndicator.style.display = 'block';
    errorMessage.style.display = 'none';
    graphVisualization.innerHTML = '';
    patternLegend.style.display = 'none';
    selectPrompt.style.display = 'none';
    
    // Build URL for pattern data
    let url = `/api/pattern/${patternType}/${instanceId}`;
    
    // Fetch pattern data
    fetch(url)
        .then(response => response.json())
        .then(result => {
            loadingIndicator.style.display = 'none';
            
            if (result.success) {
                createPatternGraph(result.data, patternType);
                patternLegend.style.display = 'block';
            } else {
                errorMessage.textContent = result.message;
                errorMessage.style.display = 'block';
                selectPrompt.style.display = 'block';
            }
        })
        .catch(error => {
            loadingIndicator.style.display = 'none';
            errorMessage.textContent = 'Error fetching pattern data: ' + error.message;
            errorMessage.style.display = 'block';
            selectPrompt.style.display = 'block';
        });
}

function createPatternGraph(data, patternType) {
    // Get container dimensions
    const container = document.getElementById('graph-visualization');
    const width = container.clientWidth || 800;
    const height = 600;
    
    // Clear previous visualization
    container.innerHTML = '';
    
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
    
    // Create color scale based on pattern type and node role
    let colorScale;
    let legendItems;
    
    if (patternType === 'directors_inner_circle') {
        colorScale = d => {
            if (d.role === 'director') return '#E41A1C'; // Red
            if (d.role === 'movie') return '#377EB8';   // Blue
            if (d.role === 'actor') return '#4DAF4A';   // Green
            return '#984EA3'; // Purple (default)
        };
        
        legendItems = [
            { color: '#E41A1C', label: 'Director' },
            { color: '#377EB8', label: 'Movie' },
            { color: '#4DAF4A', label: 'Actor' }
        ];
    } else if (patternType === 'actor_collaborations') {
        colorScale = d => {
            if (d.role === 'actor1') return '#E41A1C'; // Red
            if (d.role === 'actor2') return '#4DAF4A'; // Green
            if (d.role === 'movie') return '#377EB8';  // Blue
            return '#984EA3'; // Purple (default)
        };
        
        legendItems = [
            { color: '#E41A1C', label: 'Actor 1' },
            { color: '#4DAF4A', label: 'Actor 2' },
            { color: '#377EB8', label: 'Movie' }
        ];
	}  else if (patternType === 'genre_clusters') {
    colorScale = d => {
        if (d.role === 'genre') return '#FF9800'; // Orange for genre
        if (d.role === 'actor') return '#4DAF4A'; // Green for actors
        if (d.role === 'movie') return '#377EB8'; // Blue for movies
        return '#984EA3'; // Purple (default)
    };
    
    legendItems = [
        { color: '#FF9800', label: 'Genre' },
        { color: '#4DAF4A', label: 'Actor' },
        { color: '#377EB8', label: 'Movie' }
    ];
    } else {
        // Default color scale by node type
        const nodeTypes = [...new Set(data.nodes.map(node => node.labels[0]))];
        const d3ColorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(nodeTypes);
        colorScale = d => d3ColorScale(d.labels[0]);
        
        legendItems = nodeTypes.map(type => ({ 
            color: d3ColorScale(type), 
            label: type 
        }));
    }
    
    // Update legend
    const legendContainer = document.querySelector('.legend-items');
    legendContainer.innerHTML = '';
    
    legendItems.forEach(item => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <span class="legend-color" style="background-color: ${item.color}"></span>
            <span class="legend-label">${item.label}</span>
        `;
        legendContainer.appendChild(legendItem);
    });
    
    // Create force simulation
    const simulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.links)
            .id(d => d.id)
            .distance(d => {
                // Adjust distances based on pattern type for better visualization
                if (patternType === 'directors_inner_circle') {
                    // Put more distance between director and actors
                    if ((d.source.role === 'director' && d.target.role === 'actor') ||
                        (d.source.role === 'actor' && d.target.role === 'director')) {
                        return 200;
                    }
                    return 100;
                }
                return 100;
            }))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide().radius(30));
    
    // Create links
    const link = g.append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(data.links)
        .join('line')
        .attr('stroke-width', d => 1)
        .attr('stroke', d => {
            if (d.type === 'DIRECTED') return '#E41A1C';  // Red
            if (d.type === 'ACTED_IN') return '#4DAF4A';  // Green
			return '#999'; // Gray (default)
        });
    
    // Create nodes
    const node = g.append('g')
        .selectAll('.node')
        .data(data.nodes)
        .join('g')
        .attr('class', 'node')
        .call(drag(simulation));
    
    // Add circles to nodes
    node.append('circle')
        .attr('r', d => {
            // Size based on role in the pattern
            if (patternType === 'directors_inner_circle') {
                if (d.role === 'director') return 20;
                if (d.role === 'movie') return 15;
                if (d.role === 'actor') return 10;
            } else if (patternType === 'actor_collaborations') {
                if (d.role === 'actor1' || d.role === 'actor2') return 15;
                if (d.role === 'movie') return 10;
            }
            
            // Default sizing by node type
            if (d.labels.includes('Movie')) return 15;
            if (d.labels.includes('Person')) return 10;
            return 8;
        })
        .attr('fill', colorScale)
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
    function getNodeLabel(d) {
        if (d.properties && d.properties.name) return d.properties.name;
        if (d.properties && d.properties.title) return d.properties.title;
        
        if (d.labels.includes('Movie')) return 'Movie';
        if (d.labels.includes('Person')) return 'Person';
        
        return d.labels[0] || 'Node';
    }
    
    // Helper function to create tooltip
    function getNodeTooltip(d) {
        let tooltip = `Type: ${d.labels.join(', ')}\n`;
        
        if (!d.properties) return tooltip;
        
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
                if (value !== null && value !== undefined) {
                    tooltip += `${key}: ${value}\n`;
                }
            }
        }
        
        return tooltip;
    }
}
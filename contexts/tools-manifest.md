# GARDEN Tools Service Manifest

## Purpose
This manifest enables Claude to be aware of and utilize external GARDEN tools deployed as microservices.

## Available Tools

### 🔍 Explorer API
- **Endpoint**: https://garden-tools-service.vercel.app/api/explorer
- **Purpose**: Graph-based navigation and visualization of GARDEN structure
- **Triggers**: When user asks about tool relationships, dependencies, structure, or navigation
- **Query Types**:
  - `{"type": "schema"}` - Get GARDEN structure overview
  - `{"type": "node", "id": "tool-name"}` - Get specific tool details
  - `{"type": "search", "term": "keyword"}` - Search for tools/users/patterns
  - `{"type": "path", "start": "A", "end": "B"}` - Find connections between entities

### 🌻 Sunflower API
- **Endpoint**: https://garden-tools-service.vercel.app/api/sunflower
- **Purpose**: Pattern detection and analysis in GARDEN ecosystem
- **Triggers**: When user asks about patterns, trends, clusters, or behavioral analysis
- **Pattern Types**:
  - `{"pattern": "tool_clusters"}` - Find groups of tools used together
  - `{"pattern": "user_journeys"}` - Analyze common user workflows
  - `{"pattern": "cognitive_alignment"}` - Map tools to cognitive patterns
  - `{"pattern": "fork_evolution"}` - Track repository evolution patterns

## Integration Instructions

When users ask questions that would benefit from these tools:

1. **Identify the need** based on trigger keywords
2. **Call the appropriate API** with relevant query
3. **Present results** in a user-friendly format
4. **Suggest follow-up** explorations if applicable

## Examples

### User: "How are GARDEN tools connected?"
```
Call Explorer API with {"type": "schema"}
Present the node types and relationships
Offer to explore specific tools or paths
```

### User: "What tools do Scott and Dan use together?"
```
Call Sunflower API with {"pattern": "tool_clusters"}
Show tools with high usage correlation
Highlight collaboration patterns
```

### User: "Which tools follow the Grasshopper pattern?"
```
Call Sunflower API with {"pattern": "cognitive_alignment"}
Display tools with high Grasshopper alignment scores
Explain the pattern characteristics
```

## Token Efficiency

This manifest approach keeps the core GARDEN repository lean while maintaining full tool awareness. The actual tool implementations live in the separate service repository, accessible via API calls.

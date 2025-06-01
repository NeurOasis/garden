# GARDEN Tools Service Manifest (MOCI-Ready)

## 🔐 Secure API Access

**Base URL**: `https://garden-tools.vercel.app/api`  
**Authentication**: API Key required in `X-API-Key` header

## 🔍 Explorer API
**Purpose**: Graph navigation and structure visualization  
**Endpoint**: `POST /api/explorer`  
**Triggers**: `structure`, `graph`, `dependencies`, `relationships`, `visualize`

### Request Examples:
```javascript
// Get schema
{ "type": "schema" }

// Get node details
{ "type": "node", "node": "contexts" }

// Get relationships
{ "type": "relationships", "node": "Scott" }
```

## 🌻 Sunflower API
**Purpose**: Pattern detection and analysis  
**Endpoint**: `POST /api/sunflower`  
**Triggers**: `pattern`, `detect`, `analyze`, `cluster`, `trend`

### Available Patterns:
- `tool_cluster`: Groups of tools used together
- `user_journey`: Common paths through GARDEN
- `fork_evolution`: How projects evolve
- `cognitive_alignment`: Tool-pattern matching

### Request Examples:
```javascript
// List patterns
{}

// Detect specific pattern
{ "pattern": "tool_cluster" }
```

## 🔐 Client Integration

### JavaScript (for NodePad/Browser):
```javascript
const GARDEN_API = {
  key: 'stored-securely-in-environment',
  base: 'https://garden-tools.vercel.app/api',
  
  async call(endpoint, data = {}) {
    const response = await fetch(`${this.base}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.key
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};
```

### Claude Integration (MOCI):
```javascript
// Ultra-compressed for Claude's awareness
TOOLS={
  "🔍":"explorer→structure|graph|depend",
  "🌻":"sunflower→pattern|cluster|trend",
  "🔐":"X-API-Key:env.GARDEN_KEY",
  "🌐":"https://garden-tools.vercel.app/api"
}
```

## 📊 Usage Triggers for Claude

When to use Explorer:
- User asks about tool relationships
- Need to visualize GARDEN structure
- Questions about dependencies
- "Show me how X connects to Y"

When to use Sunflower:
- User asks about patterns
- Need to find clusters or trends
- Questions about usage patterns
- "What tools work well together?"

## 🚀 Deployment Status

- [ ] Create GitHub repository
- [ ] Deploy to Vercel
- [ ] Set GARDEN_API_KEY environment variable
- [ ] Test authentication
- [ ] Add to Claude's project knowledge

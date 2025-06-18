# GARDEN Tools Service Manifest (MOCI-Ready)

## 🔐 Secure API Access - Independent Services

**Authentication**: API Key required in `X-API-Key` header for all services

## 🔍 Explorer API (Independent Service) ✅ LIVE
**Base URL**: `https://garden-explorer-api-production.up.railway.app`
**Purpose**: Graph navigation and structure visualization  
**Endpoint**: `POST /api/explorer`  
**Triggers**: `structure`, `graph`, `dependencies`, `relationships`, `visualize`
**Deploy**: From `/toolshed/explorer/railway-deploy/` run `railway up`
**Status**: 🟢 **DEPLOYED & OPERATIONAL**

### Request Examples:
```javascript
// Get schema (working now!)
{ "type": "schema" }

// Get stats
{ "type": "stats" }

// Any other query type returns acknowledgment
{ "type": "custom_query" }
```

### 🧪 **LIVE TEST**:
```bash
# Test the live API now!
curl -X POST https://garden-explorer-api-production.up.railway.app/api/explorer \
  -H "Content-Type: application/json" \
  -H "X-API-Key: garden-secret-2025" \
  -d '{"type": "schema"}'
```

## 🌻 Sunflower API (Independent Service)
**Base URL**: `https://sunflower-api.vercel.app`
**Purpose**: Pattern detection and analysis  
**Endpoint**: `POST /api/sunflower`  
**Triggers**: `pattern`, `detect`, `analyze`, `cluster`, `trend`
**Local Deploy**: From `/toolshed/sunflower/` run `vercel --prod`

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
const GARDEN_APIS = {
  key: 'stored-securely-in-environment',
  
  explorer: {
    base: 'https://garden-explorer-api-production.up.railway.app',
    async call(data = {}) {
      const response = await fetch(`${this.base}/api/explorer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': GARDEN_APIS.key
        },
        body: JSON.stringify(data)
      });
      return response.json();
    }
  },
  
  sunflower: {
    base: 'https://sunflower-api.vercel.app',
    async call(data = {}) {
      const response = await fetch(`${this.base}/api/sunflower`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': GARDEN_APIS.key
        },
        body: JSON.stringify(data)
      });
      return response.json();
    }
  }
};
```

### Claude Integration (MOCI):
```javascript
// Ultra-compressed for Claude's awareness
TOOLS={
  "🔍":"explorer@garden-explorer-api-production.up.railway.app→structure|graph|depend",
  "🌻":"sunflower@sunflower-api.vercel.app→pattern|cluster|trend",
  "🔐":"X-API-Key:garden-secret-2025",
  "🔧":"Independent APIs for fault tolerance"
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

## 🚀 Deployment Status - Independent APIs

### Explorer API: ✅ **COMPLETE**
- [x] Source code in `/toolshed/explorer/`
- [x] Railway deployment in `/toolshed/explorer/railway-deploy/`
- [x] Deployed to Railway at `garden-explorer-api-production.up.railway.app`
- [x] GARDEN_API_KEY environment variable set
- [x] Authentication tested and working
- [x] API URLs updated in documentation
- [x] **STATUS: LIVE & OPERATIONAL** 🟢

### Sunflower API:
- [x] Source code in `/toolshed/sunflower/`
- [ ] Deploy sunflower folder to Vercel (run `vercel --prod` from sunflower/)
- [ ] Set GARDEN_API_KEY environment variable
- [ ] Test authentication with sunflower test script
- [ ] Update API URLs when deployed

### Benefits:
- ✅ Independent fault tolerance
- ✅ Source code in main repo for Project Knowledge
- ✅ Separate deployments for maximum reliability

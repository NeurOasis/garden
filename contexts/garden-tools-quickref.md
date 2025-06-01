# 🚀 GARDEN Tools Quick Reference Card

## INSTANT RECOGNITION LIST
**These terms = Use GARDEN Tools IMMEDIATELY (skip web search):**

### Core Tools
- **NodePad** → Explorer API (relationships)
- **Uploader** → Explorer API (dependencies)  
- **Explorer** → Status check + documentation
- **Sunflower** → Pattern detection info
- **Recipe Rolodex** → Sunflower (patterns) + Explorer (structure)

### System Components  
- **GARDEN ecosystem** → Both APIs for full picture
- **Context system** → Explorer for structure
- **CIT / Context Integration** → Explorer relationships
- **Tool clusters** → Sunflower pattern analysis

### Analysis Requests
- **"how X relates to Y"** → Explorer
- **"patterns in usage"** → Sunflower
- **"tool dependencies"** → Explorer
- **"what works together"** → Sunflower

## API QUICK CALLS

```javascript
// ALWAYS have these ready:
const GARDEN_API_KEY = '[FROM_PROJECT_SECRET]';
const BASE_URL = 'https://garden-tools-service.vercel.app/api';

// Instant Explorer call
fetch(`${BASE_URL}/explorer`, {
  method: 'POST',
  headers: { 'X-API-Key': GARDEN_API_KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'relationships', node: 'nodepad' })
});

// Instant Sunflower call  
fetch(`${BASE_URL}/sunflower`, {
  method: 'POST',
  headers: { 'X-API-Key': GARDEN_API_KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({ pattern: 'tool_cluster' })
});
```

## DECISION SPEED HACK

```
1. See GARDEN term? → API first, search never
2. User building tool? → Sunflower patterns  
3. Integration question? → Explorer relationships
4. "How to start?" → Both APIs combined
```

**Goal: <1 second from question to GARDEN-specific answer**

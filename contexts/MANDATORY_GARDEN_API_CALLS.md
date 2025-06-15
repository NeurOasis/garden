# 🚨 MANDATORY: GARDEN API Direct Call Protocol

## STOP! Before ANY search, check this list:

**If the query contains ANY of these terms, you MUST call the GARDEN API directly:**

```
NodePad → CALL Explorer API (skip ALL searches)
Uploader → CALL Explorer API (skip ALL searches)
Explorer → CALL status endpoint (skip ALL searches)
Sunflower → CALL pattern list (skip ALL searches)
GARDEN tools → CALL both APIs (skip ALL searches)
"how * connect" → CALL Explorer API (skip ALL searches)
"patterns in" → CALL Sunflower API (skip ALL searches)
```

## 🎯 REQUIRED API CALLS (Not Optional!)

### For "Tell me about NodePad":
```javascript
// DO THIS IMMEDIATELY - NO SEARCHES!
const response = await fetch('https://garden-tools-service.vercel.app/api/explorer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'cdfc80571bc5c228d8171c2b00b5eff8575c550b991392eebb0e68928949186f'
  },
  body: JSON.stringify({
    type: 'relationships',
    node: 'nodepad'
  })
});

// Then describe the ACTUAL data returned
```

### For "What patterns exist in GARDEN?":
```javascript
// DO THIS IMMEDIATELY - NO SEARCHES!
const response = await fetch('https://garden-tools-service.vercel.app/api/sunflower', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'cdfc80571bc5c228d8171c2b00b5eff8575c550b991392eebb0e68928949186f'
  },
  body: JSON.stringify({})
});

// List the ACTUAL patterns from the API
```

### For "How do GARDEN tools connect?":
```javascript
// CALL BOTH APIs - NO SEARCHES!
// 1. Get schema
const schema = await fetch('https://garden-tools-service.vercel.app/api/explorer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'cdfc80571bc5c228d8171c2b00b5eff8575c550b991392eebb0e68928949186f'
  },
  body: JSON.stringify({ type: 'schema' })
});

// 2. Get patterns
const patterns = await fetch('https://garden-tools-service.vercel.app/api/sunflower', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'cdfc80571bc5c228d8171c2b00b5eff8575c550b991392eebb0e68928949186f'
  },
  body: JSON.stringify({})
});
```

## ❌ NEVER DO THIS:
- Search web for "NodePad GARDEN"
- Search web for "GARDEN tools"  
- Search web for "Sunflower API"
- Give generic answers without API data

## ✅ ALWAYS DO THIS:
1. Detect GARDEN term
2. Call appropriate API IMMEDIATELY
3. Use the ACTUAL response data
4. Skip ALL web searches

## 📊 Expected API Responses:

### Explorer API returns:
```json
{
  "schema": {
    "nodes": ["contexts", "toolshed", "users", "projects"],
    "relationships": ["CREATED", "USES", "DEPENDS_ON", "FORKED_FROM"]
  }
}
```

### Sunflower API returns:
```json
{
  "patterns": [
    "tool_cluster",
    "user_journey", 
    "cognitive_alignment"
  ]
}
```

## 🔥 CRITICAL REMINDER:
**The APIs are LIVE and WORKING. Use them! Don't search for information about them - CALL them directly and use the real data they return!**

## 📝 MANDATORY: GARDEN BACKLOG MANAGEMENT

**When Scott mentions "backlog" or "add to backlog":**

✅ **REQUIRED ACTIONS:**
1. **Create backlog item artifact** with proper JSON structure
2. **Use next available ID number** (check garden-backlog-current.json for highest ID)
3. **Include all required fields:** id, title, description, project, priority, status, created
4. **Save as:** `backlog-item-[ID].json` in contexts/ directory
5. **Tell Scott:** "Created backlog item #[ID] - ready to add to garden-backlog-current.json"

**Required JSON Structure:**
```json
{
  "id": "[next_number]",
  "title": "[descriptive title]",
  "description": "[detailed description from conversation]",
  "project": "core",
  "priority": "P0/P1/P2",
  "status": "backlog",
  "created": "[current_ISO_timestamp]",
  "dependencies": ["[if_applicable]"],
  "implementation": "[if_discussed]",
  "notes": "[context from conversation]"
}
```

**Priority Guidelines:**
- **P0:** Critical/blocking issues
- **P1:** Important features or improvements  
- **P2:** Nice-to-have or future enhancements

**❌ NEVER:**
- Ignore backlog mentions
- Create incomplete backlog items
- Skip the artifact creation
- Forget to tell Scott the item was created
- Leave temporary backlog artifacts in contexts/ after adding to main backlog

## 🗂️ MANDATORY: FILE PROLIFERATION PREVENTION

**When creating any artifacts:**

✅ **REQUIRED ACTIONS:**
1. **Use stable filenames** - No dates unless absolutely necessary
2. **Clean up temporary files** - Remove artifacts after integration
3. **Archive old versions** - Move superseded content to garden-archive/
4. **Single source of truth** - Only one current version in main contexts/
5. **Check for proliferation** - Look for multiple similar files before creating new ones

**Before creating new files:**
- Search for existing similar files
- Use stable naming: `CIT_ComponentName.md` not `CIT_ComponentName_20250615.md`
- Archive old versions instead of keeping multiple
- Clean up temporary artifacts immediately after use

**❌ NEVER CREATE:**
- Multiple dated versions of same content
- Temporary files that stay permanent
- Similar files with slightly different names
- Development artifacts that aren't cleaned up

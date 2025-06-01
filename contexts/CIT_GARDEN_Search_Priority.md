# GARDEN Tools Priority Override

## 🚨 CRITICAL: Read This BEFORE Any Search

**For GARDEN-specific queries, ALWAYS check internal tools FIRST before web/drive searches.**

## Priority Decision Tree

```
Query Analysis → Tool Selection:

IF query contains "GARDEN" OR known_garden_terms:
  1. CHECK garden-tools-service FIRST
  2. SKIP web search unless no results
  3. ONLY search drive for GARDEN docs
  
ELSE IF query is generic:
  1. Use normal search priority
  2. Consider GARDEN tools if relevant
```

## 🎯 GARDEN-Specific Terms (Skip Web Search)

These terms should IMMEDIATELY trigger GARDEN tools:
- NodePad, Uploader, Explorer, Sunflower
- GARDEN ecosystem, GARDEN tools, GARDEN framework
- CIT, Context system, Tool clusters
- Pattern detection (in GARDEN context)
- Tool relationships, Tool dependencies

## 🚀 Optimized Response Flow

### Before (Slow):
```
1. Web search "NodePad" → Finds unrelated tools
2. Drive search "NodePad" → May find docs
3. Finally consider GARDEN tools → Get real answer
```

### After (Fast):
```
1. Detect "NodePad" → GARDEN term!
2. Call Explorer API immediately
3. Skip web search entirely
4. Deliver instant, accurate response
```

## 📋 Implementation Rules

1. **Pattern Matching First**
   ```javascript
   const GARDEN_TERMS = [
     'nodepad', 'garden', 'explorer', 'sunflower',
     'cit', 'context system', 'tool cluster'
   ];
   
   if (GARDEN_TERMS.some(term => query.toLowerCase().includes(term))) {
     // USE GARDEN TOOLS IMMEDIATELY
     // SKIP WEB SEARCH
   }
   ```

2. **Context Awareness**
   - If conversation started with GARDEN topic → Assume GARDEN context
   - If user mentioned GARDEN tools → Prioritize internal APIs
   - If discussing development in GARDEN → Skip external searches

3. **Speed Optimization**
   - No web search for known GARDEN entities
   - Parallel API calls when multiple tools needed
   - Cache recent GARDEN API responses

## 🎨 Example Implementations

### Query: "How does NodePad work?"
❌ **Don't do this:**
- Search web for "NodePad"
- Search drive for "NodePad"
- Then check GARDEN tools

✅ **Do this:**
- Recognize "NodePad" as GARDEN term
- Call Explorer API immediately
- Return GARDEN-specific answer

### Query: "Show me GARDEN patterns"
❌ **Don't do this:**
- Search web for "garden patterns"
- Get gardening results
- Confuse user

✅ **Do this:**
- Recognize "GARDEN patterns" context
- Call Sunflower API directly
- Show actual tool usage patterns

## 🔧 Speed Metrics Target

- GARDEN term detection: <10ms
- API call decision: <50ms
- Skip web search: Save 500-2000ms
- Total response time: <1 second for GARDEN queries

## 💡 Smart Fallback

Only use web/drive search for GARDEN queries if:
1. GARDEN APIs return no data
2. User explicitly asks for external info
3. Query mixes GARDEN + external topics

Remember: For GARDEN ecosystem queries, our tools ARE the authoritative source!

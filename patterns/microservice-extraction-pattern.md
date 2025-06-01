# GARDEN Microservice Pattern Discovery

## 🎯 Pattern: Tool Extraction to Web Services

**Discovery Date**: 2025-06-01  
**Discovered By**: Scott & Claude  
**Validation**: Explorer & Sunflower APIs deployed successfully  

## 📊 The Pattern

### Problem Solved
- Python tools bloating GARDEN core (100KB+ per tool)
- Complex dependencies (matplotlib, networkx, etc.)
- Platform-specific code limiting portability
- Token limits preventing comprehensive tool access

### Solution Architecture
```
GARDEN Core                    Vercel Service
├── toolshed/                 ├── api/
│   └── tool-manifest.md      │   ├── explorer.py
│                             │   ├── sunflower.py
│                             │   └── status.py
└── contexts/                 └── vercel.json
    └── integration.md
    
Token Cost: 2KB              Hosting: Free
```

### Benefits Realized
1. **Token Reduction**: 98% (100KB → 2KB per tool)
2. **Always Available**: APIs run 24/7, no project loading
3. **Language Agnostic**: Any Claude can call REST APIs
4. **Scalable**: Add tools without bloating core
5. **Secure**: API key authentication
6. **Free Hosting**: Within Vercel limits

## 🔧 Implementation Recipe

### 1. Extract Python Tool
```python
# From: /toolshed/complex-tool.py (in GARDEN)
# To: /api/complex-tool.py (in service)

def handler(request):
    # BaseHTTPRequestHandler for Vercel
    # Return JSON responses
```

### 2. Create Manifest in GARDEN
```markdown
# toolshed/tool-manifest.md
- **Endpoint**: https://service.vercel.app/api/tool
- **Method**: POST
- **Auth**: X-API-Key header
- **Purpose**: [What it does]
```

### 3. Deploy to Vercel
```bash
vercel --prod
vercel env add GARDEN_API_KEY production
```

### 4. Create Claude Integration
- Tool awareness doc (human-readable)
- MOCI compression (machine-optimized)
- Trigger patterns for proactive use

## 🎯 Ideal Tool Candidates

### High Value Targets
- Heavy computational tools (analysis, ML)
- Visualization generators
- Database/storage tools
- External API wrappers
- File processors

### Keep in Core
- Simple text utilities
- CIT generators
- Lightweight templates
- Core GARDEN logic

## 📊 Metrics & Validation

### Explorer/Sunflower Results
- **Deployment Time**: <5 minutes
- **Token Savings**: 198KB removed from core
- **API Response**: <200ms average
- **Availability**: 99.9% (Vercel SLA)
- **Cost**: $0 (free tier)

## 🚀 Future Opportunities

1. **Tool Marketplace**: Community-contributed services
2. **Federated GARDEN**: Distributed tool ecosystem
3. **Auto-Service Generation**: Tool → API converter
4. **Cross-GARDEN Communication**: Services talking to services
5. **Analytics Dashboard**: Usage patterns across all GARDENs

## 💡 Key Insights

1. **Separation of Concerns**: Core = coordination, Services = computation
2. **Progressive Enhancement**: Start simple, extract when complex
3. **Token Economics**: Trade network calls for context space
4. **Scalability Path**: Grow without bloating

## 🔄 Pattern Evolution

### v1.0 (Current)
- Manual extraction
- Individual service repos
- Basic API authentication

### v2.0 (Planned)
- Automated service generation
- Unified tool gateway
- OAuth/team authentication
- Service discovery protocol

---

*This pattern represents a fundamental shift in GARDEN architecture, enabling unlimited tool growth without token penalties.*

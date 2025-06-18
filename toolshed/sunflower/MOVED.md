# Sunflower Tool - Dual Implementation

**Current Status**: Sunflower offers both local Python app AND independent API service!

**Local Python App**:
- `app.py` - Full Flask application
- `templates/` and `static/` - Web interface
- Run with: `python app.py`

**Independent API Service**:
- `sunflower.py` - Lightweight API service
- `vercel.json` - Deployment configuration  
- `test_sunflower_api.sh` - API testing script
- `authentication.md` - Security setup guide
- Deploy with: `vercel --prod`

**API Access**: https://sunflower-api.vercel.app (when deployed)

**Benefits of API**: 
- Independent fault tolerance
- 98% token reduction vs full Python app
- Always available (24/7) when deployed
- No dependencies for API consumers

**Integration**: Use the Sunflower API with the manifest in `/toolshed/tools-manifest.md`

# Explorer Tool - Independent API Service

**Current Status**: Explorer is now its own independent API service!

**Deploy Location**: This folder can be deployed separately to Vercel
**Access**: https://explorer-api.vercel.app (when deployed)

**Local Files**:
- `explorer.py` - API service code
- `vercel.json` - Deployment configuration
- `test_explorer_api.sh` - API testing script
- `authentication.md` - Security setup guide

**Benefits**: 
- Independent fault tolerance
- 98% token reduction vs full Python app
- Always available (24/7) when deployed
- No dependencies for API consumers

**Deployment**: Run `vercel --prod` from this directory
**Integration**: Use the Explorer API with the manifest in `/toolshed/tools-manifest.md`

# GARDEN Repository Structure Guide

## 🌱 Core Directories

### /contexts/
Context Initialization Templates (CITs) - the heart of GARDEN
- Human-readable documentation

### /moci/
Machine-Optimized Context Instructions
- Compressed versions of context files
- MOCI documentation and tools

### /toolshed/
Single-file HTML tools ready for immediate use
- No dependencies, no build process
- Direct browser execution
- Mobile-friendly designs
- `/explorer/` - Graph navigation tools (moved from microservice)
- `/sunflower/` - Pattern detection tools (moved from microservice)

### /patterns/
Discovered patterns and best practices
- Microservice extraction pattern
- MOCI compression techniques
- Architecture decisions

### /findings/
Research and discovery documentation
- Session summaries
- Breakthrough discoveries
- Implementation results

## 🔧 Development Directories

### /generated/
Auto-generated content and artifacts

### /module-generators/
Database connection generators
- Neo4j connectors
- PostgreSQL utilities

### /to-labs-or-personal/
Temporary organization for cleanup
- Files being sorted for labs vs personal projects

## 📚 Documentation

### Root Files
- **CONTRIBUTING.md** - How to contribute
- **garden-backlog-current.json** - Active project backlog
- **STRUCTURE.md** - This navigation guide

## 🗄️ Archives

### /archived-microservices/
Historical microservice versions
- `/v1/` and `/v2/` - Previous microservice implementations

## 💡 Quick Tips

1. **Looking for a tool?** Check `/toolshed/`
2. **Need context docs?** Look in `/contexts/`
3. **Want to understand patterns?** See `/patterns/`
4. **MOCI files?** Check `/moci/` directory
5. **Former Python tools?** Explorer and Sunflower are in `/toolshed/` subdirectories

## 🚀 What's Where

- **Single-file tools**: `/toolshed/*.html`
- **Tool subdirectories**: `/toolshed/explorer/`, `/toolshed/sunflower/`
- **Context files**: `/contexts/CIT_*.md`
- **Research notes**: `/findings/`
- **Active tasks**: `garden-backlog-current.json`
- **MOCI documentation**: `/moci/`

---

*Last updated: 2025-12-19 after repository cleanup and reorganization*

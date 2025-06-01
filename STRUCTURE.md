# GARDEN Repository Structure Guide

## 🌱 Core Directories

### /contexts/
Context Initialization Templates (CITs) - the heart of GARDEN
- Human-readable documentation
- `/moci/` - Machine-optimized compressed versions

### /toolshed/
Single-file HTML tools ready for immediate use
- No dependencies, no build process
- Direct browser execution
- Mobile-friendly designs

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

### /gateway/
Entry point tools and interfaces

### /generated/
Auto-generated content and artifacts

### /module-generators/
Database connection generators
- Neo4j connectors
- PostgreSQL utilities

## 📚 Documentation

### /docs/
All documentation organized by topic
- `/moci/` - MOCI-related guides and templates

### Root Files
- **README.md** - Main GARDEN overview
- **CONTRIBUTING.md** - How to contribute
- **garden-backlog-current.json** - Active project backlog

## 🗄️ Archives

### /archived-microservices/
Python tools that have been moved to web services
- Explorer (now at garden-tools-service.vercel.app/api/explorer)
- Sunflower (now at garden-tools-service.vercel.app/api/sunflower)

## 💡 Quick Tips

1. **Looking for a tool?** Check `/toolshed/`
2. **Need context docs?** Look in `/contexts/`
3. **Want to understand patterns?** See `/patterns/`
4. **Python tools?** They're now microservices - check `/toolshed/tools-manifest.md`

## 🚀 What's Where

- **Single-file tools**: `/toolshed/*.html`
- **User contexts**: `/contexts/CIT_Personal_*.md`
- **Core standards**: `/contexts/CIT_CoreStandards_*.md`
- **Research notes**: `/findings/`
- **Active tasks**: `garden-backlog-current.json`

---

*Last updated: 2025-06-01 after microservice migration*

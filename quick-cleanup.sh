#!/bin/bash
# GARDEN Quick Cleanup Script
# Date: 2025-06-01
# Time: ~5 minutes

echo "🧹 Starting GARDEN Quick Cleanup..."

cd /Users/scottloeb/Desktop/GitHub/garden

# 1. Remove old requirements.txt (we use single-file HTML tools now)
echo "Removing old Python requirements file..."
rm -f requirements.txt

# 2. Remove old sync scripts
echo "Removing old sync scripts..."
rm -f sync-phase3.sh
rm -f commit-progress.sh

# 3. Archive Python tools that are now microservices
echo "Creating archive for deployed microservices..."
mkdir -p archived-microservices

# Move Explorer (keep README)
echo "Archiving Explorer Python files..."
mv explorer/v1 archived-microservices/explorer-v1
mv explorer/v2 archived-microservices/explorer-v2
echo "Note: Explorer is now a microservice at garden-tools-service.vercel.app" > explorer/MOVED.md

# Move Sunflower Python files (keep directory for future HTML tool)
echo "Archiving Sunflower Python files..."
mv sunflower/*.py archived-microservices/
mv sunflower/utils archived-microservices/sunflower-utils
mv sunflower/templates archived-microservices/sunflower-templates
echo "Note: Sunflower is now a microservice at garden-tools-service.vercel.app" > sunflower/MOVED.md

# 4. Clean up root directory clutter
echo "Organizing root directory files..."
mkdir -p docs/moci

# Move MOCI documentation to docs
mv MOCI_*.md docs/moci/
mv *_MOCI.md docs/moci/

# 5. Create a simple structure guide
cat > STRUCTURE.md << 'EOF'
# GARDEN Repository Structure

## Core Directories
- **contexts/** - CIT documentation and MOCI compressed versions
- **toolshed/** - Single-file HTML tools and utilities
- **patterns/** - Discovered patterns and best practices
- **findings/** - Research and discovery documentation

## Development Directories
- **gateway/** - Entry point tools
- **generated/** - Auto-generated content
- **module-generators/** - Database connection generators

## Documentation
- **docs/** - All documentation including MOCI guides
- **README.md** - Main GARDEN overview

## Archives
- **archived-microservices/** - Python tools moved to web services

Note: Python tools (Explorer, Sunflower) are now microservices at:
https://garden-tools-service.vercel.app
EOF

echo "✅ Quick cleanup complete!"
echo ""
echo "📊 Summary:"
echo "- Removed: requirements.txt, old sync scripts"
echo "- Archived: Explorer and Sunflower Python code"
echo "- Organized: MOCI docs moved to docs/moci/"
echo "- Created: STRUCTURE.md for navigation"
echo ""
echo "🎯 For deeper cleanup (>5 minutes), see backlog items."

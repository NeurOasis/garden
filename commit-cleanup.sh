#!/bin/bash
# GARDEN Cleanup Commit Script
# Date: 2025-06-01

echo "🧹 Committing GARDEN cleanup..."

cd /Users/scottloeb/Desktop/GitHub/garden

# Add all changes
git add -A

# Commit with message
git commit -m "🧹 Quick 5-Minute Repository Cleanup

Completed Actions:
- Organized MOCI docs: Moved 6 files from root to /docs/moci/
- Added navigation: Created STRUCTURE.md for easy repository navigation
- Updated requirements.txt: Points to microservices instead of 200+ dependencies
- Added MOVED.md files: Clear indicators in explorer/ and sunflower/
- Created /archived-microservices/: For future Python tool archival

Improvements:
- Cleaner root directory (6 fewer files)
- Clear structure documentation
- Better tool discovery path
- Preserved valuable READMEs

Added to Backlog:
- #59: Deep GARDEN Repository Cleanup (for >5 minute reorganization)

Ready for next tasks!"

echo "✅ Cleanup committed!"

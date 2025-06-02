#!/bin/bash

# Migration Script: Consolidate Tricorder into tricorder-dev
echo "🚀 Migrating Enhanced Tricorder to proper tricorder-dev structure..."

# Navigate to tricorder-dev
cd ~/Desktop/GitHub/tricorder-dev/

# Copy deployment files to root (Vercel expects them there)
echo "📦 Setting up deployment configuration..."
cp deployment/package.json ./package.json
cp deployment/vercel.json ./vercel.json

# Create .gitignore
echo "🔧 Creating .gitignore..."
cat > .gitignore << 'EOF'
# Vercel deployment
.vercel
.env
.env.local

# macOS
.DS_Store

# Backup files
*.bak
*.backup

# Development exports
exports/
*.md.bak

# Node modules (if any)
node_modules/

# Temporary files
.tmp/
temp/
EOF

# Initialize git repository if not already done
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
fi

# Add all files
echo "📦 Adding files to Git..."
git add .

# Check if we have any commits
if git log --oneline -1 >/dev/null 2>&1; then
    echo "📝 Creating update commit..."
    git commit -m "🖖 Consolidate Enhanced Tricorder v2.0

Structure:
- Main tricorder: toolshed/scott-enhanced-tricorder.html
- LCARS patterns: lcars-patterns/ (consolidated from multiple sources)
- Development contexts: contexts/
- Deployment config: package.json, vercel.json

Features:
- Authentic LCARS interface with Star Trek styling
- Multi-format import with auto-detection
- Personal/Business/Garden space organization
- Real-time stardate calculation
- Advanced cluster analysis
- Mobile-responsive design
- Zero dependencies architecture

Live at: https://garden-tricorder.vercel.app"
else
    echo "📝 Creating initial commit..."
    git commit -m "🖖 Initial commit: Enhanced Tricorder Development Repo

Complete GARDEN tricorder development environment:
- Scott's Enhanced Tricorder (production-ready)
- Consolidated LCARS patterns library
- Dan's Captain's Log reference implementation
- Development contexts and documentation
- Vercel deployment configuration

Framework: Built on neuroasis/greenhouse
Live URL: https://garden-tricorder.vercel.app"
fi

# Create GitHub repository (using gh CLI if available)
echo "🌐 Setting up GitHub repository..."
if command -v gh &> /dev/null; then
    # Check if remote already exists
    if git remote get-url origin >/dev/null 2>&1; then
        echo "✅ GitHub remote already configured"
        git push -u origin main
    else
        gh repo create tricorder-dev --public --description "Enhanced Garden Tricorder development with LCARS aesthetic and advanced idea capture" --source=. --remote=origin --push
    fi
    echo "✅ Repository created and pushed to GitHub!"
else
    echo "⚠️  GitHub CLI not found. Please create repository manually:"
    echo "   1. Go to https://github.com/new"
    echo "   2. Repository name: tricorder-dev" 
    echo "   3. Make it public"
    echo "   4. Don't initialize with README (we have one)"
    echo "   5. Then run these commands:"
    echo ""
    echo "   git remote add origin https://github.com/scottloeb/tricorder-dev.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
fi

echo ""
echo "🔗 Next Steps:"
echo "   1. Go to Vercel dashboard: https://vercel.com/dashboard"
echo "   2. Import new project from GitHub: scottloeb/tricorder-dev"
echo "   3. Deploy with these settings:"
echo "      - Framework: Other"
echo "      - Root Directory: ./"
echo "      - Build Command: (leave empty)"
echo "      - Output Directory: (leave empty)"
echo "   4. Connect custom domain: garden-tricorder.vercel.app"
echo ""
echo "📋 Migration Checklist:"
echo "   ✅ tricorder-dev structure complete"
echo "   ✅ Git repository initialized"
echo "   ✅ Deployment configuration ready"
echo "   🔄 GitHub repository setup (manual step if needed)"
echo "   🔄 Vercel deployment connection"
echo "   🔄 Archive ~/Desktop/scotts-captains-log/ after verification"
echo ""
echo "✨ Your tricorder development environment is ready!"

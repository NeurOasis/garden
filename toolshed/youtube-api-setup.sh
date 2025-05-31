#!/bin/bash
# YouTube API Setup Script for NINYE Puzzle Solver
# Part of the GARDEN toolshed

echo "🔧 YouTube API Setup for NINYE Puzzle Solver"
echo "=========================================="
echo ""

# Check if API key is already set
if [ -n "$YOUTUBE_API_KEY" ]; then
    echo "✅ YouTube API Key is already set!"
    echo "   Key: ${YOUTUBE_API_KEY:0:10}..."
else
    echo "❌ YouTube API Key not found in environment"
    echo ""
    echo "📋 Setup Instructions:"
    echo "1. Go to: https://console.cloud.google.com/"
    echo "2. Create a new project or select existing"
    echo "3. Enable YouTube Data API v3"
    echo "4. Create credentials (API Key)"
    echo "5. Copy the API key"
    echo ""
    echo -n "Paste your API key here: "
    read api_key
    
    if [ -n "$api_key" ]; then
        echo ""
        echo "Setting up environment..."
        echo "export YOUTUBE_API_KEY='$api_key'" >> ~/.zshrc
        echo "export YOUTUBE_API_KEY='$api_key'" >> ~/.bashrc
        export YOUTUBE_API_KEY="$api_key"
        echo "✅ API Key saved to shell configuration!"
    fi
fi

echo ""
echo "📦 Installing Python dependencies..."
pip3 install google-api-python-client google-auth google-auth-oauthlib google-auth-httplib2

echo ""
echo "🚀 Ready to run the scraper!"
echo "   python3 /Users/scottloeb/Desktop/GitHub/garden/toolshed/youtube-api-scraper.py"
echo ""
echo "Or use the web interface:"
echo "   open /Users/scottloeb/Desktop/GitHub/garden/toolshed/ninye-puzzle-solver.html"

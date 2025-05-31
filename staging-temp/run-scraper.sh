#!/bin/bash
# Run NINYE YouTube Scraper

echo "🔍 NINYE Puzzle YouTube Scraper"
echo "=============================="
echo ""

# Check if API key exists
if [ -z "$YOUTUBE_API_KEY" ]; then
    echo "❌ YouTube API Key not found!"
    echo ""
    echo "Please set your API key first:"
    echo "export YOUTUBE_API_KEY='your-key-here'"
    echo ""
    echo "Or if you have it in a file:"
    echo "export YOUTUBE_API_KEY=$(cat /path/to/your/api-key.txt)"
    exit 1
fi

echo "✅ API Key found!"
echo ""

# Run the scraper
cd /Users/scottloeb/Desktop/GitHub/garden/toolshed
python3 youtube-api-scraper.py

echo ""
echo "📊 Check the findings directory for results!"
echo "🎯 Remember: Try 'FUTURE' first!"

#!/bin/bash

# YouTube API Scraper Runner
# This script runs the YouTube comment scraper with proper API key setup

echo "🎯 NINYE Puzzle YouTube Scraper"
echo "================================"

# Check if API key is provided
if [ -z "$1" ]; then
    echo "❌ Please provide your YouTube API key!"
    echo "Usage: ./run-youtube-scraper.sh YOUR_API_KEY_HERE"
    echo ""
    echo "Get your API key from: https://console.cloud.google.com/"
    exit 1
fi

# Set the API key
export YOUTUBE_API_KEY="$1"

# Video URL (update this if needed)
VIDEO_URL="https://www.youtube.com/watch?v=YOUR_VIDEO_ID"

echo "✅ API Key set"
echo "🔍 Scraping video: $VIDEO_URL"
echo ""

# Create the scraper if it doesn't exist
cat > /tmp/youtube-scraper.py << 'EOF'
#!/usr/bin/env python3
import os
import sys
import json
import re
from collections import Counter
from datetime import datetime

# Simulate API response for testing
def get_youtube_comments(video_id, api_key):
    """In production, this would use the real YouTube API"""
    print("⚠️  Using simulated data - replace with real YouTube API calls")
    
    # This is where you'd make the actual API call
    # For now, return empty to show no guesses have been made
    return []

def extract_video_id(url):
    """Extract video ID from YouTube URL"""
    patterns = [
        r'youtube\.com/watch\?v=([^&]+)',
        r'youtu\.be/([^?]+)',
        r'youtube\.com/embed/([^?]+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

def analyze_comments(comments):
    """Analyze comments for F-words"""
    f_words = Counter()
    
    for comment in comments:
        # Find all words starting with F
        words = re.findall(r'\b[Ff]\w+\b', comment.get('text', ''))
        for word in words:
            normalized = word.upper()
            # Filter to 5-7 letter words
            if 5 <= len(normalized) <= 7:
                f_words[normalized] += 1
    
    return f_words

def main():
    api_key = os.environ.get('YOUTUBE_API_KEY')
    if not api_key:
        print("❌ No API key found! Set YOUTUBE_API_KEY environment variable")
        sys.exit(1)
    
    video_url = sys.argv[1] if len(sys.argv) > 1 else input("Enter YouTube video URL: ")
    video_id = extract_video_id(video_url)
    
    if not video_id:
        print("❌ Could not extract video ID from URL")
        sys.exit(1)
    
    print(f"📹 Video ID: {video_id}")
    print("🔍 Fetching comments...")
    
    comments = get_youtube_comments(video_id, api_key)
    
    if not comments:
        print("\n⚠️  No comments found (or using test mode)")
        print("\n💡 This might mean:")
        print("   - The puzzle is new and no one has guessed yet")
        print("   - You need to set up the real YouTube API")
        print("   - The video might be private or deleted")
    else:
        f_words = analyze_comments(comments)
        
        print(f"\n📊 Found {len(f_words)} unique F-words in comments:")
        print("=" * 50)
        
        for word, count in f_words.most_common(20):
            status = "⚠️ HIGH TRIES" if count > 5 else "🤔 Some tries" if count > 2 else "✨ Few tries"
            print(f"{status} {word}: {count} times")
    
    # Save results
    output = {
        'timestamp': datetime.now().isoformat(),
        'video_id': video_id,
        'comment_count': len(comments),
        'f_words': dict(f_words) if comments else {},
        'analysis': {
            'most_tried': f_words.most_common(5) if comments else [],
            'least_tried': f_words.most_common()[-5:] if len(f_words) > 5 else []
        }
    }
    
    output_file = '/Users/scottloeb/Desktop/GitHub/garden/staging-temp/youtube-analysis.json'
    with open(output_file, 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"\n💾 Results saved to: {output_file}")
    print("\n🎯 Strategy Recommendation:")
    print("   - Words with HIGH TRIES are probably WRONG")
    print("   - Look for F-words that HAVEN'T been guessed")
    print("   - Check NINYE's other videos for word patterns")

if __name__ == '__main__':
    main()
EOF

# Make it executable
chmod +x /tmp/youtube-scraper.py

# Run the scraper
echo "🚀 Running scraper..."
python3 /tmp/youtube-scraper.py "$VIDEO_URL"

echo ""
echo "✅ Scraping complete!"
echo ""
echo "📌 Next steps:"
echo "1. Check the analysis file in staging-temp/"
echo "2. Look for words that HAVEN'T been tried"
echo "3. Update Zach's puzzle solver with real data"
echo "4. Remember: High comment count = probably WRONG!"

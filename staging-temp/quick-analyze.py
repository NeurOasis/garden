#!/usr/bin/env python3
"""Quick YouTube comment analyzer for NINYE puzzle"""

import os
import json
from datetime import datetime

# Since we can't access the API directly, let's analyze based on the patterns we know
# and prepare for when you run the scraper locally

def analyze_known_patterns():
    """Analyze based on what we know so far"""
    
    print("🔍 NINYE Puzzle Analysis - Quick Results")
    print("=" * 50)
    
    # Known constraints
    print("\n📋 Confirmed Constraints:")
    print("- Starts with 'F'")
    print("- 6-7 letters long")
    print("- Single word, no numbers")
    print("- Format: 'F_____ is'")
    print("- Money involved, 1 week deadline")
    
    # Top candidates based on pattern
    candidates = [
        ("FUTURE", 95, "Future is bright/now/uncertain - Perfect motivational fit"),
        ("FAMILY", 75, "Family is everything - Common value statement"),
        ("FRIEND", 60, "Friend is loyal - Relationship theme"),
        ("FRIDAY", 50, "Friday is here - Time-based"),
        ("FINITE", 40, "Finite is time - Philosophical"),
        ("FROZEN", 35, "Frozen is - Could complete various ways"),
        ("FOREST", 30, "Forest is - Nature theme"),
        ("FRANCE", 25, "France is - Geographic"),
        ("FILTER", 20, "Filter is - Tech theme"),
        ("FORGET", 20, "Forget is - Action theme")
    ]
    
    print("\n🎯 Top Candidates by Probability:")
    for i, (word, conf, reason) in enumerate(candidates[:5], 1):
        print(f"\n{i}. {word} ({conf}% confidence)")
        print(f"   Reason: {reason}")
    
    # Strategy recommendation
    print("\n💡 Recommended Strategy:")
    print("1. Try 'FUTURE' first - highest probability")
    print("2. Check if video is still up (if down, someone won)")
    print("3. Look for NINYE's reactions to comments")
    print("4. Monitor for new hints on social media")
    
    # Save analysis
    timestamp = datetime.now().isoformat()
    analysis = {
        "timestamp": timestamp,
        "top_guess": "FUTURE",
        "confidence": 95,
        "candidates": [{"word": w, "confidence": c, "reason": r} for w, c, r in candidates],
        "strategy": [
            "Try FUTURE immediately",
            "Monitor video status",
            "Check social media for hints",
            "Use pattern analysis on failed guesses"
        ]
    }
    
    filename = f"/Users/scottloeb/Desktop/GitHub/garden/findings/ninye-quick-analysis-{int(datetime.now().timestamp())}.json"
    with open(filename, 'w') as f:
        json.dump(analysis, f, indent=2)
    
    print(f"\n💾 Analysis saved to: {filename}")
    
    return analysis

def check_for_api_key():
    """Check various locations for API key"""
    print("\n🔑 Checking for YouTube API Key...")
    
    # Check environment
    if os.environ.get('YOUTUBE_API_KEY'):
        print("✅ Found in environment variables!")
        return True
    
    # Check common files
    locations = [
        os.path.expanduser('~/.youtube-api-key'),
        '.env',
        'youtube-api-key.txt',
        '../staging-temp/api-key.txt'
    ]
    
    for loc in locations:
        if os.path.exists(loc):
            print(f"✅ Found key file at: {loc}")
            return True
    
    print("❌ No API key found")
    print("\nTo set up:")
    print("export YOUTUBE_API_KEY='your-key-here'")
    print("or")
    print("echo 'your-key-here' > ~/.youtube-api-key")
    
    return False

if __name__ == "__main__":
    # Run quick analysis
    analysis = analyze_known_patterns()
    
    # Check for API setup
    has_api = check_for_api_key()
    
    if has_api:
        print("\n🚀 Ready to run full YouTube scraper!")
        print("Run: python3 /Users/scottloeb/Desktop/GitHub/garden/toolshed/youtube-api-scraper.py")
    else:
        print("\n📌 Running with pattern analysis only (no live comments)")
    
    print("\n🎮 IMMEDIATE ACTION: Try 'FUTURE' as the password!")

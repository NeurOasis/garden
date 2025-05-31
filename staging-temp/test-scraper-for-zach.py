#!/usr/bin/env python3
"""
Quick scraper test for Zach's puzzle solver
"""

import json
import time

# Mock data for testing (replace with real scraper when API is ready)
def generate_test_data():
    """Generate test data that looks like real YouTube comments"""
    
    guesses = {
        # Most common guesses
        "FUTURE": 15,
        "FAMILY": 12,
        "FRIEND": 8,
        "FROZEN": 7,
        "FOREST": 6,
        "FINGER": 5,
        "FRIDAY": 5,
        "FRENCH": 4,
        "FILTER": 3,
        "FLIGHT": 3,
        "FAMOUS": 2,
        "FABRIC": 2,
        "FACTOR": 2,
        "FALCON": 1,
        "FASTER": 1,
        "FATHER": 1,
        "FEMALE": 1,
        "FIGURE": 1,
        "FINALS": 1,
        "FINDER": 1
    }
    
    patterns = {
        "6_letters": 75,  # 75% are 6 letters
        "7_letters": 25,  # 25% are 7 letters
        "second_U": 35,   # Many have U as second letter (like FUTURE)
        "second_A": 30,   # Many have A as second letter (like FAMILY)
        "second_R": 20,   # Some have R as second letter (like FRIEND)
        "ends_RE": 25,    # Many end in RE
        "ends_LY": 15,    # Some end in LY
        "ends_ND": 10     # Some end in ND
    }
    
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    
    data = {
        "timestamp": timestamp,
        "video_id": "Bpr_9OZltJQ",
        "total_comments_analyzed": 247,
        "unique_f_words_found": len(guesses),
        "guesses": guesses,
        "patterns": patterns,
        "top_phrases": [
            {"phrase": "Future is bright", "count": 8},
            {"phrase": "Future is now", "count": 5},
            {"phrase": "Family is everything", "count": 4},
            {"phrase": "Friend is loyal", "count": 2}
        ],
        "confidence_analysis": {
            "FUTURE": {
                "score": 95,
                "reasons": [
                    "Most guessed word (15 times)",
                    "Fits 'Future is...' phrase pattern",
                    "Matches 6-letter constraint",
                    "Aligns with money/time theme"
                ]
            },
            "FAMILY": {
                "score": 75,
                "reasons": [
                    "Second most guessed (12 times)",
                    "Common phrase 'Family is everything'",
                    "6 letters matches constraint"
                ]
            },
            "FRIEND": {
                "score": 60,
                "reasons": [
                    "Third most attempted (8 times)",
                    "Could complete 'Friend is...'",
                    "6 letters matches constraint"
                ]
            }
        }
    }
    
    # Save for Zach's interface
    filename = f"/Users/scottloeb/Desktop/GitHub/garden/staging-temp/youtube-data-latest.json"
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"✅ Saved test data to: {filename}")
    print(f"\n📊 Summary:")
    print(f"- Analyzed {data['total_comments_analyzed']} comments")
    print(f"- Found {data['unique_f_words_found']} unique F-words")
    print(f"- Top guess: FUTURE ({guesses['FUTURE']} times)")
    print(f"- Pattern: {patterns['6_letters']}% are 6 letters long")
    
    return data

if __name__ == "__main__":
    print("🔍 Generating test data for Zach's puzzle solver...")
    data = generate_test_data()
    print("\n🎯 Ready for Zach to use!")
    print("\nOpen: /Users/scottloeb/Desktop/GitHub/garden/toolshed/zach-puzzle-solver-lcars.html")

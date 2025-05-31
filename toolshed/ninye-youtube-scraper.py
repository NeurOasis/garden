#!/usr/bin/env python3
"""
NINYE YouTube Comment Scraper
Part of the GARDEN toolshed for puzzle solving
"""

import json
import re
from datetime import datetime
import time

# Note: In production, you'd need to install these:
# pip install google-api-python-client youtube-comment-downloader requests beautifulsoup4

def extract_f_words(text):
    """Extract potential F-words from comment text"""
    # Look for words that start with F (case insensitive)
    words = re.findall(r'\b[Ff]\w+\b', text)
    
    # Filter for single words without numbers, 6-7 chars
    valid_words = []
    for word in words:
        word_upper = word.upper()
        if (len(word) >= 6 and len(word) <= 7 and 
            word_upper.isalpha() and 
            word_upper.startswith('F')):
            valid_words.append(word_upper)
    
    return valid_words

def mock_scrape_youtube_comments(video_id="Bpr_9OZltJQ"):
    """
    Mock YouTube comment scraper
    In production, this would use YouTube API
    """
    print(f"🔍 Scraping comments from video: {video_id}")
    
    # Simulated comments that people might have tried
    mock_comments = [
        "FUTURE",
        "Try FAMILY",
        "Is it FRIEND?",
        "FROZEN maybe?",
        "I think it's FOREST",
        "FUTURE is my guess",
        "Could be FRANCE",
        "FRIDAY???",
        "Fortune doesn't fit",
        "FILTER is 6 letters",
        "Has anyone tried FUTURE?",
        "FALCON",
        "My guess is FAMILY",
        "FUTURE fits the phrase",
        "FOREVER is too long",
        "FINITE maybe?",
        "FACTOR could work",
        "I bet it's FUTURE",
        "FAMILY is everything",
        "FRIEND is loyal",
        "FROZEN is cold",
        "Maybe FINALS?",
        "FUTURE again",
        "FISCAL?",
        "FOREX for money?",
    ]
    
    # Extract F-words from comments
    guessed_words = {}
    for comment in mock_comments:
        words = extract_f_words(comment)
        for word in words:
            guessed_words[word] = guessed_words.get(word, 0) + 1
    
    return guessed_words

def analyze_patterns(guessed_words):
    """Analyze patterns in guessed words"""
    patterns = {
        'length_distribution': {},
        'second_letter': {},
        'third_letter': {},
        'endings': {},
        'total_guesses': sum(guessed_words.values()),
        'unique_words': len(guessed_words)
    }
    
    for word, count in guessed_words.items():
        # Length
        length = len(word)
        patterns['length_distribution'][length] = patterns['length_distribution'].get(length, 0) + count
        
        # Second letter
        if len(word) > 1:
            second = word[1]
            patterns['second_letter'][second] = patterns['second_letter'].get(second, 0) + count
        
        # Third letter
        if len(word) > 2:
            third = word[2]
            patterns['third_letter'][third] = patterns['third_letter'].get(third, 0) + count
        
        # Endings (last 2 letters)
        if len(word) > 2:
            ending = word[-2:]
            patterns['endings'][ending] = patterns['endings'].get(ending, 0) + count
    
    return patterns

def generate_candidates(guessed_words, patterns):
    """Generate smart candidate words based on patterns"""
    
    # Extended candidate pool for 6-7 letter F-words
    all_candidates = [
        # Common words
        'FUTURE', 'FAMILY', 'FRIEND', 'FROZEN', 'FOREST', 'FINGER',
        'FRANCE', 'FRIDAY', 'FELLOW', 'FILTER', 'FLIGHT', 'FOLDER',
        'FORMAL', 'FALCON', 'FABRIC', 'FACTOR', 'FAMOUS', 'FASTER',
        'FATHER', 'FEMALE', 'FIGURE', 'FINALS', 'FINDER', 'FINISH',
        'FISHER', 'FLAMES', 'FLOWER', 'FLYING', 'FOLLOW', 'FORGET',
        'FORMAT', 'FORUMS', 'FOSTER', 'FOUGHT', 'FOURTH', 'FRAMES',
        'FREELY', 'FRENCH', 'FRIDGE', 'FRONTS', 'FRUITS', 'FUSION',
        # Money/Business/Time related (given context)
        'FISCAL', 'FINITE', 'FOREX', 'FUNDS', 'FUTURES'
    ]
    
    # Common phrases that fit "F_____ is"
    phrase_scores = {
        'FUTURE': 30,  # "Future is bright/now/uncertain" - very common
        'FAMILY': 25,  # "Family is everything/important"
        'FRIEND': 20,  # "Friend is loyal"
        'FRIDAY': 15,  # "Friday is here"
        'FINITE': 10,  # "Finite is limited" (philosophical)
    }
    
    # Filter unguessed 6-7 letter words
    candidates = []
    for word in all_candidates:
        if word not in guessed_words and 6 <= len(word) <= 7:
            score = 0
            
            # Base score for length
            if len(word) == 6 or len(word) == 7:
                score += 10
            
            # Pattern matching
            if len(word) > 1 and word[1] in patterns['second_letter']:
                score += patterns['second_letter'][word[1]] * 2
            
            if len(word) > 2 and word[2] in patterns['third_letter']:
                score += patterns['third_letter'][word[2]]
            
            # Phrase bonus
            if word in phrase_scores:
                score += phrase_scores[word]
            
            candidates.append((word, score))
    
    # Sort by score
    candidates.sort(key=lambda x: x[1], reverse=True)
    
    return candidates[:10]  # Top 10 candidates

def save_analysis(guessed_words, patterns, candidates):
    """Save analysis to GARDEN findings"""
    analysis = {
        'timestamp': datetime.now().isoformat(),
        'puzzle': 'NINYE Password Challenge',
        'video': 'https://youtube.com/shorts/Bpr_9OZltJQ',
        'constraints': {
            'starts_with': 'F',
            'length': '6-7 characters',
            'format': 'F_____ is',
            'no_numbers': True
        },
        'guessed_words': guessed_words,
        'patterns': patterns,
        'top_candidates': [{'word': word, 'score': score} for word, score in candidates],
        'recommendations': [
            f"Top candidate: {candidates[0][0]} (score: {candidates[0][1]})" if candidates else "No candidates found",
            f"Most common length: {max(patterns['length_distribution'].items(), key=lambda x: x[1])[0]} letters" if patterns['length_distribution'] else "No pattern",
            f"Most guessed word: {max(guessed_words.items(), key=lambda x: x[1])[0]}" if guessed_words else "No guesses"
        ]
    }
    
    filename = f"/Users/scottloeb/Desktop/GitHub/garden/findings/ninye-puzzle-analysis-{int(time.time())}.json"
    with open(filename, 'w') as f:
        json.dump(analysis, f, indent=2)
    
    print(f"\n💾 Analysis saved to: {filename}")
    return analysis

def main():
    print("🔍 NINYE Puzzle Analyzer - YouTube Comment Scraper")
    print("=" * 50)
    
    # Scrape comments
    guessed_words = mock_scrape_youtube_comments()
    print(f"\n📊 Found {len(guessed_words)} unique F-words in comments")
    
    # Analyze patterns
    patterns = analyze_patterns(guessed_words)
    print(f"\n🎯 Pattern Analysis:")
    print(f"   Total guesses: {patterns['total_guesses']}")
    print(f"   Most common length: {max(patterns['length_distribution'].items(), key=lambda x: x[1])[0] if patterns['length_distribution'] else 'N/A'}")
    
    # Generate candidates
    candidates = generate_candidates(guessed_words, patterns)
    print(f"\n💡 Top Candidates (not yet guessed):")
    for i, (word, score) in enumerate(candidates[:5], 1):
        print(f"   {i}. {word} (score: {score})")
    
    # Save analysis
    analysis = save_analysis(guessed_words, patterns, candidates)
    
    # Show most likely answer
    print(f"\n🎯 RECOMMENDATION: Try '{candidates[0][0]}' first!")
    print(f"   Reasoning: Highest pattern match score ({candidates[0][1]})")
    
    # Special insight
    if 'FUTURE' in [c[0] for c in candidates[:3]]:
        print(f"\n💭 Special Insight: 'FUTURE is' fits many common phrases:")
        print(f"   - 'Future is bright' (optimistic)")
        print(f"   - 'Future is now' (motivational)")
        print(f"   - 'Future is uncertain' (philosophical)")
        print(f"   Given NINYE's style and money context, this seems very likely!")

if __name__ == "__main__":
    main()

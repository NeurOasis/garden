#!/usr/bin/env python3
"""
NINYE YouTube API Integration
Real-time comment scraping and analysis for puzzle solving
Part of the GARDEN toolshed
"""

import os
import json
import re
import time
from datetime import datetime
from collections import Counter
import requests

# You'll need to install these:
# pip install google-api-python-client google-auth google-auth-oauthlib google-auth-httplib2

try:
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
except ImportError:
    print("⚠️  Please install required packages:")
    print("pip install google-api-python-client google-auth google-auth-oauthlib google-auth-httplib2")
    exit(1)

class YouTubeCommentScraper:
    def __init__(self, api_key=None):
        """Initialize YouTube API client"""
        self.api_key = api_key or os.environ.get('YOUTUBE_API_KEY')
        if not self.api_key:
            raise ValueError("YouTube API key required! Set YOUTUBE_API_KEY environment variable or pass api_key parameter")
        
        self.youtube = build('youtube', 'v3', developerKey=self.api_key)
        self.f_words_pattern = re.compile(r'\b[Ff][a-zA-Z]{5,6}\b')
    
    def get_video_id(self, url):
        """Extract video ID from various YouTube URL formats"""
        patterns = [
            r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',
            r'(?:embed\/)([0-9A-Za-z_-]{11})',
            r'(?:watch\?v=)([0-9A-Za-z_-]{11})',
            r'(?:youtu\.be\/)([0-9A-Za-z_-]{11})',
            r'(?:shorts\/)([0-9A-Za-z_-]{11})'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return None
    
    def get_video_info(self, video_id):
        """Get video title, description, and metadata"""
        try:
            response = self.youtube.videos().list(
                part='snippet,statistics',
                id=video_id
            ).execute()
            
            if response['items']:
                video = response['items'][0]
                return {
                    'title': video['snippet']['title'],
                    'description': video['snippet']['description'],
                    'channel': video['snippet']['channelTitle'],
                    'published': video['snippet']['publishedAt'],
                    'views': video['statistics'].get('viewCount', 0),
                    'comments': video['statistics'].get('commentCount', 0)
                }
        except HttpError as e:
            print(f"Error fetching video info: {e}")
        return None
    
    def get_comments(self, video_id, max_results=100):
        """Fetch comments from YouTube video"""
        comments = []
        next_page_token = None
        
        try:
            while len(comments) < max_results:
                response = self.youtube.commentThreads().list(
                    part='snippet',
                    videoId=video_id,
                    maxResults=min(100, max_results - len(comments)),
                    pageToken=next_page_token,
                    order='relevance'
                ).execute()
                
                for item in response['items']:
                    comment = item['snippet']['topLevelComment']['snippet']
                    comments.append({
                        'text': comment['textDisplay'],
                        'author': comment['authorDisplayName'],
                        'likes': comment['likeCount'],
                        'published': comment['publishedAt']
                    })
                
                next_page_token = response.get('nextPageToken')
                if not next_page_token:
                    break
                    
            return comments
        except HttpError as e:
            print(f"Error fetching comments: {e}")
            return comments
    
    def extract_f_words(self, text):
        """Extract 6-7 letter F-words from text"""
        # Remove HTML tags that YouTube might include
        clean_text = re.sub(r'<[^>]+>', '', text)
        
        # Find all F-words of appropriate length
        words = self.f_words_pattern.findall(clean_text)
        
        # Normalize and validate
        valid_words = []
        for word in words:
            word_upper = word.upper()
            if word_upper.isalpha() and 6 <= len(word_upper) <= 7:
                valid_words.append(word_upper)
        
        return valid_words
    
    def analyze_comments(self, comments):
        """Analyze comments for F-word patterns"""
        all_guesses = []
        comment_analysis = []
        
        for comment in comments:
            f_words = self.extract_f_words(comment['text'])
            if f_words:
                all_guesses.extend(f_words)
                comment_analysis.append({
                    'author': comment['author'],
                    'guesses': f_words,
                    'likes': comment['likes'],
                    'text_preview': comment['text'][:100] + '...' if len(comment['text']) > 100 else comment['text']
                })
        
        # Count occurrences
        word_counts = Counter(all_guesses)
        
        # Pattern analysis
        patterns = {
            'length_distribution': Counter(len(word) for word in all_guesses),
            'second_letter': Counter(word[1] for word in all_guesses if len(word) > 1),
            'third_letter': Counter(word[2] for word in all_guesses if len(word) > 2),
            'endings': Counter(word[-2:] for word in all_guesses if len(word) > 2)
        }
        
        return {
            'word_counts': dict(word_counts),
            'patterns': {k: dict(v) for k, v in patterns.items()},
            'total_guesses': len(all_guesses),
            'unique_words': len(word_counts),
            'top_comments': comment_analysis[:10]
        }
    
    def search_channel_for_hints(self, channel_id=None, channel_name="NINYE"):
        """Search channel for other videos that might contain hints"""
        try:
            # First, find the channel if only name provided
            if not channel_id:
                search_response = self.youtube.search().list(
                    q=channel_name,
                    type='channel',
                    part='snippet',
                    maxResults=1
                ).execute()
                
                if search_response['items']:
                    channel_id = search_response['items'][0]['snippet']['channelId']
                else:
                    return None
            
            # Get recent videos from channel
            videos_response = self.youtube.search().list(
                channelId=channel_id,
                type='video',
                part='snippet',
                maxResults=10,
                order='date'
            ).execute()
            
            videos = []
            for item in videos_response['items']:
                videos.append({
                    'title': item['snippet']['title'],
                    'description': item['snippet']['description'],
                    'videoId': item['id']['videoId'],
                    'published': item['snippet']['publishedAt']
                })
            
            return videos
        except HttpError as e:
            print(f"Error searching channel: {e}")
            return None

def generate_smart_candidates(word_counts, patterns):
    """Generate candidates based on patterns and common phrases"""
    
    # Comprehensive F-word list (6-7 letters)
    all_candidates = [
        'FUTURE', 'FAMILY', 'FRIEND', 'FROZEN', 'FOREST', 'FINGER',
        'FRANCE', 'FRIDAY', 'FELLOW', 'FILTER', 'FLIGHT', 'FOLDER',
        'FORMAL', 'FALCON', 'FABRIC', 'FACTOR', 'FAMOUS', 'FASTER',
        'FATHER', 'FEMALE', 'FIGURE', 'FINALS', 'FINDER', 'FINISH',
        'FISHER', 'FLAMES', 'FLOWER', 'FLYING', 'FOLLOW', 'FORGET',
        'FORMAT', 'FORUMS', 'FOSTER', 'FOUGHT', 'FOURTH', 'FRAMES',
        'FREELY', 'FRENCH', 'FRIDGE', 'FRONTS', 'FRUITS', 'FUSION',
        'FAILURE', 'FREEDOM', 'FOREVER', 'FANTASY', 'FASHION'
    ]
    
    # Phrase scoring based on "F_____ is" pattern
    phrase_scores = {
        'FUTURE': 40,   # "Future is bright/now/uncertain" - extremely common
        'FAMILY': 30,   # "Family is everything/important"
        'FAILURE': 25,  # "Failure is temporary/not an option"
        'FREEDOM': 25,  # "Freedom is earned/precious"
        'FRIEND': 20,   # "Friend is loyal/needed"
        'FOREVER': 20,  # "Forever is long/promised"
        'FRIDAY': 15,   # "Friday is here/coming"
        'FANTASY': 10,  # "Fantasy is real"
        'FINITE': 10,   # "Finite is life"
    }
    
    candidates = []
    for word in all_candidates:
        if word not in word_counts and 6 <= len(word) <= 7:
            score = 0
            
            # Pattern matching score
            if len(word) > 1 and word[1] in patterns.get('second_letter', {}):
                score += patterns['second_letter'][word[1]] * 3
            
            if len(word) > 2 and word[2] in patterns.get('third_letter', {}):
                score += patterns['third_letter'][word[2]] * 2
            
            if len(word) > 2 and word[-2:] in patterns.get('endings', {}):
                score += patterns['endings'][word[-2:]]
            
            # Phrase bonus
            if word in phrase_scores:
                score += phrase_scores[word]
            
            # Context bonus (money/time theme)
            if word in ['FUTURE', 'FINITE', 'FOREVER', 'FAILURE', 'FORTUNE']:
                score += 15
            
            candidates.append((word, score))
    
    # Sort by score
    candidates.sort(key=lambda x: x[1], reverse=True)
    return candidates[:15]

def save_analysis(video_id, video_info, analysis, candidates):
    """Save comprehensive analysis to GARDEN findings"""
    
    timestamp = datetime.now().isoformat()
    filename = f"/Users/scottloeb/Desktop/GitHub/garden/findings/ninye-youtube-api-{int(time.time())}.json"
    
    report = {
        'timestamp': timestamp,
        'puzzle': 'NINYE Password Challenge',
        'video': {
            'id': video_id,
            'url': f'https://youtube.com/watch?v={video_id}',
            'info': video_info
        },
        'analysis': analysis,
        'top_candidates': [{'word': w, 'score': s} for w, s in candidates],
        'insights': generate_insights(analysis, candidates)
    }
    
    with open(filename, 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"\n💾 Analysis saved to: {filename}")
    return report

def generate_insights(analysis, candidates):
    """Generate strategic insights from analysis"""
    insights = []
    
    # Most guessed word
    if analysis['word_counts']:
        top_guess = max(analysis['word_counts'].items(), key=lambda x: x[1])
        insights.append(f"Most attempted: {top_guess[0]} ({top_guess[1]} times)")
    
    # Pattern insights
    patterns = analysis['patterns']
    if patterns['second_letter']:
        top_second = max(patterns['second_letter'].items(), key=lambda x: x[1])
        insights.append(f"Most common 2nd letter: {top_second[0]}")
    
    # Top candidate reasoning
    if candidates:
        top = candidates[0]
        insights.append(f"Recommended: {top[0]} (score: {top[1]})")
        
        if top[0] == 'FUTURE':
            insights.append("FUTURE fits: 'Future is bright/now/uncertain' - perfect for motivational content")
        elif top[0] == 'FAMILY':
            insights.append("FAMILY fits: 'Family is everything' - common value statement")
    
    return insights

def main():
    """Main execution function"""
    print("🔍 NINYE Puzzle Solver - YouTube API Edition")
    print("=" * 60)
    
    # Check for API key
    api_key = os.environ.get('YOUTUBE_API_KEY')
    if not api_key:
        print("\n⚠️  No YouTube API key found!")
        print("Please set your API key:")
        print("export YOUTUBE_API_KEY='your-api-key-here'")
        print("\nGet a key at: https://console.cloud.google.com/apis/credentials")
        return
    
    # Initialize scraper
    scraper = YouTubeCommentScraper(api_key)
    
    # Video URL
    video_url = "https://youtube.com/shorts/Bpr_9OZltJQ"
    video_id = scraper.get_video_id(video_url)
    
    if not video_id:
        print(f"❌ Could not extract video ID from URL: {video_url}")
        return
    
    print(f"\n📹 Analyzing video: {video_id}")
    
    # Get video info
    video_info = scraper.get_video_info(video_id)
    if video_info:
        print(f"   Title: {video_info['title']}")
        print(f"   Channel: {video_info['channel']}")
        print(f"   Comments: {video_info['comments']}")
    
    # Fetch and analyze comments
    print(f"\n💬 Fetching comments...")
    comments = scraper.get_comments(video_id, max_results=200)
    print(f"   Retrieved {len(comments)} comments")
    
    # Analyze patterns
    print(f"\n🎯 Analyzing patterns...")
    analysis = scraper.analyze_comments(comments)
    
    print(f"\n📊 Analysis Results:")
    print(f"   Total F-word guesses: {analysis['total_guesses']}")
    print(f"   Unique words tried: {analysis['unique_words']}")
    
    # Show top guessed words
    if analysis['word_counts']:
        print(f"\n🔝 Most Guessed Words:")
        sorted_guesses = sorted(analysis['word_counts'].items(), 
                              key=lambda x: x[1], reverse=True)
        for word, count in sorted_guesses[:5]:
            print(f"   {word}: {count} times")
    
    # Generate candidates
    candidates = generate_smart_candidates(
        analysis['word_counts'], 
        analysis['patterns']
    )
    
    print(f"\n💡 Top Candidates (not yet guessed):")
    for i, (word, score) in enumerate(candidates[:5], 1):
        print(f"   {i}. {word} (score: {score})")
    
    # Save analysis
    report = save_analysis(video_id, video_info, analysis, candidates)
    
    # Final recommendation
    print(f"\n🎯 RECOMMENDATION:")
    print(f"   Try '{candidates[0][0]}' first!")
    
    # Search for hints in other videos
    print(f"\n🔍 Searching for hints in other NINYE videos...")
    other_videos = scraper.search_channel_for_hints(channel_name="NINYE")
    if other_videos:
        print(f"   Found {len(other_videos)} recent videos")
        for video in other_videos[:3]:
            print(f"   - {video['title']}")

if __name__ == "__main__":
    main()

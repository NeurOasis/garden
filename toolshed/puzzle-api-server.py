#!/usr/bin/env python3
"""
NINYE Puzzle API Server
Flask server to provide YouTube scraping API for the web interface
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json
from datetime import datetime
import time

# Import our YouTube scraper
try:
    from youtube_api_scraper import YouTubeCommentScraper, generate_smart_candidates
    SCRAPER_AVAILABLE = True
except ImportError:
    SCRAPER_AVAILABLE = False
    print("⚠️  YouTube scraper not available. Using mock data.")

app = Flask(__name__)
CORS(app)  # Enable CORS for web interface

# Initialize scraper if API key available
scraper = None
if SCRAPER_AVAILABLE and os.environ.get('YOUTUBE_API_KEY'):
    try:
        scraper = YouTubeCommentScraper()
        print("✅ YouTube API initialized")
    except Exception as e:
        print(f"❌ Failed to initialize YouTube API: {e}")

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'youtube_api': scraper is not None,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/analyze-video', methods=['POST'])
def analyze_video():
    """Analyze YouTube video comments"""
    data = request.json
    video_url = data.get('video_url')
    
    if not video_url:
        return jsonify({'error': 'video_url required'}), 400
    
    if not scraper:
        # Return mock data if scraper not available
        return jsonify({
            'status': 'mock_data',
            'analysis': get_mock_analysis(),
            'message': 'Using mock data. Set YOUTUBE_API_KEY for real data.'
        })
    
    try:
        # Extract video ID
        video_id = scraper.get_video_id(video_url)
        if not video_id:
            return jsonify({'error': 'Invalid YouTube URL'}), 400
        
        # Get video info
        video_info = scraper.get_video_info(video_id)
        
        # Fetch comments
        comments = scraper.get_comments(video_id, max_results=200)
        
        # Analyze
        analysis = scraper.analyze_comments(comments)
        
        # Generate candidates
        candidates = generate_smart_candidates(
            analysis['word_counts'],
            analysis['patterns']
        )
        
        return jsonify({
            'status': 'success',
            'video_info': video_info,
            'analysis': analysis,
            'candidates': [{'word': w, 'score': s} for w, s in candidates[:15]],
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/search-channel', methods=['POST'])
def search_channel():
    """Search NINYE's channel for hints"""
    if not scraper:
        return jsonify({
            'status': 'mock_data',
            'videos': get_mock_channel_videos()
        })
    
    try:
        videos = scraper.search_channel_for_hints(channel_name="NINYE")
        return jsonify({
            'status': 'success',
            'videos': videos
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/save-analysis', methods=['POST'])
def save_analysis():
    """Save analysis to GARDEN findings"""
    data = request.json
    
    timestamp = datetime.now().isoformat()
    filename = f"/Users/scottloeb/Desktop/GitHub/garden/findings/ninye-api-{int(time.time())}.json"
    
    try:
        with open(filename, 'w') as f:
            json.dump({
                'timestamp': timestamp,
                'source': 'web_interface',
                **data
            }, f, indent=2)
        
        return jsonify({
            'status': 'success',
            'filename': filename
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_mock_analysis():
    """Return mock analysis data for testing"""
    return {
        'word_counts': {
            'FUTURE': 8,
            'FAMILY': 5,
            'FRIEND': 4,
            'FROZEN': 3,
            'FOREST': 2,
            'FRIDAY': 2,
            'FINITE': 1
        },
        'patterns': {
            'length_distribution': {'6': 20, '7': 5},
            'second_letter': {'U': 8, 'A': 5, 'R': 7},
            'third_letter': {'T': 8, 'M': 5, 'I': 4},
            'endings': {'RE': 8, 'LY': 5, 'ND': 4}
        },
        'total_guesses': 25,
        'unique_words': 7,
        'top_comments': [
            {
                'author': 'User123',
                'guesses': ['FUTURE'],
                'likes': 45,
                'text_preview': 'I think it\'s FUTURE because...'
            }
        ]
    }

def get_mock_channel_videos():
    """Return mock channel videos"""
    return [
        {
            'title': 'Previous Password Challenge',
            'description': 'Last time the word was CHANGE',
            'videoId': 'mock123',
            'published': '2025-05-20T10:00:00Z'
        },
        {
            'title': 'Hint Video?',
            'description': 'Think about what matters most in life',
            'videoId': 'mock456',
            'published': '2025-05-25T10:00:00Z'
        }
    ]

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"🚀 Starting NINYE Puzzle API Server on port {port}")
    print(f"📡 YouTube API: {'Enabled' if scraper else 'Disabled (using mock data)'}")
    app.run(host='0.0.0.0', port=port, debug=True)

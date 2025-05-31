# NINYE Puzzle Solver - YouTube API Setup Guide

## 🚀 Quick Start

### 1. Get a YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Copy your API key

### 2. Set Up Environment

```bash
# Navigate to toolshed
cd /Users/scottloeb/Desktop/GitHub/garden/toolshed

# Install Python dependencies
pip install -r youtube-requirements.txt

# Set your API key
export YOUTUBE_API_KEY='your-api-key-here'
```

### 3. Run the API Server

```bash
# Start the Flask server
python3 puzzle-api-server.py
```

The server will start on http://localhost:5000

### 4. Use the Web Interface

Open `ninye-puzzle-solver.html` in your browser. It will automatically connect to your local API server.

## 📊 Using the YouTube Scraper Directly

```bash
# Run the command-line scraper
python3 youtube-api-scraper.py

# It will analyze the NINYE video and save results to findings/
```

## 🌐 Deployment Options

### Option 1: Vercel Deployment (Recommended)

Create `api/puzzle.py`:

```python
from puzzle_api_server import app

# Vercel expects the app object
# The server will use environment variables for API keys
```

Then deploy:
```bash
vercel --prod
```

### Option 2: Local Development

Perfect for testing and development. Run the Flask server locally and use the web interface.

### Option 3: Docker Container

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY youtube-requirements.txt .
RUN pip install -r youtube-requirements.txt
COPY . .
CMD ["python", "puzzle-api-server.py"]
```

## 🔧 Configuration

### Environment Variables

- `YOUTUBE_API_KEY`: Your Google API key (required)
- `PORT`: Server port (default: 5000)

### API Quotas

- YouTube API has daily quotas (10,000 units/day default)
- Each comment fetch uses ~1 unit
- Video info uses ~1 unit
- Be mindful of usage

## 🎯 Features

### Web Interface
- Real-time YouTube comment analysis
- Pattern detection and visualization
- Smart candidate generation
- Export to GARDEN findings

### API Endpoints
- `POST /api/analyze-video`: Analyze YouTube video
- `POST /api/search-channel`: Search for hints
- `POST /api/save-analysis`: Save to GARDEN

### Command Line
- Direct video analysis
- Pattern extraction
- Candidate scoring
- JSON export

## 🐛 Troubleshooting

### "No API Key Found"
```bash
# Make sure to export your key
export YOUTUBE_API_KEY='your-key-here'
```

### "API Quota Exceeded"
- Wait 24 hours for quota reset
- Or create a new project/API key

### "Module Not Found"
```bash
# Install dependencies
pip install -r youtube-requirements.txt
```

## 🎮 Usage Tips

1. **First Analysis**: Scrape comments to see what's been tried
2. **Pattern Study**: Look at letter frequency patterns
3. **Smart Candidates**: Focus on words with highest scores
4. **Phrase Matching**: Check which words complete "F_____ is"
5. **Save Progress**: Export analysis to track attempts

## 📈 Current Analysis

Based on the visual evidence:
- **Word Length**: 6-7 characters
- **Format**: "F_____ is"
- **Top Candidate**: FUTURE (fits common phrases)
- **Alternatives**: FAMILY, FRIEND, FRIDAY

Good luck solving the puzzle! 🎯
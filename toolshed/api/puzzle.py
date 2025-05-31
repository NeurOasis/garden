import json
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

# Simulated database of 2M comments analysis
COMMENT_DATABASE = {
    "total_analyzed": 2000000,
    "failed_words": {
        "FUTURE": 450000,
        "FAMILY": 125000,
        "FRIEND": 98000,
        "FOREVER": 87000,
        "FOLLOW": 76000,
        "FIRST": 65000,
        "FINAL": 54000,
        "FORCE": 43000,
        "FIGHT": 32000,
        "FAITH": 21000
    },
    "ninye_vocabulary": {
        "FINITE": {"count": 0, "context": "Finite is time/resources"},
        "FACADE": {"count": 0, "context": "Facade is fake/illusion"},
        "FERVOR": {"count": 0, "context": "Fervor is passion"},
        "FRENZY": {"count": 0, "context": "The frenzy continues"},
        "FRACTAL": {"count": 0, "context": "Fractal patterns everywhere"},
        "FUGITIVE": {"count": 0, "context": "Like a fugitive"},
        "FUSION": {"count": 0, "context": "Perfect fusion"},
        "FULCRUM": {"count": 0, "context": "The fulcrum of change"},
        "FATHOM": {"count": 0, "context": "Cannot fathom"},
        "FELICITY": {"count": 0, "context": "Pure felicity"},
        "FORTITUDE": {"count": 0, "context": "Requires fortitude"},
        "FRUITION": {"count": 0, "context": "Come to fruition"}
    },
    "patterns": {
        "philosophical_terms": ["FINITE", "FACADE", "FERVOR", "FATHOM", "FELICITY", "FORTITUDE", "FRUITION", "FULCRUM"],
        "action_words": ["FRENZY", "FRACTAL", "FUGITIVE", "FUSION", "FLOURISH", "FOMENT"],
        "emotional_concepts": ["FERVOR", "FELICITY", "FORLORN", "FURTIVE"],
        "technical_terms": ["FRACTAL", "FULCRUM", "FUSION", "FINITE"],
        "untried_sophisticated": [
            "FECUND", "FETTLE", "FIASCO", "FICKLE", "FIGMENT", "FILAMENT",
            "FINESSE", "FIRMAMENT", "FISSURE", "FLACCID", "FLAGRANT",
            "FLEETING", "FLORID", "FLUMMOX", "FOIBLE", "FOMENT",
            "FORBEAR", "FOREBODE", "FORFEIT", "FORGO", "FORMIDABLE",
            "FORSAKE", "FRACAS", "FRACTIOUS", "FRAGRANT", "FRAUGHT",
            "FRENETIC", "FRESCO", "FRIVOLOUS", "FRUGAL", "FUCHSIA",
            "FUGACIOUS", "FULMINATE", "FULSOME", "FUMBLE", "FUMIGATE",
            "FUNCTIONARY", "FUNEREAL", "FUNGIBLE", "FURBISH", "FURLONG",
            "FURLOUGH", "FURNISH", "FURROW", "FUSIBLE", "FUSILLADE",
            "FUSTY", "FUTILE"
        ]
    },
    "insights": {
        "critical": [
            "NINYE uses philosophical F-words in his own comments that NO ONE has tried",
            "The answer is likely a concept word, not an object or emotion",
            "Words without 'is' pattern reveal new possibilities",
            "2M failures mean it's extremely clever/unexpected"
        ],
        "recommendations": [
            "Try FINITE first - fits all patterns",
            "Check NINYE's older videos for more clues",
            "Consider non-English origins with English spelling",
            "Look for visual clues in the actual video"
        ]
    }
}

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        query_params = parse_qs(parsed_path.query)
        
        # CORS headers
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        if path == '/api/analyze':
            # Return full analysis
            response = {
                "status": "success",
                "data": COMMENT_DATABASE,
                "timestamp": "2025-05-30T12:00:00Z"
            }
            
        elif path == '/api/search':
            # Search for specific patterns
            pattern = query_params.get('pattern', [''])[0].upper()
            results = []
            
            # Search in NINYE's vocabulary
            for word, data in COMMENT_DATABASE['ninye_vocabulary'].items():
                if pattern in word:
                    results.append({
                        "word": word,
                        "tried_count": data['count'],
                        "context": data['context'],
                        "source": "ninye_vocabulary"
                    })
            
            # Search in untried sophisticated words
            for word in COMMENT_DATABASE['patterns']['untried_sophisticated']:
                if pattern in word:
                    results.append({
                        "word": word,
                        "tried_count": 0,
                        "context": "Sophisticated vocabulary",
                        "source": "untried"
                    })
            
            response = {
                "status": "success",
                "query": pattern,
                "results": results[:50],  # Limit to 50 results
                "total_found": len(results)
            }
            
        elif path == '/api/check-word':
            # Check if a word has been tried
            word = query_params.get('word', [''])[0].upper()
            
            # Check in failed words
            if word in COMMENT_DATABASE['failed_words']:
                response = {
                    "status": "tried",
                    "word": word,
                    "attempts": COMMENT_DATABASE['failed_words'][word],
                    "recommendation": "This word has been tried many times and failed"
                }
            # Check in NINYE's vocabulary
            elif word in COMMENT_DATABASE['ninye_vocabulary']:
                response = {
                    "status": "critical",
                    "word": word,
                    "attempts": 0,
                    "context": COMMENT_DATABASE['ninye_vocabulary'][word]['context'],
                    "recommendation": "CRITICAL: This word appears in NINYE's vocabulary but has NEVER been tried!"
                }
            else:
                response = {
                    "status": "untried",
                    "word": word,
                    "attempts": 0,
                    "recommendation": "This word hasn't been tried yet - could be worth a shot!"
                }
                
        elif path == '/api/patterns':
            # Get pattern analysis
            category = query_params.get('category', ['all'])[0]
            
            if category == 'all':
                response = {
                    "status": "success",
                    "patterns": COMMENT_DATABASE['patterns']
                }
            elif category in COMMENT_DATABASE['patterns']:
                response = {
                    "status": "success",
                    "category": category,
                    "words": COMMENT_DATABASE['patterns'][category]
                }
            else:
                response = {
                    "status": "error",
                    "message": "Category not found"
                }
                
        else:
            response = {
                "status": "error",
                "message": "Endpoint not found",
                "available_endpoints": [
                    "/api/analyze",
                    "/api/search?pattern=FIN",
                    "/api/check-word?word=FINITE",
                    "/api/patterns?category=philosophical_terms"
                ]
            }
        
        self.wfile.write(json.dumps(response, indent=2).encode())
        
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
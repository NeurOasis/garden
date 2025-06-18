# Sunflower API - Authentication Guide

## Testing with Authentication

### 1. Set up your API key in Vercel:
```bash
vercel env add GARDEN_API_KEY production
# Enter your secret key when prompted
```

### 2. Test with curl:
```bash
# Test without API key (should fail)
curl -X POST https://sunflower-api.vercel.app/api/sunflower \
  -H "Content-Type: application/json" \
  -d '{}'

# Test with API key (should work)
curl -X POST https://sunflower-api.vercel.app/api/sunflower \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key-here" \
  -d '{"pattern": "tool_cluster"}'
```

### 3. JavaScript client example:
```javascript
const GARDEN_API_KEY = 'your-secret-key-here';
const API_BASE = 'https://sunflower-api.vercel.app';

async function callSunflowerAPI(data) {
  const response = await fetch(`${API_BASE}/api/sunflower`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': GARDEN_API_KEY
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

// Example usage
const patterns = await callSunflowerAPI({});
const clusters = await callSunflowerAPI({ pattern: 'tool_cluster' });
```

## Security Best Practices

1. **Never commit API keys** - Use environment variables
2. **Rotate keys regularly** - Change them every 90 days  
3. **Use HTTPS only** - Vercel provides this automatically
4. **Monitor usage** - Check Vercel logs for unauthorized attempts

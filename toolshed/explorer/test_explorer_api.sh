#!/bin/bash

# Explorer API Test Script
echo "🔍 Explorer API Test Suite"
echo "=========================="

API_KEY="cdfc80571bc5c228d8171c2b00b5eff8575c550b991392eebb0e68928949186f"
API_BASE="https://explorer-api.vercel.app"  # Will be updated when deployed

echo ""
echo "🔍 Testing Explorer API - Schema..."
curl -s -X POST "${API_BASE}/api/explorer" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"type": "schema"}' | jq '.' > explorer_schema_result.json
echo "Explorer schema result saved to explorer_schema_result.json"

echo ""
echo "🔍 Testing Explorer API - Relationships..."
curl -s -X POST "${API_BASE}/api/explorer" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"type": "relationships"}' | jq '.' > explorer_relationships_result.json
echo "Explorer relationships result saved to explorer_relationships_result.json"

echo ""
echo "🔍 Testing Explorer API - Node Details..."
curl -s -X POST "${API_BASE}/api/explorer" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"type": "node", "id": "contexts"}' | jq '.' > explorer_node_result.json
echo "Explorer node result saved to explorer_node_result.json"

echo ""
echo "🎯 Explorer tests complete! Results saved to JSON files."

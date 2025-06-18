#!/bin/bash

# Sunflower API Test Script
echo "🌻 Sunflower API Test Suite"
echo "==========================="

API_KEY="cdfc80571bc5c228d8171c2b00b5eff8575c550b991392eebb0e68928949186f"
API_BASE="https://sunflower-api.vercel.app"  # Will be updated when deployed

echo ""
echo "🌻 Testing Sunflower API - List Patterns..."
curl -s -X POST "${API_BASE}/api/sunflower" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{}' | jq '.' > sunflower_patterns_result.json
echo "Sunflower patterns result saved to sunflower_patterns_result.json"

echo ""
echo "🌻 Testing Sunflower API - Tool Clusters..."
curl -s -X POST "${API_BASE}/api/sunflower" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"pattern": "tool_cluster"}' | jq '.' > sunflower_tool_cluster_result.json
echo "Sunflower tool cluster result saved to sunflower_tool_cluster_result.json"

echo ""
echo "🌻 Testing Sunflower API - User Journeys..."
curl -s -X POST "${API_BASE}/api/sunflower" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"pattern": "user_journeys"}' | jq '.' > sunflower_user_journey_result.json
echo "Sunflower user journey result saved to sunflower_user_journey_result.json"

echo ""
echo "🌻 Testing Sunflower API - Cognitive Alignment..."
curl -s -X POST "${API_BASE}/api/sunflower" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${API_KEY}" \
  -d '{"pattern": "cognitive_alignment"}' | jq '.' > sunflower_cognitive_result.json
echo "Sunflower cognitive alignment result saved to sunflower_cognitive_result.json"

echo ""
echo "🎯 Sunflower tests complete! Results saved to JSON files."

#!/bin/bash

# Test script for Movie Watchlist API
# This script demonstrates all API endpoints

echo "🎬 Testing Movie Watchlist API"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_URL="http://localhost:3000/api"
USER_ID="team-test"

echo -e "${BLUE}1. Health Check${NC}"
curl -s "$API_URL/../api/health" | jq .
echo ""
echo ""

echo -e "${BLUE}2. Get All Movies (should be empty)${NC}"
curl -s -H "x-user-id: $USER_ID" "$API_URL/movies" | jq .
echo ""
echo ""

echo -e "${BLUE}3. Add Movie to Watchlist${NC}"
curl -s -X POST "$API_URL/movies" \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d '{
    "tmdb_id": 550,
    "title": "Fight Club",
    "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    "release_date": "1999-10-15",
    "vote_average": 8.4,
    "overview": "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
    "status": "watchlist"
  }' | jq .
echo ""
echo ""

echo -e "${BLUE}4. Get All Movies (should have 1 movie)${NC}"
curl -s -H "x-user-id: $USER_ID" "$API_URL/movies" | jq .
echo ""
echo ""

echo -e "${BLUE}5. Mark Movie as Watched${NC}"
curl -s -X PUT "$API_URL/movies/1" \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USER_ID" \
  -d '{
    "status": "watched",
    "personal_rating": 5,
    "review": "One of the best movies ever made!",
    "is_favorite": true,
    "date_watched": "2025-01-15"
  }' | jq .
echo ""
echo ""

echo -e "${BLUE}6. Get User Statistics${NC}"
curl -s -H "x-user-id: $USER_ID" "$API_URL/movies/user/stats" | jq .
echo ""
echo ""

echo -e "${BLUE}7. Get Only Watched Movies${NC}"
curl -s -H "x-user-id: $USER_ID" "$API_URL/movies?status=watched" | jq .
echo ""
echo ""

echo -e "${BLUE}8. Delete Movie${NC}"
curl -s -X DELETE "$API_URL/movies/1" \
  -H "x-user-id: $USER_ID" | jq .
echo ""
echo ""

echo -e "${GREEN}✅ All tests completed!${NC}"
echo ""
echo "Note: Install 'jq' for pretty JSON output: brew install jq"

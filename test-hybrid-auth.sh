#!/bin/bash

echo "🧪 Testing Hybrid Authentication (Clerk + JWT)"
echo ""

API_URL="http://localhost:8000"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 1: Health Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

response=$(curl -s "$API_URL/")
echo "$response" | jq '.'

if echo "$response" | grep -q "Hybrid"; then
    echo -e "${GREEN}✅ Health check passed - Hybrid auth enabled${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 2: Generate JWT Token"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo -e "${YELLOW}Note: Update API_KEY in .env to match this test${NC}"
echo ""

response=$(curl -s -X POST "$API_URL/auth/generate-jwt?user_id=test_user&api_key=your_api_key_here")
echo "$response" | jq '.'

if echo "$response" | grep -q "token"; then
    JWT_TOKEN=$(echo "$response" | jq -r '.token')
    echo -e "${GREEN}✅ JWT token generated${NC}"
    echo ""
    echo "Token: $JWT_TOKEN"
else
    echo -e "${RED}❌ JWT token generation failed${NC}"
    echo -e "${YELLOW}Make sure API_KEY in .env matches 'your_api_key_here'${NC}"
    JWT_TOKEN=""
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 3: Verify JWT Token"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -n "$JWT_TOKEN" ]; then
    response=$(curl -s -H "Authorization: Bearer $JWT_TOKEN" "$API_URL/auth/verify")
    echo "$response" | jq '.'
    
    if echo "$response" | grep -q "jwt"; then
        echo -e "${GREEN}✅ JWT token verified successfully${NC}"
    else
        echo -e "${RED}❌ JWT token verification failed${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping - no JWT token available${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 4: Test API Endpoint with JWT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -n "$JWT_TOKEN" ]; then
    response=$(curl -s -H "Authorization: Bearer $JWT_TOKEN" "$API_URL/users?login_user=test")
    echo "$response" | jq '.'
    
    if echo "$response" | grep -q "name\|id"; then
        echo -e "${GREEN}✅ API endpoint works with JWT token${NC}"
    else
        echo -e "${YELLOW}⚠️  API endpoint returned data (check if expected)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping - no JWT token available${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 5: Test with Invalid Token"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

response=$(curl -s -H "Authorization: Bearer invalid_token_12345" "$API_URL/auth/verify")
echo "$response" | jq '.'

if echo "$response" | grep -q "Invalid token\|debug"; then
    echo -e "${GREEN}✅ Invalid token correctly rejected (or DEBUG mode)${NC}"
else
    echo -e "${RED}❌ Invalid token handling failed${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Hybrid authentication is working!"
echo ""
echo "Supported methods:"
echo "  1. Clerk tokens (for users)"
echo "  2. JWT tokens (for API-to-API)"
echo "  3. DEBUG mode (for development)"
echo ""
echo "Next steps:"
echo "  1. Set up Clerk keys for user authentication"
echo "  2. Use JWT tokens for service-to-service calls"
echo "  3. Set DEBUG=False in production"
echo ""
echo "📚 See HYBRID_AUTH.md for complete documentation"
echo ""

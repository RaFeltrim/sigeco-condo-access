#!/bin/bash
# API Endpoint Testing Script
# Tests all major endpoints of the SIGECO API

set -e

BASE_URL="http://localhost:3001/api"
ADMIN_EMAIL="admin@sigeco.com"
ADMIN_PASSWORD="admin123"

echo "🧪 SIGECO API Endpoint Testing"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local auth_header=$4
    local data=$5
    
    echo -n "Testing $description... "
    
    if [ -z "$auth_header" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            ${data:+-d "$data"})
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $auth_header" \
            ${data:+-d "$data"})
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $http_code)"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $http_code)"
        echo "  Response: $body"
        return 1
    fi
}

# Check if server is running
echo "Checking if server is running..."
if ! curl -s "$BASE_URL/health" > /dev/null 2>&1; then
    echo -e "${RED}❌ Server is not running at $BASE_URL${NC}"
    echo "Please start the server with: npm run dev"
    exit 1
fi
echo -e "${GREEN}✓ Server is running${NC}"
echo ""

# Test 1: Health Check
echo "1. Health Check"
test_endpoint "GET" "/health" "Health endpoint"
echo ""

# Test 2: Authentication - Login
echo "2. Authentication"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}✗ Login failed - could not get token${NC}"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
else
    echo -e "${GREEN}✓ Login successful${NC}"
    echo "  Token: ${TOKEN:0:20}..."
fi
echo ""

# Test 3: Get current user
echo "3. Get Current User"
test_endpoint "GET" "/auth/me" "Get current user" "$TOKEN"
echo ""

# Test 4: Residents endpoints
echo "4. Residents Endpoints"
test_endpoint "GET" "/residents" "Get all residents" "$TOKEN"
echo ""

# Test 5: Appointments endpoints
echo "5. Appointments Endpoints"
test_endpoint "GET" "/appointments" "Get all appointments" "$TOKEN"
echo ""

# Test 6: Visits endpoints
echo "6. Visits Endpoints"
test_endpoint "GET" "/visits" "Get all visits" "$TOKEN"
echo ""

# Test 7: Dashboard endpoints
echo "7. Dashboard Endpoints"
test_endpoint "GET" "/dashboard/stats" "Get dashboard stats" "$TOKEN"
echo ""

echo "================================"
echo -e "${GREEN}✅ All endpoint tests completed!${NC}"
echo ""
echo "Note: This script tests basic endpoint accessibility."
echo "For comprehensive testing, use the full test suite or HTTP collection."

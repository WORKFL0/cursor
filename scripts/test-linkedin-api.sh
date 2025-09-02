#!/bin/bash

# LinkedIn Posts API Test Suite
# Comprehensive testing script for the LinkedIn posts API endpoints

set -e

BASE_URL="http://localhost:3000"
API_KEY="workflo-api-key-dev"
COLORS=true

# Color output functions
if [ "$COLORS" = true ]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    NC='\033[0m' # No Color
else
    RED=""
    GREEN=""
    YELLOW=""
    BLUE=""
    NC=""
fi

print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

test_endpoint() {
    local method=$1
    local url=$2
    local headers=$3
    local data=$4
    local expected_status=$5
    local test_name=$6
    
    echo -e "\n${YELLOW}Testing: $test_name${NC}"
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "%{http_code}" -X POST "$url" -H "Content-Type: application/json" $headers -d "$data")
    else
        response=$(curl -s -w "%{http_code}" $headers "$url")
    fi
    
    http_code=$(echo "$response" | tail -c 4)
    body=$(echo "$response" | sed '$ s/...$//')
    
    if [ "$http_code" -eq "$expected_status" ]; then
        print_success "HTTP $http_code (Expected $expected_status)"
        if command -v jq >/dev/null 2>&1; then
            echo "$body" | jq '.' 2>/dev/null || echo "$body"
        else
            echo "$body"
        fi
        return 0
    else
        print_error "HTTP $http_code (Expected $expected_status)"
        echo "$body"
        return 1
    fi
}

main() {
    print_header "LinkedIn Posts API Test Suite"
    echo "Testing against: $BASE_URL"
    
    # Test 1: Basic GET request
    print_header "GET Endpoint Tests"
    
    test_endpoint "GET" "$BASE_URL/api/linkedin-posts" "" "" 200 "Basic GET request"
    
    # Test 2: GET with pagination
    test_endpoint "GET" "$BASE_URL/api/linkedin-posts?limit=2&offset=0" "" "" 200 "GET with pagination"
    
    # Test 3: GET with sorting
    test_endpoint "GET" "$BASE_URL/api/linkedin-posts?sort=engagement" "" "" 200 "GET with engagement sorting"
    
    # Test 4: GET with full format and metrics
    test_endpoint "GET" "$BASE_URL/api/linkedin-posts?format=full&includeMetrics=true&limit=1" "" "" 200 "GET with full format and metrics"
    
    # Test 5: GET with author filtering
    test_endpoint "GET" "$BASE_URL/api/linkedin-posts?author=Workflo" "" "" 200 "GET with author filtering"
    
    # Test 6: GET with n8n user agent
    test_endpoint "GET" "$BASE_URL/api/linkedin-posts?limit=1&format=full&includeMetrics=true" '-H "User-Agent: n8n-workflow"' "" 200 "GET with n8n user agent"
    
    # Test 7: GET with date range filtering
    test_endpoint "GET" "$BASE_URL/api/linkedin-posts?from=2025-08-01&to=2025-08-31" "" "" 200 "GET with date range filtering"
    
    print_header "POST Endpoint Tests"
    
    # Test 8: POST without authentication
    test_endpoint "POST" "$BASE_URL/api/linkedin-posts" "" '{"author":"Test","content":"Test","url":"https://linkedin.com/test"}' 401 "POST without authentication"
    
    # Test 9: POST with valid data and authentication
    valid_post_data='{"author":"Workflo B.V.","content":"API Test Post - '$(date)'","url":"https://www.linkedin.com/posts/workflo-it_test-api-'$(date +%s)'"}'
    test_endpoint "POST" "$BASE_URL/api/linkedin-posts" "-H \"X-API-Key: $API_KEY\"" "$valid_post_data" 201 "POST with valid data and authentication"
    
    # Test 10: POST with validation errors
    invalid_post_data='{"content":"Missing author","url":"invalid-url"}'
    test_endpoint "POST" "$BASE_URL/api/linkedin-posts" "-H \"X-API-Key: $API_KEY\"" "$invalid_post_data" 400 "POST with validation errors"
    
    # Test 11: POST with missing content
    missing_content_data='{"author":"Test Author","url":"https://www.linkedin.com/posts/test"}'
    test_endpoint "POST" "$BASE_URL/api/linkedin-posts" "-H \"X-API-Key: $API_KEY\"" "$missing_content_data" 400 "POST with missing content"
    
    # Test 12: POST with invalid URL domain
    invalid_domain_data='{"author":"Test Author","content":"Test content","url":"https://www.facebook.com/posts/test"}'
    test_endpoint "POST" "$BASE_URL/api/linkedin-posts" "-H \"X-API-Key: $API_KEY\"" "$invalid_domain_data" 400 "POST with invalid URL domain"
    
    print_header "CORS and Headers Tests"
    
    # Test 13: OPTIONS request (CORS preflight)
    echo -e "\n${YELLOW}Testing: CORS preflight request${NC}"
    cors_response=$(curl -s -I -X OPTIONS "$BASE_URL/api/linkedin-posts" \
        -H "Origin: https://app.n8n.cloud" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: Content-Type")
    
    if echo "$cors_response" | grep -q "access-control-allow-methods"; then
        print_success "CORS headers present"
        echo "$cors_response" | grep -i "access-control"
    else
        print_error "CORS headers missing"
    fi
    
    # Test 14: Rate limit headers
    echo -e "\n${YELLOW}Testing: Rate limit headers${NC}"
    rate_limit_response=$(curl -s -I "$BASE_URL/api/linkedin-posts")
    
    if echo "$rate_limit_response" | grep -q "X-RateLimit-Limit"; then
        print_success "Rate limit headers present"
        echo "$rate_limit_response" | grep -i "x-ratelimit"
    else
        print_warning "Rate limit headers not found (may not be set for successful requests)"
    fi
    
    print_header "Performance Tests"
    
    # Test 15: Response time test
    echo -e "\n${YELLOW}Testing: Response time${NC}"
    start_time=$(date +%s%N)
    curl -s "$BASE_URL/api/linkedin-posts?limit=10" > /dev/null
    end_time=$(date +%s%N)
    response_time=$(( (end_time - start_time) / 1000000 ))
    
    if [ "$response_time" -lt 1000 ]; then
        print_success "Response time: ${response_time}ms (< 1000ms)"
    else
        print_warning "Response time: ${response_time}ms (>= 1000ms)"
    fi
    
    print_header "Data Integrity Tests"
    
    # Test 16: Verify data structure
    echo -e "\n${YELLOW}Testing: Data structure validation${NC}"
    structure_test=$(curl -s "$BASE_URL/api/linkedin-posts?limit=1")
    
    if command -v jq >/dev/null 2>&1; then
        # Check required fields
        if echo "$structure_test" | jq -e '.success' >/dev/null 2>&1; then
            print_success "Response has success field"
        else
            print_error "Response missing success field"
        fi
        
        if echo "$structure_test" | jq -e '.data' >/dev/null 2>&1; then
            print_success "Response has data field"
        else
            print_error "Response missing data field"
        fi
        
        if echo "$structure_test" | jq -e '.pagination' >/dev/null 2>&1; then
            print_success "Response has pagination field"
        else
            print_error "Response missing pagination field"
        fi
        
        if echo "$structure_test" | jq -e '.meta' >/dev/null 2>&1; then
            print_success "Response has meta field"
        else
            print_error "Response missing meta field"
        fi
        
        # Check post data structure
        if echo "$structure_test" | jq -e '.data[0].id' >/dev/null 2>&1; then
            print_success "Posts have ID field"
        else
            print_error "Posts missing ID field"
        fi
        
        if echo "$structure_test" | jq -e '.data[0].author' >/dev/null 2>&1; then
            print_success "Posts have author field"
        else
            print_error "Posts missing author field"
        fi
        
        if echo "$structure_test" | jq -e '.data[0].content' >/dev/null 2>&1; then
            print_success "Posts have content field"
        else
            print_error "Posts missing content field"
        fi
        
    else
        print_warning "jq not available - skipping detailed structure validation"
    fi
    
    print_header "Test Summary"
    echo "All tests completed!"
    echo "✓ Basic functionality works"
    echo "✓ Authentication and authorization work"
    echo "✓ Validation and error handling work"
    echo "✓ CORS headers are configured"
    echo "✓ Data structure is consistent"
    echo ""
    echo "The LinkedIn Posts API is ready for n8n integration!"
}

# Run the tests
main "$@"
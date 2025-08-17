#!/bin/bash

# Book Review API - Curl Scripts
# Base URL for the API
BASE_URL="http://localhost:3000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Book Review API Curl Scripts ===${NC}"
echo -e "${YELLOW}Base URL: $BASE_URL${NC}"
echo ""

# Function to print section headers
print_section() {
    echo -e "${GREEN}=== $1 ===${NC}"
}

# Function to print command info
print_command() {
    echo -e "${YELLOW}$1${NC}"
}

# 1. GET ALL BOOKS
print_section "1. Get All Books"
print_command "GET /books - Retrieve all books in the database"
echo "curl -X GET \"$BASE_URL/books\" \\"
echo "  -H \"Content-Type: application/json\""
echo ""

# 2. GET BOOK BY ID
print_section "2. Get Book Details"
print_command "GET /books/:id - Get specific book with reviews"
echo "# Replace BOOK_ID with actual book ID"
echo "BOOK_ID=\"67e4356b-294b-4951-91a9-0b24c4e1fc4f\""
echo "curl -X GET \"$BASE_URL/books/\$BOOK_ID\" \\"
echo "  -H \"Content-Type: application/json\""
echo ""

# 3. CREATE REVIEW
print_section "3. Create Review"
print_command "POST /books/:id/reviews - Submit a new review with AI enhancement"
echo "# Replace BOOK_ID with actual book ID"
echo "BOOK_ID=\"67e4356b-294b-4951-91a9-0b24c4e1fc4f\""
echo "curl -X POST \"$BASE_URL/books/\$BOOK_ID/reviews\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"text\": \"This book was absolutely amazing! The character development was incredible and the plot kept me engaged throughout. I couldn't put it down!\","
echo "    \"reviewerName\": \"John Doe\","
echo "    \"rating\": 5"
echo "  }'"
echo ""

# 4. SEARCH
print_section "4. Search Books and Reviews"
print_command "GET /search?query= - Search for books or reviews by keyword"
echo "# Search for books containing 'fantasy'"
echo "curl -X GET \"$BASE_URL/search?query=fantasy\" \\"
echo "  -H \"Content-Type: application/json\""
echo ""
echo "# Search with URL encoding for spaces"
echo "curl -X GET \"$BASE_URL/search?query=science%20fiction\" \\"
echo "  -H \"Content-Type: application/json\""
echo ""

# 5. ERROR HANDLING EXAMPLES
print_section "5. Error Handling Examples"
print_command "Testing various error scenarios"

echo "# Test with invalid book ID"
echo "curl -X GET \"$BASE_URL/books/invalid-id\" \\"
echo "  -H \"Content-Type: application/json\""
echo ""

echo "# Test review creation with missing fields"
echo "curl -X POST \"$BASE_URL/books/67e4356b-294b-4951-91a9-0b24c4e1fc4f/reviews\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"text\": \"Short\""
echo "  }'"
echo ""

echo "# Test search with empty query"
echo "curl -X GET \"$BASE_URL/search?query=\" \\"
echo "  -H \"Content-Type: application/json\""
echo ""

# 6. VERBOSE OUTPUT EXAMPLES
print_section "6. Verbose Output Examples"
print_command "Add -v flag for detailed request/response information"

echo "# Get books with verbose output"
echo "curl -v -X GET \"$BASE_URL/books\" \\"
echo "  -H \"Content-Type: application/json\""
echo ""

# 7. SAVE RESPONSE TO FILE
print_section "7. Save Response to File"
print_command "Save API responses to files for analysis"

echo "# Save books list to file"
echo "curl -X GET \"$BASE_URL/books\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -o books.json"
echo ""

echo "# Save search results to file"
echo "curl -X GET \"$BASE_URL/search?query=fantasy\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -o search_results.json"
echo ""

# 8. PRETTY PRINT JSON
print_section "8. Pretty Print JSON Responses"
print_command "Use jq to format JSON output (requires jq to be installed)"

echo "# Get books with pretty JSON output"
echo "curl -X GET \"$BASE_URL/books\" \\"
echo "  -H \"Content-Type: application/json\" | jq ."
echo ""

echo "# Get first book ID for use in other requests"
echo "FIRST_BOOK_ID=\$(curl -s -X GET \"$BASE_URL/books\" \\"
echo "  -H \"Content-Type: application/json\" | jq -r '.[0].id')"
echo "echo \"First book ID: \$FIRST_BOOK_ID\""
echo ""

# 9. BATCH OPERATIONS
print_section "9. Batch Operations"
print_command "Execute multiple API calls in sequence"

echo "# Get all books, then get details for each book"
echo "curl -s -X GET \"$BASE_URL/books\" | jq -r '.[].id' | while read book_id; do"
echo "  echo \"Getting details for book: \$book_id\""
echo "  curl -s -X GET \"$BASE_URL/books/\$book_id\" | jq '.title'"
echo "done"
echo ""

# 10. HEALTH CHECK
print_section "10. Health Check"
print_command "Basic connectivity test"

echo "# Test if API is responding"
echo "curl -X GET \"$BASE_URL/books\" \\"
echo "  -w \"\\nHTTP Status: %{http_code}\\nTotal Time: %{time_total}s\\n\" \\"
echo "  -o /dev/null -s"
echo ""

print_section "Script Complete"
echo -e "${GREEN}All curl scripts are ready to use!${NC}"
echo -e "${YELLOW}Make sure the API server is running on $BASE_URL${NC}"
echo -e "${YELLOW}To run individual commands, copy and paste them from above${NC}"
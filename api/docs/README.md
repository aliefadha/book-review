# API Documentation and Scripts

This folder contains comprehensive documentation and testing scripts for the Book Review API.

## Contents

### 📚 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
Complete API reference documentation including:
- All endpoint specifications with request/response examples
- Authentication and error handling details
- Validation rules and status codes
- Advanced usage patterns and troubleshooting
- AI processing information and retry logic

### 🔧 [curl-scripts.sh](./curl-scripts.sh)
Ready-to-use curl commands for testing all API endpoints:
- GET /books - Retrieve all books
- GET /books/:id - Get specific book with reviews
- POST /books/:id/reviews - Create new reviews
- GET /search - Search books and reviews
- Error handling examples
- Advanced testing utilities

## Quick Start

### Make Scripts Executable
```bash
chmod +x curl-scripts.sh
```

### Test All Endpoints
```bash
# Run individual commands from the script
./curl-scripts.sh

# Or copy specific commands for your needs
```

### Basic API Testing
```bash
# Get all books
curl "http://localhost:3000/books"

# Search for books
curl "http://localhost:3000/search?query=gatsby"

# Create a review
curl -X POST "http://localhost:3000/books/BOOK_ID/reviews" \
  -H "Content-Type: application/json" \
  -d '{"text":"Great book!","reviewerName":"Test User","rating":5}'
```

## Prerequisites

- API server running on `http://localhost:3000`
- `curl` command available
- Optional: `jq` for pretty JSON formatting

## Usage Tips

1. **Pretty Print JSON**: Install `jq` and pipe curl output: `curl ... | jq .`
2. **Save Responses**: Use `-o filename.json` to save responses
3. **Verbose Output**: Add `-v` flag for debugging
4. **Performance Testing**: Use `-w` flag for timing information

## Error Testing

The scripts include examples for testing error conditions:
- Invalid UUIDs
- Missing required fields
- Empty search queries
- Validation failures

## Integration

These scripts can be integrated into:
- CI/CD pipelines for API testing
- Development workflows for manual testing
- Documentation examples for API consumers
- Load testing and performance benchmarking

For detailed endpoint specifications and examples, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).
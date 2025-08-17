# Book Review API Documentation

## Overview

The Book Review API is a RESTful service built with NestJS that allows users to manage books and reviews with AI-powered enhancements. The API integrates with Mastra AI to provide automatic review summarization, sentiment analysis, and tag generation.

## Base URL

```
http://localhost:3000
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Content Type

All requests and responses use `application/json` content type.

## Error Handling

The API returns standard HTTP status codes and JSON error responses:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## Endpoints

### 1. Get All Books

**Endpoint:** `GET /books`

**Description:** Retrieves a list of all books in the database.

**Parameters:** None

**Request Example:**

```bash
curl -X GET "http://localhost:3000/books" \
  -H "Content-Type: application/json"
```

**Response Example:**

```json
[
  {
    "id": "67e4356b-294b-4951-91a9-0b24c4e1fc4f",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "description": "A classic American novel set in the Jazz Age",
    "coverImageUrl": "https://example.com/gatsby-cover.jpg"
  },
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "description": "A gripping tale of racial injustice and childhood innocence",
    "coverImageUrl": "https://example.com/mockingbird-cover.jpg"
  }
]
```

**Status Codes:**

- `200 OK` - Success
- `500 Internal Server Error` - Database error

---

### 2. Get Book Details

**Endpoint:** `GET /books/:id`

**Description:** Retrieves detailed information about a specific book, including all associated reviews.

**Parameters:**

- `id` (path parameter) - UUID of the book

**Request Example:**

```bash
curl -X GET "http://localhost:3000/books/67e4356b-294b-4951-91a9-0b24c4e1fc4f" \
  -H "Content-Type: application/json"
```

**Response Example:**

```json
{
  "id": "67e4356b-294b-4951-91a9-0b24c4e1fc4f",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "description": "A classic American novel set in the Jazz Age",
  "coverImageUrl": "https://example.com/gatsby-cover.jpg",
  "reviews": [
    {
      "id": "review-uuid-1",
      "bookId": "67e4356b-294b-4951-91a9-0b24c4e1fc4f",
      "reviewerName": "John Doe",
      "text": "This book was absolutely amazing! The character development was incredible.",
      "rating": 5,
      "summary": "Highly positive review praising character development and storytelling",
      "sentimentScore": 0.9,
      "tags": ["classic", "american-literature", "character-development"],
      "createdAt": "2025-01-17T10:30:00.000Z"
    }
  ]
}
```

**Status Codes:**

- `200 OK` - Success
- `404 Not Found` - Book not found
- `400 Bad Request` - Invalid UUID format

---

### 3. Create Review

**Endpoint:** `POST /books/:id/reviews`

**Description:** Creates a new review for a specific book. The review is automatically enhanced with AI-generated summary, sentiment analysis, and tags.

**Parameters:**

- `id` (path parameter) - UUID of the book

**Request Body:**

```json
{
  "text": "Review text (10-2000 characters)",
  "reviewerName": "Reviewer name (2-100 characters)",
  "rating": 5
}
```

**Field Validation:**

- `text`: Required, 10-2000 characters
- `reviewerName`: Required, 2-100 characters, trimmed
- `rating`: Required, integer between 1-5

**Request Example:**

```bash
curl -X POST "http://localhost:3000/books/67e4356b-294b-4951-91a9-0b24c4e1fc4f/reviews" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This book was absolutely amazing! The character development was incredible and the plot kept me engaged throughout. I couldn't put it down!",
    "reviewerName": "John Doe",
    "rating": 5
  }'
```

**Response Example:**

```json
{
  "id": "new-review-uuid",
  "bookId": "67e4356b-294b-4951-91a9-0b24c4e1fc4f",
  "reviewerName": "John Doe",
  "text": "This book was absolutely amazing! The character development was incredible and the plot kept me engaged throughout. I couldn't put it down!",
  "rating": 5,
  "summary": "Highly enthusiastic review praising character development and engaging plot",
  "sentimentScore": 0.95,
  "tags": ["character-development", "engaging", "page-turner"]
}
```

**AI Processing:**
The API automatically processes reviews through Mastra AI with retry logic:

- Up to 3 retry attempts with exponential backoff
- Fallback values if AI processing fails
- Comprehensive error logging

**Status Codes:**

- `201 Created` - Review created successfully
- `400 Bad Request` - Validation errors
- `404 Not Found` - Book not found
- `500 Internal Server Error` - AI service unavailable after retries

---

### 4. Search Books and Reviews

**Endpoint:** `GET /search`

**Description:** Searches for books and reviews by keyword. The search looks through book titles, authors, descriptions, and review text.

**Query Parameters:**

- `query` (required) - Search term (cannot be empty)

**Request Example:**

```bash
# Search for books containing 'fantasy'
curl -X GET "http://localhost:3000/search?query=fantasy" \
  -H "Content-Type: application/json"

# Search with URL encoding for spaces
curl -X GET "http://localhost:3000/search?query=science%20fiction" \
  -H "Content-Type: application/json"
```

**Response Example:**

```json
{
  "query": "fantasy",
  "totalResults": 2,
  "books": [
    {
      "id": "book-uuid-1",
      "title": "The Lord of the Rings",
      "author": "J.R.R. Tolkien",
      "description": "Epic fantasy adventure in Middle-earth",
      "coverImageUrl": "https://example.com/lotr-cover.jpg",
      "matchType": "description"
    }
  ],
  "reviews": [
    {
      "id": "review-uuid-1",
      "bookId": "book-uuid-1",
      "reviewerName": "Jane Smith",
      "text": "Amazing fantasy world with incredible detail",
      "rating": 5,
      "summary": "Positive review of fantasy elements",
      "sentimentScore": 0.8,
      "tags": ["fantasy", "world-building"],
      "book": {
        "title": "The Lord of the Rings",
        "author": "J.R.R. Tolkien"
      },
      "matchType": "text"
    }
  ]
}
```

**Status Codes:**

- `200 OK` - Success (even if no results found)
- `400 Bad Request` - Empty or missing query parameter
- `500 Internal Server Error` - Search service error

---

## Error Examples

### Invalid Book ID

```bash
curl -X GET "http://localhost:3000/books/invalid-id" \
  -H "Content-Type: application/json"
```

**Response:**

```json
{
  "statusCode": 400,
  "message": "Validation failed (uuid is expected)",
  "error": "Bad Request"
}
```

### Missing Required Fields

```bash
curl -X POST "http://localhost:3000/books/67e4356b-294b-4951-91a9-0b24c4e1fc4f/reviews" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Short"
  }'
```

**Response:**

```json
{
  "statusCode": 400,
  "message": [
    "Review text must be at least 10 characters long",
    "Reviewer name is required",
    "Rating must be an integer"
  ],
  "error": "Bad Request"
}
```

### Empty Search Query

```bash
curl -X GET "http://localhost:3000/search?query=" \
  -H "Content-Type: application/json"
```

**Response:**

```json
{
  "statusCode": 400,
  "message": "Search query cannot be empty",
  "error": "Bad Request"
}
```

---

## Advanced Usage

### Pretty Print JSON with jq

```bash
# Install jq first: brew install jq (macOS) or apt-get install jq (Ubuntu)
curl -X GET "http://localhost:3000/books" \
  -H "Content-Type: application/json" | jq .
```

### Get First Book ID for Testing

```bash
FIRST_BOOK_ID=$(curl -s -X GET "http://localhost:3000/books" \
  -H "Content-Type: application/json" | jq -r '.[0].id')
echo "First book ID: $FIRST_BOOK_ID"
```

### Save Response to File

```bash
curl -X GET "http://localhost:3000/books" \
  -H "Content-Type: application/json" \
  -o books.json
```

### Verbose Output for Debugging

```bash
curl -v -X GET "http://localhost:3000/books" \
  -H "Content-Type: application/json"
```

### Performance Testing

```bash
curl -X GET "http://localhost:3000/books" \
  -w "\nHTTP Status: %{http_code}\nTotal Time: %{time_total}s\n" \
  -o /dev/null -s
```

---

## Rate Limiting

Currently, there are no rate limits implemented. However, the AI processing has built-in retry logic with exponential backoff to handle service unavailability.

## Logging

The API uses Winston logger with the following features:

- Structured JSON logging
- Daily log rotation
- Console and file output
- Different log levels (info, error, debug)
- Request/response logging

Log files are stored in the `logs/` directory with daily rotation.

## Health Check

To verify the API is running:

```bash
curl -X GET "http://localhost:3000/books" \
  -w "\nHTTP Status: %{http_code}\n" \
  -o /dev/null -s
```

A `200` status code indicates the API is healthy and the database is connected.

---

## Development Notes

- The API uses SQLite database with Prisma ORM
- AI processing is handled by Mastra AI integration
- Input validation uses class-validator decorators
- Error handling follows NestJS best practices
- CORS is enabled for cross-origin requests

## Support

For issues or questions, check the application logs in the `logs/` directory or review the console output when running in development mode.

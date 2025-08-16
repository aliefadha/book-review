# Full-Stack Take-Home Challenge — Book Review Platform with Mastra AI

## Overview

You will build a **Book Review Platform** where users can:

- **Browse** a list of books.
- **Submit reviews**, enriched by **Mastra AI** (auto-suggest tags, summarize review, analyze sentiment).
- **Search** for books and reviews.

The goal is to assess your ability to **learn and apply a new technology** (Mastra AI) within a full-stack JavaScript project.

---

## Technology Stack

You must use JavaScript/TypeScript-based technologies:

- **Backend**: Node.js with Express or NestJS
- **Database**: SQLite, PostgreSQL, or in-memory JSON
- **Frontend**: React (CRA, Vite, or Next.js)
- **AI Library**: [Mastra AI](https://mastra.ai/) integration
- **Testing**: Jest, React Testing Library, Cypress (optional for E2E)
- **Deployment**: Dockerfile or deployment instructions

---

## Features & Milestones

### 1. Data Model
- **Books**: `id`, `title`, `author`, `description`, `coverImageUrl`
- **Reviews**: `id`, `bookId`, `reviewerName`, `text`, `rating`
- AI-generated fields for each review:
  - `summary` (string)
  - `sentimentScore` (number or label)
  - `tags` (array of strings)

---

### 2. Backend API
Implement the following endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/books` | List all books |
| GET | `/books/:id` | Get a single book and its reviews |
| POST | `/books/:id/reviews` | Submit a review (with Mastra AI enrichment) |
| GET | `/search?query=` | Search for books or reviews |

**Requirements**:
- Input validation
- Error handling
- Mastra AI integration on review submission

---

### 3. Mastra AI Integration
When a review is submitted:

1. **Summarize** the review text.
2. **Analyze sentiment** and return sentiment score or label.
3. **Suggest tags** for the review.
4. Save AI-generated fields in the database.

---

### 4. Frontend
- **Book List Page**: grid display of books.
- **Book Detail Page**: book info and reviews.
- **Review Form**:
  - Inputs: name, rating (1–5), review text.
  - On submit: display AI-generated summary, sentiment, and tags.
- **Search Bar**: filter books or reviews.
- **Good UX**: loading states, error messages, form validation.

---

### 5. Testing
- **Backend**: Unit tests for endpoints and Mastra AI integration.
- **Frontend**: Basic tests (form submission, displaying AI results).
- Optional: E2E flows.

---

### 6. Documentation
Provide a clear **README** with:
- Setup and run instructions (include Mastra config keys or mock tokens).
- API endpoint definitions.
- Notes on technologies and design decisions.
- Testing and deployment commands.

---

## Optional Stretch Goals
- User accounts with authentication.
- Pagination for reviews.
- Debounced search.
- Docker support (`Dockerfile` + `docker-compose`).
- CI integration (GitHub Actions with linting, tests, build).
- Rate limiting or spam protection.

---

## Evaluation Criteria

| Area | What We Look For |
|------|------------------|
| **Architecture** | Modular, clean code with proper separation of concerns |
| **AI Integration** | Correct Mastra AI usage with robust error handling |
| **Testing** | Meaningful unit tests, passing builds |
| **UX Quality** | Responsive, user-friendly interface |
| **Documentation** | Clarity and completeness |
| **Adaptability** | Demonstrates ability to learn new tools |

---

## Timeline
- Recommended: **2–4 days**
- You are encouraged to **ask questions** if requirements are unclear.
- Optional: Midpoint check-in to review progress.

---

## Starter Template (Optional)
You may receive a boilerplate containing:
- `/api` (backend)
- `/client` (frontend)
- `.env.template` for environment variables
- Basic `npm` scripts for running and testing

---

**Good luck!**
We’re looking forward to seeing how you approach learning and implementing a new technology in a real-world JavaScript context.


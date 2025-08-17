# Book Review Platform with Mastra AI

A full-stack Book Review Platform that allows users to browse books, submit reviews, and leverage AI-powered review enhancement through Mastra AI integration.

## 🎯 Project Overview

This platform enables users to:

- **Browse** a curated list of books
- **Submit reviews** with AI-powered enhancements (auto-generated summaries, sentiment analysis, and tag suggestions)
- **Search** through books and reviews
- **Experience** modern, responsive UI with excellent UX

## 📊 Current Implementation Status

### ✅ Completed (Session 1)

- [x] **Project Setup**: NestJS backend with TypeScript
- [x] **Database Configuration**: SQLite with Prisma ORM
- [x] **Data Models**: Book and Review entities with AI fields
- [x] **Database Seeding**: Sample books for development
- [x] **Environment Configuration**: `.env` setup with Mastra API placeholders
- [x] **Basic Modules**: Books, Reviews, Mastra, and Prisma modules structure

### Completed Session 2: Basic API Endpoints

- [x] Implement GET `/books` endpoint
- [x] Implement GET `/books/:id` endpoint
- [x] Implement GET `/search` endpoint
- [x] Add input validation and error handling

### Completed Session 3: AI Integration

- [x] Implement POST `/books/:id/reviews` endpoint
- [x] Integrate Mastra AI for review enhancement
- [x] Add AI error handling and fallbacks

### 🚧 In Development

- [ ] **Frontend**: React application with modern UI
- [ ] **Testing**: Comprehensive unit and E2E tests
- [ ] **Documentation**: API documentation and deployment guides

## 🛠 Technology Stack

### Backend

- **Framework**: NestJS with TypeScript
- **Database**: SQLite with Prisma ORM
- **AI Integration**: Mastra AI for review enhancement
- **Logging**: Winston with daily rotation
- **Testing**: Jest for unit and E2E tests
- **Validation**: Class-validator and class-transformer

### Frontend (Planned)

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **Testing**: React Testing Library + Jest
- **Styling**: Modern CSS with responsive design

### Development Tools

- **Code Quality**: ESLint + Prettier
- **Type Safety**: TypeScript strict mode
- **Database Migrations**: Prisma migrations
- **Environment Management**: dotenv

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **npm**: v8 or higher
- **Git**: Latest version

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd book-review
```

### 2. Backend Setup

```bash
cd api
npm install
```

### 3. Environment Configuration

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Database
DATABASE_URL="file:./dev.db"

# Application
NODE_ENV=development
PORT=3000

# Mastra AI (get your API key from https://mastra.ai/)
MASTRA_API_KEY=your_mastra_api_key_here
MASTRA_BASE_URL=https://api.mastra.ai

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with sample data
npm run prisma:seed
```

### 5. Start Development Server

```bash
# Start in watch mode
npm run start:dev

# Or start normally
npm start
```

The API will be available at `http://localhost:3000`

## 🗄 Database Schema

### Book Model

```typescript
model Book {
  id            String @id @default(uuid())
  title         String
  author        String
  description   String
  coverImageUrl String
}
```

### Review Model

```typescript
model Review {
  id             String @id @default(uuid())
  bookId         String
  reviewerName   String
  text           String
  rating         Int
  summary        String        // AI-generated
  sentimentScore Float         // AI-generated
  tags           Json @default("[]") // AI-generated
}
```

## 🔌 API Documentation

### Planned Endpoints

| Method | Endpoint             | Description                           | Status     |
| ------ | -------------------- | ------------------------------------- | ---------- |
| GET    | `/books`             | List all books                        | 🚧 Planned |
| GET    | `/books/:id`         | Get book details with reviews         | 🚧 Planned |
| POST   | `/books/:id/reviews` | Submit a review (with AI enhancement) | 🚧 Planned |
| GET    | `/search?query=`     | Search books and reviews              | 🚧 Planned |

### Example API Responses

#### GET /books

```json
[
  {
    "id": "uuid",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "description": "A classic American novel...",
    "coverImageUrl": "https://example.com/cover.jpg"
  }
]
```

#### POST /books/:id/reviews

```json
{
  "id": "uuid",
  "bookId": "book-uuid",
  "reviewerName": "John Doe",
  "text": "Amazing book with great character development...",
  "rating": 5,
  "summary": "Positive review highlighting character development",
  "sentimentScore": 0.85,
  "tags": ["character-development", "classic", "recommended"]
}
```

## 🗺 Development Roadmap

### Session 4-6: Frontend Development (Planned)

- [ ] React application setup
- [ ] Book list and detail pages
- [ ] Review form with AI results display
- [ ] Search functionality

### Session 7-8: Testing (Planned)

- [ ] Backend unit and integration tests
- [ ] Frontend component tests
- [ ] E2E testing with Cypress

### Session 9: Documentation & Deployment (Planned)

- [ ] Complete documentation
- [ ] Deployment configuration
- [ ] Performance optimization

## 🧪 Testing

### Backend Testing

```bash
cd api

# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:cov
```

### Database Testing

```bash
# Reset test database
npx prisma migrate reset --force

# Seed test data
npm run prisma:seed
```

## 🔧 Available Scripts

### Backend (api/)

```bash
npm start          # Start production server
npm run start:dev  # Start development server with watch mode
npm run start:debug # Start with debug mode
npm run build      # Build for production
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
npm test           # Run tests
npm run test:e2e   # Run E2E tests
npm run test:cov   # Run tests with coverage
```

### Database

```bash
npx prisma generate    # Generate Prisma client
npx prisma migrate dev # Run migrations
npx prisma studio      # Open Prisma Studio
npm run prisma:seed    # Seed database
```

## 🌍 Environment Variables

| Variable                       | Description                  | Default                 | Required              |
| ------------------------------ | ---------------------------- | ----------------------- | --------------------- |
| `DATABASE_URL`                 | SQLite database path         | `file:./dev.db`         | Yes                   |
| `NODE_ENV`                     | Environment mode             | `development`           | No                    |
| `PORT`                         | Server port                  | `3000`                  | No                    |
| `MASTRA_API_KEY`               | Mastra AI API key            | -                       | Yes (for AI features) |
| `OPENAI_API_KEY`               | OpenAI API key               | -                       | Yes (for AI features) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Generative AI API key | -                       | Yes (for AI features) |
| `MASTRA_BASE_URL`              | Mastra AI base URL           | `https://api.mastra.ai` | No                    |
| `CORS_ORIGIN`                  | Allowed CORS origins         | `http://localhost:3000` | No                    |
| `LOG_LEVEL`                    | Logging level                | `debug`                 | No                    |

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Use ESLint and Prettier for code formatting
- Write tests for new features
- Update documentation for API changes
- Follow conventional commit messages

## 📝 Project Structure

```
book-review/
├── api/                    # Backend NestJS application
│   ├── src/
│   │   ├── books/         # Books module
│   │   ├── reviews/       # Reviews module
│   │   ├── mastra/        # Mastra AI integration
│   │   ├── prisma/        # Database service and seeding
│   │   └── common/        # Shared utilities
│   ├── prisma/            # Database schema and migrations
│   └── test/              # E2E tests
├── docs/                  # Project documentation
│   ├── fullstack_assessment.md
│   └── session_plan/      # Development session plans
└── README.md              # This file
```

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Review the documentation in the `docs/` folder
3. Create a new issue with detailed information

---

**Happy coding! 🚀**

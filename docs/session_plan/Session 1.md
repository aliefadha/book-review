# Session 1: Project Setup and Data Modeling (3 hours)

- [x] **NestJS Project Initialization:** Create a new NestJS project and set up modules for Books, Reviews, and Mastra AI integration.
- [x] **Database Configuration:** Install & configure SQLite/PostgreSQL with TypeORM or Prisma. Ensure connection is established.
- [x] **Define Data Models:** Create Book and Review entities with fields: Book (`id`, `title`, `author`, `description`, `coverImageUrl`), Review (`id`, `bookId`, `reviewerName`, `text`, `rating`, `summary`, `sentimentScore`, `tags`).
- [x] **Initial Data Seeding:** Add sample books for development & testing.
- [x] **Environment Setup:** Create `.env` for sensitive values (Mastra API key placeholder).
- [x] **Verify Setup:** Start NestJS app, check DB connection, and confirm seed data retrieval.

# Book Review Client

A React-based frontend application for the Book Review system built with Vite, TypeScript, and Material-UI.

## Environment Configuration

### Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration:
   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:3000
   
   # Development Configuration
   VITE_DEV_MODE=true
   ```

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000` | Yes |
| `VITE_DEV_MODE` | Enable development features | `true` | No |

### Configuration Files

- `.env` - Local environment variables (not committed to git)
- `.env.example` - Template file with example values
- `src/config/env.ts` - Environment configuration service

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on configured port

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see Environment Configuration above)

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

- 📚 Browse and search books
- 🔍 Advanced search with filters
- ⭐ View and manage book reviews
- 📱 Responsive design
- 🎨 Material-UI components
- ⚡ Fast development with Vite HMR

## Architecture

### Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API services
├── types/         # TypeScript type definitions
├── config/        # Configuration files
└── routes/        # Application routing
```

### Key Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material-UI** - Component library
- **React Router** - Client-side routing

## API Integration

The application communicates with the backend API through service modules:

- `bookService.ts` - Book-related operations
- `searchService.ts` - Search functionality

All API endpoints are configured through environment variables for easy deployment across different environments.

## Deployment

### Production Build

1. Set production environment variables
2. Build the application:
   ```bash
   npm run build
   ```
3. Deploy the `dist/` folder to your hosting service

### Environment-Specific Deployment

For different environments (staging, production), create corresponding `.env` files:

- `.env.staging`
- `.env.production`

Update the `VITE_API_BASE_URL` to point to the appropriate backend API.

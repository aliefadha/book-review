import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock fetch for API calls
global.fetch = vi.fn();

// Setup environment variables for tests
vi.mock('../config/env', () => ({
  config: {
    apiBaseUrl: 'http://localhost:3000',
    isDevelopment: true,
    isProduction: false,
  },
  apiEndpoints: {
    books: 'http://localhost:3000/books',
    search: 'http://localhost:3000/search',
    reviews: 'http://localhost:3000/reviews',
  },
  validateEnv: vi.fn(),
}));

// Mock MUI icons to prevent file limit issues
vi.mock('@mui/icons-material', () => ({
  Search: () => 'SearchIcon',
  Clear: () => 'ClearIcon',
  Star: () => 'StarIcon',
  StarBorder: () => 'StarBorderIcon',
  // Add other icons as needed
}));

vi.mock('@mui/icons-material/Search', () => ({
  default: () => 'SearchIcon',
}));

vi.mock('@mui/icons-material/Clear', () => ({
  default: () => 'ClearIcon',
}));


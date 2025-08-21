import { vi, expect } from 'vitest';
import type { Books } from '../types/book';
import type { Review } from '../services/searchService';

// Mock data factories
export const createMockBook = (overrides?: Partial<Books>): Books => ({
  id: 'test-book-1',
  title: 'Test Book Title',
  author: 'Test Author',
  description: 'This is a test book description for unit testing purposes.',
  coverImageUrl: 'https://example.com/test-cover.jpg',
  ...overrides,
});

export const createMockReview = (overrides?: Partial<Review>): Review => ({
  id: 'test-review-1',
  bookId: 'test-book-1',
  reviewerName: 'Test Reviewer',
  text: 'This is a test review for unit testing purposes.',
  rating: 4,
  summary: 'AI-generated test summary',
  sentimentScore: 0.7,
  tags: ['test', 'review'],
  book: {
    title: 'Test Book Title',
    author: 'Test Author',
  },
  matchType: 'text' as const,
  ...overrides,
});

// Mock fetch responses
export const mockFetchSuccess = (data: unknown) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => data,
  } as Response);
};

export const mockFetchError = (status = 500, message = 'Internal Server Error') => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: async () => ({ message }),
  } as Response);
};

// Wait for async operations
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

// Custom matchers
export const expectElementToBeVisible = (element: HTMLElement) => {
  expect(element).toBeInTheDocument();
  expect(element).toBeVisible();
};

export const expectElementToHaveText = (element: HTMLElement, text: string) => {
  expect(element).toBeInTheDocument();
  expect(element).toHaveTextContent(text);
};

// Re-export testing utilities
export { vi } from 'vitest';
export { default as userEvent } from '@testing-library/user-event';
export { render } from '@testing-library/react';
export { renderWithProviders } from './render';
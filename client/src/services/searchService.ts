import type { Books } from '../types/book';
import { apiEndpoints } from '../config/env';

export interface Review {
  id: string;
  bookId: string;
  reviewerName: string;
  text: string;
  rating: number;
  summary?: string;
  sentimentScore?: number;
  tags?: string[];
  book: {
    title: string;
    author: string;
  };
  matchType: 'text' | 'reviewer';
}

export interface SearchResult {
  query: string;
  totalResults: number;
  books: (Books & { matchType: 'title' | 'author' | 'description' })[];
  reviews: Review[];
}

export const searchAll = async (query: string): Promise<SearchResult> => {
  try {
    const response = await fetch(`${apiEndpoints.search}?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search');
    }
    return await response.json();
  } catch (error) {
    console.error('Search error:', error);
    // Return empty results on error
    return {
      query,
      totalResults: 0,
      books: [],
      reviews: []
    };
  }
};